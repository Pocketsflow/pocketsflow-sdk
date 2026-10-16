// Every operation in the public API contract has an SDK method that calls it.
// The contract is snapshotted in test/fixtures/public-api.json (refresh it
// from https://api.pocketsflow.com/docs.json when the API changes).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Pocketsflow, WEBHOOK_EVENTS } from '../dist/index.mjs';

const spec = JSON.parse(readFileSync(new URL('./fixtures/public-api.json', import.meta.url), 'utf8'));

const realFetch = globalThis.fetch;
let calls;

beforeEach(() => {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: new URL(url), method: init.method });
    return new Response('{}', { status: 200 });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const pf = new Pocketsflow({ apiKey: 'pk_test_123', baseUrl: 'https://api.example.test' });
const ID = 'id_1';

// operationId -> the SDK call that serves it.
const SDK = {
  listProducts: () => pf.products.list(),
  createProduct: () => pf.products.create({ name: 'P' }),
  getProduct: () => pf.products.get(ID),
  deleteProduct: () => pf.products.delete(ID),
  updateProduct: () => pf.products.update(ID, { price: 1 }),
  copyProduct: () => pf.products.copy(ID),
  listCustomers: () => pf.customers.list(),
  getCustomer: () => pf.customers.get(ID),
  listOrders: () => pf.orders.list(),
  getOrder: () => pf.orders.get(ID),
  getSubscriberOrderHistory: () => pf.subscriptions.get(ID),
  listPayments: () => pf.payments.list(),
  getPayment: () => pf.payments.get(ID),
  listReviews: () => pf.reviews.list(),
  listDiscounts: () => pf.discounts.list(),
  createDiscount: () => pf.discounts.create({ name: 'D', code: 'C', value: 1, mainProductIds: [] }),
  getDiscount: () => pf.discounts.get(ID),
  updateDiscount: () => pf.discounts.update(ID, { value: 2 }),
  deleteDiscount: () => pf.discounts.delete(ID),
  applyDiscountCode: () => pf.discounts.apply('CODE', ID),
  checkProductDiscounts: () => pf.discounts.checkProduct(ID),
  listUpsells: () => pf.upsells.list(),
  createUpsell: () => pf.upsells.create({ mainProductIds: [], upsellProductId: ID, upsellPrice: 1 }),
  getUpsell: () => pf.upsells.get(ID),
  updateUpsell: () => pf.upsells.update(ID, { active: false }),
  deleteUpsell: () => pf.upsells.delete(ID),
  listSubscriptionOffers: () => pf.subscriptionOffers.list(),
  createSubscriptionOffer: () =>
    pf.subscriptionOffers.create({ name: 'S', price: 1, frequency: 'monthly' }),
  listSubscribers: () => pf.subscribers.list(),
  getSubscriber: () => pf.subscribers.get(ID),
  getSubscriptionOffer: () => pf.subscriptionOffers.get(ID),
  deleteSubscriptionOffer: () => pf.subscriptionOffers.delete(ID),
  cancelSubscription: () => pf.subscribers.cancel(ID),
  pauseSubscription: () => pf.subscribers.pause(ID),
  resumeSubscription: () => pf.subscribers.resume(ID),
  listWebhooks: () => pf.webhooks.list(),
  createWebhook: () => pf.webhooks.create({ url: 'https://x.test', events: ['order.completed'] }),
  getWebhook: () => pf.webhooks.get(ID),
  updateWebhook: () => pf.webhooks.update(ID, { active: false }),
  deleteWebhook: () => pf.webhooks.delete(ID),
  rotateWebhookSecret: () => pf.webhooks.rotateSecret(ID),
  testWebhook: () => pf.webhooks.test(ID),
  listWebhookDeliveries: () => pf.webhooks.deliveries.list(),
  getWebhookDelivery: () => pf.webhooks.deliveries.get(ID),
  redeliverWebhook: () => pf.webhooks.deliveries.redeliver(ID),
  getCurrentUser: () => pf.users.me(),
  getCreatorPage: () => pf.creatorPage.get(),
  createCreatorPage: () => pf.creatorPage.create({ username: 'creator' }),
  updateCreatorPage: () => pf.creatorPage.update({ creatorBio: 'Hi' }),
  deleteCreatorPage: () => pf.creatorPage.delete(),
  updateCreatorPageUsername: () => pf.creatorPage.updateUsername('creator'),
  checkCreatorPageUsername: () => pf.creatorPage.checkUsername('creator'),
  listPosts: () => pf.newsletters.posts.list(),
  createPost: () => pf.newsletters.posts.create({ name: 'Post' }),
  getPost: () => pf.newsletters.posts.get(ID),
  updatePost: () => pf.newsletters.posts.update(ID, { subject: 'S' }),
  deletePost: () => pf.newsletters.posts.delete(ID),
  sendPost: () => pf.newsletters.posts.send(ID),
  sendEmail: () => pf.newsletters.send({ to: 'a@b.test', subject: 'S' }),
  listProductAudiences: () => pf.newsletters.audiences.list(),
  syncProductAudience: () => pf.newsletters.audiences.sync(),
  listEmailSubscribers: () => pf.newsletters.subscribers.list(),
  getEmailSubscriber: () => pf.newsletters.subscribers.get(ID),
  deleteEmailSubscriber: () => pf.newsletters.subscribers.delete(ID),
  uploadImage: () => pf.images.upload(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
  createRefundPolicy: () => pf.refunds.create({ name: 'R', period: 14 }),
  listRefundPolicies: () => pf.refunds.list(),
  getRefundPolicy: () => pf.refunds.get(ID),
  updateRefundPolicy: () => pf.refunds.update(ID, { period: 30 }),
  deleteRefundPolicy: () => pf.refunds.delete(ID),
  createCheckoutSession: () => pf.checkout.create({ productId: ID }),
  createPartner: () => pf.partners.create(),
  getPartner: () => pf.partners.get(),
  registerReferral: () => pf.partners.registerReferral('CODE'),
  listReferrals: () => pf.partners.listReferrals(),
  listReferralSales: () => pf.partners.listReferralSales(),
  getPartnerStats: () => pf.partners.stats(),
  setProductAbandonedCheckout: () => pf.products.setAbandonedCheckout(ID, true),
  getEntitlements: () => pf.plans.entitlements(),
  listPlans: () => pf.plans.list(),
  updateTrackingPixels: () => pf.users.updateTrackingPixels({ facebookPixel: null }),
  getWeeklyReport: () => pf.weeklyReport.get(),
  getWeeklyReportSettings: () => pf.weeklyReport.getSettings(),
  updateWeeklyReportSettings: () => pf.weeklyReport.updateSettings({ enabled: false }),
  getAbandonedCheckoutSummary: () => pf.checkout.abandonedSummary(),
  getStoreBadge: () => pf.storeBadge.get(),
  updateStoreBadge: () => pf.storeBadge.update({ showPoweredBy: true }),
  validateLicenseKey: () => pf.licenses.validate({ productId: ID, licenseKey: 'K' }),
  activateLicenseKey: () => pf.licenses.activate({ productId: ID, licenseKey: 'K' }),
  deactivateLicenseKey: () =>
    pf.licenses.deactivate({ productId: ID, licenseKey: 'K', instanceId: 'ins_1' }),
  listLicenseKeys: () => pf.licenses.list(),
  getLicenseKey: () => pf.licenses.get(ID),
  disableLicenseKey: () => pf.licenses.disable(ID),
  enableLicenseKey: () => pf.licenses.enable(ID),
  resetLicenseKeyActivations: () => pf.licenses.resetActivations(ID),
  listTrackedLinks: () => pf.trackedLinks.list(),
  createTrackedLink: () => pf.trackedLinks.create({ destination: 'https://x.test/p' }),
  getTrackedLinkStats: () => pf.trackedLinks.get(ID),
  updateTrackedLink: () => pf.trackedLinks.update(ID, { archived: true }),
  checkTrackedLinkSlug: () => pf.trackedLinks.checkSlug('ig-bio'),
  getTeam: () => pf.team.get(),
  listTeamActivity: () => pf.team.activity(),
  inviteTeamMember: () => pf.team.invites.create({ email: 'a@b.test', role: 'member' }),
  resendTeamInvite: () => pf.team.invites.resend(ID),
  cancelTeamInvite: () => pf.team.invites.cancel(ID),
  updateTeamMember: () => pf.team.members.update(ID, { role: 'admin' }),
  removeTeamMember: () => pf.team.members.remove(ID),
  createTeam: () => pf.team.teams.create({ name: 'Support' }),
  updateTeam: () => pf.team.teams.update(ID, { name: 'Ops' }),
  deleteTeam: () => pf.team.teams.delete(ID),
  getPostPurchaseOffer: () => pf.postPurchaseOffers.get(ID),
  updatePostPurchaseOffer: () => pf.postPurchaseOffers.update(ID, { enabled: false }),
  getSocialProofSettings: () => pf.socialProof.getSettings(ID),
  updateSocialProofSettings: () => pf.socialProof.updateSettings(ID, { enabled: false }),
  getSocialProof: () => pf.socialProof.get(ID),
  listFunnelTemplates: () => pf.funnels.templates(),
  listFunnels: () => pf.funnels.list(),
  createFunnel: () =>
    pf.funnels.create({
      templateId: 'welcome',
      leadMagnetProductId: ID,
      offerProductId: 'id_2',
      offerUrl: 'https://x.test/offer',
    }),
  getFunnel: () => pf.funnels.get(ID),
  renameFunnel: () => pf.funnels.rename(ID, 'Spring funnel'),
  deleteFunnel: () => pf.funnels.delete(ID),
  activateFunnel: () => pf.funnels.activate(ID),
  pauseFunnel: () => pf.funnels.pause(ID),
  getFunnelStats: () => pf.funnels.stats(ID),
};

/** `/discounts/apply/{discountCode}/{productId}` -> a matcher for the real path. */
const pathPattern = (path) =>
  new RegExp(`^${path.replace(/\{[^}]+\}/g, '[^/]+')}$`);

test('the fixture lists the public API operations', () => {
  assert.ok(spec.operations.length >= 124);
});

test('every public API operation has an SDK method', () => {
  const missing = spec.operations.filter((op) => !SDK[op.operationId]);
  assert.deepEqual(
    missing.map((op) => `${op.method} ${op.path} (${op.operationId})`),
    []
  );
});

for (const op of spec.operations) {
  test(`${op.operationId}: ${op.method} ${op.path}`, async () => {
    const call = SDK[op.operationId];
    if (!call) return; // reported by the test above
    await call();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, op.method);
    assert.match(calls[0].url.pathname, pathPattern(op.path));
  });
}

test('WEBHOOK_EVENTS matches the public API event list', () => {
  assert.deepEqual([...WEBHOOK_EVENTS].sort(), [...spec.webhookEvents].sort());
});
