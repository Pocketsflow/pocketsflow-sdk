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
  subtitle?: string;
  description?: string;
  price: number;
  /** Struck-through "was" price shown next to `price`. */
  compareAtPrice?: number;
  /** @deprecated Not returned by the API; products are priced in your account currency. */
  currency: string;
  /** @deprecated Not returned by the API. Subscriptions are `SubscriptionOffer`s. */
  type: 'one-time' | 'subscription';
  /** @deprecated Not returned by the API. */
  billingInterval?: 'month' | 'year';
  /** @deprecated Not returned by the API; read `published`. */
  active: boolean;
  published: boolean;
  /** Pay-what-you-want pricing. */
  payWant?: boolean;
  minPrice?: number;
  maxPrice?: number;
  /** Whether the product has its own product page (`unknown` on older products). */
  hasProductPage?: 'yes' | 'no' | 'unknown';
  slug?: string;
  thumbnail?: string;
  images?: string[];
  /** What the buyer gets: a file, a URL, a course or credits. */
  productType?: ProductType;
  /** Delivered file (for `productType: 'file'`). */
  file?: string;
  /** Delivered URL (for `productType: 'url'`). */
  url?: string;
  /** @deprecated Not returned by the API; read `file`. */
  files?: ProductFile[];
  refundPolicy?: string;
  showSales?: boolean;
  showReviews?: boolean;
  hasFirstName?: boolean;
  hasLastName?: boolean;
  ctaText?: string;
  checkoutText?: string;
  thankYouText?: string;
  /** Credits products only: automatic top-off settings. */
  creditAutoRefill?: CreditAutoRefill;
  /**
   * Abandoned checkout recovery (Growth plan): a buyer who leaves this
   * product's checkout gets one recovery email. On by default. Read-only
   * here — change it with `products.setAbandonedCheckout()`.
   */
  abandonedCheckoutEnabled?: boolean;
  /** Offer "This is a gift" at checkout. */
  allowGifts?: boolean;
  /** `available` (default), `preorder` or `waitlist`. */
  availability?: ProductAvailability;
  /** Pre-order release date (ISO 8601), while `availability` is `preorder`. */
  releaseAt?: string | null;
  /** When the product was last released from pre-order (read-only). */
  releasedAt?: string;
  /** License keys issued with every sale of this product. */
  licenseKeys?: ProductLicenseKeySettings;
  testMode: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * `available`: on sale as usual. `preorder`: buyers pay now and the content
 * unlocks on `releaseAt`. `waitlist`: no checkout; the page collects emails.
 */
export type ProductAvailability = 'available' | 'preorder' | 'waitlist';

/** License key settings of a product. */
export interface ProductLicenseKeySettings {
  /** Every sale of this product gets one key. */
  enabled?: boolean;
  /** Activations per key (1 – 10,000), or null for unlimited. */
  activationLimit?: number | null;
}

/** What a product or subscription offer delivers. */
export type ProductType = 'file' | 'url' | 'course' | 'credits';

/** Credits products: automatic top-off of a buyer's balance. */
export interface CreditAutoRefill {
  enabled?: boolean;
  /** Amount to top off, in cents (0 – 100,000,000). */
  topOffCents?: number;
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

/** Writable product fields, shared by `products.create()` and `products.update()`. */
export interface ProductFields {
  /** Product price (defaults to 0) */
  price?: number;
  /** Struck-through "was" price shown next to `price` */
  compareAtPrice?: number;
  /** Product description */
  description?: string;
  /** Product subtitle */
  subtitle?: string;
  /** Whether product is published (defaults to true) */
  published?: boolean;
  /** Product slug for URL */
  slug?: string;
  /** Thumbnail image URL (upload one with `images.upload()`) */
  thumbnail?: string;
  /** Product image URLs */
  images?: string[];
  /** Whether the product has its own product page */
  hasProductPage?: 'yes' | 'no';
  /** Whether customer can pay what they want (defaults to false) */
  payWant?: boolean;
  /** Minimum price for pay-what-you-want */
  minPrice?: number;
  /** Maximum price for pay-what-you-want */
  maxPrice?: number;
  /** Refund policy text */
  refundPolicy?: string;
  /** Show sales count (defaults to true) */
  showSales?: boolean;
  /** Show reviews (defaults to true) */
  showReviews?: boolean;
  /** Collect first name (defaults to false) */
  hasFirstName?: boolean;
  /** Collect last name (defaults to false) */
  hasLastName?: boolean;
  /** What the buyer gets: a file, a URL, a course or credits */
  productType?: ProductType;
  /** Delivered file (for `productType: 'file'`) */
  file?: string;
  /** Delivered URL (for `productType: 'url'`) */
  url?: string;
  /** Call to action text */
  ctaText?: string;
  /** Checkout page copy */
  checkoutText?: string;
  /** Thank-you page copy */
  thankYouText?: string;
  /** Credits products only: automatic top-off settings */
  creditAutoRefill?: CreditAutoRefill;
  /** Offer "This is a gift" at checkout (defaults to true) */
  allowGifts?: boolean;
  /** `available` (default), `preorder` (needs `releaseAt`) or `waitlist` */
  availability?: ProductAvailability;
  /** Pre-order release date (ISO 8601): in the future, at most two years away */
  releaseAt?: string | null;
  /** Issue a license key with every sale */
  licenseKeys?: ProductLicenseKeySettings;
}

export interface CreateProductParams extends ProductFields {
  /** Product name (required) */
  name: string;
  /** @deprecated Not part of the documented API. */
  callbackUrl?: string;
}

export interface UpdateProductParams extends ProductFields {
  name?: string;
  /** @deprecated Ignored by the API; products are priced in your account currency. */
  currency?: string;
  /** @deprecated Ignored by the API; use `published`. */
  active?: boolean;
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
  /**
   * The rate `platformFee` was charged at, as a proportion: `0.02` (2%),
   * `0.01` on Volume, `0.005` on Volume Max. `0.02` when `platformFeeSource`
   * is `estimated`, null when it is `none`.
   */
  platformFeeRate?: number | null;
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

/**
 * `GET /orders/{id}`: one sale with its fee breakdown, the product (or
 * subscription offer), customer, review and upsells.
 */
export interface OrderDetail {
  /** The sale, with its fee breakdown. */
  sale: Payment & OrderFees;
  /** The purchased product or subscription offer (null if deleted). */
  product: Product | SubscriptionOffer | null;
  /** The subscription offer, for subscription payments. */
  subscription: SubscriptionOffer | null;
  customer: Customer | null;
  /** The buyer's review of this purchase, if any. */
  review: Review | null;
  /** Legacy single upsell product, if one was bought. */
  upsellProduct: Product | null;
  /** The upsell that was accepted, if any. */
  upsell: Upsell | null;
  /** Amount paid for the legacy upsell. Decimal, not cents. */
  upsellAmount?: number;
  upsellMetadata?: Record<string, unknown> | null;
  /** Upsells bought with this order. */
  purchasedUpsells?: PurchasedUpsell[];
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
  firstName?: string;
  lastName?: string;
  country?: string;
  /** The product or subscription of the buyer's first purchase. */
  productId?: string;
  /** Number of orders. Returned by `customers.list()`. */
  numberOfOrders: number;
  /** @deprecated Not returned by the API; `customers.get()` returns `stats`. */
  totalSpent: number;
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
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
  /** Only buyers of this product or subscription offer. */
  productId?: string;
  /** Defaults to `createdAt`. */
  sortBy?: 'email' | 'country' | 'numberOfOrders' | 'createdAt';
  /** Defaults to `desc`. */
  sortOrder?: 'asc' | 'desc';
  /** @deprecated Ignored by the API; filter the returned list instead. */
  email?: string;
  /** @deprecated Ignored by the API: the full list is returned. */
  limit?: number;
  /** @deprecated Ignored by the API: the full list is returned. */
  offset?: number;
}

/** `GET /customers/{id}`: a customer with their stats and history. */
export interface CustomerDetail {
  customer: Customer;
  /** Headline numbers: `sales`, `orders`, `subscriptions` and `since`. */
  stats: Array<{ id: 'sales' | 'orders' | 'subscriptions' | 'since' | string; value: unknown }>;
  /** The buyer's one-time payments. */
  orders: Payment[];
  /** The buyer's subscription memberships. */
  subscriptions: Subscriber[];
  reviews: Review[];
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

export type PostStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'automation';

/** A newsletter post (an email campaign) sent to your email list. */
export interface Post {
  _id: string;
  name: string;
  subject?: string;
  /** Inbox preview text. */
  preview?: string;
  fromName?: string;
  fromEmail?: string;
  replyToEmail?: string;
  contentHtml?: string;
  contentJson?: Record<string, unknown> | null;
  status: PostStatus;
  scheduledAt?: string;
  scheduledTimezone?: string;
  sentAt?: string;
  sentCount?: number;
  failedCount?: number;
  /** Why a send failed, if it did. */
  failureReason?: 'SEND_ALLOWANCE_EXCEEDED' | 'SELLER_BLOCKED';
  /** Send to every active subscriber. */
  sendToAll?: boolean;
  subscriberIds?: string[];
  /** Product audiences to send to. */
  productIds?: string[];
  tags?: string[];
  source?: 'dashboard' | 'api';
  createdAt?: string;
  updatedAt?: string;
}

export interface ListPostsParams {
  status?: PostStatus;
}

/** Writable post fields, shared by `newsletters.posts.create()` and `.update()`. */
export interface PostFields {
  subject?: string;
  /** Inbox preview text. */
  preview?: string;
  contentHtml?: string;
  contentJson?: Record<string, unknown>;
  fromName?: string;
  replyToEmail?: string;
  /** Defaults to `draft`. `scheduled` needs `scheduledAt`. */
  status?: 'draft' | 'scheduled' | 'automation';
  /** ISO 8601 date-time. */
  scheduledAt?: string;
  /** IANA time zone of `scheduledAt` (defaults to `UTC`). */
  scheduledTimezone?: string;
  /** Send to every active subscriber (defaults to false). */
  sendToAll?: boolean;
  subscriberIds?: string[];
  /** Product audiences to send to. */
  productIds?: string[];
  tags?: string[];
}

export interface CreatePostParams extends PostFields {
  /** Internal post name (required). */
  name: string;
}

export interface UpdatePostParams extends PostFields {
  name?: string;
}

/** Response of `newsletters.posts.send()`. */
export interface SendPostResult {
  message: 'Post queued for sending' | 'Post is already sending' | string;
  post: Post;
}

/** Params of `newsletters.send()`: a one-off transactional email. */
export interface SendEmailParams {
  /** One address, or 1 – 100 addresses. */
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  fromName?: string;
  replyTo?: string;
  /** Inbox preview text. */
  preview?: string;
}

/** Response of `newsletters.send()`. */
export interface SendEmailResult {
  /** Message id, or null when every recipient was skipped. */
  id: string | null;
  /** Recipients the email was sent to. */
  accepted: string[];
  /** Recipients skipped (for example, unsubscribed). */
  skipped: string[];
  skippedCount: number;
  status: 'sent' | 'skipped';
}

// ----------------------------------------------------------------------------
// Reviews
// ----------------------------------------------------------------------------

export interface Review {
  _id: string;
  productId: string;
  /** The sale the review was left on. */
  saleId?: string;
  /** @deprecated Not returned by the API. */
  userId: string;
  buyerEmail: string;
  rating: number;
  review?: string;
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ListReviewsParams {
  /** @deprecated Ignored by the API; filter the returned list by `productId`. */
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
  /** ISO 8601 date-time, or null for no expiry. */
  expiration?: string | null;
  /** Times redeemed. */
  used?: number;
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
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
  /** Expiration date-time (ISO 8601), or null for no expiry */
  expiration?: string | null;
}

export interface UpdateDiscountParams {
  name?: string;
  code?: string;
  value?: number;
  valueType?: 'percentage' | 'fixed';
  active?: boolean;
  mainProductIds?: string[];
  /** ISO 8601 date-time, or null to remove the expiry */
  expiration?: string | null;
}

// ----------------------------------------------------------------------------
// Upsells
// ----------------------------------------------------------------------------

/** Checkout styling of an upsell (colors are CSS colors, fonts are font names). */
export interface UpsellStyle {
  upsellBackground?: string;
  upsellBorder?: string;
  upsellHeadline?: string;
  upsellDescriptionColor?: string;
  upsellCheckboxColor?: string;
  upsellCheckboxBackground?: string;
  upsellHeadingFont?: string;
  upsellBodyFont?: string;
}

export interface Upsell extends UpsellStyle {
  _id: string;
  /** @deprecated Not returned by the API. */
  userId: string;
  name: string;
  mainProductIds: string[];
  upsellProductId: string;
  upsellPrice: number;
  /** Struck-through "was" price shown next to `upsellPrice`. */
  compareAtPrice?: number;
  upsellDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  offer?: string;
  active: boolean;
  /** Whether the upsell is offered on the checkout page. */
  showAtCheckout?: boolean;
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** A sale that included an upsell (`upsells.list()`). */
export interface SaleWithUpsell {
  _id: string;
  saleId?: string;
  upsellId?: string;
  /** Decimal amount, not cents. */
  upsellAmount?: number;
  createdAt?: string;
}

export interface UpsellsResponse {
  upsells: Upsell[];
  salesWithUpsells: SaleWithUpsell[];
}

export interface CreateUpsellParams extends UpsellStyle {
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
  /** Struck-through "was" price */
  compareAtPrice?: number;
  /** Upsell description shown to customer */
  upsellDescription?: string;
  /** Primary button text (e.g., "Yes, add this!") */
  primaryButtonText?: string;
  /** Secondary button text (e.g., "No thanks") */
  secondaryButtonText?: string;
  /** Whether upsell is active (defaults to true) */
  active?: boolean;
}

export interface UpdateUpsellParams extends UpsellStyle {
  name?: string;
  mainProductIds?: string[];
  upsellProductId?: string;
  upsellPrice?: number;
  compareAtPrice?: number;
  upsellDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  offer?: string;
  active?: boolean;
}

// ----------------------------------------------------------------------------
// Subscriptions
// ----------------------------------------------------------------------------

/** @deprecated `subscriptions.get()` now resolves to `SubscriberOrderHistory`. */
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

/**
 * `GET /orders/subscriptions/{id}` (`subscriptions.get()`): a subscriber with
 * its offer, customer record and payment history. Same data as
 * `subscribers.get()`, with the subscriber under `subscriptionCustomer`.
 */
export interface SubscriberOrderHistory {
  subscriptionCustomer: Subscriber;
  subscription: SubscriptionOffer | null;
  customer: Customer | null;
  /** Live membership status. */
  status: SubscriberStatus | string;
  /** Every subscription payment: the initial charge plus every renewal. */
  payments: Payment[];
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
  /** What the subscriber gets: a file, a URL, a course or credits. */
  productType?: ProductType;
  /** Credits offers only: automatic top-off settings. */
  creditAutoRefill?: CreditAutoRefill;
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** Response of `subscriptionOffers.delete()`. */
export interface DeletedSubscriptionOffer {
  message: string;
  /** Id of the deleted offer. */
  id?: string;
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
  /** What the subscriber gets: a file, a URL, a course or credits */
  productType?: ProductType;
  /** Credits offers only: automatic top-off settings */
  creditAutoRefill?: CreditAutoRefill;
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

/** Every webhook event type you can subscribe to (mirrors the public API). */
export const WEBHOOK_EVENTS = [
  'order.completed',
  'order.refunded',
  'product.created',
  'product.updated',
  'product.deleted',
  'review.created',
  'customer.created',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.pause',
  'customer.subscription.resumed',
  'customer.subscription.trial_will_end',
  'invoice.created',
  'invoice.upcoming',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'credit.granted',
  'credit.balance_changed',
  'credit.auto_refill.succeeded',
  'credit.auto_refill.failed',
  'credit.consent.enabled',
  'credit.consent.disabled',
  'order.post_purchase_accepted',
  'funnel.lead',
] as const;

/** Webhook event types you can subscribe to. */
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

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

/**
 * `order.post_purchase_accepted`: a buyer took the one-click offer shown
 * after checkout and the payment settled. The new order also fires
 * `order.completed`.
 */
export interface OrderPostPurchaseAcceptedEvent extends WebhookEventPayload {
  type: 'order.post_purchase_accepted';
  order: { id: string; paymentIntentId: string };
  /** The order the offer followed. */
  parentOrder: { id: string };
  /** The offered product the buyer took. */
  product: { id: string; name: string };
  /** The product of the order the offer followed. */
  parentProduct: { id: string };
  /** Major units of `currency` (`9.6` = $9.60). */
  amount: number;
  /** Lowercase ISO currency code. */
  currency: string;
  discountPercent: number;
  customer: { email: string };
}

/** `funnel.lead`: someone claimed a sales funnel's lead magnet (a new lead). */
export interface FunnelLeadEvent extends WebhookEventPayload {
  type: 'funnel.lead';
  funnel: {
    id: string;
    name: string;
    leadMagnetProductId: string;
    offerProductId: string | null;
  };
  lead: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    /** The email-list contact, if one exists. */
    subscriberId: string | null;
    /** Whether the contact is subscribed to your emails. */
    subscribed: boolean;
    /** The funnel's lead tag on that contact. */
    tag: string | null;
  };
  /** The $0 order of the claim. */
  order: { id: string | null };
  /** ISO 8601 date-time. */
  capturedAt: string;
}

// ----------------------------------------------------------------------------
// User / Account
// ----------------------------------------------------------------------------

export interface User extends TrackingPixels {
  _id: string;
  userId: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  /** Public creator / store name. */
  creatorName?: string;
  subdomain?: string;
  currency: string;
  country?: string;
  /** `true` for a `pk_test_` key. */
  testMode: boolean;
  /** Whether the account can currently take payments. */
  canSell?: boolean;
  hasSales: boolean;
  createdFirstProduct?: boolean;
  /** Text on buyers' card statements. */
  statementDescriptor?: string;
  /** Profile picture URL. */
  picture?: string;
  /**
   * The plan the account subscribed to. A canceled plan keeps this value
   * until its paid period ends — read the plan that applies right now from
   * `users.entitlements()`.
   */
  currentPlan?: PlanId;
  /** How the plan is billed. */
  billingInterval?: 'month' | 'year';
  createdAt?: string;
  updatedAt?: string;
}

/** The ad-platform pixel IDs a seller has saved (Settings → Tracking pixels). */
export interface TrackingPixels {
  /** Meta (Facebook) Pixel ID: 15 or 16 digits. */
  facebookPixel?: string;
  /** Google tag ID: G-XXXXXXX (Google Analytics 4), AW-XXXXXXXXX (Google Ads) or GT-XXXXXXX. */
  googlePixel?: string;
  /** Google Tag Manager container ID: GTM-XXXXXXX. */
  googleTagManager?: string;
  /** TikTok Pixel ID: 16 to 24 uppercase letters and numbers (usually 20). */
  tiktokPixel?: string;
  /** Pinterest Tag ID: 10 to 16 digits (usually 13). */
  pinterestTag?: string;
  /** Snap Pixel ID: a UUID. */
  snapchatPixel?: string;
  /** X (Twitter) Pixel ID: 4 to 8 lowercase letters and numbers, e.g. o1abc. */
  twitterPixel?: string;
  /** X (Twitter) event ID for the Purchase conversion: tw-<pixel>-<event>. */
  twitterPurchaseEventId?: string;
  /** LinkedIn Insight Tag partner ID: 4 to 10 digits. */
  linkedinPartnerId?: string;
  /** LinkedIn conversion ID for the Purchase conversion: 4 to 12 digits. */
  linkedinConversionId?: string;
  /** Reddit Pixel ID: a2_ or t2_ followed by letters and numbers. */
  redditPixel?: string;
  /** Microsoft Advertising UET tag ID: 5 to 12 digits. */
  microsoftUetTag?: string;
}

/**
 * Tracking pixel IDs on update. The API normalises each ID to its
 * platform's format and rejects a malformed one with 400; an empty string
 * or null clears it.
 */
export type TrackingPixelsUpdate = {
  [K in keyof TrackingPixels]?: string | null;
};

/**
 * Params of `users.updateTrackingPixels()`. Adding or changing a pixel needs
 * the Starter plan (`adPixels`, else `FeatureLockedError`); `''` or `null`
 * removes one. A malformed id is a 400 whose `body.field` names the field.
 */
export type UpdateTrackingPixelsParams = TrackingPixelsUpdate;

export interface UpdateUserParams extends TrackingPixelsUpdate {
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
  /** A product or subscription offer id (required). */
  productId: string;
  /** Where the buyer lands after paying. */
  successUrl?: string;
  /** Where the buyer lands if they leave the checkout. */
  cancelUrl?: string;
  /** Prefill the buyer's email. */
  customerEmail?: string;
  /** With `customerEmail`: stop the buyer from changing it. */
  lockEmail?: boolean;
  /**
   * Your own reference for this checkout (at most 256 characters), echoed as
   * `clientReferenceId` on the order and subscription webhook events.
   */
  clientReferenceId?: string;
  /** Pre-apply a discount code. */
  discountCode?: string;
  /** Echoed as `metadata` on the order and subscription webhook events. */
  metadata?: Record<string, any>;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

// ----------------------------------------------------------------------------
// Refunds
// ----------------------------------------------------------------------------

/**
 * A refund policy: the refund terms shown on your products' checkout and
 * product pages (`refunds.*`). Refunding a payment is done from the dashboard.
 */
export interface RefundPolicy {
  _id: string;
  name?: string;
  /** Policy text. */
  policy?: string;
  /** Refund window length, in `periodType` units (0 = no refunds). */
  period?: number;
  periodType?: 'days' | 'weeks';
  /** Number of products using this policy. */
  appliedTo?: number;
  testMode?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRefundPolicyParams {
  name?: string;
  /** Policy text. */
  policy?: string;
  /** Refund window length (defaults to 0). */
  period?: number;
  /** Defaults to `days`. */
  periodType?: 'days' | 'weeks';
}

export type UpdateRefundPolicyParams = CreateRefundPolicyParams;

/**
 * @deprecated `refunds.*` manages refund policies; use `RefundPolicy`.
 * The order-refund fields below were never returned by the API.
 */
export interface Refund extends RefundPolicy {
  /** @deprecated Never returned by the API. */
  orderId?: string;
  /** @deprecated Never returned by the API. */
  amount?: number;
  /** @deprecated Never returned by the API. */
  reason?: string;
  /** @deprecated Never returned by the API. */
  status?: 'pending' | 'completed' | 'failed';
}

/**
 * @deprecated `refunds.create()` creates a refund policy; use
 * `CreateRefundPolicyParams`. The order-refund fields are ignored by the API.
 */
export interface CreateRefundParams extends CreateRefundPolicyParams {
  /** @deprecated Ignored by the API. */
  orderId?: string;
  /** @deprecated Ignored by the API. */
  amount?: number;
  /** @deprecated Ignored by the API. */
  reason?: string;
}

// ----------------------------------------------------------------------------
// Creator page (Link in Bio)
// ----------------------------------------------------------------------------

/** A link on your creator page. */
export interface CreatorPageLink {
  _id?: string;
  /** Platform or link name, e.g. `instagram`. */
  name: string;
  url: string;
  /** Display label overriding `name`. */
  customName?: string;
}

export type CreatorPageTemplate =
  | 'template1'
  | 'template2'
  | 'template3'
  | 'template4'
  | 'template5'
  | 'template6'
  | 'template7'
  | 'template8';

/** Your Link in Bio page (one per account). */
export interface CreatorPage {
  _id: string;
  userId: string;
  creatorName?: string;
  creatorBio?: string;
  username: string;
  profilePicture?: string;
  coverImage?: string;
  images?: string[];
  template?: CreatorPageTemplate | string;
  theme?: Record<string, unknown>;
  themeV2?: Record<string, unknown>;
  /** Google Analytics 4 measurement id (`G-…`). */
  gaMeasurementId?: string;
  socialLinks?: CreatorPageLink[];
  regularLinks?: CreatorPageLink[];
  /** Products shown on the page. */
  selectedProductIds?: string[];
  /** Subscription offers shown on the page. */
  selectedSubscriptionIds?: string[];
  catalogVisibilityConfigured?: boolean;
  subscriberForm?: Record<string, unknown>;
  bookingEnabled?: boolean;
  bookingButtonLabel?: string;
  showFirstName?: boolean;
  showLastName?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Writable creator page fields, shared by `creatorPage.create()` and `.update()`. */
export interface CreatorPageFields {
  /** At most 1000 characters. */
  creatorName?: string;
  /** At most 1000 characters. */
  creatorBio?: string;
  /** 3 – 30 letters, numbers, `_` or `-`. */
  username?: string;
  /** At most 20. */
  socialLinks?: CreatorPageLink[];
  /** At most 20. */
  regularLinks?: CreatorPageLink[];
  profilePicture?: string;
  coverImage?: string;
  images?: string[];
  template?: CreatorPageTemplate;
  theme?: Record<string, unknown>;
  themeV2?: Record<string, unknown>;
  /** Google Analytics 4 measurement id (`G-…`), or `''` to clear it. */
  gaMeasurementId?: string;
  selectedProductIds?: string[];
  selectedSubscriptionIds?: string[];
  subscriberForm?: Record<string, unknown>;
  bookingEnabled?: boolean;
  bookingButtonLabel?: string;
  /** Defaults to true. */
  showFirstName?: boolean;
  /** Defaults to true. */
  showLastName?: boolean;
}

export interface CreateCreatorPageParams extends CreatorPageFields {
  /** 3 – 30 letters, numbers, `_` or `-` (required). */
  username: string;
}

export type UpdateCreatorPageParams = CreatorPageFields;

/** Response of `creatorPage.updateUsername()`. */
export interface CreatorPageUsernameUpdate {
  username: string;
  message?: string;
}

// ----------------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------------

/** An image to upload: a `Blob`/`File`, a Node `Buffer`, or raw bytes. */
export type ImageUploadInput = Blob | ArrayBuffer | ArrayBufferView;

export interface UploadImageOptions {
  /** File name sent with the upload (defaults to `image`). */
  filename?: string;
  /**
   * MIME type of raw bytes. The API sniffs the real type from the bytes:
   * PNG, JPEG, WebP, GIF and AVIF are accepted (others get 415).
   */
  contentType?: string;
}

/** Response of `images.upload()`. */
export interface UploadedImage {
  /** Hosted URL of the image. */
  imageUrl: string;
}

// ----------------------------------------------------------------------------
// Partners (referral program)
// ----------------------------------------------------------------------------

/** Your partner (referral) profile. */
export interface Partner {
  _id: string;
  userId: string;
  referralCode: string;
  /** Commission percentage of the Pocketsflow platform fee (`20` = 20%). */
  commissionRate: number;
  active: boolean;
  totalSignups: number;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Page metadata of the partner list endpoints. */
export interface PartnerPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PartnerListParams {
  /** 1-based page number (defaults to 1). */
  page?: number;
  /** Items per page (defaults to 20, maximum 100). */
  limit?: number;
}

/** A seller who signed up with your referral code. */
export interface ReferredUser {
  _id?: string;
  userId: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  country?: string;
  createdAt?: string;
  /** Number of live sales. */
  totalSales: number;
  /** Live revenue, in USD. */
  totalRevenue: number;
  [key: string]: unknown;
}

/** A sale made by a seller you referred. */
export interface ReferralSale {
  createdAt?: string;
  userId?: string;
  merchantName?: string;
  amount?: number;
  grossAmount?: number;
  currency?: string;
  revenueUsd?: number;
  isSubscription?: boolean;
  partnerCut?: number;
  /** Your commission on this sale. */
  commission?: number;
}

export interface PartnerListResponse<T> {
  data: T[];
  pagination: PartnerPagination;
}

/** Response of `partners.stats()`. */
export interface PartnerStats {
  referralCode: string;
  /** Commission percentage (`20` = 20%). */
  commissionRate: number;
  totalSignups: number;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  active: boolean;
  createdAt?: string;
}

/** Response of `partners.registerReferral()`. */
export interface ReferralRegistration {
  message: string;
  referralCode?: string;
}

// ----------------------------------------------------------------------------
// Plans and entitlements
// ----------------------------------------------------------------------------

/**
 * A Pocketsflow plan id: `tier1` is Starter, `tier2` Growth, `tier3` Pro,
 * `tier4` Scale. `enterprise` is contact-us and never listed by `plans.list()`.
 */
export type PlanId =
  | 'free'
  | 'tier1'
  | 'tier2'
  | 'tier3'
  | 'tier4'
  | 'volume'
  | 'volume_max'
  | 'enterprise';

/**
 * A plan-gated feature. New keys ship often, so any string is accepted too.
 */
export type FeatureKey =
  | 'removeBadge'
  | 'customDomains'
  | 'premiumTemplates'
  | 'adPixels'
  | 'trackedLinks'
  | 'pdfStamping'
  | 'limitedDrops'
  | 'upsells'
  | 'abandonedCheckout'
  | 'affiliates'
  | 'teams'
  | 'paymentPlans'
  | 'exitOffers'
  | 'postPurchaseUpsells'
  | 'socialProof'
  | 'salesFunnels'
  | 'paidNewsletter'
  | 'fairPricing'
  | 'revenueSplits'
  | 'earlyBirdPricing'
  | 'flashSales'
  | 'bundles'
  | 'tieredDiscounts'
  | 'audienceSegments'
  | 'winbackEmails'
  | 'uniqueCoupons'
  | 'embedForms'
  | 'testimonials'
  | 'resendNonOpeners'
  | 'dripContent'
  | 'downloadLimits'
  | 'attributionSurvey'
  | 'loyalty'
  | 'advancedAnalytics'
  | 'failedPaymentRecovery'
  | 'cancellationSaveOffers'
  | 'abTests'
  | 'memberships'
  | 'sheetsSync'
  | 'usagePricing'
  | 'mrrReports'
  | 'introPricing'
  | 'browseAbandonment'
  | 'personalDeadlines'
  | 'tieredAffiliates'
  | 'customerCrm'
  | 'benchmarks'
  | 'prioritySupport'
  | 'lowerFee'
  | 'migration'
  | 'accountManager'
  | 'disputeCover'
  | (string & {});

/** Whether the account may use one feature, and why. */
export interface FeatureEntitlement {
  allowed: boolean;
  /** The cheapest plan that includes the feature. */
  requiredPlan: PlanId;
  /** Display name of `requiredPlan`, e.g. `Growth`. */
  requiredPlanName: string;
  /**
   * `plan`: included in the plan. `grandfathered`: kept for a while after
   * gating started. `not_enforced`: not gated yet. `locked`: needs an upgrade.
   */
  reason: 'plan' | 'grandfathered' | 'not_enforced' | 'locked';
  /** ISO date the grandfathered access ends; only with reason `grandfathered`. */
  grandfatheredUntil: string | null;
}

/** `GET /users/entitlements`: what the account's active plan unlocks. */
export interface Entitlements {
  /** The ACTIVE plan (a lapsed paid plan reads `free`). */
  plan: PlanId;
  planName: string;
  billingInterval: 'month' | 'year';
  /** Platform fee on new sales: `0.02`, `0.01` (Volume), `0.005` (Volume Max). */
  feeRate: number;
  /** Team seats; null = unlimited. */
  seats: number | null;
  /** Whether features that existed before plan gating are gated yet. */
  enforced: boolean;
  features: Record<FeatureKey, FeatureEntitlement>;
}

/** `Entitlements` as returned by the SDK, with a `can()` helper. */
export interface EntitlementsResult extends Entitlements {
  /**
   * `true` when `features[key].allowed` is `true`; `false` for an unknown key.
   * Not enumerable, so it never shows up in `JSON.stringify()`.
   */
  can(key: FeatureKey): boolean;
}

/** One self-serve plan (`plans.list()`). Prices are in USD. */
export interface Plan {
  plan: Exclude<PlanId, 'enterprise'>;
  name: string;
  pricePerMonth: number;
  /** Ten times the monthly price (two months free); 0 on free. */
  pricePerYear: number;
  /** Platform fee on every sale while the plan is active, as a proportion. */
  feeRate: number;
  /** Team seats; null = unlimited. */
  seats: number | null;
  minSubscribers: number;
  maxSubscribers: number;
  /** Included email sends per calendar month (UTC). */
  maxSendsPerMonth: number;
  /** Maximum size of one uploaded file, in MB. */
  maxUploadMb: number;
  isPopular?: boolean;
  /** Feature keys the plan includes. */
  features: FeatureKey[];
}

// ----------------------------------------------------------------------------
// Abandoned checkout
// ----------------------------------------------------------------------------

/** `GET /checkout/abandoned/summary`: lost live checkouts of the last 30 days. */
export interface AbandonedCheckoutSummary {
  count: number;
  /** Decimal USD amount (USD checkouts only). */
  amountUsd: number;
  /** Always 30. */
  windowDays: number;
}

/** Response of `products.setAbandonedCheckout()`. */
export interface ProductAbandonedCheckout {
  abandonedCheckoutEnabled: boolean;
}

// ----------------------------------------------------------------------------
// Weekly growth report
// ----------------------------------------------------------------------------

export interface WeeklyReportSettings {
  /** Whether the Monday email is on (default true). */
  enabled: boolean;
  /** IANA time zone the report follows (`UTC` when unknown). */
  timeZone: string;
  /** ISO date-time of the next Monday 08:00 in `timeZone`. */
  nextSendAt: string;
}

export interface UpdateWeeklyReportSettingsParams {
  enabled: boolean;
}

export interface WeeklyReportPeriod {
  /** Paid revenue in the account currency (cents kept). */
  revenue: number;
  /** Paid orders (unique paid payments). */
  orders: number;
  /** Unique visitors. */
  visitors: number;
  /** Percent: (orders + new subscribers) / visitors * 100, one decimal. */
  conversionRate: number;
}

export type WeeklyReportNextStepId =
  | 'publish-first-product'
  | 'convert-visits'
  | 'order-bump'
  | 'recover-checkouts'
  | 'send-newsletter'
  | 'grow-reach';

/** The one suggestion at the end of the report. */
export interface WeeklyReportNextStep {
  id: WeeklyReportNextStepId;
  title: string;
  body: string;
  /** Button label. */
  cta: string;
  /** Dashboard path on app.pocketsflow.com, e.g. `/upsells/new?unlock=upsells`. */
  path: string;
  feature?: 'upsells' | 'abandonedCheckout' | 'affiliates';
  /** True when the account's plan doesn't include `feature`. */
  locked?: boolean;
  /** e.g. `Growth` when locked. */
  requiredPlanName?: string;
}

export interface WeeklyReport {
  userId: string;
  email: string;
  firstName: string;
  storeName: string;
  /** ISO code every money figure is in (the account currency). */
  currency: string;
  timeZone: string;
  /** ISO week covered, e.g. `2026-W42`. */
  weekKey: string;
  /** e.g. `Oct 12 – Oct 18`. */
  weekLabel: string;
  periodStart: string;
  periodEnd: string;
  current: WeeklyReportPeriod;
  previous: WeeklyReportPeriod;
  /** Rounded percent vs the week before; null when that week had no revenue. */
  revenueChangePct: number | null;
  bestSeller: { id: string; name: string; orders: number; revenue: number } | null;
  /** `source` is a referrer host / utm_source, or `direct`. */
  topSource: { source: string; label: string; visitors: number } | null;
  nextStep: WeeklyReportNextStep;
}

/** `GET /users/weekly-report/preview`: the email as it would be sent now. */
export interface WeeklyReportPreview {
  subject: string;
  html: string;
  text: string;
  report: WeeklyReport;
}

// ----------------------------------------------------------------------------
// Tracked links
// ----------------------------------------------------------------------------

export type TrackedLinkChannel =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'x'
  | 'facebook'
  | 'email'
  | 'ads'
  | 'other';

export interface TrackedLinkUtm {
  source: string;
  medium: string;
  campaign: string;
}

/** A short link on your store that counts clicks, visitors and sales. */
export interface TrackedLink {
  _id: string;
  slug: string;
  label: string;
  channel: TrackedLinkChannel;
  /** Absolute https URL on your own store. */
  destination: string;
  utm: TrackedLinkUtm;
  archived: boolean;
  /** e.g. `https://redmug.pocketsflow.com/go/ig-bio`. */
  shortUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackedLinkStats {
  clicks: number;
  visitors: number;
  sales: number;
  /** Account currency. */
  revenue: number;
  /** Percent: sales per unique visitor. */
  conversionRate: number;
}

export interface TrackedLinkDay {
  /** `YYYY-MM-DD`, a local day (see `timezoneOffsetMinutes`). */
  date: string;
  clicks: number;
  visitors: number;
  sales: number;
  revenue: number;
}

/**
 * Stats window of the tracked link reads. Defaults: from the (first) link's
 * creation to now; ranges are capped at 366 days.
 */
export interface TrackedLinkStatsParams {
  /** ISO 8601 date-time. */
  startDate?: string;
  /** ISO 8601 date-time. */
  endDate?: string;
  /**
   * Your UTC offset as `Date#getTimezoneOffset()` minutes (UTC − local), so
   * daily rows follow your local days. -840 – 840, defaults to 0.
   */
  timezoneOffsetMinutes?: number;
}

export interface ListTrackedLinksParams extends TrackedLinkStatsParams {
  /** Include archived links. */
  archived?: boolean;
}

/** A listed link: stats and the daily sparkline are null below Starter. */
export interface TrackedLinkWithStats extends TrackedLink {
  stats: TrackedLinkStats | null;
  spark: number[] | null;
}

/** Response of `trackedLinks.list()`. */
export interface TrackedLinkListResponse {
  links: TrackedLinkWithStats[];
  archivedCount: number;
  /** Short URL prefix, e.g. `https://redmug.pocketsflow.com/go/`. */
  shortBase: string;
  /** True below Starter: every stats field is null. */
  statsLocked: boolean;
  currency: string | null;
  totals: TrackedLinkStats | null;
  channels: Array<TrackedLinkStats & { channel: TrackedLinkChannel; links: number }> | null;
  daily: TrackedLinkDay[] | null;
  range: { start: string; end: string };
}

/** Response of `trackedLinks.get()`: one link with its stats. */
export interface TrackedLinkStatsResponse {
  link: TrackedLink;
  statsLocked: boolean;
  stats: TrackedLinkStats | null;
  daily: TrackedLinkDay[] | null;
  countries: Array<{ country: string; clicks: number; visitors: number }> | null;
  currency: string | null;
  range: { start: string; end: string };
}

export interface CreateTrackedLinkParams {
  /** Absolute URL on your own store (required). */
  destination: string;
  /** Letters, numbers and hyphens (up to 48). Generated when omitted. */
  slug?: string;
  /** At most 80 characters. */
  label?: string;
  /** Defaults to `other`. */
  channel?: TrackedLinkChannel;
  /** Blank values are derived from the channel and slug. */
  utm?: Partial<TrackedLinkUtm>;
}

/**
 * Only the fields you send change. The slug never changes once a link
 * exists. Archiving is free; other edits need the Starter plan.
 */
export interface UpdateTrackedLinkParams {
  label?: string;
  destination?: string;
  channel?: TrackedLinkChannel;
  utm?: Partial<TrackedLinkUtm>;
  archived?: boolean;
}

/** Response of `trackedLinks.checkSlug()`. */
export interface TrackedLinkSlugCheck {
  /** The normalized slug. */
  slug: string;
  valid: boolean;
  available: boolean;
  message?: string;
  /** A free alternative when the slug is taken. */
  suggestion?: string;
}

// ----------------------------------------------------------------------------
// Store badge ("Powered by Pocketsflow")
// ----------------------------------------------------------------------------

/** Badge referral rewards: free months earned by stores you referred. */
export interface StoreBadgeFreeMonths {
  earned: number;
  applied: number;
  banked: number;
  earnedThisYear: number;
  /** 12. */
  yearlyCap: number;
}

/** The badge's referral numbers (`storeBadge.referralStats()`). */
export interface StoreBadgeReferralStats {
  /** Badge referral code: `PF-` + 10 lowercase letters and numbers. */
  code: string;
  /** `https://www.pocketsflow.com/?ref=<code>`. */
  link: string;
  clicks: number;
  /** Stores that signed up through the badge. */
  signups: number;
  /** Referred stores whose first payment is inside the 14-day clearance. */
  clearing: number;
  freeMonths: StoreBadgeFreeMonths;
}

/** Response of `storeBadge.get()` / `.update()`. */
export interface StoreBadge extends StoreBadgeReferralStats {
  /** Your saved choice (default true). */
  showPoweredBy: boolean;
  /** Whether buyers see the badge now (false only when hidden AND the plan allows it). */
  visible: boolean;
  /** Whether the current plan may hide it (Starter or higher). */
  canHide: boolean;
  requiredPlan: PlanId;
  /** e.g. `Starter`. */
  requiredPlanName: string;
}

export interface UpdateStoreBadgeParams {
  /** `false` needs the Starter plan or higher (`FeatureLockedError` otherwise). */
  showPoweredBy: boolean;
}

// ----------------------------------------------------------------------------
// Team (Growth `teams`)
// ----------------------------------------------------------------------------

export type TeamRole = 'owner' | 'admin' | 'member';

/** A dashboard area a team can open. */
export type TeamArea = 'products' | 'orders' | 'emails' | 'marketing' | 'analytics' | 'developers';

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string | null;
  picture: string | null;
  role: TeamRole;
  teamIds: string[];
  status: 'active' | 'paused';
  pausedReason: 'manual' | 'seat_limit' | null;
  /** ISO 8601 date-time. */
  joinedAt: string;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: TeamRole;
  teamIds: string[];
  /** ISO 8601 date-time, 7 days after sending / resending. */
  expiresAt: string;
  expired: boolean;
  /** Display name of who sent it. */
  invitedBy: string | null;
  createdAt: string;
  resendCount: number;
}

/** A team: a named group of members with access to some areas. */
export interface Team {
  id: string;
  name: string;
  areas: TeamArea[];
  memberCount: number;
}

/** A team as returned by `team.teams.create()` / `.update()`. */
export interface TeamRecord {
  id: string;
  storeUserId: string;
  name: string;
  areas: TeamArea[];
  createdAt: string;
}

/** Response of `team.get()`. */
export interface TeamOverview {
  store: { storeUserId: string; name: string; subdomain: string | null };
  viewer: { userId: string; role: TeamRole; isPrimaryOwner: boolean };
  plan: { id: PlanId; name: string };
  /** Whether the plan includes teams (Growth or higher). */
  teamsAllowed: boolean;
  /** `limit` is null for unlimited seats. The owner counts in `used`. */
  seats: { limit: number | null; used: number; pending: number; paused: number };
  primaryOwner: {
    userId: string;
    email: string | null;
    name: string | null;
    picture: string | null;
    role: 'owner';
  };
  members: TeamMember[];
  invites: TeamInvite[];
  teams: Team[];
}

export type TeamActivityAction =
  | 'invite.created'
  | 'invite.resent'
  | 'invite.canceled'
  | 'invite.accepted'
  | 'member.updated'
  | 'member.removed'
  | 'member.left'
  | 'member.paused_by_plan'
  | 'member.resumed_by_plan'
  | 'team.created'
  | 'team.updated'
  | 'team.deleted'
  | 'request'
  | (string & {});

/** One entry of the team activity log. */
export interface TeamActivity {
  id: string;
  /** ISO 8601 date-time. */
  at: string;
  action: TeamActivityAction;
  actor: {
    userId: string;
    name: string | null;
    email: string | null;
    role: TeamRole | null;
    /** True for automatic changes (e.g. seats paused by a plan change). */
    system: boolean;
  };
  targetType: string | null;
  /** e.g. `PUT /products/665f…` for a `request`. */
  targetLabel: string | null;
  area: TeamArea | null;
  meta: Record<string, unknown> | null;
}

export interface ListTeamActivityParams {
  /** ISO date-time: entries strictly older than this (pass `nextBefore`). */
  before?: string;
  /** 1 – 100 (defaults to 50). */
  limit?: number;
}

/** Response of `team.activity()`. */
export interface TeamActivityResponse {
  items: TeamActivity[];
  /** Pass as `before` for the next page; null on the last page. */
  nextBefore: string | null;
}

export interface InviteTeamMemberParams {
  email: string;
  role: TeamRole;
  teamIds?: string[];
}

/** Response of `team.invites.create()`. */
export interface TeamInviteCreated {
  invite: Pick<TeamInvite, 'id' | 'email' | 'role' | 'teamIds' | 'expiresAt'>;
  emailSent: boolean;
}

/** Response of `team.invites.resend()`. */
export interface TeamInviteResent {
  id: string;
  expiresAt: string;
  emailSent: boolean;
}

export interface UpdateTeamMemberParams {
  role?: TeamRole;
  teamIds?: string[];
  status?: 'active' | 'paused';
}

/** Response of `team.members.update()`. */
export type TeamMemberUpdate = Pick<
  TeamMember,
  'id' | 'role' | 'teamIds' | 'status' | 'pausedReason'
>;

export interface CreateTeamParams {
  /** At most 60 characters. */
  name: string;
  areas?: TeamArea[];
}

export type UpdateTeamParams = Partial<CreateTeamParams>;

/** Response of the team delete / cancel / remove calls. */
export interface TeamOk {
  ok: true;
}

// ----------------------------------------------------------------------------
// Post-purchase offers and social proof (Growth checkout)
// ----------------------------------------------------------------------------

/** The one-click offer shown after a product's checkout. */
export interface PostPurchaseOffer {
  enabled: boolean;
  /** The offered product (`''` when none). */
  productId: string;
  /** 0 – 90. */
  discountPercent: number;
}

/**
 * Only the fields you send change. Turning it on needs the Growth plan
 * (`FeatureLockedError`). A 400 carries `code`: `same_product`, `other_mode`,
 * `pay_what_you_want`, `credits`, `not_available`, `checkout_disabled` or
 * `too_cheap`.
 */
export type UpdatePostPurchaseOfferParams = Partial<PostPurchaseOffer>;

export type SocialProofWindow = '24h' | '7d';

/** A product's social proof settings. */
export interface SocialProofSettings {
  enabled: boolean;
  /** Show "N people bought this" over `countWindow`. */
  purchaseCount: boolean;
  countWindow: SocialProofWindow;
  /**
   * Below this many purchases in the window, the count and the
   * recent-purchase notice are hidden (1 – 1000, default 3).
   */
  threshold: number;
  /** Show "Someone in Lyon bought this 2h ago" (city or country, never a name). */
  recentPurchases: boolean;
  /** Show the average review rating. */
  rating: boolean;
}

/** Only the fields you send change. Turning it on needs the Growth plan. */
export type UpdateSocialProofSettingsParams = Partial<SocialProofSettings>;

/** What the checkout shows (`socialProof.get()`, public). */
export interface SocialProof {
  enabled: boolean;
  purchases: { count: number; window: SocialProofWindow } | null;
  recent: {
    /** A city, or a two-letter country code. */
    place: string;
    placeKind: 'city' | 'country';
    minutesAgo: number;
  } | null;
  rating: { average: number; count: number } | null;
}

// ----------------------------------------------------------------------------
// Sales funnels (Growth `salesFunnels`)
// ----------------------------------------------------------------------------

export type FunnelTemplateId = 'welcome' | 'minicourse' | 'launch';
export type FunnelStatus = 'draft' | 'active' | 'paused';

/** An email sequence template. */
export interface FunnelTemplate {
  id: FunnelTemplateId;
  emails: Array<{
    subject: string;
    /** Hours after the lead signs up. */
    sendAfterHours: number;
    /** `full`: pitches the offer; `ps`: a one-line P.S. link; `none`: value only. */
    offer: 'full' | 'ps' | 'none';
  }>;
}

export interface ListFunnelTemplatesParams {
  /** Product names to fill the sample subjects with. */
  leadMagnetName?: string;
  offerName?: string;
}

export interface CreateFunnelParams {
  templateId: FunnelTemplateId;
  /** A free product ($0, or pay-what-you-want from $0). */
  leadMagnetProductId: string;
  /** A paid product. */
  offerProductId: string;
  /** http(s) link to the offer; the discount code is appended as `?discount=`. */
  offerUrl: string;
  /** At most 120 characters. */
  name?: string;
  discount?: {
    /** 3 – 32 letters, numbers, `_` or `-`; stored uppercase. */
    code: string;
    /** Defaults to `percentage`. */
    valueType?: 'percentage' | 'fixed';
    /** Percentage 1 – 100, or an amount in the account currency. */
    value: number;
    /** ISO date-time in the future, or null for no end. */
    expiresAt?: string | null;
  } | null;
}

export interface FunnelStats {
  leads: number;
  emailsSent: number;
  opens: number;
  clicks: number;
  purchases: number;
  revenue: number;
  /** Percent, one decimal. */
  conversionRate: number;
  currency: string;
  updatedAt: string | null;
}

export interface Funnel {
  _id: string;
  name: string;
  templateId: FunnelTemplateId;
  status: FunnelStatus;
  leadMagnetProductId: string;
  offerProductId: string;
  offerUrl: string;
  offerDiscount: {
    discountId: string;
    code: string;
    valueType: 'percentage' | 'fixed';
    value: number;
    expiresAt: string | null;
  } | null;
  automationId: string;
  emailPostIds: string[];
  /** Tag added to every lead's email-list contact. */
  leadTag: string;
  activatedAt: string | null;
  stats: FunnelStats;
  createdAt: string;
  updatedAt: string;
}

export interface FunnelProductSummary {
  _id: string;
  name: string;
  price: number;
  payWant: boolean;
  minPrice: number;
  published: boolean;
  thumbnail: string | null;
  free: boolean;
}

/** A listed funnel, with its two products. */
export interface FunnelListItem extends Funnel {
  leadMagnet: FunnelProductSummary | null;
  offer: FunnelProductSummary | null;
}

/** Response of `funnels.get()`. */
export interface FunnelDetail extends FunnelListItem {
  automation: { _id: string; name: string; status: 'active' | 'inactive' | 'draft' } | null;
  emails: Array<{
    nodeId: string;
    postId: string | null;
    sendAfterHours: number;
    subject: string | null;
    preview: string | null;
    missing: boolean;
  }>;
  /** What `funnels.activate()` checks. */
  checklist: {
    senderVerified: boolean;
    leadMagnetPublished: boolean;
    leadMagnetFree: boolean;
    offerPublished: boolean;
    emailsReady: boolean;
  };
}

/** Response of `funnels.stats()`. */
export interface FunnelAnalytics {
  funnelId: string;
  /** 30. */
  attributionWindowDays: number;
  totals: {
    leads: number;
    emailsSent: number;
    opens: number;
    clicks: number;
    purchases: number;
    buyers: number;
    revenue: number;
    conversionRate: number;
    currency: string;
  };
  stages: { leads: number; opened: number; clicked: number; purchased: number };
  emails: Array<{
    nodeId: string;
    postId: string | null;
    subject: string | null;
    sendAfterHours: number;
    sent: number;
    opened: number;
    clicked: number;
  }>;
}

// ----------------------------------------------------------------------------
// License keys
// ----------------------------------------------------------------------------

/** A license key as its creator sees it. */
export interface LicenseKey {
  id: string;
  key: string;
  productId: string;
  /** The order (sale) it was issued for. */
  orderId: string;
  buyerEmail: string;
  status: 'active' | 'disabled';
  disabledReason: 'creator' | 'refunded' | 'disputed' | null;
  /** Null = unlimited. */
  activationLimit: number | null;
  activationsCount: number;
  activations: Array<{ instanceId: string; instanceName?: string; createdAt: string }>;
  testMode: boolean;
  lastValidatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListLicenseKeysParams {
  productId?: string;
  /** The order (sale) id. */
  orderId?: string;
  status?: 'active' | 'disabled';
  /** Buyer email (exact match). */
  email?: string;
  /** 1-based (defaults to 1). */
  page?: number;
  /** Defaults to 20, maximum 100. */
  pageSize?: number;
}

/** Response of `licenses.list()`. */
export interface LicenseKeysResponse {
  data: LicenseKey[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

/** Body of `licenses.validate()` / `.activate()` / `.deactivate()`. */
export interface LicenseKeyCheckParams {
  /** The product the key was sold with. */
  productId: string;
  /** The key the buyer entered (case, spaces and dashes are ignored). */
  licenseKey: string;
  /**
   * Your id for this install (1 – 128 letters, digits, `.`, `_`, `:`, `-`).
   * Required on deactivate; omit on activate to get a generated `ins_…` id.
   */
  instanceId?: string;
  /** Activate only: a label the creator sees, e.g. the device name. */
  instanceName?: string;
}

export interface DeactivateLicenseKeyParams extends LicenseKeyCheckParams {
  instanceId: string;
}

/**
 * The answer of the public license endpoints. They resolve (never throw)
 * when the key is not valid: read `valid` and `code`.
 */
export interface LicenseValidation {
  valid: boolean;
  status?: 'active' | 'disabled' | 'not_found';
  /** Why `valid` is false; null when it is true. */
  code?:
    | 'invalid_request'
    | 'license_not_found'
    | 'license_disabled'
    | 'activation_limit_reached'
    | 'instance_not_found'
    | (string & {})
    | null;
  message?: string;
  productId?: string | null;
  /** Instances the key is activated on. */
  activations?: number;
  /** Null = unlimited. */
  activationLimit?: number | null;
  activationsRemaining?: number | null;
  /** Masked, e.g. `a***@example.com`. */
  buyerEmail?: string | null;
  createdAt?: string | null;
  testMode?: boolean;
  /** The instance of this request, when it is activated. */
  instance?: { id: string; name?: string; createdAt?: string } | null;
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
  /** The `details` object of the error body, when the API sent one. */
  details?: Record<string, unknown>;
  /** The parsed JSON error body, when the API sent one (e.g. `field`, `suggestion`). */
  body?: Record<string, unknown>;

  constructor(message: string, code?: string, status?: number, body?: Record<string, unknown>) {
    super(message);
    this.name = 'PocketsflowError';
    this.code = code;
    this.status = status;
    this.body = body;
    const details = body?.details;
    if (details && typeof details === 'object' && !Array.isArray(details)) {
      this.details = details as Record<string, unknown>;
    }
  }
}

/** `details` of a 403 `FEATURE_LOCKED` error body. */
export type FeatureLockedDetails = {
  feature: FeatureKey;
  currentPlan: PlanId;
  requiredPlan: PlanId;
  requiredPlanName: string;
  /** USD per month, or null when unknown. */
  requiredPlanPrice: number | null;
  upgradeRequired: true;
};

/** Where the account owner upgrades their plan. */
export const UPGRADE_URL = 'https://app.pocketsflow.com/profile/billing';

/**
 * Thrown for a 403 whose body has `code: "FEATURE_LOCKED"`: the account's
 * plan does not include the feature. Extends `PocketsflowError`, so existing
 * `instanceof PocketsflowError` checks keep working.
 */
export class FeatureLockedError extends PocketsflowError {
  declare code: 'FEATURE_LOCKED';
  declare status: 403;
  declare details: FeatureLockedDetails;
  /** The locked feature, e.g. `upsells`. */
  readonly feature: FeatureKey;
  /** The plan the account is on now. */
  readonly currentPlan: PlanId;
  /** The cheapest plan that includes the feature, e.g. `tier2`. */
  readonly requiredPlan: PlanId;
  /** Its display name, e.g. `Growth`. */
  readonly requiredPlanName: string;
  /** Its monthly price in USD, or null when unknown. */
  readonly requiredPlanPrice: number | null;
  /** Where the account owner upgrades: https://app.pocketsflow.com/profile/billing */
  readonly upgradeUrl: string;

  constructor(message: string, body: Record<string, unknown> = {}) {
    super(message, 'FEATURE_LOCKED', 403, body);
    this.name = 'FeatureLockedError';
    const raw = (body.details && typeof body.details === 'object' ? body.details : {}) as Partial<
      FeatureLockedDetails
    >;
    const details: FeatureLockedDetails = {
      feature: raw.feature ?? '',
      currentPlan: raw.currentPlan ?? 'free',
      requiredPlan: raw.requiredPlan ?? 'tier1',
      requiredPlanName: raw.requiredPlanName ?? '',
      requiredPlanPrice: raw.requiredPlanPrice ?? null,
      upgradeRequired: true,
    };
    this.details = details;
    this.feature = details.feature;
    this.currentPlan = details.currentPlan;
    this.requiredPlan = details.requiredPlan;
    this.requiredPlanName = details.requiredPlanName;
    this.requiredPlanPrice = details.requiredPlanPrice;
    this.upgradeUrl = UPGRADE_URL;
  }
}

/** `details` of a 403 `SEAT_LIMIT` error body. */
export type SeatLimitDetails = {
  /** Seats on the plan. */
  limit: number;
  /** Seats in use (the owner counts). */
  used: number;
  /** Pending invites. */
  pending: number;
};

/**
 * Thrown for a 403 whose body has `code: "SEAT_LIMIT"`: inviting or
 * resuming a team member would exceed the plan's seats.
 */
export class SeatLimitError extends PocketsflowError {
  declare code: 'SEAT_LIMIT';
  declare status: 403;
  declare details: SeatLimitDetails;
  readonly limit: number;
  readonly used: number;
  readonly pending: number;

  constructor(message: string, body: Record<string, unknown> = {}) {
    super(message, 'SEAT_LIMIT', 403, body);
    this.name = 'SeatLimitError';
    const raw = (body.details && typeof body.details === 'object' ? body.details : {}) as Partial<
      SeatLimitDetails
    >;
    this.details = {
      limit: Number(raw.limit ?? 0),
      used: Number(raw.used ?? 0),
      pending: Number(raw.pending ?? 0),
    };
    this.limit = this.details.limit;
    this.used = this.details.used;
    this.pending = this.details.pending;
  }
}
