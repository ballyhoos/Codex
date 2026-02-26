import type { ColumnDef, FilterClause, ViewId } from "./types";

function isEmptyValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

export function addFilter(filters: FilterClause[], next: Omit<FilterClause, "id">): FilterClause[] {
  const exists = filters.some(
    (f) =>
      f.viewId === next.viewId &&
      f.field === next.field &&
      f.op === next.op &&
      f.value === next.value,
  );
  if (exists) return filters;
  return [...filters, { ...next, id: crypto.randomUUID() }];
}

export function removeFilter(filters: FilterClause[], id: string): FilterClause[] {
  const idsToRemove = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const filter of filters) {
      if (filter.linkedToFilterId && idsToRemove.has(filter.linkedToFilterId) && !idsToRemove.has(filter.id)) {
        idsToRemove.add(filter.id);
        changed = true;
      }
    }
  }
  return filters.filter((f) => !idsToRemove.has(f.id));
}

export function clearFilters(filters: FilterClause[], viewId: ViewId): FilterClause[] {
  return filters.filter((f) => f.viewId !== viewId);
}

export function applyViewFilters<Row>(
  rows: Row[],
  filters: FilterClause[],
  viewId: ViewId,
  columns: ColumnDef<Row>[],
  ctx?: { categoryDescendantsMap?: Map<string, Set<string>> },
): Row[] {
  const activeFilters = filters.filter((f) => f.viewId === viewId);
  if (!activeFilters.length) return rows;

  const colMap = new Map(columns.map((c) => [c.key, c]));

  return rows.filter((row) =>
    activeFilters.every((f) => {
      const col = colMap.get(f.field);
      if (!col) return true;
      const raw = col.getValue(row);

      if (f.op === "eq") return String(raw) === f.value;
      if (f.op === "isEmpty") return isEmptyValue(raw);
      if (f.op === "isNotEmpty") return !isEmptyValue(raw);
      if (f.op === "contains") {
        return String(raw).toLowerCase().includes(f.value.toLowerCase());
      }
      if (f.op === "inCategorySubtree") {
        const allowed = ctx?.categoryDescendantsMap?.get(f.value) || new Set([f.value]);
        const rowValue = String(raw);
        return allowed.has(rowValue);
      }
      return true;
    }),
  );
}
