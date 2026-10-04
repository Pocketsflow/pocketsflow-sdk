// Webhook signature helpers, run against the built package (npm test builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';
import {
  verifyWebhookSignature,
  verifyWebhookSignatureV1,
  constructWebhookEvent,
  generateWebhookSignatureHeader,
  DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
  PocketsflowError,
} from '../dist/index.mjs';

const SECRET = 'test-signing-secret';
const BODY = JSON.stringify({
  id: 'evt_123',
  type: 'order.completed',
  created: 1_760_000_000,
  webhookId: '665f1c2a9b3e4a0012ab34cd',
  amount: 29.99,
});
const T = 1_760_000_000;

// Independent reference implementation of the documented scheme:
// t=<unix seconds>,v1=<hex HMAC-SHA256(secret, t + "." + rawBody)>
const hmac = (secret, content) => createHmac('sha256', secret).update(content).digest('hex');
const v2Header = (t, body = BODY, secret = SECRET) => `t=${t},v1=${hmac(secret, `${t}.${body}`)}`;

test('default tolerance is 300 seconds', () => {
  assert.equal(DEFAULT_WEBHOOK_TOLERANCE_SECONDS, 300);
});

test('V2: accepts a valid signature (string body)', () => {
  assert.equal(verifyWebhookSignature(BODY, v2Header(T), SECRET, { now: T }), true);
});

test('V2: accepts a valid signature (Buffer body)', () => {
  assert.equal(verifyWebhookSignature(Buffer.from(BODY), v2Header(T), SECRET, { now: T }), true);
});

test('V2: generateWebhookSignatureHeader matches the documented scheme', () => {
  assert.equal(generateWebhookSignatureHeader(BODY, SECRET, T), v2Header(T));
});

test('V2: accepts the array form of a header and the first of several v1 values', () => {
  const header = `t=${T},v1=${'0'.repeat(64)},v1=${hmac(SECRET, `${T}.${BODY}`)}`;
  assert.equal(verifyWebhookSignature(BODY, [header], SECRET, { now: T }), true);
});

test('V2: rejects a wrong secret', () => {
  assert.equal(verifyWebhookSignature(BODY, v2Header(T, BODY, 'other'), SECRET, { now: T }), false);
});

test('V2: rejects a modified body', () => {
  assert.equal(verifyWebhookSignature(BODY + ' ', v2Header(T), SECRET, { now: T }), false);
});

test('V2: rejects a signature whose t was changed (timestamp is signed)', () => {
  const sig = hmac(SECRET, `${T}.${BODY}`);
  assert.equal(verifyWebhookSignature(BODY, `t=${T + 1},v1=${sig}`, SECRET, { now: T }), false);
});

test('V2: tolerance boundary — 300s old passes, 301s old is stale', () => {
  assert.equal(verifyWebhookSignature(BODY, v2Header(T), SECRET, { now: T + 300 }), true);
  assert.equal(verifyWebhookSignature(BODY, v2Header(T), SECRET, { now: T + 301 }), false);
});

test('V2: rejects timestamps too far in the future', () => {
  assert.equal(verifyWebhookSignature(BODY, v2Header(T + 301), SECRET, { now: T }), false);
});

test('V2: custom tolerance', () => {
  assert.equal(
    verifyWebhookSignature(BODY, v2Header(T), SECRET, { now: T + 60, toleranceSeconds: 30 }),
    false
  );
  assert.equal(
    verifyWebhookSignature(BODY, v2Header(T), SECRET, { now: T + 3600, toleranceSeconds: Infinity }),
    true
  );
});

test('V2: uses the system clock by default', () => {
  const now = Math.floor(Date.now() / 1000);
  assert.equal(verifyWebhookSignature(BODY, v2Header(now), SECRET), true);
  assert.equal(verifyWebhookSignature(BODY, v2Header(now - 3600), SECRET), false);
});

test('V2: rejects missing / malformed headers without throwing', () => {
  for (const header of [
    undefined,
    null,
    '',
    'garbage',
    `t=${T}`,
    `v1=${hmac(SECRET, `${T}.${BODY}`)}`,
    `t=abc,v1=${hmac(SECRET, `${T}.${BODY}`)}`,
    `t=${T},v1=not-hex`,
    `t=${T},v1=${hmac(SECRET, `${T}.${BODY}`).slice(0, 63)}`,
  ]) {
    assert.equal(verifyWebhookSignature(BODY, header, SECRET, { now: T }), false, String(header));
  }
});

test('V2: rejects an empty secret', () => {
  assert.equal(verifyWebhookSignature(BODY, v2Header(T, BODY, ''), '', { now: T }), false);
});

test('V2: throws a helpful TypeError for a parsed (non-raw) body', () => {
  assert.throws(
    () => verifyWebhookSignature(JSON.parse(BODY), v2Header(T), SECRET, { now: T }),
    (err) => err instanceof TypeError && /raw request body/.test(err.message)
  );
});

test('V1 (legacy): still verifies hex HMAC-SHA256(secret, rawBody)', () => {
  const sig = hmac(SECRET, BODY);
  assert.equal(verifyWebhookSignatureV1(BODY, sig, SECRET), true);
  assert.equal(verifyWebhookSignatureV1(Buffer.from(BODY), sig.toUpperCase(), SECRET), true);
  assert.equal(verifyWebhookSignatureV1(BODY + 'x', sig, SECRET), false);
  assert.equal(verifyWebhookSignatureV1(BODY, hmac('other', BODY), SECRET), false);
  assert.equal(verifyWebhookSignatureV1(BODY, undefined, SECRET), false);
});

test('constructWebhookEvent: verifies V2 from a plain headers object (any case) and parses', () => {
  const event = constructWebhookEvent(
    Buffer.from(BODY),
    { 'X-Pocketsflow-Signature-V2': v2Header(T), 'X-Pocketsflow-Event-Id': 'evt_123' },
    SECRET,
    { now: T }
  );
  assert.equal(event.id, 'evt_123');
  assert.equal(event.type, 'order.completed');
  assert.equal(event.amount, 29.99);
});

test('constructWebhookEvent: works with a Fetch Headers object', () => {
  const headers = new Headers({ 'x-pocketsflow-signature-v2': v2Header(T) });
  assert.equal(constructWebhookEvent(BODY, headers, SECRET, { now: T }).webhookId, '665f1c2a9b3e4a0012ab34cd');
});

test('constructWebhookEvent: throws WEBHOOK_SIGNATURE_INVALID on a stale signature', () => {
  assert.throws(
    () => constructWebhookEvent(BODY, { 'x-pocketsflow-signature-v2': v2Header(T) }, SECRET, { now: T + 301 }),
    (err) => err instanceof PocketsflowError && err.code === 'WEBHOOK_SIGNATURE_INVALID'
  );
});

test('constructWebhookEvent: V1-only delivery is refused unless allowLegacySignature', () => {
  const headers = { 'x-pocketsflow-signature': hmac(SECRET, BODY) };
  assert.throws(
    () => constructWebhookEvent(BODY, headers, SECRET),
    (err) => err instanceof PocketsflowError && err.code === 'WEBHOOK_SIGNATURE_MISSING'
  );
  const event = constructWebhookEvent(BODY, headers, SECRET, { allowLegacySignature: true });
  assert.equal(event.id, 'evt_123');
});

test('CommonJS build exports the same helpers', () => {
  const require = createRequire(import.meta.url);
  const cjs = require('../dist/index.js');
  assert.equal(typeof cjs.verifyWebhookSignature, 'function');
  assert.equal(cjs.verifyWebhookSignature(BODY, v2Header(T), SECRET, { now: T }), true);
});
