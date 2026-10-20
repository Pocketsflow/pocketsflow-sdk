# Changelog

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
