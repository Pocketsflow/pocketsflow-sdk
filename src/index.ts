// Pocketsflow SDK
// Official Node.js/TypeScript SDK for the Pocketsflow API

export { Pocketsflow } from './client';

// Export all types
export type {
  // Configuration
  PocketsflowConfig,

  // Common
  PaginationParams,
  PaginatedResponse,
  DateRangeParams,

  // Products
  Product,
  ProductFile,
  CreateProductParams,
  UpdateProductParams,

  // Variants
  ProductVariant,
  CreateVariantParams,

  // Orders
  Order,
  ListOrdersParams,
  OrdersResponse,

  // Customers
  Customer,
  ListCustomersParams,

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
  SubscriptionOffer,
  CreateSubscriptionOfferParams,

  // Webhooks
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookEvent,

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
