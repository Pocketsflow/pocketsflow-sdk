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
  CreateProductParams,
  UpdateProductParams,
  CopyCatalogItemParams,

  // Variants
  ProductVariant,
  CreateVariantParams,

  // Orders
  Order,
  OrderFees,
  PurchasedUpsell,
  ListOrdersParams,
  OrdersResponse,

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

  // Newsletters
  EmailSubscriber,
  ListEmailSubscribersParams,
  ProductAudience,
  SyncAudienceParams,
  AudienceSyncResult,

  // Reviews
  Review,
  ListReviewsParams,

  // Discounts
  Discount,
  CreateDiscountParams,
  UpdateDiscountParams,

  // Upsells
  Upsell,
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
  SubscriptionOffer,
  CreateSubscriptionOfferParams,

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

  // User
  User,
  UpdateUserParams,

  // Checkout
  CreateCheckoutParams,
  CheckoutSession,

  // Refunds
  Refund,
  CreateRefundParams,

  // Errors
  ApiError,
} from './types';

export { PocketsflowError } from './types';
