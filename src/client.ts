import {
  PocketsflowConfig,
  PocketsflowError,
  Product,
  CreateProductParams,
  UpdateProductParams,
  ProductVariant,
  CreateVariantParams,
  Order,
  ListOrdersParams,
  OrdersResponse,
  Customer,
  ListCustomersParams,
  Review,
  ListReviewsParams,
  Discount,
  CreateDiscountParams,
  UpdateDiscountParams,
  Upsell,
  UpsellsResponse,
  CreateUpsellParams,
  UpdateUpsellParams,
  Subscription,
  ListSubscriptionsParams,
  SubscriptionOffer,
  CreateSubscriptionOfferParams,
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  User,
  UpdateUserParams,
  CreateCheckoutParams,
  CheckoutSession,
  Refund,
  CreateRefundParams,
} from './types';

const DEFAULT_BASE_URL = 'https://api.pocketsflow.com';
const DEFAULT_TIMEOUT = 30000;

export class Pocketsflow {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  // Resource namespaces
  public products: ProductsResource;
  public variants: VariantsResource;
  public orders: OrdersResource;
  public customers: CustomersResource;
  public reviews: ReviewsResource;
  public discounts: DiscountsResource;
  public upsells: UpsellsResource;
  public subscriptions: SubscriptionsResource;
  /** Subscription offers (recurring products), distinct from buyer memberships. */
  public subscriptionOffers: SubscriptionOffersResource;
  public webhooks: WebhooksResource;
  public users: UsersResource;
  public checkout: CheckoutResource;
  public refunds: RefundsResource;

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
    this.customers = new CustomersResource(this);
    this.reviews = new ReviewsResource(this);
    this.discounts = new DiscountsResource(this);
    this.upsells = new UpsellsResource(this);
    this.subscriptions = new SubscriptionsResource(this);
    this.subscriptionOffers = new SubscriptionOffersResource(this);
    this.webhooks = new WebhooksResource(this);
    this.users = new UsersResource(this);
    this.checkout = new CheckoutResource(this);
    this.refunds = new RefundsResource(this);
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

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
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

  /** Get an order by ID */
  async get(id: string): Promise<Order> {
    return this.client.request<Order>('GET', `/orders/${id}`);
  }
}

class CustomersResource {
  constructor(private client: Pocketsflow) {}

  /** List all customers */
  async list(params: ListCustomersParams = {}): Promise<Customer[]> {
    return this.client.request<Customer[]>('GET', '/customers', { params });
  }

  /** Get a customer by ID */
  async get(id: string): Promise<Customer> {
    return this.client.request<Customer>('GET', `/customers/${id}`);
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

  /** List subscription customers */
  async list(params: ListSubscriptionsParams = {}): Promise<any> {
    return this.client.request<any>('POST', '/orders/subscriptions', { body: params });
  }

  /** Get a subscription by ID */
  async get(id: string): Promise<Subscription> {
    return this.client.request<Subscription>('GET', `/orders/subscriptions/${id}`);
  }

  /** Cancel a subscription */
  async cancel(stripeSubscriptionId: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'POST',
      `/orders/subscriptions/cancel/${stripeSubscriptionId}`
    );
  }

  /** Refund a subscription */
  async refund(stripeSubscriptionId: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'POST',
      `/orders/subscriptions/refund/${stripeSubscriptionId}`
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
}

class WebhooksResource {
  constructor(private client: Pocketsflow) {}

  /** List all webhooks */
  async list(): Promise<Webhook[]> {
    return this.client.request<Webhook[]>('GET', '/webhooks');
  }

  /** Get a webhook by ID */
  async get(id: string): Promise<Webhook> {
    return this.client.request<Webhook>('GET', `/webhooks/${id}`);
  }

  /** Create a new webhook */
  async create(params: CreateWebhookParams): Promise<Webhook> {
    return this.client.request<Webhook>('POST', '/webhooks', { body: params });
  }

  /** Update a webhook */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    return this.client.request<Webhook>('PUT', `/webhooks/${id}`, { body: params });
  }

  /** Delete a webhook */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/webhooks/${id}`);
  }

  /** Test a webhook */
  async test(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('POST', `/webhooks/${id}/test`);
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

class RefundsResource {
  constructor(private client: Pocketsflow) {}

  /** List all refunds */
  async list(): Promise<Refund[]> {
    return this.client.request<Refund[]>('GET', '/refunds');
  }

  /** Get a refund by ID */
  async get(id: string): Promise<Refund> {
    return this.client.request<Refund>('GET', `/refunds/${id}`);
  }

  /** Create a refund */
  async create(params: CreateRefundParams): Promise<Refund> {
    return this.client.request<Refund>('POST', '/refunds', { body: params });
  }
}
