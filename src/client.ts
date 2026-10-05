import {
  PocketsflowConfig,
  PocketsflowError,
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
} from './types';

const DEFAULT_BASE_URL = 'https://api.pocketsflow.com';
const DEFAULT_TIMEOUT = 30000;

/** Encode a caller-supplied id for use as one path segment. */
const seg = (id: string): string => encodeURIComponent(id);

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
  }

  async request<T>(
    method: string,
    path: string,
    options: { body?: any; params?: Record<string, any> } = {}
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

        try {
          const errorBody = await response.json() as { message?: string; error?: string; code?: string };
          errorMessage = errorBody.message || errorBody.error || errorMessage;
          errorCode = errorBody.code;
        } catch {
          // Ignore JSON parse errors
        }

        throw new PocketsflowError(errorMessage, errorCode, response.status);
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
}

class CheckoutResource {
  constructor(private client: Pocketsflow) {}

  /** Create a checkout session */
  async create(params: CreateCheckoutParams): Promise<CheckoutSession> {
    return this.client.request<CheckoutSession>('POST', '/checkout/sessions', { body: params });
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
