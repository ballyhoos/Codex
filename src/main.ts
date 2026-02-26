import "./styles.css";
import {
  clearAllData,
  getCategory,
  getPurchase,
  listCategories,
  listPurchases,
  listSettings,
  putCategory,
  putPurchase,
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
  PurchaseRecord,
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
  | { kind: "purchaseCreate" }
  | { kind: "purchaseEdit"; purchaseId: string };

let modalState: ModalState = { kind: "none" };
let lastFocusedBeforeModal: HTMLElement | null = null;
type DataTableInstanceLike = {
  destroy?: () => void;
  order?: (value?: Array<[number, "asc" | "desc"]>) => Array<[number, "asc" | "desc"]> | DataTableInstanceLike;
  draw?: (resetPaging?: boolean) => unknown;
};

let categoriesTableDt: DataTableInstanceLike | null = null;
let purchasesTableDt: DataTableInstanceLike | null = null;
let dataTablesLoadHookAttached = false;
let dataTablesRetryTimer: number | null = null;
let dataTablesStatusMessage = "";

let state: AppState = {
  purchases: [],
  categories: [],
  settings: [],
  filters: [],
  showArchivedPurchases: false,
  showArchivedCategories: false,
  exportText: "",
  importText: "",
};

const DEFAULT_CURRENCY = "USD";

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
  const currency = getSettingValue<string>("currencyCode") || DEFAULT_CURRENCY;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
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
  purchasesTableDt?.destroy?.();
  categoriesTableDt = null;
  purchasesTableDt = null;
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
    dataTablesStatusMessage = "DataTables JS not loaded";
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
  const purchasesTable = rootEl.querySelector<HTMLTableElement>("#purchases-table");
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
      ordering: { handler: true, indicators: true },
      order: [],
      columnDefs: [{ targets: -1, orderable: false }],
    });
    wireDataTableHeaderSorting(categoriesTable, categoriesTableDt);
  }

  if (purchasesTable) {
    purchasesTableDt = makeDt(purchasesTable, {
      dom: "t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",
      paging: true,
      pageLength: 10,
      searching: false,
      info: true,
      lengthChange: true,
      ordering: { handler: true, indicators: true },
      order: [],
      columnDefs: [{ targets: -1, orderable: false }],
    });
    wireDataTableHeaderSorting(purchasesTable, purchasesTableDt);
  }

  const mode = DataTableCtor ? "vanilla" : "jQuery";
  dataTablesStatusMessage = `DataTables active (${mode}: ${categoriesTableDt ? "categories" : ""}${categoriesTableDt && purchasesTableDt ? ", " : ""}${purchasesTableDt ? "purchases" : ""})`;
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
  const [purchases, categories, settings] = await Promise.all([listPurchases(), listCategories(), listSettings()]);
  const normalizedCategories = recomputeCategoryPaths(categories).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  if (!settings.some((s) => s.key === "currencyCode")) {
    await putSetting("currencyCode", DEFAULT_CURRENCY);
    settings.push({ key: "currencyCode", value: DEFAULT_CURRENCY });
  }
  state = { ...state, purchases, categories: normalizedCategories, settings };
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

function moneyInputFromCents(cents: number | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

function getParentCategoryName(category: CategoryNode): string {
  return category.parentId ? getCategoryById(category.parentId)?.name || "(Unknown)" : "(root)";
}

function buildPurchaseColumns(): ColumnDef<PurchaseRecord>[] {
  return [
    { key: "productName", label: "Name", getValue: (r) => r.productName, getDisplay: (r) => r.productName, filterable: true, filterOp: "contains" },
    { key: "quantity", label: "Qty", getValue: (r) => r.quantity, getDisplay: (r) => String(r.quantity), filterable: true, filterOp: "eq" },
    { key: "totalPriceCents", label: "Total", getValue: (r) => r.totalPriceCents, getDisplay: (r) => formatMoney(r.totalPriceCents), filterable: true, filterOp: "eq" },
    {
      key: "unitPriceCents",
      label: "Unit",
      getValue: (r) => r.unitPriceCents ?? Math.round(r.totalPriceCents / r.quantity),
      getDisplay: (r) => formatMoney(r.unitPriceCents ?? Math.round(r.totalPriceCents / r.quantity)),
      filterable: true,
      filterOp: "eq",
    },
    {
      key: "categoryId",
      label: "Category / Path",
      getValue: (r) => r.categoryId,
      getDisplay: (r) => getCategoryPathLabel(r.categoryId),
      filterable: true,
      filterOp: "inCategorySubtree",
    },
    { key: "active", label: "Active", getValue: (r) => r.active, getDisplay: (r) => (r.active ? "Active" : "Inactive"), filterable: true, filterOp: "eq" },
    { key: "purchaseDate", label: "Date", getValue: (r) => r.purchaseDate, getDisplay: (r) => r.purchaseDate, filterable: true, filterOp: "eq" },
  ];
}

function buildCategoryColumns(): ColumnDef<CategoryNode>[] {
  return [
    { key: "name", label: "Name", getValue: (r) => r.name, getDisplay: (r) => r.name, filterable: true, filterOp: "contains" },
    { key: "parent", label: "Parent", getValue: (r) => getParentCategoryName(r), getDisplay: (r) => getParentCategoryName(r), filterable: true, filterOp: "eq" },
    { key: "depth", label: "Depth", getValue: (r) => r.depth, getDisplay: (r) => String(r.depth), filterable: true, filterOp: "eq" },
    { key: "path", label: "Path", getValue: (r) => r.pathNames.join(" / "), getDisplay: (r) => r.pathNames.join(" / "), filterable: true, filterOp: "contains" },
    { key: "active", label: "Active", getValue: (r) => !r.isArchived, getDisplay: (r) => (r.isArchived ? "Inactive" : "Active"), filterable: true, filterOp: "eq" },
  ];
}

function getPurchaseBaseRows(): PurchaseRecord[] {
  return state.showArchivedPurchases ? state.purchases : state.purchases.filter((p) => !p.archived);
}

function getCategoryBaseRows(): CategoryNode[] {
  return state.showArchivedCategories ? state.categories : state.categories.filter((c) => !c.isArchived);
}

function getDerived() {
  const purchaseColumns = buildPurchaseColumns();
  const baseCategoryColumns = buildCategoryColumns();
  const categoryDescendantsMap = buildDescendantMap(state.categories);

  const filteredPurchases = applyViewFilters(
    getPurchaseBaseRows(),
    state.filters,
    "purchasesTable",
    purchaseColumns,
    { categoryDescendantsMap },
  );

  const visibleCategoriesForTotals = state.categories.filter((c) => !c.isArchived);
  const totalsInput = filteredPurchases.filter((p) => p.active && !p.archived);
  const categoryTotals = computeCategoryTotals(totalsInput, visibleCategoriesForTotals);
  const categoryColumns: ColumnDef<CategoryNode>[] = [
    ...baseCategoryColumns,
    {
      key: "computedTotalCents",
      label: "Total",
      getValue: (r) => categoryTotals.get(r.id) || 0,
      getDisplay: (r) => formatMoney(categoryTotals.get(r.id) || 0),
      filterable: true,
      filterOp: "eq",
    },
  ];

  const filteredCategories = applyViewFilters(getCategoryBaseRows(), state.filters, "categoriesList", categoryColumns);

  return {
    purchaseColumns,
    categoryColumns,
    categoryDescendantsMap,
    filteredPurchases,
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
      ${chips.length ? `<button type="button" class="secondary-btn btn btn-sm btn-outline-secondary chips-clear-btn" data-action="clear-filters" data-view-id="${viewId}">Clear Filter</button>` : ""}
    </div>
  `;
}

function renderClickableCell<Row>(viewId: ViewId, row: Row, col: ColumnDef<Row>): string {
  const display = col.getDisplay(row);
  const value = String(col.getValue(row));
  if (!col.filterable) return escapeHtml(display);
  return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}">${escapeHtml(display)}</button>`;
}

function renderModal(): string {
  if (modalState.kind === "none") return "";

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
    const currentTotal = category ? computeCategoryTotals(
      applyViewFilters(
        getPurchaseBaseRows(),
        state.filters,
        "purchasesTable",
        buildPurchaseColumns(),
        { categoryDescendantsMap: buildDescendantMap(state.categories) },
      ).filter((p) => p.active && !p.archived),
      state.categories.filter((c) => !c.isArchived),
    ).get(category.id) || 0 : 0;
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
                <option value="">(root)</option>
                ${categoryOptions(excludedIds, category?.parentId || null)}
              </select>
            </label>
            <label class="form-label mb-0">Current total (read-only)
              <input class="form-control" value="${escapeHtml(formatMoney(currentTotal))}" disabled />
            </label>
            <div class="modal-footer px-0 pb-0">
              ${editing && category ? `<button type="button" class="btn ${category.isArchived ? "btn-outline-success" : "btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${category.id}" data-next-archived="${String(!category.isArchived)}">${category.isArchived ? "Restore Record" : "Archive Record"}</button>` : ""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${editing ? "Save category" : "Add category"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;
  }

  if (modalState.kind === "purchaseCreate") {
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Purchase</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="purchase-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="purchaseId" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0, 10)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price<input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" /></label>
            <label class="form-label mb-0">Per-item price (optional)<input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" /></label>
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
              <button type="submit" class="btn btn-primary">Add purchase</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;
  }

  if (modalState.kind === "purchaseEdit") {
    const modal = modalState;
    const purchase = state.purchases.find((p) => p.id === modal.purchaseId);
    if (!purchase) return "";
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Purchase</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="purchase-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="purchaseId" value="${escapeHtml(purchase.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${escapeHtml(purchase.purchaseDate)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${escapeHtml(purchase.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${escapeHtml(String(purchase.quantity))}" /></label>
            <label class="form-label mb-0">Total price<input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${escapeHtml(moneyInputFromCents(purchase.totalPriceCents))}" /></label>
            <label class="form-label mb-0">Per-item price (optional)<input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${escapeHtml(moneyInputFromCents(purchase.unitPriceCents))}" /></label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${categoryOptions(undefined, purchase.categoryId)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${purchase.active ? "checked" : ""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${escapeHtml(purchase.notes || "")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${purchase.archived ? "btn-outline-success" : "btn-outline-warning"} me-auto" data-action="toggle-purchase-archived" data-id="${purchase.id}" data-next-archived="${String(!purchase.archived)}">${purchase.archived ? "Restore Record" : "Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save purchase</button>
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
    purchaseColumns,
    categoryColumns,
    filteredPurchases,
    filteredCategories,
    categoryTotals,
    visibleCategoriesForTotals,
  } = getDerived();

  const exportText = state.exportText || buildExportJsonText();
  const purchasesRowsHtml = filteredPurchases
    .map((p) => {
      const rowClass = [!p.active ? "row-inactive" : "", p.archived ? "row-archived" : ""].filter(Boolean).join(" ");
      return `
        <tr class="${rowClass}">
          ${purchaseColumns.map((col) => `<td>${renderClickableCell("purchasesTable", p, col)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-purchase" data-id="${p.id}">Edit</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const categoriesRowsHtml = filteredCategories
    .map((c) => `
      <tr class="${c.isArchived ? "row-archived" : ""}">
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
            <h1 class="display-6 mb-1">Investment Purchase Tracker</h1>
            <p class="text-body-secondary mb-0">Local-only storage in IndexedDB. Totals reflect current purchase filters and include active, non-archived records only.</p>
            ${dataTablesStatusMessage ? `<div class="small mt-1 text-body-secondary">Table Status: ${escapeHtml(dataTablesStatusMessage)}</div>` : ""}
          </div>
          <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
        </div>
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Actions</h2>
          <div class="menu-bar">
            <button type="button" class="btn btn-sm btn-primary action-menu-btn" data-action="open-create-category">New category</button>
            <button type="button" class="btn btn-sm btn-success action-menu-btn" data-action="open-create-purchase">New purchase</button>
            <button type="button" class="btn btn-sm btn-outline-secondary action-menu-btn" data-action="open-settings">Settings</button>
          </div>
        </div>
        <p class="muted text-body-secondary mb-0 mt-2">Create and edit records from modals. Saving updates the data and recalculates totals.</p>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Categories List</h2>
          <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${state.showArchivedCategories ? "checked" : ""}/> <span class="form-check-label">Show archived</span></label>
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
              ${categoriesRowsHtml || `<tr><td colspan="${categoryColumns.length + 1}" class="empty-cell">No categories</td></tr>`}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Purchases Table</h2>
          <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-purchases" ${state.showArchivedPurchases ? "checked" : ""}/> <span class="form-check-label">Show archived</span></label>
        </div>
        ${renderFilterChips("purchasesTable", "Purchases")}
        <div class="table-wrap table-responsive">
          <table id="purchases-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${purchaseColumns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${purchasesRowsHtml || `<tr><td colspan="${purchaseColumns.length + 1}" class="empty-cell">No purchases</td></tr>`}
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
              <button type="button" class="btn btn-outline-secondary btn-sm" data-action="refresh-export">Refresh export</button>
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-csv">Download CSV</button>
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
          <p class="mb-2">Hard delete all IndexedDB data (purchases, categories, settings). This is separate from archive/restore.</p>
          <label class="form-label">Type DELETE to confirm <input class="form-control" id="wipe-confirm" /></label>
          <button type="button" class="danger-btn btn btn-danger" data-action="wipe-all">Wipe all data</button>
        </div>
        </div>
      </details>
    </div>
    ${renderModal()}
  `;
  syncModalFocus();
  initDataTables();
}

function buildExportBundle(): ExportBundleV1 {
  return {
    schemaVersion: 1,
    exportedAt: nowIso(),
    settings: state.settings,
    categories: state.categories,
    purchases: state.purchases,
  };
}

function buildExportJsonText(): string {
  return JSON.stringify(buildExportBundle(), null, 2);
}

function buildCsv(): string {
  const header = [
    "id",
    "purchaseDate",
    "productName",
    "quantity",
    "totalPriceCents",
    "unitPriceCents",
    "unitPriceSource",
    "categoryId",
    "categoryPath",
    "active",
    "archived",
    "archivedAt",
    "notes",
    "createdAt",
    "updatedAt",
  ];
  const rows = state.purchases.map((p) => [
    p.id,
    p.purchaseDate,
    p.productName,
    String(p.quantity),
    String(p.totalPriceCents),
    String(p.unitPriceCents ?? ""),
    p.unitPriceSource,
    p.categoryId,
    getCategoryPathLabel(p.categoryId),
    String(p.active),
    String(p.archived),
    p.archivedAt || "",
    p.notes || "",
    p.createdAt,
    p.updatedAt,
  ]);

  const csvEscape = (s: string) => {
    const v = String(s ?? "");
    if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  return [header.map(csvEscape).join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
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
  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    alert("Currency code must be a 3-letter code like USD.");
    return;
  }
  await putSetting("currencyCode", currencyCode);
  closeModal();
  await reloadData();
}

async function handleCategorySubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const mode = String(fd.get("mode") || "create");
  const categoryIdInput = String(fd.get("categoryId") || "").trim();
  const name = String(fd.get("name") || "").trim();
  const parentIdRaw = String(fd.get("parentId") || "").trim();
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
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };
  await putCategory(draft);
  closeModal();
  await reloadData();
}

async function handlePurchaseSubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const mode = String(fd.get("mode") || "create");
  const purchaseIdInput = String(fd.get("purchaseId") || "").trim();
  const purchaseDate = String(fd.get("purchaseDate") || "");
  const productName = String(fd.get("productName") || "").trim();
  const quantity = Number(fd.get("quantity"));
  const totalPriceCents = parseMoneyToCents(String(fd.get("totalPrice") || ""));
  const unitPriceInput = String(fd.get("unitPrice") || "");
  const unitPriceCents = unitPriceInput.trim() ? parseMoneyToCents(unitPriceInput) : null;
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
  if (unitPriceInput.trim() && (unitPriceCents == null || unitPriceCents < 0)) {
    alert("Per-item price is invalid.");
    return;
  }
  if (!getCategoryById(categoryId)) {
    alert("Select a valid category.");
    return;
  }

  if (mode === "edit") {
    if (!purchaseIdInput) return;
    const existing = await getPurchase(purchaseIdInput);
    if (!existing) {
      alert("Purchase not found.");
      return;
    }
    existing.purchaseDate = purchaseDate;
    existing.productName = productName;
    existing.quantity = quantity;
    existing.totalPriceCents = totalPriceCents;
    existing.unitPriceCents = unitPriceCents ?? Math.round(totalPriceCents / quantity);
    existing.unitPriceSource = unitPriceCents != null ? "entered" : "derived";
    existing.categoryId = categoryId;
    existing.active = active;
    existing.notes = notes || undefined;
    existing.updatedAt = nowIso();
    await putPurchase(existing);
    closeModal();
    await reloadData();
    return;
  }

  const now = nowIso();
  const record: PurchaseRecord = {
    id: crypto.randomUUID(),
    purchaseDate,
    productName,
    quantity,
    totalPriceCents,
    unitPriceCents: unitPriceCents ?? Math.round(totalPriceCents / quantity),
    unitPriceSource: unitPriceCents != null ? "entered" : "derived",
    categoryId,
    active,
    archived: false,
    notes: notes || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await putPurchase(record);
  closeModal();
  await reloadData();
}

async function togglePurchaseActive(id: string, nextActive: boolean) {
  const rec = await getPurchase(id);
  if (!rec) return;
  rec.active = nextActive;
  rec.updatedAt = nowIso();
  await putPurchase(rec);
  await reloadData();
}

async function togglePurchaseArchived(id: string, nextArchived: boolean) {
  const rec = await getPurchase(id);
  if (!rec) return;
  if (nextArchived && !window.confirm(`Archive purchase "${rec.productName}"?`)) return;
  rec.archived = nextArchived;
  rec.archivedAt = nextArchived ? nowIso() : undefined;
  rec.updatedAt = nowIso();
  await putPurchase(rec);
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
    isArchived: typeof raw.isArchived === "boolean" ? raw.isArchived : false,
    archivedAt: raw.archivedAt ? String(raw.archivedAt) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : now,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : now,
  };
}

function normalizeImportedPurchase(raw: any): PurchaseRecord {
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
    const purchases = parsed.purchases.map(normalizeImportedPurchase);
    for (const p of purchases) {
      if (!categoryIds.has(p.categoryId)) {
        throw new Error(`Purchase ${p.id} references missing categoryId ${p.categoryId}`);
      }
    }
    const settings: AppSetting[] = Array.isArray(parsed.settings)
      ? parsed.settings.map((s: any) => ({ key: String(s.key), value: s.value }))
      : [{ key: "currencyCode", value: DEFAULT_CURRENCY }];

    const confirmed = window.confirm("Replace all existing data with imported data? This cannot be undone.");
    if (!confirmed) return;
    await replaceAllData({ purchases, categories, settings });
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
  if (viewId === "purchasesTable" && field === "archived" && value === "true" && !state.showArchivedPurchases) {
    nextState.showArchivedPurchases = true;
  }
  if (viewId === "categoriesList" && (field === "isArchived" || field === "archived") && value === "true" && !state.showArchivedCategories) {
    nextState.showArchivedCategories = true;
  }
  if (viewId === "categoriesList" && field === "active" && value === "false" && !state.showArchivedCategories) {
    nextState.showArchivedCategories = true;
  }
  setState(nextState);
}

rootEl.addEventListener("click", async (event) => {
  const target = getEventTargetElement(event);
  if (!target) return;
  const actionEl = target.closest<HTMLElement>("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  if (!action) return;

  if (action === "add-filter") {
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
  if (action === "toggle-show-archived-purchases") {
    const input = actionEl as HTMLInputElement;
    setState({ showArchivedPurchases: input.checked });
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
  if (action === "open-create-purchase") {
    openModal({ kind: "purchaseCreate" });
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
  if (action === "edit-purchase") {
    const id = actionEl.dataset.id;
    if (id) openModal({ kind: "purchaseEdit", purchaseId: id });
    return;
  }
  if (action === "close-modal" || action === "close-modal-backdrop") {
    if (action === "close-modal-backdrop" && !target.classList.contains("modal")) return;
    closeModal();
    return;
  }
  if (action === "toggle-purchase-active") {
    const id = actionEl.dataset.id;
    const next = actionEl.dataset.nextActive === "true";
    if (id) await togglePurchaseActive(id, next);
    return;
  }
  if (action === "toggle-purchase-archived") {
    const id = actionEl.dataset.id;
    const next = actionEl.dataset.nextArchived === "true";
    if (id) await togglePurchaseArchived(id, next);
    return;
  }
  if (action === "toggle-category-subtree-archived") {
    const id = actionEl.dataset.id;
    const next = actionEl.dataset.nextArchived === "true";
    if (id) await setCategorySubtreeArchived(id, next);
    return;
  }
  if (action === "refresh-export") {
    setState({ exportText: buildExportJsonText() });
    return;
  }
  if (action === "download-json") {
    downloadTextFile(`investment-tracker-${new Date().toISOString().slice(0, 10)}.json`, buildExportJsonText(), "application/json");
    return;
  }
  if (action === "download-csv") {
    downloadTextFile(`investment-tracker-${new Date().toISOString().slice(0, 10)}.csv`, buildCsv(), "text/csv;charset=utf-8");
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
    setState({ filters: [], exportText: "", importText: "", showArchivedPurchases: false, showArchivedCategories: false });
    await reloadData();
    return;
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
  if (form.id === "purchase-form") {
    await handlePurchaseSubmit(form);
    return;
  }
});

rootEl.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) return;
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
