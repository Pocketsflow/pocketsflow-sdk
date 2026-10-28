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
  /** Limited drop (Starter). Read-only here — change it with `products.updateLimitedDrop()`. */
  limitedDrop?: Partial<LimitedDrop>;
  /** PDF stamping (Starter). Read-only here — change it with `products.updatePdfStamping()`. */
  pdfStamping?: PdfStamping;
  /** Download limits (Growth). Read-only here — change them with `products.updateDownloadLimits()`. */
  downloadLimits?: DownloadLimits;
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
  /** Payment plans only: which payment of the plan this order is (`{ index: 2, of: 3 }`). */
  installment?: { index: number; of: number } | null;
  /** How launch pricing (flash sale, fair pricing, early-bird step, code) priced this order. */
  pricing?: PricingRecord | null;
  /** Bundle orders only: every included product and its access-grant order id. */
  bundleItems?: Array<{ productId: string; saleId: string; name: string }>;
  /** "Buy more, save more": the tier this order's checkout reached (already taken off every amount). */
  tieredDiscount?: TieredDiscountApplied | null;
  createdAt: string;
}

/** The "Buy more, save more" tier applied to an order. */
export interface TieredDiscountApplied {
  percentOff: number;
  itemCount: number;
  /** Amount saved, charge currency. */
  amount: number;
  /** Amount saved, account currency. */
  settlementAmount?: number;
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
  /** Commission rate used for this sale, percent (affiliate sales). */
  affiliateRate?: number;
  /** Affiliate tiers: the tier (0 = first) the rate came from. */
  affiliateTier?: number;
  /** Affiliate tiers: the part of `affiliateCut` that is a milestone bonus. */
  affiliateBonus?: number;
  /** Loyalty: store credit taken off this order, in your currency. */
  loyaltyCredit?: number;
  /** Loyalty: points spent on this order. */
  loyaltyPointsRedeemed?: number;
  /** Loyalty: points this order earned. */
  loyaltyPointsEarned?: number;
  /**
   * Where the order stands. `failed` (a declined payment) is only listed when
   * `status` or `search` is passed to `orders.list()`.
   */
  status?: OrderStatus;
}

/** An order's status, as on the dashboard's Orders page. */
export type OrderStatus = 'paid' | 'refunded' | 'disputed' | 'failed';

export interface ListOrdersParams extends PaginationParams, DateRangeParams {
  productId?: string;
  /**
   * Only orders in these statuses (sent comma-separated). With `status` or
   * `search`, declined payments (`failed`) are listed too, like the dashboard.
   */
  status?: OrderStatus | OrderStatus[];
  /** Only orders whose buyer email contains this text (case-insensitive). */
  search?: string;
}

/** `GET /orders/{id}/journey`: the checkout session behind an order. */
export interface OrderJourney {
  /** Card attempts on this checkout and the share that went through. */
  authorization: { attempts: number; declined: number; rate: number } | null;
  checkout: {
    createdAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    failedAttempts: number;
    failureMessage: string | null;
  } | null;
}

/** One itemised fee on an order's payment. */
export interface OrderPaymentFee {
  key: 'pocketsflow' | 'processing' | 'tax_handling' | 'dispute_prevention' | 'affiliate';
  name: string;
  amount: number;
  currency?: string | null;
}

/**
 * `GET /orders/{id}/payment-details`: the payment behind an order, read live
 * from the payment processor. `available: false` (and nothing else) when the
 * processor no longer has it. Amounts are decimal major units.
 */
export interface OrderPaymentDetails {
  available: boolean;
  id?: string;
  status?: string;
  substatus?: string | null;
  refundable?: boolean;
  createdAt?: string;
  paidAt?: string | null;
  currency?: string;
  total?: number;
  subtotal?: number;
  /** What the store keeps after processor fees. */
  netAmount?: number;
  taxAmount?: number | null;
  /** Percent. */
  taxRate?: number;
  taxBehavior?: 'exclusive' | 'inclusive' | 'unspecified';
  refundedAmount?: number | null;
  refundedAt?: string | null;
  disputeAlertedAt?: string | null;
  /** Why a declined payment failed. */
  failureMessage?: string | null;
  /** Declined attempts before this payment. */
  paymentsFailed?: number | null;
  billingReason?: string | null;
  fees?: OrderPaymentFee[];
  totalFees?: number;
  paymentMethodType?: string | null;
  card?: { brand?: string; last4?: string; expMonth?: number | null; expYear?: number | null } | null;
  billingAddress?: {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  /** The processor's fraud risk score for the payment. */
  riskScore?: number | null;
  riskSignals?: unknown[];
  threeDsVerified?: boolean | null;
}

// ----------------------------------------------------------------------------
// Payouts (read only: withdrawing stays in the dashboard)
// ----------------------------------------------------------------------------

/** Every status a payout (withdrawal) moves through. */
export type PayoutStatusValue =
  | 'requested'
  | 'awaiting_payment'
  | 'in_transit'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'denied';

/** One payout: a withdrawal of the balance to a bank account or wallet. */
export interface Payout {
  id: string;
  /** The number printed on this payout's receipt in the dashboard. */
  receiptNumber: string;
  status: PayoutStatusValue;
  /** What was withdrawn from the balance (decimal major units of `currency`). */
  amount: number;
  /** What lands at the destination after fees. */
  netAmount: number;
  feeAmount: number;
  currency: string;
  /** `standard` or `instant`. */
  speed: string | null;
  createdAt: string;
  estimatedArrival: string | null;
  failureCode: string | null;
  /** Why a `failed` or `denied` payout did not go through. */
  failureMessage: string | null;
  /** The payout method's display name (never an account number). */
  destination: { name: string | null } | null;
}

export interface ListPayoutsParams {
  /** Only payouts in this status. */
  status?: PayoutStatusValue;
  /** How many payouts to return (1-50, default 20). */
  limit?: number;
}

export interface PayoutsResponse {
  data: Payout[];
  /** More payouts match than `limit` returned. */
  hasMore: boolean;
}

/** Where payouts stand for the account. */
export type PayoutAccountState =
  | 'not_connected'
  | 'setup_required'
  | 'identity_verification_required'
  | 'information_requested'
  | 'in_review'
  | 'on_hold'
  | 'active';

/** `GET /payouts/status`: one payouts state, with what (if anything) to do. */
export interface PayoutStatus {
  state: PayoutAccountState;
  /** True when a withdrawal can be made right now. */
  payoutsEnabled: boolean;
  /** True when the creator has something to do. */
  actionRequired: boolean;
  message: string;
  /** Dashboard page where the creator acts (null when nothing is needed). */
  actionUrl: string | null;
  /** Whether checkout is open for the store. */
  canSell: boolean;
  payoutAccountStatus: string | null;
  identityVerificationStatus: string | null;
  lastPayout: { id: string; status: PayoutStatusValue } | null;
  /** Whether the payout account was read live for this answer. */
  liveChecked: boolean;
}

/** One currency held at the payments partner. */
export interface PayoutBalancePot {
  currency: string;
  available: number;
  pending: number;
  reserve?: number;
  quotedAvailable?: number;
  quotedPending?: number;
  rate?: number;
  quoteFailed?: boolean;
}

/** `GET /payouts/balances`: the balance, quoted in the account currency. */
export interface PayoutBalance {
  mode: string;
  targetCurrency: string;
  /** Ready to withdraw, in `targetCurrency`. */
  available: number;
  /** Earned but still clearing, in `targetCurrency`. */
  pending: number;
  /** False when another currency could not be quoted. */
  quoted: boolean;
  pots: PayoutBalancePot[];
  leftovers: Array<{
    currency: string;
    available: number;
    quotedAvailable: number | null;
    rate: number | null;
    quoteFailed: boolean;
  }>;
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
  /**
   * Subscription payments only: `initial` for the first charge, `renewal`
   * afterwards, `usage` for a usage-based overage charged at a period's end.
   */
  billingReason?: 'initial' | 'renewal' | 'usage';
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
  /** Where the contact came from. */
  source?: 'form' | 'checkout' | 'import' | 'dashboard' | 'api';
  /** ISO 3166-1 alpha-2 country, when known. */
  country?: string | null;
  /** Lifetime spend, integer cents of your currency. */
  totalSpentCents?: number;
  purchaseCount?: number;
  lastPurchaseAt?: string | null;
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
  failureReason?:
    | 'SEND_ALLOWANCE_EXCEEDED'
    | 'SELLER_BLOCKED'
    | 'EMAIL_SENDING_PAUSED'
    | 'DAILY_SEND_LIMIT'
    | 'FEATURE_LOCKED'
    | 'PAID_NEWSLETTER_DISABLED';
  /** Who gets it: everyone (default), free subscribers only or paying members only. */
  audience?: PostAudience;
  /** Paid posts: email free subscribers the preview and an upgrade link. */
  sendPreviewToFree?: boolean;
  /** List the post on your public newsletter archive once sent. */
  publishToWeb?: boolean;
  /** The audience segment it is sent to, if any. */
  segmentId?: string | null;
  /** On a resend to non-openers: the original post. */
  resendOf?: string;
  /** The resend to non-openers scheduled from this post. */
  resend?: { postId: string; subject: string; delayHours: number; scheduledAt: string } | null;
  /** The subject line test this post runs, if any. */
  subjectTest?: SubjectTestState | null;
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
  /** Send to an audience segment (Growth plan). */
  segmentId?: string | null;
  /** `free` / `paid` need the paid newsletter (Growth plan). Defaults to `everyone`. */
  audience?: PostAudience;
  /** Paid posts: email free subscribers the preview and an upgrade link (default true). */
  sendPreviewToFree?: boolean;
  /** List the post on your public archive once sent (default false). */
  publishToWeb?: boolean;
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
  /** One-time codes: every recipient gets their own code (Growth plan). */
  uniquePerRecipient?: boolean;
  /** Hours a one-time code stays valid (1–720, default 48). */
  uniqueExpiryHours?: number;
  testMode: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** `discounts.apply()` result: for a one-time code, the code reserved for the buyer. */
export interface AppliedDiscount extends Discount {
  uniqueCode?: { code: string; expiresAt: string; emailBound: boolean };
}

export interface ApplyDiscountOptions {
  /** The buyer's email (needed for one-time codes bound to an email). */
  email?: string;
  /** The checkout's `promotionToken` when the same checkout applies the code again. */
  reservation?: string;
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
  /** One-time codes per recipient (turning it on needs the Growth plan) */
  uniquePerRecipient?: boolean;
  /** Hours a one-time code stays valid, 1–720 (default 48) */
  uniqueExpiryHours?: number;
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
  uniquePerRecipient?: boolean;
  uniqueExpiryHours?: number;
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
  /**
   * Product page theme when the page uses no template. `system` follows the
   * buyer's device. Default `light`.
   */
  pageTheme?: BuyerThemeMode;
  /**
   * Checkout theme when the checkout uses no template. `system` follows the
   * buyer's device. Default `light`.
   */
  checkoutTheme?: BuyerThemeMode;
  /** Per-seat and metered pricing (Pro plan). */
  usagePricing?: UsagePricing;
}

/** Light / dark for a buyer page that uses no template. */
export type BuyerThemeMode = "light" | "dark" | "system";

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
  'payout.created',
  'payout.updated',
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

/** Fields shared by the subscription retention events (same as `customer.subscription.*`). */
export interface SubscriptionEventBase extends WebhookEventPayload {
  subscription: { id: string; customerId: string };
  customer: { email: string; firstName: string | null; lastName: string | null };
  /** The subscriber (membership) id. */
  subscriptionCustomerId: string;
}

/** The failed payment recovery attached to `subscription.payment_failed` / `subscription.recovered`. */
export interface RetentionRecoveryBlock {
  id: string;
  status: RecoveryStatus;
  amount: number;
  currency: string;
  paymentId: string;
  firstFailedAt: string | null;
  attempts: number;
  retryStep: number;
  nextRetryAt: string | null;
}

/** `subscription.payment_failed`: a renewal failed; recovery retries it on days 1, 3, 5 and 7. */
export interface SubscriptionPaymentFailedEvent extends SubscriptionEventBase {
  type: 'subscription.payment_failed';
  amount: number;
  currency: string;
  paymentId: string;
  failureMessage: string | null;
  recovery: RetentionRecoveryBlock;
  paymentMethod: Record<string, unknown> | null;
}

/** `subscription.recovered`: a failed renewal was paid after all. */
export interface SubscriptionRecoveredEvent extends SubscriptionEventBase {
  type: 'subscription.recovered';
  amount: number;
  currency: string;
  paymentId: string;
  recoveredAt: string | null;
  recovery: RetentionRecoveryBlock;
  paymentMethod: Record<string, unknown> | null;
}

/** `subscription.saved`: a subscriber took a save offer instead of canceling. */
export interface SubscriptionSavedEvent extends SubscriptionEventBase {
  type: 'subscription.saved';
  reason: CancelReason;
  offer: 'pause' | 'discount';
  pauseMonths: number | null;
  resumeAt: string | null;
  discountPercent: number | null;
  discountMonths: number | null;
  savedAt: string;
}

/** `usage.recorded`: usage was reported for a metered subscription. */
export interface UsageRecordedEvent extends WebhookEventPayload {
  type: 'usage.recorded';
  usageRecord: UsageRecord;
  subscriptionCustomerId: string;
  subscriptionId: string;
  period: { id: string; start: string; end: string };
}

/** `usage.period_closed`: a usage period closed and its overage was billed (or is due). */
export interface UsagePeriodClosedEvent extends WebhookEventPayload {
  type: 'usage.period_closed';
  period: UsagePeriod;
  subscriptionCustomerId: string;
  subscriptionId: string;
}

/** `installment.paid`: a payment plan installment was paid. */
export interface InstallmentPaidEvent extends WebhookEventPayload {
  type: 'installment.paid';
  installment: { index: number; of: number; remaining: number };
  product: { id: string };
  order: { id: string; paymentIntentId: string } | null;
  customer: { email: string };
  amount: number;
  currency: string;
  paymentId: string;
}

/** `installment.failed`: a payment plan installment failed. */
export interface InstallmentFailedEvent extends WebhookEventPayload {
  type: 'installment.failed';
  installment: { index: number; of: number };
  product: { id: string };
  customer: { email: string };
  amount: number;
  currency: string;
  paymentId: string;
  planId: string;
  failureMessage: string | null;
}

/** `split.created`: a sale of a shared product was split (amounts in cents of `currency`). */
export interface SplitCreatedEvent extends WebhookEventPayload {
  type: 'split.created';
  role: 'owner' | 'collaborator';
  order: { id: string };
  product: { id: string; name: string | null };
  split: {
    saleId: string;
    currency: string;
    saleAmountCents: number;
    platformFeeCents: number;
    affiliateCents: number;
    baseCents: number;
    /** Null in a co-creator's copy. */
    ownerCents: number | null;
    shares: Array<{
      splitId: string;
      collaboratorEmail: string;
      sharePercent: number;
      amountCents: number;
      status: RevenueSplitShareStatus;
    }>;
  };
  createdAt: string;
}

/** `split.paid`: a co-creator's shares were paid out. */
export interface SplitPaidEvent extends WebhookEventPayload {
  type: 'split.paid';
  role: 'owner' | 'collaborator';
  payout: {
    id: string;
    /** Net transferred, cents. */
    amountCents: number;
    grossCents: number;
    /** Refunds of earlier paid shares netted from this payout. */
    clawbackCents: number;
    currency: string;
    shareCount: number;
    paidAt: string | null;
  };
}

/** `course.completed`: a buyer finished every lesson of a course. */
export interface CourseCompletedEvent extends WebhookEventPayload {
  type: 'course.completed';
  order: { id: string };
  product: { id: string; name: string };
  customer: { email: string };
  lessons: number;
  completedAt: string;
}

/** `certificate.issued`: a buyer earned a course certificate. */
export interface CertificateIssuedEvent extends WebhookEventPayload {
  type: 'certificate.issued';
  certificate: {
    id: string;
    name: string;
    course: string;
    issuedAt: string;
    verifyUrl: string;
    pdfUrl: string;
  };
  order: { id: string };
  product: { id: string };
  customer: { email: string };
}

/** `testimonial.submitted`: a buyer sent a testimonial; it waits for your moderation. */
export interface TestimonialSubmittedEvent extends WebhookEventPayload {
  type: 'testimonial.submitted';
  testimonial: {
    id: string;
    productId: string;
    productName: string;
    saleId: string;
    buyerEmail: string;
    displayName: string;
    rating: number;
    text: string;
    video: TestimonialVideo | null;
    status: 'pending';
    submittedAt: string | null;
  };
}

/** Fields shared by `member.joined` and `member.left`. */
export interface MemberEventBase extends WebhookEventPayload {
  membership: { id: string; name: string; slug: string };
  member: { email: string; name: string | null };
}

/** `member.joined`: someone got access to a membership. */
export interface MemberJoinedEvent extends MemberEventBase {
  type: 'member.joined';
  joinedAt: string;
}

/** `member.left`: someone lost access to a membership. */
export interface MemberLeftEvent extends MemberEventBase {
  type: 'member.left';
  joinedAt: string | null;
  leftAt: string;
  reason: 'subscription_ended' | 'membership_changed' | 'membership_closed';
}

/**
 * `ab_test.completed`: an A/B test ended (a winner, a stop, or an edit of the
 * product).
 */
export interface AbTestCompletedEvent {
  /** The event id. */
  id: string;
  type: 'ab_test.completed';
  /** The A/B test id. */
  testId: string;
  /** The A/B test type. */
  testType: AbTestType;
  /** When the event was created, Unix seconds. */
  created: number;
  /** The endpoint this delivery was sent to. */
  webhookId: string;
  /** `true` on deliveries sent by `webhooks.test()`. */
  test?: boolean;
  name: string;
  productId: string;
  status: 'completed' | 'stopped';
  endReason: AbTestEndReason;
  endDetail: string | null;
  winner: AbTestVariant | null;
  startedAt: string;
  endedAt: string | null;
  currency: string | null;
  results: Array<
    Pick<
      AbTestVariantResult,
      | 'variantId'
      | 'key'
      | 'label'
      | 'control'
      | 'visitors'
      | 'conversions'
      | 'conversionRate'
      | 'revenue'
      | 'revenuePerVisitor'
      | 'probabilityToBeat'
      | 'pValue'
    >
  >;
  [key: string]: unknown;
}

/** `affiliate.tier_changed`: an affiliate reached a new commission tier. */
export interface AffiliateTierChangedEvent extends WebhookEventPayload {
  type: 'affiliate.tier_changed';
  affiliate: { id: string; email: string };
  previousTier: { index: number; minSales: number; rate: number } | null;
  tier: { index: number; minSales: number; rate: number };
  period: TierPeriod;
  periodSales: number;
  order: { id: string };
  changedAt: string;
}

/** `loyalty.credit_redeemed`: a buyer spent loyalty points as store credit. */
export interface LoyaltyCreditRedeemedEvent extends WebhookEventPayload {
  type: 'loyalty.credit_redeemed';
  customer: { email: string };
  order: { id: string };
  points: number;
  credit: { amount: number; currency: string };
  balance: { points: number; credit: number };
  redeemedAt: string;
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
  /** What the creator sells (onboarding, optional). `null` when skipped. */
  sellingPath?: SellingPath | null;
  /** Their own words when `sellingPath` is `'other'`. */
  sellingPathOther?: string | null;
  /**
   * Where buyers pay: `'pages'` (Pocketsflow creator and product pages, no
   * code) or `'code'` (their own site or app: embedded checkout, checkout
   * sessions, this SDK or the MCP server). `null` when skipped: treat as
   * `'pages'`.
   */
  sellingSetup?: SellingSetup | null;
  createdAt?: string;
  updatedAt?: string;
}

/** What a creator sells, from onboarding. */
export type SellingPath = 'digital' | 'membership' | 'software' | 'other';

/** Where a creator's buyers pay, from onboarding. */
export type SellingSetup = 'pages' | 'code';

/** `users.updateSellingProfile()` result: the saved answers. */
export interface SellingProfile {
  sellingPath: SellingPath | null;
  sellingPathOther: string | null;
  sellingSetup: SellingSetup | null;
}

/**
 * Params of `users.updateSellingProfile()`. Send only what changes; `null`
 * clears an answer. `sellingPathOther` (max 280 characters) is only kept
 * with `sellingPath: 'other'`.
 */
export interface UpdateSellingProfileParams {
  sellingPath?: SellingPath | null;
  sellingPathOther?: string | null;
  sellingSetup?: SellingSetup | null;
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
  disabledReason: 'creator' | 'refunded' | 'disputed' | 'subscription_ended' | null;
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
// Paid newsletter (Growth `paidNewsletter`)
// ----------------------------------------------------------------------------

/** Who receives a post: everyone (default), free subscribers only, or paying members only. */
export type PostAudience = 'everyone' | 'free' | 'paid';

export interface PaidNewsletterStats {
  /** Live subscriptions (active, trialing, past due or paused) to the membership offers. */
  paidSubscribers: number;
  /** Active subscribers without the `paid` tag. */
  freeSubscribers: number;
  /** Monthly recurring revenue, cents of `currency` (yearly plans count 1/12). */
  mrrCents: number;
  /** ISO 4217, your account currency. */
  currency: string;
  /** paid / (paid + free), 0–1. */
  conversionRate: number;
  monthlyMembers: number;
  yearlyMembers: number;
  newPaidLast30Days: number;
  canceledLast30Days: number;
}

/** A subscription offer a paid newsletter sells. */
export interface NewsletterMembershipOffer {
  id: string;
  frequency: 'monthly' | 'yearly';
  /** Decimal, account currency. */
  price: number;
  currency: string;
  /** e.g. `$9/month`. */
  priceLabel: string | null;
}

export interface PaidNewsletter {
  enabled: boolean;
  monthlyOfferId: string | null;
  yearlyOfferId: string | null;
  title: string;
  description: string;
  archiveEnabled: boolean;
  lastSyncedAt: string | null;
  /** `https://<subdomain>.pocketsflow.com/newsletter` */
  archiveUrl: string;
  /** Whether your plan includes the paid newsletter. */
  entitled: boolean;
  offers: NewsletterMembershipOffer[];
  stats: PaidNewsletterStats;
}

export interface UpdatePaidNewsletterParams {
  /** `true` needs at least one offer and the Growth plan. */
  enabled?: boolean;
  /** One of your subscription offers with frequency `monthly`. */
  monthlyOfferId?: string | null;
  /** One of your subscription offers with frequency `yearly`. */
  yearlyOfferId?: string | null;
  /** At most 120 characters. */
  title?: string;
  /** At most 500 characters. */
  description?: string;
  archiveEnabled?: boolean;
}

/** Response of `paidNewsletter.sync()`. */
export interface PaidNewsletterSyncResult {
  paid: number;
  added: number;
  untagged: number;
}

export interface SetPostAudienceParams {
  audience?: PostAudience;
  /** Paid posts: email free subscribers the preview and an upgrade link (default true). */
  sendPreviewToFree?: boolean;
  /** List on the public archive once sent (default false). */
  publishToWeb?: boolean;
}

// ----------------------------------------------------------------------------
// Resends to non-openers and subject tests (Growth `resendNonOpeners`)
// ----------------------------------------------------------------------------

export interface ResendToNonOpenersParams {
  /** The new subject line. */
  subject: string;
  /** Hours after the original send, 1–168 (default 48). */
  delayHours?: number;
}

export interface PostResend {
  recipients: number;
  opened: number;
  openRate: number;
  nonOpeners: number;
  /** Whether a resend can be scheduled now. */
  eligible: boolean;
  reason:
    | 'NOT_SENT'
    | 'IS_RESEND'
    | 'IS_TEST_ARM'
    | 'ALREADY_SCHEDULED'
    | 'ALREADY_RESENT'
    | 'NO_NON_OPENERS'
    | null;
  resend: null | {
    postId: string;
    subject: string;
    delayHours: number;
    scheduledAt: string;
    status: PostStatus | 'deleted';
    sentAt: string | null;
    failureReason: string | null;
    sent: number;
    opened: number;
    openRate: number;
  };
}

export interface StartSubjectTestParams {
  /** Must differ from the post's subject. */
  subjectB: string;
  /** Share of the audience in the test, 10–50 (default 20). */
  testPercent?: number;
  /** Hours before the winner goes to the rest, 1–72 (default 4). */
  waitHours?: number;
}

export interface SubjectTestArm {
  postId: string;
  subject: string;
  status: PostStatus | 'deleted';
  recipients: number;
  sent: number;
  opened: number;
  openRate: number;
}

/** The subject test state stored on a post. */
export interface SubjectTestState {
  subjectA: string;
  subjectB: string;
  testPercent: number;
  waitHours: number;
  status: 'testing' | 'decided';
  variantAPostId: string;
  variantBPostId: string;
  testRecipients: number;
  audienceSize: number;
  startedAt: string;
  decideAt: string;
  decidedAt?: string;
  winner?: 'A' | 'B';
  results?: Record<'A' | 'B', { sent: number; opened: number; openRate: number }>;
}

export interface SubjectTest {
  subjectTest: SubjectTestState | null;
  arms: { A: SubjectTestArm; B: SubjectTestArm } | null;
  rest: { status: PostStatus; recipients: number; sent: number; opened: number; openRate: number } | null;
}

// ----------------------------------------------------------------------------
// Audience segments (Growth `audienceSegments`)
// ----------------------------------------------------------------------------

export type SegmentMatch = 'all' | 'any';

export type SegmentRule =
  | { type: 'bought' | 'notBought'; productId: string }
  | { type: 'spent'; op?: 'gt' | 'lt'; amountCents: number }
  | { type: 'boughtWithin' | 'notBoughtWithin'; days: number }
  | { type: 'engagedWithin'; days: number; event?: 'opened' | 'clicked' | 'any' }
  | { type: 'tag' | 'notTag'; tag: string }
  /** ISO 3166-1 alpha-2 codes. */
  | { type: 'country'; countries: string[] }
  | { type: 'source'; source: 'form' | 'checkout' | 'import' | 'dashboard' | 'api' };

export interface SegmentDefinition {
  /** How groups combine (default `all`). */
  match?: SegmentMatch;
  /** At most 10 groups of at most 20 rules. */
  groups: Array<{ match?: SegmentMatch; rules: SegmentRule[] }>;
}

export interface CreateSegmentParams {
  /** At most 80 characters. */
  name: string;
  /** At most 280 characters. */
  description?: string;
  definition: SegmentDefinition;
  /** A tag kept in sync on matching contacts (`^[a-z0-9][a-z0-9_-]{0,31}$`). */
  smartTag?: string | null;
}

export type UpdateSegmentParams = Partial<CreateSegmentParams>;

export interface Segment {
  _id: string;
  name: string;
  description: string;
  definition: SegmentDefinition;
  smartTag: string | null;
  lastCount: number | null;
  lastCountAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentListResponse {
  data: Segment[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface SegmentPreview {
  count: number;
  sample: Array<{ _id: string; email: string; name: string }>;
  computedAt: string;
}

export interface SegmentCount {
  segmentId: string;
  count: number;
  computedAt: string;
}

export interface ListSegmentSubscribersParams {
  limit?: number;
  /** `nextCursor` of the previous page. */
  after?: string;
}

export interface SegmentSubscribersResponse {
  data: EmailSubscriber[];
  nextCursor: string | null;
}

// ----------------------------------------------------------------------------
// Usage-based and per-seat pricing (Pro `usagePricing`)
// ----------------------------------------------------------------------------

export type MeterPricing = 'per_unit' | 'graduated' | 'volume';

export interface MeterTier {
  /** Billable units; null on the last tier. */
  upTo: number | null;
  /** Cents per `packageSize` units. */
  unitAmountCents: number;
  flatAmountCents?: number;
}

export interface Meter {
  /** `^[a-z0-9][a-z0-9_.-]{0,39}$` */
  key: string;
  name: string;
  unit?: string;
  pricing: MeterPricing;
  /** `per_unit` pricing. */
  unitAmountCents?: number;
  /** Default 1. */
  packageSize?: number;
  /** Default 0. */
  includedUnits?: number;
  /** `graduated` / `volume` pricing, at most 10. */
  tiers?: MeterTier[];
}

export interface UsagePricing {
  seats?: {
    enabled: boolean;
    /** Default 1. */
    minSeats?: number;
    /** Null = no maximum (cap 10,000). */
    maxSeats?: number | null;
    licenseKeys?: boolean;
  };
  /** At most 5. */
  meters?: Meter[];
}

export interface ReportUsageParams {
  /** The meter key. */
  meter: string;
  /** Integer, 0–1,000,000,000. */
  quantity: number;
  /** ISO 8601 date-time; defaults to now. */
  timestamp?: string;
  /** At most 255 characters; also sent as the `Idempotency-Key` header. */
  idempotencyKey?: string;
}

export interface UsageRecord {
  id: string;
  meter: string;
  quantity: number;
  timestamp: string;
  idempotencyKey: string | null;
  periodId: string;
  source: 'api' | 'dashboard';
  createdAt: string | null;
}

export interface ReportUsageResponse {
  usageRecord: UsageRecord;
  period?: { id: string; start: string; end: string };
  /** `true` when the idempotency key was seen before (nothing new recorded). */
  replayed: boolean;
}

export type UsageChargeStatus = 'not_due' | 'processing' | 'paid' | 'failed' | 'due' | 'uncollectible';

export interface UsageLine {
  kind: 'meter' | 'seats';
  meter?: string;
  name: string;
  totalUnits: number;
  includedUnits: number;
  billableUnits: number;
  amountCents: number;
}

export interface UsagePeriod {
  id: string;
  start: string;
  end: string;
  status: 'open' | 'closing' | 'closed';
  currency: string;
  overageCents: number;
  totals: UsageLine[];
  charge: {
    status: UsageChargeStatus;
    /** e.g. `no_saved_payment_method`, `collection_paused`. */
    reason: string | null;
    paymentId: string | null;
    message: string | null;
    settledAt: string | null;
    /** Scheduled retries started (at most 4). */
    retries: number;
    nextRetryAt: string | null;
    /** The order a paid overage became. */
    saleId: string | null;
  };
  closedAt: string | null;
}

export interface GetUsageParams {
  /** How many recent usage records to return. */
  limit?: number;
}

export interface UsageSummary {
  subscriber: {
    id: string;
    subscriptionId: string;
    status: string;
    quantity: number;
    purchasedQuantity: number;
  };
  pricing: Required<UsagePricing> & { seatPriceCents: number; frequency: string; periodDays: number };
  currency: string;
  currentPeriod: {
    id: string | null;
    start: string;
    end: string;
    status: string;
    lines: UsageLine[];
    upcomingOverageCents: number;
  };
  daily: Array<{ date: string; meter: string; units: number }>;
  records: UsageRecord[];
  /** The last 12 closed periods, newest first. */
  periods: UsagePeriod[];
  outstandingCents: number;
  entitled: boolean;
}

export interface UpdateSeatsParams {
  /** The new seat count. */
  quantity: number;
}

export interface UpdateSeatsResponse {
  subscriber: { id: string; quantity: number; purchasedQuantity: number };
  changed: boolean;
  previousQuantity: number;
}

export interface UpdateUsagePricingResponse {
  subscriptionId: string;
  usagePricing: Required<UsagePricing>;
}

// ----------------------------------------------------------------------------
// Payment plans and exit offers (Growth `paymentPlans`, `exitOffers`)
// ----------------------------------------------------------------------------

export interface PaymentPlanSettings {
  enabled: boolean;
  /** 2–6 (default 3). Payments are 30 days apart. */
  installments: number;
  /** 0–25, up to two decimals. */
  surchargePercent: number;
}

export interface ExitOfferSettings {
  enabled: boolean;
  valueType: 'percentage' | 'fixed';
  /** Whole percent 1–90, or an amount in your account currency. */
  value: number;
  /** The discount that carries the offer's code (read-only). */
  discountId: string;
}

export interface DownsellSettings {
  enabled: boolean;
  productId: string;
  /** 0 = the product's own price. */
  price: number;
}

export interface CheckoutOfferSettings {
  paymentPlan: PaymentPlanSettings;
  exitOffer: ExitOfferSettings;
  downsell: DownsellSettings;
}

export type UpdatePaymentPlanParams = Partial<PaymentPlanSettings>;

export interface UpdateExitOfferParams {
  exitOffer?: Partial<Omit<ExitOfferSettings, 'discountId'>>;
  downsell?: Partial<DownsellSettings>;
}

export interface ExitOfferUpdate {
  exitOffer: ExitOfferSettings;
  downsell: DownsellSettings;
}

/** What a product's checkout offers buyers now (public). */
export interface CheckoutOffers {
  paymentPlan: { installments: number; surchargePercent: number; intervalDays: number } | null;
  exitOffer: { valueType: 'percentage' | 'fixed'; value: number } | null;
  downsell: { productId: string; name: string; thumbnail: string; price: number } | null;
}

// ----------------------------------------------------------------------------
// Launch pricing (Growth `flashSales`, `fairPricing`, `earlyBirdPricing`)
// ----------------------------------------------------------------------------

export type FlashSaleStatus = 'scheduled' | 'live' | 'ended';

export interface FlashSale {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  /** Computed from the clock. */
  status: FlashSaleStatus;
  valueType: 'percentage' | 'fixed';
  /** Whole percent 1–90, or an amount in your currency. */
  value: number;
  allProducts: boolean;
  productIds: string[];
  announcementPostId: string | null;
  stats: { sales: number; revenue: number };
  createdAt: string | null;
}

export interface ListFlashSalesParams {
  status?: FlashSaleStatus;
}

export interface FlashSaleListResponse {
  flashSales: FlashSale[];
  currency: string;
  now: string;
}

export interface CreateFlashSaleParams {
  /** At most 80 characters. */
  name: string;
  startsAt: string;
  /** In the future, at most 90 days after `startsAt`. */
  endsAt: string;
  /** Default `percentage`. */
  valueType?: 'percentage' | 'fixed';
  value: number;
  /** Empty or omitted = the whole store. */
  productIds?: string[];
  allProducts?: boolean;
}

export type UpdateFlashSaleParams = Partial<CreateFlashSaleParams>;

export interface CreateFlashSaleAnnouncementParams {
  /** The link the email points to (defaults to your store). */
  url?: string;
}

export interface FlashSaleAnnouncement {
  /** The draft newsletter post. */
  postId: string;
  /** `false` when the sale already had an announcement. */
  created: boolean;
}

export type FairPricingTierKey = 't1' | 't2' | 't3' | 't4';
/** Percent off per tier, 0–80. */
export type FairPricingTierPercents = Record<FairPricingTierKey, number>;

export interface FairPricingSettings {
  enabled: boolean;
  tiers: FairPricingTierPercents;
  /** ISO2 country → percent off, 0–80 (0 = full price). */
  countryOverrides: Record<string, number>;
}

export interface FairPricingResponse {
  settings: FairPricingSettings;
  tiers: Array<{
    key: FairPricingTierKey;
    minLevel: number;
    maxLevel: number;
    defaultPercentOff: number;
    countries: Array<{ code: string; name: string }>;
  }>;
  /** 80. */
  maxPercentOff: number;
}

export interface UpdateFairPricingParams {
  enabled?: boolean;
  tiers?: Partial<FairPricingTierPercents>;
  countryOverrides?: Record<string, number>;
}

export interface FairPricingAnalyticsParams {
  /** 1–365 (default 30). */
  days?: number;
}

export interface FairPricingAnalytics {
  days: number;
  currency: string;
  totals: { sales: number; revenue: number; discountGiven: number; countries: number; mismatches: number };
  byCountry: Array<{
    country: string;
    countryName: string;
    sales: number;
    revenue: number;
    discountGiven: number;
    averagePercentOff: number;
    mismatches: number;
  }>;
  daily: Array<{ date: string; sales: number; revenue: number }>;
}

export interface PriceSteps {
  enabled: boolean;
  steps: Array<{
    id: string;
    price: number;
    maxSales: number | null;
    endsAt: string | null;
    sold: number;
    /** Sold plus held by buyers paying now. */
    taken: number;
    status: 'open' | 'upcoming' | 'sold_out' | 'ended';
  }>;
  current: {
    index: number;
    price: number;
    left: number | null;
    maxSales: number | null;
    endsAt: string | null;
    nextPrice: number;
  } | null;
}

export interface SetPriceStepsParams {
  enabled?: boolean;
  /** At most 5. */
  steps?: Array<{ id?: string; price: number; maxSales?: number | null; endsAt?: string | null }>;
}

export interface ProductFairPricing {
  mode: 'store' | 'off' | 'custom';
  /** `custom` only. */
  tiers?: Partial<FairPricingTierPercents>;
}

export interface ProductLaunchPricing {
  productId: string;
  price: number;
  priceSteps: PriceSteps;
  fairPricing: ProductFairPricing;
}

export interface ProductPriceStepsUpdate {
  productId: string;
  price: number;
  priceSteps: PriceSteps;
}

export interface ProductFairPricingUpdate {
  productId: string;
  fairPricing: ProductFairPricing;
}

export interface PriceStepsOverview {
  currency: string;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    thumbnail: string | null;
    priceSteps: PriceSteps;
  }>;
}

export interface PriceQuoteParams {
  variantId?: string;
  discountId?: string;
  /** The buyer's IANA time zone; without it fair pricing does not apply. */
  tz?: string;
  billingCountry?: string;
  /** Order bumps in the cart (sent comma-separated); adds `cart` to the quote. */
  orderBumpIds?: string[];
  /** A/B tests: the visitor id. */
  vid?: string;
  /** A/B tests: the variant id the page rendered. */
  abv?: string;
}

export interface PriceQuote {
  productId: string;
  /** Your currency; every amount below is in it. */
  currency: string;
  payWant: boolean;
  listPrice: number | null;
  basePrice: number | null;
  price: number | null;
  applied: {
    source: 'flash_sale' | 'fair_pricing' | 'code';
    label: string;
    valueType: 'percentage' | 'fixed';
    value: number;
    amountOff: number;
  } | null;
  codeIgnored: boolean;
  earlyBird: {
    index: number;
    count: number;
    price: number;
    nextPrice: number;
    left: number | null;
    maxSales: number | null;
    endsAt: string | null;
  } | null;
  flashSale: {
    id: string;
    name: string;
    endsAt: string;
    valueType: 'percentage' | 'fixed';
    value: number;
    applied: boolean;
  } | null;
  fairPricing: {
    country: string;
    countryName: string;
    percentOff: number;
    applied: boolean;
    reason: 'ok' | 'billing_mismatch';
  } | null;
  /** With `orderBumpIds`: the cart as the checkout charges it (before tax). */
  cart?: {
    items: Array<{ productId: string; orderBumpId?: string; price: number }>;
    subtotal: number;
    tieredDiscount: TieredDiscountApplied | null;
    total: number;
  } | null;
}

/** How launch pricing priced an order (also in `order.completed`). */
export interface PricingRecord {
  listPrice: number;
  basePrice: number;
  price: number;
  amountOff: number;
  currency: string;
  source: 'flash_sale' | 'fair_pricing' | 'code' | null;
  earlyBird?: { stepId: string; index: number; price: number; nextPrice: number };
  /** The buyer's personal-deadline offer, when it set the base price. */
  personalOffer?: { id: string; price: number };
  flashSale?: { id: string; name: string; valueType: string; value: number };
  fairPricing?: {
    country: string;
    tier: string;
    percentOff: number;
    billingCountry?: string;
    verified?: boolean;
  };
  code?: { id: string; code: string; kind: 'discount_code' | 'unique_coupon' };
  codeIgnored?: boolean;
}

// ----------------------------------------------------------------------------
// Drip content, quizzes and certificates (Growth `dripContent`)
// ----------------------------------------------------------------------------

export type CourseDripRule =
  | { type: 'immediate' }
  /** 1–3650 days after the purchase. */
  | { type: 'afterDays'; days: number }
  /** ISO 8601. */
  | { type: 'onDate'; date: string };

export interface CourseQuizOption {
  id?: string;
  text: string;
  correct?: boolean;
}

export interface CourseQuizQuestion {
  id?: string;
  prompt: string;
  type?: 'single' | 'multiple';
  /** 2–10 options. */
  options: CourseQuizOption[];
}

export interface CourseQuiz {
  /** Percent needed to pass. */
  passMark?: number;
  /** The next lesson stays locked until the quiz is passed. */
  mustPass?: boolean;
  /** At most 50 questions. */
  questions: CourseQuizQuestion[];
}

export interface CourseSettings {
  productId: string;
  name: string;
  entitled: boolean;
  lessons: Array<{
    lessonId: string;
    title: string;
    module: string;
    order: number;
    drip: CourseDripRule;
    quiz: Required<CourseQuiz> | null;
  }>;
  certificate: { enabled: boolean };
  notifyOnUnlock: boolean;
  updatedAt: string | null;
}

export interface UpdateCourseSettingsParams {
  lessons?: Array<{ lessonId: string; drip?: CourseDripRule; quiz?: CourseQuiz | null }>;
  certificate?: { enabled: boolean };
  notifyOnUnlock?: boolean;
}

export interface CourseLessonQuiz extends Required<CourseQuiz> {
  lessonId: string;
  title: string;
}

export interface CourseStats {
  enrolled: number;
  started: number;
  completed: number;
  certificates: number;
  /** Percent, one decimal. */
  completionRate: number;
  lessons: Array<{
    lessonId: string;
    title: string;
    completed: number;
    quiz: {
      takers: number;
      passed: number;
      attempts: number;
      passRate: number;
      averageScore: number;
    } | null;
  }>;
}

export interface Certificate {
  /** e.g. `7K2QX9MD4HTR`. */
  id: string;
  name: string;
  course: string;
  creator: string;
  lessons: number;
  issuedAt: string;
  valid: true;
  verifyUrl: string;
  pdfUrl: string;
}

// ----------------------------------------------------------------------------
// Analytics (Growth `advancedAnalytics`, Pro `mrrReports`)
// ----------------------------------------------------------------------------

export interface AnalyticsRangeParams {
  /** ISO date-time; defaults to 30 days before `to`. */
  from?: string;
  /** ISO date-time (a bare date covers the whole day); defaults to now; at most 732 days after `from`. */
  to?: string;
  /** `Date#getTimezoneOffset()` of the caller (UTC − local, minutes). Default 0. */
  timezoneOffsetMinutes?: number;
}

export interface AnalyticsRange {
  from: string;
  to: string;
  days: number;
  previous: { from: string; to: string };
}

export interface AnalyticsComparison {
  current: number;
  previous: number;
  change: number;
  /** Percent, one decimal; null when `previous` is 0. */
  changePct: number | null;
}

export interface AnalyticsPreview {
  currency: string;
  range: Omit<AnalyticsRange, 'previous'> & { previous?: { from: string; to: string } };
  funnel: { visits: number; productViews: number; checkouts: number; paid: number; revenue: number };
  topSource: { key: string; netRevenue: number } | null;
  mrr: { mrr: number; subscribers: number; newMrr: number; churnedMrr: number } | null;
}

export type AnalyticsKpi =
  | 'revenue'
  | 'netRevenue'
  | 'refunds'
  | 'orders'
  | 'averageOrder'
  | 'visits'
  | 'conversionRate'
  | 'customers'
  | 'repeatCustomers';

export interface AnalyticsSummary {
  currency: string;
  range: AnalyticsRange;
  kpis: Record<AnalyticsKpi, AnalyticsComparison>;
  series: {
    current: Array<{ day: string; revenue: number; netRevenue: number; orders: number }>;
    previous: Array<{ day: string; revenue: number; netRevenue: number; orders: number }>;
  };
}

export interface AnalyticsFunnelStage {
  visits: number;
  productViews: number;
  checkouts: number;
  paid: number;
  revenue: number;
  viewRate: number;
  checkoutRate: number;
  paidRate: number;
  conversionRate: number;
}

export interface SalesFunnelReport {
  currency: string;
  range: AnalyticsRange;
  totals: AnalyticsFunnelStage;
  previous: AnalyticsFunnelStage;
  /** `key` = source (`google.com`, a utm_source, `direct`, `unattributed`). */
  bySource: Array<AnalyticsFunnelStage & { key: string }>;
  /** `key` = product or subscription offer id. */
  byProduct: Array<
    AnalyticsFunnelStage & { key: string; name: string | null; type: 'product' | 'subscription' | null }
  >;
}

export type SourceDimension = 'source' | 'utm_source' | 'utm_medium' | 'utm_campaign';

export interface RevenueBySourceParams extends AnalyticsRangeParams {
  dimension?: SourceDimension;
}

export interface RevenueBySource {
  currency: string;
  range: AnalyticsRange;
  dimension: SourceDimension;
  rows: Array<{
    key: string;
    orders: number;
    revenue: number;
    refunds: number;
    netRevenue: number;
    share: number;
    previousNetRevenue: number;
  }>;
  totals: { orders: number; revenue: number; netRevenue: number; unattributedOrders: number };
}

export interface RepeatBuyerCohortsParams {
  months?: 3 | 6 | 12;
  timezoneOffsetMinutes?: number;
}

export interface RepeatBuyerCohorts {
  months: 3 | 6 | 12;
  /** `YYYY-MM` */
  startMonth: string;
  /** `YYYY-MM` */
  currentMonth: string;
  cohorts: Array<{ cohort: string; buyers: number; returning: number[]; retention: number[] }>;
  repeatRate: number;
  buyers: number;
  repeatBuyers: number;
}

export interface NetRevenueParams extends AnalyticsRangeParams {
  groupBy?: 'product' | 'country' | 'month';
}

export interface NetRevenue {
  currency: string;
  range: AnalyticsRange;
  groupBy: 'product' | 'country' | 'month';
  rows: Array<{
    key: string;
    name: string | null;
    orders: number;
    refunds: number;
    grossRevenue: number;
    refunded: number;
    netRevenue: number;
    refundRate: number;
  }>;
  totals: {
    orders: number;
    refunds: number;
    grossRevenue: number;
    refunded: number;
    netRevenue: number;
    refundRate: number;
  };
}

export interface MrrParams {
  from?: string;
  to?: string;
  /** One subscription offer only (404 when it isn't yours). */
  subscriptionId?: string;
}

export interface MrrSummary {
  mrr: number;
  mrrAtStart: number;
  arr: number;
  subscribers: number;
  subscribersAtStart: number;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  netMrrMovement: number;
  newSubscribers: number;
  churnedSubscribers: number;
  logoChurnRate: number | null;
  revenueChurnRate: number | null;
  monthlyChurnRate: number | null;
  arpu: number | null;
  ltv: number | null;
  trials: {
    started: number;
    ended: number;
    converted: number;
    conversionRate: number | null;
    trialing: number;
  } | null;
}

export interface MrrReport {
  currency: string;
  /** Days are UTC dates (`YYYY-MM-DD`). */
  range: AnalyticsRange;
  subscriptionId: string | null;
  hasTrials: boolean;
  summary: MrrSummary;
  previous: MrrSummary;
  series: Array<{
    day: string;
    mrr: number;
    subscribers: number;
    trialing: number;
    newMrr: number;
    expansionMrr: number;
    contractionMrr: number;
    churnedMrr: number;
    netMrr: number;
  }>;
  products: Array<
    MrrSummary & { subscriptionId: string; name: string | null; frequency: 'weekly' | 'monthly' | 'yearly' }
  >;
}

// ----------------------------------------------------------------------------
// Unique coupons (Growth `uniqueCoupons`)
// ----------------------------------------------------------------------------

export type UniqueCodeStatus = 'active' | 'redeemed' | 'expired';

export interface ListUniqueCodesParams {
  status?: UniqueCodeStatus;
  /** 1–200 (default 50). */
  limit?: number;
  /** `nextCursor` of the previous page. */
  before?: string;
}

export interface UniqueCode {
  _id: string;
  /** e.g. `VIP-7KQ2MX9D`. */
  code: string;
  /** Null = an unbound bearer code. */
  email: string | null;
  status: UniqueCodeStatus;
  source: 'email' | 'batch' | 'api';
  expiresAt: string;
  redeemedAt: string | null;
  createdAt: string;
}

export interface UniqueCodesResponse {
  discountId: string;
  uniquePerRecipient: boolean;
  expiresInHours: number;
  /** `{{unique_coupon:<discountId>}}` — put it in an email to issue one code per recipient. */
  mergeTag: string;
  stats: { issued: number; redeemed: number; expired: number; active: number };
  codes: UniqueCode[];
  nextCursor: string | null;
}

/** Issue codes for `emails` or `count` bearer codes (at most 5,000). */
export interface CreateUniqueCodesParams {
  emails?: string[];
  count?: number;
  /** 1–720. */
  expiresInHours?: number;
}

export interface CreatedUniqueCodes {
  batchId: string;
  count: number;
  codes: Array<{ code: string; email: string | null; expiresAt: string }>;
}

export interface ExportUniqueCodesParams {
  status?: UniqueCodeStatus;
}

// ----------------------------------------------------------------------------
// Personal deadlines (Pro `personalDeadlines`)
// ----------------------------------------------------------------------------

export interface DeadlineOffer {
  type: 'percentage' | 'fixed' | 'price';
  value: number;
}

export interface DeadlineFallback {
  type: 'full_price' | 'percentage' | 'fixed';
  value?: number;
}

export interface DeadlineTrigger {
  type: 'audience_joined' | 'lead_magnet' | 'automation_entered';
  /** `lead_magnet` only. */
  productId?: string;
  /** `automation_entered` only. */
  automationId?: string;
}

export interface CreatePersonalDeadlineParams {
  name: string;
  /** A fixed-price one-time product. */
  productId: string;
  /** 1–720 (default 72). */
  durationHours?: number;
  offer: DeadlineOffer;
  /** Default `{ type: "full_price" }`. */
  fallback?: DeadlineFallback;
  /** Default `{ type: "audience_joined" }`. */
  trigger?: DeadlineTrigger;
  active?: boolean;
}

export type UpdatePersonalDeadlineParams = Partial<CreatePersonalDeadlineParams>;

export interface PersonalDeadline extends CreatePersonalDeadlineParams {
  _id: string;
  testMode: boolean;
  /** Merge tags for your emails. */
  mergeTags: { countdown: string; link: string; block: string };
  stats?: { started: number; active: number; redeemed: number; expired: number };
  createdAt: string;
  updatedAt: string;
}

export type PersonalDeadlineState = 'active' | 'redeemed' | 'expired';

export interface PersonalDeadlineEntry {
  _id: string;
  email: string;
  state: PersonalDeadlineState;
  source: 'audience_joined' | 'lead_magnet' | 'automation_entered' | 'email' | 'api';
  startedAt: string;
  expiresAt: string;
  redeemedAt: string | null;
}

export interface ListPersonalDeadlineEntriesParams {
  status?: PersonalDeadlineState;
  limit?: number;
  /** `nextCursor` of the previous page. */
  before?: string;
}

export interface PersonalDeadlineEntriesResponse {
  entries: PersonalDeadlineEntry[];
  nextCursor: string | null;
}

/** Someone's personal link (and clock) on a deadline. */
export interface PersonalDeadlineLink {
  email: string;
  /** `https://<store>.pocketsflow.com/<slug>?pf_sid=…` */
  url: string;
  sid: string | null;
  /** `false` → `url` is the plain product link. */
  personalized: boolean;
  entry: { state: PersonalDeadlineState; startedAt: string; expiresAt: string } | null;
}

export interface PersonalOfferParams {
  productId: string;
  /** The visitor's `pf_sid`. */
  sid?: string;
  /** A/B tests: the visitor id. */
  vid?: string;
  /** A/B tests: the variant id the page rendered. */
  abv?: string;
}

export interface PersonalOffer {
  state: 'none' | 'active' | 'expired' | 'redeemed';
  deadlineId?: string;
  name?: string;
  expiresAt?: string;
  msLeft?: number;
  /** e.g. `ends in 47 hours`. */
  endsIn?: string;
  offer?: DeadlineOffer;
  listPrice?: number;
  offerPrice?: number | null;
  fallback?: { type: DeadlineFallback['type']; value: number | null };
  fallbackPrice?: number;
}

// ----------------------------------------------------------------------------
// Subscription retention (Pro `failedPaymentRecovery`, `cancellationSaveOffers`, `introPricing`)
// ----------------------------------------------------------------------------

export interface RetentionEntitlement {
  allowed: boolean;
  requiredPlan: PlanId;
}

export interface MoneyByCurrency {
  currency: string;
  /** Major units. */
  amount: number;
  count: number;
}

export interface RecoverySummaryParams {
  days?: number;
}

export interface RecoverySummary {
  days: number;
  recovered: MoneyByCurrency[];
  recoveredCount: number;
  atRisk: MoneyByCurrency[];
  atRiskCount: number;
  lostCount: number;
  /** Percent. */
  recoveryRate: number | null;
  entitlement: RetentionEntitlement;
}

export type RecoveryStatus = 'open' | 'recovered' | 'canceled' | 'paused' | 'kept' | 'lost';

export interface PaymentRecovery {
  id: string;
  status: RecoveryStatus;
  subscriptionId: string;
  subscriptionCustomerId: string;
  productName: string;
  buyerEmail: string;
  amount: number;
  currency: string;
  firstFailedAt: string;
  attempts: number;
  /** 0–4. */
  retryStep: number;
  maxRetries: number;
  nextRetryAt: string | null;
  lastFailureMessage: string | null;
  recoveredAt: string | null;
  recoveredAmount: number;
  closeReason: string | null;
}

export interface ListAtRiskParams extends PaginationParams {
  status?: 'open' | 'recovered' | 'closed';
}

export interface PaymentRecoveryPage {
  items: PaymentRecovery[];
  total: number;
  page: number;
  pageSize: number;
}

export type RecoveryFinalAction = 'cancel' | 'pause' | 'keep';

export interface RecoverySettings {
  enabled: boolean;
  /** What happens after the last retry fails. */
  finalAction: RecoveryFinalAction;
  emailBuyer: boolean;
  /** `[1, 3, 5, 7]` */
  retryDays: number[];
  /** `getRecoverySettings()` only. */
  entitlement?: RetentionEntitlement;
}

export type UpdateRecoverySettingsParams = Partial<
  Pick<RecoverySettings, 'enabled' | 'finalAction' | 'emailBuyer'>
>;

export type CancelReason =
  | 'too_expensive'
  | 'not_using'
  | 'missing_features'
  | 'technical_issues'
  | 'switching'
  | 'other';

export interface SaveOffersReportParams {
  days?: number;
}

export interface SaveOffersReport {
  days: number;
  saved: number;
  savedPause: number;
  savedDiscount: number;
  canceled: number;
  total: number;
  saveRate: number | null;
  revenueKept: MoneyByCurrency[];
  reasons: Array<{ reason: CancelReason; count: number; saved: number }>;
  recent: Array<{
    id: string;
    subscriptionId: string;
    subscriptionCustomerId: string;
    productName: string;
    buyerEmail: string;
    reason: CancelReason;
    reasonText: string;
    outcome: 'saved_pause' | 'saved_discount' | 'canceled';
    pauseMonths: number | null;
    discountPercent: number | null;
    discountMonths: number | null;
    periodAmount: number;
    currency: string;
    createdAt: string;
  }>;
  entitlement: RetentionEntitlement;
}

export interface IntroPricingReport {
  introActive: number;
  introCompleted: number;
  needsAttention: number;
  yearlyOffered: number;
  yearlySwitched: number;
  entitlement: RetentionEntitlement;
}

export interface SaveOffersConfig {
  enabled: boolean;
  pauseEnabled: boolean;
  pauseMaxMonths: 1 | 2 | 3;
  discountEnabled: boolean;
  /** 5–90. */
  discountPercent: number;
  /** 1–12. */
  discountMonths: number;
}

export interface IntroPricingConfig {
  enabled: boolean;
  /** At least 1.00 and below the regular price. */
  price: number;
  /** 1–12 billing periods. */
  periods: number;
}

export interface YearlySwitchConfig {
  enabled: boolean;
  /** 1–24. */
  afterPayments: number;
  /** 1–50. */
  percentOff: number;
}

export interface RetentionOffer {
  subscriptionId: string;
  name: string;
  price: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  trialPeriod: number;
  published: boolean;
  saveOffers: SaveOffersConfig;
  intro: IntroPricingConfig;
  yearlySwitch: YearlySwitchConfig;
  updatedAt: string | null;
}

export interface RetentionOffersList {
  offers: RetentionOffer[];
  entitlements: { cancellationSaveOffers: RetentionEntitlement; introPricing: RetentionEntitlement };
}

export interface UpdateRetentionOfferParams {
  saveOffers?: Partial<SaveOffersConfig>;
  intro?: Partial<IntroPricingConfig>;
  yearlySwitch?: Partial<YearlySwitchConfig>;
}

// ----------------------------------------------------------------------------
// Bundles and "Buy more, save more" (Growth `bundles`, `tieredDiscounts`)
// ----------------------------------------------------------------------------

export interface BundleItem {
  _id: string;
  name: string;
  thumbnail: string;
  /** The item's own list price, account currency. */
  price: number;
  productType: ProductType;
}

export interface Bundle {
  productId: string;
  name: string;
  /** The bundle price. */
  price: number;
  published: boolean;
  /** `[]` when the product is not a bundle. */
  productIds: string[];
  items: BundleItem[];
  /** Sum of the items' list prices. */
  value: number;
  /** value − price, at least 0. */
  savings: number;
  savingsPercent: number;
}

export interface UpdateBundleParams {
  /** 2–10 product ids, or `[]` to turn the bundle back into a normal product. */
  productIds: string[];
}

export interface TieredDiscounts {
  enabled: boolean;
  /** At most 5, sorted by `minItems`. */
  tiers: Array<{ minItems: number; percentOff: number }>;
  combineWithCodes: boolean;
}

export type UpdateTieredDiscountsParams = Partial<TieredDiscounts>;

// ----------------------------------------------------------------------------
// Delivery: limited drops, PDF stamping, download limits
// ----------------------------------------------------------------------------

export interface LimitedDrop {
  enabled: boolean;
  /** Copies for sale, 1–1,000,000 (null until set). */
  quantity: number | null;
  /** A refunded order's copy goes back on sale. */
  restockOnRefund: boolean;
  /** Copies paid for (or claimed) while the drop was on. */
  sold: number;
  /** Copies held by buyers on the checkout right now (15-minute holds). */
  reserved: number;
  /** Copies a new buyer can still get. */
  remaining: number | null;
  soldOut: boolean;
  startedAt: string | null;
}

export interface UpdateLimitedDropParams {
  enabled?: boolean;
  quantity?: number;
  restockOnRefund?: boolean;
}

/** How many copies of a drop are left (public). */
export interface LimitedDropAvailability {
  enabled: boolean;
  quantity: number | null;
  remaining: number | null;
  sold: number | null;
  reserved: number | null;
  soldOut: boolean;
}

export interface PdfStamping {
  /** Stamp the buyer's email on every PDF page. */
  enabled: boolean;
}

export interface DownloadLimits {
  enabled: boolean;
  /** Downloads per file per order, 1–1000; null = no count limit. */
  maxDownloads: number | null;
  /** Days the links work after the purchase (or the last reset), 1–3650; null = never expire. */
  expiryDays: number | null;
  /** Also limit orders placed before the limits were turned on. */
  applyToExisting: boolean;
  /** When the limits were last turned on (read-only). */
  appliesFrom: string | null;
}

export interface UpdateDownloadLimitsParams {
  enabled?: boolean;
  maxDownloads?: number | null;
  expiryDays?: number | null;
  applyToExisting?: boolean;
}

export interface OrderDownloads {
  limited: boolean;
  maxDownloads: number | null;
  expiresAt: string | null;
  expired: boolean;
  /** Fewest downloads left across the order's files. */
  remaining: number | null;
  exhausted: boolean;
  files: Array<{ key: string; name: string; used: number; remaining: number | null }>;
  /** The order's PDFs carry the buyer's email. */
  stamped: boolean;
  totalDownloads: number;
  lastDownloadAt: string | null;
  resetAt: string | null;
  resetCount: number;
}

// ----------------------------------------------------------------------------
// Revenue splits (Growth `revenueSplits` to invite)
// ----------------------------------------------------------------------------

export type RevenueSplitStatus = 'invited' | 'active' | 'declined' | 'removed' | 'expired';
export type RevenueSplitShareStatus = 'pending' | 'held' | 'paid' | 'reversed';

export interface CreateRevenueSplitParams {
  productId: string;
  /** The co-creator's Pocketsflow account email. */
  email: string;
  /** Above 0, at most 100, two decimals. */
  sharePercent: number;
}

export interface ListRevenueSplitsParams {
  productId?: string;
  status?: RevenueSplitStatus;
}

/** Money is integer cents in fields ending in `Cents`. */
export interface RevenueSplitTotals {
  /** Lower case, settlement currency. */
  currency: string;
  pendingCents: number;
  heldCents: number;
  paidCents: number;
  reversedCents: number;
  /** Paid, then refunded: netted from the next payout. */
  clawbackOwedCents: number;
  shareCount: number;
}

export interface RevenueSplitProductSummary {
  id: string;
  name: string;
  thumbnail: string | null;
}

export interface RevenueSplit {
  id: string;
  productId: string;
  product: RevenueSplitProductSummary | null;
  /** In a co-creator's view: the store that owns the product. */
  owner: { name: string; subdomain: string | null } | null;
  collaboratorEmail: string;
  collaborator: { name: string | null } | null;
  sharePercent: number;
  /** 3000 = 30%. */
  shareBps: number;
  status: RevenueSplitStatus;
  invitedAt: string | null;
  inviteExpiresAt: string | null;
  /** Sales from here on are split. */
  acceptedAt: string | null;
  declinedAt: string | null;
  /** Sales from here on are no longer split. */
  removedAt: string | null;
  totals: RevenueSplitTotals[];
}

export interface ProductRevenueSplit {
  product: RevenueSplitProductSummary | null;
  splits: RevenueSplit[];
  allocatedPercent: number;
  ownerPercent: number;
  collaboratorCount: number;
  maxCollaborators: number;
  slotsLeft: number;
  totals: RevenueSplitTotals[];
}

export interface RevenueSplitSale {
  /** The order id. */
  saleId: string;
  productId: string;
  productName: string | null;
  saleDate: string;
  currency: string;
  /** Pre-tax. */
  saleAmountCents: number;
  /** Taken once, on the full sale. */
  platformFeeCents: number;
  affiliateCents: number;
  /** sale − platform fee − affiliate. */
  baseCents: number;
  /** Null in a co-creator's view. */
  ownerCents: number | null;
  shares: Array<{
    splitId: string;
    collaboratorEmail: string;
    collaboratorName: string | null;
    sharePercent: number;
    /** floor(base × share). */
    amountCents: number;
    status: RevenueSplitShareStatus;
    reversalReason: 'refunded' | 'disputed' | null;
    clawbackCents: number;
    paidAt: string | null;
  }>;
}

export interface ListRevenueSplitSalesParams {
  productId?: string;
  /** At most 50. */
  limit?: number;
  /** `nextCursor` of the previous page. */
  cursor?: string;
}

export interface RevenueSplitSalesResponse {
  sales: RevenueSplitSale[];
  nextCursor: string | null;
}

export interface RevenueSplitEarningEntry {
  id: string;
  splitId: string;
  saleId: string;
  productId: string;
  productName: string | null;
  saleDate: string;
  currency: string;
  saleAmountCents: number;
  platformFeeCents: number;
  affiliateCents: number;
  baseCents: number;
  sharePercent: number;
  amountCents: number;
  status: RevenueSplitShareStatus;
  reversalReason: 'refunded' | 'disputed' | null;
  clawbackCents: number;
  clawbackStatus: 'owed' | 'recovered' | null;
  paidAt: string | null;
}

export interface RevenueSplitEarningsParams {
  productId?: string;
  /** At most 100. */
  limit?: number;
  cursor?: string;
}

export interface RevenueSplitEarnings {
  /** `false`: shares are recorded as pending and not paid out yet. */
  payoutsEnabled: boolean;
  holdDays: number;
  totals: RevenueSplitTotals[];
  products: Array<{
    splitId: string;
    productId: string;
    product: RevenueSplitProductSummary | null;
    owner: { name: string; subdomain: string | null } | null;
    sharePercent: number;
    status: RevenueSplitStatus;
    acceptedAt: string | null;
    removedAt: string | null;
    totals: RevenueSplitTotals[];
  }>;
  entries: RevenueSplitEarningEntry[];
  nextCursor: string | null;
}

// ----------------------------------------------------------------------------
// Signup forms (Growth `embedForms`)
// ----------------------------------------------------------------------------

export type SignupFormType = 'inline' | 'slide_in' | 'popup';

export interface SignupFormTrigger {
  /** 0–120. */
  delaySeconds: number;
  /** 0–100, 0 = off. */
  scrollPercent: number;
  /** Popup: on exit intent (desktop), the delay on phones. */
  exitIntent: boolean;
}

export interface SignupFormFields {
  type?: SignupFormType;
  status?: 'active' | 'paused';
  archived?: boolean;
  /** At most 120 characters. */
  headline?: string;
  /** At most 500 characters. */
  body?: string;
  /** At most 40 characters. */
  buttonLabel?: string;
  /** At most 60 characters. */
  placeholder?: string;
  collectName?: boolean;
  /** At most 80 characters. */
  successHeadline?: string;
  /** At most 300 characters. */
  successMessage?: string;
  leadMagnetProductId?: string | null;
  /** At most 10 tags of at most 40 characters. */
  tags?: string[];
  doubleOptIn?: boolean;
  /** `#rrggbb` */
  accentColor?: string;
  position?: 'bottom_right' | 'bottom_left';
  trigger?: Partial<SignupFormTrigger>;
  /** Days before showing it again to someone who closed it, 0–365. */
  frequencyDays?: number;
}

export interface CreateSignupFormParams extends SignupFormFields {
  /** At most 80 characters. */
  name: string;
}

export interface UpdateSignupFormParams extends SignupFormFields {
  name?: string;
}

export interface ListSignupFormsParams {
  /** List archived forms instead. */
  archived?: boolean;
}

export interface SignupForm extends Required<Omit<SignupFormFields, 'trigger'>> {
  _id: string;
  name: string;
  trigger: SignupFormTrigger;
  /** `conversionRate` is a percent. */
  stats: { views: number; signups: number; conversionRate: number };
  embed: { script: string; iframe: string };
  lastSignupAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignupFormDetail extends SignupForm {
  /** The last 30 UTC days. */
  daily: Array<{ date: string; views: number; signups: number }>;
}

/** A form's public config, as the embed reads it. */
export interface PublicSignupForm {
  id: string;
  /** `false` (and nothing else) when paused or the plan lapsed. */
  active: boolean;
  type?: SignupFormType;
  headline?: string;
  body?: string;
  buttonLabel?: string;
  placeholder?: string;
  collectName?: boolean;
  successHeadline?: string;
  successMessage?: string;
  doubleOptIn?: boolean;
  accentColor?: string;
  position?: 'bottom_right' | 'bottom_left';
  trigger?: SignupFormTrigger;
  frequencyDays?: number;
  leadMagnet?: { name: string; url: string } | null;
  showPoweredBy?: boolean;
  poweredByUrl?: string | null;
}

export interface SignupFormSubscribeParams {
  email: string;
  name?: string;
  /** Honeypot: leave empty. */
  company?: string;
  /** Milliseconds the form was open (bot check). */
  elapsedMs?: number;
}

export type SignupFormSubscribeResult =
  | { status: 'subscribed'; leadMagnet: { name: string; url: string } | null }
  | { status: 'confirm_email' };

// ----------------------------------------------------------------------------
// Testimonials (Growth `testimonials`)
// ----------------------------------------------------------------------------

export type TestimonialStatus = 'pending' | 'approved' | 'hidden';

export interface TestimonialVideo {
  url: string;
  contentType: 'video/webm' | 'video/mp4' | 'video/quicktime';
  durationSeconds: number | null;
}

export interface Testimonial {
  id: string;
  productId: string;
  productName: string;
  saleId: string;
  buyerId: string;
  buyerEmail: string;
  displayName: string;
  /** 1–5. */
  rating: number;
  text: string;
  status: TestimonialStatus;
  featured: boolean;
  source: 'request' | 'thank_you';
  /** The buyer agreed to have it shown publicly. */
  consent: boolean;
  video: TestimonialVideo | null;
  testMode: boolean;
  createdAt: string | null;
  submittedAt: string | null;
  moderatedAt: string | null;
}

export interface ListTestimonialsParams extends PaginationParams {
  /** Default `pending`. */
  status?: 'pending' | 'approved' | 'featured' | 'hidden' | 'all';
  productId?: string;
}

export interface TestimonialList {
  testimonials: Testimonial[];
  counts: { pending: number; approved: number; featured: number; hidden: number; all: number };
  page: number;
  pageSize: number;
  total: number;
}

export interface ModerateTestimonialParams {
  status?: TestimonialStatus;
  /** `true` also approves it. */
  featured?: boolean;
}

export interface TestimonialSettings {
  /** Email buyers a request after their purchase. */
  requestEnabled: boolean;
  /** Days after the purchase, 1–60. */
  delayDays: number;
  askVideo: boolean;
  wallEnabled: boolean;
  checkoutStrip: boolean;
}

export type UpdateTestimonialSettingsParams = Partial<TestimonialSettings>;

/** A product's approved testimonials, as buyers see them (public). */
export interface TestimonialWall {
  enabled: boolean;
  wall: boolean;
  checkoutStrip: boolean;
  count: number;
  testimonials: Array<{
    id: string;
    rating: number;
    text: string;
    displayName: string;
    video: TestimonialVideo | null;
    featured: boolean;
    createdAt: string | null;
  }>;
}

// ----------------------------------------------------------------------------
// Attribution survey (Growth `attributionSurvey`)
// ----------------------------------------------------------------------------

export interface AttributionSurvey {
  enabled: boolean;
  /** At most 120 characters. */
  question: string;
  /** 2–12 options. */
  options: Array<{ id: string; label: string; channel: TrackedLinkChannel | null }>;
  allowOther: boolean;
}

export interface UpdateAttributionSurveyParams {
  enabled?: boolean;
  question?: string;
  options?: Array<{ id?: string; label: string; channel?: TrackedLinkChannel | null }>;
  allowOther?: boolean;
}

export interface AttributionReportParams extends DateRangeParams {
  timezoneOffsetMinutes?: number;
}

export interface AttributionReport {
  currency: string;
  range: { start: string; end: string };
  survey: AttributionSurvey;
  totals: { shown: number; answered: number; responseRate: number; revenue: number };
  options: Array<{
    id: string;
    label: string;
    channel: TrackedLinkChannel | null;
    answers: number;
    /** Percent of answers. */
    share: number;
    /** Major units, account currency. */
    revenue: number;
  }>;
  other: {
    answers: number;
    share: number;
    revenue: number;
    topAnswers: Array<{ text: string; count: number }>;
  };
  trackedLinks: {
    locked: boolean;
    channels: Array<{
      channel: TrackedLinkChannel;
      links: number;
      clicks: number;
      visitors: number;
      sales: number;
      revenue: number;
    }>;
    totals: { sales: number; revenue: number } | null;
  };
}

// ----------------------------------------------------------------------------
// Customer CRM (Pro `customerCrm`) and benchmarks (Pro `benchmarks`)
// ----------------------------------------------------------------------------

export type BestCustomersSort = 'ltv' | 'orders' | 'lastPurchase';

export interface ListCustomerProfilesParams {
  /** Default `ltv`; always highest first. */
  sort?: BestCustomersSort;
  /** CRM tag filter. */
  tag?: string;
  /** Email prefix. */
  q?: string;
  minLtvCents?: number;
  minOrders?: number;
  /** 1–100 (default 25). */
  limit?: number;
  /** `nextCursor` of the previous page. */
  after?: string;
}

/** Money is integer cents of `currency`. */
export interface CustomerProfileSummary {
  /** The profile id. */
  _id: string;
  customerId: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  /** ISO alpha-2. */
  country: string | null;
  /** Upper-case ISO. */
  currency: string;
  /** Net of refunds. */
  ltvCents: number;
  grossCents: number;
  refundedCents: number;
  ordersCount: number;
  refundsCount: number;
  averageOrderCents: number;
  firstPurchaseAt: string | null;
  lastPurchaseAt: string | null;
  tags: string[];
  updatedAt: string | null;
}

export interface CustomerProfilesPage {
  data: CustomerProfileSummary[];
  sort: BestCustomersSort;
  currency: string;
  nextCursor: string | null;
}

export interface CustomerNote {
  _id: string;
  /** At most 2,000 characters. */
  body: string;
  author: { kind: 'owner' | 'member' | 'api'; email: string | null; role: string | null };
  createdAt: string;
  updatedAt: string;
}

export type CustomerTimelineEvent =
  | {
      type: 'order' | 'subscription_payment';
      at: string;
      saleId: string;
      itemId: string | null;
      itemName: string | null;
      amountCents: number;
      currency: string;
      refunded: boolean;
    }
  | {
      type: 'refund';
      at: string;
      saleId: string;
      itemId: string | null;
      itemName: string | null;
      amountCents: number;
      currency: string;
    }
  | {
      type: 'subscription_started' | 'subscription_canceled';
      at: string;
      subscriptionCustomerId: string;
      itemId: string | null;
      itemName: string | null;
    }
  | { type: 'note'; at: string; noteId: string; author: string | null };

export interface CustomerProfile {
  customer: CustomerProfileSummary & { customerSince: string | null };
  ltv: {
    currency: string;
    ltvCents: number;
    grossCents: number;
    refundedCents: number;
    ordersCount: number;
    refundsCount: number;
    averageOrderCents: number;
    oneTimeOrders: number;
    subscriptionPayments: number;
    firstPurchaseAt: string | null;
    lastPurchaseAt: string | null;
    updatedAt: string | null;
  };
  products: Array<{
    _id: string;
    name: string;
    kind: 'product' | 'subscription';
    thumbnail: string | null;
    firstPurchasedAt: string;
  }>;
  subscriptions: Array<{
    _id: string;
    subscriptionId: string | null;
    name: string | null;
    status: string | null;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
    startedAt: string | null;
  }>;
  email: {
    onList: boolean;
    status: string | null;
    contactId: string | null;
    received: number;
    opened: number;
    clicked: number;
    /** Percent, one decimal. */
    openRate: number | null;
    clickRate: number | null;
    lastOpenedAt: string | null;
    lastClickedAt: string | null;
    recent: Array<{ postId: string; subject: string; sentAt: string | null; opened: boolean; clicked: boolean }>;
  };
  segments: Array<{ _id: string; name: string; smartTag: string | null }>;
  /** Tags on the email-list contact. */
  contactTags: string[];
  /** CRM tags. */
  tags: string[];
  notes: CustomerNote[];
  /** Newest first, at most 100. */
  timeline: CustomerTimelineEvent[];
}

export type BenchmarkMetricKey = 'conversionRate' | 'averageOrderValue' | 'refundRate' | 'emailOpenRate';
export type BenchmarkStatus = 'ready' | 'not_enough_stores' | 'no_data';

export interface BenchmarkMetric {
  key: BenchmarkMetricKey;
  /** `money` = cents of `currency`. */
  unit: 'percent' | 'money';
  higherIsBetter: boolean;
  status: BenchmarkStatus;
  you: number | null;
  p25: number | null;
  median: number | null;
  p75: number | null;
  /** Floored to a multiple of 5. */
  stores: number | null;
  verdict: 'top' | 'above' | 'below' | 'bottom' | null;
  suggestion: { id: string; feature: string | null; href: string; text: string } | null;
}

export interface Benchmarks {
  status: BenchmarkStatus;
  windowDays: number;
  minimumStores: number;
  currency: string;
  computedAt: string | null;
  cohort: {
    band: 'under_1k' | '1k_10k' | '10k_50k' | '50k_250k' | '250k_plus';
    bandLabel: string;
    category: 'all' | 'digital' | 'courses' | 'subscriptions';
    categoryLabel: string;
    stores: number | null;
  } | null;
  metrics: BenchmarkMetric[];
}

// ----------------------------------------------------------------------------
// Memberships and communities (Pro `memberships`)
// ----------------------------------------------------------------------------

export type ReactionKind = 'like' | 'love' | 'insightful';
export type Reactions = Record<ReactionKind, number>;

export interface MembershipOfferSummary {
  id: string;
  name: string;
  /** Major units. */
  price: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  currency: string;
  priceLabel: string | null;
  published: boolean;
}

export interface Membership {
  _id: string;
  name: string;
  slug: string;
  description: string;
  offerIds: string[];
  productIds: string[];
  communityEnabled: boolean;
  notifyByEmail: boolean;
  archived: boolean;
  /** The members area on your store. */
  membersUrl: string;
  offers: MembershipOfferSummary[];
  products: Array<{ id: string; name: string; thumbnail: string | null; productType: ProductType }>;
  stats?: {
    activeMembers: number;
    posts: number;
    threads: number;
    joinedLast30Days: number;
    leftLast30Days: number;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateMembershipParams {
  name: string;
  /** 1–10 of your subscription offers. */
  offerIds: string[];
  description?: string;
  /** Products members get, at most 20. */
  productIds?: string[];
  communityEnabled?: boolean;
  notifyByEmail?: boolean;
}

export interface UpdateMembershipParams extends Partial<CreateMembershipParams> {
  archived?: boolean;
}

export interface MembershipMember {
  email: string;
  name: string | null;
  displayName: string;
  status: 'active' | 'ended';
  subscriptionStatus: string | null;
  banned: boolean;
  bannedAt: string | null;
  banReason: string | null;
  emailOptOut: boolean;
  offerIds: string[];
  joinedAt: string | null;
  leftAt: string | null;
}

export interface ListMembershipMembersParams {
  status?: 'all' | 'active' | 'ended' | 'banned';
  /** Email or name search. */
  q?: string;
  page?: number;
}

export interface MembershipMembersPage {
  members: MembershipMember[];
  page: number;
  total: number;
  hasMore: boolean;
  counts: { all: number; active: number; ended: number; banned: number };
}

export interface BanMemberParams {
  email: string;
  reason?: string;
  /** Also hide their threads and replies. */
  hideContent?: boolean;
}

export interface MemberBanResult {
  email: string;
  banned: boolean;
  bannedAt: string | null;
  hiddenItems: number;
}

export interface MemberPost {
  _id: string;
  membershipId: string;
  title: string;
  /** Sanitised HTML; left out of lists. */
  html?: string;
  excerpt: string;
  status: 'draft' | 'published';
  pinned: boolean;
  publishedAt: string | null;
  /** Email members when it is published. */
  notify: boolean;
  notifyState: 'off' | 'pending' | 'sending' | 'sent';
  notifiedAt: string | null;
  notifiedCount: number;
  reactions: Reactions;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MemberPostParams {
  title?: string;
  html?: string;
  status?: 'draft' | 'published';
  pinned?: boolean;
  notify?: boolean;
}

export interface CreateMemberPostParams extends MemberPostParams {
  title: string;
}

export interface MemberPostsPage {
  posts: MemberPost[];
  page: number;
  total: number;
  hasMore: boolean;
}

export interface CommunityAuthor {
  type: 'member' | 'creator';
  name: string;
  email: string | null;
  banned: boolean;
}

export interface CommunityThread {
  _id: string;
  membershipId: string;
  title: string;
  body: string;
  author: CommunityAuthor;
  pinned: boolean;
  locked: boolean;
  hidden: boolean;
  /** Visible replies. */
  replyCount: number;
  reactions: Reactions;
  lastActivityAt: string | null;
  createdAt: string | null;
}

export interface CommunityReply {
  _id: string;
  threadId: string;
  body: string;
  author: CommunityAuthor;
  hidden: boolean;
  reactions: Reactions;
  createdAt: string | null;
}

export interface ListCommunityThreadsParams {
  filter?: 'all' | 'visible' | 'hidden';
  page?: number;
}

export interface CommunityThreadsPage {
  threads: CommunityThread[];
  page: number;
  total: number;
  hasMore: boolean;
  hiddenReplies: number;
}

export interface CommunityThreadDetail {
  thread: CommunityThread;
  replies: CommunityReply[];
  page: number;
  hasMore: boolean;
}

export interface CreateCommunityThreadParams {
  title: string;
  body?: string;
  pinned?: boolean;
}

export interface ModerateCommunityThreadParams {
  pinned?: boolean;
  locked?: boolean;
  hidden?: boolean;
}

// ----------------------------------------------------------------------------
// Creator services (Pro `prioritySupport`, Volume `accountManager`, `disputeCover`)
// ----------------------------------------------------------------------------

export interface AccountManager {
  name: string;
  title: string | null;
  email: string | null;
  photoUrl: string | null;
  bookingUrl: string | null;
  assignedAt: string | null;
}

export interface SlackChannel {
  status: 'none' | 'requested' | 'ready';
  url: string | null;
  requestedAt: string | null;
}

export interface CreatorServices {
  prioritySupport: {
    allowed: boolean;
    responseHours: number;
    priorityResponseHours: number;
    standardResponseHours: number;
  };
  accountManager: { allowed: boolean; manager: AccountManager | null; slackChannel: SlackChannel | null };
  disputeCover: {
    allowed: boolean;
    feeCents: number;
    coveredSince: string | null;
    payouts: 'off' | 'on';
    usage: { month: string; used: number; limit: number; remaining: number } | null;
  };
}

export interface AccountManagerView {
  manager: AccountManager | null;
  slackChannel: SlackChannel;
}

export interface RequestSlackChannelParams {
  /** At most 1,000 characters. */
  note?: string;
}

export interface DisputeHelpRequest {
  _id: string;
  kind: 'dispute_help';
  status: 'open' | 'in_progress' | 'done' | 'cancelled';
  priority: boolean;
  saleId: string;
  message: string;
  dueAt: string | null;
  ticketId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface CreateDisputeHelpParams {
  /** The disputed order. */
  saleId: string;
  /** 10–5,000 characters. */
  message: string;
  /** The dispute's response deadline. */
  dueAt?: string;
}

export interface ListDisputeHelpParams {
  saleId?: string;
}

export interface DisputeCover {
  _id: string;
  saleId: string;
  status: 'covered' | 'excluded';
  excludedReason: 'fraud_label' | 'account_closed' | 'monthly_limit' | 'before_entitlement' | null;
  feeCents: number;
  currency: string;
  month: string;
  disputedAt: string;
  credit: {
    mode: 'ledger' | 'transfer';
    status: 'recorded' | 'credited' | 'failed';
    creditedAt: string | null;
  };
  response: {
    status: 'todo' | 'in_progress' | 'submitted' | 'won' | 'lost';
    submittedAt: string | null;
  };
  createdAt: string;
}

export interface ListDisputeCoversParams {
  /** 1–100. */
  limit?: number;
}

// ----------------------------------------------------------------------------
// Google Sheets sync (Pro `sheetsSync`)
// ----------------------------------------------------------------------------

export interface SheetsConnection {
  status: 'active' | 'needs_reconnect';
  spreadsheet: { id: string; url: string; title: string } | null;
  syncSales: boolean;
  syncCustomers: boolean;
  connectedAt: string | null;
  lastSyncedAt: string | null;
  lastError: string | null;
  lastErrorAt: string | null;
  counts: { pending: number; synced: number; failed: number };
}

export interface SheetsSyncState {
  /** Whether Google Sheets sync is available on this server. */
  configured: boolean;
  /** Whether your plan includes it. */
  allowed: boolean;
  maxBackfillDays: number;
  connection: SheetsConnection | null;
}

export interface SetSpreadsheetParams {
  mode: 'create' | 'existing';
  /** `create`: the new spreadsheet's title. */
  title?: string;
  /** `existing`: a spreadsheet link or id. */
  spreadsheet?: string;
  /** Add past sales, 0–365 days. */
  backfillDays?: number;
}

export interface UpdateSheetsSyncParams {
  syncSales?: boolean;
  syncCustomers?: boolean;
}

export interface SheetsSyncNowResult {
  result: {
    queued: { sales: number; customers: number };
    flushed: { synced: number; failed: number; retrying: number; parked: boolean };
  };
  connection: SheetsConnection;
}

export interface SheetsRetryResult {
  requeued: number;
  connection: SheetsConnection;
}

// ----------------------------------------------------------------------------
// Growth loops: referrals, newsletter recommendations, agencies (free)
// ----------------------------------------------------------------------------

export type ReferralState = 'signed_up' | 'clearing' | 'earned' | 'not_eligible' | 'capped' | 'expired';

export interface ReferredStore {
  id: string;
  storeName: string;
  subdomain: string | null;
  source: 'link' | 'badge';
  status: ReferralState;
  signedUpAt: string;
  clearsAt: string | null;
  grantedAt: string | null;
  applied: boolean;
}

export interface ReferralTally {
  signups: number;
  clearing: number;
  earned: number;
}

export interface ReferralStats {
  code: string;
  link: string;
  signups: number;
  clearing: number;
  earnedStores: number;
  freeMonths: { earned: number; applied: number; banked: number; earnedThisYear: number; yearlyCap: number };
  sources: { link: ReferralTally; badge: ReferralTally };
  rules: { clearanceDays: number; yearlyCap: number; autoApply: boolean };
  recent: ReferredStore[];
}

export interface ListReferredStoresParams {
  limit?: number;
  /** `nextCursor` of the previous page. */
  before?: string;
}

export interface ReferredStoresPage {
  referrals: ReferredStore[];
  nextCursor: string | null;
}

export interface CreatorCard {
  username: string;
  name: string;
  bio: string | null;
  picture: string | null;
  url: string;
}

export interface RecommendationPick extends CreatorCard {
  blurb: string | null;
  live: boolean;
  clicks: number;
  subscribersSent: number;
  addedAt: string;
}

export interface Recommender extends CreatorCard {
  subscribersSent: number;
  clicks: number;
  listingYouNow: boolean;
  since: string | null;
}

export interface RecommendationSettings {
  showRecommendations: boolean;
  recommendable: boolean;
  maxPicks: number;
  eligible: boolean;
  ineligibleReason: string | null;
  picks: RecommendationPick[];
  recommendedYou: Recommender[];
  totals: { subscribersSent: number; subscribersReceived: number };
}

export interface UpdateRecommendationsParams {
  showRecommendations?: boolean;
  recommendable?: boolean;
  /** At most 3; replaces the list. */
  picks?: Array<{ username: string; blurb?: string | null }>;
}

export interface Agency {
  id: string;
  name: string;
  website: string | null;
  code: string;
  inviteLink: string;
  status: 'active' | 'suspended';
  sharePercent: number;
  shareMonths: number;
  payouts: { enabled: boolean; minimumCents: number };
  createdAt: string;
}

export interface CreateAgencyParams {
  name: string;
  website?: string | null;
}

export type UpdateAgencyParams = Partial<CreateAgencyParams>;

export interface AgencyClient {
  storeUserId: string;
  name: string;
  subdomain: string | null;
  plan: { id: string; name: string };
  revenue30dCents: number | null;
  orders30d: number | null;
  subscribers: number;
  earnedCents: number;
  pendingCents: number;
  startedAt: string;
  earnUntil: string;
  earning: boolean;
  available: boolean;
}

export interface AgencyOverview {
  clients: AgencyClient[];
  totals: {
    clients: number;
    revenue30dCents: number;
    earnedThisMonthCents: number;
    pendingCents: number;
    clearedCents: number;
    paidCents: number;
    lifetimeCents: number;
  };
}

export interface AgencyStatementRow {
  /** `YYYY-MM` */
  month: string;
  earnedCents: number;
  pendingCents: number;
  clearedCents: number;
  paidCents: number;
  payments: number;
  refunds: number;
  clients: number;
}

export interface AgencyStatementLine {
  id: string;
  storeUserId: string;
  storeName: string;
  kind: 'payment' | 'reversal';
  paidAt: string;
  currency: string;
  baseCents: number;
  refundedCents: number;
  sharePercent: number;
  amountCents: number;
  status: 'pending' | 'cleared' | 'reversed' | 'rejected' | 'paid';
  clearsAt: string;
}

export interface AgencyStatement {
  month: string;
  agency: { name: string; code: string };
  totals: { baseCents: number; earnedCents: number; pendingCents: number; paidCents: number };
  lines: AgencyStatementLine[];
}

/** The agency that manages your store. */
export interface StoreAgency {
  name: string;
  website: string | null;
  code: string;
  contactEmail: string | null;
  role: 'admin';
  startedAt: string;
}

export interface AgencyPreview {
  name: string;
  website: string | null;
  code: string;
  contactEmail: string | null;
}

/** `{ ok: true }` answers. */
export interface OkResult {
  ok: boolean;
}

// ----------------------------------------------------------------------------
// A/B tests (Pro `abTests`)
// ----------------------------------------------------------------------------

export type AbTestType = 'price' | 'headline' | 'cover' | 'checkout_layout';
export type AbTestStatus = 'running' | 'completed' | 'stopped';
export type AbTestEndReason = 'winner' | 'stopped' | 'product_edited' | 'product_deleted';
export type CheckoutLayoutId =
  | 'split'
  | 'flipped'
  | 'focus'
  | 'banner'
  | 'card'
  | 'hero'
  | 'sidebar'
  | 'gallery'
  | 'sheet'
  | 'frame';

export interface AbTestVariant {
  _id: string;
  /** `A` is the control (the product when the test started). */
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
  /** Whole percent; all variants sum to 100. */
  weight: number;
  control: boolean;
  /** `price` tests: account currency, major units. */
  price?: number;
  /** `headline` tests. */
  headline?: string;
  /** `headline` tests (HTML), optional. */
  description?: string;
  /** `cover` tests: an https URL. */
  coverImage?: string;
  /** `checkout_layout` tests. */
  checkoutLayout?: CheckoutLayoutId;
}

export interface AbTestVariantResult {
  variantId: string;
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
  control: boolean;
  weight: number;
  /** Unique visitors, bots excluded. */
  visitors: number;
  /** Paid, unrefunded sales. */
  conversions: number;
  /** Percent. */
  conversionRate: number;
  /** Account currency. */
  revenue: number;
  revenuePerVisitor: number;
  /** Percent vs A. */
  lift: number | null;
  zScore: number | null;
  /** Two-proportion z-test vs A. */
  pValue: number | null;
  /** 0–1, Bayesian, conversion rate. */
  probabilityToBeat: number | null;
  /** 0–1, price tests only. */
  revenueProbabilityToBeat: number | null;
  probabilityToBeBest: number;
  significant: boolean;
  verdict: 'control' | 'collecting' | 'winning' | 'losing' | 'no_difference';
}

export interface AbTestResults {
  currency: string;
  /** Price tests use `revenue_per_visitor`. */
  metric: 'conversion_rate' | 'revenue_per_visitor';
  totals: { visitors: number; conversions: number; revenue: number };
  variants: AbTestVariantResult[];
  daily: Array<{ date: string; variants: Record<string, { visitors: number; conversions: number }> }>;
  recommendation: {
    variantId: string | null;
    reason: 'winner' | 'keep_control' | 'too_early' | 'no_difference';
  };
  thresholds: { minVisitors: number; minConversions: number };
}

export interface AbTest {
  _id: string;
  name: string;
  productId: string;
  type: AbTestType;
  status: AbTestStatus;
  testMode: boolean;
  variants: AbTestVariant[];
  startedAt: string;
  endedAt: string | null;
  endReason: AbTestEndReason | null;
  /** `product_edited`: the field that changed, e.g. `price` or `checkoutStyle.layout`. */
  endDetail: string | null;
  winnerVariantId: string | null;
  createdAt: string;
  updatedAt: string;
  /** `abTests.list()` only. */
  summary?: { visitors: number; conversions: number };
  /** `abTests.get()` only. */
  results?: AbTestResults;
}

export interface ListAbTestsParams {
  status?: AbTestStatus;
  productId?: string;
}

export interface CreateAbTestParams {
  productId: string;
  type: AbTestType;
  /** Default `<Type> test · <product name>`. */
  name?: string;
  /** 1–3 challengers (B, C, D). */
  variants: Array<{
    label?: string;
    /** 1–1,000,000. */
    price?: number;
    headline?: string;
    description?: string;
    coverImage?: string;
    checkoutLayout?: CheckoutLayoutId;
  }>;
  /** A first, each 5–95, summing to 100. */
  weights?: number[];
}

export interface AbTestTimezoneParams {
  timezoneOffsetMinutes?: number;
}

export interface AbTestWinner extends AbTest {
  /** Product fields the winner changed (`[]` for A). */
  applied: string[];
}

export interface AssignAbTestVariantParams {
  productId: string;
  /** A stable id for the visitor (e.g. a first-party cookie). */
  visitorId: string;
  /** Adds `displayPrice` in this currency on price tests. */
  currency?: string;
}

export interface AbAssignment {
  test: null | {
    testId: string;
    variantId: string;
    type: AbTestType;
    basePrice: number | null;
    overrides: {
      price?: number;
      headline?: string;
      description?: string;
      coverImage?: string;
      checkoutLayout?: string;
    };
    displayPrice?: { currency: string; amount: number };
  };
}

// ----------------------------------------------------------------------------
// Loyalty (Growth `loyalty`) and affiliate tiers (Pro `tieredAffiliates`)
// ----------------------------------------------------------------------------

export interface LoyaltySettings {
  enabled: boolean;
  /** Points per 1.00 paid (above 0, at most 1000, two decimals). */
  earnPointsPerUnit: number;
  /** Points that make 1.00 of credit (integer 1–100,000). */
  pointsPerCreditUnit: number;
  /** Smallest spendable balance. */
  minRedeemPoints: number;
  /** Days after the last purchase; null = never (1–3650). */
  expiryDays: number | null;
  /** Lower-case ISO, your currency. */
  currency: string;
  /** Buyers can spend points at checkout. */
  walletLinksConfigured: boolean;
  planAllows: boolean;
}

export type UpdateLoyaltySettingsParams = Partial<
  Pick<LoyaltySettings, 'enabled' | 'earnPointsPerUnit' | 'pointsPerCreditUnit' | 'minRedeemPoints' | 'expiryDays'>
>;

export interface LoyaltySummary {
  members: number;
  membersWithBalance: number;
  outstandingPoints: number;
  /** Liability, your currency. */
  outstandingCredit: number;
  pointsEarned: number;
  pointsRedeemed: number;
  creditRedeemed: number;
  pointsExpired: number;
  orders: number;
  currency: string;
}

export interface LoyaltyMember {
  id: string;
  email: string;
  points: number;
  credit: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  lastEarnedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface ListLoyaltyMembersParams {
  /** At most 100. */
  limit?: number;
  offset?: number;
  /** Email prefix. */
  search?: string;
}

export interface LoyaltyMembersResponse {
  members: LoyaltyMember[];
  total: number;
  limit: number;
  offset: number;
  currency: string;
}

export type LoyaltyLedgerType = 'earn' | 'redeem' | 'reverse_earn' | 'restore' | 'expire' | 'adjust';

export interface LoyaltyLedgerEntry {
  id: string;
  email: string;
  type: LoyaltyLedgerType;
  /** Signed. */
  points: number;
  credit: number;
  orderId: string | null;
  note: string | null;
  createdAt: string;
}

export interface ListLoyaltyActivityParams {
  /** At most 100. */
  limit?: number;
  email?: string;
}

export interface LoyaltyActivityResponse {
  entries: LoyaltyLedgerEntry[];
  currency: string;
}

export interface AdjustLoyaltyPointsParams {
  email: string;
  /** Non-zero integer; negative removes points. */
  points: number;
  note?: string;
  /** Repeating a key does not apply the adjustment twice. */
  idempotencyKey?: string;
}

export interface LoyaltyAdjustment {
  /** `false` when the idempotency key was already used. */
  applied: boolean;
  member: LoyaltyMember | null;
  currency: string;
}

export type TierPeriod = 'all_time' | 'month' | 'quarter' | 'year';

export interface AffiliateTier {
  /** Sales before the sale that the rate applies to. */
  minSales: number;
  /** Commission percent, 0–100. */
  rate: number;
  /** e.g. `11–50`. */
  label?: string;
}

export interface AffiliateMilestoneBonus {
  /** All-time sales, at least 1. */
  sales: number;
  /** Your currency. */
  amount: number;
}

export interface AffiliateProgram {
  enabled: boolean;
  period: TierPeriod;
  tiers: AffiliateTier[];
  bonuses: AffiliateMilestoneBonus[];
  currency: string;
  periodStartsAt: string | null;
  periodEndsAt: string | null;
  planAllows: boolean;
}

export interface UpdateAffiliateTiersParams {
  enabled?: boolean;
  period?: TierPeriod;
  /** Replaces the list (at most 10). */
  tiers?: Array<{ minSales: number; rate: number }>;
  /** Replaces the list (at most 10). */
  bonuses?: Array<{ sales: number; amount: number }>;
}

export interface AffiliateTierProgress {
  ladder: 'program' | 'affiliate' | 'flat';
  period: TierPeriod;
  periodSales: number;
  allTimeSales: number;
  baseRate: number;
  rate: number;
  tier: { index: number; minSales: number; rate: number; label: string } | null;
  nextTier: { index: number; minSales: number; rate: number; label: string; salesToGo: number } | null;
  nextBonus: { sales: number; amount: number; salesToGo: number } | null;
  periodEndsAt: string | null;
  tiers: AffiliateTier[];
}

export interface AffiliateBonus {
  id: string;
  affiliateId: string;
  milestone: number;
  amount: number;
  collected: number;
  paid: number;
  currency: string;
  status: 'pending' | 'earned' | 'funded';
  earnedAt: string | null;
  earnedOrderId: string | null;
  updatedAt: string;
}

export interface AffiliateTierProgressList {
  affiliates: Array<{
    id: string;
    email: string;
    active: boolean;
    progress: AffiliateTierProgress;
    bonusesEarned: number;
  }>;
  currency: string;
}

export interface AffiliateTierProgressDetail {
  id: string;
  email: string;
  active: boolean;
  progress: AffiliateTierProgress;
  bonuses: AffiliateBonus[];
  currency: string;
}

export interface ListAffiliateBonusesParams {
  /** At most 100. */
  limit?: number;
  status?: 'pending' | 'earned' | 'funded';
}

export interface AffiliateBonusesResponse {
  bonuses: Array<AffiliateBonus & { affiliateEmail: string | null }>;
  currency: string;
}

export interface MyAffiliateTierProgress {
  programs: Array<{
    affiliateId: string;
    creator: { name: string; subdomain: string | null };
    currency: string;
    progress: AffiliateTierProgress;
    bonuses: AffiliateBonus[];
  }>;
}

// ----------------------------------------------------------------------------
// Migration from another platform (Volume `migration`)
// ----------------------------------------------------------------------------

export type MigrationSource = 'gumroad' | 'lemonsqueezy' | 'stan' | 'csv';
export type MigrationKind = 'products' | 'customers' | 'orders' | 'subscribers';
export type MigrationStatus = 'draft' | 'queued' | 'running' | 'completed' | 'failed' | 'canceled';
export type MigrationRowStatus = 'invalid' | 'pending' | 'imported' | 'skipped' | 'failed';

export interface MigrationFileInput {
  kind: MigrationKind;
  /** The CSV text (at most 10 MB / 50,000 rows). */
  csv: string;
  filename?: string;
}

export interface CreateMigrationParams {
  source: MigrationSource;
  /** Copy product files to Pocketsflow (default true). */
  downloadFiles?: boolean;
  /** At most 4. */
  files?: MigrationFileInput[];
}

export interface MigrationFile {
  kind: MigrationKind;
  origin: 'csv' | 'api';
  filename: string;
  headers: string[];
  /** Field → CSV header (null = not mapped). */
  mapping: Record<string, string | null>;
  rowCount: number;
  validCount: number;
  invalidCount: number;
  warningCount: number;
  truncated: boolean;
  addedAt: string;
}

export interface MigrationKindProgress {
  total: number;
  processed: number;
  imported: number;
  skipped: number;
  failed: number;
}

export interface MigrationDryRun {
  computedAt: string;
  canStart: boolean;
  subscriberLimit: number | null;
  /** Counts per kind, e.g. `{ products: { total, invalid, create, existing } }`. */
  kinds: Partial<Record<MigrationKind, Record<string, number>>>;
  notes: string[];
}

export interface MigrationJob {
  _id: string;
  source: MigrationSource;
  status: MigrationStatus;
  testMode: boolean;
  createdBy: { type: 'creator' | 'admin' };
  options: { downloadFiles: boolean };
  files: MigrationFile[];
  dryRun: MigrationDryRun | null;
  progress: Partial<Record<MigrationKind, MigrationKindProgress>>;
  phase: MigrationKind | null;
  cancelRequested: boolean;
  lastError: string | null;
  queuedAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MigrationListResponse {
  data: MigrationJob[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface MigrationFileResult {
  file: MigrationFile;
  job: MigrationJob;
}

export interface MigrationConnectResult {
  files: MigrationFile[];
  warnings: string[];
  job: MigrationJob;
}

export interface MigrationRow {
  index: number;
  status: MigrationRowStatus;
  data: Record<string, unknown> | null;
  raw: Record<string, string>;
  errors: string[];
  warnings: string[];
  note: string | null;
  entityId: string | null;
}

export interface ListMigrationRowsParams extends PaginationParams {
  kind: MigrationKind;
  filter?: 'all' | 'problems' | 'valid';
}

export interface MigrationRowsPage {
  kind: MigrationKind;
  data: MigrationRow[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface MigrationReport {
  job: MigrationJob;
  kinds: Partial<
    Record<
      MigrationKind,
      { total: number; imported: number; skipped: number; invalid: number; failed: number; pending: number }
    >
  >;
  products: {
    created: number;
    filesDownloaded: number;
    filesNeeded: Array<{ row: number; productId: string | null; name: string; reason: string | null }>;
  };
  problems: number;
}

export interface MigrationPlatform {
  source: MigrationSource;
  name: string;
  csvKinds: MigrationKind[];
  apiKinds: MigrationKind[];
  exportHints: Partial<Record<MigrationKind, string>>;
  tokenHint?: string;
  columns: Partial<
    Record<MigrationKind, Array<{ field: string; label: string; required: boolean; headers: string[] }>>
  >;
}

/** `{ message }` answers of delete routes. */
export interface MessageResult {
  message: string;
}

/** `{ deleted: true, _id }` answers. */
export interface DeletedResult {
  deleted: boolean;
  _id: string;
}

// ----------------------------------------------------------------------------
// Global search (⌘K) — GET /search (every plan)
// ----------------------------------------------------------------------------

/** The kinds of record `search.query` looks through. */
export type SearchType = 'orders' | 'customers' | 'products' | 'subscriptions' | 'discounts';

export interface SearchParams {
  /** Limit the search to these types (default: all of them). */
  types?: SearchType[];
  /** Hits per type, 1-20 (default 5). */
  limit?: number;
}

export interface SearchHit {
  /** Pass it to the matching get method (`orders.get`, `customers.get`, ...). */
  id: string;
  type: SearchType;
  /** Buyer name or email, product name, or discount code. */
  title: string;
  subtitle: string;
  meta: {
    /** Major units of `currency` (49.99 = $49.99). */
    amount?: number;
    currency?: string;
    status?: string;
    date?: string;
    interval?: 'weekly' | 'monthly' | 'yearly';
    kind?: 'product' | 'subscription';
    value?: number;
    valueType?: 'percentage' | 'fixed';
    /** Two-letter country code (customers). */
    country?: string;
  };
  /** Dashboard path: `https://app.pocketsflow.com` + path. */
  path: string;
  /** Cover image URL (products). */
  image: string | null;
  match: 'id' | 'email' | 'name' | 'amount' | 'code' | 'slug' | 'product';
}

export interface SearchGroup {
  type: SearchType;
  hits: SearchHit[];
  /** More records match than `limit`: page through the list methods. */
  hasMore: boolean;
}

export interface SearchResponse {
  query: string;
  /** `true` when a `pk_test_` key searched test data. */
  testMode: boolean;
  limit: number;
  groups: SearchGroup[];
}

/** Alias of {@link SearchResponse} (the name the API reference uses). */
export type SearchResults = SearchResponse;

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
