# DataTables Core Pattern (Reusable)

This spec is intentionally project-agnostic so it can be reused across websites/modules.

## Purpose

Use this pattern for list views that need:

- client-side sorting and paging
- app-controlled filtering
- consistent action-column behavior
- Bootstrap-compatible table styling

## Core Architecture

- Filtering logic belongs to app state (source of truth).
- DataTables handles only table mechanics (sort, page, control rendering).
- Keep filtering and sorting responsibilities separate.

## Required Stack (Baseline)

- DataTables
- Bootstrap table styles
- jQuery only if using DataTables jQuery plugin build

If using plugin mode:

- load jQuery before DataTables JS
- verify jQuery exists before DataTables init

## Section Layout Contract

Each table section should render in this order:

1. Section header row (title + local controls)
2. Inline filter breadcrumb row
3. Table
4. DataTables controls row below table

## Filter Row Contract

- Prefix: `Filter:`
- Divider: `>`
- Inline breadcrumb style (no large boxed wrapper)
- Clicking a crumb removes that specific filter
- Each crumb may include an inline remove glyph if the project style calls for it
- Optional right-aligned contextual action may appear on the same row

Filter row is app UI logic, not DataTables search.

## DataTables Behavior Contract

- search disabled
- sorting enabled
- first visible column default sort ascending
- actions column non-sortable
- controls row rendered below the table
- pagination/info sizing can be styled to match filter-row text size

## Column Alignment Contract

- all columns left-aligned by default
- money/currency columns right-aligned
- numeric-but-not-currency columns may be centered if the project chooses
- final actions column right-aligned

Implementation rule:

- use column metadata (`align`) instead of positional CSS assumptions
- apply alignment classes to both `th` and `td`
- ensure inner clickable content inherits alignment

## Actions Column Contract

- always last column
- header visually blank, keep accessible label
- non-sortable
- right-aligned header and cells
- button group right-aligned within an inner wrapper

Implementation note:

- avoid `display:flex` on table cells
- use an inner wrapper for button layout

## Footer Totals Contract

When grand totals are required:

- render totals in `<tfoot>` (not above the table)
- apply shared summary styling across all tables
- use the footer for section totals, not an extra summary block above the table, unless the product explicitly needs both

## Row State Styling Contract

- archived/inactive rows should be visually de-emphasized
- use neutral grayscale emphasis, avoid destructive color semantics by default

## Visual Theming Contract

- header background, footer background, chip styling, and pagination may be themed, but should remain consistent across list sections
- if themed colors are introduced, define them as reusable CSS tokens rather than one-off values
- table visuals should still preserve legibility, especially for sortable headers, muted rows, and numeric totals

## Reproduction Checklist

1. Add Bootstrap styles and DataTables assets.
2. Render section in standard order: header, filters, table, controls.
3. Initialize DataTables with search disabled and sorting enabled.
4. Set default sort to first column ascending.
5. Mark actions column non-sortable.
6. Force control row placement below table.
7. Apply alignment rules (default left, money right, actions right).
8. Use inner wrapper for actions button layout.
9. Add archived/inactive row de-emphasis style.
10. If totals needed, render `<tfoot>` summary row.
11. If custom theming is used, apply it through shared tokens across headers, footers, chips, and controls.

## Migration Guidance

If migrating away from jQuery DataTables:

- keep the same UI contracts
- preserve app-level filtering as source of truth
- keep alignment/actions/footer conventions unchanged
