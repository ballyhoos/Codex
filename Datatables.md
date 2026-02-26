# DataTables UI Pattern (Reusable Spec)

This document describes the current DataTable-based list-section pattern used in this app so it can be reproduced in other websites/modules.

## Purpose

Use this pattern for list views that need:

- client-side sorting/paging
- app-controlled filtering (not DataTables search)
- Bootstrap styling
- consistent action-column behavior

## Stack / Integration

- Framework style: `Vanilla JS` + `TypeScript` (works in Vite SPA)
- Styling: `Bootstrap 5`
- Data grid enhancement: `DataTables`
- Current runtime mode in this app: `jQuery` plugin mode (`jQuery(...).DataTable()`)

Important:

- DataTables built-in search is disabled.
- App-level filters remain the source of truth.

## Script / CSS loading (current pattern)

Current app uses CDN scripts in `/Users/me/Work/AI/Codex/index.html`:

- Bootstrap CSS/JS
- jQuery
- DataTables core JS
- DataTables Bootstrap 5 integration JS/CSS

If you reproduce this elsewhere:

- load `jQuery` before DataTables JS (for jQuery plugin builds)
- verify `window.jQuery` exists before DataTables init

## Section Layout Pattern

Each DataTable section (e.g., Purchases / Categories) is structured as:

1. Section header row (`title` + local controls like "Show archived")
2. Inline filter breadcrumb row
3. DataTable
4. DataTables controls row (below table)

## Filter Row Pattern (App-level filters)

Filters are rendered above the DataTable as a lightweight inline breadcrumb path.

Rules:

- Prefix text: `Filter:`
- Divider: `>`
- No large boxed container around filters
- Clicking a crumb removes that specific filter
- `Clear Filter` button appears on the same row, right-aligned

This filter row is app logic, not DataTables search.

## DataTables Controls Placement

The row containing:

- `Showing X to Y of Z entries`
- `entries per page`
- pagination

must render **below** the table.

Current placement order:

- left: info (`Showing...`)
- center: page length (`entries per page`)
- right: pagination

## Table Styling Conventions

- Use Bootstrap `table-striped`
- Use Bootstrap table styling generally (`table`, `table-sm`, etc.)
- Do not wrap the DataTable in an extra rounded/bordered box frame
- DataTables header background should be visually styled (light background)
- Sticky headers are disabled for DataTables tables (sorting interaction compatibility)

## Column Alignment Conventions

Strict alignment rule:

- All columns are left-aligned (headers and body cells)
- Only the final `Actions` column is right-aligned

Why:

- DataTables may auto-right-align numeric columns; this app intentionally overrides that behavior for consistency.

## Actions Column Conventions

Actions column requirements:

- Final column only
- Non-sortable
- Header text visually blank (keep accessibility label, e.g. `aria-label="Actions"`)
- Header cell right-aligned
- Body cell right-aligned
- Row action buttons aligned right within the cell
- DataTable row actions are currently `Edit` only (record state changes are handled in edit modals)

Implementation note:

- Keep the `<td>` as a normal table cell (not `display:flex`)
- Put a wrapper inside the `<td>` (e.g. `.actions-cell`) and apply flex/right alignment to that inner wrapper
- This avoids breaking DataTables/table layout alignment

## Action Button Sizing (Shared Custom Size)

Action buttons (top action menu + table row action buttons) use a shared custom size class.

Current class: `action-menu-btn`

Current behavior:

- smaller than Bootstrap `btn-sm`
- uses custom Bootstrap button CSS variables for padding/font-size/radius

## Archived Row Styling

Archived records should be visually de-emphasized:

- neutral gray / grayed out appearance
- not danger/red tinted

This is applied at the row level.

## Purchases Table Specific Conventions (Current)

Visible purchase columns are ordered so that:

- `Name` is first
- `Date` appears immediately before the `Actions` column
- visible `Archived` column is removed

Archived state is communicated by row styling (grayed out), not a visible archived column.

Purchase modal action conventions (current):

- Edit modal includes `Archive Record` / `Restore Record` as a left-aligned modal footer action
- Archive requires confirmation
- `Disable/Enable` row button is removed from DataTable rows
- `Disable/Enable` modal button has also been removed (activity is edited via the `Active` checkbox field)

## Categories Table Specific Conventions (Current)

- Category totals are shown as a dedicated `Total` column
- `Total` appears before `Actions`
- Total column remains filterable (through app-level column metadata/filter logic)
- Visible `Archived` column is removed
- Visible `Active` column is present (derived from `!isArchived`)
- Category edit modal includes `Archive Record` / `Restore Record` (archive subtree behavior under the hood) as a left-aligned modal footer action
- Archive requires confirmation

## Sorting Behavior

- Header sorting is enabled
- `Actions` column is non-sortable
- App may include a fallback header click handler that calls DataTables API directly if built-in header sorting hooks fail in a given environment
- A runtime status/debug line may be shown in the page header (`Table Status: ...`) to indicate whether DataTables JS is loaded/active

## Filtering vs Sorting Responsibilities

Keep responsibilities separate:

- App filter UI + logic:
  - filter chips/breadcrumbs
  - view-scoped filters
  - filter semantics (`AND`)
  - totals calculation inputs
- DataTables:
  - sorting
  - paging
  - page length controls
  - table control rendering

Do not enable DataTables search unless product requirements are changed.

## Reproduction Checklist (for another site/module)

1. Add Bootstrap 5 styles and JS
2. Add DataTables + Bootstrap 5 integration (and jQuery if using jQuery build)
3. Render table section with:
   - title row
   - inline filter breadcrumb row
   - table
4. Initialize DataTables with:
   - sorting enabled
   - search disabled
   - actions column non-sortable
   - controls row placed below table
5. Apply alignment overrides:
   - all left
   - last Actions column right
6. Use inner wrapper for action buttons (avoid flex on `<td>`)
7. Apply shared small action button size class
8. Gray out archived rows
9. Verify header sorting still works after CSS changes

## Where this is implemented in this repo

- `/Users/me/Work/AI/Codex/src/main.ts`
  - section rendering
  - column metadata
  - DataTables initialization
  - filter breadcrumb rendering
- `/Users/me/Work/AI/Codex/src/styles.css`
  - table layout/alignment overrides
  - header background styling
  - filter breadcrumb styling
  - action button sizing class
- `/Users/me/Work/AI/Codex/index.html`
  - Bootstrap / jQuery / DataTables CDN assets

## Notes for Future Migration (Optional)

If migrating away from jQuery DataTables:

- prefer a locally bundled, vanilla-compatible library
- preserve the same UI/behavior conventions from this spec
- keep app-level filters as the source of truth
