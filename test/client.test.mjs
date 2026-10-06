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

test('images.upload sends multipart field `image` without a JSON content type', async () => {
  nextBody = { imageUrl: 'https://cdn.example.test/image.png' };
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const res = await pf().images.upload(png, { filename: 'cover.png', contentType: 'image/png' });
  const call = only();
  assert.equal(call.method, 'POST');
  assert.equal(call.url.pathname, '/images');
  assert.equal(call.headers.Authorization, 'Bearer pk_test_123');
  assert.equal(call.headers['Content-Type'], undefined);
  assert.ok(call.body instanceof FormData);
  const file = call.body.get('image');
  assert.equal(file.name, 'cover.png');
  assert.equal(file.type, 'image/png');
  assert.deepEqual(Buffer.from(await file.arrayBuffer()), png);
  assert.equal(res.imageUrl, 'https://cdn.example.test/image.png');
});

test('images.upload accepts a Blob as is', async () => {
  const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/webp' });
  await pf().images.upload(blob);
  const file = only().body.get('image');
  assert.equal(file.type, 'image/webp');
  assert.equal(file.name, 'image');
});

test('JSON requests keep the JSON content type', async () => {
  await pf().refunds.update('r1', { period: 30, periodType: 'days' });
  const call = only();
  assert.equal(call.method, 'POST');
  assert.equal(call.url.pathname, '/refunds/r1');
  assert.equal(call.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(call.body), { period: 30, periodType: 'days' });
});

test('discounts.apply encodes the code and checkProduct resolves to a boolean', async () => {
  nextBody = { _id: 'd1', code: 'SAVE 10' };
  const discount = await pf().discounts.apply('SAVE 10', 'p/1');
  assert.equal(calls[0].url.pathname, '/discounts/apply/SAVE%2010/p%2F1');
  assert.equal(discount._id, 'd1');

  nextBody = false;
  const has = await pf().discounts.checkProduct('p1');
  assert.equal(calls[1].url.pathname, '/discounts/check-product/p1');
  assert.equal(has, false);
});

test('creatorPage methods', async () => {
  const client = pf();
  await client.creatorPage.get();
  await client.creatorPage.create({ username: 'jane', creatorBio: 'Hi' });
  await client.creatorPage.update({ creatorBio: 'Hello' });
  await client.creatorPage.updateUsername('jane_doe');
  await client.creatorPage.checkUsername('jane_doe');
  await client.creatorPage.delete();
  assert.deepEqual(
    calls.map((c) => `${c.method} ${c.url.pathname}`),
    [
      'GET /creator-pages',
      'POST /creator-pages',
      'PUT /creator-pages',
      'PATCH /creator-pages/username',
      'GET /creator-pages/check-username/jane_doe',
      'DELETE /creator-pages',
    ]
  );
  assert.deepEqual(JSON.parse(calls[3].body), { username: 'jane_doe' });
});

test('newsletters.posts and newsletters.send', async () => {
  const client = pf();
  await client.newsletters.posts.list({ status: 'draft' });
  await client.newsletters.posts.create({ name: 'Launch', productIds: ['p1'] });
  await client.newsletters.posts.send('post1');
  await client.newsletters.send({ to: ['a@b.test', 'c@d.test'], subject: 'Hi', text: 'Hello' });
  await client.newsletters.subscribers.delete('s1');
  assert.deepEqual(
    calls.map((c) => `${c.method} ${c.url.pathname}`),
    [
      'GET /newsletters/posts',
      'POST /newsletters/posts',
      'POST /newsletters/posts/post1/send',
      'POST /newsletters/send',
      'DELETE /newsletters/subscribers/s1',
    ]
  );
  assert.equal(calls[0].url.searchParams.get('status'), 'draft');
  assert.deepEqual(JSON.parse(calls[3].body).to, ['a@b.test', 'c@d.test']);
});

test('partners list methods send page / limit', async () => {
  const client = pf();
  await client.partners.listReferrals({ page: 2, limit: 50 });
  await client.partners.listReferralSales({ limit: 10 });
  await client.partners.registerReferral('REF123');
  assert.equal(calls[0].url.pathname, '/partners/referrals');
  assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), { page: '2', limit: '50' });
  assert.equal(calls[1].url.pathname, '/partners/referrals/sales');
  assert.deepEqual(JSON.parse(calls[2].body), { referralCode: 'REF123' });
});

test('checkout.create sends clientReferenceId and lockEmail', async () => {
  nextBody = { id: 'cs_1', url: 'https://checkout.example.test/cs_1' };
  const session = await pf().checkout.create({
    productId: 'p1',
    customerEmail: 'a@b.test',
    lockEmail: true,
    clientReferenceId: 'ref-1',
  });
  const call = only();
  assert.equal(call.url.pathname, '/checkout/sessions');
  assert.deepEqual(JSON.parse(call.body), {
    productId: 'p1',
    customerEmail: 'a@b.test',
    lockEmail: true,
    clientReferenceId: 'ref-1',
  });
  assert.equal(session.url, 'https://checkout.example.test/cs_1');
});

test('subscriptionOffers.delete -> DELETE /subscriptions/{id}', async () => {
  nextBody = { message: 'Subscription deleted', id: 'o1' };
  const res = await pf().subscriptionOffers.delete('o1');
  assert.equal(only().method, 'DELETE');
  assert.equal(only().url.pathname, '/subscriptions/o1');
  assert.equal(res.id, 'o1');
});
