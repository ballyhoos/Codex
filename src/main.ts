import "./styles.css";
import {
  clearAllData,
  getCategory,
  getInventoryRecord,
  listCategories,
  listInventoryRecords,
  listSettings,
  putCategory,
  putInventoryRecord,
  putSetting,
  replaceAllData,
} from "./db";
import { addFilter, applyViewFilters, clearFilters, removeFilter } from "./filters";
import { buildDescendantMap, collectSubtreeIds, computeCategoryTotals, recomputeCategoryPaths } from "./totals";
import type {
  AppSetting,
  AppState,
  CategoryNode,
  ColumnDef,
  ExportBundleV1,
  FilterClause,
  InventoryRecord,
  ViewId,
} from "./types";

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app not found");
const rootEl: HTMLDivElement = appEl;

type ModalState =
  | { kind: "none" }
  | { kind: "settings" }
  | { kind: "categoryCreate" }
  | { kind: "categoryEdit"; categoryId: string }
  | { kind: "inventoryCreate" }
  | { kind: "inventoryEdit"; inventoryId: string };

let modalState: ModalState = { kind: "none" };
let lastFocusedBeforeModal: HTMLElement | null = null;
type DataTableInstanceLike = {
  destroy?: () => void;
  order?: (value?: Array<[number, "asc" | "desc"]>) => Array<[number, "asc" | "desc"]> | DataTableInstanceLike;
  draw?: (resetPaging?: boolean) => unknown;
};

let categoriesTableDt: DataTableInstanceLike | null = null;
let inventoryTableDt: DataTableInstanceLike | null = null;
let dataTablesLoadHookAttached = false;
let dataTablesRetryTimer: number | null = null;
let pendingAddFilterTimer: number | null = null;

let state: AppState = {
  inventoryRecords: [],
  categories: [],
  settings: [],
  filters: [],
  showArchivedInventory: false,
  showArchivedCategories: false,
  exportText: "",
  importText: "",
};

const DEFAULT_CURRENCY = "USD";
const DEFAULT_CURRENCY_SYMBOL = "$";
const CURRENCY_SYMBOL_OPTIONS = [
  { value: "$", label: "Dollar ($)" },
  { value: "€", label: "Euro (€)" },
  { value: "£", label: "Pound (£)" },
  { value: "¥", label: "Yen/Yuan (¥)" },
  { value: "₹", label: "Rupee (₹)" },
  { value: "₩", label: "Won (₩)" },
  { value: "₽", label: "Ruble (₽)" },
  { value: "₺", label: "Lira (₺)" },
  { value: "₫", label: "Dong (₫)" },
  { value: "₱", label: "Peso (₱)" },
  { value: "₴", label: "Hryvnia (₴)" },
];

function nowIso() {
  return new Date().toISOString();
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoney(cents: number): string {
  const symbol = getSettingValue<string>("currencySymbol") || DEFAULT_CURRENCY_SYMBOL;
  const amount = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `${symbol}${amount}`;
}

function parseMoneyToCents(raw: string): number | null {
  const clean = raw.trim().replace(/,/g, "");
  if (!clean) return null;
  const n = Number(clean);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function getSettingValue<T = unknown>(key: string): T | undefined {
  return state.settings.find((s) => s.key === key)?.value as T | undefined;
}

function setState(next: Partial<AppState>) {
  state = { ...state, ...next };
  render();
}

function openModal(next: ModalState) {
  if (modalState.kind === "none" && document.activeElement instanceof HTMLElement) {
    lastFocusedBeforeModal = document.activeElement;
  }
  modalState = next;
  render();
}

function closeModal() {
  if (modalState.kind === "none") return;
  modalState = { kind: "none" };
  render();
  if (lastFocusedBeforeModal && lastFocusedBeforeModal.isConnected) {
    lastFocusedBeforeModal.focus();
  }
  lastFocusedBeforeModal = null;
}

function getModalPanelEl(): HTMLElement | null {
  return rootEl.querySelector<HTMLElement>(".modal-panel");
}

function getModalFocusableEls(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("hidden"));
}

function syncModalFocus() {
  if (modalState.kind === "none") return;
  const panel = getModalPanelEl();
  if (!panel) return;
  const active = document.activeElement;
  if (active instanceof Node && panel.contains(active)) return;
  const focusables = getModalFocusableEls(panel);
  (focusables[0] || panel).focus();
}

function destroyDataTables() {
  categoriesTableDt?.destroy?.();
  inventoryTableDt?.destroy?.();
  categoriesTableDt = null;
  inventoryTableDt = null;
}

function initDataTables() {
  const w = window as Window & {
    DataTable?: new (el: Element, opts: Record<string, unknown>) => DataTableInstanceLike;
    jQuery?: ((el: Element | string) => { DataTable?: (opts?: Record<string, unknown>) => DataTableInstanceLike }) & {
      fn?: { DataTable?: unknown };
    };
  };
  const DataTableCtor = w.DataTable;
  const jQueryDataTable = w.jQuery && w.jQuery.fn?.DataTable ? w.jQuery : undefined;
  if (!DataTableCtor && !jQueryDataTable) {
    if (dataTablesRetryTimer == null) {
      dataTablesRetryTimer = window.setTimeout(() => {
        dataTablesRetryTimer = null;
        initDataTables();
        render();
      }, 500);
    }
    if (!dataTablesLoadHookAttached) {
      dataTablesLoadHookAttached = true;
      window.addEventListener("load", () => {
        dataTablesLoadHookAttached = false;
        initDataTables();
        render();
      }, { once: true });
    }
    return;
  }

  const categoriesTable = rootEl.querySelector<HTMLTableElement>("#categories-table");
  const inventoryTable = rootEl.querySelector<HTMLTableElement>("#inventory-table");
  const makeDt = (table: HTMLTableElement, opts: Record<string, unknown>): DataTableInstanceLike | null => {
    if (DataTableCtor) return new DataTableCtor(table, opts);
    if (jQueryDataTable) return jQueryDataTable(table).DataTable?.(opts) ?? null;
    return null;
  };

  if (categoriesTable) {
    categoriesTableDt = makeDt(categoriesTable, {
      dom: "t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",
      paging: true,
      pageLength: 10,
      searching: false,
      info: true,
      lengthChange: true,
      language: {
        emptyTable: "No categories",
      },
      ordering: { handler: true, indicators: true },
      order: [[0, "asc"]],
      columnDefs: [{ targets: -1, orderable: false }],
    });
    wireDataTableHeaderSorting(categoriesTable, categoriesTableDt);
  }

  if (inventoryTable) {
    inventoryTableDt = makeDt(inventoryTable, {
      dom: "t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",
      paging: true,
      pageLength: 10,
      searching: false,
      info: true,
      lengthChange: true,
      language: {
        emptyTable: "No inventory records",
      },
      ordering: { handler: true, indicators: true },
      order: [[0, "asc"]],
      columnDefs: [{ targets: -1, orderable: false }],
    });
    wireDataTableHeaderSorting(inventoryTable, inventoryTableDt);
  }

}

function wireDataTableHeaderSorting(tableEl: HTMLTableElement, dt: DataTableInstanceLike | null) {
  if (!dt?.order || !dt.draw) return;
  tableEl.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const th = target?.closest<HTMLTableCellElement>("thead th");
    if (!th) return;

    const headerRow = th.parentElement;
    if (!(headerRow instanceof HTMLTableRowElement)) return;
    const headers = Array.from(headerRow.querySelectorAll<HTMLTableCellElement>("th"));
    const index = headers.indexOf(th);
    if (index < 0 || index === headers.length - 1) return; // Actions column

    event.preventDefault();
    event.stopPropagation();

    const currentOrder = dt.order?.();
    const current = Array.isArray(currentOrder) ? currentOrder[0] : undefined;
    const nextDir: "asc" | "desc" =
      current && current[0] === index && current[1] === "asc" ? "desc" : "asc";

    dt.order?.([[index, nextDir]]);
    dt.draw?.(false);
  }, true);
}


async function reloadData() {
  const [inventoryRecords, categories, settings] = await Promise.all([listInventoryRecords(), listCategories(), listSettings()]);
  const normalizedCategories = recomputeCategoryPaths(categories).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  if (!settings.some((s) => s.key === "currencyCode")) {
    await putSetting("currencyCode", DEFAULT_CURRENCY);
    settings.push({ key: "currencyCode", value: DEFAULT_CURRENCY });
  }
  if (!settings.some((s) => s.key === "currencySymbol")) {
    await putSetting("currencySymbol", DEFAULT_CURRENCY_SYMBOL);
    settings.push({ key: "currencySymbol", value: DEFAULT_CURRENCY_SYMBOL });
  }
  state = { ...state, inventoryRecords, categories: normalizedCategories, settings };
  render();
}

function getCategoryById(id: string | null | undefined): CategoryNode | undefined {
  if (!id) return undefined;
  return state.categories.find((c) => c.id === id);
}

function getCategoryPathLabel(categoryId: string): string {
  const c = getCategoryById(categoryId);
  if (!c) return "(Unknown category)";
  return c.pathNames.join(" / ");
}

function getCategoryPathLabelWithStatus(categoryId: string): string {
  return getCategoryPathLabel(categoryId);
}

function hasInactiveCategoryInPath(categoryId: string): boolean {
  const category = getCategoryById(categoryId);
  if (!category) return false;
  return category.pathIds.some((id) => getCategoryById(id)?.active === false);
}

function isInventoryRecordDisabledByCategory(record: InventoryRecord): boolean {
  const category = getCategoryById(record.categoryId);
  if (!category) return false;
  for (const id of category.pathIds) {
    const c = getCategoryById(id);
    if (c?.active === false) return true;
  }
  return false;
}

function isInventoryRecordEffectivelyActive(record: InventoryRecord): boolean {
  return record.active && !isInventoryRecordDisabledByCategory(record);
}

function moneyInputFromCents(cents: number | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

function syncInventoryFormUnitPrice(form: HTMLFormElement) {
  const qtyEl = form.querySelector<HTMLInputElement>('input[name="quantity"]');
  const totalEl = form.querySelector<HTMLInputElement>('input[name="totalPrice"]');
  const unitEl = form.querySelector<HTMLInputElement>('input[name="unitPrice"]');
  if (!qtyEl || !totalEl || !unitEl) return;

  const quantity = Number(qtyEl.value);
  const totalPriceCents = parseMoneyToCents(totalEl.value);
  if (!Number.isFinite(quantity) || quantity <= 0 || totalPriceCents == null || totalPriceCents < 0) {
    unitEl.value = "";
    return;
  }
  unitEl.value = (Math.round(totalPriceCents / quantity) / 100).toFixed(2);
}

function getParentCategoryName(category: CategoryNode): string {
  return category.parentId ? getCategoryById(category.parentId)?.name || "(Unknown)" : "";
}

function isInventoryRecordCountableForCategoryMetrics(record: InventoryRecord): boolean {
  return record.active && !record.archived;
}

function buildInventoryColumns(): ColumnDef<InventoryRecord>[] {
  return [
    { key: "productName", label: "Name", getValue: (r) => r.productName, getDisplay: (r) => r.productName, filterable: true, filterOp: "contains" },
    {
      key: "categoryId",
      label: "Category / Path",
      getValue: (r) => r.categoryId,
      getDisplay: (r) => getCategoryPathLabelWithStatus(r.categoryId),
      filterable: true,
      filterOp: "inCategorySubtree",
    },
    {
      key: "unitPriceCents",
      label: "Unit",
      getValue: (r) => r.unitPriceCents ?? Math.round(r.totalPriceCents / r.quantity),
      getDisplay: (r) => formatMoney(r.unitPriceCents ?? Math.round(r.totalPriceCents / r.quantity)),
      filterable: true,
      filterOp: "eq",
    },
    { key: "quantity", label: "Qty", getValue: (r) => r.quantity, getDisplay: (r) => String(r.quantity), filterable: true, filterOp: "eq" },
    { key: "totalPriceCents", label: "Total", getValue: (r) => r.totalPriceCents, getDisplay: (r) => formatMoney(r.totalPriceCents), filterable: true, filterOp: "eq" },
    { key: "purchaseDate", label: "Date", getValue: (r) => r.purchaseDate, getDisplay: (r) => r.purchaseDate, filterable: true, filterOp: "eq" },
    { key: "active", label: "Active", getValue: (r) => r.active, getDisplay: (r) => (r.active ? "Active" : "Inactive"), filterable: true, filterOp: "eq" },
  ];
}

function buildCategoryColumns(): ColumnDef<CategoryNode>[] {
  return [
    { key: "name", label: "Name", getValue: (r) => r.name, getDisplay: (r) => r.name, filterable: true, filterOp: "contains" },
    { key: "parent", label: "Parent", getValue: (r) => getParentCategoryName(r), getDisplay: (r) => getParentCategoryName(r), filterable: true, filterOp: "eq" },
    { key: "path", label: "Path", getValue: (r) => r.pathNames.join(" / "), getDisplay: (r) => r.pathNames.join(" / "), filterable: true, filterOp: "contains" },
  ];
}

function getInventoryBaseRows(): InventoryRecord[] {
  return state.showArchivedInventory ? state.inventoryRecords : state.inventoryRecords.filter((p) => !p.archived);
}

function getCategoryBaseRows(): CategoryNode[] {
  return state.showArchivedCategories ? state.categories : state.categories.filter((c) => !c.isArchived);
}

function getDerived() {
  const inventoryColumns = buildInventoryColumns();
  const baseCategoryColumns = buildCategoryColumns();
  const categoryDescendantsMap = buildDescendantMap(state.categories);

  const filteredInventoryRecords = applyViewFilters(
    getInventoryBaseRows(),
    state.filters,
    "inventoryTable",
    inventoryColumns,
    { categoryDescendantsMap },
  );

  const visibleCategoriesForTotals = state.categories.filter((c) => !c.isArchived);
  const totalsInput = filteredInventoryRecords.filter(isInventoryRecordCountableForCategoryMetrics);
  const categoryTotals = computeCategoryTotals(totalsInput, visibleCategoriesForTotals);
  const categoriesById = new Map(state.categories.map((c) => [c.id, c] as const));
  const categoryItems = new Map<string, number>();
  for (const p of filteredInventoryRecords.filter(isInventoryRecordCountableForCategoryMetrics)) {
    const purchaseCategory = categoriesById.get(p.categoryId);
    if (!purchaseCategory) continue;
    for (const categoryId of purchaseCategory.pathIds) {
      categoryItems.set(categoryId, (categoryItems.get(categoryId) || 0) + 1);
    }
  }
  const categoryColumns: ColumnDef<CategoryNode>[] = [
    ...baseCategoryColumns,
    {
      key: "computedItems",
      label: "Items",
      getValue: (r) => categoryItems.get(r.id) || 0,
      getDisplay: (r) => String(categoryItems.get(r.id) || 0),
      filterable: true,
      filterOp: "eq",
    },
    {
      key: "computedTotalCents",
      label: "Total",
      getValue: (r) => categoryTotals.get(r.id) || 0,
      getDisplay: (r) => formatMoney(categoryTotals.get(r.id) || 0),
      filterable: true,
      filterOp: "eq",
    },
    { key: "active", label: "Active", getValue: (r) => r.active && !r.isArchived, getDisplay: (r) => (r.active && !r.isArchived ? "Active" : "Inactive"), filterable: true, filterOp: "eq" },
  ];

  const filteredCategories = applyViewFilters(getCategoryBaseRows(), state.filters, "categoriesList", categoryColumns);

  return {
    inventoryColumns,
    categoryColumns,
    categoryDescendantsMap,
    filteredInventoryRecords,
    filteredCategories,
    categoryTotals,
    visibleCategoriesForTotals,
  };
}

function renderFilterChips(viewId: ViewId, title: string) {
  const chips = state.filters.filter((f) => f.viewId === viewId);
  return `
    <div class="chips-wrap mb-2">
      ${chips.length ? `
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${escapeHtml(title)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${chips.map((chip) => `
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${escapeHtml(chip.label)}"
                  aria-label="Remove filter: ${escapeHtml(chip.label)}"
                  data-action="remove-filter"
                  data-filter-id="${chip.id}"
                >${escapeHtml(chip.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      ` : `<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>`}
    </div>
  `;
}

function renderClickableCell<Row>(viewId: ViewId, row: Row, col: ColumnDef<Row>): string {
  const rawValue = col.getValue(row);
  const display = col.getDisplay(row);
  const value = rawValue == null ? "" : String(rawValue);
  if (!col.filterable) return escapeHtml(display);
  const isEmptyDisplay = display.trim() === "";
  if (isEmptyDisplay) {
    return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="isEmpty" data-value="" data-label="${escapeHtml(`${col.label}: Empty`)}" title="Filter ${escapeHtml(col.label)} by empty value"><span class="filter-hit">—</span></button>`;
  }
  if (viewId === "inventoryTable" && col.key === "categoryId" && typeof row === "object" && row && "categoryId" in (row as object)) {
    const categoryId = String((row as Record<string, unknown>).categoryId);
    const inactive = hasInactiveCategoryInPath(categoryId);
    return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}"><span class="filter-hit">${escapeHtml(display)}${inactive ? ' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>' : ""}</span></button>`;
  }
  return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}"><span class="filter-hit">${escapeHtml(display)}</span></button>`;
}

function renderModal(): string {
  if (modalState.kind === "none") return "";
  const currencySymbol = getSettingValue<string>("currencySymbol") || DEFAULT_CURRENCY_SYMBOL;

  const categoryOptions = (excludeIds?: Set<string>, selectedId?: string | null) =>
    state.categories
      .filter((c) => !c.isArchived)
      .filter((c) => !excludeIds?.has(c.id))
      .map((c) => `<option value="${c.id}" ${selectedId === c.id ? "selected" : ""}>${escapeHtml(c.pathNames.join(" / "))}</option>`)
      .join("");

  if (modalState.kind === "settings") {
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-settings" tabindex="-1">
            <div class="modal-header">
              <h2 id="modal-title-settings" class="modal-title fs-5">Settings</h2>
              <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
            </div>
            <form id="settings-form">
              <div class="modal-body d-grid gap-3">
                <label class="form-label mb-0">
                  Currency code
                  <input class="form-control" name="currencyCode" value="${escapeHtml((getSettingValue<string>("currencyCode") || DEFAULT_CURRENCY).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${CURRENCY_SYMBOL_OPTIONS.map((opt) => `<option value="${escapeHtml(opt.value)}" ${((getSettingValue<string>("currencySymbol") || DEFAULT_CURRENCY_SYMBOL) === opt.value) ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
                  </select>
                </label>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save settings</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  if (modalState.kind === "categoryCreate" || modalState.kind === "categoryEdit") {
    const editing = modalState.kind === "categoryEdit";
    const category = modalState.kind === "categoryEdit" ? getCategoryById(modalState.categoryId) : undefined;
    if (editing && !category) return "";
    const excludedIds = editing && category ? new Set(collectSubtreeIds(state.categories, category.id)) : undefined;
    const categoryDescendantsMap = buildDescendantMap(state.categories);
    const filteredInventoryForCategoryStats = applyViewFilters(
      getInventoryBaseRows(),
      state.filters,
      "inventoryTable",
      buildInventoryColumns(),
      { categoryDescendantsMap },
    );
    const currentTotal = category ? computeCategoryTotals(
      filteredInventoryForCategoryStats.filter(isInventoryRecordCountableForCategoryMetrics),
      state.categories.filter((c) => !c.isArchived),
    ).get(category.id) || 0 : 0;
    const currentItems = category
      ? filteredInventoryForCategoryStats.filter((p) => {
        if (!isInventoryRecordCountableForCategoryMetrics(p)) return false;
        const purchaseCategory = getCategoryById(p.categoryId);
        return purchaseCategory ? purchaseCategory.pathIds.includes(category.id) : false;
      }).length
      : 0;
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${editing ? "Edit Category" : "Create Category"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${editing ? "edit" : "create"}" />
            <input type="hidden" name="categoryId" value="${escapeHtml(category?.id || "")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${escapeHtml(category?.name || "")}" /></label>
            <label>Parent category
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${categoryOptions(excludedIds, category?.parentId || null)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${category ? (category.active !== false ? "checked" : "") : "checked"} /> <span class="form-check-label">Active</span></label>
            ${editing ? `
            <label class="form-label mb-0">Items (read-only)
              <input class="form-control" value="${escapeHtml(String(currentItems))}" disabled />
            </label>
            ` : ""}
            ${editing ? `
            <label class="form-label mb-0">Current total (read-only)
              <input class="form-control" value="${escapeHtml(formatMoney(currentTotal))}" disabled />
            </label>
            ` : ""}
            <div class="modal-footer px-0 pb-0">
              ${editing && category ? `<button type="button" class="btn ${category.isArchived ? "btn-outline-success" : "btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${category.id}" data-next-archived="${String(!category.isArchived)}">${category.isArchived ? "Restore Record" : "Archive Record"}</button>` : ""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${editing ? "Save" : "Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;
  }

  if (modalState.kind === "inventoryCreate") {
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Inventory Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="inventoryId" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0, 10)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" disabled />
              </div>
            </label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${categoryOptions()}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" checked /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3"></textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;
  }

  if (modalState.kind === "inventoryEdit") {
    const modal = modalState;
    const purchase = state.inventoryRecords.find((p) => p.id === modal.inventoryId);
    if (!purchase) return "";
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Inventory Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${escapeHtml(purchase.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${escapeHtml(purchase.purchaseDate)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${escapeHtml(purchase.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${escapeHtml(String(purchase.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${escapeHtml(moneyInputFromCents(purchase.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${escapeHtml(moneyInputFromCents(purchase.unitPriceCents))}" disabled />
              </div>
            </label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${categoryOptions(undefined, purchase.categoryId)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${purchase.active ? "checked" : ""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${escapeHtml(purchase.notes || "")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${purchase.archived ? "btn-outline-success" : "btn-outline-warning"} me-auto" data-action="toggle-inventory-archived" data-id="${purchase.id}" data-next-archived="${String(!purchase.archived)}">${purchase.archived ? "Restore Record" : "Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;
  }

  return "";
}

function render() {
  destroyDataTables();

  const {
    inventoryColumns,
    categoryColumns,
    filteredInventoryRecords,
    filteredCategories,
    categoryTotals,
    visibleCategoriesForTotals,
  } = getDerived();

  const exportText = state.exportText || buildExportJsonText();
  const inventoryRowsHtml = filteredInventoryRecords
    .map((p) => {
      const rowClass = [!isInventoryRecordEffectivelyActive(p) ? "row-inactive" : "", p.archived ? "row-archived" : ""].filter(Boolean).join(" ");
      return `
        <tr class="${rowClass}" data-row-edit="inventory" data-id="${p.id}">
          ${inventoryColumns.map((col) => `<td>${renderClickableCell("inventoryTable", p, col)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${p.id}">Edit</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const categoriesRowsHtml = filteredCategories
    .map((c) => `
      <tr class="${[!c.active ? "row-inactive" : "", c.isArchived ? "row-archived" : ""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${c.id}">
        ${categoryColumns.map((col) => `<td>${renderClickableCell("categoriesList", c, col)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${c.id}">Edit</button>
          </div>
        </td>
      </tr>
    `)
    .join("");

  rootEl.innerHTML = `
    <div class="app-shell container-fluid py-3 py-lg-4">
      <header class="page-header mb-2">
        <div class="section-head">
          <div>
            <h1 class="display-6 mb-1">Investments</h1>
            <p class="text-body-secondary mb-0">Maintain your investments locally with fast filtering, category tracking, and clear totals.</p>
          </div>
          <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
        </div>
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Categories</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${state.showArchivedCategories ? "checked" : ""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${renderFilterChips("categoriesList", "Category list")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${categoryColumns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${categoriesRowsHtml}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Inventory</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${state.showArchivedInventory ? "checked" : ""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
          </div>
        </div>
        ${renderFilterChips("inventoryTable", "Inventory")}
        <div class="table-wrap table-responsive">
          <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${inventoryColumns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${inventoryRowsHtml}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card">
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${escapeHtml(exportText)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${escapeHtml(state.importText)}</textarea>
            </label>
          </div>
        </div>
        <div class="danger-zone border border-danger-subtle rounded-3 p-3 mt-3 bg-danger-subtle">
          <h3 class="h6">Wipe All Data</h3>
          <p class="mb-2">Hard delete all IndexedDB data (inventory, categories, settings). This is separate from archive/restore.</p>
          <label class="form-label">Type DELETE to confirm <input class="form-control" id="wipe-confirm" /></label>
          <button type="button" class="danger-btn btn btn-danger" data-action="wipe-all">Wipe all data</button>
        </div>
        </div>
      </details>
    </div>
    ${renderModal()}
  `;
  const purchaseForm = rootEl.querySelector<HTMLFormElement>('#inventory-form');
  if (purchaseForm) syncInventoryFormUnitPrice(purchaseForm);
  syncModalFocus();
  initDataTables();
}

function buildExportBundle(): ExportBundleV1 {
  return {
    schemaVersion: 1,
    exportedAt: nowIso(),
    settings: state.settings,
    categories: state.categories,
    purchases: state.inventoryRecords,
  };
}

function buildExportJsonText(): string {
  return JSON.stringify(buildExportBundle(), null, 2);
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function handleSettingsSubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const currencyCode = String(fd.get("currencyCode") || "").trim().toUpperCase();
  const currencySymbol = String(fd.get("currencySymbol") || "").trim();
  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    alert("Currency code must be a 3-letter code like USD.");
    return;
  }
  if (!currencySymbol) {
    alert("Select a currency symbol.");
    return;
  }
  await putSetting("currencyCode", currencyCode);
  await putSetting("currencySymbol", currencySymbol);
  closeModal();
  await reloadData();
}

async function handleCategorySubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const mode = String(fd.get("mode") || "create");
  const categoryIdInput = String(fd.get("categoryId") || "").trim();
  const name = String(fd.get("name") || "").trim();
  const parentIdRaw = String(fd.get("parentId") || "").trim();
  const active = fd.get("active") === "on";
  if (!name) return;
  const parentId = parentIdRaw || null;
  if (parentId && !getCategoryById(parentId)) {
    alert("Select a valid parent category.");
    return;
  }

  if (mode === "edit") {
    if (!categoryIdInput) return;
    const existing = await getCategory(categoryIdInput);
    if (!existing) {
      alert("Category not found.");
      return;
    }
    if (parentId === existing.id) {
      alert("A category cannot be its own parent.");
      return;
    }
    if (parentId && collectSubtreeIds(state.categories, existing.id).includes(parentId)) {
      alert("A category cannot be moved under its own subtree.");
      return;
    }
    const parentChanged = existing.parentId !== parentId;
    existing.name = name;
    existing.parentId = parentId;
    existing.active = active;
    if (parentChanged) {
      existing.sortOrder = state.categories.filter((c) => c.parentId === parentId && c.id !== existing.id).length;
    }
    existing.updatedAt = nowIso();
    await putCategory(existing);
    closeModal();
    await reloadData();
    return;
  }

  const now = nowIso();
  const siblingCount = state.categories.filter((c) => c.parentId === parentId).length;
  const draft: CategoryNode = {
    id: crypto.randomUUID(),
    name,
    parentId,
    pathIds: [],
    pathNames: [],
    depth: 0,
    sortOrder: siblingCount,
    active,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };
  await putCategory(draft);
  closeModal();
  await reloadData();
}

async function handleInventorySubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const mode = String(fd.get("mode") || "create");
  const inventoryIdInput = String(fd.get("inventoryId") || "").trim();
  const purchaseDate = String(fd.get("purchaseDate") || "");
  const productName = String(fd.get("productName") || "").trim();
  const quantity = Number(fd.get("quantity"));
  const totalPriceCents = parseMoneyToCents(String(fd.get("totalPrice") || ""));
  const categoryId = String(fd.get("categoryId") || "");
  const active = fd.get("active") === "on";
  const notes = String(fd.get("notes") || "").trim();

  if (!purchaseDate || !productName || !categoryId) {
    alert("Date, product name, and category are required.");
    return;
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    alert("Quantity must be greater than 0.");
    return;
  }
  if (totalPriceCents == null || totalPriceCents < 0) {
    alert("Total price is invalid.");
    return;
  }
  if (!getCategoryById(categoryId)) {
    alert("Select a valid category.");
    return;
  }
  const derivedUnitPriceCents = Math.round(totalPriceCents / quantity);

  if (mode === "edit") {
    if (!inventoryIdInput) return;
    const existing = await getInventoryRecord(inventoryIdInput);
    if (!existing) {
      alert("Inventory record not found.");
      return;
    }
    existing.purchaseDate = purchaseDate;
    existing.productName = productName;
    existing.quantity = quantity;
    existing.totalPriceCents = totalPriceCents;
    existing.unitPriceCents = derivedUnitPriceCents;
    existing.unitPriceSource = "derived";
    existing.categoryId = categoryId;
    existing.active = active;
    existing.notes = notes || undefined;
    existing.updatedAt = nowIso();
    await putInventoryRecord(existing);
    closeModal();
    await reloadData();
    return;
  }

  const now = nowIso();
  const record: InventoryRecord = {
    id: crypto.randomUUID(),
    purchaseDate,
    productName,
    quantity,
    totalPriceCents,
    unitPriceCents: derivedUnitPriceCents,
    unitPriceSource: "derived",
    categoryId,
    active,
    archived: false,
    notes: notes || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await putInventoryRecord(record);
  closeModal();
  await reloadData();
}

async function toggleInventoryActive(id: string, nextActive: boolean) {
  const rec = await getInventoryRecord(id);
  if (!rec) return;
  rec.active = nextActive;
  rec.updatedAt = nowIso();
  await putInventoryRecord(rec);
  await reloadData();
}

async function toggleInventoryArchived(id: string, nextArchived: boolean) {
  const rec = await getInventoryRecord(id);
  if (!rec) return;
  if (nextArchived && !window.confirm(`Archive inventory record "${rec.productName}"?`)) return;
  rec.archived = nextArchived;
  rec.archivedAt = nextArchived ? nowIso() : undefined;
  rec.updatedAt = nowIso();
  await putInventoryRecord(rec);
  await reloadData();
}

async function setCategorySubtreeArchived(categoryId: string, nextArchived: boolean) {
  const rootCategory = getCategoryById(categoryId);
  if (nextArchived && rootCategory && !window.confirm(`Archive category subtree "${rootCategory.pathNames.join(" / ")}"?`)) return;
  const subtreeIds = collectSubtreeIds(state.categories, categoryId);
  const timestamp = nowIso();
  for (const id of subtreeIds) {
    const cat = await getCategory(id);
    if (!cat) continue;
    cat.isArchived = nextArchived;
    cat.archivedAt = nextArchived ? timestamp : undefined;
    cat.updatedAt = timestamp;
    await putCategory(cat);
  }
  await reloadData();
}

function normalizeImportedCategory(raw: any): CategoryNode {
  const now = nowIso();
  return {
    id: String(raw.id),
    name: String(raw.name),
    parentId: raw.parentId == null || raw.parentId === "" ? null : String(raw.parentId),
    pathIds: Array.isArray(raw.pathIds) ? raw.pathIds.map(String) : [],
    pathNames: Array.isArray(raw.pathNames) ? raw.pathNames.map(String) : [],
    depth: Number.isFinite(raw.depth) ? Number(raw.depth) : 0,
    sortOrder: Number.isFinite(raw.sortOrder) ? Number(raw.sortOrder) : 0,
    active: typeof raw.active === "boolean" ? raw.active : true,
    isArchived: typeof raw.isArchived === "boolean" ? raw.isArchived : false,
    archivedAt: raw.archivedAt ? String(raw.archivedAt) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : now,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : now,
  };
}

function normalizeImportedInventoryRecord(raw: any): InventoryRecord {
  const now = nowIso();
  const quantity = Number(raw.quantity);
  const totalPriceCents = Number(raw.totalPriceCents);
  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error(`Invalid quantity for purchase ${raw.id}`);
  if (!Number.isFinite(totalPriceCents)) throw new Error(`Invalid totalPriceCents for purchase ${raw.id}`);
  const unit = raw.unitPriceCents == null || raw.unitPriceCents === "" ? undefined : Number(raw.unitPriceCents);
  return {
    id: String(raw.id),
    purchaseDate: String(raw.purchaseDate),
    productName: String(raw.productName),
    quantity,
    totalPriceCents,
    unitPriceCents: unit,
    unitPriceSource: raw.unitPriceSource === "entered" ? "entered" : "derived",
    categoryId: String(raw.categoryId),
    active: typeof raw.active === "boolean" ? raw.active : true,
    archived: typeof raw.archived === "boolean" ? raw.archived : false,
    archivedAt: raw.archivedAt ? String(raw.archivedAt) : undefined,
    notes: raw.notes ? String(raw.notes) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : now,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : now,
  };
}

async function handleReplaceImport() {
  const rawText = state.importText.trim();
  if (!rawText) {
    alert("Paste JSON or choose a JSON file first.");
    return;
  }
  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    alert("Import JSON is not valid.");
    return;
  }
  if (parsed?.schemaVersion !== 1) {
    alert("Unsupported schemaVersion. Expected 1.");
    return;
  }
  if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.purchases)) {
    alert("Import payload must contain categories[] and purchases[].");
    return;
  }

  try {
    const categories = recomputeCategoryPaths(parsed.categories.map(normalizeImportedCategory));
    const categoryIds = new Set(categories.map((c) => c.id));
    const importedInventoryRecords = parsed.purchases.map(normalizeImportedInventoryRecord);
    for (const p of importedInventoryRecords) {
      if (!categoryIds.has(p.categoryId)) {
        throw new Error(`Inventory record ${p.id} references missing categoryId ${p.categoryId}`);
      }
    }
    const settings: AppSetting[] = Array.isArray(parsed.settings)
      ? parsed.settings.map((s: any) => ({ key: String(s.key), value: s.value }))
      : [
        { key: "currencyCode", value: DEFAULT_CURRENCY },
        { key: "currencySymbol", value: DEFAULT_CURRENCY_SYMBOL },
      ];

    const confirmed = window.confirm("Replace all existing data with imported data? This cannot be undone.");
    if (!confirmed) return;
    await replaceAllData({ purchases: importedInventoryRecords, categories, settings });
    setState({ importText: "" });
    await reloadData();
  } catch (err) {
    alert(err instanceof Error ? err.message : "Import failed.");
  }
}

function getEventTargetElement(event: Event): HTMLElement | null {
  return event.target instanceof HTMLElement ? event.target : null;
}

function addFilterFromElement(el: HTMLElement) {
  const viewId = el.dataset.viewId as ViewId | undefined;
  const field = el.dataset.field;
  const op = el.dataset.op as FilterClause["op"] | undefined;
  const value = el.dataset.value;
  const label = el.dataset.label;
  if (!viewId || !field || !op || value == null || !label) return;

  let nextState: Partial<AppState> = {
    filters: addFilter(state.filters, { viewId, field, op, value, label }),
  };
  if (viewId === "inventoryTable" && field === "archived" && value === "true" && !state.showArchivedInventory) {
    nextState.showArchivedInventory = true;
  }
  if (viewId === "categoriesList" && (field === "isArchived" || field === "archived") && value === "true" && !state.showArchivedCategories) {
    nextState.showArchivedCategories = true;
  }
  if (viewId === "categoriesList" && field === "active" && value === "false" && !state.showArchivedCategories) {
    nextState.showArchivedCategories = true;
  }
  setState(nextState);
}

function clearPendingAddFilterTimer() {
  if (pendingAddFilterTimer != null) {
    window.clearTimeout(pendingAddFilterTimer);
    pendingAddFilterTimer = null;
  }
}

rootEl.addEventListener("click", async (event) => {
  const target = getEventTargetElement(event);
  if (!target) return;
  const actionEl = target.closest<HTMLElement>("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  if (!action) return;

  if (action === "add-filter") {
    if (!target.closest(".filter-hit")) return;
    if (event instanceof MouseEvent) {
      clearPendingAddFilterTimer();
      if (event.detail > 1) return;
      pendingAddFilterTimer = window.setTimeout(() => {
        pendingAddFilterTimer = null;
        addFilterFromElement(actionEl);
      }, 220);
      return;
    }
    addFilterFromElement(actionEl);
    return;
  }
  if (action === "remove-filter") {
    const id = actionEl.dataset.filterId;
    if (!id) return;
    setState({ filters: removeFilter(state.filters, id) });
    return;
  }
  if (action === "clear-filters") {
    const viewId = actionEl.dataset.viewId as ViewId | undefined;
    if (!viewId) return;
    setState({ filters: clearFilters(state.filters, viewId) });
    return;
  }
  if (action === "toggle-show-archived-inventory") {
    const input = actionEl as HTMLInputElement;
    setState({ showArchivedInventory: input.checked });
    return;
  }
  if (action === "toggle-show-archived-categories") {
    const input = actionEl as HTMLInputElement;
    setState({ showArchivedCategories: input.checked });
    return;
  }
  if (action === "open-create-category") {
    openModal({ kind: "categoryCreate" });
    return;
  }
  if (action === "open-create-inventory") {
    openModal({ kind: "inventoryCreate" });
    return;
  }
  if (action === "open-settings") {
    openModal({ kind: "settings" });
    return;
  }
  if (action === "edit-category") {
    const id = actionEl.dataset.id;
    if (id) openModal({ kind: "categoryEdit", categoryId: id });
    return;
  }
  if (action === "edit-inventory") {
    const id = actionEl.dataset.id;
    if (id) openModal({ kind: "inventoryEdit", inventoryId: id });
    return;
  }
  if (action === "close-modal" || action === "close-modal-backdrop") {
    if (action === "close-modal-backdrop" && !target.classList.contains("modal")) return;
    closeModal();
    return;
  }
  if (action === "toggle-inventory-active") {
    const id = actionEl.dataset.id;
    const next = actionEl.dataset.nextActive === "true";
    if (id) await toggleInventoryActive(id, next);
    return;
  }
  if (action === "toggle-inventory-archived") {
    const id = actionEl.dataset.id;
    const next = actionEl.dataset.nextArchived === "true";
    if (id) await toggleInventoryArchived(id, next);
    return;
  }
  if (action === "toggle-category-subtree-archived") {
    const id = actionEl.dataset.id;
    const next = actionEl.dataset.nextArchived === "true";
    if (id) await setCategorySubtreeArchived(id, next);
    return;
  }
  if (action === "download-json") {
    downloadTextFile(`investment-tracker-${new Date().toISOString().slice(0, 10)}.json`, buildExportJsonText(), "application/json");
    return;
  }
  if (action === "replace-import") {
    await handleReplaceImport();
    return;
  }
  if (action === "wipe-all") {
    const confirmInput = document.querySelector<HTMLInputElement>("#wipe-confirm");
    if (!confirmInput || confirmInput.value !== "DELETE") {
      alert('Type DELETE in the confirmation field first.');
      return;
    }
    if (!window.confirm("Wipe all IndexedDB data? This cannot be undone.")) return;
    await clearAllData();
    setState({ filters: [], exportText: "", importText: "", showArchivedInventory: false, showArchivedCategories: false });
    await reloadData();
    return;
  }
});

rootEl.addEventListener("dblclick", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  clearPendingAddFilterTimer();
  if (target.closest("input, select, textarea, label")) return;
  const interactiveButton = target.closest<HTMLElement>("button");
  if (interactiveButton && !interactiveButton.classList.contains("link-cell")) return;
  if (target.closest("a")) return;

  const row = target.closest<HTMLTableRowElement>("tr[data-row-edit]");
  if (!row) return;
  const id = row.dataset.id;
  const rowEdit = row.dataset.rowEdit;
  if (!id || !rowEdit) return;

  if (rowEdit === "purchase") {
    openModal({ kind: "inventoryEdit", inventoryId: id });
    return;
  }
  if (rowEdit === "category") {
    openModal({ kind: "categoryEdit", categoryId: id });
  }
});

rootEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "settings-form") {
    await handleSettingsSubmit(form);
    return;
  }
  if (form.id === "category-form") {
    await handleCategorySubmit(form);
    return;
  }
  if (form.id === "inventory-form") {
    await handleInventorySubmit(form);
    return;
  }
});

rootEl.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) return;
  if (target.name === "quantity" || target.name === "totalPrice") {
    const form = target.closest("form");
    if (form instanceof HTMLFormElement && form.id === "inventory-form") {
      syncInventoryFormUnitPrice(form);
    }
  }
  if (target.id === "import-text") {
    state = { ...state, importText: target.value };
  }
});

rootEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id !== "import-file") return;
  const file = target.files?.[0];
  if (!file) return;
  const text = await file.text();
  setState({ importText: text });
});

document.addEventListener("keydown", (event) => {
  if (modalState.kind === "none") return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key !== "Tab") return;
  const panel = getModalPanelEl();
  if (!panel) return;
  const focusables = getModalFocusableEls(panel);
  if (!focusables.length) {
    event.preventDefault();
    panel.focus();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || (active instanceof Node && !panel.contains(active))) {
      event.preventDefault();
      last.focus();
    }
    return;
  }

  if (active === last) {
    event.preventDefault();
    first.focus();
  }
});

void reloadData();
