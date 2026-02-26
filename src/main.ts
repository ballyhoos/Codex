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

const appEl = document.querySelector<HTMLDivElement>("#app") ?? (() => {
  throw new Error("#app not found");
})();

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

function getParentCategoryName(category: CategoryNode): string {
  return category.parentId ? getCategoryById(category.parentId)?.name || "(Unknown)" : "(root)";
}

function buildPurchaseColumns(): ColumnDef<PurchaseRecord>[] {
  return [
    { key: "purchaseDate", label: "Date", getValue: (r) => r.purchaseDate, getDisplay: (r) => r.purchaseDate, filterable: true, filterOp: "eq" },
    { key: "productName", label: "Product", getValue: (r) => r.productName, getDisplay: (r) => r.productName, filterable: true, filterOp: "contains" },
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
    { key: "archived", label: "Archived", getValue: (r) => r.archived, getDisplay: (r) => (r.archived ? "Archived" : "No"), filterable: true, filterOp: "eq" },
  ];
}

function buildCategoryColumns(): ColumnDef<CategoryNode>[] {
  return [
    { key: "name", label: "Name", getValue: (r) => r.name, getDisplay: (r) => r.name, filterable: true, filterOp: "contains" },
    { key: "parent", label: "Parent", getValue: (r) => getParentCategoryName(r), getDisplay: (r) => getParentCategoryName(r), filterable: true, filterOp: "eq" },
    { key: "depth", label: "Depth", getValue: (r) => r.depth, getDisplay: (r) => String(r.depth), filterable: true, filterOp: "eq" },
    { key: "path", label: "Path", getValue: (r) => r.pathNames.join(" / "), getDisplay: (r) => r.pathNames.join(" / "), filterable: true, filterOp: "contains" },
    { key: "isArchived", label: "Archived", getValue: (r) => r.isArchived, getDisplay: (r) => (r.isArchived ? "Archived" : "No"), filterable: true, filterOp: "eq" },
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
  const categoryColumns = buildCategoryColumns();
  const categoryDescendantsMap = buildDescendantMap(state.categories);

  const filteredPurchases = applyViewFilters(
    getPurchaseBaseRows(),
    state.filters,
    "purchasesTable",
    purchaseColumns,
    { categoryDescendantsMap },
  );

  const filteredCategories = applyViewFilters(getCategoryBaseRows(), state.filters, "categoriesList", categoryColumns);

  const visibleCategoriesForTotals = state.categories.filter((c) => !c.isArchived);
  const totalsInput = filteredPurchases.filter((p) => p.active && !p.archived);
  const categoryTotals = computeCategoryTotals(totalsInput, visibleCategoriesForTotals);

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
    <div class="chips-wrap">
      <div class="chips-title">${escapeHtml(title)}</div>
      <div class="chips-list">
        ${chips.length ? chips.map((chip) => `
          <button type="button" class="chip" data-action="remove-filter" data-filter-id="${chip.id}">
            <span>${escapeHtml(chip.label)}</span>
            <span aria-hidden="true">x</span>
          </button>
        `).join("") : `<span class="chips-empty">No filters</span>`}
      </div>
      ${chips.length ? `<button type="button" class="secondary-btn" data-action="clear-filters" data-view-id="${viewId}">Clear ${escapeHtml(title)} filters</button>` : ""}
    </div>
  `;
}

function renderClickableCell<Row>(viewId: ViewId, row: Row, col: ColumnDef<Row>): string {
  const display = col.getDisplay(row);
  const value = String(col.getValue(row));
  if (!col.filterable) return escapeHtml(display);
  return `<button type="button" class="link-cell" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}">${escapeHtml(display)}</button>`;
}

function render() {
  const {
    purchaseColumns,
    categoryColumns,
    filteredPurchases,
    filteredCategories,
    categoryTotals,
    visibleCategoriesForTotals,
  } = getDerived();

  const rootCategoryOptions = state.categories
    .filter((c) => !c.isArchived)
    .map((c) => `<option value="${c.id}">${escapeHtml(c.pathNames.join(" / "))}</option>`)
    .join("");

  const exportText = state.exportText || buildExportJsonText();
  const purchasesRowsHtml = filteredPurchases
    .map((p) => {
      const rowClass = [!p.active ? "row-inactive" : "", p.archived ? "row-archived" : ""].filter(Boolean).join(" ");
      return `
        <tr class="${rowClass}">
          ${purchaseColumns.map((col) => `<td>${renderClickableCell("purchasesTable", p, col)}</td>`).join("")}
          <td class="actions-cell">
            <button type="button" data-action="toggle-purchase-active" data-id="${p.id}" data-next-active="${String(!p.active)}">${p.active ? "Disable" : "Enable"}</button>
            <button type="button" data-action="toggle-purchase-archived" data-id="${p.id}" data-next-archived="${String(!p.archived)}">${p.archived ? "Restore" : "Archive"}</button>
          </td>
        </tr>
      `;
    })
    .join("");

  const categoriesRowsHtml = filteredCategories
    .map((c) => `
      <tr class="${c.isArchived ? "row-archived" : ""}">
        ${categoryColumns.map((col) => `<td>${renderClickableCell("categoriesList", c, col)}</td>`).join("")}
        <td class="actions-cell">
          <button type="button" data-action="rename-category" data-id="${c.id}">Rename</button>
          <button type="button" data-action="toggle-category-subtree-archived" data-id="${c.id}" data-next-archived="${String(!c.isArchived)}">${c.isArchived ? "Restore subtree" : "Archive subtree"}</button>
        </td>
      </tr>
    `)
    .join("");

  const totalsRows = visibleCategoriesForTotals
    .map((c) => {
      const total = categoryTotals.get(c.id) || 0;
      return `
      <tr>
        <td>${escapeHtml(c.pathNames.join(" / "))}</td>
        <td>${formatMoney(total)}</td>
      </tr>`;
    })
    .join("");

  appEl.innerHTML = `
    <div class="app-shell">
      <header class="page-header">
        <h1>Investment Purchase Tracker</h1>
        <p>Local-only storage in IndexedDB. Totals reflect current purchase filters and include active, non-archived records only.</p>
      </header>

      <section class="card">
        <h2>Settings</h2>
        <form id="settings-form" class="inline-form">
          <label>
            Currency code
            <input name="currencyCode" value="${escapeHtml((getSettingValue<string>("currencyCode") || DEFAULT_CURRENCY).toUpperCase())}" maxlength="3" required />
          </label>
          <button type="submit">Save settings</button>
        </form>
      </section>

      <section class="grid-two">
        <section class="card">
          <h2>Create Category</h2>
          <form id="category-form" class="stack-form">
            <label>Name<input name="name" required /></label>
            <label>Parent category
              <select name="parentId">
                <option value="">(root)</option>
                ${rootCategoryOptions}
              </select>
            </label>
            <button type="submit">Add category</button>
          </form>
        </section>

        <section class="card">
          <h2>Create Purchase</h2>
          <form id="purchase-form" class="stack-form">
            <label>Date<input type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0, 10)}" /></label>
            <label>Product name<input name="productName" required /></label>
            <label>Quantity<input type="number" step="any" min="0" name="quantity" required /></label>
            <label>Total price<input type="number" step="0.01" min="0" name="totalPrice" required /></label>
            <label>Per-item price (optional)<input type="number" step="0.01" min="0" name="unitPrice" /></label>
            <label>Category
              <select name="categoryId" required>
                <option value="">Select category</option>
                ${rootCategoryOptions}
              </select>
            </label>
            <label class="checkbox-row"><input type="checkbox" name="active" checked /> Active (counts in totals)</label>
            <label>Notes (optional)<textarea name="notes" rows="2"></textarea></label>
            <button type="submit">Add purchase</button>
          </form>
        </section>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Categories List</h2>
          <label class="checkbox-row"><input type="checkbox" data-action="toggle-show-archived-categories" ${state.showArchivedCategories ? "checked" : ""}/> Show archived</label>
        </div>
        ${renderFilterChips("categoriesList", "Category list")}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${categoryColumns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${categoriesRowsHtml || `<tr><td colspan="${categoryColumns.length + 1}" class="empty-cell">No categories</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h2>Category Totals</h2>
        <p class="muted">Totals reflect current purchase filters and count only active, non-archived purchases.</p>
        <div class="table-wrap compact-table">
          <table>
            <thead><tr><th>Category</th><th>Total</th></tr></thead>
            <tbody>
              ${totalsRows || '<tr><td colspan="2" class="empty-cell">No visible categories</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Purchases Table</h2>
          <label class="checkbox-row"><input type="checkbox" data-action="toggle-show-archived-purchases" ${state.showArchivedPurchases ? "checked" : ""}/> Show archived</label>
        </div>
        ${renderFilterChips("purchasesTable", "Purchases")}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${purchaseColumns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${purchasesRowsHtml || `<tr><td colspan="${purchaseColumns.length + 1}" class="empty-cell">No purchases</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h2>Data Tools</h2>
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" data-action="refresh-export">Refresh export</button>
              <button type="button" data-action="download-json">Download JSON</button>
              <button type="button" data-action="download-csv">Download CSV</button>
            </div>
            <label>Export / Copy JSON
              <textarea id="export-text" rows="10" readonly>${escapeHtml(exportText)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input type="file" id="import-file" accept="application/json,.json" />
              <button type="button" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label>Import JSON (replace all)
              <textarea id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${escapeHtml(state.importText)}</textarea>
            </label>
          </div>
        </div>
        <div class="danger-zone">
          <h3>Wipe All Data</h3>
          <p>Hard delete all IndexedDB data (purchases, categories, settings). This is separate from archive/restore.</p>
          <label>Type DELETE to confirm <input id="wipe-confirm" /></label>
          <button type="button" class="danger-btn" data-action="wipe-all">Wipe all data</button>
        </div>
      </section>
    </div>
  `;
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
  await reloadData();
}

async function handleCategorySubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const name = String(fd.get("name") || "").trim();
  const parentIdRaw = String(fd.get("parentId") || "").trim();
  if (!name) return;
  const parentId = parentIdRaw || null;
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
  form.reset();
  await reloadData();
}

async function handlePurchaseSubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
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
  form.reset();
  (form.querySelector('input[name="purchaseDate"]') as HTMLInputElement | null)?.setAttribute("value", new Date().toISOString().slice(0, 10));
  (form.querySelector('input[name="purchaseDate"]') as HTMLInputElement | null)!.value = new Date().toISOString().slice(0, 10);
  (form.querySelector('input[name="active"]') as HTMLInputElement | null)!.checked = true;
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
  rec.archived = nextArchived;
  rec.archivedAt = nextArchived ? nowIso() : undefined;
  rec.updatedAt = nowIso();
  await putPurchase(rec);
  await reloadData();
}

async function setCategorySubtreeArchived(categoryId: string, nextArchived: boolean) {
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

async function renameCategory(categoryId: string) {
  const cat = await getCategory(categoryId);
  if (!cat) return;
  const nextName = window.prompt("Rename category", cat.name)?.trim();
  if (!nextName || nextName === cat.name) return;
  cat.name = nextName;
  cat.updatedAt = nowIso();
  await putCategory(cat);
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
  setState(nextState);
}

appEl.addEventListener("click", async (event) => {
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
  if (action === "rename-category") {
    const id = actionEl.dataset.id;
    if (id) await renameCategory(id);
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

appEl.addEventListener("submit", async (event) => {
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

appEl.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) return;
  if (target.id === "import-text") {
    state = { ...state, importText: target.value };
  }
});

appEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id !== "import-file") return;
  const file = target.files?.[0];
  if (!file) return;
  const text = await file.text();
  setState({ importText: text });
});

void reloadData();
