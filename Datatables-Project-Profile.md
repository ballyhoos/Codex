# DataTables Project Profile (Investments App)

This document captures domain-specific choices for this repository.

## Scope

Project: `/Users/me/Work/AI/Codex`

Primary list sections:

- Markets
- Investments
- Growth Report table (styled to match DataTables conventions)

## Current Runtime Integration

- Vanilla JS + TypeScript (Vite SPA)
- Bootstrap 5 styling
- DataTables in jQuery plugin mode
- DataTables built-in search disabled

## Current UI Decisions

- DataTables controls render below each table.
- Filter row uses inline breadcrumb pattern with `Filter:` prefix and `>` divider.
- Filter chips are app-driven and view-scoped.
- ESC key (section-hover scoped) removes latest filter crumb when modal is not open.
- Create buttons are section-scoped.

## Column / Actions Rules in This App

- Default left alignment for most columns.
- Currency columns right-aligned.
- Final actions column right-aligned and non-sortable.
- Row action controls are link-styled action buttons.

## Table-Specific Decisions

### Markets

- hierarchical display in table
- parent/child visual treatment in first column
- charts in section are optional via settings

### Investments

- archived records de-emphasized
- create/edit through modal flows

### Growth Report

- nested parent/child rows
- totals shown in table footer
- growth chart optional via settings

## Settings Flags Affecting Table Sections

- `showMarketsGraphs` (default `false`)
- `showGrowthGraph` (default `false`)

Both are persisted in settings store and toggle chart blocks in the relevant sections.

## File Mapping

- `/Users/me/Work/AI/Codex/src/main.ts`
  - section rendering
  - DataTables initialization and behavior
  - filter chip rendering and actions column behavior
- `/Users/me/Work/AI/Codex/src/styles.css`
  - table alignment overrides
  - filter breadcrumb styling
  - action cell/button styling
- `/Users/me/Work/AI/Codex/index.html`
  - CDN assets for Bootstrap, jQuery, DataTables
