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

### Test mode and live mode

The key prefix decides the mode, whatever the test-mode toggle in the
dashboard says:

- a `pk_test_...` key always reads and writes **test-mode** data;
- a `pk_live_...` key always reads and writes **live** data.

Lists return that mode's data, and anything you create (products, discounts,
webhooks, ...) lands in that mode. Webhook endpoints created with a test key
only receive test-mode events.

```typescript
const pocketsflow = new Pocketsflow({
  apiKey: 'pk_test_your_test_key_here',
});

const me = await pocketsflow.users.me();
me.testMode; // true for a pk_test_ key
```

Reads and updates by id act on your own items in either mode, so keep test and
live ids apart in your integration.

### Pagination

`orders.list()`, `payments.list()`, `subscribers.list()` and
`webhooks.deliveries.list()` are paginated: `page` (1-based, default `1`) and
`pageSize` (default `20`, **maximum `100`** — larger values are capped). They
resolve to `{ <items>, pagination: { totalCount, totalPages, currentPage,
pageSize, hasMore } }`; keep requesting `page + 1` while `hasMore` is `true`.
`partners.listReferrals()` / `.listReferralSales()` take `page` and `limit`
(maximum `100`) and resolve to `{ data, pagination: { currentPage, totalPages,
totalItems, hasNextPage, hasPrevPage, limit } }`. Other list methods return
the full array.

## Resources

### Products

```typescript
// List all products
const products = await pocketsflow.products.list();

// Get a product
const product = await pocketsflow.products.get('product_id');

// Create a product (prices are in your account currency)
const product = await pocketsflow.products.create({
  name: 'Premium Course',
  description: 'Learn everything about...',
  price: 99.99,
  compareAtPrice: 149.99, // optional struck-through price
  productType: 'course', // 'file' | 'url' | 'course' | 'credits'
  thumbnail: imageUrl, // e.g. from images.upload()
});

// Update a product (only the fields you send change)
const updated = await pocketsflow.products.update('product_id', {
  name: 'Updated Name',
  price: 149.99,
  published: false,
});

// Delete a product
await pocketsflow.products.delete('product_id');

// Copy a catalog item (a one-time product or a subscription offer —
// whichever owns the id). `{ testMode: false }` copies a test-mode offer
// into live mode; the copy starts unpublished in live mode.
const copy = await pocketsflow.products.copy('product_id', { testMode: false });
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

// Get one order: the sale with its fee breakdown, plus its product,
// customer, review and upsells
const { sale, product, customer, review } = await pocketsflow.orders.get('order_id');
sale.platformFee;
```

`orders` are one-time purchases. Subscription charges are in `payments`.

### Payments

The ledger of every sale: one-time purchases **and** subscription payments
(the initial charge plus every renewal).

```typescript
const { payments, pagination } = await pocketsflow.payments.list({
  type: 'subscription', // 'one_time' | 'subscription' | 'all' (default)
  page: 1,
  pageSize: 100, // maximum 100
  subscriptionId: 'offer_id', // optional filter (or productId)
});

// One payment with its product or subscription offer and customer.
// `{ live: true }` also fetches the live payment from the payments partner.
const detail = await pocketsflow.payments.get('payment_id', { live: true });
detail.payment.amount;
detail.paymentsPartner; // stored payments partner payload
```

### Customers

```typescript
// List all customers
const customers = await pocketsflow.customers.list({
  sortBy: 'createdAt', // 'email' | 'country' | 'numberOfOrders' | 'createdAt'
  sortOrder: 'desc',
});

// Only buyers of one product or subscription; each customer lists every
// product they bought in `products`
const buyers = await pocketsflow.customers.list({ productId: 'product_id' });
buyers[0].products; // [{ _id: 'product_id', name: 'My course' }, ...]

// Get a customer with their stats, orders, subscriptions and reviews
const { customer, stats, orders, subscriptions } = await pocketsflow.customers.get('customer_id');
```

### Email Subscribers & Product Audiences

```typescript
// One audience per product or subscription you sell
const audiences = await pocketsflow.newsletters.audiences.list();
// [{ productId, name, kind: 'product', subscribers: 120, customers: 140 }, ...]

// Add a product's buyers to your email list (omit productId for every buyer)
const result = await pocketsflow.newsletters.audiences.sync({ productId: 'product_id' });
// { customers: 140, added: 18, updated: 2, unsubscribed: 1 }

// Your email subscribers, optionally only one product audience
const subscribers = await pocketsflow.newsletters.subscribers.list({
  productId: 'product_id',
});
const subscriber = await pocketsflow.newsletters.subscribers.get('subscriber_id');

// Remove a contact from your list
await pocketsflow.newsletters.subscribers.delete('subscriber_id');
```

### Newsletter Posts & One-off Emails

```typescript
// Draft a post to one product audience, then send it now
const post = await pocketsflow.newsletters.posts.create({
  name: 'Launch announcement',
  subject: 'Version 2 is here',
  contentHtml: '<p>Hello!</p>',
  productIds: ['product_id'], // or sendToAll: true, subscriberIds, tags
});
await pocketsflow.newsletters.posts.send(post._id);

// Or schedule it
await pocketsflow.newsletters.posts.update(post._id, {
  status: 'scheduled',
  scheduledAt: '2026-11-01T09:00:00Z',
  scheduledTimezone: 'Europe/Paris',
});

const drafts = await pocketsflow.newsletters.posts.list({ status: 'draft' });
const one = await pocketsflow.newsletters.posts.get('post_id');
await pocketsflow.newsletters.posts.delete('post_id');

// Send a one-off email to 1 - 100 recipients (unsubscribed ones are skipped)
const sent = await pocketsflow.newsletters.send({
  to: ['buyer@example.com'],
  subject: 'Your access link',
  html: '<p>Here it is.</p>',
});
sent.status; // 'sent' | 'skipped'
sent.skipped; // addresses that were not emailed
```

### Reviews

```typescript
// List all reviews
const reviews = await pocketsflow.reviews.list();

// Reviews of one product
const productReviews = reviews.filter((r) => r.productId === 'product_id');
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

// Check a code the way the checkout does (public endpoints: no API key needed).
// Resolves to the discount, or throws a 404 PocketsflowError.
const applied = await pocketsflow.discounts.apply('SUMMER20', 'product_id');

// Does any active discount apply to this product or subscription offer?
const hasDiscount = await pocketsflow.discounts.checkProduct('product_id'); // boolean
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

The `subscriptions` namespace manages buyer subscriptions. Subscription offers
(the recurring products you sell) use `subscriptionOffers`:

```typescript
// Create a subscription offer
const newOffer = await pocketsflow.subscriptionOffers.create({
  name: 'Pro Membership',
  price: 29,
  frequency: 'monthly',
  trialPeriod: 7,
});

// List and get subscription offers
const offers = await pocketsflow.subscriptionOffers.list();
const offer = await pocketsflow.subscriptionOffers.get(newOffer._id);

// Delete a subscription offer
await pocketsflow.subscriptionOffers.delete(newOffer._id);
```

```typescript
// A subscriber with its offer, customer and payment history
// (same data as subscribers.get(), under `subscriptionCustomer`)
const { subscriptionCustomer, payments } = await pocketsflow.subscriptions.get('subscriber_id');
```

`subscriptions.list()`, `subscriptions.cancel()` and `subscriptions.refund()`
are deprecated: list and manage memberships with `subscribers` below
(`subscriptions.cancel()` / `.refund()` call routes the API no longer serves).

### Subscribers

Buyers with a membership in one of your subscription offers:

```typescript
const { subscribers, pagination } = await pocketsflow.subscribers.list({
  status: 'active', // optional
  subscriptionId: 'offer_id', // optional
  pageSize: 50, // maximum 100
});

const s = subscribers[0];
s.membershipId; // mem_...
s.portalUrl; // hand this self-service link to the buyer as is

// One subscriber, its offer, customer and every payment (initial + renewals).
// `{ live: true }` also fetches the live membership as `membership`.
const { subscriber, payments } = await pocketsflow.subscribers.get('subscriber_id');

// Manage the membership (subscriber _id or mem_... id)
await pocketsflow.subscribers.cancel('mem_123'); // at the end of the billing period
await pocketsflow.subscribers.pause('mem_123'); // stop charging, keep access
await pocketsflow.subscribers.resume('mem_123'); // resume, or undo a pending cancel
```

### Webhooks

```typescript
// List your endpoints (secrets are omitted)
const webhooks = await pocketsflow.webhooks.list();

// Get one, including its signing secret
const webhook = await pocketsflow.webhooks.get('webhook_id');

// Create an endpoint — store the returned secret.
// WEBHOOK_EVENTS (exported) lists every event type.
const { id, secret } = await pocketsflow.webhooks.create({
  url: 'https://your-server.com/webhook',
  events: ['order.completed', 'order.refunded'],
  description: 'My webhook',
});

// Update (PATCH): only the fields you send change
const updated = await pocketsflow.webhooks.update('webhook_id', {
  events: ['order.completed', 'order.refunded', 'customer.subscription.created'],
  active: false, // pause deliveries
});

// Rotate the signing secret (takes effect immediately)
const rotated = await pocketsflow.webhooks.rotateSecret('webhook_id');
rotated.secret;

// Send a sample event to this endpoint and see the outcome
const result = await pocketsflow.webhooks.test('webhook_id');
result.delivered; // whether your endpoint answered 2xx
result.deliveryId;

// Delete an endpoint
await pocketsflow.webhooks.delete('webhook_id');
```

#### Delivery log

Every delivery attempt (including tests and redeliveries) is logged for 30 days:

```typescript
const { deliveredWebhooks, pagination } = await pocketsflow.webhooks.deliveries.list({
  webhookId: 'webhook_id', // optional
  event: 'order.completed', // optional
  pageSize: 100, // maximum 100
});

const delivery = await pocketsflow.webhooks.deliveries.get('delivery_id');
delivery.webhookData; // the exact body that was sent

// Replay a delivery your endpoint missed (same event id, freshly signed)
const redelivery = await pocketsflow.webhooks.deliveries.redeliver('delivery_id');
redelivery.delivered;
```

#### Verifying webhook signatures

Each delivery is a `POST` with a JSON body and these headers:

| Header | Value |
| --- | --- |
| `X-Pocketsflow-Event` | The event type, e.g. `order.completed` |
| `X-Pocketsflow-Event-Id` | The event id (`evt_...`), shared by retries — de-duplicate on it |
| `X-Pocketsflow-Signature-V2` | `t=<unix seconds>,v1=<hex HMAC-SHA256(secret, t + "." + rawBody)>` |
| `X-Pocketsflow-Signature` | Legacy: hex HMAC-SHA256(secret, rawBody) |

Verify `X-Pocketsflow-Signature-V2` against the **raw** request body, before
parsing JSON. `constructWebhookEvent` checks the signature in constant time,
rejects timestamps more than 300 seconds from now (replay protection), and
returns the parsed event:

```typescript
import express from 'express';
import { constructWebhookEvent, PocketsflowError } from 'pocketsflow';

const app = express();

app.post(
  '/webhooks/pocketsflow',
  express.raw({ type: 'application/json' }), // keep the raw bytes
  (req, res) => {
    let event;
    try {
      event = constructWebhookEvent(req.body, req.headers, process.env.POCKETSFLOW_WEBHOOK_SECRET!);
    } catch (err) {
      if (err instanceof PocketsflowError) return res.sendStatus(400);
      throw err;
    }

    // Retries share event.id (= X-Pocketsflow-Event-Id): handle each id once.
    switch (event.type) {
      case 'order.completed':
        // ...
        break;
    }
    res.sendStatus(200);
  }
);
```

Lower-level helpers:

```typescript
import {
  verifyWebhookSignature,
  verifyWebhookSignatureV1,
  generateWebhookSignatureHeader,
} from 'pocketsflow';

// V2: returns false for a missing, malformed, wrong or stale signature
verifyWebhookSignature(rawBody, req.headers['x-pocketsflow-signature-v2'], secret, {
  toleranceSeconds: 300, // default
});

// Legacy V1 (no timestamp, so no replay protection) still works
verifyWebhookSignatureV1(rawBody, req.headers['x-pocketsflow-signature'], secret);

// Build a valid V2 header to test your handler
const header = generateWebhookSignatureHeader(rawBody, secret);
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

// Tracking pixels: they fire on your product page, checkout and order
// confirmation. A malformed ID is rejected with 400; '' or null clears one.
await pocketsflow.users.update({
  facebookPixel: '123456789012345',
  googlePixel: 'G-ABC123XYZ9',
  googleTagManager: 'GTM-ABC1234',
  tiktokPixel: 'C4A1B2C3D4E5F6G7H8I9',
  redditPixel: 'a2_abc123def456',
  pinterestTag: null, // clear
});
```

Supported pixel fields: `facebookPixel`, `googlePixel`, `googleTagManager`,
`tiktokPixel`, `pinterestTag`, `snapchatPixel`, `twitterPixel`,
`twitterPurchaseEventId`, `linkedinPartnerId`, `linkedinConversionId`,
`redditPixel`, `microsoftUetTag`.

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

`productId` (a product or subscription offer) is the only required field.
Optional: `successUrl`, `cancelUrl`, `customerEmail` (+ `lockEmail: true` to
stop the buyer changing it), `discountCode`, and `clientReferenceId` /
`metadata`, which come back on the order and subscription webhook events.

### Refund Policies

`refunds` manages refund **policies**: the refund terms shown on your products'
checkout and product pages. (Refunding a payment is done from the dashboard.)

```typescript
const policy = await pocketsflow.refunds.create({
  name: '14-day guarantee',
  policy: 'Full refund within 14 days, no questions asked.',
  period: 14,
  periodType: 'days', // or 'weeks'
});

const policies = await pocketsflow.refunds.list(); // each has `appliedTo`
const one = await pocketsflow.refunds.get(policy._id);
await pocketsflow.refunds.update(policy._id, { period: 30 });
await pocketsflow.refunds.delete(policy._id);
```

### Images

Upload an image and use its hosted URL as a product `thumbnail`, in `images`,
or on your creator page. PNG, JPEG, WebP, GIF and AVIF are accepted. Needs
global `FormData` / `Blob` (Node 18+).

```typescript
import { readFile } from 'node:fs/promises';

const { imageUrl } = await pocketsflow.images.upload(await readFile('./cover.png'), {
  filename: 'cover.png',
  contentType: 'image/png',
});
// A Blob or File works too: pocketsflow.images.upload(file)
```

### Creator Page (Link in Bio)

One page per account:

```typescript
await pocketsflow.creatorPage.checkUsername('jane'); // throws 400 if taken
const page = await pocketsflow.creatorPage.create({
  username: 'jane',
  creatorName: 'Jane Doe',
  creatorBio: 'I make courses.',
  socialLinks: [{ name: 'instagram', url: 'https://instagram.com/jane' }],
  selectedProductIds: ['product_id'],
});

await pocketsflow.creatorPage.update({ template: 'template2' });
await pocketsflow.creatorPage.updateUsername('jane_doe');
const current = await pocketsflow.creatorPage.get();
await pocketsflow.creatorPage.delete();
```

### Partners (referral program)

```typescript
const partner = await pocketsflow.partners.create(); // needs a connected payout account
partner.referralCode;

const me = await pocketsflow.partners.get();
const stats = await pocketsflow.partners.stats(); // signups, sales, revenue, commission

// Paginated with page / limit (maximum 100)
const { data: referrals, pagination } = await pocketsflow.partners.listReferrals({ page: 1, limit: 50 });
const { data: sales } = await pocketsflow.partners.listReferralSales();

// Attribute your own (new) account to a partner's code
await pocketsflow.partners.registerReferral('REFCODE');
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
