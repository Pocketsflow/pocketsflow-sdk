// Upgrade playbook Phases 2–5 (newsletter, pricing, retention, courses,
// analytics, CRM, memberships, growth loops, A/B tests, loyalty, migrations),
// with fetch stubbed (no network).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  Pocketsflow,
  PocketsflowError,
  FeatureLockedError,
  WEBHOOK_EVENTS,
  constructWebhookEvent,
  generateWebhookSignatureHeader,
} from '../dist/index.mjs';

const realFetch = globalThis.fetch;
let calls;
let replies;

/** Queue the next responses: `{ status, body, text }` (defaults: 200 / `{}`). */
const reply = (...items) => replies.push(...items);

beforeEach(() => {
  calls = [];
  replies = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: new URL(url), method: init.method, body: init.body, headers: init.headers });
    const next = replies.shift() ?? {};
    if ('text' in next) return new Response(next.text, { status: next.status ?? 200 });
    const body = 'body' in next ? next.body : {};
    return new Response(JSON.stringify(body), { status: next.status ?? 200 });
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
const route = (c) => `${c.method} ${c.url.pathname}`;
const routes = () => calls.map(route);
const json = (c) => (c.body === undefined ? undefined : JSON.parse(c.body));
const query = (c) => Object.fromEntries(c.url.searchParams);

const locked = (feature, requiredPlan = 'tier2', requiredPlanName = 'Growth') => ({
  error: 'FEATURE_LOCKED',
  code: 'FEATURE_LOCKED',
  upgradeRequired: true,
  message: 'This feature is part of a higher plan. Please upgrade your plan to use it.',
  details: { feature, currentPlan: 'free', requiredPlan, requiredPlanName, requiredPlanPrice: 49, upgradeRequired: true },
});

// ---------------------------------------------------------------------------
// Paid newsletter, audiences, resends and subject tests
// ---------------------------------------------------------------------------

test('paidNewsletter get / update / stats / sync', async () => {
  const client = pf();
  reply({ body: { enabled: true, offers: [] } });
  const nl = await client.paidNewsletter.get();
  assert.equal(nl.enabled, true);
  await client.paidNewsletter.update({ enabled: true, monthlyOfferId: 'sub_1', title: 'Insider' });
  reply({ body: { paidSubscribers: 3, mrrCents: 2700 } });
  const stats = await client.paidNewsletter.stats();
  assert.equal(stats.mrrCents, 2700);
  reply({ body: { paid: 3, added: 1, untagged: 0 } });
  assert.deepEqual(await client.paidNewsletter.sync(), { paid: 3, added: 1, untagged: 0 });
  assert.deepEqual(routes(), [
    'GET /newsletters/paid',
    'PUT /newsletters/paid',
    'GET /newsletters/paid/stats',
    'POST /newsletters/paid/sync',
  ]);
  assert.deepEqual(json(calls[1]), { enabled: true, monthlyOfferId: 'sub_1', title: 'Insider' });
});

test('paidNewsletter.update with enabled: true below Growth -> FeatureLockedError', async () => {
  reply({ status: 403, body: locked('paidNewsletter') });
  await assert.rejects(pf().paidNewsletter.update({ enabled: true }), (err) => {
    assert.ok(err instanceof FeatureLockedError);
    assert.equal(err.feature, 'paidNewsletter');
    return true;
  });
});

test('posts.setAudience / resends / subject tests', async () => {
  const posts = pf().newsletters.posts;
  await posts.setAudience('post_1', { audience: 'paid', sendPreviewToFree: true });
  await posts.getResend('post_1');
  await posts.resendToNonOpeners('post_1', { subject: 'In case you missed it', delayHours: 24 });
  await posts.cancelResend('post_1');
  await posts.getSubjectTest('post_1');
  await posts.startSubjectTest('post_1', { subjectB: 'Option B', testPercent: 20, waitHours: 4 });
  assert.deepEqual(routes(), [
    'POST /newsletters/posts/post_1/audience',
    'GET /newsletters/posts/post_1/resend',
    'POST /newsletters/posts/post_1/resend',
    'DELETE /newsletters/posts/post_1/resend',
    'GET /newsletters/posts/post_1/subject-test',
    'POST /newsletters/posts/post_1/subject-test',
  ]);
  assert.deepEqual(json(calls[0]), { audience: 'paid', sendPreviewToFree: true });
  assert.deepEqual(json(calls[2]), { subject: 'In case you missed it', delayHours: 24 });
  assert.deepEqual(json(calls[5]), { subjectB: 'Option B', testPercent: 20, waitHours: 4 });
});

test('posts.create passes the segment and audience through', async () => {
  await pf().newsletters.posts.create({ name: 'Launch', segmentId: 'seg_1', audience: 'free', publishToWeb: true });
  assert.deepEqual(json(only()), { name: 'Launch', segmentId: 'seg_1', audience: 'free', publishToWeb: true });
});

// ---------------------------------------------------------------------------
// Segments
// ---------------------------------------------------------------------------

test('segments CRUD, preview, count and subscribers', async () => {
  const segments = pf().segments;
  const definition = { match: 'all', groups: [{ rules: [{ type: 'spent', op: 'gt', amountCents: 10000 }] }] };
  await segments.list({ page: 2, pageSize: 10 });
  await segments.create({ name: 'Big spenders', definition, smartTag: 'big-spender' });
  await segments.preview(definition);
  await segments.get('seg_1');
  await segments.update('seg_1', { name: 'Whales' });
  await segments.delete('seg_1');
  await segments.count('seg_1');
  await segments.listSubscribers('seg_1', { limit: 50, after: 'cur_1' });
  assert.deepEqual(routes(), [
    'GET /newsletters/segments',
    'POST /newsletters/segments',
    'POST /newsletters/segments/preview',
    'GET /newsletters/segments/seg_1',
    'POST /newsletters/segments/seg_1',
    'DELETE /newsletters/segments/seg_1',
    'GET /newsletters/segments/seg_1/count',
    'GET /newsletters/segments/seg_1/subscribers',
  ]);
  assert.deepEqual(query(calls[0]), { page: '2', pageSize: '10' });
  assert.deepEqual(json(calls[1]), { name: 'Big spenders', definition, smartTag: 'big-spender' });
  assert.deepEqual(json(calls[2]), { definition });
  assert.deepEqual(query(calls[7]), { limit: '50', after: 'cur_1' });
});

// ---------------------------------------------------------------------------
// Usage billing
// ---------------------------------------------------------------------------

test('usage.report sends the Idempotency-Key header and exposes replayed', async () => {
  reply({ status: 200, body: { usageRecord: { id: 'ur_1', meter: 'api_calls', quantity: 5 }, replayed: true } });
  const res = await pf().usage.report('mem_1', { meter: 'api_calls', quantity: 5, idempotencyKey: 'key-1' });
  const call = only();
  assert.equal(route(call), 'POST /subscriptions/mem_1/usage');
  assert.equal(call.headers['Idempotency-Key'], 'key-1');
  assert.deepEqual(json(call), { meter: 'api_calls', quantity: 5, idempotencyKey: 'key-1' });
  assert.equal(res.replayed, true);
});

test('usage.report without a key sends no Idempotency-Key header', async () => {
  await pf().usage.report('mem_1', { meter: 'api_calls', quantity: 1 });
  assert.equal(only().headers['Idempotency-Key'], undefined);
});

test('usage.get / subscriptions.updateSeats / updateUsagePricing', async () => {
  const client = pf();
  await client.usage.get('mem_1', { limit: 20 });
  await client.subscriptions.updateSeats('mem_1', { quantity: 5 });
  const usagePricing = { seats: { enabled: true, minSeats: 1 }, meters: [{ key: 'api_calls', name: 'API calls', pricing: 'per_unit', unitAmountCents: 1 }] };
  await client.subscriptions.updateUsagePricing('sub_1', usagePricing);
  assert.deepEqual(routes(), [
    'GET /subscriptions/mem_1/usage',
    'POST /subscriptions/mem_1/seats',
    'PUT /subscriptions/sub_1/usage-pricing',
  ]);
  assert.deepEqual(query(calls[0]), { limit: '20' });
  assert.deepEqual(json(calls[1]), { quantity: 5 });
  assert.deepEqual(json(calls[2]), usagePricing);
});

test('a usage 409 keeps its code and is not retried', async () => {
  reply({ status: 409, body: { code: 'IDEMPOTENCY_KEY_REUSED', message: 'Key reused with another body' } });
  await assert.rejects(pf().usage.report('mem_1', { meter: 'm', quantity: 1, idempotencyKey: 'k' }), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.status, 409);
    assert.equal(err.code, 'IDEMPOTENCY_KEY_REUSED');
    return true;
  });
  assert.equal(calls.length, 1);
});

// ---------------------------------------------------------------------------
// Payment plans, exit offers and launch pricing
// ---------------------------------------------------------------------------

test('products checkout offers: get / payment plan / exit offer, and the public read', async () => {
  const client = pf();
  await client.products.getCheckoutOffers('p1');
  reply({ body: { paymentPlan: { enabled: true, installments: 3, surchargePercent: 5 } } });
  const plan = await client.products.updatePaymentPlan('p1', { enabled: true, installments: 3, surchargePercent: 5 });
  assert.deepEqual(plan, { enabled: true, installments: 3, surchargePercent: 5 });
  await client.products.updateExitOffer('p1', { exitOffer: { enabled: true, valueType: 'percentage', value: 10 } });
  await client.checkoutOffers.get('p1');
  assert.deepEqual(routes(), [
    'GET /products/p1/checkout-offers',
    'PATCH /products/p1/payment-plan',
    'PATCH /products/p1/exit-offer',
    'GET /checkout-offers/p1',
  ]);
  assert.deepEqual(json(calls[2]), { exitOffer: { enabled: true, valueType: 'percentage', value: 10 } });
});

test('flashSales CRUD and the announcement', async () => {
  const sales = pf().flashSales;
  const body = { name: 'Black Friday', startsAt: '2026-11-27T00:00:00Z', endsAt: '2026-11-30T00:00:00Z', value: 30 };
  await sales.list({ status: 'live' });
  await sales.create(body);
  await sales.get('fs_1');
  await sales.update('fs_1', { value: 40 });
  await sales.delete('fs_1');
  await sales.createAnnouncement('fs_1', { url: 'https://x.test/sale' });
  assert.deepEqual(routes(), [
    'GET /flash-sales',
    'POST /flash-sales',
    'GET /flash-sales/fs_1',
    'PATCH /flash-sales/fs_1',
    'DELETE /flash-sales/fs_1',
    'POST /flash-sales/fs_1/announcement',
  ]);
  assert.deepEqual(query(calls[0]), { status: 'live' });
  assert.deepEqual(json(calls[1]), body);
  assert.deepEqual(json(calls[5]), { url: 'https://x.test/sale' });
});

test('fairPricing and per-product launch pricing', async () => {
  const client = pf();
  await client.fairPricing.get();
  await client.fairPricing.update({ enabled: true, tiers: { t4: 60 }, countryOverrides: { IN: 50 } });
  await client.fairPricing.analytics({ days: 90 });
  await client.pricing.listPriceSteps();
  await client.products.getLaunchPricing('p1');
  await client.products.setPriceSteps('p1', { enabled: true, steps: [{ price: 19, maxSales: 50 }, { price: 29 }] });
  await client.products.setFairPricing('p1', { mode: 'custom', tiers: { t1: 0 } });
  assert.deepEqual(routes(), [
    'GET /fair-pricing',
    'PUT /fair-pricing',
    'GET /fair-pricing/analytics',
    'GET /pricing/early-bird',
    'GET /products/p1/launch-pricing',
    'PUT /products/p1/price-steps',
    'PATCH /products/p1/fair-pricing',
  ]);
  assert.deepEqual(query(calls[2]), { days: '90' });
  assert.deepEqual(json(calls[6]), { mode: 'custom', tiers: { t1: 0 } });
});

test('pricing.quote joins orderBumpIds with commas and passes the A/B ids', async () => {
  await pf().pricing.quote('p1', { tz: 'Asia/Kolkata', billingCountry: 'IN', orderBumpIds: ['b1', 'b2'], vid: 'v1', abv: 'var_b' });
  const call = only();
  assert.equal(route(call), 'GET /pricing/quote/p1');
  assert.deepEqual(query(call), { tz: 'Asia/Kolkata', billingCountry: 'IN', orderBumpIds: 'b1,b2', vid: 'v1', abv: 'var_b' });
});

test('pricing.quote leaves an empty orderBumpIds out', async () => {
  await pf().pricing.quote('p1', { orderBumpIds: [] });
  assert.deepEqual(query(only()), {});
});

test('flashSales.create below Growth -> FeatureLockedError', async () => {
  reply({ status: 403, body: locked('flashSales') });
  await assert.rejects(
    pf().flashSales.create({ name: 'S', startsAt: '2026-11-01T00:00:00Z', endsAt: '2026-11-02T00:00:00Z', value: 10 }),
    FeatureLockedError
  );
});

// ---------------------------------------------------------------------------
// Courses and certificates
// ---------------------------------------------------------------------------

test('courses settings, quizzes, stats and certificate verification', async () => {
  const client = pf();
  const quiz = { passMark: 80, mustPass: true, questions: [{ prompt: '2+2?', options: [{ text: '4', correct: true }, { text: '5' }] }] };
  await client.courses.get('p1');
  await client.courses.update('p1', { lessons: [{ lessonId: 'les_1', drip: { type: 'afterDays', days: 7 } }], certificate: { enabled: true } });
  reply({}, { body: { quizzes: [{ lessonId: 'les_1', title: 'Intro', ...quiz }] } });
  await client.courses.upsertQuiz('p1', 'les_1', quiz);
  const quizzes = await client.courses.listQuizzes('p1');
  assert.equal(quizzes[0].lessonId, 'les_1');
  await client.courses.deleteQuiz('p1', 'les_1');
  await client.courses.stats('p1');
  await client.certificates.verify('7K2QX9MD4HTR');
  assert.deepEqual(routes(), [
    'GET /courses/p1',
    'PUT /courses/p1',
    'PUT /courses/p1/quizzes/les_1',
    'GET /courses/p1/quizzes',
    'DELETE /courses/p1/quizzes/les_1',
    'GET /courses/p1/stats',
    'GET /certificates/7K2QX9MD4HTR',
  ]);
  assert.deepEqual(json(calls[2]), quiz);
  assert.equal(json(calls[1]).lessons[0].drip.days, 7);
});

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

test('analytics reports send their range and options as query params', async () => {
  const a = pf().analytics;
  const range = { from: '2026-09-01T00:00:00Z', to: '2026-09-30', timezoneOffsetMinutes: -120 };
  await a.preview(range);
  await a.summary(range);
  await a.funnel(range);
  await a.revenueBySource({ ...range, dimension: 'utm_campaign' });
  await a.cohorts({ months: 6 });
  await a.netRevenue({ groupBy: 'country' });
  await a.mrr({ subscriptionId: 'sub_1' });
  assert.deepEqual(routes(), [
    'GET /analytics/preview',
    'GET /analytics/advanced/summary',
    'GET /analytics/advanced/funnel',
    'GET /analytics/advanced/sources',
    'GET /analytics/advanced/cohorts',
    'GET /analytics/advanced/net-revenue',
    'GET /analytics/mrr',
  ]);
  assert.deepEqual(query(calls[0]), { from: '2026-09-01T00:00:00Z', to: '2026-09-30', timezoneOffsetMinutes: '-120' });
  assert.equal(query(calls[3]).dimension, 'utm_campaign');
  assert.deepEqual(query(calls[4]), { months: '6' });
  assert.deepEqual(query(calls[5]), { groupBy: 'country' });
  assert.deepEqual(query(calls[6]), { subscriptionId: 'sub_1' });
});

test('analytics.mrr below Pro -> FeatureLockedError', async () => {
  reply({ status: 403, body: locked('mrrReports', 'tier3', 'Pro') });
  await assert.rejects(pf().analytics.mrr(), (err) => err instanceof FeatureLockedError && err.requiredPlanName === 'Pro');
});

// ---------------------------------------------------------------------------
// Unique coupons and personal deadlines
// ---------------------------------------------------------------------------

test('discounts.apply passes email and reservation for one-time codes', async () => {
  reply({ body: { _id: 'd1', code: 'VIP', uniqueCode: { code: 'VIP-7KQ2MX9D', expiresAt: '2026-10-20T00:00:00Z', emailBound: true } } });
  const res = await pf().discounts.apply('VIP-7KQ2MX9D', 'p1', { email: 'a@b.test', reservation: 'tok_1' });
  const call = only();
  assert.equal(route(call), 'GET /discounts/apply/VIP-7KQ2MX9D/p1');
  assert.deepEqual(query(call), { email: 'a@b.test', reservation: 'tok_1' });
  assert.equal(res.uniqueCode.emailBound, true);
});

test('discounts.apply without options sends no query', async () => {
  await pf().discounts.apply('CODE', 'p1');
  assert.deepEqual(query(only()), {});
});

test('discounts unique codes: list / create / export (CSV text)', async () => {
  const client = pf();
  await client.discounts.listUniqueCodes('d1', { status: 'active', limit: 100, before: 'cur_1' });
  await client.discounts.createUniqueCodes('d1', { emails: ['a@b.test'], expiresInHours: 72 });
  reply({ text: 'code,email,status\nVIP-1,a@b.test,active\n' });
  const csv = await client.discounts.exportUniqueCodes('d1', { status: 'active' });
  assert.deepEqual(routes(), [
    'GET /discounts/d1/unique-codes',
    'POST /discounts/d1/unique-codes',
    'GET /discounts/d1/unique-codes/export',
  ]);
  assert.deepEqual(query(calls[0]), { status: 'active', limit: '100', before: 'cur_1' });
  assert.deepEqual(json(calls[1]), { emails: ['a@b.test'], expiresInHours: 72 });
  assert.equal(typeof csv, 'string');
  assert.ok(csv.startsWith('code,email,status'));
});

test('personalDeadlines CRUD, entries, start, link and the public offer', async () => {
  const d = pf().personalDeadlines;
  const body = { name: '72h offer', productId: 'p1', offer: { type: 'percentage', value: 30 }, trigger: { type: 'audience_joined' } };
  reply({ body: [] });
  assert.deepEqual(await d.list(), []);
  await d.create(body);
  await d.get('pd_1');
  await d.update('pd_1', { durationHours: 48 });
  await d.delete('pd_1');
  await d.listEntries('pd_1', { status: 'active', limit: 10 });
  await d.start('pd_1', { email: 'a@b.test' });
  await d.getLink('pd_1', { email: 'a@b.test' });
  await d.getPublicOffer({ productId: 'p1', sid: 'sid_1' });
  assert.deepEqual(routes(), [
    'GET /personal-deadlines',
    'POST /personal-deadlines',
    'GET /personal-deadlines/pd_1',
    'POST /personal-deadlines/pd_1',
    'DELETE /personal-deadlines/pd_1',
    'GET /personal-deadlines/pd_1/entries',
    'POST /personal-deadlines/pd_1/start',
    'GET /personal-deadlines/pd_1/link',
    'GET /personal-deadlines/public/offer',
  ]);
  assert.deepEqual(json(calls[1]), body);
  assert.deepEqual(json(calls[6]), { email: 'a@b.test' });
  assert.deepEqual(query(calls[7]), { email: 'a@b.test' });
  assert.deepEqual(query(calls[8]), { productId: 'p1', sid: 'sid_1' });
});

// ---------------------------------------------------------------------------
// Subscription retention
// ---------------------------------------------------------------------------

test('retention reports, settings and per-offer config', async () => {
  const r = pf().retention;
  await r.recoverySummary({ days: 30 });
  await r.listAtRisk({ status: 'open', page: 1, pageSize: 25 });
  await r.getRecoverySettings();
  await r.updateRecoverySettings({ enabled: true, finalAction: 'pause' });
  await r.saveOffersReport({ days: 90 });
  await r.introReport();
  await r.listOffers();
  await r.getOffer('sub_1');
  await r.updateOffer('sub_1', { saveOffers: { enabled: true, discountPercent: 30 } });
  assert.deepEqual(routes(), [
    'GET /subscription-retention/recovery/summary',
    'GET /subscription-retention/recovery/at-risk',
    'GET /subscription-retention/recovery/settings',
    'PUT /subscription-retention/recovery/settings',
    'GET /subscription-retention/save-offers/report',
    'GET /subscription-retention/intro/report',
    'GET /subscription-retention/offers',
    'GET /subscription-retention/offers/sub_1',
    'PUT /subscription-retention/offers/sub_1',
  ]);
  assert.deepEqual(query(calls[1]), { status: 'open', page: '1', pageSize: '25' });
  assert.deepEqual(json(calls[3]), { enabled: true, finalAction: 'pause' });
  assert.deepEqual(json(calls[8]), { saveOffers: { enabled: true, discountPercent: 30 } });
});

test('an invalid retention config keeps code and field on the error', async () => {
  reply({ status: 400, body: { code: 'INVALID_RETENTION_CONFIG', field: 'intro.price', message: 'Intro price must be below the regular price' } });
  await assert.rejects(pf().retention.updateOffer('sub_1', { intro: { enabled: true, price: 99 } }), (err) => {
    assert.equal(err.code, 'INVALID_RETENTION_CONFIG');
    assert.equal(err.body.field, 'intro.price');
    return true;
  });
});

// ---------------------------------------------------------------------------
// Bundles, tiered discounts, delivery protection
// ---------------------------------------------------------------------------

test('bundles and tieredDiscounts unwrap their envelopes', async () => {
  const client = pf();
  reply(
    { body: { bundles: [{ productId: 'p1' }] } },
    { body: { bundle: { productId: 'p1', productIds: [] } } },
    { body: { bundle: { productId: 'p1', productIds: ['p2', 'p3'] } } },
    { body: { bundle: { productId: 'p1', productIds: [] } } },
    { body: { tieredDiscounts: { enabled: false, tiers: [] } } },
    { body: { tieredDiscounts: { enabled: true, tiers: [{ minItems: 2, percentOff: 10 }] } } },
    { body: { tieredDiscounts: { enabled: false, tiers: [] } } }
  );
  assert.equal((await client.bundles.list())[0].productId, 'p1');
  assert.deepEqual((await client.bundles.get('p1')).productIds, []);
  assert.deepEqual((await client.bundles.update('p1', { productIds: ['p2', 'p3'] })).productIds, ['p2', 'p3']);
  await client.bundles.delete('p1');
  assert.equal((await client.tieredDiscounts.get()).enabled, false);
  assert.equal((await client.tieredDiscounts.update({ enabled: true, tiers: [{ minItems: 2, percentOff: 10 }] })).enabled, true);
  await client.tieredDiscounts.delete();
  assert.deepEqual(routes(), [
    'GET /bundles',
    'GET /bundles/p1',
    'PUT /bundles/p1',
    'DELETE /bundles/p1',
    'GET /tiered-discounts',
    'PUT /tiered-discounts',
    'DELETE /tiered-discounts',
  ]);
  assert.deepEqual(json(calls[2]), { productIds: ['p2', 'p3'] });
});

test('limited drops, PDF stamping, download limits and order downloads', async () => {
  const client = pf();
  reply(
    { body: { limitedDrop: { enabled: true, quantity: 100, remaining: 40 } } },
    { body: { limitedDrop: { enabled: true, quantity: 50 } } },
    { body: { enabled: true, remaining: 40, soldOut: false } },
    { body: { pdfStamping: { enabled: false } } },
    { body: { pdfStamping: { enabled: true } } },
    { body: { downloadLimits: { enabled: false } } },
    { body: { downloadLimits: { enabled: true, maxDownloads: 5 } } },
    { body: { downloads: { limited: true, remaining: 2 } } },
    { body: { downloads: { limited: true, remaining: 5 } } }
  );
  assert.equal((await client.products.getLimitedDrop('p1')).remaining, 40);
  assert.equal((await client.products.updateLimitedDrop('p1', { enabled: true, quantity: 50 })).quantity, 50);
  assert.equal((await client.products.getDropAvailability('p1')).soldOut, false);
  assert.equal((await client.products.getPdfStamping('p1')).enabled, false);
  assert.equal((await client.products.updatePdfStamping('p1', { enabled: true })).enabled, true);
  assert.equal((await client.products.getDownloadLimits('p1')).enabled, false);
  assert.equal((await client.products.updateDownloadLimits('p1', { enabled: true, maxDownloads: 5 })).maxDownloads, 5);
  assert.equal((await client.orders.getDownloads('o1')).remaining, 2);
  assert.equal((await client.orders.resetDownloads('o1')).remaining, 5);
  assert.deepEqual(routes(), [
    'GET /products/p1/limited-drop',
    'PATCH /products/p1/limited-drop',
    'GET /products/p1/drop',
    'GET /products/p1/pdf-stamping',
    'PATCH /products/p1/pdf-stamping',
    'GET /products/p1/download-limits',
    'PATCH /products/p1/download-limits',
    'GET /orders/o1/downloads',
    'POST /orders/o1/downloads/reset',
  ]);
  assert.deepEqual(json(calls[1]), { enabled: true, quantity: 50 });
  assert.deepEqual(json(calls[6]), { enabled: true, maxDownloads: 5 });
});

// ---------------------------------------------------------------------------
// Revenue splits
// ---------------------------------------------------------------------------

test('revenueSplits owner and co-creator methods', async () => {
  const s = pf().revenueSplits;
  reply({ body: { splits: [{ id: 'sp_1' }] } });
  assert.equal((await s.list({ productId: 'p1', status: 'active' }))[0].id, 'sp_1');
  await s.create({ productId: 'p1', email: 'co@b.test', sharePercent: 30 });
  await s.get('sp_1');
  await s.remove('sp_1');
  await s.resend('sp_1');
  await s.product('p1');
  await s.sales({ productId: 'p1', limit: 20, cursor: 'c1' });
  await s.sale('o1');
  reply({ body: { invites: [{ id: 'sp_2' }] } });
  assert.equal((await s.invites())[0].id, 'sp_2');
  await s.accept('sp_2');
  await s.decline('sp_2');
  await s.earnings({ limit: 50 });
  assert.deepEqual(routes(), [
    'GET /revenue-splits',
    'POST /revenue-splits',
    'GET /revenue-splits/sp_1',
    'DELETE /revenue-splits/sp_1',
    'POST /revenue-splits/sp_1/resend',
    'GET /revenue-splits/products/p1',
    'GET /revenue-splits/sales',
    'GET /revenue-splits/sales/o1',
    'GET /revenue-splits/invites',
    'POST /revenue-splits/invites/sp_2/accept',
    'POST /revenue-splits/invites/sp_2/decline',
    'GET /revenue-splits/earnings',
  ]);
  assert.deepEqual(query(calls[0]), { productId: 'p1', status: 'active' });
  assert.deepEqual(json(calls[1]), { productId: 'p1', email: 'co@b.test', sharePercent: 30 });
  assert.deepEqual(query(calls[6]), { productId: 'p1', limit: '20', cursor: 'c1' });
});

// ---------------------------------------------------------------------------
// Signup forms, testimonials, attribution survey
// ---------------------------------------------------------------------------

test('signupForms owner and public methods', async () => {
  const f = pf().signupForms;
  reply({ body: { forms: [{ _id: 'f1' }] } });
  assert.equal((await f.list({ archived: true }))[0]._id, 'f1');
  await f.create({ name: 'Footer', type: 'popup', trigger: { exitIntent: true } });
  await f.get('f1');
  await f.update('f1', { status: 'paused' });
  await f.delete('f1');
  await f.getPublic('f1');
  await f.subscribe('f1', { email: 'a@b.test', name: 'Ana', elapsedMs: 4200 });
  assert.deepEqual(routes(), [
    'GET /forms',
    'POST /forms',
    'GET /forms/f1',
    'PATCH /forms/f1',
    'DELETE /forms/f1',
    'GET /forms/public/f1',
    'POST /forms/public/f1/subscribe',
  ]);
  assert.deepEqual(query(calls[0]), { archived: 'true' });
  assert.deepEqual(json(calls[1]), { name: 'Footer', type: 'popup', trigger: { exitIntent: true } });
  assert.deepEqual(json(calls[6]), { email: 'a@b.test', name: 'Ana', elapsedMs: 4200 });
});

test('signupForms.list without archived sends no query', async () => {
  await pf().signupForms.list();
  assert.deepEqual(query(only()), {});
});

test('testimonials and attributionSurvey', async () => {
  const client = pf();
  await client.testimonials.list({ status: 'featured', productId: 'p1', page: 2, pageSize: 10 });
  await client.testimonials.get('t1');
  await client.testimonials.moderate('t1', { featured: true });
  reply({ body: { settings: { requestEnabled: true, delayDays: 7 } } }, { body: { settings: { requestEnabled: false } } });
  assert.equal((await client.testimonials.getSettings()).delayDays, 7);
  assert.equal((await client.testimonials.updateSettings({ requestEnabled: false })).requestEnabled, false);
  await client.testimonials.wall('p1');
  reply({ body: { survey: { enabled: true, options: [] } } }, { body: { survey: { enabled: false } } });
  assert.equal((await client.attributionSurvey.get()).enabled, true);
  assert.equal((await client.attributionSurvey.update({ enabled: false })).enabled, false);
  await client.attributionSurvey.report({ startDate: '2026-09-01', endDate: '2026-09-30', timezoneOffsetMinutes: 0 });
  assert.deepEqual(routes(), [
    'GET /testimonials',
    'GET /testimonials/t1',
    'PATCH /testimonials/t1',
    'GET /testimonials/settings',
    'PUT /testimonials/settings',
    'GET /testimonials/public/products/p1',
    'GET /attribution-survey/settings',
    'PUT /attribution-survey/settings',
    'GET /attribution-survey/report',
  ]);
  assert.deepEqual(query(calls[0]), { status: 'featured', productId: 'p1', page: '2', pageSize: '10' });
  assert.deepEqual(json(calls[2]), { featured: true });
  assert.deepEqual(query(calls[8]), { startDate: '2026-09-01', endDate: '2026-09-30', timezoneOffsetMinutes: '0' });
});

// ---------------------------------------------------------------------------
// Customer CRM and benchmarks
// ---------------------------------------------------------------------------

test('customers CRM methods', async () => {
  const c = pf().customers;
  await c.listProfiles({ sort: 'orders', tag: 'vip', minLtvCents: 10000, limit: 25, after: 'cur_1' });
  reply({ body: { tags: ['vip', 'wholesale'] } });
  assert.deepEqual(await c.listTags(), ['vip', 'wholesale']);
  await c.getProfile('cus_1');
  reply({ body: { data: [{ _id: 'n1', body: 'Called' }] } });
  assert.equal((await c.listNotes('cus_1'))[0].body, 'Called');
  await c.addNote('cus_1', { body: 'Sent a gift' });
  await c.deleteNote('cus_1', 'n1');
  reply({ body: { tags: ['vip'] } });
  assert.deepEqual(await c.setTags('cus_1', { tags: ['VIP'] }), ['vip']);
  assert.deepEqual(routes(), [
    'GET /customers/profiles',
    'GET /customers/profiles/tags',
    'GET /customers/cus_1/profile',
    'GET /customers/cus_1/notes',
    'POST /customers/cus_1/notes',
    'DELETE /customers/cus_1/notes/n1',
    'PUT /customers/cus_1/tags',
  ]);
  assert.deepEqual(query(calls[0]), { sort: 'orders', tag: 'vip', minLtvCents: '10000', limit: '25', after: 'cur_1' });
  assert.deepEqual(json(calls[4]), { body: 'Sent a gift' });
  assert.deepEqual(json(calls[6]), { tags: ['VIP'] });
});

test('benchmarks.get and its Pro lock', async () => {
  reply({ body: { status: 'ready', metrics: [] } }, { status: 403, body: locked('benchmarks', 'tier3', 'Pro') });
  const client = pf();
  assert.equal((await client.benchmarks.get()).status, 'ready');
  await assert.rejects(client.benchmarks.get(), (err) => err instanceof FeatureLockedError && err.feature === 'benchmarks');
  assert.deepEqual(routes(), ['GET /benchmarks', 'GET /benchmarks']);
});

// ---------------------------------------------------------------------------
// Memberships
// ---------------------------------------------------------------------------

test('memberships, members and bans', async () => {
  const m = pf().memberships;
  reply({ body: { memberships: [{ _id: 'ms_1' }] } });
  assert.equal((await m.list())[0]._id, 'ms_1');
  await m.create({ name: 'Inner circle', offerIds: ['sub_1'], communityEnabled: true });
  await m.get('ms_1');
  await m.update('ms_1', { archived: true });
  await m.delete('ms_1');
  await m.listMembers('ms_1', { status: 'banned', q: 'ana', page: 2 });
  await m.banMember({ email: 'troll@b.test', reason: 'spam', hideContent: true });
  await m.unbanMember({ email: 'troll@b.test' });
  assert.deepEqual(routes(), [
    'GET /memberships',
    'POST /memberships',
    'GET /memberships/ms_1',
    'PUT /memberships/ms_1',
    'DELETE /memberships/ms_1',
    'GET /memberships/ms_1/members',
    'POST /memberships/members/ban',
    'POST /memberships/members/unban',
  ]);
  assert.deepEqual(json(calls[1]), { name: 'Inner circle', offerIds: ['sub_1'], communityEnabled: true });
  assert.deepEqual(query(calls[5]), { status: 'banned', q: 'ana', page: '2' });
  assert.deepEqual(json(calls[6]), { email: 'troll@b.test', reason: 'spam', hideContent: true });
});

test('membership posts, threads and replies', async () => {
  const m = pf().memberships;
  await m.posts.list('ms_1', { page: 2 });
  await m.posts.create('ms_1', { title: 'Welcome', html: '<p>Hi</p>', status: 'published', notify: true });
  await m.posts.get('ms_1', 'po_1');
  await m.posts.update('ms_1', 'po_1', { pinned: true });
  await m.posts.delete('ms_1', 'po_1');
  await m.threads.list('ms_1', { filter: 'hidden' });
  await m.threads.create('ms_1', { title: 'Intros', body: 'Say hi' });
  await m.threads.get('ms_1', 'th_1', { page: 3 });
  await m.threads.moderate('ms_1', 'th_1', { locked: true });
  await m.threads.reply('ms_1', 'th_1', { body: 'Welcome!' });
  await m.threads.delete('ms_1', 'th_1');
  await m.replies.moderate('ms_1', 're_1', { hidden: true });
  await m.replies.delete('ms_1', 're_1');
  assert.deepEqual(routes(), [
    'GET /memberships/ms_1/posts',
    'POST /memberships/ms_1/posts',
    'GET /memberships/ms_1/posts/po_1',
    'PUT /memberships/ms_1/posts/po_1',
    'DELETE /memberships/ms_1/posts/po_1',
    'GET /memberships/ms_1/threads',
    'POST /memberships/ms_1/threads',
    'GET /memberships/ms_1/threads/th_1',
    'PATCH /memberships/ms_1/threads/th_1',
    'POST /memberships/ms_1/threads/th_1/replies',
    'DELETE /memberships/ms_1/threads/th_1',
    'PATCH /memberships/ms_1/replies/re_1',
    'DELETE /memberships/ms_1/replies/re_1',
  ]);
  assert.deepEqual(query(calls[0]), { page: '2' });
  assert.deepEqual(json(calls[1]), { title: 'Welcome', html: '<p>Hi</p>', status: 'published', notify: true });
  assert.deepEqual(query(calls[5]), { filter: 'hidden' });
  assert.deepEqual(query(calls[7]), { page: '3' });
  assert.deepEqual(json(calls[9]), { body: 'Welcome!' });
  assert.deepEqual(json(calls[11]), { hidden: true });
});

test('memberships.create below Pro -> FeatureLockedError', async () => {
  reply({ status: 403, body: locked('memberships', 'tier3', 'Pro') });
  await assert.rejects(pf().memberships.create({ name: 'Club', offerIds: ['sub_1'] }), FeatureLockedError);
});

// ---------------------------------------------------------------------------
// Creator services and Google Sheets sync
// ---------------------------------------------------------------------------

test('creatorServices methods unwrap their envelopes', async () => {
  const s = pf().creatorServices;
  await s.get();
  await s.getAccountManager();
  await s.requestSlackChannel({ note: 'Prefer mornings' });
  reply({ body: { requests: [{ _id: 'r1' }] } }, { body: { request: { _id: 'r2', status: 'open' } } }, { body: { covers: [] } }, { body: { cover: { _id: 'c1', status: 'covered' } } });
  assert.equal((await s.listDisputeHelp({ saleId: 'o1' }))[0]._id, 'r1');
  assert.equal((await s.createDisputeHelp({ saleId: 'o1', message: 'Buyer says it never arrived.' })).status, 'open');
  assert.deepEqual(await s.listDisputeCovers({ limit: 10 }), []);
  assert.equal((await s.getDisputeCover('o1')).status, 'covered');
  assert.deepEqual(routes(), [
    'GET /creator-services',
    'GET /creator-services/account-manager',
    'POST /creator-services/account-manager/slack-channel',
    'GET /creator-services/dispute-help',
    'POST /creator-services/dispute-help',
    'GET /creator-services/dispute-covers',
    'GET /creator-services/dispute-covers/o1',
  ]);
  assert.deepEqual(json(calls[2]), { note: 'Prefer mornings' });
  assert.deepEqual(query(calls[3]), { saleId: 'o1' });
  assert.deepEqual(json(calls[4]), { saleId: 'o1', message: 'Buyer says it never arrived.' });
});

test('a second dispute help request keeps ALREADY_REQUESTED', async () => {
  reply({ status: 409, body: { code: 'ALREADY_REQUESTED', message: 'Already requested' } });
  await assert.rejects(pf().creatorServices.createDisputeHelp({ saleId: 'o1', message: 'Again please help' }), (err) => {
    assert.equal(err.status, 409);
    assert.equal(err.code, 'ALREADY_REQUESTED');
    return true;
  });
});

test('sheetsSync methods', async () => {
  const s = pf().sheetsSync;
  const connection = { status: 'active', syncSales: true };
  reply(
    { body: { configured: true, allowed: true, connection: null } },
    { body: { url: 'https://accounts.google.test/consent' } },
    { body: { connection } },
    { body: { connection } },
    { body: { connection } },
    { body: { result: { queued: { sales: 1, customers: 0 } }, connection } },
    { body: { requeued: 2, connection } },
    { body: { disconnected: true } }
  );
  assert.equal((await s.get()).configured, true);
  assert.equal((await s.connect()).url, 'https://accounts.google.test/consent');
  assert.deepEqual(await s.setSpreadsheet({ mode: 'existing', spreadsheet: 'https://docs.google.test/1', backfillDays: 30 }), connection);
  assert.deepEqual(await s.update({ syncCustomers: false }), connection);
  assert.deepEqual(await s.backfill({ days: 90 }), connection);
  assert.equal((await s.syncNow()).result.queued.sales, 1);
  assert.equal((await s.retryFailed()).requeued, 2);
  assert.equal((await s.disconnect()).disconnected, true);
  assert.deepEqual(routes(), [
    'GET /sheets-sync',
    'POST /sheets-sync/connect',
    'PUT /sheets-sync/spreadsheet',
    'PATCH /sheets-sync',
    'POST /sheets-sync/backfill',
    'POST /sheets-sync/sync',
    'POST /sheets-sync/retry',
    'DELETE /sheets-sync',
  ]);
  assert.deepEqual(json(calls[2]), { mode: 'existing', spreadsheet: 'https://docs.google.test/1', backfillDays: 30 });
  assert.deepEqual(json(calls[4]), { days: 90 });
});

// ---------------------------------------------------------------------------
// Growth loops: referrals, recommendations, agencies
// ---------------------------------------------------------------------------

test('referrals and recommendations', async () => {
  const client = pf();
  await client.referrals.stats();
  await client.referrals.list({ limit: 20, before: 'cur_1' });
  await client.recommendations.get();
  await client.recommendations.update({ showRecommendations: true, picks: [{ username: 'ana', blurb: 'Great weekly tips' }] });
  reply({ body: { results: [{ username: 'ana' }] } });
  assert.equal((await client.recommendations.search('an'))[0].username, 'ana');
  assert.deepEqual(routes(), [
    'GET /referrals/me',
    'GET /referrals/referred',
    'GET /recommendations',
    'PUT /recommendations',
    'GET /recommendations/search',
  ]);
  assert.deepEqual(query(calls[1]), { limit: '20', before: 'cur_1' });
  assert.deepEqual(json(calls[3]), { showRecommendations: true, picks: [{ username: 'ana', blurb: 'Great weekly tips' }] });
  assert.deepEqual(query(calls[4]), { q: 'an' });
});

test('agency and agencyAccess', async () => {
  const client = pf();
  await client.agency.get();
  await client.agency.create({ name: 'Studio', website: 'https://studio.test' });
  await client.agency.update({ name: 'Studio Co' });
  await client.agency.clients();
  await client.agency.removeClient('usr_1');
  reply({ body: { statements: [{ month: '2026-09' }] } });
  assert.equal((await client.agency.statements())[0].month, '2026-09');
  await client.agency.statement('2026-09');
  reply({ body: { agency: null } }, {}, { body: { agency: { name: 'Studio', code: 'AG1' } } }, { body: { ok: true } });
  assert.equal(await client.agencyAccess.get(), null);
  await client.agencyAccess.preview('AG1');
  assert.equal((await client.agencyAccess.invite('AG1')).code, 'AG1');
  assert.equal((await client.agencyAccess.remove()).ok, true);
  assert.deepEqual(routes(), [
    'GET /agency',
    'POST /agency',
    'PATCH /agency',
    'GET /agency/clients',
    'DELETE /agency/clients/usr_1',
    'GET /agency/statements',
    'GET /agency/statements/2026-09',
    'GET /agency-access',
    'GET /agency-access/preview/AG1',
    'POST /agency-access',
    'DELETE /agency-access',
  ]);
  assert.deepEqual(json(calls[1]), { name: 'Studio', website: 'https://studio.test' });
  assert.deepEqual(json(calls[9]), { code: 'AG1' });
});

// ---------------------------------------------------------------------------
// A/B tests
// ---------------------------------------------------------------------------

test('abTests methods', async () => {
  const t = pf().abTests;
  const body = { productId: 'p1', type: 'price', variants: [{ label: 'Higher', price: 49 }], weights: [50, 50] };
  reply({ body: [{ _id: 'ab_1', summary: { visitors: 10, conversions: 1 } }] });
  assert.equal((await t.list({ status: 'running', productId: 'p1' }))[0].summary.visitors, 10);
  await t.create(body);
  await t.get('ab_1', { timezoneOffsetMinutes: 60 });
  await t.results('ab_1');
  await t.stop('ab_1');
  reply({ body: { _id: 'ab_1', status: 'completed', applied: ['price'] } });
  assert.deepEqual((await t.declareWinner('ab_1', { variantId: 'var_b' })).applied, ['price']);
  await t.delete('ab_1');
  await t.assign({ productId: 'p1', visitorId: 'v_1', currency: 'eur' });
  assert.deepEqual(routes(), [
    'GET /ab-tests',
    'POST /ab-tests',
    'GET /ab-tests/ab_1',
    'GET /ab-tests/ab_1/results',
    'POST /ab-tests/ab_1/stop',
    'POST /ab-tests/ab_1/winner',
    'DELETE /ab-tests/ab_1',
    'POST /ab-tests/public/assign',
  ]);
  assert.deepEqual(query(calls[0]), { status: 'running', productId: 'p1' });
  assert.deepEqual(json(calls[1]), body);
  assert.deepEqual(query(calls[2]), { timezoneOffsetMinutes: '60' });
  assert.deepEqual(json(calls[5]), { variantId: 'var_b' });
  assert.deepEqual(json(calls[7]), { productId: 'p1', visitorId: 'v_1', currency: 'eur' });
});

test('a second running A/B test keeps AB_TEST_RUNNING', async () => {
  reply({ status: 409, body: { code: 'AB_TEST_RUNNING', message: 'This product already has a running test' } });
  await assert.rejects(pf().abTests.create({ productId: 'p1', type: 'headline', variants: [{ headline: 'New' }] }), (err) => err.code === 'AB_TEST_RUNNING' && err.status === 409);
});

// ---------------------------------------------------------------------------
// Loyalty and affiliate tiers
// ---------------------------------------------------------------------------

test('loyalty methods', async () => {
  const l = pf().loyalty;
  await l.getSettings();
  await l.updateSettings({ enabled: true, earnPointsPerUnit: 10, expiryDays: null });
  await l.getSummary();
  await l.listMembers({ limit: 50, offset: 50, search: 'ana' });
  await l.listActivity({ limit: 10, email: 'a@b.test' });
  await l.adjustPoints({ email: 'a@b.test', points: -100, note: 'Correction', idempotencyKey: 'adj-1' });
  assert.deepEqual(routes(), [
    'GET /loyalty',
    'PUT /loyalty',
    'GET /loyalty/summary',
    'GET /loyalty/members',
    'GET /loyalty/ledger',
    'POST /loyalty/members/adjust',
  ]);
  assert.deepEqual(json(calls[1]), { enabled: true, earnPointsPerUnit: 10, expiryDays: null });
  assert.deepEqual(query(calls[3]), { limit: '50', offset: '50', search: 'ana' });
  assert.deepEqual(query(calls[4]), { limit: '10', email: 'a@b.test' });
  assert.deepEqual(json(calls[5]), { email: 'a@b.test', points: -100, note: 'Correction', idempotencyKey: 'adj-1' });
});

test('affiliateTiers methods', async () => {
  const a = pf().affiliateTiers;
  const update = { enabled: true, period: 'month', tiers: [{ minSales: 0, rate: 20 }, { minSales: 10, rate: 30 }], bonuses: [{ sales: 50, amount: 100 }] };
  await a.get();
  await a.update(update);
  await a.listProgress();
  await a.getProgress('aff_1');
  await a.listBonuses({ limit: 20, status: 'earned' });
  await a.mine();
  assert.deepEqual(routes(), [
    'GET /affiliate-program',
    'PUT /affiliate-program',
    'GET /affiliate-program/affiliates',
    'GET /affiliate-program/affiliates/aff_1',
    'GET /affiliate-program/bonuses',
    'GET /affiliate-program/mine',
  ]);
  assert.deepEqual(json(calls[1]), update);
  assert.deepEqual(query(calls[4]), { limit: '20', status: 'earned' });
});

test('loyalty.updateSettings with enabled: true below Growth -> FeatureLockedError', async () => {
  reply({ status: 403, body: locked('loyalty') });
  await assert.rejects(pf().loyalty.updateSettings({ enabled: true }), (err) => err instanceof FeatureLockedError && err.feature === 'loyalty');
});

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------

test('migrations methods', async () => {
  const m = pf().migrations;
  const file = { kind: 'products', csv: 'name,price\nBook,9', filename: 'products.csv' };
  reply({ body: { platforms: [{ source: 'gumroad' }] } });
  assert.equal((await m.platforms())[0].source, 'gumroad');
  await m.list({ page: 1, pageSize: 10 });
  await m.create({ source: 'gumroad', downloadFiles: false, files: [file] });
  await m.get('mig_1');
  await m.addFile('mig_1', file);
  await m.updateMapping('mig_1', 'products', { name: 'Title', price: null });
  await m.removeFile('mig_1', 'products');
  await m.rows('mig_1', { kind: 'orders', filter: 'problems', page: 2 });
  await m.connect('mig_1', 'gum_token');
  await m.dryRun('mig_1');
  await m.start('mig_1');
  await m.cancel('mig_1');
  await m.report('mig_1');
  reply({ text: 'kind,row,error\norders,3,Missing email\n' });
  const csv = await m.errorsCsv('mig_1');
  assert.ok(csv.startsWith('kind,row,error'));
  assert.deepEqual(routes(), [
    'GET /migrations/platforms',
    'GET /migrations',
    'POST /migrations',
    'GET /migrations/mig_1',
    'POST /migrations/mig_1/files',
    'PUT /migrations/mig_1/files/products/mapping',
    'DELETE /migrations/mig_1/files/products',
    'GET /migrations/mig_1/rows',
    'POST /migrations/mig_1/connect',
    'POST /migrations/mig_1/dry-run',
    'POST /migrations/mig_1/start',
    'POST /migrations/mig_1/cancel',
    'GET /migrations/mig_1/report',
    'GET /migrations/mig_1/errors.csv',
  ]);
  assert.deepEqual(json(calls[2]), { source: 'gumroad', downloadFiles: false, files: [file] });
  assert.deepEqual(json(calls[4]), file);
  assert.deepEqual(json(calls[5]), { mapping: { name: 'Title', price: null } });
  assert.deepEqual(query(calls[7]), { kind: 'orders', filter: 'problems', page: '2' });
  assert.deepEqual(json(calls[8]), { token: 'gum_token' });
});

test('a started migration keeps MIGRATION_ALREADY_STARTED', async () => {
  reply({ status: 409, body: { code: 'MIGRATION_ALREADY_STARTED', message: 'Already started' } });
  await assert.rejects(pf().migrations.start('mig_1'), (err) => err.code === 'MIGRATION_ALREADY_STARTED');
});

// ---------------------------------------------------------------------------
// Gated writes and path encoding
// ---------------------------------------------------------------------------

test('FEATURE_LOCKED from the new gated methods', async () => {
  const client = pf();
  const gated = [
    () => client.segments.create({ name: 'S', definition: { groups: [] } }),
    () => client.usage.report('mem_1', { meter: 'm', quantity: 1 }),
    () => client.products.updatePaymentPlan('p1', { enabled: true }),
    () => client.products.updateLimitedDrop('p1', { enabled: true }),
    () => client.courses.update('p1', { certificate: { enabled: true } }),
    () => client.discounts.createUniqueCodes('d1', { count: 5 }),
    () => client.personalDeadlines.create({ name: 'D', productId: 'p1', offer: { type: 'price', value: 9 } }),
    () => client.retention.updateRecoverySettings({ enabled: true }),
    () => client.bundles.update('p1', { productIds: ['p2', 'p3'] }),
    () => client.revenueSplits.create({ productId: 'p1', email: 'co@b.test', sharePercent: 10 }),
    () => client.signupForms.create({ name: 'F' }),
    () => client.testimonials.updateSettings({ wallEnabled: true }),
    () => client.attributionSurvey.update({ enabled: true }),
    () => client.customers.listProfiles(),
    () => client.sheetsSync.connect(),
    () => client.creatorServices.getAccountManager(),
    () => client.abTests.create({ productId: 'p1', type: 'cover', variants: [{ coverImage: 'https://x.test/c.png' }] }),
    () => client.affiliateTiers.update({ enabled: true }),
    () => client.migrations.create({ source: 'csv' }),
  ];
  for (const call of gated) {
    reply({ status: 403, body: locked('someFeature') });
    await assert.rejects(call(), FeatureLockedError);
  }
  assert.equal(calls.length, gated.length);
});

test('ids are encoded as one path segment', async () => {
  await pf().memberships.posts.get('ms/1', 'po 1');
  assert.equal(only().url.pathname, '/memberships/ms%2F1/posts/po%201');
});

// ---------------------------------------------------------------------------
// Webhook events
// ---------------------------------------------------------------------------

const NEW_EVENTS = [
  'subscription.payment_failed',
  'subscription.recovered',
  'subscription.saved',
  'usage.recorded',
  'usage.period_closed',
  'installment.paid',
  'installment.failed',
  'split.created',
  'split.paid',
  'course.completed',
  'certificate.issued',
  'testimonial.submitted',
  'member.joined',
  'member.left',
  'ab_test.completed',
  'affiliate.tier_changed',
  'loyalty.credit_redeemed',
];

test('WEBHOOK_EVENTS has the Phase 2–5 events, once each', () => {
  for (const event of NEW_EVENTS) assert.ok(WEBHOOK_EVENTS.includes(event), event);
  assert.equal(new Set(WEBHOOK_EVENTS).size, WEBHOOK_EVENTS.length);
});

test('webhooks.create accepts the new events', async () => {
  await pf().webhooks.create({ url: 'https://x.test/hook', events: NEW_EVENTS });
  assert.deepEqual(json(only()).events, NEW_EVENTS);
});

test('constructWebhookEvent parses a member.joined delivery', () => {
  const secret = 'whsec_test';
  const t = 1_760_000_000;
  const body = JSON.stringify({
    id: 'evt_2',
    type: 'member.joined',
    created: t,
    webhookId: 'wh_1',
    membership: { id: 'ms_1', name: 'Inner circle', slug: 'inner-circle' },
    member: { email: 'a@b.test', name: 'Ana' },
    joinedAt: '2026-10-17T00:00:00.000Z',
  });
  const headers = { 'X-Pocketsflow-Signature-V2': generateWebhookSignatureHeader(body, secret, t) };
  const event = constructWebhookEvent(body, headers, secret, { now: t });
  assert.equal(event.type, 'member.joined');
  assert.equal(event.membership.slug, 'inner-circle');
});

// ---------------------------------------------------------------------------
// Global search (⌘K): GET /search
// ---------------------------------------------------------------------------

const SEARCH_ANSWER = {
  query: 'ana',
  testMode: false,
  limit: 5,
  groups: [
    {
      type: 'orders',
      hasMore: true,
      hits: [
        {
          id: '6711a3d59e3f1a0012cd7788',
          type: 'orders',
          title: 'Ana Lopez',
          subtitle: 'Notion course · ana@example.com · #12CD7788',
          meta: { amount: 49.99, currency: 'USD', status: 'paid', date: '2026-10-12T09:30:00.000Z' },
          path: '/orders-one-time/6711a3d59e3f1a0012cd7788',
          image: null,
          match: 'email',
        },
      ],
    },
    { type: 'customers', hasMore: false, hits: [] },
    {
      type: 'discounts',
      hasMore: false,
      hits: [
        {
          id: '6711a3d59e3f1a0012cd7701',
          type: 'discounts',
          title: 'ANA20',
          subtitle: "Ana's friends",
          meta: { value: 20, valueType: 'percentage', status: 'active' },
          path: '/discounts/6711a3d59e3f1a0012cd7701',
          image: null,
          match: 'code',
        },
      ],
    },
  ],
};

test('search.query sends only q by default', async () => {
  reply({ body: SEARCH_ANSWER });
  const res = await pf().search.query('ana');
  const c = only();
  assert.equal(route(c), 'GET /search');
  assert.deepEqual(query(c), { q: 'ana' });
  assert.equal(c.body, undefined);
  assert.equal(res.query, 'ana');
  assert.equal(res.testMode, false);
  assert.equal(res.limit, 5);
  assert.deepEqual(res.groups.map((g) => g.type), ['orders', 'customers', 'discounts']);
  assert.equal(res.groups[0].hasMore, true);
  assert.equal(res.groups[0].hits[0].meta.amount, 49.99);
  assert.equal(res.groups[0].hits[0].match, 'email');
  assert.equal(res.groups[0].hits[0].image, null);
  assert.equal(res.groups[2].hits[0].meta.valueType, 'percentage');
});

test('search.query serialises types comma-separated and limit', async () => {
  await pf().search.query('ana lo', { types: ['orders', 'customers'], limit: 20 });
  const c = only();
  assert.equal(c.url.search, '?q=ana+lo&types=orders%2Ccustomers&limit=20');
  assert.deepEqual(query(c), { q: 'ana lo', types: 'orders,customers', limit: '20' });
});

test('search.query leaves out empty types and keeps special characters in q literal', async () => {
  await pf().search.query('a.b+c@example.com', { types: [] });
  const c = only();
  assert.deepEqual(query(c), { q: 'a.b+c@example.com' });
  assert.equal(c.url.searchParams.has('types'), false);
});

test('search.query: 400 is a PocketsflowError with the message', async () => {
  reply({ status: 400, body: { message: 'Unknown search type: widgets' } });
  await assert.rejects(pf().search.query('ana', { types: ['widgets'] }), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.status, 400);
    assert.equal(err.message, 'Unknown search type: widgets');
    return true;
  });
});

test('search.query: 404 and 429 are PocketsflowErrors', async () => {
  reply({ status: 404, body: { message: 'Account not found' } });
  await assert.rejects(pf().search.query('ana'), (err) => err instanceof PocketsflowError && err.status === 404);
  reply({ status: 429, body: { message: 'Too many searches', code: 'RATE_LIMITED' } });
  await assert.rejects(pf().search.query('ana'), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.status, 429);
    assert.equal(err.code, 'RATE_LIMITED');
    return true;
  });
});
