export type ViewId = "inventoryTable" | "categoriesList";

export interface InventoryRecord {
  id: string;
  purchaseDate: string; // YYYY-MM-DD
  productName: string;
  quantity: number;
  totalPriceCents: number;
  baselineValueCents?: number;
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
  evaluationMode?: "spot" | "snapshot";
  spotValueCents?: number;
  spotCode?: string;
  active: boolean;
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
  purchases: InventoryRecord[];
}

export interface ExportBundleV2 {
  schemaVersion: 2;
  exportedAt: string;
  settings: AppSetting[];
  categories: CategoryNode[];
  purchases: InventoryRecord[];
}

export type ExportBundle = ExportBundleV1 | ExportBundleV2;

export interface FilterClause {
  id: string;
  viewId: ViewId;
  field: string;
  op: "eq" | "contains" | "inCategorySubtree" | "isEmpty" | "isNotEmpty";
  value: string;
  label: string;
  linkedToFilterId?: string;
}

export interface ColumnDef<Row> {
  key: string;
  label: string;
  getValue: (row: Row) => unknown;
  getDisplay: (row: Row) => string;
  filterable: boolean;
  filterOp?: "eq" | "contains" | "inCategorySubtree";
  align?: "left" | "center" | "right";
}

export interface AppState {
  inventoryRecords: InventoryRecord[];
  categories: CategoryNode[];
  settings: AppSetting[];
  reportDateFrom: string;
  reportDateTo: string;
  filters: FilterClause[];
  showArchivedInventory: boolean;
  showArchivedCategories: boolean;
  exportText: string;
  importText: string;
  storageUsageBytes: number | null;
  storageQuotaBytes: number | null;
}
