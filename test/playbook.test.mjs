// Plans, growth and team methods (upgrade playbook), with fetch stubbed (no network).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  Pocketsflow,
  PocketsflowError,
  FeatureLockedError,
  SeatLimitError,
  UPGRADE_URL,
  WEBHOOK_EVENTS,
  constructWebhookEvent,
  generateWebhookSignatureHeader,
} from '../dist/index.mjs';

const realFetch = globalThis.fetch;
let calls;
let replies;

/** Queue the next responses: `{ status, body }` (defaults: 200 / `{}`). */
const reply = (...items) => replies.push(...items);

beforeEach(() => {
  calls = [];
  replies = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: new URL(url), method: init.method, body: init.body, headers: init.headers });
    const next = replies.shift() ?? {};
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
const json = (c) => (c.body === undefined ? undefined : JSON.parse(c.body));
const query = (c) => Object.fromEntries(c.url.searchParams);
const assertAuthed = (c) => {
  assert.equal(c.headers.Authorization, 'Bearer pk_test_123');
  assert.equal(c.headers['Content-Type'], 'application/json');
};

const LOCKED = {
  error: 'FEATURE_LOCKED',
  code: 'FEATURE_LOCKED',
  upgradeRequired: true,
  message: 'This feature is part of a higher plan. Please upgrade your plan to use it.',
  details: {
    feature: 'upsells',
    currentPlan: 'free',
    requiredPlan: 'tier2',
    requiredPlanName: 'Growth',
    requiredPlanPrice: 49,
    upgradeRequired: true,
  },
};

// ---------------------------------------------------------------------------
// Plans and entitlements
// ---------------------------------------------------------------------------

const ENTITLEMENTS = {
  plan: 'tier1',
  planName: 'Starter',
  billingInterval: 'month',
  feeRate: 0.02,
  seats: 1,
  enforced: true,
  features: {
    trackedLinks: { allowed: true, requiredPlan: 'tier1', requiredPlanName: 'Starter', reason: 'plan', grandfatheredUntil: null },
    upsells: { allowed: false, requiredPlan: 'tier2', requiredPlanName: 'Growth', reason: 'locked', grandfatheredUntil: null },
  },
};

test('plans.entitlements -> GET /users/entitlements with a can() helper', async () => {
  reply({ body: ENTITLEMENTS });
  const ent = await pf().plans.entitlements();
  const call = only();
  assert.equal(route(call), 'GET /users/entitlements');
  assert.equal(call.body, undefined);
  assertAuthed(call);
  assert.equal(ent.plan, 'tier1');
  assert.equal(ent.can('trackedLinks'), true);
  assert.equal(ent.can('upsells'), false);
  assert.equal(ent.can('someFutureFeature'), false);
  // The helper never leaks into serialization.
  assert.deepEqual(JSON.parse(JSON.stringify(ent)), ENTITLEMENTS);
  assert.deepEqual(Object.keys(ent), Object.keys(ENTITLEMENTS));
});

test('users.entitlements is the same call', async () => {
  reply({ body: ENTITLEMENTS });
  const ent = await pf().users.entitlements();
  assert.equal(route(only()), 'GET /users/entitlements');
  assert.equal(ent.can('trackedLinks'), true);
});

test('plans.list -> GET /users/billing-tiers and unwraps { tiers }', async () => {
  reply({ body: { tiers: [{ plan: 'free', name: 'Free', features: [] }, { plan: 'tier2', name: 'Growth', features: ['upsells'] }] } });
  const plans = await pf().plans.list();
  assert.equal(route(only()), 'GET /users/billing-tiers');
  assert.deepEqual(plans.map((p) => p.plan), ['free', 'tier2']);
});

// ---------------------------------------------------------------------------
// Abandoned checkout and tracking pixels
// ---------------------------------------------------------------------------

test('checkout.abandonedSummary -> GET /checkout/abandoned/summary', async () => {
  reply({ body: { count: 4, amountUsd: 116, windowDays: 30 } });
  const res = await pf().checkout.abandonedSummary();
  assert.equal(route(only()), 'GET /checkout/abandoned/summary');
  assert.deepEqual(res, { count: 4, amountUsd: 116, windowDays: 30 });
});

test('products.setAbandonedCheckout -> PATCH /products/{id}/abandoned-checkout { enabled }', async () => {
  const client = pf();
  reply({ body: { abandonedCheckoutEnabled: true } }, { body: { abandonedCheckoutEnabled: false } });
  const on = await client.products.setAbandonedCheckout('p 1', true);
  const off = await client.products.setAbandonedCheckout('p1', false);
  assert.equal(route(calls[0]), 'PATCH /products/p%201/abandoned-checkout');
  assert.deepEqual(json(calls[0]), { enabled: true });
  assert.deepEqual(json(calls[1]), { enabled: false });
  assertAuthed(calls[0]);
  assert.equal(on.abandonedCheckoutEnabled, true);
  assert.equal(off.abandonedCheckoutEnabled, false);
});

test('users.updateTrackingPixels -> POST /users/update with only the pixel fields', async () => {
  reply({ body: { _id: 'u1', facebookPixel: '123456789012345' } });
  const user = await pf().users.updateTrackingPixels({ facebookPixel: '123456789012345', tiktokPixel: null });
  const call = only();
  assert.equal(route(call), 'POST /users/update');
  assert.deepEqual(json(call), { facebookPixel: '123456789012345', tiktokPixel: null });
  assert.equal(user.facebookPixel, '123456789012345');
});

test('users.updateSellingProfile -> PUT /users/selling-profile', async () => {
  reply({ body: { sellingPath: 'software', sellingPathOther: null, sellingSetup: 'code' } });
  const profile = await pf().users.updateSellingProfile({ sellingPath: 'software', sellingSetup: 'code' });
  const call = only();
  assert.equal(route(call), 'PUT /users/selling-profile');
  assert.deepEqual(json(call), { sellingPath: 'software', sellingSetup: 'code' });
  assert.equal(profile.sellingSetup, 'code');
});

// ---------------------------------------------------------------------------
// Weekly report
// ---------------------------------------------------------------------------

test('weeklyReport.get / getSettings / updateSettings', async () => {
  const client = pf();
  reply(
    { body: { subject: 'Your week', html: '<p/>', text: '', report: { weekKey: '2026-W42' } } },
    { body: { enabled: true, timeZone: 'UTC', nextSendAt: '2026-10-19T08:00:00.000Z' } },
    { body: { enabled: false, timeZone: 'UTC', nextSendAt: '2026-10-19T08:00:00.000Z' } }
  );
  const preview = await client.weeklyReport.get();
  const settings = await client.weeklyReport.getSettings();
  const updated = await client.weeklyReport.updateSettings({ enabled: false });
  assert.deepEqual(calls.map(route), [
    'GET /users/weekly-report/preview',
    'GET /users/weekly-report/settings',
    'PUT /users/weekly-report/settings',
  ]);
  assert.deepEqual(json(calls[2]), { enabled: false });
  assert.equal(preview.report.weekKey, '2026-W42');
  assert.equal(settings.enabled, true);
  assert.equal(updated.enabled, false);
});

test('the SDK has no method for the dashboard-only weekly report test email', () => {
  assert.equal(pf().weeklyReport.sendTest, undefined);
  assert.equal(pf().weeklyReport.test, undefined);
});

// ---------------------------------------------------------------------------
// Tracked links
// ---------------------------------------------------------------------------

test('trackedLinks.list sends the stats range and archived=1', async () => {
  reply({ body: { links: [], statsLocked: false } });
  await pf().trackedLinks.list({
    archived: true,
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-15T00:00:00.000Z',
    timezoneOffsetMinutes: -120,
  });
  const call = only();
  assert.equal(route(call), 'GET /tracked-links');
  assert.deepEqual(query(call), {
    archived: '1',
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-15T00:00:00.000Z',
    timezoneOffsetMinutes: '-120',
  });
});

test('trackedLinks.list leaves archived out unless true', async () => {
  await pf().trackedLinks.list({ archived: false });
  assert.deepEqual(query(only()), {});
});

test('trackedLinks.create -> POST /tracked-links and unwraps { link }', async () => {
  reply({ status: 201, body: { link: { _id: 'l1', slug: 'ig-bio', shortUrl: 'https://s.test/go/ig-bio' } } });
  const params = { destination: 'https://redmug.pocketsflow.com/p/x', slug: 'ig-bio', channel: 'instagram', utm: { campaign: 'fall' } };
  const link = await pf().trackedLinks.create(params);
  const call = only();
  assert.equal(route(call), 'POST /tracked-links');
  assert.deepEqual(json(call), params);
  assertAuthed(call);
  assert.equal(link._id, 'l1');
  assert.equal(link.shortUrl, 'https://s.test/go/ig-bio');
});

test('trackedLinks.get -> GET /tracked-links/{id} with the range', async () => {
  reply({ body: { link: { _id: 'l1' }, statsLocked: true, stats: null } });
  const res = await pf().trackedLinks.get('l1', { startDate: '2026-10-01T00:00:00.000Z' });
  const call = only();
  assert.equal(route(call), 'GET /tracked-links/l1');
  assert.deepEqual(query(call), { startDate: '2026-10-01T00:00:00.000Z' });
  assert.equal(res.statsLocked, true);
  assert.equal(res.link._id, 'l1');
});

test('trackedLinks.update -> PATCH /tracked-links/{id} and unwraps { link }', async () => {
  reply({ body: { link: { _id: 'l1', archived: true } } });
  const link = await pf().trackedLinks.update('l1', { archived: true });
  const call = only();
  assert.equal(route(call), 'PATCH /tracked-links/l1');
  assert.deepEqual(json(call), { archived: true });
  assert.equal(link.archived, true);
});

test('trackedLinks.checkSlug -> GET /tracked-links/slug-available?slug&excludeId', async () => {
  const client = pf();
  reply({ body: { slug: 'ig-bio', valid: true, available: false, suggestion: 'ig-bio-2' } });
  const res = await client.trackedLinks.checkSlug('ig-bio', 'l1');
  await client.trackedLinks.checkSlug('ig-bio');
  assert.equal(route(calls[0]), 'GET /tracked-links/slug-available');
  assert.deepEqual(query(calls[0]), { slug: 'ig-bio', excludeId: 'l1' });
  assert.deepEqual(query(calls[1]), { slug: 'ig-bio' });
  assert.equal(res.suggestion, 'ig-bio-2');
});

test('a taken slug keeps the suggestion on the error body', async () => {
  reply({ status: 409, body: { message: 'You already have a link with this name.', field: 'slug', suggestion: 'ig-bio-2' } });
  await assert.rejects(pf().trackedLinks.create({ destination: 'https://x.test', slug: 'ig-bio' }), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.ok(!(err instanceof FeatureLockedError));
    assert.equal(err.status, 409);
    assert.equal(err.body.suggestion, 'ig-bio-2');
    assert.equal(err.body.field, 'slug');
    return true;
  });
});

// ---------------------------------------------------------------------------
// Store badge
// ---------------------------------------------------------------------------

const BADGE = {
  showPoweredBy: true,
  visible: true,
  canHide: false,
  requiredPlan: 'tier1',
  requiredPlanName: 'Starter',
  code: 'PF-abcdefghij',
  link: 'https://www.pocketsflow.com/?ref=PF-abcdefghij',
  clicks: 12,
  signups: 2,
  clearing: 1,
  freeMonths: { earned: 1, applied: 0, banked: 1, earnedThisYear: 1, yearlyCap: 12 },
};

test('storeBadge.get / update / referralStats', async () => {
  const client = pf();
  reply({ body: BADGE }, { body: { ...BADGE, showPoweredBy: false, visible: false } }, { body: BADGE });
  const badge = await client.storeBadge.get();
  const hidden = await client.storeBadge.update({ showPoweredBy: false });
  const stats = await client.storeBadge.referralStats();
  assert.deepEqual(calls.map(route), ['GET /powered-by/me', 'PUT /powered-by', 'GET /powered-by/me']);
  assert.deepEqual(json(calls[1]), { showPoweredBy: false });
  assert.equal(badge.code, 'PF-abcdefghij');
  assert.equal(hidden.visible, false);
  assert.deepEqual(stats, {
    code: BADGE.code,
    link: BADGE.link,
    clicks: 12,
    signups: 2,
    clearing: 1,
    freeMonths: BADGE.freeMonths,
  });
});

test('badge is an alias of storeBadge', () => {
  const client = pf();
  assert.equal(client.badge, client.storeBadge);
});

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

test('team.get / activity', async () => {
  const client = pf();
  reply({ body: { seats: { limit: 5, used: 2, pending: 0, paused: 0 }, members: [] } }, { body: { items: [], nextBefore: null } });
  const overview = await client.team.get();
  const activity = await client.team.activity({ before: '2026-10-01T00:00:00.000Z', limit: 25 });
  assert.deepEqual(calls.map(route), ['GET /team', 'GET /team/activity']);
  assert.deepEqual(query(calls[1]), { before: '2026-10-01T00:00:00.000Z', limit: '25' });
  assert.equal(overview.seats.limit, 5);
  assert.equal(activity.nextBefore, null);
});

test('team.invites create / resend / cancel', async () => {
  const client = pf();
  reply(
    { status: 201, body: { invite: { id: 'i1', email: 'a@b.test', role: 'member', teamIds: ['t1'] }, emailSent: true } },
    { body: { id: 'i1', expiresAt: '2026-10-23T00:00:00.000Z', emailSent: true } },
    { body: { ok: true } }
  );
  const created = await client.team.invites.create({ email: 'a@b.test', role: 'member', teamIds: ['t1'] });
  const resent = await client.team.invites.resend('i1');
  const canceled = await client.team.invites.cancel('i1');
  assert.deepEqual(calls.map(route), [
    'POST /team/invites',
    'POST /team/invites/i1/resend',
    'DELETE /team/invites/i1',
  ]);
  assert.deepEqual(json(calls[0]), { email: 'a@b.test', role: 'member', teamIds: ['t1'] });
  assert.equal(calls[1].body, undefined);
  assert.equal(created.invite.id, 'i1');
  assert.equal(resent.emailSent, true);
  assert.deepEqual(canceled, { ok: true });
});

test('team.members update / remove', async () => {
  const client = pf();
  reply({ body: { id: 'm1', role: 'admin', teamIds: [], status: 'paused', pausedReason: 'manual' } }, { body: { ok: true } });
  const member = await client.team.members.update('m1', { role: 'admin', status: 'paused' });
  await client.team.members.remove('m1');
  assert.deepEqual(calls.map(route), ['PATCH /team/members/m1', 'DELETE /team/members/m1']);
  assert.deepEqual(json(calls[0]), { role: 'admin', status: 'paused' });
  assert.equal(member.pausedReason, 'manual');
});

test('team.teams create / update / delete', async () => {
  const client = pf();
  reply({ status: 201, body: { id: 't1', name: 'Support', areas: ['orders'] } }, { body: { id: 't1', name: 'Ops' } }, { body: { ok: true } });
  const team = await client.team.teams.create({ name: 'Support', areas: ['orders'] });
  await client.team.teams.update('t1', { name: 'Ops' });
  await client.team.teams.delete('t1');
  assert.deepEqual(calls.map(route), ['POST /team/teams', 'PATCH /team/teams/t1', 'DELETE /team/teams/t1']);
  assert.deepEqual(json(calls[0]), { name: 'Support', areas: ['orders'] });
  assert.deepEqual(json(calls[1]), { name: 'Ops' });
  assert.equal(team.id, 't1');
});

test('the SDK has no methods for the dashboard-only team routes', () => {
  const team = pf().team;
  for (const name of ['stores', 'context', 'accept', 'leave', 'invitePreview']) {
    assert.equal(team[name], undefined, name);
  }
  assert.equal(team.invites.accept, undefined);
});

test('403 SEAT_LIMIT -> SeatLimitError', async () => {
  reply({
    status: 403,
    body: { error: 'SEAT_LIMIT', code: 'SEAT_LIMIT', message: 'Every seat on your plan is taken.', details: { limit: 5, used: 5, pending: 0 } },
  });
  await assert.rejects(pf().team.invites.create({ email: 'a@b.test', role: 'member' }), (err) => {
    assert.ok(err instanceof SeatLimitError);
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.name, 'SeatLimitError');
    assert.equal(err.code, 'SEAT_LIMIT');
    assert.equal(err.status, 403);
    assert.equal(err.limit, 5);
    assert.equal(err.used, 5);
    assert.equal(err.pending, 0);
    assert.equal(err.message, 'Every seat on your plan is taken.');
    return true;
  });
});

test('other team errors keep their code and details', async () => {
  reply({ status: 409, body: { error: 'ALREADY_INVITED', code: 'ALREADY_INVITED', message: 'Already invited.' } });
  await assert.rejects(pf().team.invites.create({ email: 'a@b.test', role: 'member' }), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.ok(!(err instanceof SeatLimitError));
    assert.equal(err.code, 'ALREADY_INVITED');
    assert.equal(err.status, 409);
    return true;
  });
});

// ---------------------------------------------------------------------------
// Post-purchase offers and social proof
// ---------------------------------------------------------------------------

test('postPurchaseOffers.get / update unwrap { postPurchaseOffer }', async () => {
  const client = pf();
  const offer = { enabled: true, productId: 'p2', discountPercent: 20 };
  reply({ body: { postPurchaseOffer: { enabled: false, productId: '', discountPercent: 0 } } }, { body: { postPurchaseOffer: offer } });
  const before = await client.postPurchaseOffers.get('p1');
  const after = await client.postPurchaseOffers.update('p1', offer);
  assert.deepEqual(calls.map(route), ['GET /post-purchase/products/p1', 'PUT /post-purchase/products/p1']);
  assert.deepEqual(json(calls[1]), offer);
  assertAuthed(calls[1]);
  assert.equal(before.enabled, false);
  assert.deepEqual(after, offer);
});

test('post-purchase 400 keeps its code', async () => {
  reply({ status: 400, body: { message: 'Pick a different product', code: 'same_product' } });
  await assert.rejects(pf().postPurchaseOffers.update('p1', { productId: 'p1' }), (err) => {
    assert.equal(err.status, 400);
    assert.equal(err.code, 'same_product');
    return true;
  });
});

test('socialProof.get / getSettings / updateSettings', async () => {
  const client = pf();
  const settings = { enabled: true, purchaseCount: true, countWindow: '7d', threshold: 3, recentPurchases: true, rating: false };
  reply(
    { body: { enabled: true, purchases: { count: 9, window: '7d' }, recent: null, rating: null } },
    { body: { socialProof: settings } },
    { body: { socialProof: { ...settings, threshold: 5 } } }
  );
  const proof = await client.socialProof.get('p1');
  const current = await client.socialProof.getSettings('p1');
  const updated = await client.socialProof.updateSettings('p1', { threshold: 5 });
  assert.deepEqual(calls.map(route), [
    'GET /social-proof/products/p1',
    'GET /social-proof/products/p1/settings',
    'PUT /social-proof/products/p1/settings',
  ]);
  assert.deepEqual(json(calls[2]), { threshold: 5 });
  assert.equal(proof.purchases.count, 9);
  assert.deepEqual(current, settings);
  assert.equal(updated.threshold, 5);
});

// ---------------------------------------------------------------------------
// Sales funnels
// ---------------------------------------------------------------------------

test('funnels.templates / list unwrap their envelopes', async () => {
  const client = pf();
  reply({ body: { templates: [{ id: 'welcome', emails: [] }] } }, { body: { funnels: [{ _id: 'f1' }] } });
  const templates = await client.funnels.templates({ leadMagnetName: 'Free guide', offerName: 'Course' });
  const funnels = await client.funnels.list();
  assert.deepEqual(calls.map(route), ['GET /funnels/templates', 'GET /funnels']);
  assert.deepEqual(query(calls[0]), { leadMagnetName: 'Free guide', offerName: 'Course' });
  assert.equal(templates[0].id, 'welcome');
  assert.equal(funnels[0]._id, 'f1');
});

test('funnels.create -> POST /funnels with the discount', async () => {
  reply({ status: 201, body: { _id: 'f1', status: 'draft' } });
  const params = {
    templateId: 'launch',
    leadMagnetProductId: 'p1',
    offerProductId: 'p2',
    offerUrl: 'https://redmug.pocketsflow.com/p/course',
    name: 'Launch',
    discount: { code: 'LAUNCH20', valueType: 'percentage', value: 20, expiresAt: null },
  };
  const funnel = await pf().funnels.create(params);
  const call = only();
  assert.equal(route(call), 'POST /funnels');
  assert.deepEqual(json(call), params);
  assertAuthed(call);
  assert.equal(funnel.status, 'draft');
});

test('funnels get / rename / activate / pause / stats / delete', async () => {
  const client = pf();
  await client.funnels.get('f1');
  await client.funnels.rename('f1', 'Spring');
  await client.funnels.activate('f1');
  await client.funnels.pause('f1');
  await client.funnels.stats('f1');
  await client.funnels.delete('f1');
  assert.deepEqual(calls.map(route), [
    'GET /funnels/f1',
    'PUT /funnels/f1',
    'POST /funnels/f1/activate',
    'POST /funnels/f1/pause',
    'GET /funnels/f1/stats',
    'DELETE /funnels/f1',
  ]);
  assert.deepEqual(json(calls[1]), { name: 'Spring' });
  assert.equal(calls[2].body, undefined);
});

test('funnels.activate below Growth -> FeatureLockedError', async () => {
  reply({ status: 403, body: { ...LOCKED, details: { ...LOCKED.details, feature: 'salesFunnels' } } });
  await assert.rejects(pf().funnels.activate('f1'), (err) => {
    assert.ok(err instanceof FeatureLockedError);
    assert.equal(err.feature, 'salesFunnels');
    return true;
  });
});

// ---------------------------------------------------------------------------
// License keys
// ---------------------------------------------------------------------------

test('licenses creator methods', async () => {
  const client = pf();
  await client.licenses.list({ productId: 'p1', status: 'active', page: 2, pageSize: 50 });
  await client.licenses.get('k1');
  await client.licenses.disable('k1');
  await client.licenses.enable('k1');
  await client.licenses.resetActivations('k1');
  assert.deepEqual(calls.map(route), [
    'GET /licenses',
    'GET /licenses/k1',
    'POST /licenses/k1/disable',
    'POST /licenses/k1/enable',
    'POST /licenses/k1/reset-activations',
  ]);
  assert.deepEqual(query(calls[0]), { productId: 'p1', status: 'active', page: '2', pageSize: '50' });
});

test('licenses.validate / activate / deactivate send the key', async () => {
  const client = pf();
  reply({ body: { valid: true, code: null } }, { status: 201, body: { valid: true, instance: { id: 'ins_1' } } }, { body: { valid: true } });
  const body = { productId: 'p1', licenseKey: '7KQ2M-X9D4R-T3VWB-8HNPC' };
  const ok = await client.licenses.validate(body);
  const activated = await client.licenses.activate({ ...body, instanceName: 'MacBook' });
  await client.licenses.deactivate({ ...body, instanceId: 'ins_1' });
  assert.deepEqual(calls.map(route), [
    'POST /licenses/validate',
    'POST /licenses/activate',
    'POST /licenses/deactivate',
  ]);
  assert.deepEqual(json(calls[1]), { ...body, instanceName: 'MacBook' });
  assert.deepEqual(json(calls[2]), { ...body, instanceId: 'ins_1' });
  assert.equal(ok.valid, true);
  assert.equal(activated.instance.id, 'ins_1');
});

test('an invalid license key resolves with valid: false instead of throwing', async () => {
  const client = pf();
  reply(
    { status: 404, body: { valid: false, status: 'not_found', code: 'license_not_found', message: 'No such key' } },
    { status: 409, body: { valid: false, status: 'active', code: 'activation_limit_reached' } }
  );
  const missing = await client.licenses.validate({ productId: 'p1', licenseKey: 'nope' });
  const full = await client.licenses.activate({ productId: 'p1', licenseKey: 'K' });
  assert.equal(missing.valid, false);
  assert.equal(missing.code, 'license_not_found');
  assert.equal(full.code, 'activation_limit_reached');
});

test('license rate limits and server errors still throw', async () => {
  const client = pf();
  reply({ status: 429, body: { message: 'Too many requests' } }, { status: 500, body: { valid: false, code: 'server_error' } });
  await assert.rejects(client.licenses.validate({ productId: 'p1', licenseKey: 'K' }), (err) => err.status === 429);
  await assert.rejects(client.licenses.validate({ productId: 'p1', licenseKey: 'K' }), (err) => err.status === 500);
});

test('other methods still throw on a 4xx body with `valid`', async () => {
  reply({ status: 404, body: { valid: false, message: 'Not found' } });
  await assert.rejects(pf().licenses.get('k1'), (err) => err.status === 404);
});

// ---------------------------------------------------------------------------
// FeatureLockedError
// ---------------------------------------------------------------------------

test('403 FEATURE_LOCKED -> FeatureLockedError with the plan details', async () => {
  reply({ status: 403, body: LOCKED });
  await assert.rejects(
    pf().upsells.create({ mainProductIds: ['p1'], upsellProductId: 'p2', upsellPrice: 9 }),
    (err) => {
      assert.ok(err instanceof FeatureLockedError);
      assert.ok(err instanceof PocketsflowError);
      assert.ok(err instanceof Error);
      assert.equal(err.name, 'FeatureLockedError');
      assert.equal(err.code, 'FEATURE_LOCKED');
      assert.equal(err.status, 403);
      assert.equal(err.message, LOCKED.message);
      assert.equal(err.feature, 'upsells');
      assert.equal(err.currentPlan, 'free');
      assert.equal(err.requiredPlan, 'tier2');
      assert.equal(err.requiredPlanName, 'Growth');
      assert.equal(err.requiredPlanPrice, 49);
      assert.equal(err.upgradeUrl, 'https://app.pocketsflow.com/profile/billing');
      assert.equal(err.upgradeUrl, UPGRADE_URL);
      assert.deepEqual(err.details, LOCKED.details);
      assert.equal(err.body.upgradeRequired, true);
      return true;
    }
  );
});

test('FEATURE_LOCKED is read from `error` when `code` is missing', async () => {
  const { code, ...body } = LOCKED;
  reply({ status: 403, body: { ...body, details: { ...LOCKED.details, feature: 'removeBadge', requiredPlan: 'tier1', requiredPlanName: 'Starter' } } });
  await assert.rejects(pf().storeBadge.update({ showPoweredBy: false }), (err) => {
    assert.ok(err instanceof FeatureLockedError);
    assert.equal(err.code, 'FEATURE_LOCKED');
    assert.equal(err.feature, 'removeBadge');
    assert.equal(err.requiredPlanName, 'Starter');
    return true;
  });
});

test('FEATURE_LOCKED from every gated method', async () => {
  const client = pf();
  const gated = [
    () => client.products.setAbandonedCheckout('p1', true),
    () => client.users.updateTrackingPixels({ facebookPixel: '123456789012345' }),
    () => client.trackedLinks.create({ destination: 'https://x.test' }),
    () => client.trackedLinks.update('l1', { label: 'IG' }),
    () => client.team.teams.create({ name: 'Support' }),
    () => client.postPurchaseOffers.update('p1', { enabled: true }),
    () => client.socialProof.updateSettings('p1', { enabled: true }),
    () => client.funnels.create({ templateId: 'welcome', leadMagnetProductId: 'a', offerProductId: 'b', offerUrl: 'https://x.test' }),
    () => client.creatorPage.update({ themeV2: { templateId: 'premium' } }),
  ];
  for (const call of gated) {
    reply({ status: 403, body: LOCKED });
    await assert.rejects(call(), FeatureLockedError);
  }
});

test('a 403 without FEATURE_LOCKED stays a plain PocketsflowError', async () => {
  reply({ status: 403, body: { message: 'Forbidden', code: 'ROLE_FORBIDDEN' } });
  await assert.rejects(pf().team.get(), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.ok(!(err instanceof FeatureLockedError));
    assert.ok(!(err instanceof SeatLimitError));
    assert.equal(err.code, 'ROLE_FORBIDDEN');
    return true;
  });
});

test('FEATURE_LOCKED on a non-403 status is not a FeatureLockedError', async () => {
  reply({ status: 400, body: { code: 'FEATURE_LOCKED', message: 'odd' } });
  await assert.rejects(pf().team.get(), (err) => !(err instanceof FeatureLockedError) && err.status === 400);
});

test('a non-JSON error body still throws a PocketsflowError', async () => {
  globalThis.fetch = async () => new Response('<html>Bad gateway</html>', { status: 502 });
  await assert.rejects(pf().plans.list(), (err) => {
    assert.ok(err instanceof PocketsflowError);
    assert.equal(err.status, 502);
    assert.equal(err.message, 'Request failed');
    assert.equal(err.body, undefined);
    return true;
  });
});

test('FeatureLockedError can be built directly and tolerates a missing details object', () => {
  const err = new FeatureLockedError('Upgrade needed');
  assert.equal(err.status, 403);
  assert.equal(err.code, 'FEATURE_LOCKED');
  assert.equal(err.upgradeUrl, UPGRADE_URL);
  assert.equal(err.requiredPlanPrice, null);
});

// ---------------------------------------------------------------------------
// Webhook events
// ---------------------------------------------------------------------------

test('WEBHOOK_EVENTS has the post-purchase and funnel events', () => {
  assert.ok(WEBHOOK_EVENTS.includes('order.post_purchase_accepted'));
  assert.ok(WEBHOOK_EVENTS.includes('funnel.lead'));
  assert.equal(new Set(WEBHOOK_EVENTS).size, WEBHOOK_EVENTS.length);
});

test('webhooks.create accepts the new events', async () => {
  await pf().webhooks.create({ url: 'https://x.test/hook', events: ['order.post_purchase_accepted', 'funnel.lead'] });
  assert.deepEqual(json(only()).events, ['order.post_purchase_accepted', 'funnel.lead']);
});

test('constructWebhookEvent verifies and parses a funnel.lead delivery', () => {
  const secret = 'whsec_test';
  const t = 1_760_000_000;
  const body = JSON.stringify({
    id: 'evt_1',
    type: 'funnel.lead',
    created: t,
    webhookId: 'wh_1',
    funnel: { id: 'f1', name: 'Launch', leadMagnetProductId: 'p1', offerProductId: 'p2' },
    lead: { email: 'a@b.test', firstName: null, lastName: null, subscriberId: 's1', subscribed: true, tag: 'funnel-launch' },
    order: { id: 'o1' },
    capturedAt: '2026-10-16T00:00:00.000Z',
  });
  const headers = { 'X-Pocketsflow-Signature-V2': generateWebhookSignatureHeader(body, secret, t) };
  const event = constructWebhookEvent(body, headers, secret, { now: t });
  assert.equal(event.type, 'funnel.lead');
  assert.equal(event.lead.email, 'a@b.test');
});
