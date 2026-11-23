# Changelog

## 3.9.0

### Added

- `variantId` on `CreateCheckoutParams` (`checkout.create()`, `POST
  /checkout/sessions`): open the checkout on one of a product's variants.
  Optional; leave it out for a product without variants. The API answers
  `404` `VARIANT_NOT_FOUND` when the variant isn't that product's, and `400`
  on a subscription offer.

### Changed

- `creatorServices.createDisputeHelp()` (`POST /creator-services/dispute-help`)
  works on every plan, Free included: the API no longer answers `403
  FEATURE_LOCKED` below Pro. On plans with priority support (Pro and above)
  the request is answered first (`priority: true`). Docs only: no signature
  change.

## 3.8.0

### Added

- `subscribers.upgradeQuote(id, subscriptionId)` (`GET
  /subscriptions/{id}/upgrade-quote`): what moving a subscriber to another
  subscription offer would charge now, the new price minus `credit` for the
  unused part of the current period. Charges nothing.
- `subscribers.upgrade(id, { subscriptionId, idempotencyKey })` (`POST
  /subscriptions/{id}/upgrade`): move a subscriber to another offer now,
  charging the prorated amount on their saved card with no checkout page.
  `idempotencyKey` is also sent as the `Idempotency-Key` header, so a retry
  never charges twice. Resolves with `status` `succeeded` or `processing`; a
  decline throws a `402` `PocketsflowError`.
- `credits`, a new resource for prepaid balances on `credits` products:
  `credits.listAccounts({ productId?, status? })` (`GET /credits/accounts`),
  `credits.getAccount(id)` (`GET /credits/accounts/{id}`),
  `credits.deduct({ accountId, amountCents, reason? })` (`POST
  /credits/deduct`: record usage; emptying the balance runs one auto-refill
  when the buyer opted in, returned as `refill`) and `credits.topUp(id, {
  amountCents, idempotencyKey, reason? })` (`POST
  /credits/accounts/{id}/charge`: charge the buyer's saved card for a top-up,
  $0.50 to $10,000, `idempotencyKey` also sent as the `Idempotency-Key`
  header).
- `migrations.publishReview(id)` (`GET /migrations/{id}/publish`) and
  `migrations.publish(id, productIds)` (`POST /migrations/{id}/publish`,
  1-200 ids): review every product an import created (`published`, `ready`
  or `needs_fix` with its `issues`) and publish them, one result per product
  (`published`, `already_published`, `needs_fix` or `error` with a `code`).
- `maxRedemptions` (1-1,000,000, `null` = unlimited) on `Discount`,
  `CreateDiscountParams` and `UpdateDiscountParams`: cap how many checkouts
  can use a regular code (`1` makes a one-use code). Not allowed with
  `uniquePerRecipient: true` or on a discount that targets a subscription
  offer. `discounts.get()` now also returns `used`.
- Webhook events `subscription.upgraded`, `subscription.upgrade_failed`,
  `credit.top_up.succeeded` and `credit.top_up.failed` in `WEBHOOK_EVENTS`.
- New types: `SubscriptionUpgradeQuote`, `UpgradeSubscriptionParams`,
  `SubscriptionUpgradeStatus`, `SubscriptionUpgrade`, `CreditAccountStatus`,
  `CreditAccount`, `ListCreditAccountsParams`, `DeductCreditsParams`,
  `CreditRefillAttempt`, `DeductCreditsResult`, `ChargeCreditTopUpParams`,
  `CreditTopUpStatus`, `CreditTopUpResult`, `MigrationProductState`,
  `MigrationPublishIssue`, `MigrationPublishReviewRow`,
  `MigrationPublishReview`, `MigrationPublishRowStatus`,
  `MigrationPublishErrorCode`, `MigrationPublishRowResult`,
  `MigrationPublishResult`.

### Changed

- `discounts.apply()` documents the redemption-cap answers: a used-up code
  throws `410` with `code` `DISCOUNT_USED_UP`, and `409` `DISCOUNT_IN_USE`
  means its last uses are held by other open checkouts (pass the checkout's
  own `reservation` so its hold doesn't count), next to the one-time code
  errors.
- Unique coupons (`uniquePerRecipient`, `discounts.createUniqueCodes()`) and
  "Buy more, save more" (`tieredDiscounts`) are on every plan, so they no
  longer throw `FeatureLockedError`; docs updated. Bundles stay on Growth.
- Migrations are on every plan, including Free (docs said Volume).
- `test/fixtures/public-api.json` refreshed from the production spec (356
  operations, 50 webhook events).

## 3.7.0

### Added

- `licenses.import(keys)` (`POST /licenses/import`): import license keys you
  sold on another platform, up to 1,000 per call, so your buyers keep the
  keys they have. Each key keeps its exact text (any format), its activation
  limit (`null` = unlimited; omitted = the product's current limit) and the
  devices it is already activated on (`activations`), and is created in the
  API key's mode. Every row gets its own result: `created`, `exists` (already
  imported on the same product, left as it is, so a re-run is safe) or
  `error` with the reason. New types: `ImportLicenseKeyParams`,
  `ImportLicenseKeyResult`, `ImportLicenseKeysResponse`.
- `LicenseKey.source` (`sale` | `import`), `LicenseKey.importedOrderId` and
  `LicenseKey.customerId`. `LicenseKey.orderId` is `null` for an imported key.

### Changed

- The public license endpoints match an imported key by its exact text first,
  then the forgiving form (case, spaces, dashes) for keys issued by
  Pocketsflow. Doc comments updated.

## 3.6.0

### Added

- `penny.decide(params)` (`POST /v1/penny/decide`): ask Pocketsflow Penny 1,
  the decision model, one typed question about a situation (`choice`,
  `yes_no` or `score`) and get the answer with a calibrated `confidence`,
  per-answer `probs`, `auto` (safe to act without a person) and `usage`.
  `options` (2-8) is required for `choice` and not allowed otherwise. 1,000
  free decisions per account per calendar month (UTC), then prepaid credits;
  a `402` `penny_credits_exhausted` throws a `PocketsflowError` whose
  `body.buy_url` links to more credits. API keys only.
- `penny.usage()` (`GET /v1/penny/usage`): free decisions used and left this
  month, credits left and a checkout link for more.
- New types: `PennyDecisionType`, `PennyChoiceParams`, `PennyYesNoParams`,
  `PennyScoreParams`, `PennyDecideParams`, `PennyUsageSummary`,
  `PennyDecision`, `PennyUsage`.

## 3.5.0

### Added

- `payouts` (read only): `payouts.status()` (`GET /payouts/status`: whether
  payouts are active, and if not why and what to do, with `actionUrl`),
  `payouts.balance()` (`GET /payouts/balances`), `payouts.list({ status?,
  limit? })` (`GET /payouts`) and `payouts.get(id)` (`GET /payouts/{id}`).
  Withdrawing money stays in the dashboard. New types: `Payout`,
  `PayoutStatusValue`, `PayoutStatus`, `PayoutAccountState`, `PayoutBalance`,
  `PayoutBalancePot`, `ListPayoutsParams`, `PayoutsResponse`.
- `orders.list({ status?, search? })`: filter by `paid`, `refunded`,
  `disputed` or `failed` (declined payments) and search by buyer email, like
  the dashboard's Orders page. Every order now carries `status`
  (`OrderStatus`).
- `orders.paymentDetails(id)` (`GET /orders/{id}/payment-details`) and
  `orders.journey(id)` (`GET /orders/{id}/journey`). New types:
  `OrderPaymentDetails`, `OrderPaymentFee`, `OrderJourney`.
- Webhook events `payout.created` and `payout.updated` in `WEBHOOK_EVENTS`.

## 3.4.0

### Added

- `users.updateSellingProfile({ sellingPath?, sellingPathOther?, sellingSetup? })`
  (`PUT /users/selling-profile`): record what the creator sells
  (`digital`, `membership`, `software` or `other`) and where buyers pay
  (`pages`: Pocketsflow creator and product pages; `code`: their own site or
  app). `null` clears an answer. New types: `SellingPath`, `SellingSetup`,
  `SellingProfile`, `UpdateSellingProfileParams`.
- `User.sellingPath`, `User.sellingPathOther` and `User.sellingSetup` on
  `users.me()`: the creator's onboarding answers (`null` when skipped).

## 3.3.0

### Added

- `pageTheme` and `checkoutTheme` (`"light" | "dark" | "system"`) on
  subscription offer create params: how the product page and checkout look
  to buyers when they use no template. `system` follows the buyer's device;
  the default is `light`. New type: `BuyerThemeMode`.

## 3.2.0

### Added

- `search.query(q, { types?, limit? })`: global search (⌘K) across orders,
  customers, products, subscribers and discounts, grouped by type
  (`GET /search`, every plan, 120 searches per minute per account). `types`
  is sent comma-separated; `limit` is hits per type (1-20, default 5). New
  types: `SearchType`, `SearchParams`, `SearchHit`, `SearchGroup` and
  `SearchResponse` (also exported as `SearchResults`). A `400` (missing `q`,
  unknown type), `404` or `429` throws a `PocketsflowError` with that
  `status`.
- The rest of the upgrade playbook (Phases 2-5) shipped earlier in this
  release; see the git history.
