// Request routing of the resource methods, with fetch stubbed (no network).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Pocketsflow } from '../dist/index.mjs';

const realFetch = globalThis.fetch;
let calls;
let nextBody;

beforeEach(() => {
  calls = [];
  nextBody = {};
  globalThis.fetch = async (url, init) => {
    calls.push({ url: new URL(url), method: init.method, body: init.body, headers: init.headers });
    return new Response(JSON.stringify(nextBody), { status: 200 });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const pf = () => new Pocketsflow({ apiKey: 'pk_test_123', baseUrl: 'https://api.example.test' });
const only = () => {
  assert.equal(calls.length, 1);
  return calls[0];
};

test('webhooks.update uses PATCH /webhooks/{id} and unwraps { webhook }', async () => {
  nextBody = { webhook: { _id: 'wh_1', url: 'https://x.test/hook', active: false } };
  const webhook = await pf().webhooks.update('wh_1', { active: false });
  const call = only();
  assert.equal(call.method, 'PATCH');
  assert.equal(call.url.pathname, '/webhooks/wh_1');
  assert.deepEqual(JSON.parse(call.body), { active: false });
  assert.equal(call.headers.Authorization, 'Bearer pk_test_123');
  assert.equal(webhook._id, 'wh_1');
  assert.equal(webhook.active, false);
});

test('webhooks.list / get unwrap the API envelopes', async () => {
  nextBody = { webhooks: [{ _id: 'a' }, { _id: 'b' }] };
  const list = await pf().webhooks.list();
  assert.deepEqual(list.map((w) => w._id), ['a', 'b']);

  nextBody = { webhook: { _id: 'a', secret: 's' } };
  const one = await pf().webhooks.get('a');
  assert.equal(one.secret, 's');
  assert.equal(calls[1].method, 'GET');
  assert.equal(calls[1].url.pathname, '/webhooks/a');
});

test('webhooks.rotateSecret -> POST /webhooks/{id}/rotate-secret', async () => {
  nextBody = { id: 'wh_1', secret: 'new' };
  const res = await pf().webhooks.rotateSecret('wh_1');
  assert.equal(only().method, 'POST');
  assert.equal(only().url.pathname, '/webhooks/wh_1/rotate-secret');
  assert.equal(res.secret, 'new');
});

test('webhooks.test -> POST /webhooks/{id}/test', async () => {
  nextBody = { message: 'Test webhook sent', delivered: true, deliveryId: 'd1' };
  const res = await pf().webhooks.test('wh_1');
  assert.equal(only().method, 'POST');
  assert.equal(only().url.pathname, '/webhooks/wh_1/test');
  assert.equal(res.delivered, true);
});

test('webhooks.deliveries.list -> GET /delivered-webhooks with query params', async () => {
  nextBody = { deliveredWebhooks: [], pagination: { currentPage: 2 } };
  await pf().webhooks.deliveries.list({ page: 2, pageSize: 100, webhookId: 'wh_1', event: 'order.completed' });
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/delivered-webhooks');
  assert.deepEqual(Object.fromEntries(call.url.searchParams), {
    page: '2',
    pageSize: '100',
    webhookId: 'wh_1',
    event: 'order.completed',
  });
});

test('webhooks.deliveries.get / redeliver', async () => {
  nextBody = { deliveredWebhook: { _id: 'd1', eventId: 'evt_1' } };
  const delivery = await pf().webhooks.deliveries.get('d1');
  assert.equal(delivery.eventId, 'evt_1');
  assert.equal(calls[0].url.pathname, '/delivered-webhooks/d1');

  nextBody = { message: 'Webhook redelivered', delivered: true };
  await pf().webhooks.deliveries.redeliver('d1');
  assert.equal(calls[1].method, 'POST');
  assert.equal(calls[1].url.pathname, '/delivered-webhooks/d1/redeliver');
});

test('payments.list / get', async () => {
  await pf().payments.list({ type: 'subscription', pageSize: 50 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, '/payments');
  assert.equal(calls[0].url.searchParams.get('type'), 'subscription');

  await pf().payments.get('p1', { live: true });
  assert.equal(calls[1].url.pathname, '/payments/p1');
  assert.equal(calls[1].url.searchParams.get('live'), 'true');
});

test('subscribers.list / get / cancel / pause / resume', async () => {
  const client = pf();
  await client.subscribers.list({ status: 'active', subscriptionId: 's1' });
  await client.subscribers.get('sub1');
  await client.subscribers.cancel('mem_1');
  await client.subscribers.pause('mem_1');
  await client.subscribers.resume('mem_1');
  assert.deepEqual(
    calls.map((c) => `${c.method} ${c.url.pathname}`),
    [
      'GET /subscriptions/subscribers',
      'GET /subscriptions/subscribers/sub1',
      'POST /subscriptions/mem_1/cancel',
      'POST /subscriptions/mem_1/pause',
      'POST /subscriptions/mem_1/resume',
    ]
  );
  assert.equal(calls[0].url.searchParams.get('status'), 'active');
});

test('legacy subscriptions.cancel / refund keep their routes', async () => {
  const client = pf();
  await client.subscriptions.cancel('sub_123');
  await client.subscriptions.refund('sub_123');
  assert.deepEqual(
    calls.map((c) => `${c.method} ${c.url.pathname}`),
    ['POST /orders/subscriptions/cancel/sub_123', 'POST /orders/subscriptions/refund/sub_123']
  );
});

test('ids are encoded as a single path segment', async () => {
  await pf().webhooks.update('../users/me', { active: true });
  assert.equal(only().url.pathname, '/webhooks/..%2Fusers%2Fme');
});

test('no method calls a route removed from the public API', async () => {
  const removed = [/^\/webhooks\/send$/, /^\/test-sdk/, /^\/sales\/update-sale-by-id/];
  const client = pf();
  const id = 'x';
  const calls_ = [
    () => client.webhooks.list(),
    () => client.webhooks.get(id),
    () => client.webhooks.create({ url: 'https://x.test', events: ['order.completed'] }),
    () => client.webhooks.update(id, {}),
    () => client.webhooks.delete(id),
    () => client.webhooks.test(id),
    () => client.webhooks.rotateSecret(id),
    () => client.webhooks.deliveries.list(),
    () => client.webhooks.deliveries.get(id),
    () => client.webhooks.deliveries.redeliver(id),
  ];
  for (const call of calls_) await call();
  for (const c of calls) {
    for (const pattern of removed) assert.doesNotMatch(c.url.pathname, pattern);
    assert.notEqual(c.method, 'PUT');
  }
});
