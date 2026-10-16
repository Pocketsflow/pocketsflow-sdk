// Pocketsflow SDK
// Official Node.js/TypeScript SDK for the Pocketsflow API

export { Pocketsflow } from './client';

// Webhook signature verification
export {
  verifyWebhookSignature,
  verifyWebhookSignatureV1,
  constructWebhookEvent,
  generateWebhookSignatureHeader,
  WEBHOOK_SIGNATURE_V2_HEADER,
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_EVENT_ID_HEADER,
  WEBHOOK_EVENT_HEADER,
  DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
} from './webhooks';
export type {
  WebhookPayload,
  WebhookHeaders,
  VerifyWebhookSignatureOptions,
  ConstructWebhookEventOptions,
} from './webhooks';

// Export all types
export type {
  // Configuration
  PocketsflowConfig,

  // Common
  PaginationParams,
  Pagination,
  PaginatedResponse,
  DateRangeParams,

  // Products
  Product,
  ProductFile,
  ProductType,
  CreditAutoRefill,
  ProductFields,
  CreateProductParams,
  UpdateProductParams,
  CopyCatalogItemParams,
  ProductAvailability,
  ProductLicenseKeySettings,
  ProductAbandonedCheckout,

  // Variants
  ProductVariant,
  CreateVariantParams,

  // Orders
  Order,
  OrderFees,
  PurchasedUpsell,
  ListOrdersParams,
  OrdersResponse,
  OrderDetail,

  // Payments
  Payment,
  PaymentDetail,
  ListPaymentsParams,
  PaymentsResponse,
  GetPaymentParams,

  // Customers
  Customer,
  CustomerProduct,
  ListCustomersParams,
  CustomerDetail,

  // Newsletters
  EmailSubscriber,
  ListEmailSubscribersParams,
  ProductAudience,
  SyncAudienceParams,
  AudienceSyncResult,
  Post,
  PostStatus,
  PostFields,
  ListPostsParams,
  CreatePostParams,
  UpdatePostParams,
  SendPostResult,
  SendEmailParams,
  SendEmailResult,

  // Reviews
  Review,
  ListReviewsParams,

  // Discounts
  Discount,
  CreateDiscountParams,
  UpdateDiscountParams,

  // Upsells
  Upsell,
  UpsellStyle,
  SaleWithUpsell,
  UpsellsResponse,
  CreateUpsellParams,
  UpdateUpsellParams,

  // Subscriptions
  Subscription,
  ListSubscriptionsParams,
  Subscriber,
  SubscriberStatus,
  SubscriberDetail,
  ListSubscribersParams,
  SubscribersResponse,
  GetSubscriberParams,
  MembershipActionResult,
  SubscriberOrderHistory,
  SubscriptionOffer,
  CreateSubscriptionOfferParams,
  DeletedSubscriptionOffer,

  // Webhooks
  Webhook,
  CreatedWebhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookEvent,
  WebhookEventPayload,
  WebhookSecretRotation,
  WebhookTestResult,
  WebhookDelivery,
  ListWebhookDeliveriesParams,
  WebhookDeliveriesResponse,
  WebhookRedeliveryResult,
  OrderPostPurchaseAcceptedEvent,
  FunnelLeadEvent,

  // User
  User,
  UpdateUserParams,
  TrackingPixels,
  TrackingPixelsUpdate,
  UpdateTrackingPixelsParams,

  // Plans and entitlements
  PlanId,
  FeatureKey,
  FeatureEntitlement,
  Entitlements,
  EntitlementsResult,
  Plan,
  FeatureLockedDetails,
  SeatLimitDetails,

  // Checkout
  CreateCheckoutParams,
  CheckoutSession,
  AbandonedCheckoutSummary,

  // Refund policies
  RefundPolicy,
  CreateRefundPolicyParams,
  UpdateRefundPolicyParams,
  Refund,
  CreateRefundParams,

  // Creator page (Link in Bio)
  CreatorPage,
  CreatorPageLink,
  CreatorPageTemplate,
  CreatorPageFields,
  CreateCreatorPageParams,
  UpdateCreatorPageParams,
  CreatorPageUsernameUpdate,

  // Images
  ImageUploadInput,
  UploadImageOptions,
  UploadedImage,

  // Partners
  Partner,
  PartnerPagination,
  PartnerListParams,
  PartnerListResponse,
  PartnerStats,
  ReferredUser,
  ReferralSale,
  ReferralRegistration,

  // Weekly report
  WeeklyReportSettings,
  UpdateWeeklyReportSettingsParams,
  WeeklyReportPeriod,
  WeeklyReportNextStepId,
  WeeklyReportNextStep,
  WeeklyReport,
  WeeklyReportPreview,

  // Tracked links
  TrackedLinkChannel,
  TrackedLinkUtm,
  TrackedLink,
  TrackedLinkStats,
  TrackedLinkDay,
  TrackedLinkStatsParams,
  ListTrackedLinksParams,
  TrackedLinkWithStats,
  TrackedLinkListResponse,
  TrackedLinkStatsResponse,
  CreateTrackedLinkParams,
  UpdateTrackedLinkParams,
  TrackedLinkSlugCheck,

  // Store badge
  StoreBadge,
  StoreBadgeFreeMonths,
  StoreBadgeReferralStats,
  UpdateStoreBadgeParams,

  // Team
  TeamRole,
  TeamArea,
  TeamMember,
  TeamInvite,
  Team,
  TeamRecord,
  TeamOverview,
  TeamActivityAction,
  TeamActivity,
  ListTeamActivityParams,
  TeamActivityResponse,
  InviteTeamMemberParams,
  TeamInviteCreated,
  TeamInviteResent,
  UpdateTeamMemberParams,
  TeamMemberUpdate,
  CreateTeamParams,
  UpdateTeamParams,
  TeamOk,

  // Post-purchase offers and social proof
  PostPurchaseOffer,
  UpdatePostPurchaseOfferParams,
  SocialProofWindow,
  SocialProofSettings,
  UpdateSocialProofSettingsParams,
  SocialProof,

  // Sales funnels
  FunnelTemplateId,
  FunnelStatus,
  FunnelTemplate,
  ListFunnelTemplatesParams,
  CreateFunnelParams,
  FunnelStats,
  Funnel,
  FunnelProductSummary,
  FunnelListItem,
  FunnelDetail,
  FunnelAnalytics,

  // License keys
  LicenseKey,
  ListLicenseKeysParams,
  LicenseKeysResponse,
  LicenseKeyCheckParams,
  DeactivateLicenseKeyParams,
  LicenseValidation,

  // Errors
  ApiError,
} from './types';

export {
  PocketsflowError,
  FeatureLockedError,
  SeatLimitError,
  UPGRADE_URL,
  WEBHOOK_EVENTS,
} from './types';
