# Pocketsflow Node.js SDK

Official Node.js/TypeScript SDK for the [Pocketsflow](https://pocketsflow.com) API.

## Installation

```bash
npm install pocketsflow
# or
yarn add pocketsflow
# or
pnpm add pocketsflow
```

## Quick Start

```typescript
import { Pocketsflow } from 'pocketsflow';

const pocketsflow = new Pocketsflow({
  apiKey: 'pk_live_your_api_key_here',
});

// List all products
const products = await pocketsflow.products.list();

// Get a specific product
const product = await pocketsflow.products.get('product_id');

// Create a new product
const newProduct = await pocketsflow.products.create({
  name: 'My Digital Product',
  price: 29.99,
  currency: 'USD',
});
```

## Configuration

```typescript
const pocketsflow = new Pocketsflow({
  apiKey: 'pk_live_your_api_key_here', // Required
  baseUrl: 'https://api.pocketsflow.com', // Optional, defaults to production
  timeout: 30000, // Optional, request timeout in ms
});
```

### Test Mode

Use a test mode API key (`pk_test_...`) to interact with test data:

```typescript
const pocketsflow = new Pocketsflow({
  apiKey: 'pk_test_your_test_key_here',
});
```

## Resources

### Products

```typescript
// List all products
const products = await pocketsflow.products.list();

// Get a product
const product = await pocketsflow.products.get('product_id');

// Create a product
const product = await pocketsflow.products.create({
  name: 'Premium Course',
  description: 'Learn everything about...',
  price: 99.99,
  currency: 'USD',
  type: 'one-time', // or 'subscription'
});

// Update a product
const updated = await pocketsflow.products.update('product_id', {
  name: 'Updated Name',
  price: 149.99,
});

// Delete a product
await pocketsflow.products.delete('product_id');
```

### Product Variants

```typescript
// Create a variant
const variant = await pocketsflow.variants.create({
  productId: 'product_id',
  name: 'Premium Version',
  price: 149.99,
});

// Delete a variant
await pocketsflow.variants.delete('variant_id');
```

### Orders

```typescript
// List orders with pagination and filters
const { orders, pagination } = await pocketsflow.orders.list({
  page: 1,
  pageSize: 20,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  productId: 'product_id', // optional filter
});

// Get a specific order
const order = await pocketsflow.orders.get('order_id');
```

### Customers

```typescript
// List all customers
const customers = await pocketsflow.customers.list({
  email: 'customer@example.com', // optional filter
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

// Get a customer
const customer = await pocketsflow.customers.get('customer_id');
```

### Reviews

```typescript
// List all reviews
const reviews = await pocketsflow.reviews.list();

// Filter by product
const productReviews = await pocketsflow.reviews.list({
  productId: 'product_id',
});
```

### Discounts

```typescript
// List all discounts
const discounts = await pocketsflow.discounts.list();

// Get a discount
const discount = await pocketsflow.discounts.get('discount_id');

// Create a discount
const discount = await pocketsflow.discounts.create({
  name: 'Summer Sale',
  code: 'SUMMER20',
  value: 20,
  valueType: 'percentage', // or 'fixed'
  mainProductIds: ['product_id_1', 'product_id_2'],
  expiration: '2024-12-31',
});

// Update a discount
const updated = await pocketsflow.discounts.update('discount_id', {
  value: 25,
  active: true,
});

// Delete a discount
await pocketsflow.discounts.delete('discount_id');
```

### Upsells

```typescript
// List all upsells
const { upsells } = await pocketsflow.upsells.list();

// Get an upsell
const upsell = await pocketsflow.upsells.get('upsell_id');

// Create an upsell
const upsell = await pocketsflow.upsells.create({
  name: 'Premium Upgrade',
  mainProductIds: ['product_id'],
  upsellProductId: 'premium_product_id',
  upsellPrice: 49.99,
  upsellDescription: 'Upgrade to premium!',
  primaryButtonText: 'Yes, upgrade me!',
  secondaryButtonText: 'No thanks',
});

// Update an upsell
const updated = await pocketsflow.upsells.update('upsell_id', {
  upsellPrice: 39.99,
  active: true,
});

// Delete an upsell
await pocketsflow.upsells.delete('upsell_id');
```

### Subscriptions

```typescript
// List subscription customers
const subscriptions = await pocketsflow.subscriptions.list({
  page: 1,
  pageSize: 20,
});

// Get a subscription
const subscription = await pocketsflow.subscriptions.get('subscription_id');

// Cancel a subscription
await pocketsflow.subscriptions.cancel('stripe_subscription_id');

// Refund a subscription
await pocketsflow.subscriptions.refund('stripe_subscription_id');
```

### Webhooks

```typescript
// List all webhooks
const webhooks = await pocketsflow.webhooks.list();

// Get a webhook
const webhook = await pocketsflow.webhooks.get('webhook_id');

// Create a webhook
const webhook = await pocketsflow.webhooks.create({
  url: 'https://your-server.com/webhook',
  events: ['order.created', 'order.refunded'],
  description: 'My webhook',
});

// Update a webhook
const updated = await pocketsflow.webhooks.update('webhook_id', {
  events: ['order.created', 'order.refunded', 'subscription.created'],
  active: true,
});

// Test a webhook
await pocketsflow.webhooks.test('webhook_id');

// Delete a webhook
await pocketsflow.webhooks.delete('webhook_id');
```

### User / Account

```typescript
// Get current user info
const user = await pocketsflow.users.me();

// Update user settings
const updated = await pocketsflow.users.update({
  firstName: 'John',
  lastName: 'Doe',
  currency: 'USD',
});
```

### Checkout Sessions

```typescript
// Create a checkout session
const session = await pocketsflow.checkout.create({
  productId: 'product_id',
  successUrl: 'https://your-site.com/success',
  cancelUrl: 'https://your-site.com/cancel',
  customerEmail: 'customer@example.com', // optional
  discountCode: 'SUMMER20', // optional
  metadata: { orderId: '12345' }, // optional
});

// Redirect customer to checkout
console.log(session.url); // https://...pocketsflow.com/checkout/...
```

### Refunds

```typescript
// List all refunds
const refunds = await pocketsflow.refunds.list();

// Get a refund
const refund = await pocketsflow.refunds.get('refund_id');

// Create a refund
const refund = await pocketsflow.refunds.create({
  orderId: 'order_id',
  amount: 29.99, // optional, defaults to full refund
  reason: 'Customer requested refund',
});
```

## Error Handling

```typescript
import { Pocketsflow, PocketsflowError } from 'pocketsflow';

try {
  const product = await pocketsflow.products.get('invalid_id');
} catch (error) {
  if (error instanceof PocketsflowError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status); // HTTP status code
    console.error('Code:', error.code); // Error code if available
  }
}
```

## TypeScript

The SDK is written in TypeScript and includes full type definitions:

```typescript
import {
  Pocketsflow,
  Product,
  Order,
  Customer,
  CreateProductParams,
} from 'pocketsflow';

const params: CreateProductParams = {
  name: 'My Product',
  price: 29.99,
  currency: 'USD',
};

const product: Product = await pocketsflow.products.create(params);
```

## Requirements

- Node.js 16.0.0 or later
- A Pocketsflow account with API keys

## API Documentation

For full API documentation, visit [https://api.pocketsflow.com/docs](https://api.pocketsflow.com/docs)

## Support

- Documentation: [https://docs.pocketsflow.com](https://docs.pocketsflow.com)
- API Reference: [https://api.pocketsflow.com/docs](https://api.pocketsflow.com/docs)
- Support: [https://pocketsflow.com/support](https://pocketsflow.com/support)

## License

MIT
