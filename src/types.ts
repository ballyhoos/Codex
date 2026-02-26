export type ViewId = "purchasesTable" | "categoriesList";

export interface PurchaseRecord {
  id: string;
  purchaseDate: string; // YYYY-MM-DD
  productName: string;
  quantity: number;
  totalPriceCents: number;
  unitPriceCents?: number;
  unitPriceSource: "entered" | "derived";
  categoryId: string;
  active: boolean;
  archived: boolean;
  archivedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  parentId: string | null;
  pathIds: string[];
  pathNames: string[];
  depth: number;
  sortOrder: number;
  isArchived: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSetting<T = unknown> {
  key: string;
  value: T;
}

export interface ExportBundleV1 {
  schemaVersion: 1;
  exportedAt: string;
  settings: AppSetting[];
  categories: CategoryNode[];
  purchases: PurchaseRecord[];
}

export interface FilterClause {
  id: string;
  viewId: ViewId;
  field: string;
  op: "eq" | "contains" | "inCategorySubtree";
  value: string;
  label: string;
}

export interface ColumnDef<Row> {
  key: string;
  label: string;
  getValue: (row: Row) => unknown;
  getDisplay: (row: Row) => string;
  filterable: boolean;
  filterOp?: "eq" | "contains" | "inCategorySubtree";
}

export interface AppState {
  purchases: PurchaseRecord[];
  categories: CategoryNode[];
  settings: AppSetting[];
  filters: FilterClause[];
  showArchivedPurchases: boolean;
  showArchivedCategories: boolean;
  exportText: string;
  importText: string;
}
