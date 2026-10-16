import {
  PocketsflowConfig,
  PocketsflowError,
  FeatureLockedError,
  SeatLimitError,
  Product,
  CreateProductParams,
  UpdateProductParams,
  CopyCatalogItemParams,
  ProductVariant,
  CreateVariantParams,
  Customer,
  ListOrdersParams,
  OrdersResponse,
  OrderDetail,
  ListCustomersParams,
  CustomerDetail,
  Review,
  ListReviewsParams,
  Discount,
  CreateDiscountParams,
  UpdateDiscountParams,
  Upsell,
  UpsellsResponse,
  CreateUpsellParams,
  UpdateUpsellParams,
  ListSubscriptionsParams,
  SubscriberOrderHistory,
  SubscriberDetail,
  ListSubscribersParams,
  SubscribersResponse,
  GetSubscriberParams,
  MembershipActionResult,
  PaymentDetail,
  ListPaymentsParams,
  PaymentsResponse,
  GetPaymentParams,
  SubscriptionOffer,
  CreateSubscriptionOfferParams,
  DeletedSubscriptionOffer,
  Webhook,
  CreatedWebhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookSecretRotation,
  WebhookTestResult,
  WebhookDelivery,
  ListWebhookDeliveriesParams,
  WebhookDeliveriesResponse,
  WebhookRedeliveryResult,
  User,
  UpdateUserParams,
  CreateCheckoutParams,
  CheckoutSession,
  RefundPolicy,
  CreateRefundPolicyParams,
  UpdateRefundPolicyParams,
  EmailSubscriber,
  ListEmailSubscribersParams,
  ProductAudience,
  SyncAudienceParams,
  AudienceSyncResult,
  Post,
  ListPostsParams,
  CreatePostParams,
  UpdatePostParams,
  SendPostResult,
  SendEmailParams,
  SendEmailResult,
  CreatorPage,
  CreateCreatorPageParams,
  UpdateCreatorPageParams,
  CreatorPageUsernameUpdate,
  ImageUploadInput,
  UploadImageOptions,
  UploadedImage,
  Partner,
  PartnerListParams,
  PartnerListResponse,
  PartnerStats,
  ReferredUser,
  ReferralSale,
  ReferralRegistration,
  Entitlements,
  EntitlementsResult,
  FeatureKey,
  Plan,
  AbandonedCheckoutSummary,
  ProductAbandonedCheckout,
  UpdateTrackingPixelsParams,
  WeeklyReportPreview,
  WeeklyReportSettings,
  UpdateWeeklyReportSettingsParams,
  TrackedLink,
  ListTrackedLinksParams,
  TrackedLinkListResponse,
  TrackedLinkStatsParams,
  TrackedLinkStatsResponse,
  CreateTrackedLinkParams,
  UpdateTrackedLinkParams,
  TrackedLinkSlugCheck,
  StoreBadge,
  StoreBadgeReferralStats,
  UpdateStoreBadgeParams,
  TeamOverview,
  ListTeamActivityParams,
  TeamActivityResponse,
  InviteTeamMemberParams,
  TeamInviteCreated,
  TeamInviteResent,
  UpdateTeamMemberParams,
  TeamMemberUpdate,
  CreateTeamParams,
  UpdateTeamParams,
  TeamRecord,
  TeamOk,
  PostPurchaseOffer,
  UpdatePostPurchaseOfferParams,
  SocialProof,
  SocialProofSettings,
  UpdateSocialProofSettingsParams,
  FunnelTemplate,
  ListFunnelTemplatesParams,
  FunnelListItem,
  Funnel,
  FunnelDetail,
  FunnelAnalytics,
  CreateFunnelParams,
  LicenseKey,
  ListLicenseKeysParams,
  LicenseKeysResponse,
  LicenseKeyCheckParams,
  DeactivateLicenseKeyParams,
  LicenseValidation,
} from './types';

const DEFAULT_BASE_URL = 'https://api.pocketsflow.com';
const DEFAULT_TIMEOUT = 30000;

/** Encode a caller-supplied id for use as one path segment. */
const seg = (id: string): string => encodeURIComponent(id);

/** Add the non-enumerable `can()` helper to an entitlements payload. */
function withCan(entitlements: Entitlements): EntitlementsResult {
  Object.defineProperty(entitlements, 'can', {
    value: (key: FeatureKey): boolean => entitlements.features?.[key]?.allowed === true,
    enumerable: false,
    configurable: true,
    writable: true,
  });
  return entitlements as EntitlementsResult;
}

/** Read `{ [key]: value }` envelopes, tolerating an already-unwrapped body. */
function unwrap<T>(res: unknown, key: string): T {
  if (res && typeof res === 'object' && !Array.isArray(res) && key in res) {
    return (res as Record<string, unknown>)[key] as T;
  }
  return res as T;
}

export class Pocketsflow {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  // Resource namespaces
  public products: ProductsResource;
  public variants: VariantsResource;
  public orders: OrdersResource;
  /** The payment ledger: every one-time and subscription payment. */
  public payments: PaymentsResource;
  public customers: CustomersResource;
  public reviews: ReviewsResource;
  public discounts: DiscountsResource;
  public upsells: UpsellsResource;
  public subscriptions: SubscriptionsResource;
  /** Buyers with a membership in one of your subscription offers. */
  public subscribers: SubscribersResource;
  /** Subscription offers (recurring products), distinct from buyer memberships. */
  public subscriptionOffers: SubscriptionOffersResource;
  public webhooks: WebhooksResource;
  public users: UsersResource;
  public checkout: CheckoutResource;
  public refunds: RefundsResource;
  /** Your email list: subscribers, product audiences, posts and one-off emails. */
  public newsletters: NewslettersResource;
  /** Your Link in Bio page (one per account). */
  public creatorPage: CreatorPageResource;
  /** Hosted image uploads (thumbnails, product and page images). */
  public images: ImagesResource;
  /** The partner (referral) program. */
  public partners: PartnersResource;
  /** Plans and what the account's plan unlocks. */
  public plans: PlansResource;
  /** The Monday growth report email: preview and settings. */
  public weeklyReport: WeeklyReportResource;
  /** Short links that count clicks, visitors and sales (Starter plan). */
  public trackedLinks: TrackedLinksResource;
  /** The "Powered by Pocketsflow" badge and its referral rewards. */
  public storeBadge: StoreBadgeResource;
  /** Alias of `storeBadge`. */
  public badge: StoreBadgeResource;
  /** Team members, invites, teams and the activity log (Growth plan). An API key acts as the store owner. */
  public team: TeamResource;
  /** The one-click offer after a product's checkout (Growth plan). */
  public postPurchaseOffers: PostPurchaseOffersResource;
  /** Real-purchase notices on a product's checkout (Growth plan). */
  public socialProof: SocialProofResource;
  /** Sales funnels: lead magnet + email sequence + offer (Growth plan). */
  public funnels: FunnelsResource;
  /** License keys issued with your products, and the public check endpoints. */
  public licenses: LicensesResource;

  constructor(config: PocketsflowConfig) {
    if (!config.apiKey) {
      throw new PocketsflowError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;

    // Initialize resources
    this.products = new ProductsResource(this);
    this.variants = new VariantsResource(this);
    this.orders = new OrdersResource(this);
    this.payments = new PaymentsResource(this);
    this.customers = new CustomersResource(this);
    this.reviews = new ReviewsResource(this);
    this.discounts = new DiscountsResource(this);
    this.upsells = new UpsellsResource(this);
    this.subscriptions = new SubscriptionsResource(this);
    this.subscribers = new SubscribersResource(this);
    this.subscriptionOffers = new SubscriptionOffersResource(this);
    this.webhooks = new WebhooksResource(this);
    this.users = new UsersResource(this);
    this.checkout = new CheckoutResource(this);
    this.refunds = new RefundsResource(this);
    this.newsletters = new NewslettersResource(this);
    this.creatorPage = new CreatorPageResource(this);
    this.images = new ImagesResource(this);
    this.partners = new PartnersResource(this);
    this.plans = new PlansResource(this);
    this.weeklyReport = new WeeklyReportResource(this);
    this.trackedLinks = new TrackedLinksResource(this);
    this.storeBadge = new StoreBadgeResource(this);
    this.badge = this.storeBadge;
    this.team = new TeamResource(this);
    this.postPurchaseOffers = new PostPurchaseOffersResource(this);
    this.socialProof = new SocialProofResource(this);
    this.funnels = new FunnelsResource(this);
    this.licenses = new LicensesResource(this);
  }

  async request<T>(
    method: string,
    path: string,
    options: {
      body?: any;
      params?: Record<string, any>;
      /**
       * Resolve (instead of throwing) a 4xx answer whose JSON body has a
       * boolean `valid` — the public license endpoints answer that way.
       */
      resolveValidationBody?: boolean;
    } = {}
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Multipart bodies (image uploads) go as-is: fetch sets the boundary.
    const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers: Record<string, string> = { 'Authorization': `Bearer ${this.apiKey}` };
    if (!isForm) headers['Content-Type'] = 'application/json';

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: isForm ? options.body : options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Request failed';
        let errorCode: string | undefined;
        let errorBody: Record<string, unknown> | undefined;

        try {
          const parsed: unknown = await response.json();
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            errorBody = parsed as Record<string, unknown>;
            const { message, error, code } = errorBody;
            errorMessage =
              (typeof message === 'string' && message) ||
              (typeof error === 'string' && error) ||
              errorMessage;
            errorCode = typeof code === 'string' ? code : undefined;
          }
        } catch {
          // Ignore JSON parse errors
        }

        if (
          options.resolveValidationBody &&
          response.status >= 400 &&
          response.status < 500 &&
          errorBody &&
          typeof errorBody.valid === 'boolean'
        ) {
          return errorBody as T;
        }

        const lockCode = errorCode ?? (typeof errorBody?.error === 'string' ? errorBody.error : undefined);
        if (response.status === 403 && lockCode === 'FEATURE_LOCKED') {
          throw new FeatureLockedError(errorMessage, errorBody);
        }
        if (response.status === 403 && lockCode === 'SEAT_LIMIT') {
          throw new SeatLimitError(errorMessage, errorBody);
        }

        throw new PocketsflowError(errorMessage, errorCode, response.status, errorBody);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PocketsflowError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new PocketsflowError('Request timeout', 'TIMEOUT');
        }
        throw new PocketsflowError(error.message);
      }

      throw new PocketsflowError('Unknown error occurred');
    }
  }
}

// ============================================================================
// Resource Classes
// ============================================================================

class ProductsResource {
  constructor(private client: Pocketsflow) {}

  /** List all products */
  async list(): Promise<Product[]> {
    return this.client.request<Product[]>('GET', '/products');
  }

  /** Get a product by ID */
  async get(id: string): Promise<Product> {
    return this.client.request<Product>('GET', `/products/${id}`);
  }

  /** Create a new product */
  async create(params: CreateProductParams): Promise<Product> {
    return this.client.request<Product>('POST', '/products', { body: params });
  }

  /** Update a product */
  async update(id: string, params: UpdateProductParams): Promise<Product> {
    return this.client.request<Product>('POST', `/products/update/${id}`, { body: params });
  }

  /** Delete a product */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/products/${id}`);
  }

  /**
   * Copy a catalog item (POC-917): duplicates one of your one-time products
   * OR a subscription offer — whichever owns the id.
   *
   * Send `{ testMode: false }` to copy a test-mode offer into live mode
   * ("Copy to live"); omit params to copy within the source's own mode.
   * The copy gets a deduplicated "Name (Copy)" name and starts unpublished
   * when copied into live mode. A copied one-time product fires the
   * `product.created` webhook against the copy's own mode.
   */
  async copy(
    id: string,
    params: CopyCatalogItemParams = {}
  ): Promise<Product | SubscriptionOffer> {
    return this.client.request<Product | SubscriptionOffer>(
      'POST',
      `/products/copy/${id}`,
      { body: params }
    );
  }

  /**
   * Turn abandoned checkout recovery on or off for a product: a buyer who
   * leaves its checkout gets one recovery email. Turning it on needs the
   * Growth plan (`FeatureLockedError` otherwise); turning it off never does.
   */
  async setAbandonedCheckout(id: string, enabled: boolean): Promise<ProductAbandonedCheckout> {
    return this.client.request<ProductAbandonedCheckout>(
      'PATCH',
      `/products/${seg(id)}/abandoned-checkout`,
      { body: { enabled } }
    );
  }
}

class VariantsResource {
  constructor(private client: Pocketsflow) {}

  /** Create a product variant */
  async create(params: CreateVariantParams): Promise<ProductVariant> {
    return this.client.request<ProductVariant>('POST', '/products/variants', { body: params });
  }

  /** Delete a product variant */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/products/variants/${id}`);
  }
}

class OrdersResource {
  constructor(private client: Pocketsflow) {}

  /** List all orders with optional filters */
  async list(params: ListOrdersParams = {}): Promise<OrdersResponse> {
    return this.client.request<OrdersResponse>('GET', '/orders', { params });
  }

  /**
   * Get an order by ID: the sale (with its fee breakdown) plus its product,
   * customer, review and upsells.
   */
  async get(id: string): Promise<OrderDetail> {
    return this.client.request<OrderDetail>('GET', `/orders/${id}`);
  }
}

/** The payment ledger: one-time purchases and subscription charges. */
class PaymentsResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List payments, newest first: one-time purchases AND subscription payments
   * (the initial charge plus every renewal). Paginated: `pageSize` is at most 100.
   */
  async list(params: ListPaymentsParams = {}): Promise<PaymentsResponse> {
    return this.client.request<PaymentsResponse>('GET', '/payments', { params });
  }

  /**
   * Get one payment with its product or subscription offer and customer.
   * Pass `{ live: true }` to also fetch the live payment from the payments partner.
   */
  async get(id: string, params: GetPaymentParams = {}): Promise<PaymentDetail> {
    return this.client.request<PaymentDetail>('GET', `/payments/${seg(id)}`, { params });
  }
}

class CustomersResource {
  constructor(private client: Pocketsflow) {}

  /** List all customers, each with every product they bought (`products`) */
  async list(params: ListCustomersParams = {}): Promise<Customer[]> {
    return this.client.request<Customer[]>('GET', '/customers', { params });
  }

  /** Get a customer with their stats, orders, subscriptions and reviews */
  async get(id: string): Promise<CustomerDetail> {
    return this.client.request<CustomerDetail>('GET', `/customers/${id}`);
  }
}

class ReviewsResource {
  constructor(private client: Pocketsflow) {}

  /** List all reviews */
  async list(params: ListReviewsParams = {}): Promise<Review[]> {
    return this.client.request<Review[]>('GET', '/reviews', { params });
  }
}

class DiscountsResource {
  constructor(private client: Pocketsflow) {}

  /** List all discounts */
  async list(): Promise<Discount[]> {
    return this.client.request<Discount[]>('GET', '/discounts');
  }

  /** Get a discount by ID */
  async get(id: string): Promise<Discount> {
    return this.client.request<Discount>('GET', `/discounts/${id}`);
  }

  /** Create a new discount */
  async create(params: CreateDiscountParams): Promise<Discount> {
    return this.client.request<Discount>('POST', '/discounts', { body: params });
  }

  /** Update a discount */
  async update(id: string, params: UpdateDiscountParams): Promise<Discount> {
    return this.client.request<Discount>('POST', `/discounts/${id}`, { body: params });
  }

  /** Delete a discount */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/discounts/${id}`);
  }

  /**
   * Look up a discount code as a buyer would at checkout: resolves to the
   * discount when `code` is active and applies to `productId` (a product or
   * subscription offer). Throws a 404 `PocketsflowError` otherwise. Public
   * endpoint: it does not need your API key.
   */
  async apply(code: string, productId: string): Promise<Discount> {
    return this.client.request<Discount>(
      'GET',
      `/discounts/apply/${seg(code)}/${seg(productId)}`
    );
  }

  /**
   * Whether any active discount applies to this product or subscription
   * offer (e.g. to show a "Have a code?" field). Public endpoint.
   */
  async checkProduct(productId: string): Promise<boolean> {
    return this.client.request<boolean>('GET', `/discounts/check-product/${seg(productId)}`);
  }
}

class UpsellsResource {
  constructor(private client: Pocketsflow) {}

  /** List all upsells */
  async list(): Promise<UpsellsResponse> {
    return this.client.request<UpsellsResponse>('GET', '/upsells');
  }

  /** Get an upsell by ID */
  async get(id: string): Promise<Upsell> {
    return this.client.request<Upsell>('GET', `/upsells/${id}`);
  }

  /** Create a new upsell */
  async create(params: CreateUpsellParams): Promise<Upsell> {
    return this.client.request<Upsell>('POST', '/upsells', { body: params });
  }

  /** Update an upsell */
  async update(id: string, params: UpdateUpsellParams): Promise<Upsell> {
    return this.client.request<Upsell>('POST', `/upsells/${id}`, { body: params });
  }

  /** Delete an upsell */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/upsells/${id}`);
  }
}

class SubscriptionsResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List subscription customers (legacy `POST /orders/subscriptions`).
   * @deprecated Use `subscribers.list()`, the documented subscriber list.
   */
  async list(params: ListSubscriptionsParams = {}): Promise<any> {
    return this.client.request<any>('POST', '/orders/subscriptions', { body: params });
  }

  /**
   * Get a subscriber with its offer, customer record and payment history
   * (`GET /orders/subscriptions/{id}`). `subscribers.get()` returns the same
   * data with the subscriber under `subscriber`.
   */
  async get(id: string): Promise<SubscriberOrderHistory> {
    return this.client.request<SubscriberOrderHistory>(
      'GET',
      `/orders/subscriptions/${seg(id)}`
    );
  }

  /**
   * Cancel a legacy card subscription immediately, by its `sub_…` id.
   * @deprecated This route is no longer served by the API (it answers 404).
   * Use `subscribers.cancel()` with the subscriber `_id` or `mem_…` id.
   */
  async cancel(stripeSubscriptionId: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'POST',
      `/orders/subscriptions/cancel/${stripeSubscriptionId}`
    );
  }

  /**
   * Refund a legacy card subscription, by its `sub_…` id.
   * @deprecated This route is no longer served by the API (it answers 404).
   * Refund payments from the dashboard.
   */
  async refund(stripeSubscriptionId: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'POST',
      `/orders/subscriptions/refund/${stripeSubscriptionId}`
    );
  }
}

/** Buyers with a membership in one of your subscription offers. */
class SubscribersResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List subscribers, newest first, with their live `status`, `portalUrl` and
   * the joined subscription offer. Paginated: `pageSize` is at most 100.
   */
  async list(params: ListSubscribersParams = {}): Promise<SubscribersResponse> {
    return this.client.request<SubscribersResponse>('GET', '/subscriptions/subscribers', {
      params,
    });
  }

  /**
   * Get a subscriber with its offer, customer record and full payment history.
   * Pass `{ live: true }` to also fetch the live membership from the payments partner.
   */
  async get(id: string, params: GetSubscriberParams = {}): Promise<SubscriberDetail> {
    return this.client.request<SubscriberDetail>(
      'GET',
      `/subscriptions/subscribers/${seg(id)}`,
      { params }
    );
  }

  /**
   * Cancel a membership at the end of the current billing period (access
   * continues until then). `id` is the subscriber `_id` or a membership id
   * (`mem_…`) — not a `sub_…` id.
   */
  async cancel(id: string): Promise<MembershipActionResult> {
    return this.client.request<MembershipActionResult>(
      'POST',
      `/subscriptions/${seg(id)}/cancel`
    );
  }

  /**
   * Pause payment collection on a membership. The buyer keeps access and is
   * not charged until `resume()`. `id` is the subscriber `_id` or `mem_…` id.
   */
  async pause(id: string): Promise<MembershipActionResult> {
    return this.client.request<MembershipActionResult>(
      'POST',
      `/subscriptions/${seg(id)}/pause`
    );
  }

  /**
   * Resume a paused membership, or undo a pending cancel-at-period-end.
   * `id` is the subscriber `_id` or `mem_…` id.
   */
  async resume(id: string): Promise<MembershipActionResult> {
    return this.client.request<MembershipActionResult>(
      'POST',
      `/subscriptions/${seg(id)}/resume`
    );
  }
}

/** Your subscription offers — the recurring products you sell. */
class SubscriptionOffersResource {
  constructor(private client: Pocketsflow) {}

  /** List all subscription offers */
  async list(): Promise<SubscriptionOffer[]> {
    return this.client.request<SubscriptionOffer[]>('GET', '/subscriptions');
  }

  /** Get a subscription offer by ID */
  async get(id: string): Promise<SubscriptionOffer> {
    return this.client.request<SubscriptionOffer>('GET', `/subscriptions/${id}`);
  }

  /** Create a subscription offer */
  async create(params: CreateSubscriptionOfferParams): Promise<SubscriptionOffer> {
    return this.client.request<SubscriptionOffer>('POST', '/subscriptions', { body: params });
  }

  /**
   * Delete a subscription offer. Existing subscribers keep their memberships;
   * manage them with `subscribers.*`.
   */
  async delete(id: string): Promise<DeletedSubscriptionOffer> {
    return this.client.request<DeletedSubscriptionOffer>('DELETE', `/subscriptions/${seg(id)}`);
  }
}

/** The webhook delivery log (entries are kept for 30 days). */
class WebhookDeliveriesResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List delivery attempts in the key's mode (including tests and
   * redeliveries), newest first. Paginated: `pageSize` is at most 100.
   */
  async list(params: ListWebhookDeliveriesParams = {}): Promise<WebhookDeliveriesResponse> {
    return this.client.request<WebhookDeliveriesResponse>('GET', '/delivered-webhooks', {
      params,
    });
  }

  /** Get one delivery, including the exact body that was sent (`webhookData`). */
  async get(id: string): Promise<WebhookDelivery> {
    const res = await this.client.request<unknown>('GET', `/delivered-webhooks/${seg(id)}`);
    return unwrap<WebhookDelivery>(res, 'deliveredWebhook');
  }

  /**
   * Send a logged delivery's body to its endpoint again (same event id,
   * freshly signed). Resolves even when your endpoint fails — check `delivered`.
   */
  async redeliver(id: string): Promise<WebhookRedeliveryResult> {
    return this.client.request<WebhookRedeliveryResult>(
      'POST',
      `/delivered-webhooks/${seg(id)}/redeliver`
    );
  }
}

class WebhooksResource {
  /** The delivery log: list, inspect and replay deliveries. */
  public deliveries: WebhookDeliveriesResource;

  constructor(private client: Pocketsflow) {
    this.deliveries = new WebhookDeliveriesResource(client);
  }

  /** List your webhook endpoints in the key's mode, newest first (without secrets). */
  async list(): Promise<Webhook[]> {
    const res = await this.client.request<unknown>('GET', '/webhooks');
    return unwrap<Webhook[]>(res, 'webhooks');
  }

  /** Get a webhook endpoint by ID, including its signing `secret`. */
  async get(id: string): Promise<Webhook> {
    const res = await this.client.request<unknown>('GET', `/webhooks/${seg(id)}`);
    return unwrap<Webhook>(res, 'webhook');
  }

  /**
   * Register an endpoint for the selected events (in the key's mode). The
   * response carries the signing `secret` — store it to verify deliveries.
   */
  async create(params: CreateWebhookParams): Promise<CreatedWebhook> {
    return this.client.request<CreatedWebhook>('POST', '/webhooks', { body: params });
  }

  /**
   * Update an endpoint's `url`, `events`, `description` or `active` flag
   * (`PATCH /webhooks/{id}`). Only the fields you send change. The returned
   * webhook does not include the `secret`.
   */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    const res = await this.client.request<unknown>('PATCH', `/webhooks/${seg(id)}`, {
      body: params,
    });
    return unwrap<Webhook>(res, 'webhook');
  }

  /** Delete a webhook endpoint */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/webhooks/${seg(id)}`);
  }

  /**
   * Replace the endpoint's signing secret and return the new one. Deliveries
   * are signed with the new secret immediately — update your verifier first.
   */
  async rotateSecret(id: string): Promise<WebhookSecretRotation> {
    return this.client.request<WebhookSecretRotation>(
      'POST',
      `/webhooks/${seg(id)}/rotate-secret`
    );
  }

  /**
   * Send a sample event to this endpoint only and return the outcome. The
   * attempt is recorded in the delivery log. Resolves even when your endpoint
   * fails — check `delivered`.
   */
  async test(id: string): Promise<WebhookTestResult> {
    return this.client.request<WebhookTestResult>('POST', `/webhooks/${seg(id)}/test`);
  }
}

class UsersResource {
  constructor(private client: Pocketsflow) {}

  /** Get current user information */
  async me(): Promise<User> {
    return this.client.request<User>('GET', '/users/me');
  }

  /** Update current user */
  async update(params: UpdateUserParams): Promise<User> {
    return this.client.request<User>('POST', '/users/update', { body: params });
  }

  /**
   * What the account's active plan unlocks: plan, fee rate, seats and one
   * entry per feature. Same call as `plans.entitlements()`.
   */
  async entitlements(): Promise<EntitlementsResult> {
    return withCan(await this.client.request<Entitlements>('GET', '/users/entitlements'));
  }

  /**
   * Set or remove ad-platform pixel ids (`''` or `null` removes one).
   * Adding or changing a pixel needs the Starter plan (`FeatureLockedError`
   * otherwise); a malformed id is a 400 whose `body.field` names the field.
   */
  async updateTrackingPixels(params: UpdateTrackingPixelsParams): Promise<User> {
    return this.client.request<User>('POST', '/users/update', { body: params });
  }
}

class CheckoutResource {
  constructor(private client: Pocketsflow) {}

  /** Create a checkout session */
  async create(params: CreateCheckoutParams): Promise<CheckoutSession> {
    return this.client.request<CheckoutSession>('POST', '/checkout/sessions', { body: params });
  }

  /**
   * Live checkouts buyers left without paying in the last 30 days, whatever
   * the key's mode. Available on every plan.
   */
  async abandonedSummary(): Promise<AbandonedCheckoutSummary> {
    return this.client.request<AbandonedCheckoutSummary>('GET', '/checkout/abandoned/summary');
  }
}

/**
 * Refund policies: the refund terms shown on your products' checkout and
 * product pages. (Refunding a payment is done from the dashboard.)
 */
class RefundsResource {
  constructor(private client: Pocketsflow) {}

  /** List your refund policies, with how many products use each (`appliedTo`) */
  async list(): Promise<RefundPolicy[]> {
    return this.client.request<RefundPolicy[]>('GET', '/refunds');
  }

  /** Get a refund policy by ID */
  async get(id: string): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('GET', `/refunds/${id}`);
  }

  /** Create a refund policy */
  async create(params: CreateRefundPolicyParams): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('POST', '/refunds', { body: params });
  }

  /** Update a refund policy (only the fields you send change) */
  async update(id: string, params: UpdateRefundPolicyParams): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('POST', `/refunds/${seg(id)}`, { body: params });
  }

  /** Delete a refund policy; resolves to the deleted policy */
  async delete(id: string): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('DELETE', `/refunds/${seg(id)}`);
  }
}

class NewsletterSubscribersResource {
  constructor(private client: Pocketsflow) {}

  /** List your email subscribers, optionally only one product audience */
  async list(params: ListEmailSubscribersParams = {}): Promise<EmailSubscriber[]> {
    return this.client.request<EmailSubscriber[]>('GET', '/newsletters/subscribers', {
      params,
    });
  }

  /** Get an email subscriber by ID */
  async get(id: string): Promise<EmailSubscriber> {
    return this.client.request<EmailSubscriber>('GET', `/newsletters/subscribers/${id}`);
  }

  /** Remove a contact from your email list; resolves to the removed subscriber */
  async delete(id: string): Promise<EmailSubscriber> {
    return this.client.request<EmailSubscriber>(
      'DELETE',
      `/newsletters/subscribers/${seg(id)}`
    );
  }
}

class AudiencesResource {
  constructor(private client: Pocketsflow) {}

  /** List your product audiences: one per product or subscription you sell */
  async list(): Promise<ProductAudience[]> {
    return this.client.request<ProductAudience[]>('GET', '/newsletters/audiences');
  }

  /**
   * Add a product's buyers to your email list (or every buyer, without a
   * productId). Throws a 403 `PocketsflowError` when it would exceed your
   * plan's subscriber limit.
   */
  async sync(params: SyncAudienceParams = {}): Promise<AudienceSyncResult> {
    return this.client.request<AudienceSyncResult>('POST', '/newsletters/audiences/sync', {
      body: params,
    });
  }
}

/** Newsletter posts: email campaigns to your list. */
class PostsResource {
  constructor(private client: Pocketsflow) {}

  /** List your posts, optionally only one `status` */
  async list(params: ListPostsParams = {}): Promise<Post[]> {
    return this.client.request<Post[]>('GET', '/newsletters/posts', { params });
  }

  /** Get a post by ID */
  async get(id: string): Promise<Post> {
    return this.client.request<Post>('GET', `/newsletters/posts/${seg(id)}`);
  }

  /**
   * Create a post (a draft by default). Pick recipients with `sendToAll`,
   * `productIds` (product audiences), `subscriberIds` or `tags`.
   */
  async create(params: CreatePostParams): Promise<Post> {
    return this.client.request<Post>('POST', '/newsletters/posts', { body: params });
  }

  /** Update a post (only the fields you send change) */
  async update(id: string, params: UpdatePostParams): Promise<Post> {
    return this.client.request<Post>('POST', `/newsletters/posts/${seg(id)}`, {
      body: params,
    });
  }

  /** Delete a post; resolves to the deleted post */
  async delete(id: string): Promise<Post> {
    return this.client.request<Post>('DELETE', `/newsletters/posts/${seg(id)}`);
  }

  /** Queue a post for sending now to its recipients */
  async send(id: string): Promise<SendPostResult> {
    return this.client.request<SendPostResult>('POST', `/newsletters/posts/${seg(id)}/send`);
  }
}

/** Your email list: subscribers, product audiences, posts and one-off emails. */
class NewslettersResource {
  public subscribers: NewsletterSubscribersResource;
  public audiences: AudiencesResource;
  public posts: PostsResource;

  constructor(private client: Pocketsflow) {
    this.subscribers = new NewsletterSubscribersResource(client);
    this.audiences = new AudiencesResource(client);
    this.posts = new PostsResource(client);
  }

  /**
   * Send a one-off email (e.g. a transactional message) to 1 – 100
   * recipients. Unsubscribed recipients are skipped — check `skipped`.
   */
  async send(params: SendEmailParams): Promise<SendEmailResult> {
    return this.client.request<SendEmailResult>('POST', '/newsletters/send', { body: params });
  }
}

/** Your Link in Bio page (one per account). */
class CreatorPageResource {
  constructor(private client: Pocketsflow) {}

  /** Get your page */
  async get(): Promise<CreatorPage> {
    return this.client.request<CreatorPage>('GET', '/creator-pages');
  }

  /** Create your page (one per account) */
  async create(params: CreateCreatorPageParams): Promise<CreatorPage> {
    return this.client.request<CreatorPage>('POST', '/creator-pages', { body: params });
  }

  /** Update your page (`PUT`; only the fields you send change) */
  async update(params: UpdateCreatorPageParams): Promise<CreatorPage> {
    return this.client.request<CreatorPage>('PUT', '/creator-pages', { body: params });
  }

  /** Delete your page */
  async delete(): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', '/creator-pages');
  }

  /** Change only your page's username (3 – 30 letters, numbers, `_` or `-`) */
  async updateUsername(username: string): Promise<CreatorPageUsernameUpdate> {
    return this.client.request<CreatorPageUsernameUpdate>('PATCH', '/creator-pages/username', {
      body: { username },
    });
  }

  /**
   * Check whether a username is free. Resolves when it is available; throws
   * a 400 `PocketsflowError` when it is taken or malformed.
   */
  async checkUsername(username: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'GET',
      `/creator-pages/check-username/${seg(username)}`
    );
  }
}

/** Hosted image uploads. */
class ImagesResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Upload an image (multipart field `image`) and get its hosted URL — use it
   * as a product `thumbnail`, in `images`, or on your creator page. PNG,
   * JPEG, WebP, GIF and AVIF are accepted. Needs a runtime with global
   * `FormData` and `Blob` (Node 18+).
   */
  async upload(image: ImageUploadInput, options: UploadImageOptions = {}): Promise<UploadedImage> {
    const blob =
      image instanceof Blob
        ? image
        : new Blob([image as ArrayBuffer], options.contentType ? { type: options.contentType } : {});
    const form = new FormData();
    form.append('image', blob, options.filename || 'image');
    return this.client.request<UploadedImage>('POST', '/images', { body: form });
  }
}

/** The partner (referral) program. */
class PartnersResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Join the partner program. Needs a connected payout account (403
   * otherwise); throws 409 if you are already a partner.
   */
  async create(): Promise<Partner> {
    return this.client.request<Partner>('POST', '/partners');
  }

  /** Get your partner profile (404 if you are not a partner) */
  async get(): Promise<Partner> {
    return this.client.request<Partner>('GET', '/partners');
  }

  /**
   * Attribute your account to a partner's referral code. Only within the
   * first days after signing up, and only once.
   */
  async registerReferral(referralCode: string): Promise<ReferralRegistration> {
    return this.client.request<ReferralRegistration>('POST', '/partners/register-referral', {
      body: { referralCode },
    });
  }

  /** Sellers who signed up with your code, newest first. `limit` is at most 100. */
  async listReferrals(params: PartnerListParams = {}): Promise<PartnerListResponse<ReferredUser>> {
    return this.client.request<PartnerListResponse<ReferredUser>>('GET', '/partners/referrals', {
      params,
    });
  }

  /** Sales made by the sellers you referred, with your commission on each. */
  async listReferralSales(
    params: PartnerListParams = {}
  ): Promise<PartnerListResponse<ReferralSale>> {
    return this.client.request<PartnerListResponse<ReferralSale>>(
      'GET',
      '/partners/referrals/sales',
      { params }
    );
  }

  /** Your partner totals: signups, sales, revenue and commission */
  async stats(): Promise<PartnerStats> {
    return this.client.request<PartnerStats>('GET', '/partners/stats');
  }
}

/** Plans and what the account's plan unlocks. */
class PlansResource {
  constructor(private client: Pocketsflow) {}

  /**
   * What the account's active plan unlocks: plan, fee rate, seats and one
   * entry per feature. The result has a `can(featureKey)` helper.
   */
  async entitlements(): Promise<EntitlementsResult> {
    return withCan(await this.client.request<Entitlements>('GET', '/users/entitlements'));
  }

  /** Every self-serve plan with its prices, limits and features. Public endpoint. */
  async list(): Promise<Plan[]> {
    const res = await this.client.request<unknown>('GET', '/users/billing-tiers');
    return unwrap<Plan[]>(res, 'tiers');
  }
}

/** The Monday growth report email (free on every plan). */
class WeeklyReportResource {
  constructor(private client: Pocketsflow) {}

  /** Build last week's report now: the email (`subject`, `html`, `text`) and its numbers. */
  async get(): Promise<WeeklyReportPreview> {
    return this.client.request<WeeklyReportPreview>('GET', '/users/weekly-report/preview');
  }

  /** Whether the Monday email is on, its time zone and the next send. */
  async getSettings(): Promise<WeeklyReportSettings> {
    return this.client.request<WeeklyReportSettings>('GET', '/users/weekly-report/settings');
  }

  /** Turn the Monday email on or off. */
  async updateSettings(params: UpdateWeeklyReportSettingsParams): Promise<WeeklyReportSettings> {
    return this.client.request<WeeklyReportSettings>('PUT', '/users/weekly-report/settings', {
      body: params,
    });
  }
}

/**
 * Tracked links: short links on your store that count clicks, visitors and
 * sales. Creating and editing need the Starter plan; reads work on every
 * plan but carry no stats (`statsLocked: true`) below it.
 */
class TrackedLinksResource {
  constructor(private client: Pocketsflow) {}

  /** Your links (newest first) with their stats, totals, channels and daily rows. */
  async list(params: ListTrackedLinksParams = {}): Promise<TrackedLinkListResponse> {
    const { archived, ...range } = params;
    return this.client.request<TrackedLinkListResponse>('GET', '/tracked-links', {
      params: { ...range, archived: archived ? '1' : undefined },
    });
  }

  /**
   * Create a link. A taken slug is a 409 whose `body.suggestion` is a free
   * one; below Starter it throws `FeatureLockedError`.
   */
  async create(params: CreateTrackedLinkParams): Promise<TrackedLink> {
    const res = await this.client.request<unknown>('POST', '/tracked-links', { body: params });
    return unwrap<TrackedLink>(res, 'link');
  }

  /** One link with its stats, daily rows and top countries. */
  async get(id: string, params: TrackedLinkStatsParams = {}): Promise<TrackedLinkStatsResponse> {
    return this.client.request<TrackedLinkStatsResponse>('GET', `/tracked-links/${seg(id)}`, {
      params,
    });
  }

  /**
   * Edit or archive a link (only the fields you send change). The slug
   * never changes. Archiving is free; other edits need the Starter plan.
   */
  async update(id: string, params: UpdateTrackedLinkParams): Promise<TrackedLink> {
    const res = await this.client.request<unknown>('PATCH', `/tracked-links/${seg(id)}`, {
      body: params,
    });
    return unwrap<TrackedLink>(res, 'link');
  }

  /** Whether a slug is valid and free. `excludeId` ignores one of your links. */
  async checkSlug(slug: string, excludeId?: string): Promise<TrackedLinkSlugCheck> {
    return this.client.request<TrackedLinkSlugCheck>('GET', '/tracked-links/slug-available', {
      params: { slug, excludeId },
    });
  }
}

/** The "Powered by Pocketsflow" badge on your store, and its referral rewards. */
class StoreBadgeResource {
  constructor(private client: Pocketsflow) {}

  /** Whether the badge shows, whether your plan may hide it, and its referral stats. */
  async get(): Promise<StoreBadge> {
    return this.client.request<StoreBadge>('GET', '/powered-by/me');
  }

  /**
   * Show or hide the badge. Hiding it (`showPoweredBy: false`) needs the
   * Starter plan (`FeatureLockedError` otherwise); showing it is always allowed.
   */
  async update(params: UpdateStoreBadgeParams): Promise<StoreBadge> {
    return this.client.request<StoreBadge>('PUT', '/powered-by', { body: params });
  }

  /**
   * The badge's referral numbers: code, link, clicks, signups and free
   * months earned (same call as `get()`, referral fields only).
   */
  async referralStats(): Promise<StoreBadgeReferralStats> {
    const { code, link, clicks, signups, clearing, freeMonths } = await this.get();
    return { code, link, clicks, signups, clearing, freeMonths };
  }
}

/** Pending invitations to your store. */
class TeamInvitesResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Invite someone by email (Growth plan). Throws `SeatLimitError` when
   * every seat is taken, `FeatureLockedError` below Growth.
   */
  async create(params: InviteTeamMemberParams): Promise<TeamInviteCreated> {
    return this.client.request<TeamInviteCreated>('POST', '/team/invites', { body: params });
  }

  /** Send the invitation email again; the invite is valid 7 more days. */
  async resend(id: string): Promise<TeamInviteResent> {
    return this.client.request<TeamInviteResent>('POST', `/team/invites/${seg(id)}/resend`);
  }

  /** Cancel a pending invitation. */
  async cancel(id: string): Promise<TeamOk> {
    return this.client.request<TeamOk>('DELETE', `/team/invites/${seg(id)}`);
  }
}

/** People with access to your store. */
class TeamMembersResource {
  constructor(private client: Pocketsflow) {}

  /** Change a member's role, teams or status (`paused` keeps them out). */
  async update(id: string, params: UpdateTeamMemberParams): Promise<TeamMemberUpdate> {
    return this.client.request<TeamMemberUpdate>('PATCH', `/team/members/${seg(id)}`, {
      body: params,
    });
  }

  /** Remove a member from your store. */
  async remove(id: string): Promise<TeamOk> {
    return this.client.request<TeamOk>('DELETE', `/team/members/${seg(id)}`);
  }
}

/** Teams: named groups of members with access to some dashboard areas. */
class TeamTeamsResource {
  constructor(private client: Pocketsflow) {}

  /** Create a team (Growth plan). */
  async create(params: CreateTeamParams): Promise<TeamRecord> {
    return this.client.request<TeamRecord>('POST', '/team/teams', { body: params });
  }

  /** Rename a team or change its areas (Growth plan). */
  async update(id: string, params: UpdateTeamParams): Promise<TeamRecord> {
    return this.client.request<TeamRecord>('PATCH', `/team/teams/${seg(id)}`, { body: params });
  }

  /** Delete a team (its members stay on the store). */
  async delete(id: string): Promise<TeamOk> {
    return this.client.request<TeamOk>('DELETE', `/team/teams/${seg(id)}`);
  }
}

/** Your store's team (Growth plan). An API key acts as the store owner. */
class TeamResource {
  public invites: TeamInvitesResource;
  public members: TeamMembersResource;
  public teams: TeamTeamsResource;

  constructor(private client: Pocketsflow) {
    this.invites = new TeamInvitesResource(client);
    this.members = new TeamMembersResource(client);
    this.teams = new TeamTeamsResource(client);
  }

  /** Seats, members, pending invites and teams. */
  async get(): Promise<TeamOverview> {
    return this.client.request<TeamOverview>('GET', '/team');
  }

  /** The activity log, newest first. Page with `before: nextBefore`. */
  async activity(params: ListTeamActivityParams = {}): Promise<TeamActivityResponse> {
    return this.client.request<TeamActivityResponse>('GET', '/team/activity', { params });
  }
}

/** The one-click offer shown after a product's checkout (Growth plan). */
class PostPurchaseOffersResource {
  constructor(private client: Pocketsflow) {}

  /** A product's post-purchase offer. */
  async get(productId: string): Promise<PostPurchaseOffer> {
    const res = await this.client.request<unknown>(
      'GET',
      `/post-purchase/products/${seg(productId)}`
    );
    return unwrap<PostPurchaseOffer>(res, 'postPurchaseOffer');
  }

  /**
   * Set a product's post-purchase offer (only the fields you send change).
   * Turning it on needs the Growth plan (`FeatureLockedError` otherwise).
   */
  async update(productId: string, params: UpdatePostPurchaseOfferParams): Promise<PostPurchaseOffer> {
    const res = await this.client.request<unknown>(
      'PUT',
      `/post-purchase/products/${seg(productId)}`,
      { body: params }
    );
    return unwrap<PostPurchaseOffer>(res, 'postPurchaseOffer');
  }
}

/** Real-purchase notices on a product's checkout (Growth plan). */
class SocialProofResource {
  constructor(private client: Pocketsflow) {}

  /** What the checkout shows for a product now. Public endpoint. */
  async get(productId: string): Promise<SocialProof> {
    return this.client.request<SocialProof>('GET', `/social-proof/products/${seg(productId)}`);
  }

  /** A product's social proof settings. */
  async getSettings(productId: string): Promise<SocialProofSettings> {
    const res = await this.client.request<unknown>(
      'GET',
      `/social-proof/products/${seg(productId)}/settings`
    );
    return unwrap<SocialProofSettings>(res, 'socialProof');
  }

  /**
   * Change a product's social proof settings (only the fields you send
   * change). Turning it on needs the Growth plan (`FeatureLockedError` otherwise).
   */
  async updateSettings(
    productId: string,
    params: UpdateSocialProofSettingsParams
  ): Promise<SocialProofSettings> {
    const res = await this.client.request<unknown>(
      'PUT',
      `/social-proof/products/${seg(productId)}/settings`,
      { body: params }
    );
    return unwrap<SocialProofSettings>(res, 'socialProof');
  }
}

/**
 * Sales funnels: a free lead magnet, an email sequence and a paid offer.
 * Creating and activating need the Growth plan (`FeatureLockedError`).
 */
class FunnelsResource {
  constructor(private client: Pocketsflow) {}

  /** The email sequence templates (schedule and subjects). */
  async templates(params: ListFunnelTemplatesParams = {}): Promise<FunnelTemplate[]> {
    const res = await this.client.request<unknown>('GET', '/funnels/templates', { params });
    return unwrap<FunnelTemplate[]>(res, 'templates');
  }

  /** Your funnels, with their lead magnet and offer products. */
  async list(): Promise<FunnelListItem[]> {
    const res = await this.client.request<unknown>('GET', '/funnels');
    return unwrap<FunnelListItem[]>(res, 'funnels');
  }

  /** Create a funnel (as a `draft`): its emails, automation and optional discount. */
  async create(params: CreateFunnelParams): Promise<Funnel> {
    return this.client.request<Funnel>('POST', '/funnels', { body: params });
  }

  /** One funnel with its products, emails and activation checklist. */
  async get(id: string): Promise<FunnelDetail> {
    return this.client.request<FunnelDetail>('GET', `/funnels/${seg(id)}`);
  }

  /** Rename a funnel. */
  async rename(id: string, name: string): Promise<Funnel> {
    return this.client.request<Funnel>('PUT', `/funnels/${seg(id)}`, { body: { name } });
  }

  /**
   * Delete a funnel, its leads and its sequence automation. The email posts
   * and the discount stay.
   */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/funnels/${seg(id)}`);
  }

  /** Start sending the sequence to new leads (Growth plan). */
  async activate(id: string): Promise<Funnel> {
    return this.client.request<Funnel>('POST', `/funnels/${seg(id)}/activate`);
  }

  /** Pause the funnel: its sequence automation stops sending. */
  async pause(id: string): Promise<Funnel> {
    return this.client.request<Funnel>('POST', `/funnels/${seg(id)}/pause`);
  }

  /** Leads, sends, opens, clicks and attributed sales, per stage and email. */
  async stats(id: string): Promise<FunnelAnalytics> {
    return this.client.request<FunnelAnalytics>('GET', `/funnels/${seg(id)}/stats`);
  }
}

/** License keys issued with your products. */
class LicensesResource {
  constructor(private client: Pocketsflow) {}

  /** Your license keys in the key's mode, newest first. `pageSize` is at most 100. */
  async list(params: ListLicenseKeysParams = {}): Promise<LicenseKeysResponse> {
    return this.client.request<LicenseKeysResponse>('GET', '/licenses', { params });
  }

  /** One license key with its activations. */
  async get(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('GET', `/licenses/${seg(id)}`);
  }

  /** Disable a key: validation answers `license_disabled` until it is enabled. */
  async disable(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('POST', `/licenses/${seg(id)}/disable`);
  }

  /** Enable a disabled key. */
  async enable(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('POST', `/licenses/${seg(id)}/enable`);
  }

  /** Free every activation of a key. */
  async resetActivations(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('POST', `/licenses/${seg(id)}/reset-activations`);
  }

  /**
   * Check a key a buyer entered (public: no API key needed). Resolves with
   * `valid: false` and a `code` when the key is not valid — it only throws
   * on rate limits, server or network errors.
   */
  async validate(params: LicenseKeyCheckParams): Promise<LicenseValidation> {
    return this.client.request<LicenseValidation>('POST', '/licenses/validate', {
      body: params,
      resolveValidationBody: true,
    });
  }

  /**
   * Activate a key on an instance (public). Omit `instanceId` to get a
   * generated `ins_…` id in `instance.id`. Resolves with `valid: false` and
   * `code: "activation_limit_reached"` when every activation is used.
   */
  async activate(params: LicenseKeyCheckParams): Promise<LicenseValidation> {
    return this.client.request<LicenseValidation>('POST', '/licenses/activate', {
      body: params,
      resolveValidationBody: true,
    });
  }

  /** Free one instance's activation (public). */
  async deactivate(params: DeactivateLicenseKeyParams): Promise<LicenseValidation> {
    return this.client.request<LicenseValidation>('POST', '/licenses/deactivate', {
      body: params,
      resolveValidationBody: true,
    });
  }
}
