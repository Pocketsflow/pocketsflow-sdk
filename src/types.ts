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
  /** 1-based page number (defaults to 1). */
  page?: number;
  /** Items per page (defaults to 20, maximum 100 — larger values are capped at 100). */
  pageSize?: number;
}

/** Page metadata returned by the paginated list endpoints. */
export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  /** Whether `currentPage + 1` has results. */
  hasMore: boolean;
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

/**
 * Optional params for `products.copy` (POST /products/copy/{id}).
 *
 * The endpoint duplicates one of your catalog items — a one-time product or
 * a subscription offer, whichever owns the id. Omit `testMode` to copy
 * within the source's own mode; send `{ testMode: false }` to copy a
 * test-mode offer into live mode ("Copy to live"). The copy gets a
 * deduplicated "Name (Copy)" name and starts unpublished when copied into
 * live mode.
 */
export interface CopyCatalogItemParams {
  /** Target mode of the copy. Omit to copy within the source's own mode. */
  testMode?: boolean;
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

/**
 * An order as listed by `GET /orders`: a one-time sale plus its product,
 * customer reference, fee breakdown and purchased upsells. Subscription
 * payments are not orders — list them with `payments.list()`.
 */
export interface Order extends Payment, OrderFees {
  _id: string;
  userId: string;
  productId: string;
  buyerEmail: string;
  grossAmount: number;
  netAmount: number;
  taxAmount: number;
  /** @deprecated Legacy processor fee on older sales; read `processingFee` / `fee`. */
  stripeFee?: number;
  /** @deprecated Legacy processor fee on older sales; read `processingFee` / `fee`. */
  paypalFee?: number;
  affiliateCut?: number;
  currency: string;
  /** Buyer country (ISO code). */
  country?: string;
  isRefunded: boolean;
  isDisputed: boolean;
  testMode: boolean;
  /** The purchased product (null if it was deleted). */
  product?: Product | null;
  customer?: {
    /** Customer id (null if there is no customer record). */
    _id: string | null;
    buyerEmail: string;
  };
  /** Applied discount id, if any. */
  discountId?: string;
  /** Purchased variant id, if any. */
  variantId?: string;
  /** Gross amount collected (= `grossAmount`). Decimal, not cents. */
  gross?: number;
  /** Tax collected (= `taxAmount`). Decimal, not cents. */
  taxes?: number;
  /** Amount paid for the legacy upsell. Decimal, not cents. */
  upsellAmount?: number;
  /** Legacy single upsell product, if one was bought. */
  upsellProduct?: Product | null;
  /** Upsells bought with this order. */
  purchasedUpsells?: PurchasedUpsell[];
  createdAt: string;
}

/** An upsell bought together with an order. */
export interface PurchasedUpsell {
  upsellId?: string;
  productId?: string;
  name?: string;
  /** Decimal amount, not cents. */
  amount?: number;
  currency?: string;
  purchasedAt?: string;
  product?: Product | null;
}

/** Fee breakdown of a sale. Every amount is decimal in major units, not cents. */
export interface OrderFees {
  /** Pocketsflow platform fee, as locked at checkout (order currency). */
  platformFee?: number;
  /** `stored` = locked at checkout; `estimated` = older sale (2% estimate); `none` = no fee. */
  platformFeeSource?: 'stored' | 'estimated' | 'none';
  /** Payment processing fee (excludes affiliate commission — see `affiliateFee`). */
  processingFee?: number;
  /** Affiliate commission deducted from this sale. */
  affiliateFee?: number;
  /** Affiliate commission paid out of this sale. */
  affiliateCut?: number;
  /** platformFee + processingFee. Null until the settled amount is known. */
  totalTransactionCost?: number | null;
  /** totalTransactionCost + affiliateFee. Null until the settled amount is known. */
  totalDeductions?: number | null;
  /** totalTransactionCost as a percentage of the pre-tax amount (`7.9` = 7.9%). */
  effectiveFeeRate?: number | null;
  /** Legacy processor fee (older card / PayPal sales only). */
  fee?: number;
  /** amountBeforeTax − affiliateCut − legacy processor fee. */
  net?: number;
  /** Stored settled net amount, or null when not recorded. */
  netAmount?: number | null;
}

export interface ListOrdersParams extends PaginationParams, DateRangeParams {
  productId?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

// ----------------------------------------------------------------------------
// Payments — the ledger of every sale (one-time and subscription)
// ----------------------------------------------------------------------------

/**
 * A payment (a sale): a one-time product purchase or a subscription charge
 * (the initial charge or a renewal). Amounts are decimal in major units of
 * `currency`, not cents.
 */
export interface Payment {
  _id: string;
  buyerEmail?: string;
  firstName?: string;
  lastName?: string;
  /** Charged amount (after tax), in the payment currency. */
  amount?: number;
  /** Amount before tax was applied. */
  amountBeforeTax?: number;
  /** Gross amount collected from the buyer. */
  grossAmount?: number;
  /** Tax collected on this payment. */
  taxAmount?: number;
  currency?: string;
  isRefunded?: boolean;
  isDisputed?: boolean;
  /** `true` for subscription payments (initial + renewals). */
  isSubscription?: boolean;
  /** Subscription payments only: `initial` for the first charge, `renewal` afterwards. */
  billingReason?: 'initial' | 'renewal';
  /** The product purchased. Empty on subscription payments — use `subscriptionId`. */
  productId?: string;
  /** The subscription offer this payment belongs to. Empty on one-time purchases. */
  subscriptionId?: string;
  /** The payments partner payment (receipt) id backing this sale (`pay_…`). */
  partnerPaymentId?: string;
  /** The payments partner plan id this payment was charged against (`plan_…`). */
  partnerPlanId?: string;
  /** The payments partner membership id (`mem_…`), subscription payments only. */
  membershipId?: string;
  /** @deprecated Read `partnerPaymentId`. */
  whopPaymentId?: string;
  /** @deprecated Read `partnerPlanId`. */
  whopPlanId?: string;
  /** @deprecated Read `membershipId`. */
  whopMembershipId?: string;
  testMode?: boolean;
  createdAt?: string;
}

export interface ListPaymentsParams extends PaginationParams, DateRangeParams {
  /** `one_time`, `subscription`, or `all` (default). */
  type?: 'one_time' | 'subscription' | 'all';
  /** Only payments for this product. */
  productId?: string;
  /** Only payments for this subscription offer. */
  subscriptionId?: string;
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: Pagination;
}

export interface GetPaymentParams {
  /** Also fetch the authoritative live payment from the payments partner. */
  live?: boolean;
}

/** `GET /payments/{id}`: one payment with its product or offer and customer. */
export interface PaymentDetail {
  payment: Payment & {
    /** Legacy processor fee (older card / PayPal sales). */
    fee?: number;
    /** Net to the seller (amountBeforeTax − affiliateCut − legacy processor fee). */
    net?: number;
    /** The raw stored payment payload from the payments partner. */
    metadata?: Record<string, unknown>;
  };
  /** The purchased product (one-time purchases only). */
  product: Product | null;
  /** The subscription offer (subscription payments only). */
  subscription: SubscriptionOffer | null;
  /** The buyer's customer record. */
  customer: Customer | null;
  /** The stored payments partner payload for this payment. */
  paymentsPartner?: Record<string, unknown>;
  /**
   * The stored payments partner payload for this payment.
   * @deprecated Read `paymentsPartner` (fall back to this field on API
   * responses that do not carry it yet).
   */
  whop?: Record<string, unknown>;
  /**
   * Only with `{ live: true }`: the live payment fetched from the payments
   * partner, or `null` if that lookup failed.
   */
  paymentsPartnerLive?: Record<string, unknown> | null;
  /** @deprecated Read `paymentsPartnerLive`. */
  whopLive?: Record<string, unknown> | null;
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
  /**
   * Every product and subscription this buyer has bought (any purchase, not
   * just the first). Returned by `customers.list()`.
   */
  products?: CustomerProduct[];
}

/** A product or subscription a customer bought. */
export interface CustomerProduct {
  _id: string;
  name: string;
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
// Newsletters — email subscribers and product audiences
// ----------------------------------------------------------------------------

/** A contact on your email list (not a subscription membership). */
export interface EmailSubscriber {
  _id: string;
  userId: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  tags: string[];
  /** Products and subscriptions this contact bought — their product audiences. */
  productIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListEmailSubscribersParams {
  /** Only contacts in this product audience (a product or subscription ID). */
  productId?: string;
}

/** Everyone who bought one product or subscription, as an email audience. */
export interface ProductAudience {
  /** Product or subscription ID. */
  productId: string;
  name: string;
  kind: 'product' | 'subscription';
  /** Contacts already on your list in this audience. */
  subscribers: number;
  /** Buyers of this product, on your list or not. */
  customers: number;
}

export interface SyncAudienceParams {
  /** Product or subscription ID. Omit to add every buyer. */
  productId?: string;
}

export interface AudienceSyncResult {
  /** Buyers found. */
  customers: number;
  /** New contacts added to your list. */
  added: number;
  /** Existing contacts newly linked to the product. */
  updated: number;
  /** Buyers who had unsubscribed: linked, but never emailed. */
  unsubscribed: number;
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
  /** Only subscriptions to this subscription offer. */
  productId?: string;
  /**
   * @deprecated Ignored by the API. Filter by status with
   * `subscribers.list({ status })` instead.
   */
  status?: 'active' | 'canceled' | 'paused';
}

/** Live membership status of a subscriber, maintained from payments partner events. */
export type SubscriberStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'succeeded'
  | 'refunded'
  | 'paused';

/** A buyer with a membership in one of your subscription offers. */
export interface Subscriber {
  _id: string;
  buyerEmail?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  /** The subscription offer this subscriber belongs to. */
  subscriptionId?: string;
  /** The joined subscription offer. */
  subscription?: SubscriptionOffer | null;
  status?: SubscriberStatus;
  /** Whether the membership is currently active. */
  active?: boolean;
  /** Whether the membership is scheduled to cancel at the end of the current period. */
  cancelAtPeriodEnd?: boolean;
  /**
   * The subscriber's hosted self-service portal link, including its
   * `?token=…` capability. Send it to the buyer exactly as returned.
   */
  portalUrl?: string;
  /**
   * The payments partner membership id (`mem_…`). Accepted as `id` by
   * `subscribers.cancel()`, `.pause()` and `.resume()`.
   */
  membershipId?: string;
  /**
   * The payments partner membership id (`mem_…`).
   * @deprecated Read `membershipId` (fall back to this field on API
   * responses that do not carry it yet).
   */
  whopMembershipId?: string;
  /** The payments partner plan id (`plan_…`) for this subscriber. */
  partnerPlanId?: string;
  /** @deprecated Read `partnerPlanId` (this legacy field holds the plan id). */
  whopSubscriptionId?: string;
  testMode?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListSubscribersParams extends PaginationParams {
  status?: SubscriberStatus;
  /** Only subscribers with this email. */
  buyerEmail?: string;
  /** Alias of `buyerEmail`. */
  email?: string;
  /** Only subscribers of this subscription offer. */
  subscriptionId?: string;
}

export interface SubscribersResponse {
  subscribers: Subscriber[];
  pagination: Pagination;
}

export interface GetSubscriberParams {
  /** Also fetch the authoritative membership from the payments partner. */
  live?: boolean;
}

/** `GET /subscriptions/subscribers/{id}`: one subscriber and its payment history. */
export interface SubscriberDetail {
  subscriber: Subscriber;
  subscription: SubscriptionOffer | null;
  customer: Customer | null;
  /** Live membership status. */
  status: SubscriberStatus | string;
  /** Every subscription payment: the initial charge plus every renewal. */
  payments: Payment[];
  /** Only with `{ live: true }`: the live membership from the payments partner. */
  membership?: Record<string, unknown> | null;
  /**
   * Only with `{ live: true }`: the live membership from the payments partner.
   * @deprecated Read `membership` (fall back to this field on API responses
   * that do not carry it yet).
   */
  whopMembership?: Record<string, unknown> | null;
}

/** Result of `subscribers.cancel()`, `.pause()` and `.resume()`. */
export interface MembershipActionResult {
  success: boolean;
  status?: string;
  cancelAtPeriodEnd?: boolean;
  /** Present on `pause()`. */
  paused?: boolean;
  /** Link where the membership can be managed. */
  manageUrl?: string;
}

/** A subscription offer — a recurring product you sell. */
export interface SubscriptionOffer {
  _id: string;
  userId: string;
  name: string;
  subtitle?: string;
  description?: string;
  price: number;
  currency?: string;
  frequency: 'weekly' | 'monthly' | 'yearly';
  trialPeriod?: number;
  published?: boolean;
  redirectBackUrl?: string;
  slug?: string;
  thumbnail?: string;
  images?: string[];
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSubscriptionOfferParams {
  /** Subscription offer name (required) */
  name: string;
  /** Recurring price in USD (required) */
  price: number;
  /** Billing frequency (required) */
  frequency: 'weekly' | 'monthly' | 'yearly';
  /** Short offer subtitle */
  subtitle?: string;
  /** Offer description */
  description?: string;
  /** Trial duration in days */
  trialPeriod?: number;
  /** Whether the offer is published */
  published?: boolean;
  /** Return URL used by the customer billing portal */
  redirectBackUrl?: string;
  /** Offer URL slug */
  slug?: string;
  /** Thumbnail URL */
  thumbnail?: string;
  /** Offer image URLs */
  images?: string[];
  /** Whether the offer is backed by a downloadable file */
  isFile?: boolean;
  /** File URL or uploaded file reference */
  file?: string | Record<string, unknown>;
  /** External offer URL */
  url?: string;
  /** Checkout copy and seller-facing configuration */
  checkoutText?: string;
  refundPolicy?: string;
  callbackUrl?: string;
  hasCallbackUrl?: boolean;
  hasFirstName?: boolean;
  hasLastName?: boolean;
  portalText?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  ctaText?: string;
  thankYouText?: string;
  hasProductPage?: boolean;
  showSales?: boolean;
  showReviews?: boolean;
  maxPrice?: number;
  minPrice?: number;
  design?: Record<string, unknown>;
  colors?: Record<string, unknown>;
  pageStyle?: Record<string, unknown>;
  checkoutStyle?: Record<string, unknown>;
  checkoutColors?: Record<string, unknown>;
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
  /**
   * Signing secret. Returned by `webhooks.create()`, `webhooks.get()` and
   * `webhooks.rotateSecret()` only — never by `list()` or `update()`.
   */
  secret?: string;
  /** Mode of the endpoint — it only receives events from that mode. */
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** Response of `webhooks.create()`. Store `secret` to verify deliveries. */
export interface CreatedWebhook {
  /** Webhook id. */
  id: string;
  url: string;
  events: string[];
  description?: string;
  /** Signing secret for verifying deliveries. */
  secret: string;
}

export interface CreateWebhookParams {
  /** Endpoint URL (required). Must be https:// and publicly reachable. */
  url: string;
  /** Events to subscribe to — a non-empty list (required) */
  events: WebhookEvent[];
  /** Optional description (at most 500 characters) */
  description?: string;
  /**
   * @deprecated Ignored by the API: new webhooks always start active. Use
   * `webhooks.update(id, { active: false })` to pause one.
   */
  active?: boolean;
}

/** Webhook event types you can subscribe to. */
export type WebhookEvent =
  | 'order.completed'
  | 'order.refunded'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'review.created'
  | 'customer.created'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'customer.subscription.pause'
  | 'customer.subscription.resumed'
  | 'customer.subscription.trial_will_end'
  | 'invoice.created'
  | 'invoice.upcoming'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'credit.granted'
  | 'credit.balance_changed'
  | 'credit.auto_refill.succeeded'
  | 'credit.auto_refill.failed'
  | 'credit.consent.enabled'
  | 'credit.consent.disabled';

export interface UpdateWebhookParams {
  /** New https:// endpoint URL */
  url?: string;
  /** Replaces the subscribed events (a non-empty list of `WebhookEvent` values) */
  events?: string[];
  /** At most 500 characters */
  description?: string;
  /** `false` pauses deliveries */
  active?: boolean;
}

/** Response of `webhooks.rotateSecret()`. */
export interface WebhookSecretRotation {
  /** Webhook id. */
  id: string;
  /** The new signing secret — deliveries are signed with it immediately. */
  secret: string;
}

/** Response of `webhooks.test()`. */
export interface WebhookTestResult {
  message: 'Test webhook sent' | 'Test webhook delivery failed' | string;
  /** The event type that was sent. */
  event?: string;
  /** The event id (`evt_…`). */
  eventId?: string;
  /** Id of the delivery-log entry (`webhooks.deliveries.get()`). */
  deliveryId?: string;
  /** Whether your endpoint answered 2xx. */
  delivered?: boolean;
  /** HTTP status your endpoint returned, if any. */
  status?: number;
  durationMs?: number;
  /** Failure reason, if any. */
  error?: string;
  /** Legacy shape, kept for older clients. */
  results?: Array<Record<string, unknown>>;
}

/** One webhook delivery attempt from the delivery log (kept for 30 days). */
export interface WebhookDelivery {
  _id: string;
  /** The endpoint it was sent to. */
  webhookId: string;
  /** Endpoint URL at the time of sending. */
  url?: string;
  event: WebhookEvent | 'test.event' | string;
  /** The event id (`evt_…`) — shared by retries and redeliveries. */
  eventId?: string;
  /** Attempt number (1 = first try). */
  attempt?: number;
  /** Whether the endpoint answered 2xx. */
  isSuccessful?: boolean;
  /** HTTP status the endpoint returned, if any. */
  status?: number;
  durationMs?: number;
  /** Failure reason, if any. */
  error?: string;
  /** `true` for `webhooks.test()` deliveries. */
  isTest?: boolean;
  /** The delivery this one replayed. */
  redeliveryOf?: string;
  /** The exact JSON body that was sent (a string). */
  webhookData?: string;
  testMode?: boolean;
  sentDate?: string;
  deliveredAt?: string;
  /** When the log entry is deleted. */
  expiresAt?: string;
}

export interface ListWebhookDeliveriesParams extends PaginationParams {
  /** Only deliveries to this endpoint. */
  webhookId?: string;
  /** Only deliveries of this event type. */
  event?: WebhookEvent | 'test.event';
}

export interface WebhookDeliveriesResponse {
  deliveredWebhooks: WebhookDelivery[];
  pagination: Pagination;
}

/** Response of `webhooks.deliveries.redeliver()`. */
export interface WebhookRedeliveryResult {
  message: 'Webhook redelivered' | 'Webhook redelivery failed' | string;
  /** Whether your endpoint answered 2xx. */
  delivered: boolean;
  /** Id of the new delivery-log entry. */
  deliveryId?: string;
  eventId?: string;
  event?: string;
  attempt?: number;
  /** HTTP status your endpoint returned, if any. */
  status?: number;
  durationMs?: number;
  error?: string;
}

/**
 * The JSON body of a webhook delivery: the envelope fields (`id`, `type`,
 * `created`, `webhookId`) sit next to the event's own fields.
 */
export interface WebhookEventPayload {
  /** Event id (`evt_…`) — same as the `X-Pocketsflow-Event-Id` header. Retries share it. */
  id: string;
  /** Event type — same as the `X-Pocketsflow-Event` header. */
  type: WebhookEvent | 'test.event' | string;
  /** When the event was created, Unix seconds. */
  created: number;
  /** The endpoint this delivery was sent to. */
  webhookId: string;
  /** `true` on deliveries sent by `webhooks.test()`. */
  test?: boolean;
  /** Echo of the checkout `clientReferenceId` (order and subscription events). */
  clientReferenceId?: string | null;
  /** Echo of the checkout `metadata` (order and subscription events). */
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
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
