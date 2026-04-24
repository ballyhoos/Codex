## Project Context (Read First)

This repository contains **Squirrl**, a local-only front-end SPA for tracking personal investments.

### What the app is

- Desktop-first single-page application (SPA)
- Pure front-end with no backend API and no server-side database
- User data is stored in browser **IndexedDB** only
- Tracks nested Markets and Investment records
- Supports filtering, local totals/growth views, JSON export/import, and full data wipe

### Technology (current)

- `Vite`
- `TypeScript`
- `Vanilla JS` (ES modules; no React/Vue)
- `idb` for IndexedDB access
- `Bootstrap 5` via CDN
- `DataTables` via jQuery plugin mode
- `ECharts` via CDN for charts/widgets

### Key product rules (do not break without explicit request)

1. Privacy/storage
- All investment, market, and settings data stays local in IndexedDB.
- No app data should be sent to a server.
- External network requests are limited to user-triggered spot-price lookups and CDN assets.

2. Record status flags
- Investment `active=false` means the record still exists but is excluded from totals/growth calculations.
- Investment `archived=true` means soft-hidden from normal views and excluded from totals.
- Market `active=false` is primarily a visual/status flag and does not automatically deactivate linked investments.
- Market `isArchived=true` means hidden by default.

3. Totals behavior
- Market totals and counts should exclude inactive or archived investment records.
- Market table totals should remain stable and should not collapse to zero just because the Investments table is filtered.
- Growth rows must respect current market hierarchy and roll child values into parents.

4. Filtering behavior
- Every visible data field/column in list/table views should be filterable unless explicitly excluded.
- Clicking a displayed value adds a filter chip.
- Filters are view-scoped (for example `categoriesList` vs `inventoryTable`).
- Filter combination semantics are `AND`.
- Default filters currently bias toward active records.

5. Delete behavior
- Markets and investments can now be hard-deleted from edit flows when explicitly requested by the user.
- Global wipe is still the destructive reset for clearing the whole app.
- When deleting a Market, linked investments may need to be unlinked rather than deleted.

### Data model summary (current)

`InventoryRecord` includes:
- `purchaseDate`
- `productName`
- `quantity`
- `totalPriceCents`
- `baselineValueCents`
- `unitPriceCents`
- `unitPriceSource`
- `categoryId`
- `active`
- `archived`
- timestamps and optional notes

`CategoryNode` includes:
- tree structure (`parentId`, `pathIds`, `pathNames`, `depth`, `sortOrder`)
- optional valuation metadata (`evaluationMode`, `spotValueCents`, `spotCode`)
- `active`
- `isArchived`
- timestamps

`settings` store includes key/value records such as:
- `currencyCode`
- `currencySymbol`
- `darkMode`
- `showMarketsGraphs`
- `showGrowthGraph`
- `alphaVantageApiKey`

### IndexedDB schema (current)

Database name: `investment_purchase_tracker`

Stores:
- `inventory`
- `categories`
- `settings`

Important indexes:
- inventory: `by_purchaseDate`, `by_productName`, `by_categoryId`, `by_active`, `by_archived`, `by_updatedAt`
- categories: `by_parentId`, `by_name`, `by_isArchived`

Notes:
- The legacy `purchases` store is still migrated into `inventory` if found.
- There is **no current `valuationSnapshots` store** in the live schema.

### Key files (current implementation)

- [src/main.ts](/Users/me/Work/AI/Codex/src/main.ts) - UI rendering, forms, actions, DataTables setup, charts, settings, import/export
- [src/db.ts](/Users/me/Work/AI/Codex/src/db.ts) - IndexedDB schema, migrations, CRUD, replace-all, wipe
- [src/types.ts](/Users/me/Work/AI/Codex/src/types.ts) - shared interfaces/types
- [src/filters.ts](/Users/me/Work/AI/Codex/src/filters.ts) - filter helpers and generic view filtering
- [src/totals.ts](/Users/me/Work/AI/Codex/src/totals.ts) - hierarchy/path/totals helpers
- [src/styles.css](/Users/me/Work/AI/Codex/src/styles.css) - theme, layout, DataTable, modal, and chart styles
- [index.html](/Users/me/Work/AI/Codex/index.html) - SEO/meta tags, CDN assets, favicon links, version token placeholders
- [vite.config.ts](/Users/me/Work/AI/Codex/vite.config.ts) - injects build version into HTML

### Change conventions for future AI edits

- Preserve the local-only architecture unless the user explicitly requests backend/networked changes.
- When adding a visible column to a list/table, update the corresponding `ColumnDef` metadata so it stays filterable.
- Keep the Actions column non-filterable and non-sortable unless explicitly requested.
- Prefer schema migrations/backfills in [src/db.ts](/Users/me/Work/AI/Codex/src/db.ts) over breaking existing local data.
- Keep import/export backward-compatible where reasonable.
- If changing totals or growth semantics, check whether the requested behavior should follow Market filters, Investment filters, or persist independently.
- The app branding is now `Squirrl`; do not revert to older “Investments” product naming unless explicitly requested.

### UI / DataTable conventions (current)

- Main sections are:
- `Growth`
- `Markets`
- `Investments`
- `Data Tools`

- `Markets` and `Investments` are Bootstrap-styled DataTables initialized in [src/main.ts](/Users/me/Work/AI/Codex/src/main.ts).
- DataTables currently run in `jQuery` plugin mode via CDN assets in [index.html](/Users/me/Work/AI/Codex/index.html). Do not remove jQuery unless DataTables is migrated and verified.
- App-level filter chips remain the source of truth. DataTables built-in search is disabled.
- DataTables controls (`Showing ... entries`, pagination) render below the table.
- Table wrappers do not use the old rounded bordered container around the table itself.
- Data tables use Bootstrap `table-striped`.
- Header background is a light green gradient and footer uses a medium-green summary style.
- Header sort icons are intentionally hidden.
- Column alignment rule: all columns are left-aligned except explicit numeric/right-aligned columns and the final Actions column.
- Only the final Actions column is right-aligned.
- Action links in tables are styled as links, not heavy buttons.
- Archived/inactive rows appear visually muted rather than danger-red.

- Filter display above tables:
- Inline breadcrumb-style path
- Prefix text is `Filter:`
- Chips are the interaction surface
- Clicking a chip removes that filter
- Chips may include an inline remove glyph
- Clear/reset actions sit inline at the right when present
- Pagination text and `Showing ... entries` text are styled down to match the filter-row text size

- Growth section:
- Uses a custom table, not the jQuery DataTable instance
- Supports expandable parent/child rows
- Shows Market-level rollups with child rows beneath
- Child arrows use the same green secondary color family as Market hierarchy arrows
- Includes chart widgets when enabled in settings
- Filter label reflects current Markets filter scope

- Markets section:
- Shows nested Markets inline in the table
- Child rows are shown inline rather than hidden behind an expander
- Spot refresh actions appear only for Spot markets with code + API key
- Charts in the section are optional via settings

- Investments section:
- Is collapsible
- Uses a modal for create/edit
- Market selection is optional in some flows
- Visible Market column supports subtree filtering

- Data Tools section:
- Is collapsible
- Shows storage usage text at top
- Contains Export, Import, and Delete Data blocks

### Table theming details (project-specific)

- Table headers use a light green gradient background.
- Table footers use a medium-green summary background.
- Secondary muted table-adjacent text uses the project green palette instead of neutral grey.
- Section headings and primary buttons are coordinated around the shared primary green token.
- Row action controls are link-styled rather than filled action buttons.

### Settings flags affecting table/chart sections

- `showMarketsGraphs` defaults to `true`
- `showGrowthGraph` defaults to `false`

Both values are persisted in the settings store and control optional chart blocks in the relevant sections.

### Build/versioning notes

- Build version is injected into HTML using `__APP_BUILD_VERSION__`.
- The visible app version is read from the HTML meta tag, not from `package.json`.
- Cache busting is done by appending the build version to CDN asset URLs.
- The version format is currently `YYMMDD-HHMM`.

### Reuse guidance

- Keep this file project-specific and factual.
- If you want a reusable guide across repos, move generic rules into a separate template file and keep `AGENTS.md` focused on this app’s current behavior.
- Reusable DataTables guidance for other projects lives in [Datatables-Core.md](/Users/me/Work/AI/Codex/Datatables-Core.md).
