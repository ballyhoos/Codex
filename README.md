# Squirrl (Local-Only SPA)

Pure front-end web app for tracking personal investments.

All user data is stored locally in the browser using IndexedDB. There is no backend, no server-side database, and no API for app data.

## Current Tech Stack

- `Vite`
- `TypeScript`
- `Vanilla JS` (ES modules, no framework)
- `idb` (small IndexedDB wrapper library)
- Native browser APIs (`Intl`, `Blob`, `URL.createObjectURL`)

## Product Summary

The app allows users to:

- Create and manage nested markets
- Record investments with pricing, quantity, and baseline values
- Mark investments as `active` or `inactive`
- Soft-hide records via `archived` flags while keeping them stored locally
- View markets and investments in filterable table/list views
- Click displayed data values to add view-scoped filter chips
- See market totals that exclude inactive or archived investment records
- View market-scoped growth reporting based on current hierarchy and baseline values
- Export/import JSON backups
- Wipe all local IndexedDB data (explicit destructive action)

## Core Business Rules (Important)

### Local storage/privacy

- Data is stored only in IndexedDB on the user's machine.
- No purchase/category data is sent to any backend.

### Investment flags

- `active = false`: record exists but does **not** count toward totals/growth
- `archived = true`: soft-hidden/hidden by default in list views

### Totals semantics

Market totals:

- Exclude inactive or archived investment records
- Remain stable and do not collapse just because the Investments table is filtered

### Filtering semantics

- All visible data columns in each list/table view are filterable.
- Clicking a displayed value creates a breadcrumb/chip filter.
- Multiple filters use `AND`.
- Filters are view-scoped (`inventoryTable` vs `categoriesList`).

## Data Model (Current)

### `InventoryRecord`

- `id`
- `purchaseDate` (`YYYY-MM-DD`)
- `productName`
- `quantity`
- `totalPriceCents`
- `unitPriceCents` (optional; can be derived)
- `unitPriceSource` (`entered` | `derived`)
- `categoryId`
- `active`
- `archived`
- `archivedAt?`
- `notes?`
- `createdAt`
- `updatedAt`

### `CategoryNode`

- `id`
- `name`
- `parentId`
- `pathIds`
- `pathNames`
- `depth`
- `sortOrder`
- `evaluationMode?` (`spot` | `snapshot`)
- `spotValueCents?`
- `spotCode?`
- `active`
- `isArchived`
- `archivedAt?`
- `createdAt`
- `updatedAt`

### `settings`

- key/value records such as `currencyCode`, `currencySymbol`, `darkMode`, `showMarketsGraphs`, and `alphaVantageApiKey`

## IndexedDB Schema

Database name: `investment_purchase_tracker`

Object stores:

- `inventory`
- `categories`
- `settings`

Indexes:

- `inventory`: `by_purchaseDate`, `by_productName`, `by_categoryId`, `by_active`, `by_archived`, `by_updatedAt`
- `categories`: `by_parentId`, `by_name`, `by_isArchived`

## Project Structure (Current)

- `/Users/me/Work/AI/Codex/src/main.ts`: SPA rendering, event handling, forms, tables, import/export/wipe actions
- `/Users/me/Work/AI/Codex/src/db.ts`: IndexedDB init/schema/CRUD and replace-all/wipe helpers
- `/Users/me/Work/AI/Codex/src/types.ts`: shared TypeScript types/interfaces
- `/Users/me/Work/AI/Codex/src/filters.ts`: generic metadata-driven filtering and filter chip helpers
- `/Users/me/Work/AI/Codex/src/totals.ts`: category tree traversal, descendants, totals
- `/Users/me/Work/AI/Codex/src/styles.css`: UI styling

## Development Notes For Future Changes

- Keep the app backend-free and local-only unless explicitly requested.
- Keep the Squirrl branding rather than older “Investments” naming.
- Individual records can now be hard-deleted from edit flows when explicitly requested.
- When adding new visible data columns to any list/table, make them filterable via `ColumnDef` metadata unless they are action columns.
- Preserve totals semantics unless product requirements change.
- For schema changes, update IndexedDB version and add migration/backfill logic in `src/db.ts`.
- Keep exports/imports backward-compatible where practical (default missing flags like `active`/`archived`).

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
