// Pocketsflow Enterprise (`pf.enterprise.*`, /v1/enterprise): every method's
// route, method, query / body and the enterprise key, with fetch stubbed.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Pocketsflow, PocketsflowError } from '../dist/index.mjs';

const KEY = 'ek_live_0123456789abcdef';
const realFetch = globalThis.fetch;
let calls;
let nextBody;
let nextStatus;

beforeEach(() => {
  calls = [];
  nextBody = {};
  nextStatus = 200;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: new URL(url), method: init.method, body: init.body, headers: init.headers });
    return new Response(JSON.stringify(nextBody), { status: nextStatus });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const pf = () => new Pocketsflow({ apiKey: KEY, baseUrl: 'https://api.example.test' });
const only = () => {
  assert.equal(calls.length, 1);
  return calls[0];
};
const query = (call) => Object.fromEntries(call.url.searchParams);
const row = {
  userId: 'auth0|u1',
  name: 'Maya Chen',
  email: 'maya@example.com',
  subdomain: 'maya',
  createdAt: '2026-11-01T10:00:00.000Z',
  canSell: true,
  payoutsHeld: false,
  verification: 'verified',
  volumeUsd: 1840.5,
  transactions: 42,
  balanceUsd: null,
};

test('the enterprise key is sent as the bearer token', async () => {
  await pf().enterprise.subaccounts.list();
  assert.equal(only().headers.Authorization, `Bearer ${KEY}`);
});

test('subaccounts.list -> GET /v1/enterprise/subaccounts with search, filter and paging', async () => {
  nextBody = { items: [row], page: 2, pageSize: 50, total: 51 };
  const page = await pf().enterprise.subaccounts.list({ search: 'maya', filter: 'held', page: 2, pageSize: 50 });
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/subaccounts');
  assert.deepEqual(query(call), { search: 'maya', filter: 'held', page: '2', pageSize: '50' });
  assert.equal(call.body, undefined);
  assert.equal(page.items[0].userId, 'auth0|u1');
  assert.equal(page.total, 51);
});

test('subaccounts.list without params sends no query', async () => {
  await pf().enterprise.subaccounts.list();
  assert.equal(only().url.search, '');
});

test('subaccounts.get -> GET /v1/enterprise/subaccounts/{userId} (encoded)', async () => {
  nextBody = { profile: { userId: 'auth0|u1' }, stats: { volumeUsd: 10 }, partner: { error: 'x' } };
  const detail = await pf().enterprise.subaccounts.get('auth0|u1');
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/subaccounts/auth0%7Cu1');
  assert.equal(call.headers.Authorization, `Bearer ${KEY}`);
  assert.equal(detail.profile.userId, 'auth0|u1');
});

test('subaccounts.listProducts -> GET /v1/enterprise/subaccounts/{userId}/products with paging', async () => {
  nextBody = { items: [{ id: 'p1', name: 'Guide', priceUsd: 29, status: 'published', sales: 3 }], page: 1, pageSize: 10, total: 1 };
  const page = await pf().enterprise.subaccounts.listProducts('u1', { page: 1, pageSize: 10 });
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/subaccounts/u1/products');
  assert.deepEqual(query(call), { page: '1', pageSize: '10' });
  assert.equal(page.items[0].sales, 3);
});

test('subaccounts.getBalance -> GET /v1/enterprise/subaccounts/{userId}/balance', async () => {
  nextBody = {
    userId: 'u1',
    accountId: 'acct_1',
    status: 'active',
    balances: [{ currency: 'USD', available: '1250.00', pending: '80.00', usd: 1330 }],
  };
  const balance = await pf().enterprise.subaccounts.getBalance('u1');
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/subaccounts/u1/balance');
  assert.equal(balance.balances[0].available, '1250.00');
});

for (const [method, action] of [
  ['pause', 'pause'],
  ['unpause', 'unpause'],
  ['holdPayouts', 'hold-payouts'],
  ['releasePayouts', 'release-payouts'],
]) {
  test(`subaccounts.${method} -> POST /v1/enterprise/subaccounts/{userId}/${action} with the reason`, async () => {
    nextBody = row;
    const updated = await pf().enterprise.subaccounts[method]('u1', { reason: 'Chargeback review' });
    const call = only();
    assert.equal(call.method, 'POST');
    assert.equal(call.url.pathname, `/v1/enterprise/subaccounts/u1/${action}`);
    assert.deepEqual(JSON.parse(call.body), { reason: 'Chargeback review' });
    assert.equal(call.headers.Authorization, `Bearer ${KEY}`);
    assert.equal(call.headers['Content-Type'], 'application/json');
    assert.equal(updated.userId, 'auth0|u1');
  });

  test(`subaccounts.${method} without a reason sends an empty object`, async () => {
    await pf().enterprise.subaccounts[method]('u1');
    assert.deepEqual(JSON.parse(only().body), {});
  });
}

test('subaccounts.unpause 409 platform_hold throws a PocketsflowError with the code', async () => {
  nextStatus = 409;
  nextBody = { code: 'platform_hold', message: "This account is on hold by the platform, so it can't be resumed here." };
  await assert.rejects(pf().enterprise.subaccounts.unpause('u1'), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.status, 409);
    assert.equal(err.code, 'platform_hold');
    assert.match(err.message, /on hold by the platform/);
    return true;
  });
});

test('transactions.list -> GET /v1/enterprise/transactions with every filter', async () => {
  nextBody = { items: [], page: 1, pageSize: 25, total: 0 };
  await pf().enterprise.transactions.list({
    search: 'buyer@example.com',
    status: 'refunded',
    userId: 'u1',
    from: '2026-11-01',
    to: '2026-11-30',
    page: 3,
    pageSize: 100,
  });
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/transactions');
  assert.deepEqual(query(call), {
    search: 'buyer@example.com',
    status: 'refunded',
    userId: 'u1',
    from: '2026-11-01',
    to: '2026-11-30',
    page: '3',
    pageSize: '100',
  });
});

test('withdrawals.list -> GET /v1/enterprise/withdrawals with status, userId and paging', async () => {
  nextBody = { items: [{ id: 'w1', status: 'pending', amount: '500.00', currency: 'USD', usd: 500 }], page: 1, pageSize: 25, total: 1 };
  const page = await pf().enterprise.withdrawals.list({ status: 'pending', userId: 'u1', page: 1 });
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/withdrawals');
  assert.deepEqual(query(call), { status: 'pending', userId: 'u1', page: '1' });
  assert.equal(page.items[0].amount, '500.00');
});

test('withdrawals.approve -> POST /v1/enterprise/withdrawals/{id}/approve with no body', async () => {
  nextBody = { id: 'w1', status: 'paid', decidedBy: 'api_key:k1' };
  const res = await pf().enterprise.withdrawals.approve('w1');
  const call = only();
  assert.equal(call.method, 'POST');
  assert.equal(call.url.pathname, '/v1/enterprise/withdrawals/w1/approve');
  assert.equal(call.body, undefined);
  assert.equal(call.headers.Authorization, `Bearer ${KEY}`);
  assert.equal(res.status, 'paid');
});

test('withdrawals.approve 503 partner_unavailable throws with status and code', async () => {
  nextStatus = 503;
  nextBody = { code: 'partner_unavailable', message: 'The payout is taking longer than usual. Try approving again in a moment.' };
  await assert.rejects(pf().enterprise.withdrawals.approve('w1'), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.status, 503);
    assert.equal(err.code, 'partner_unavailable');
    return true;
  });
});

test('withdrawals.reject -> POST /v1/enterprise/withdrawals/{id}/reject with the reason', async () => {
  nextBody = { id: 'w1', status: 'rejected', reason: 'Duplicate request' };
  const res = await pf().enterprise.withdrawals.reject('w1', { reason: 'Duplicate request' });
  const call = only();
  assert.equal(call.method, 'POST');
  assert.equal(call.url.pathname, '/v1/enterprise/withdrawals/w1/reject');
  assert.deepEqual(JSON.parse(call.body), { reason: 'Duplicate request' });
  assert.equal(res.reason, 'Duplicate request');
});

test('withdrawals.reject without a reason sends an empty object', async () => {
  await pf().enterprise.withdrawals.reject('w1');
  assert.deepEqual(JSON.parse(only().body), {});
});

test('earnings.list -> GET /v1/enterprise/earnings with from, to and paging', async () => {
  nextBody = {
    totals: { accruedUsd: 120.5, settledUsd: 100, unsettledUsd: 20.5 },
    items: [{ id: 'e1', kind: 'sale', amountUsd: 1.5, rate: 0.015 }],
    settlements: [{ id: 's1', status: 'paid', method: 'wire' }],
    page: 1,
    pageSize: 25,
    total: 1,
  };
  const earnings = await pf().enterprise.earnings.list({ from: '2026-11-01', to: '2026-11-30', page: 1, pageSize: 25 });
  const call = only();
  assert.equal(call.method, 'GET');
  assert.equal(call.url.pathname, '/v1/enterprise/earnings');
  assert.deepEqual(query(call), { from: '2026-11-01', to: '2026-11-30', page: '1', pageSize: '25' });
  assert.equal(earnings.totals.unsettledUsd, 20.5);
  assert.equal(earnings.settlements[0].method, 'wire');
});

test('ids are encoded as one path segment', async () => {
  await pf().enterprise.withdrawals.approve('../subaccounts/u1/pause');
  assert.equal(only().url.pathname, '/v1/enterprise/withdrawals/..%2Fsubaccounts%2Fu1%2Fpause/approve');
});

test('a 401 for a creator key surfaces the API message', async () => {
  nextStatus = 401;
  nextBody = { code: 'unauthorized', message: 'Use an enterprise API key (ek_live_…).' };
  await assert.rejects(
    new Pocketsflow({ apiKey: 'pk_live_x', baseUrl: 'https://api.example.test' }).enterprise.earnings.list(),
    (err) => err instanceof PocketsflowError && err.status === 401 && err.code === 'unauthorized'
  );
});
