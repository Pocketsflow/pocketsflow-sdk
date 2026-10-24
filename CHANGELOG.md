# Changelog

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
