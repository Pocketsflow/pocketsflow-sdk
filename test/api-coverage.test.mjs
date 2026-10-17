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
  // Paid newsletter, resends and subject tests
  getPaidNewsletter: () => pf.paidNewsletter.get(),
  updatePaidNewsletter: () => pf.paidNewsletter.update({ enabled: false }),
  getNewsletterStats: () => pf.paidNewsletter.stats(),
  syncPaidSubscribers: () => pf.paidNewsletter.sync(),
  setPostAudience: () => pf.newsletters.posts.setAudience(ID, { audience: 'paid' }),
  getPostResend: () => pf.newsletters.posts.getResend(ID),
  scheduleResendToNonOpeners: () => pf.newsletters.posts.resendToNonOpeners(ID, { subject: 'S' }),
  cancelResendToNonOpeners: () => pf.newsletters.posts.cancelResend(ID),
  getSubjectTest: () => pf.newsletters.posts.getSubjectTest(ID),
  startSubjectTest: () => pf.newsletters.posts.startSubjectTest(ID, { subjectB: 'B' }),
  // Analytics
  getAnalyticsPreview: () => pf.analytics.preview(),
  getAnalyticsSummary: () => pf.analytics.summary(),
  getSalesFunnel: () => pf.analytics.funnel(),
  getRevenueBySource: () => pf.analytics.revenueBySource(),
  getRepeatBuyerCohorts: () => pf.analytics.cohorts(),
  getNetRevenue: () => pf.analytics.netRevenue(),
  getMrr: () => pf.analytics.mrr(),
  // Segments
  listSegments: () => pf.segments.list(),
  createSegment: () => pf.segments.create({ name: 'VIP', definition: { groups: [] } }),
  previewSegment: () => pf.segments.preview({ groups: [] }),
  getSegment: () => pf.segments.get(ID),
  updateSegment: () => pf.segments.update(ID, { name: 'VIP' }),
  deleteSegment: () => pf.segments.delete(ID),
  getSegmentCount: () => pf.segments.count(ID),
  listSegmentSubscribers: () => pf.segments.listSubscribers(ID),
  // Usage billing
  updateSubscriptionUsagePricing: () => pf.subscriptions.updateUsagePricing(ID, { meters: [] }),
  getSubscriptionUsage: () => pf.usage.get(ID),
  reportSubscriptionUsage: () => pf.usage.report(ID, { meter: 'api_calls', quantity: 1 }),
  updateSubscriptionSeats: () => pf.subscriptions.updateSeats(ID, { quantity: 2 }),
  // Subscription retention
  getRecoverySummary: () => pf.retention.recoverySummary(),
  listAtRiskSubscriptions: () => pf.retention.listAtRisk(),
  getRecoverySettings: () => pf.retention.getRecoverySettings(),
  updateRecoverySettings: () => pf.retention.updateRecoverySettings({ enabled: false }),
  getSaveOffersReport: () => pf.retention.saveOffersReport(),
  getIntroPricingReport: () => pf.retention.introReport(),
  listRetentionOffers: () => pf.retention.listOffers(),
  getRetentionOffer: () => pf.retention.getOffer(ID),
  updateRetentionOffer: () => pf.retention.updateOffer(ID, { intro: { enabled: false } }),
  // Courses
  getCourseSettings: () => pf.courses.get(ID),
  updateCourseSettings: () => pf.courses.update(ID, { notifyOnUnlock: true }),
  listCourseQuizzes: () => pf.courses.listQuizzes(ID),
  upsertCourseQuiz: () => pf.courses.upsertQuiz(ID, 'les_1', { questions: [] }),
  deleteCourseQuiz: () => pf.courses.deleteQuiz(ID, 'les_1'),
  getCourseStats: () => pf.courses.stats(ID),
  verifyCertificate: () => pf.certificates.verify('7K2QX9MD4HTR'),
  // Delivery: limited drops, PDF stamping, download limits
  getLimitedDrop: () => pf.products.getLimitedDrop(ID),
  updateLimitedDrop: () => pf.products.updateLimitedDrop(ID, { enabled: false }),
  getLimitedDropAvailability: () => pf.products.getDropAvailability(ID),
  getPdfStamping: () => pf.products.getPdfStamping(ID),
  updatePdfStamping: () => pf.products.updatePdfStamping(ID, { enabled: false }),
  getDownloadLimits: () => pf.products.getDownloadLimits(ID),
  updateDownloadLimits: () => pf.products.updateDownloadLimits(ID, { enabled: false }),
  getOrderDownloads: () => pf.orders.getDownloads(ID),
  resetOrderDownloads: () => pf.orders.resetDownloads(ID),
  // Revenue splits
  listRevenueSplits: () => pf.revenueSplits.list(),
  createRevenueSplit: () => pf.revenueSplits.create({ productId: ID, email: 'a@b.test', sharePercent: 30 }),
  getProductRevenueSplit: () => pf.revenueSplits.product(ID),
  listRevenueSplitSales: () => pf.revenueSplits.sales(),
  getRevenueSplitSale: () => pf.revenueSplits.sale(ID),
  getRevenueSplitEarnings: () => pf.revenueSplits.earnings(),
  listRevenueSplitInvites: () => pf.revenueSplits.invites(),
  acceptRevenueSplitInvite: () => pf.revenueSplits.accept(ID),
  declineRevenueSplitInvite: () => pf.revenueSplits.decline(ID),
  getRevenueSplit: () => pf.revenueSplits.get(ID),
  removeRevenueSplit: () => pf.revenueSplits.remove(ID),
  resendRevenueSplitInvite: () => pf.revenueSplits.resend(ID),
  // Testimonials and the attribution survey
  listTestimonials: () => pf.testimonials.list(),
  getTestimonial: () => pf.testimonials.get(ID),
  moderateTestimonial: () => pf.testimonials.moderate(ID, { status: 'hidden' }),
  getTestimonialSettings: () => pf.testimonials.getSettings(),
  updateTestimonialSettings: () => pf.testimonials.updateSettings({ requestEnabled: false }),
  getTestimonialWall: () => pf.testimonials.wall(ID),
  getAttributionSurvey: () => pf.attributionSurvey.get(),
  updateAttributionSurvey: () => pf.attributionSurvey.update({ enabled: false }),
  getAttributionReport: () => pf.attributionSurvey.report(),
  // Payment plans and exit offers
  getProductCheckoutOffers: () => pf.products.getCheckoutOffers(ID),
  updateProductPaymentPlan: () => pf.products.updatePaymentPlan(ID, { enabled: false }),
  updateProductExitOffer: () => pf.products.updateExitOffer(ID, { exitOffer: { enabled: false } }),
  getCheckoutOffers: () => pf.checkoutOffers.get(ID),
  // Launch pricing
  listFlashSales: () => pf.flashSales.list(),
  createFlashSale: () =>
    pf.flashSales.create({ name: 'Spring', startsAt: '2026-11-01T00:00:00Z', endsAt: '2026-11-03T00:00:00Z', value: 20 }),
  getFlashSale: () => pf.flashSales.get(ID),
  updateFlashSale: () => pf.flashSales.update(ID, { value: 25 }),
  deleteFlashSale: () => pf.flashSales.delete(ID),
  createFlashSaleAnnouncement: () => pf.flashSales.createAnnouncement(ID),
  getFairPricing: () => pf.fairPricing.get(),
  updateFairPricing: () => pf.fairPricing.update({ enabled: false }),
  getFairPricingAnalytics: () => pf.fairPricing.analytics(),
  listPriceSteps: () => pf.pricing.listPriceSteps(),
  getProductLaunchPricing: () => pf.products.getLaunchPricing(ID),
  setProductPriceSteps: () => pf.products.setPriceSteps(ID, { enabled: false }),
  setProductFairPricing: () => pf.products.setFairPricing(ID, { mode: 'store' }),
  getPriceQuote: () => pf.pricing.quote(ID),
  // Bundles and "Buy more, save more"
  listBundles: () => pf.bundles.list(),
  getBundle: () => pf.bundles.get(ID),
  updateBundle: () => pf.bundles.update(ID, { productIds: ['id_2', 'id_3'] }),
  deleteBundle: () => pf.bundles.delete(ID),
  getTieredDiscounts: () => pf.tieredDiscounts.get(),
  updateTieredDiscounts: () => pf.tieredDiscounts.update({ enabled: false }),
  deleteTieredDiscounts: () => pf.tieredDiscounts.delete(),
  // Signup forms
  listSignupForms: () => pf.signupForms.list(),
  createSignupForm: () => pf.signupForms.create({ name: 'Footer' }),
  getSignupForm: () => pf.signupForms.get(ID),
  updateSignupForm: () => pf.signupForms.update(ID, { status: 'paused' }),
  deleteSignupForm: () => pf.signupForms.delete(ID),
  getPublicSignupForm: () => pf.signupForms.getPublic(ID),
  subscribeWithSignupForm: () => pf.signupForms.subscribe(ID, { email: 'a@b.test' }),
  // Unique coupons and personal deadlines
  listUniqueCodes: () => pf.discounts.listUniqueCodes(ID),
  createUniqueCodes: () => pf.discounts.createUniqueCodes(ID, { count: 10 }),
  exportUniqueCodes: () => pf.discounts.exportUniqueCodes(ID),
  listPersonalDeadlines: () => pf.personalDeadlines.list(),
  createPersonalDeadline: () =>
    pf.personalDeadlines.create({ name: 'D', productId: ID, offer: { type: 'percentage', value: 20 } }),
  getPersonalOffer: () => pf.personalDeadlines.getPublicOffer({ productId: ID }),
  getPersonalDeadline: () => pf.personalDeadlines.get(ID),
  updatePersonalDeadline: () => pf.personalDeadlines.update(ID, { active: false }),
  deletePersonalDeadline: () => pf.personalDeadlines.delete(ID),
  listPersonalDeadlineEntries: () => pf.personalDeadlines.listEntries(ID),
  startPersonalDeadline: () => pf.personalDeadlines.start(ID, { email: 'a@b.test' }),
  getPersonalDeadlineLink: () => pf.personalDeadlines.getLink(ID, { email: 'a@b.test' }),
  // Customer CRM and benchmarks
  listCustomerProfiles: () => pf.customers.listProfiles(),
  listCustomerTags: () => pf.customers.listTags(),
  getCustomerProfile: () => pf.customers.getProfile(ID),
  listCustomerNotes: () => pf.customers.listNotes(ID),
  addCustomerNote: () => pf.customers.addNote(ID, { body: 'Called' }),
  deleteCustomerNote: () => pf.customers.deleteNote(ID, 'note_1'),
  setCustomerTags: () => pf.customers.setTags(ID, { tags: ['vip'] }),
  getBenchmarks: () => pf.benchmarks.get(),
  // Memberships
  listMemberships: () => pf.memberships.list(),
  createMembership: () => pf.memberships.create({ name: 'Club', offerIds: [ID] }),
  banMember: () => pf.memberships.banMember({ email: 'a@b.test' }),
  unbanMember: () => pf.memberships.unbanMember({ email: 'a@b.test' }),
  getMembership: () => pf.memberships.get(ID),
  updateMembership: () => pf.memberships.update(ID, { archived: true }),
  deleteMembership: () => pf.memberships.delete(ID),
  listMembershipMembers: () => pf.memberships.listMembers(ID),
  listMemberPosts: () => pf.memberships.posts.list(ID),
  createMemberPost: () => pf.memberships.posts.create(ID, { title: 'Hello' }),
  getMemberPost: () => pf.memberships.posts.get(ID, 'post_1'),
  updateMemberPost: () => pf.memberships.posts.update(ID, 'post_1', { pinned: true }),
  deleteMemberPost: () => pf.memberships.posts.delete(ID, 'post_1'),
  listCommunityThreads: () => pf.memberships.threads.list(ID),
  createCommunityThread: () => pf.memberships.threads.create(ID, { title: 'Welcome' }),
  getCommunityThread: () => pf.memberships.threads.get(ID, 'thr_1'),
  moderateCommunityThread: () => pf.memberships.threads.moderate(ID, 'thr_1', { locked: true }),
  deleteCommunityThread: () => pf.memberships.threads.delete(ID, 'thr_1'),
  replyToCommunityThread: () => pf.memberships.threads.reply(ID, 'thr_1', { body: 'Hi' }),
  moderateCommunityReply: () => pf.memberships.replies.moderate(ID, 'rep_1', { hidden: true }),
  deleteCommunityReply: () => pf.memberships.replies.delete(ID, 'rep_1'),
  // Creator services and Google Sheets sync
  getCreatorServices: () => pf.creatorServices.get(),
  getAccountManager: () => pf.creatorServices.getAccountManager(),
  requestSlackChannel: () => pf.creatorServices.requestSlackChannel(),
  listDisputeHelpRequests: () => pf.creatorServices.listDisputeHelp(),
  createDisputeHelpRequest: () =>
    pf.creatorServices.createDisputeHelp({ saleId: ID, message: 'Please help with this one.' }),
  listDisputeCovers: () => pf.creatorServices.listDisputeCovers(),
  getDisputeCover: () => pf.creatorServices.getDisputeCover(ID),
  getSheetsSync: () => pf.sheetsSync.get(),
  updateSheetsSync: () => pf.sheetsSync.update({ syncCustomers: false }),
  disconnectSheetsSync: () => pf.sheetsSync.disconnect(),
  connectSheetsSync: () => pf.sheetsSync.connect(),
  setSheetsSpreadsheet: () => pf.sheetsSync.setSpreadsheet({ mode: 'create' }),
  backfillSheetsSync: () => pf.sheetsSync.backfill({ days: 30 }),
  syncSheetsNow: () => pf.sheetsSync.syncNow(),
  retrySheetsSync: () => pf.sheetsSync.retryFailed(),
  // Growth loops
  getReferralStats: () => pf.referrals.stats(),
  listReferredStores: () => pf.referrals.list(),
  getRecommendations: () => pf.recommendations.get(),
  updateRecommendations: () => pf.recommendations.update({ recommendable: true }),
  searchRecommendableCreators: () => pf.recommendations.search('ana'),
  getAgency: () => pf.agency.get(),
  createAgency: () => pf.agency.create({ name: 'Studio' }),
  updateAgency: () => pf.agency.update({ website: null }),
  listAgencyClients: () => pf.agency.clients(),
  removeAgencyClient: () => pf.agency.removeClient(ID),
  listAgencyStatements: () => pf.agency.statements(),
  getAgencyStatement: () => pf.agency.statement('2026-09'),
  getStoreAgency: () => pf.agencyAccess.get(),
  inviteAgency: () => pf.agencyAccess.invite('AGENCY1'),
  removeStoreAgency: () => pf.agencyAccess.remove(),
  previewAgency: () => pf.agencyAccess.preview('AGENCY1'),
  // A/B tests
  listAbTests: () => pf.abTests.list(),
  createAbTest: () => pf.abTests.create({ productId: ID, type: 'price', variants: [{ price: 39 }] }),
  assignAbTestVariant: () => pf.abTests.assign({ productId: ID, visitorId: 'v_1' }),
  getAbTest: () => pf.abTests.get(ID),
  deleteAbTest: () => pf.abTests.delete(ID),
  getAbTestResults: () => pf.abTests.results(ID),
  stopAbTest: () => pf.abTests.stop(ID),
  declareAbTestWinner: () => pf.abTests.declareWinner(ID, { variantId: 'var_b' }),
  // Loyalty and affiliate tiers
  getLoyaltySettings: () => pf.loyalty.getSettings(),
  updateLoyaltySettings: () => pf.loyalty.updateSettings({ enabled: false }),
  getLoyaltySummary: () => pf.loyalty.getSummary(),
  listLoyaltyMembers: () => pf.loyalty.listMembers(),
  listLoyaltyLedger: () => pf.loyalty.listActivity(),
  adjustLoyaltyPoints: () => pf.loyalty.adjustPoints({ email: 'a@b.test', points: 100 }),
  getAffiliateTiers: () => pf.affiliateTiers.get(),
  updateAffiliateTiers: () => pf.affiliateTiers.update({ enabled: false }),
  listAffiliateTierProgress: () => pf.affiliateTiers.listProgress(),
  getAffiliateTierProgress: () => pf.affiliateTiers.getProgress(ID),
  listAffiliateBonuses: () => pf.affiliateTiers.listBonuses(),
  getMyAffiliateTierProgress: () => pf.affiliateTiers.mine(),
  // Migrations
  listMigrationPlatforms: () => pf.migrations.platforms(),
  listMigrations: () => pf.migrations.list(),
  createMigration: () => pf.migrations.create({ source: 'csv' }),
  getMigration: () => pf.migrations.get(ID),
  addMigrationFile: () => pf.migrations.addFile(ID, { kind: 'products', csv: 'name\nBook' }),
  updateMigrationMapping: () => pf.migrations.updateMapping(ID, 'products', { name: 'Title' }),
  removeMigrationFile: () => pf.migrations.removeFile(ID, 'products'),
  listMigrationRows: () => pf.migrations.rows(ID, { kind: 'products' }),
  connectMigrationAccount: () => pf.migrations.connect(ID, 'tok_1'),
  dryRunMigration: () => pf.migrations.dryRun(ID),
  startMigration: () => pf.migrations.start(ID),
  cancelMigration: () => pf.migrations.cancel(ID),
  getMigrationReport: () => pf.migrations.report(ID),
  downloadMigrationErrors: () => pf.migrations.errorsCsv(ID),
};

/** `/discounts/apply/{discountCode}/{productId}` -> a matcher for the real path. */
const pathPattern = (path) =>
  new RegExp(`^${path.replace(/\{[^}]+\}/g, '[^/]+')}$`);

test('the fixture lists the public API operations', () => {
  assert.ok(spec.operations.length >= 337);
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
