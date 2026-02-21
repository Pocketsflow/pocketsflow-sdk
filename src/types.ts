// ============================================================================
// Pocketsflow SDK Types
// ============================================================================

// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------

export interface PocketsflowConfig {
  /** Your Pocketsflow API key (pk_live_... or pk_test_...) */
  apiKey: string;
  /** Base URL for the API (defaults to https://api.pocketsflow.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
}

// ----------------------------------------------------------------------------
// Common Types
// ----------------------------------------------------------------------------

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// ----------------------------------------------------------------------------
// Products
// ----------------------------------------------------------------------------

export interface Product {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  type: 'one-time' | 'subscription';
  billingInterval?: 'month' | 'year';
  active: boolean;
  published: boolean;
  slug?: string;
  images?: string[];
  files?: ProductFile[];
  testMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFile {
  name: string;
  url: string;
  size?: number;
}

export interface CreateProductParams {
  /** Product name (required) */
  name: string;
  /** Product description */
  description?: string;
  /** Product price (required, defaults to 0) */
  price: number;
  /** Product subtitle */
  subtitle?: string;
  /** Whether customer can pay what they want */
  payWant?: boolean;
  /** Minimum price for pay-what-you-want */
  minPrice?: number;
  /** Maximum price for pay-what-you-want */
  maxPrice?: number;
  /** Whether product is published */
  published?: boolean;
  /** Product slug for URL */
  slug?: string;
  /** Thumbnail image URL */
  thumbnail?: string;
  /** Product images array */
  images?: string[];
  /** Call to action text */
  ctaText?: string;
  /** Show sales count */
  showSales?: boolean;
  /** Show reviews */
  showReviews?: boolean;
  /** Refund policy text */
  refundPolicy?: string;
  /** Callback URL for redirects */
  callbackUrl?: string;
  /** Collect first name */
  hasFirstName?: boolean;
  /** Collect last name */
  hasLastName?: boolean;
}

export interface UpdateProductParams {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  active?: boolean;
  published?: boolean;
}

// ----------------------------------------------------------------------------
// Product Variants
// ----------------------------------------------------------------------------

export interface ProductVariant {
  _id: string;
  productId: string;
  name: string;
  price: number;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantParams {
  productId: string;
  name: string;
  price: number;
  description?: string;
}

// ----------------------------------------------------------------------------
// Orders
// ----------------------------------------------------------------------------

export interface Order {
  _id: string;
  userId: string;
  productId: string;
  buyerEmail: string;
  grossAmount: number;
  netAmount: number;
  taxAmount: number;
  stripeFee?: number;
  paypalFee?: number;
  affiliateCut?: number;
  currency: string;
  country?: string;
  isRefunded: boolean;
  isDisputed: boolean;
  testMode: boolean;
  product?: Product;
  customer?: {
    _id: string;
    buyerEmail: string;
  };
  createdAt: string;
}

export interface ListOrdersParams extends PaginationParams, DateRangeParams {
  productId?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// ----------------------------------------------------------------------------
// Customers
// ----------------------------------------------------------------------------

export interface Customer {
  _id: string;
  userId: string;
  buyerEmail: string;
  country?: string;
  numberOfOrders: number;
  totalSpent: number;
  testMode: boolean;
  createdAt: string;
}

export interface ListCustomersParams {
  email?: string;
  productId?: string;
  sortBy?: 'email' | 'country' | 'numberOfOrders' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ----------------------------------------------------------------------------
// Reviews
// ----------------------------------------------------------------------------

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  buyerEmail: string;
  rating: number;
  review?: string;
  testMode: boolean;
  createdAt: string;
}

export interface ListReviewsParams {
  productId?: string;
}

// ----------------------------------------------------------------------------
// Discounts
// ----------------------------------------------------------------------------

export interface Discount {
  _id: string;
  userId: string;
  name: string;
  code: string;
  value: number;
  valueType: 'percentage' | 'fixed';
  active: boolean;
  mainProductIds: string[];
  expiration?: string;
  used?: number;
  testMode: boolean;
  createdAt: string;
}

export interface CreateDiscountParams {
  /** Discount name (required) */
  name: string;
  /** Discount code (required) - what customers enter at checkout */
  code: string;
  /** Discount value (required) */
  value: number;
  /** Value type: 'percentage' or 'fixed' (defaults to 'percentage') */
  valueType?: 'percentage' | 'fixed';
  /** Whether discount is active (defaults to true) */
  active?: boolean;
  /** Product IDs this discount applies to (required) */
  mainProductIds: string[];
  /** Expiration date (ISO 8601 string) */
  expiration?: string;
}

export interface UpdateDiscountParams {
  name?: string;
  code?: string;
  value?: number;
  valueType?: 'percentage' | 'fixed';
  active?: boolean;
  mainProductIds?: string[];
  expiration?: string;
}

// ----------------------------------------------------------------------------
// Upsells
// ----------------------------------------------------------------------------

export interface Upsell {
  _id: string;
  userId: string;
  name: string;
  mainProductIds: string[];
  upsellProductId: string;
  upsellPrice: number;
  upsellDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  offer?: string;
  active: boolean;
  testMode: boolean;
  createdAt: string;
}

export interface UpsellsResponse {
  upsells: Upsell[];
  salesWithUpsells: any[];
}

export interface CreateUpsellParams {
  /** Upsell name */
  name?: string;
  /** Offer text/headline */
  offer?: string;
  /** Product IDs that trigger this upsell (required) */
  mainProductIds: string[];
  /** Product ID to upsell (required) */
  upsellProductId: string;
  /** Upsell price (required) */
  upsellPrice: number;
  /** Upsell description shown to customer */
  upsellDescription?: string;
  /** Primary button text (e.g., "Yes, add this!") */
  primaryButtonText?: string;
  /** Secondary button text (e.g., "No thanks") */
  secondaryButtonText?: string;
  /** Whether upsell is active (defaults to true) */
  active?: boolean;
}

export interface UpdateUpsellParams {
  name?: string;
  mainProductIds?: string[];
  upsellProductId?: string;
  upsellPrice?: number;
  upsellDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  offer?: string;
  active?: boolean;
}

// ----------------------------------------------------------------------------
// Subscriptions
// ----------------------------------------------------------------------------

export interface Subscription {
  _id: string;
  userId: string;
  customerId: string;
  productId: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'canceled' | 'paused' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  testMode: boolean;
  createdAt: string;
}

export interface ListSubscriptionsParams extends PaginationParams, DateRangeParams {
  status?: 'active' | 'canceled' | 'paused';
}

// ----------------------------------------------------------------------------
// Webhooks
// ----------------------------------------------------------------------------

export interface Webhook {
  _id: string;
  userId: string;
  url: string;
  events: string[];
  description?: string;
  active: boolean;
  secret: string;
  testMode: boolean;
  createdAt: string;
}

export interface CreateWebhookParams {
  /** Webhook endpoint URL (required) */
  url: string;
  /** Events to subscribe to (required) */
  events: WebhookEvent[];
  /** Webhook description */
  description?: string;
  /** Whether webhook is active (defaults to true) */
  active?: boolean;
}

/** Available webhook events */
export type WebhookEvent =
  | 'order.completed'
  | 'order.refunded'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'review.created'
  | 'customer.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'invoice.created'
  | 'invoice.upcoming'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'customer.subscription.trial_will_end'
  | 'customer.subscription.pause'
  | 'customer.subscription.resumed'
  | 'identity.verification_session.verified'
  | 'identity.verification_session.processing'
  | 'identity.verification_session.requires_input';

export interface UpdateWebhookParams {
  url?: string;
  events?: string[];
  description?: string;
  active?: boolean;
}

// ----------------------------------------------------------------------------
// User / Account
// ----------------------------------------------------------------------------

export interface User {
  _id: string;
  userId: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  subdomain?: string;
  currency: string;
  country?: string;
  testMode: boolean;
  hasSales: boolean;
  createdFirstProduct?: boolean;
}

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  currency?: string;
  country?: string;
  subdomain?: string;
  contactEmail?: string;
}

// ----------------------------------------------------------------------------
// Checkout
// ----------------------------------------------------------------------------

export interface CreateCheckoutParams {
  productId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  discountCode?: string;
  metadata?: Record<string, any>;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

// ----------------------------------------------------------------------------
// Refunds
// ----------------------------------------------------------------------------

export interface Refund {
  _id: string;
  orderId: string;
  amount: number;
  reason?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface CreateRefundParams {
  orderId: string;
  amount?: number;
  reason?: string;
}

// ----------------------------------------------------------------------------
// API Error
// ----------------------------------------------------------------------------

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export class PocketsflowError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'PocketsflowError';
    this.code = code;
    this.status = status;
  }
}
