## Project Context (Read First)

This repository contains a **local-only front-end SPA** for tracking purchases of investment products.

### What the app is

- Desktop-first single-page application (SPA)
- Pure front-end (no backend API, no server-side DB)
- User data is stored in browser **IndexedDB** only
- Supports categories/subcategories, purchases, filtering, export/import, and full data wipe

### Technology (current)

- `Vite`
- `TypeScript`
- `Vanilla JS` (ES modules; no React/Vue)
- `idb` for IndexedDB access

### Key product rules (do not break without explicit request)

1. Privacy/storage
- All purchase/category/settings data stays local in IndexedDB.
- No app data should be sent to a server.

2. Purchase status flags
- `active=false` means record exists but is excluded from totals.
- `archived=true` means soft-deleted/hidden by default.

3. Totals behavior
- Category totals must reflect the **current purchase-table filters**.
- Totals must exclude purchases that are inactive or archived.

4. Filtering behavior
- Every visible data field/column in list/table views should be filterable.
- Clicking a displayed value adds a filter chip.
- Filters are view-scoped (e.g., purchases table vs categories list).
- Filter combination semantics are `AND`.

5. Delete behavior
- Normal record deletion is handled via archive/restore (soft delete).
- Hard delete is reserved for the explicit global “wipe all data” action.

### Data model summary (current)

`PurchaseRecord` includes:
- pricing fields (`totalPriceCents`, `unitPriceCents`)
- `categoryId`
- `active`
- `archived`
- timestamps

`CategoryNode` includes:
- tree structure (`parentId`, `pathIds`, `pathNames`, `depth`)
- `isArchived`
- timestamps

`settings` store includes key/value records (currently app-wide `currencyCode`)

### IndexedDB schema (current)

Database name: `investment_purchase_tracker`

Stores:
- `purchases`
- `categories`
- `settings`

Important indexes:
- purchases: `by_purchaseDate`, `by_productName`, `by_categoryId`, `by_active`, `by_archived`, `by_updatedAt`
- categories: `by_parentId`, `by_name`, `by_isArchived`

### Key files (current implementation)

- `/Users/me/Work/AI/Codex/src/main.ts` - UI rendering, form handling, actions, import/export/wipe
- `/Users/me/Work/AI/Codex/src/db.ts` - IndexedDB schema + CRUD + replace-all/wipe
- `/Users/me/Work/AI/Codex/src/types.ts` - shared interfaces/types
- `/Users/me/Work/AI/Codex/src/filters.ts` - filter helpers and generic view filtering
- `/Users/me/Work/AI/Codex/src/totals.ts` - category descendants/path/totals logic
- `/Users/me/Work/AI/Codex/src/styles.css` - styles

### Change conventions for future AI edits

- Preserve local-only architecture unless the user explicitly requests backend/networked changes.
- When adding a visible column to a list/table, update the table `ColumnDef` metadata so it is filterable.
- Keep action columns (`Edit`, `Archive`, etc.) non-filterable unless explicitly requested.
- If changing totals behavior, confirm whether totals should still reflect current purchase filters.
- Prefer schema migrations/backfills in `src/db.ts` over breaking old local data.
- Keep import/export backward-compatible when possible (default missing flags like `active`, `archived`, `isArchived`).

## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for full instructions when using a specific skill.
### Available skills
- skill-creator: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Codex's capabilities with specialized knowledge, workflows, or tool integrations. (file: /Users/me/.codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Install Codex skills into $CODEX_HOME/skills from a curated list or a GitHub repo path. Use when a user asks to list installable skills, install a curated skill, or install a skill from another repo (including private repos). (file: /Users/me/.codex/skills/.system/skill-installer/SKILL.md)
### How to use skills
- Discovery: The list above is the skills available in this session (name + description + file path). Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill isn't in the list or the path can't be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow.
  2) When `SKILL.md` references relative paths (e.g., `scripts/foo.py`), resolve them relative to the skill directory listed above first, and only consider other paths if needed.
  3) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; don't bulk-load everything.
  4) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  5) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  - If multiple skills apply, choose the minimal set that covers the request and state the order you'll use them.
  - Announce which skill(s) you're using and why (one short line). If you skip an obvious skill, say why.
- Context hygiene:
  - Keep context small: summarize long sections instead of pasting them; only load extra files when needed.
  - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless you're blocked.
  - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice.
- Safety and fallback: If a skill can't be applied cleanly (missing files, unclear instructions), state the issue, pick the next-best approach, and continue.
