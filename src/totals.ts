import type { CategoryNode, InventoryRecord } from "./types";

export function buildCategoryMaps(categories: CategoryNode[]) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const children = new Map<string | null, CategoryNode[]>();
  for (const c of categories) {
    const arr = children.get(c.parentId) || [];
    arr.push(c);
    children.set(c.parentId, arr);
  }
  return { byId, children };
}

export function buildDescendantMap(categories: CategoryNode[]) {
  const { children } = buildCategoryMaps(categories);
  const result = new Map<string, Set<string>>();

  function dfs(id: string): Set<string> {
    const set = new Set<string>([id]);
    for (const child of children.get(id) || []) {
      for (const x of dfs(child.id)) set.add(x);
    }
    result.set(id, set);
    return set;
  }

  for (const c of categories) {
    if (!result.has(c.id)) dfs(c.id);
  }
  return result;
}

export function recomputeCategoryPaths(categories: CategoryNode[]): CategoryNode[] {
  const byId = new Map(categories.map((c) => [c.id, c]));

  function buildPath(node: CategoryNode): { ids: string[]; names: string[]; depth: number } {
    const ids: string[] = [];
    const names: string[] = [];
    const seen = new Set<string>();
    let current: CategoryNode | undefined = node;
    while (current) {
      if (seen.has(current.id)) break;
      seen.add(current.id);
      ids.unshift(current.id);
      names.unshift(current.name);
      current = current.parentId ? byId.get(current.parentId) : undefined;
    }
    return { ids, names, depth: Math.max(0, ids.length - 1) };
  }

  return categories.map((c) => {
    const path = buildPath(c);
    return { ...c, pathIds: path.ids, pathNames: path.names, depth: path.depth };
  });
}

export function collectSubtreeIds(categories: CategoryNode[], rootId: string): string[] {
  const descendants = buildDescendantMap(categories);
  return [...(descendants.get(rootId) || new Set([rootId]))];
}

export function computeCategoryTotals(
  filteredActiveNonArchivedInventoryRecords: InventoryRecord[],
  categories: CategoryNode[],
): Map<string, number> {
  const descendants = buildDescendantMap(categories);
  const totals = new Map<string, number>();

  for (const c of categories) {
    const subtree = descendants.get(c.id) || new Set([c.id]);
    let sum = 0;
    for (const p of filteredActiveNonArchivedInventoryRecords) {
      if (subtree.has(p.categoryId)) sum += p.totalPriceCents;
    }
    totals.set(c.id, sum);
  }
  return totals;
}
