# Changelog

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
