// ============================================================================
// Webhook signature verification
// ============================================================================
//
// Every delivery carries two signatures over the same raw body:
//
// - `X-Pocketsflow-Signature-V2`: `t=<unix seconds>,v1=<hex HMAC-SHA256(secret,
//   t + "." + rawBody)>`. The timestamp is signed with the body, so a captured
//   delivery cannot be replayed once it falls outside the tolerance window.
//   Verify this one.
// - `X-Pocketsflow-Signature` (legacy): hex HMAC-SHA256(secret, rawBody). No
//   timestamp, so no replay protection. Kept so existing verifiers work.
//
// Always verify the raw request bytes, before any JSON parsing.

import { createHmac, timingSafeEqual } from 'crypto';
import { PocketsflowError, WebhookEventPayload } from './types';

/** Header carrying the timestamped (V2) signature. */
export const WEBHOOK_SIGNATURE_V2_HEADER = 'x-pocketsflow-signature-v2';
/** Header carrying the legacy (V1) signature. */
export const WEBHOOK_SIGNATURE_HEADER = 'x-pocketsflow-signature';
/** Header carrying the event id (`evt_…`), shared by retries of one delivery. */
export const WEBHOOK_EVENT_ID_HEADER = 'x-pocketsflow-event-id';
/** Header carrying the event type, e.g. `order.completed`. */
export const WEBHOOK_EVENT_HEADER = 'x-pocketsflow-event';
/** Default maximum age (and clock skew) of a V2 signature, in seconds. */
export const DEFAULT_WEBHOOK_TOLERANCE_SECONDS = 300;

/** The raw request body: the exact bytes Pocketsflow sent. */
export type WebhookPayload = string | Uint8Array;

/** Incoming request headers: a Node/Express-style object or a Fetch `Headers`. */
export type WebhookHeaders =
  | Record<string, string | string[] | undefined>
  | { get(name: string): string | null };

export interface VerifyWebhookSignatureOptions {
  /**
   * Reject signatures whose timestamp is more than this many seconds away from
   * now (in either direction). Defaults to 300. Pass `Infinity` to disable the
   * check (not recommended: it turns off replay protection).
   */
  toleranceSeconds?: number;
  /** Current time in Unix seconds. Defaults to the system clock; useful in tests. */
  now?: number;
}

export interface ConstructWebhookEventOptions extends VerifyWebhookSignatureOptions {
  /**
   * Accept a delivery that only carries the legacy `X-Pocketsflow-Signature`
   * header (no timestamp, so no replay protection). Defaults to `false`.
   */
  allowLegacySignature?: boolean;
}

const HEX = /^[0-9a-f]+$/i;

function assertPayload(payload: unknown): asserts payload is WebhookPayload {
  if (typeof payload !== 'string' && !(payload instanceof Uint8Array)) {
    throw new TypeError(
      'Webhook payload must be the raw request body as a string or Buffer, ' +
        'not a parsed object. Read the body before any JSON parsing ' +
        '(e.g. express.raw({ type: "application/json" })).'
    );
  }
}

function hmacHex(secret: string, parts: WebhookPayload[]): string {
  const hmac = createHmac('sha256', secret);
  for (const part of parts) hmac.update(part);
  return hmac.digest('hex');
}

/** Constant-time comparison of two hex digests. */
function safeEqualHex(expected: string, received: string): boolean {
  if (!HEX.test(received) || received.length !== expected.length) return false;
  return timingSafeEqual(
    Buffer.from(expected.toLowerCase(), 'utf8'),
    Buffer.from(received.toLowerCase(), 'utf8')
  );
}

function firstHeaderValue(value: string | string[] | null | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

function readHeader(headers: WebhookHeaders, name: string): string | undefined {
  if (typeof (headers as { get?: unknown }).get === 'function') {
    return firstHeaderValue((headers as { get(n: string): string | null }).get(name));
  }
  const record = headers as Record<string, string | string[] | undefined>;
  if (name in record) return firstHeaderValue(record[name]);
  const key = Object.keys(record).find((k) => k.toLowerCase() === name);
  return key ? firstHeaderValue(record[key]) : undefined;
}

/** Parse `t=<unix seconds>,v1=<hex>[,v1=<hex>…]`. Returns null when malformed. */
function parseSignatureV2Header(header: string): { timestamp: number; signatures: string[] } | null {
  let timestamp: number | undefined;
  const signatures: string[] = [];
  for (const item of header.split(',')) {
    const index = item.indexOf('=');
    if (index === -1) continue;
    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();
    if (key === 't') {
      if (!/^\d+$/.test(value)) return null;
      timestamp = Number(value);
    } else if (key === 'v1' && value) {
      signatures.push(value);
    }
  }
  if (timestamp === undefined || !Number.isSafeInteger(timestamp) || signatures.length === 0) {
    return null;
  }
  return { timestamp, signatures };
}

/**
 * Compute the `X-Pocketsflow-Signature-V2` header value for a payload. Use it
 * to build signed requests when testing your webhook handler.
 */
export function generateWebhookSignatureHeader(
  payload: WebhookPayload,
  secret: string,
  timestamp: number = Math.floor(Date.now() / 1000)
): string {
  assertPayload(payload);
  return `t=${timestamp},v1=${hmacHex(secret, [`${timestamp}.`, payload])}`;
}

/**
 * Verify an `X-Pocketsflow-Signature-V2` header against the raw request body.
 *
 * Returns `true` only when a `v1` signature matches HMAC-SHA256(secret,
 * `${t}.${rawBody}`) (compared in constant time) and `t` is within
 * `toleranceSeconds` (default 300) of now. Returns `false` for a missing,
 * malformed, wrong or stale signature.
 *
 * @example
 * app.post('/webhooks/pocketsflow', express.raw({ type: 'application/json' }), (req, res) => {
 *   const ok = verifyWebhookSignature(
 *     req.body,
 *     req.header('X-Pocketsflow-Signature-V2'),
 *     process.env.POCKETSFLOW_WEBHOOK_SECRET!
 *   );
 *   if (!ok) return res.sendStatus(400);
 *   const event = JSON.parse(req.body.toString('utf8'));
 *   // …
 *   res.sendStatus(200);
 * });
 */
export function verifyWebhookSignature(
  payload: WebhookPayload,
  signatureHeader: string | string[] | null | undefined,
  secret: string,
  options: VerifyWebhookSignatureOptions = {}
): boolean {
  assertPayload(payload);
  const header = firstHeaderValue(signatureHeader);
  if (!header || !secret) return false;

  const parsed = parseSignatureV2Header(header);
  if (!parsed) return false;

  const tolerance = options.toleranceSeconds ?? DEFAULT_WEBHOOK_TOLERANCE_SECONDS;
  const now = options.now ?? Math.floor(Date.now() / 1000);
  if (!(tolerance >= 0)) return false;
  if (Math.abs(now - parsed.timestamp) > tolerance) return false;

  const expected = hmacHex(secret, [`${parsed.timestamp}.`, payload]);
  return parsed.signatures.some((signature) => safeEqualHex(expected, signature));
}

/**
 * Verify a legacy `X-Pocketsflow-Signature` header: hex HMAC-SHA256(secret,
 * rawBody), compared in constant time. It carries no timestamp, so it cannot
 * stop replays — prefer `verifyWebhookSignature` (V2).
 */
export function verifyWebhookSignatureV1(
  payload: WebhookPayload,
  signatureHeader: string | string[] | null | undefined,
  secret: string
): boolean {
  assertPayload(payload);
  const signature = firstHeaderValue(signatureHeader)?.trim();
  if (!signature || !secret) return false;
  return safeEqualHex(hmacHex(secret, [payload]), signature);
}

/**
 * Verify a delivery from its raw body and headers, then parse it.
 *
 * Checks `X-Pocketsflow-Signature-V2` (see `verifyWebhookSignature`). Throws a
 * `PocketsflowError` with code `WEBHOOK_SIGNATURE_MISSING` or
 * `WEBHOOK_SIGNATURE_INVALID` when verification fails. Use the returned `id`
 * (also the `X-Pocketsflow-Event-Id` header) to de-duplicate retries.
 */
export function constructWebhookEvent<T extends WebhookEventPayload = WebhookEventPayload>(
  payload: WebhookPayload,
  headers: WebhookHeaders,
  secret: string,
  options: ConstructWebhookEventOptions = {}
): T {
  assertPayload(payload);
  const v2 = readHeader(headers, WEBHOOK_SIGNATURE_V2_HEADER);

  let verified: boolean;
  if (v2) {
    verified = verifyWebhookSignature(payload, v2, secret, options);
  } else if (options.allowLegacySignature) {
    const v1 = readHeader(headers, WEBHOOK_SIGNATURE_HEADER);
    if (!v1) {
      throw new PocketsflowError('No webhook signature header found', 'WEBHOOK_SIGNATURE_MISSING');
    }
    verified = verifyWebhookSignatureV1(payload, v1, secret);
  } else {
    throw new PocketsflowError(
      `Missing ${WEBHOOK_SIGNATURE_V2_HEADER} header`,
      'WEBHOOK_SIGNATURE_MISSING'
    );
  }

  if (!verified) {
    throw new PocketsflowError(
      'Webhook signature verification failed (wrong secret, modified body, or a timestamp outside the tolerance)',
      'WEBHOOK_SIGNATURE_INVALID'
    );
  }

  const text = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8');
  return JSON.parse(text) as T;
}
