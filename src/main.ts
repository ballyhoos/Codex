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
  ExportBundle,
  ExportBundleV2,
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
type EChartsInstanceLike = {
  setOption: (option: Record<string, unknown>, opts?: Record<string, unknown>) => void;
  resize: () => void;
  dispose: () => void;
};
type EChartsLike = {
  init: (el: HTMLElement) => EChartsInstanceLike;
};

declare global {
  interface Window {
    echarts?: EChartsLike;
  }
}

let categoriesTableDt: DataTableInstanceLike | null = null;
let inventoryTableDt: DataTableInstanceLike | null = null;
let marketsDonutChart: EChartsInstanceLike | null = null;
let marketsTopChart: EChartsInstanceLike | null = null;
let marketChartsResizeHandlerAttached = false;
let marketChartsResizeTimer: number | null = null;
let dataTablesLoadHookAttached = false;
let dataTablesRetryTimer: number | null = null;
let pendingAddFilterTimer: number | null = null;
let hoveredFilterSectionViewId: ViewId | null = null;
let dataToolsOpen = false;
let investmentsOpen = false;
let expandedGrowthMarketIds = new Set<string>();
let reportDateRangeInitialized = false;
let baselineCopyStatusTimer: number | null = null;
let toastTimer: number | null = null;
let toastState: { tone: "success" | "warning" | "danger"; text: string } | null = null;

let state: AppState = {
  inventoryRecords: [],
  categories: [],
  settings: [],
  reportDateFrom: isoDateDaysAgo(365),
  reportDateTo: new Date().toISOString().slice(0, 10),
  filters: [],
  showArchivedInventory: false,
  showArchivedCategories: false,
  exportText: "",
  importText: "",
  storageUsageBytes: null,
  storageQuotaBytes: null,
};

const DEFAULT_CURRENCY = "USD";
const DEFAULT_CURRENCY_SYMBOL = "$";
const DEFAULT_DARK_MODE = false;
const DEFAULT_SHOW_MARKETS_GRAPHS = false;
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

function getOldestActiveInvestmentDate(records: InventoryRecord[]): string | null {
  let oldest: string | null = null;
  for (const record of records) {
    if (!record.active || record.archived) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.purchaseDate)) continue;
    if (!oldest || record.purchaseDate < oldest) {
      oldest = record.purchaseDate;
    }
  }
  return oldest;
}

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
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

function formatMoneyCompact(cents: number): string {
  const symbol = getSettingValue<string>("currencySymbol") || DEFAULT_CURRENCY_SYMBOL;
  const absCents = Math.abs(cents);
  const absAmount = absCents / 100;
  let value = absAmount;
  let suffix = "";
  if (absAmount >= 1_000_000_000) {
    value = absAmount / 1_000_000_000;
    suffix = "b";
  } else if (absAmount >= 1_000_000) {
    value = absAmount / 1_000_000;
    suffix = "m";
  } else if (absAmount >= 1_000) {
    value = absAmount / 1_000;
    suffix = "k";
  }
  const sign = cents < 0 ? "-" : "";
  return `${sign}${symbol}${Math.round(value)}${suffix}`;
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

function applyThemeFromSettings(settings: AppSetting[]) {
  const darkModeSetting = settings.find((s) => s.key === "darkMode")?.value;
  const isDark = typeof darkModeSetting === "boolean" ? darkModeSetting : DEFAULT_DARK_MODE;
  document.documentElement.setAttribute("data-bs-theme", isDark ? "dark" : "light");
}

function setState(next: Partial<AppState>) {
  state = { ...state, ...next };
  render();
}

function setToast(toast: { tone: "success" | "warning" | "danger"; text: string } | null) {
  if (toastTimer != null) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }
  toastState = toast;
  render();
  if (!toast) return;
  toastTimer = window.setTimeout(() => {
    toastTimer = null;
    toastState = null;
    render();
  }, 3500);
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
      dom: "t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",
      paging: true,
      pageLength: 100,
      searching: false,
      info: true,
      lengthChange: false,
      language: {
        emptyTable: "No categories",
      },
      ordering: false,
      order: [],
      columnDefs: [{ targets: -1, orderable: false }],
    });
  }

  if (inventoryTable) {
    inventoryTableDt = makeDt(inventoryTable, {
      dom: "t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",
      paging: true,
      pageLength: 100,
      searching: false,
      info: true,
      lengthChange: false,
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

type MarketWidgetDatum = {
  id: string;
  label: string;
  totalCents: number;
};

function buildMarketWidgetData(
  filteredCategories: CategoryNode[],
  categoryColumns: ColumnDef<CategoryNode>[],
  hasCategoryFilters: boolean,
): MarketWidgetDatum[] {
  const totalColumn = categoryColumns.find((c) => c.key === "computedTotalCents");
  if (!totalColumn) return [];
  const scopeRows = hasCategoryFilters ? filteredCategories : filteredCategories.filter((category) => category.parentId == null);
  return scopeRows
    .map((category) => {
      const rawValue = totalColumn.getValue(category);
      if (typeof rawValue !== "number" || !Number.isFinite(rawValue) || rawValue <= 0) return null;
      return {
        id: category.id,
        label: category.pathNames.join(" / "),
        totalCents: rawValue,
      };
    })
    .filter((row): row is MarketWidgetDatum => row != null)
    .sort((a, b) => b.totalCents - a.totalCents);
}

function showMarketChartMessage(chartId: string, message: string) {
  const chartEl = rootEl.querySelector<HTMLElement>(`#${chartId}`);
  const emptyEl = rootEl.querySelector<HTMLElement>(`[data-chart-empty-for="${chartId}"]`);
  if (chartEl) chartEl.classList.add("d-none");
  if (emptyEl) {
    emptyEl.textContent = message;
    emptyEl.hidden = false;
  }
}

function showMarketChartCanvas(chartId: string) {
  const chartEl = rootEl.querySelector<HTMLElement>(`#${chartId}`);
  const emptyEl = rootEl.querySelector<HTMLElement>(`[data-chart-empty-for="${chartId}"]`);
  if (chartEl) chartEl.classList.remove("d-none");
  if (emptyEl) emptyEl.hidden = true;
}

function disposeMarketCharts() {
  marketsDonutChart?.dispose();
  marketsTopChart?.dispose();
  marketsDonutChart = null;
  marketsTopChart = null;
}

function attachMarketChartsResizeHandler() {
  if (marketChartsResizeHandlerAttached) return;
  marketChartsResizeHandlerAttached = true;
  window.addEventListener("resize", () => {
    if (marketChartsResizeTimer != null) {
      window.clearTimeout(marketChartsResizeTimer);
    }
    marketChartsResizeTimer = window.setTimeout(() => {
      marketChartsResizeTimer = null;
      marketsDonutChart?.resize();
      marketsTopChart?.resize();
    }, 120);
  });
}

function buildGrowthChildrenByParentId(): Map<string, string[]> {
  const childrenByParentId = new Map<string, string[]>();
  for (const category of state.categories) {
    if (category.isArchived || !category.active || !category.parentId) continue;
    const list = childrenByParentId.get(category.parentId) || [];
    list.push(category.id);
    childrenByParentId.set(category.parentId, list);
  }
  for (const list of childrenByParentId.values()) {
    list.sort();
  }
  return childrenByParentId;
}

function truncateLabel(value: string, maxLength = 26): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}

function initMarketCharts(widgetData: MarketWidgetDatum[]) {
  const donutId = "markets-allocation-chart";
  const topId = "markets-top-chart";
  const donutEl = rootEl.querySelector<HTMLElement>(`#${donutId}`);
  const topEl = rootEl.querySelector<HTMLElement>(`#${topId}`);
  if (!donutEl || !topEl) return;

  if (!window.echarts) {
    showMarketChartMessage(donutId, "Chart unavailable: ECharts not loaded.");
    showMarketChartMessage(topId, "Chart unavailable: ECharts not loaded.");
    return;
  }

  if (widgetData.length === 0) {
    showMarketChartMessage(donutId, "No eligible market totals to chart.");
    showMarketChartMessage(topId, "No eligible market totals to chart.");
    return;
  }
  showMarketChartCanvas(donutId);
  showMarketChartCanvas(topId);

  const isMobile = window.matchMedia("(max-width: 767.98px)").matches;
  const isDarkTheme = document.documentElement.getAttribute("data-bs-theme") === "dark";
  const chartFontSize = isMobile ? 11 : 13;
  const palette = ["#0d6efd", "#20c997", "#ffc107", "#fd7e14", "#6f42c1", "#198754", "#0dcaf0", "#dc3545"];
  const chartTextColor = isDarkTheme ? "#e9ecef" : "#212529";
  const mutedTextColor = isDarkTheme ? "#ced4da" : "#495057";
  const valueLabelColor = isDarkTheme ? "#f8f9fa" : "#212529";
  const donutSeriesData = widgetData.map((row) => ({ name: row.label, value: row.totalCents }));
  const topRows = widgetData.slice(0, 5);
  const topRowsDisplay = [...topRows].reverse();
  const topMax = topRows.reduce((max, row) => Math.max(max, row.totalCents), 0);
  const topAxisMax = topMax > 0 ? Math.ceil(topMax * 1.2) : 1;
  marketsDonutChart = window.echarts.init(donutEl);
  marketsTopChart = window.echarts.init(topEl);

  marketsDonutChart.setOption({
    color: palette,
    tooltip: {
      trigger: "item",
      textStyle: { fontSize: chartFontSize },
      formatter: (params: { name: string; value: number; percent?: number }) =>
        `${escapeHtml(params.name)}: ${formatMoney(params.value)} (${params.percent ?? 0}%)`,
    },
    legend: isMobile
      ? {
        orient: "horizontal",
        bottom: 0,
        icon: "circle",
        textStyle: { color: chartTextColor, fontSize: chartFontSize },
      }
      : {
        orient: "vertical",
        right: 0,
        top: "center",
        icon: "circle",
        textStyle: { color: chartTextColor, fontSize: chartFontSize },
      },
    series: [
      {
        type: "pie",
        z: 10,
        radius: ["36%", "54%"],
        center: isMobile ? ["50%", "50%"] : ["46%", "50%"],
        data: donutSeriesData,
        avoidLabelOverlap: false,
        labelLayout: {
          hideOverlap: false,
        },
        minShowLabelAngle: 0,
        label: {
          show: true,
          position: "outside",
          color: "#212529",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(0, 0, 0, 0.2)",
          borderWidth: 1,
          borderRadius: 4,
          padding: [2, 5],
          fontSize: chartFontSize,
          textBorderWidth: 0,
          formatter: (params: { percent?: number }) => {
            const pct = params.percent ?? 0;
            return `${Math.round(pct)}%`;
          },
        },
        labelLine: {
          show: true,
          length: 8,
          length2: 6,
          lineStyle: {
            color: mutedTextColor,
            width: 1,
          },
        },
        emphasis: {
          label: {
            color: "#212529",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderColor: "rgba(0, 0, 0, 0.25)",
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 5],
            fontWeight: 600,
          },
        },
      },
    ],
  });

  marketsTopChart.setOption({
    color: ["#198754"],
    grid: {
      left: "4%",
      right: "4%",
      top: "8%",
      bottom: "2%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: { fontSize: chartFontSize },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const row = params[0];
        if (!row) return "";
        return `${escapeHtml(row.name)}: ${formatMoney(row.value)}`;
      },
    },
    xAxis: {
      type: "value",
      max: topAxisMax,
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: topRowsDisplay.map((row) => row.label),
      axisLabel: {
        color: mutedTextColor,
        fontSize: chartFontSize,
        formatter: (value: string) => truncateLabel(value),
      },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        type: "bar",
        data: topRowsDisplay.map((row) => row.totalCents),
        barMaxWidth: 24,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(25, 135, 84, 0.08)",
        },
        label: {
          show: true,
          position: "right",
          color: chartTextColor,
          fontSize: chartFontSize,
          formatter: (params: { value: number }) => formatMoney(params.value),
        },
      },
    ],
  });

  attachMarketChartsResizeHandler();
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
  const [inventoryRecords, categories, settings] = await Promise.all([
    listInventoryRecords(),
    listCategories(),
    listSettings(),
  ]);
  const normalizedCategories = recomputeCategoryPaths(categories).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  if (!settings.some((s) => s.key === "currencyCode")) {
    await putSetting("currencyCode", DEFAULT_CURRENCY);
    settings.push({ key: "currencyCode", value: DEFAULT_CURRENCY });
  }
  if (!settings.some((s) => s.key === "currencySymbol")) {
    await putSetting("currencySymbol", DEFAULT_CURRENCY_SYMBOL);
    settings.push({ key: "currencySymbol", value: DEFAULT_CURRENCY_SYMBOL });
  }
  if (!settings.some((s) => s.key === "darkMode")) {
    await putSetting("darkMode", DEFAULT_DARK_MODE);
    settings.push({ key: "darkMode", value: DEFAULT_DARK_MODE });
  }
  if (!settings.some((s) => s.key === "showMarketsGraphs")) {
    await putSetting("showMarketsGraphs", DEFAULT_SHOW_MARKETS_GRAPHS);
    settings.push({ key: "showMarketsGraphs", value: DEFAULT_SHOW_MARKETS_GRAPHS });
  }
  applyThemeFromSettings(settings);
  let storageUsageBytes: number | null = null;
  let storageQuotaBytes: number | null = null;
  try {
    const estimate = await navigator.storage?.estimate?.();
    storageUsageBytes = typeof estimate?.usage === "number" ? estimate.usage : null;
    storageQuotaBytes = typeof estimate?.quota === "number" ? estimate.quota : null;
  } catch {
    storageUsageBytes = null;
    storageQuotaBytes = null;
  }
  let nextReportDateFrom = state.reportDateFrom;
  let nextReportDateTo = state.reportDateTo;
  if (!reportDateRangeInitialized) {
    const oldestActiveDate = getOldestActiveInvestmentDate(inventoryRecords);
    if (oldestActiveDate) {
      nextReportDateFrom = oldestActiveDate;
    }
    nextReportDateTo = new Date().toISOString().slice(0, 10);
    reportDateRangeInitialized = true;
  }
  state = {
    ...state,
    inventoryRecords,
    categories: normalizedCategories,
    settings,
    storageUsageBytes,
    storageQuotaBytes,
    reportDateFrom: nextReportDateFrom,
    reportDateTo: nextReportDateTo,
  };
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

function syncInventoryFormBaselineValue(form: HTMLFormElement) {
  const modeEl = form.querySelector<HTMLInputElement>('input[name="mode"]');
  const totalEl = form.querySelector<HTMLInputElement>('input[name="totalPrice"]');
  const baselineEl = form.querySelector<HTMLInputElement>('input[name="baselineValue"]');
  const baselineDisplayEl = form.querySelector<HTMLInputElement>('input[name="baselineValueDisplay"]');
  if (!modeEl || !totalEl || !baselineEl) return;
  if (modeEl.value === "create") {
    baselineEl.value = totalEl.value;
  }
  if (baselineDisplayEl) {
    baselineDisplayEl.value = baselineEl.value || totalEl.value;
  }
}

function syncInventoryFormFieldsByMarket(form: HTMLFormElement) {
  const categoryEl = form.querySelector<HTMLSelectElement>('select[name="categoryId"]');
  const qtyGroupEl = form.querySelector<HTMLElement>("[data-quantity-group]");
  const qtyEl = form.querySelector<HTMLInputElement>('input[name="quantity"]');
  const baselineGroupEl = form.querySelector<HTMLElement>("[data-baseline-group]");
  const baselineDisplayEl = form.querySelector<HTMLInputElement>('input[name="baselineValueDisplay"]');
  const baselineHiddenEl = form.querySelector<HTMLInputElement>('input[name="baselineValue"]');
  const totalEl = form.querySelector<HTMLInputElement>('input[name="totalPrice"]');
  if (!categoryEl || !qtyGroupEl || !qtyEl) return;
  const selectedCategory = getCategoryById(categoryEl.value);
  const isSpot = selectedCategory?.evaluationMode === "spot";
  const isSnapshot = selectedCategory?.evaluationMode === "snapshot";
  qtyGroupEl.hidden = !isSpot;
  if (!isSpot) {
    if (!Number.isFinite(Number(qtyEl.value)) || Number(qtyEl.value) <= 0) {
      qtyEl.value = "1";
    }
    qtyEl.readOnly = true;
  } else {
    qtyEl.readOnly = false;
  }
  if (baselineGroupEl) {
    baselineGroupEl.hidden = !isSnapshot;
  }
  if (isSnapshot && baselineDisplayEl) {
    baselineDisplayEl.disabled = true;
    baselineDisplayEl.value = baselineHiddenEl?.value || totalEl?.value || "";
  }
}

function syncCategoryEvaluationFields(form: HTMLFormElement) {
  const evaluationEl = form.querySelector<HTMLSelectElement>('select[name="evaluationMode"]');
  const spotGroupEl = form.querySelector<HTMLElement>("[data-spot-value-group]");
  const spotInputEl = form.querySelector<HTMLInputElement>('input[name="spotValue"]');
  const spotCodeGroupEl = form.querySelector<HTMLElement>("[data-spot-code-group]");
  const spotCodeInputEl = form.querySelector<HTMLInputElement>('input[name="spotCode"]');
  if (!evaluationEl || !spotGroupEl || !spotInputEl || !spotCodeGroupEl || !spotCodeInputEl) return;
  const isSpot = evaluationEl.value === "spot";
  spotGroupEl.hidden = !isSpot;
  spotInputEl.disabled = !isSpot;
  spotCodeGroupEl.hidden = !isSpot;
  spotCodeInputEl.disabled = !isSpot;
}

function getParentCategoryName(category: CategoryNode): string {
  return category.parentId ? getCategoryById(category.parentId)?.name || "(Unknown)" : "";
}

function formatCategoryEvaluationMode(category: CategoryNode): string {
  if (category.evaluationMode === "spot") return "Spot";
  if (category.evaluationMode === "snapshot") return "Snapshot";
  return "";
}

function getColumnAlignClass<Row>(col: ColumnDef<Row>): string {
  return col.align === "right" ? "col-align-right" : col.align === "center" ? "col-align-center" : "";
}

function isInventoryRecordCountableForCategoryMetrics(record: InventoryRecord): boolean {
  return record.active && !record.archived;
}

function buildCategoryMetricMaps() {
  const persistentInventoryForCategoryMetrics = state.inventoryRecords.filter(isInventoryRecordCountableForCategoryMetrics);
  const visibleCategoriesForTotals = state.categories.filter((c) => !c.isArchived);
  const categoryTotals = computeCategoryTotals(persistentInventoryForCategoryMetrics, visibleCategoriesForTotals);
  const categoriesById = new Map(state.categories.map((c) => [c.id, c] as const));
  const categoryQty = new Map<string, number>();
  for (const p of persistentInventoryForCategoryMetrics) {
    const purchaseCategory = categoriesById.get(p.categoryId);
    if (!purchaseCategory) continue;
    for (const categoryId of purchaseCategory.pathIds) {
      categoryQty.set(categoryId, (categoryQty.get(categoryId) || 0) + p.quantity);
    }
  }
  return { categoryTotals, categoryQty };
}

function buildCategoryDisplayTotalsMap(categoryTotals: Map<string, number>, categoryQty: Map<string, number>) {
  const childrenByParentId = new Map<string, CategoryNode[]>();
  state.categories.forEach((category) => {
    if (!category.parentId) return;
    if (category.isArchived) return;
    const siblings = childrenByParentId.get(category.parentId) || [];
    siblings.push(category);
    childrenByParentId.set(category.parentId, siblings);
  });
  const computedTotalByCategoryId = new Map<string, number>();
  const computeCategoryDisplayTotal = (categoryId: string): number => {
    const cached = computedTotalByCategoryId.get(categoryId);
    if (cached != null) return cached;
    const category = getCategoryById(categoryId);
    if (!category || category.isArchived) {
      computedTotalByCategoryId.set(categoryId, 0);
      return 0;
    }
    let total = 0;
    const children = childrenByParentId.get(category.id) || [];
    if (children.length > 0) {
      total = children.reduce((sum, child) => sum + computeCategoryDisplayTotal(child.id), 0);
    } else if (category.evaluationMode === "snapshot") {
      total = categoryTotals.get(category.id) || 0;
    } else if (category.evaluationMode === "spot" && category.spotValueCents != null) {
      total = (categoryQty.get(category.id) || 0) * category.spotValueCents;
    } else {
      total = categoryTotals.get(category.id) || 0;
    }
    computedTotalByCategoryId.set(categoryId, total);
    return total;
  };
  state.categories.forEach((category) => {
    if (category.isArchived) return;
    computeCategoryDisplayTotal(category.id);
  });
  return computedTotalByCategoryId;
}

function buildInventoryColumns(): ColumnDef<InventoryRecord>[] {
  return [
    { key: "productName", label: "Name", getValue: (r) => r.productName, getDisplay: (r) => r.productName, filterable: true, filterOp: "contains" },
    {
      key: "categoryId",
      label: "Market",
      getValue: (r) => r.categoryId,
      getDisplay: (r) => getCategoryPathLabelWithStatus(r.categoryId),
      filterable: true,
      filterOp: "inCategorySubtree",
    },
    {
      key: "quantity",
      label: "Qty",
      getValue: (r) => (getCategoryById(r.categoryId)?.evaluationMode === "spot" ? r.quantity : ""),
      getDisplay: (r) => (getCategoryById(r.categoryId)?.evaluationMode === "spot" ? String(r.quantity) : "-"),
      filterable: true,
      filterOp: "eq",
    },
    {
      key: "unitPriceCents",
      label: "Unit",
      getValue: (r) =>
        getCategoryById(r.categoryId)?.evaluationMode === "spot"
          ? (r.unitPriceCents ?? Math.round(r.totalPriceCents / r.quantity))
          : "",
      getDisplay: (r) =>
        getCategoryById(r.categoryId)?.evaluationMode === "spot"
          ? formatMoney(r.unitPriceCents ?? Math.round(r.totalPriceCents / r.quantity))
          : "-",
      filterable: true,
      filterOp: "eq",
      align: "right",
    },
    { key: "totalPriceCents", label: "Total", getValue: (r) => r.totalPriceCents, getDisplay: (r) => formatMoney(r.totalPriceCents), filterable: true, filterOp: "eq", align: "right" },
    { key: "purchaseDate", label: "Date", getValue: (r) => r.purchaseDate, getDisplay: (r) => r.purchaseDate, filterable: true, filterOp: "eq" },
    { key: "active", label: "Active", getValue: (r) => r.active, getDisplay: (r) => (r.active ? "Active" : "Inactive"), filterable: true, filterOp: "eq" },
  ];
}

function buildCategoryColumns(): ColumnDef<CategoryNode>[] {
  return [
    { key: "name", label: "Name", getValue: (r) => r.name, getDisplay: (r) => r.name, filterable: true, filterOp: "contains" },
    { key: "path", label: "Market", getValue: (r) => r.pathNames.join(" / "), getDisplay: (r) => r.pathNames.join(" / "), filterable: true, filterOp: "contains" },
    {
      key: "spotValueCents",
      label: "Spot",
      getValue: (r) => r.spotValueCents ?? "",
      getDisplay: (r) => (r.spotValueCents == null ? "" : formatMoney(r.spotValueCents)),
      filterable: true,
      filterOp: "eq",
      align: "right",
    },
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
  const leadingCategoryColumns = baseCategoryColumns.filter((c) => c.key === "name" || c.key === "parent" || c.key === "path");
  const trailingCategoryColumns = baseCategoryColumns.filter((c) => c.key !== "name" && c.key !== "parent" && c.key !== "path");
  const categoryDescendantsMap = buildDescendantMap(state.categories);

  const filteredInventoryRecords = applyViewFilters(
    getInventoryBaseRows(),
    state.filters,
    "inventoryTable",
    inventoryColumns,
    { categoryDescendantsMap },
  );
  const { categoryTotals, categoryQty } = buildCategoryMetricMaps();
  const computedTotalByCategoryId = buildCategoryDisplayTotalsMap(categoryTotals, categoryQty);
  const categoryColumns: ColumnDef<CategoryNode>[] = [
    ...leadingCategoryColumns,
    {
      key: "computedQty",
      label: "Qty",
      getValue: (r) => categoryQty.get(r.id) || 0,
      getDisplay: (r) => String(categoryQty.get(r.id) || 0),
      filterable: true,
      filterOp: "eq",
    },
    {
      key: "computedInvestmentCents",
      label: "Investment",
      getValue: (r) => categoryTotals.get(r.id) || 0,
      getDisplay: (r) => formatMoney(categoryTotals.get(r.id) || 0),
      filterable: true,
      filterOp: "eq",
      align: "right",
    },
    ...trailingCategoryColumns,
    {
      key: "computedTotalCents",
      label: "Total",
      getValue: (r) => {
        return computedTotalByCategoryId.get(r.id) || 0;
      },
      getDisplay: (r) => {
        return formatMoney(computedTotalByCategoryId.get(r.id) || 0);
      },
      filterable: true,
      filterOp: "eq",
      align: "right",
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
    categoryQty,
  };
}

function renderFilterChips(viewId: ViewId, title: string, rightSideHtml = "") {
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
      ${rightSideHtml ? `<div class="chips-clear-btn">${rightSideHtml}</div>` : ""}
    </div>
  `;
}

function renderClickableCell<Row>(viewId: ViewId, row: Row, col: ColumnDef<Row>): string {
  const rawValue = col.getValue(row);
  const display = col.getDisplay(row);
  const value = rawValue == null ? "" : String(rawValue);
  const alignClass = col.align === "right" ? "text-end" : col.align === "center" ? "text-center" : "text-start";
  if (!col.filterable) return escapeHtml(display);
  const isEmptyDisplay = display.trim() === "";
  if (isEmptyDisplay) {
    return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${alignClass} align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="isEmpty" data-value="" data-label="${escapeHtml(`${col.label}: Empty`)}" title="Filter ${escapeHtml(col.label)} by empty value"><span class="filter-hit">—</span></button>`;
  }
  if (viewId === "inventoryTable" && col.key === "categoryId" && typeof row === "object" && row && "categoryId" in (row as object)) {
    const categoryId = String((row as Record<string, unknown>).categoryId);
    const inactive = hasInactiveCategoryInPath(categoryId);
    return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${alignClass} align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}"><span class="filter-hit">${escapeHtml(display)}${inactive ? ' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>' : ""}</span></button>`;
  }
  if (viewId === "categoriesList" && col.key === "parent" && typeof row === "object" && row && "parentId" in (row as object)) {
    const parentId = (row as { parentId?: unknown }).parentId;
    if (typeof parentId === "string" && parentId) {
      return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${alignClass} align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}" data-cross-inventory-category-id="${escapeHtml(parentId)}"><span class="filter-hit">${escapeHtml(display)}</span></button>`;
    }
  }
  if (viewId === "categoriesList" && (col.key === "name" || col.key === "path") && typeof row === "object" && row && "id" in (row as object)) {
    const categoryId = String((row as Record<string, unknown>).id);
    return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${alignClass} align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}" data-cross-inventory-category-id="${escapeHtml(categoryId)}"><span class="filter-hit">${escapeHtml(display)}</span></button>`;
  }
  return `<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${alignClass} align-baseline" data-action="add-filter" data-view-id="${viewId}" data-field="${escapeHtml(col.key)}" data-op="${escapeHtml(col.filterOp || "eq")}" data-value="${escapeHtml(value)}" data-label="${escapeHtml(`${col.label}: ${display}`)}"><span class="filter-hit">${escapeHtml(display)}</span></button>`;
}

function formatFooterNumber(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (Number.isInteger(value)) return String(value);
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

function renderTableFooter<Row>(columns: ColumnDef<Row>[], rows: Row[]): string {
  const cells = columns.map((col, index) => {
    let sum = 0;
    let hasNumeric = false;
    for (const row of rows) {
      const raw = col.getValue(row);
      if (typeof raw === "number" && Number.isFinite(raw)) {
        sum += raw;
        hasNumeric = true;
      }
    }
    const text = hasNumeric
      ? (String(col.key).toLowerCase().includes("cents") ? formatMoney(sum) : formatFooterNumber(sum))
      : (index === 0 ? "Totals" : "");
    return `<th class="${getColumnAlignClass(col)}">${escapeHtml(text)}</th>`;
  });
  cells.push(`<th class="actions-col" aria-hidden="true"></th>`);
  return `<tfoot><tr>${cells.join("")}</tr></tfoot>`;
}

function renderCategoryTableFooter(columns: ColumnDef<CategoryNode>[], rows: CategoryNode[]): string {
  const rowIds = new Set(rows.map((row) => row.id));
  const topLevelVisibleRows = rows.filter((row) => !row.parentId || !rowIds.has(row.parentId));
  const hierarchyAggregateKeys = new Set(["computedQty", "computedInvestmentCents", "computedTotalCents"]);
  const cells = columns.map((col, index) => {
    const sourceRows = hierarchyAggregateKeys.has(String(col.key)) ? topLevelVisibleRows : rows;
    let sum = 0;
    let hasNumeric = false;
    for (const row of sourceRows) {
      const raw = col.getValue(row);
      if (typeof raw === "number" && Number.isFinite(raw)) {
        sum += raw;
        hasNumeric = true;
      }
    }
    const text = hasNumeric
      ? (String(col.key).toLowerCase().includes("cents") ? formatMoney(sum) : formatFooterNumber(sum))
      : (index === 0 ? "Totals" : "");
    return `<th class="${getColumnAlignClass(col)}">${escapeHtml(text)}</th>`;
  });
  cells.push(`<th class="actions-col" aria-hidden="true"></th>`);
  return `<tfoot><tr>${cells.join("")}</tr></tfoot>`;
}

type GrowthReportRow = {
  marketId: string;
  marketLabel: string;
  startValueCents: number | null;
  endValueCents: number | null;
  contributionsCents: number;
  netGrowthCents: number | null;
  growthPct: number | null;
};

function parseYyyyMmDdToMs(value: string, endOfDay = false): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return Date.parse(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}Z`);
}

function normalizeScopeMarketIds(selectedMarketIds: Set<string>, descendants: Map<string, Set<string>>): string[] {
  const ids = [...selectedMarketIds];
  const normalized = ids.filter((id) => {
    for (const other of ids) {
      if (other === id) continue;
      const subtree = descendants.get(other);
      if (subtree?.has(id)) return false;
    }
    return true;
  });
  return normalized;
}

function getReportScopeMarketIds(categoryDescendantsMap: Map<string, Set<string>>): string[] {
  const parentCategoryFilterIds = new Set(
    state.filters
      .filter((f) => f.viewId === "categoriesList")
      .map((f) => f.id),
  );
  const linkedMarketIds = new Set(
    state.filters
      .filter(
        (f) =>
          f.viewId === "inventoryTable" &&
          f.field === "categoryId" &&
          f.op === "inCategorySubtree" &&
          !!f.linkedToFilterId &&
          parentCategoryFilterIds.has(f.linkedToFilterId),
      )
      .map((f) => f.value),
  );
  if (linkedMarketIds.size > 0) {
    return normalizeScopeMarketIds(linkedMarketIds, categoryDescendantsMap);
  }
  return state.categories
    .filter((c) => !c.isArchived && c.active && c.parentId == null)
    .map((c) => c.id);
}

function buildGrowthReportRows(categoryDescendantsMap: Map<string, Set<string>>): {
  scopeMarketIds: string[];
  rows: GrowthReportRow[];
  childRowsByParent: Record<string, GrowthReportRow[]>;
  startTotalCents: number;
  endTotalCents: number;
  contributionsTotalCents: number;
  netGrowthTotalCents: number;
  hasManualSnapshots: boolean;
} {
  const scopeMarketIds = getReportScopeMarketIds(categoryDescendantsMap);
  const childrenByParentId = buildGrowthChildrenByParentId();
  const { categoryTotals, categoryQty } = buildCategoryMetricMaps();
  const computedTotalByCategoryId = buildCategoryDisplayTotalsMap(categoryTotals, categoryQty);
  const baselineTotalsByMarketId = new Map<string, number>();
  for (const record of state.inventoryRecords) {
    if (!isInventoryRecordCountableForCategoryMetrics(record)) continue;
    const baseline = record.baselineValueCents ?? 0;
    if (!Number.isFinite(baseline)) continue;
    const category = getCategoryById(record.categoryId);
    if (!category) continue;
    for (const marketId of category.pathIds) {
      baselineTotalsByMarketId.set(
        marketId,
        (baselineTotalsByMarketId.get(marketId) || 0) + baseline,
      );
    }
  }
  const rows: GrowthReportRow[] = [];
  const childRowsByParent: Record<string, GrowthReportRow[]> = {};
  let startTotalCents = 0;
  let endTotalCents = 0;
  let contributionsTotalCents = 0;
  let netGrowthTotalCents = 0;
  const makePlaceholderRow = (marketId: string): GrowthReportRow | null => {
    const market = getCategoryById(marketId);
    if (!market) return null;
    const startValueCents = baselineTotalsByMarketId.get(marketId) || 0;
    const endValueCents = computedTotalByCategoryId.get(marketId) || 0;
    const netGrowthCents = endValueCents - startValueCents;
    const growthPct = startValueCents > 0 ? netGrowthCents / startValueCents : null;
    return {
      marketId,
      marketLabel: market.pathNames.join(" / "),
      startValueCents,
      endValueCents,
      contributionsCents: endValueCents - startValueCents,
      netGrowthCents,
      growthPct,
    };
  };

  const visited = new Set<string>();
  const buildChildRows = (marketId: string): GrowthReportRow[] => {
    if (visited.has(marketId)) return [];
    visited.add(marketId);
    return (childrenByParentId.get(marketId) || [])
      .map((childId) => makePlaceholderRow(childId))
      .filter((child): child is GrowthReportRow => child != null)
      .sort((a, b) => a.marketLabel.localeCompare(b.marketLabel));
  };

  for (const marketId of scopeMarketIds) {
    const row = makePlaceholderRow(marketId);
    if (!row) continue;
    childRowsByParent[marketId] = buildChildRows(marketId);
    startTotalCents += row.startValueCents || 0;
    endTotalCents += row.endValueCents || 0;
    contributionsTotalCents += row.contributionsCents || 0;
    netGrowthTotalCents += row.netGrowthCents || 0;
    rows.push(row);
  }

  // Keep footer totals locked to the same Start/End basis used by rows.
  contributionsTotalCents = endTotalCents - startTotalCents;
  netGrowthTotalCents = endTotalCents - startTotalCents;

  return {
    scopeMarketIds,
    rows,
    childRowsByParent,
    startTotalCents,
    endTotalCents,
    contributionsTotalCents,
    netGrowthTotalCents,
    hasManualSnapshots: false,
  };
}

function formatPercent(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

function getGrowthToneClass(value: number | null): string {
  if (value == null || !Number.isFinite(value) || value === 0) return "text-body-secondary";
  return value > 0 ? "text-success" : "text-danger";
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
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${getSettingValue<boolean>("darkMode") ?? DEFAULT_DARK_MODE ? "checked" : ""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${getSettingValue<boolean>("showMarketsGraphs") ?? DEFAULT_SHOW_MARKETS_GRAPHS ? "checked" : ""} />
                  <span class="form-check-label">Show Markets graphs</span>
                </label>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
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
    return `
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${editing ? "Edit Market" : "Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${editing ? "edit" : "create"}" />
            <input type="hidden" name="categoryId" value="${escapeHtml(category?.id || "")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${escapeHtml(category?.name || "")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${categoryOptions(excludedIds, category?.parentId || null)}
              </select>
            </label>
            <label class="form-label mb-0">Evaluation
              <select class="form-select" name="evaluationMode">
                <option value="" ${!category?.evaluationMode ? "selected" : ""}></option>
                <option value="spot" ${category?.evaluationMode === "spot" ? "selected" : ""}>Spot</option>
                <option value="snapshot" ${category?.evaluationMode === "snapshot" ? "selected" : ""}>Snapshot</option>
              </select>
            </label>
            <label class="form-label mb-0" data-spot-value-group ${category?.evaluationMode === "spot" ? "" : "hidden"}>
              Value
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${escapeHtml(moneyInputFromCents(category?.spotValueCents))}" ${category?.evaluationMode === "spot" ? "" : "disabled"} />
              </div>
            </label>
            <label class="form-label mb-0" data-spot-code-group ${category?.evaluationMode === "spot" ? "" : "hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${escapeHtml(category?.spotCode || "")}"
                ${category?.evaluationMode === "spot" ? "" : "disabled"}
              />
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${category ? (category.active !== false ? "checked" : "") : "checked"} /> <span class="form-check-label">Active</span></label>
            <div class="modal-footer px-0 pb-0">
              ${editing && category ? `<button type="button" class="btn ${category.isArchived ? "btn-outline-success" : "btn-danger archive-record-btn"} me-auto" data-action="toggle-category-subtree-archived" data-id="${category.id}" data-next-archived="${String(!category.isArchived)}">${category.isArchived ? "Restore Record" : "Archive Record"}</button>` : ""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
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
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="inventoryId" value="" />
            <input type="hidden" name="baselineValue" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0, 10)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${categoryOptions()}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
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
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" checked /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3"></textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
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
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${escapeHtml(purchase.id)}" />
            <input type="hidden" name="baselineValue" value="${escapeHtml(moneyInputFromCents(purchase.baselineValueCents))}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${escapeHtml(purchase.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${categoryOptions(undefined, purchase.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${escapeHtml(purchase.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${escapeHtml(String(purchase.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${escapeHtml(moneyInputFromCents(purchase.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="${escapeHtml(moneyInputFromCents(purchase.baselineValueCents ?? purchase.totalPriceCents))}" disabled />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${escapeHtml(currencySymbol)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${escapeHtml(moneyInputFromCents(purchase.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${purchase.active ? "checked" : ""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${escapeHtml(purchase.notes || "")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${purchase.archived ? "btn-outline-success" : "btn-danger archive-record-btn"} me-auto" data-action="toggle-inventory-archived" data-id="${purchase.id}" data-next-archived="${String(!purchase.archived)}">${purchase.archived ? "Restore Record" : "Archive Record"}</button>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
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
  const prevScrollX = window.scrollX;
  const prevScrollY = window.scrollY;
  const existingDataTools = rootEl.querySelector<HTMLDetailsElement>('details[data-section="data-tools"]');
  if (existingDataTools) {
    dataToolsOpen = existingDataTools.open;
  }
  const existingInvestments = rootEl.querySelector<HTMLDetailsElement>('details[data-section="investments"]');
  if (existingInvestments) {
    investmentsOpen = existingInvestments.open;
  }
  disposeMarketCharts();
  destroyDataTables();

  const {
    inventoryColumns,
    categoryColumns,
    categoryDescendantsMap,
    filteredInventoryRecords,
    filteredCategories,
    categoryTotals,
  } = getDerived();
  const hasCategoryFilters = state.filters.some((filter) => filter.viewId === "categoriesList");
  const marketWidgetData = buildMarketWidgetData(filteredCategories, categoryColumns, hasCategoryFilters);
  const report = buildGrowthReportRows(categoryDescendantsMap);
  const showMarketsGraphs = getSettingValue<boolean>("showMarketsGraphs") ?? DEFAULT_SHOW_MARKETS_GRAPHS;
  const validExpandedGrowthMarketIds = new Set(
    [...expandedGrowthMarketIds].filter((id) => (report.childRowsByParent[id]?.length || 0) > 0),
  );
  if (validExpandedGrowthMarketIds.size !== expandedGrowthMarketIds.size) {
    expandedGrowthMarketIds = validExpandedGrowthMarketIds;
  }
  const reportGrowthPct = report.startTotalCents > 0 ? report.netGrowthTotalCents / report.startTotalCents : null;

  const exportText = state.exportText || buildExportJsonText();
  const inventoryRowsHtml = filteredInventoryRecords
    .map((p) => {
      const rowClass = [!isInventoryRecordEffectivelyActive(p) ? "row-inactive" : "", p.archived ? "row-archived" : ""].filter(Boolean).join(" ");
      return `
        <tr class="${rowClass}" data-row-edit="inventory" data-id="${p.id}">
          ${inventoryColumns.map((col) => `<td class="${getColumnAlignClass(col)}">${renderClickableCell("inventoryTable", p, col)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${p.id}">Edit</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const filteredCategoryIdSet = new Set(filteredCategories.map((c) => c.id));
  const filteredChildrenByParentId = new Map<string | null, CategoryNode[]>();
  for (const category of filteredCategories) {
    const parentId = category.parentId && filteredCategoryIdSet.has(category.parentId) ? category.parentId : null;
    const siblings = filteredChildrenByParentId.get(parentId) || [];
    siblings.push(category);
    filteredChildrenByParentId.set(parentId, siblings);
  }
  for (const siblingList of filteredChildrenByParentId.values()) {
    siblingList.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }
  const orderedCategoriesForTable: Array<{ category: CategoryNode; depth: number }> = [];
  const visitCategory = (parentId: string | null, depth: number) => {
    const children = filteredChildrenByParentId.get(parentId) || [];
    for (const child of children) {
      orderedCategoriesForTable.push({ category: child, depth });
      visitCategory(child.id, depth + 1);
    }
  };
  visitCategory(null, 0);

  const categoriesRowsHtml = orderedCategoriesForTable
    .map(({ category: c, depth }) => `
      <tr class="${[!c.active ? "row-inactive" : "", c.isArchived ? "row-archived" : ""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${c.id}">
        ${
          categoryColumns
            .map((col) => {
              if (col.key === "name") {
                const indentRem = depth > 0 ? (depth - 1) * 1.1 : 0;
                return `<td class="${getColumnAlignClass(col)}"><div class="market-name-wrap" style="padding-left:${indentRem.toFixed(2)}rem">${depth > 0 ? '<span class="market-child-icon" aria-hidden="true">↳</span>' : ""}${renderClickableCell("categoriesList", c, col)}</div></td>`;
              }
              return `<td class="${getColumnAlignClass(col)}">${renderClickableCell("categoriesList", c, col)}</td>`;
            })
            .join("")
        }
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
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
          </div>
        </div>
        ${toastState ? `<div class="alert alert-${toastState.tone} py-1 px-2 mt-2 mb-0 small" role="status">${escapeHtml(toastState.text)}</div>` : ""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          <p class="small text-body-secondary mb-2">
            Scope: ${report.scopeMarketIds.length ? `${report.scopeMarketIds.length} market${report.scopeMarketIds.length === 1 ? "" : "s"} (Markets filter)` : "No scoped markets"}
          </p>
          ${report.rows.length === 0 ? `
            <p class="mb-0 text-body-secondary">${
              "No growth data available for this scope."
            }</p>
          ` : `
            <div class="table-wrap table-responsive">
              <table class="table table-striped table-sm align-middle mb-0 dataTable">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th class="text-end">Start</th>
                    <th class="text-end">End</th>
                    <th class="text-end">Growth</th>
                    <th class="text-end">Growth %</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.rows.map((row) => {
                    const childRows = report.childRowsByParent[row.marketId] || [];
                    const expanded = expandedGrowthMarketIds.has(row.marketId);
                    return `
                      <tr class="growth-parent-row">
                        <td>
                          ${
                            childRows.length > 0
                              ? `<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${escapeHtml(row.marketId)}" aria-label="${expanded ? "Collapse" : "Expand"} child markets">${expanded ? "▾" : "▸"}</button>`
                              : `<span class="growth-expand-placeholder" aria-hidden="true"></span>`
                          }
                          ${escapeHtml(row.marketLabel)}
                        </td>
                      <td class="text-end">${row.startValueCents == null ? "—" : escapeHtml(formatMoney(row.startValueCents))}</td>
                      <td class="text-end">${row.endValueCents == null ? "—" : escapeHtml(formatMoney(row.endValueCents))}</td>
                      <td class="text-end ${getGrowthToneClass(row.netGrowthCents)}">${row.netGrowthCents == null ? "—" : escapeHtml(formatMoney(row.netGrowthCents))}</td>
                      <td class="text-end ${getGrowthToneClass(row.growthPct)}">${escapeHtml(formatPercent(row.growthPct))}</td>
                      </tr>
                      ${childRows
                        .map(
                          (child) => `
                            <tr class="growth-child-row" data-parent-market-id="${escapeHtml(row.marketId)}" ${expanded ? "" : "hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${escapeHtml(child.marketLabel)}</td>
                              <td class="text-end">${child.startValueCents == null ? "—" : escapeHtml(formatMoney(child.startValueCents))}</td>
                              <td class="text-end">${child.endValueCents == null ? "—" : escapeHtml(formatMoney(child.endValueCents))}</td>
                              <td class="text-end ${getGrowthToneClass(child.netGrowthCents)}">${child.netGrowthCents == null ? "—" : escapeHtml(formatMoney(child.netGrowthCents))}</td>
                              <td class="text-end ${getGrowthToneClass(child.growthPct)}">${escapeHtml(formatPercent(child.growthPct))}</td>
                            </tr>
                          `,
                        )
                        .join("")}
                    `;
                  }).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${escapeHtml(formatMoney(report.startTotalCents))}</th>
                    <th class="text-end">${escapeHtml(formatMoney(report.endTotalCents))}</th>
                    <th class="text-end ${getGrowthToneClass(report.netGrowthTotalCents)}">${escapeHtml(formatMoney(report.netGrowthTotalCents))}</th>
                    <th class="text-end ${getGrowthToneClass(reportGrowthPct)}">${escapeHtml(formatPercent(reportGrowthPct))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `}
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        <div class="section-head markets-section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 justify-content-end markets-section-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${showMarketsGraphs ? `
          <div class="markets-widget-grid mb-2">
            <article class="markets-widget-card card border-0">
              <div class="card-body p-0 p-md-1">
                <div class="markets-chart-frame">
                  <div id="markets-top-chart" class="markets-chart-canvas" role="img" aria-label="Top markets by value chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-top-chart" hidden></p>
                </div>
              </div>
            </article>
            <article class="markets-widget-card card border-0">
              <div class="card-body p-0 p-md-1">
                <div class="markets-chart-frame">
                  <div id="markets-allocation-chart" class="markets-chart-canvas" role="img" aria-label="Market allocation chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-allocation-chart" hidden></p>
                </div>
              </div>
            </article>
          </div>
        ` : ""}
        ${renderFilterChips(
          "categoriesList",
          "Markets",
          `<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${state.showArchivedCategories ? "checked" : ""}/> <span class="form-check-label">Show archived</span></label>`,
        )}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${categoryColumns.map((c) => `<th class="${getColumnAlignClass(c)}">${escapeHtml(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${categoriesRowsHtml}
            </tbody>
            ${renderCategoryTableFooter(categoryColumns, filteredCategories)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${investmentsOpen ? "open" : ""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${renderFilterChips(
            "inventoryTable",
            "Investments",
            `<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${state.showArchivedInventory ? "checked" : ""}/> <span class="form-check-label">Show archived</span></label>`,
          )}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${inventoryColumns.map((c) => `<th class="${getColumnAlignClass(c)}">${escapeHtml(c.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${inventoryRowsHtml}
              </tbody>
              ${renderTableFooter(inventoryColumns, filteredInventoryRecords)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${dataToolsOpen ? "open" : ""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${
                state.storageUsageBytes == null
                  ? "Unavailable"
                  : state.storageQuotaBytes == null
                    ? escapeHtml(formatBytes(state.storageUsageBytes))
                    : `${escapeHtml(formatBytes(state.storageUsageBytes))} of ${escapeHtml(formatBytes(state.storageQuotaBytes))}`
              }
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
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
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${escapeHtml(state.importText)}</textarea>
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
  if (purchaseForm) {
    syncInventoryFormFieldsByMarket(purchaseForm);
    syncInventoryFormUnitPrice(purchaseForm);
    syncInventoryFormBaselineValue(purchaseForm);
  }
  const categoryForm = rootEl.querySelector<HTMLFormElement>("#category-form");
  if (categoryForm) syncCategoryEvaluationFields(categoryForm);
  syncModalFocus();
  initMarketCharts(marketWidgetData);
  initDataTables();
  window.scrollTo(prevScrollX, prevScrollY);
}

function setGrowthChildrenExpandedInDom(marketId: string, expanded: boolean) {
  const childRows = rootEl.querySelectorAll<HTMLTableRowElement>(`tr.growth-child-row[data-parent-market-id="${marketId}"]`);
  if (!childRows.length) return;
  for (const row of childRows) {
    row.hidden = !expanded;
  }
  const toggleBtn = rootEl.querySelector<HTMLButtonElement>(
    `button[data-action="toggle-growth-children"][data-market-id="${marketId}"]`,
  );
  if (toggleBtn) {
    toggleBtn.textContent = expanded ? "▾" : "▸";
    toggleBtn.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} child markets`);
  }
}

function buildExportBundle(): ExportBundleV2 {
  return {
    schemaVersion: 2,
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
  const darkMode = fd.get("darkMode") === "on";
  const showMarketsGraphs = fd.get("showMarketsGraphs") === "on";
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
  await putSetting("darkMode", darkMode);
  await putSetting("showMarketsGraphs", showMarketsGraphs);
  closeModal();
  await reloadData();
}

async function handleCategorySubmit(form: HTMLFormElement) {
  const fd = new FormData(form);
  const mode = String(fd.get("mode") || "create");
  const categoryIdInput = String(fd.get("categoryId") || "").trim();
  const name = String(fd.get("name") || "").trim();
  const parentIdRaw = String(fd.get("parentId") || "").trim();
  const evaluationModeRaw = String(fd.get("evaluationMode") || "").trim();
  const spotValueRaw = String(fd.get("spotValue") || "").trim();
  const spotCodeRaw = String(fd.get("spotCode") || "").trim();
  const active = fd.get("active") === "on";
  const evaluationMode = evaluationModeRaw === "spot" || evaluationModeRaw === "snapshot" ? evaluationModeRaw : undefined;
  const parsedSpotValueCents = evaluationMode === "spot"
    ? (spotValueRaw ? parseMoneyToCents(spotValueRaw) : undefined)
    : undefined;
  const spotCode = evaluationMode === "spot" && spotCodeRaw ? spotCodeRaw : undefined;
  if (!name) return;
  if (evaluationMode === "spot" && spotValueRaw && parsedSpotValueCents == null) {
    alert("Spot value is invalid.");
    return;
  }
  const spotValueCents = parsedSpotValueCents == null ? undefined : parsedSpotValueCents;
  const parentId = parentIdRaw || null;
  if (parentId && !getCategoryById(parentId)) {
    alert("Select a valid parent market.");
    return;
  }

  if (mode === "edit") {
    if (!categoryIdInput) return;
    const existing = await getCategory(categoryIdInput);
    if (!existing) {
      alert("Market not found.");
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
    existing.evaluationMode = evaluationMode;
    existing.spotValueCents = spotValueCents;
    existing.spotCode = spotCode;
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
    evaluationMode,
    spotValueCents,
    spotCode,
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
  const baselineValueRaw = String(fd.get("baselineValue") || "").trim();
  const parsedBaselineValueCents = baselineValueRaw === "" ? null : parseMoneyToCents(baselineValueRaw);
  const baselineValueCents =
    mode === "create"
      ? totalPriceCents ?? undefined
      : (parsedBaselineValueCents == null ? undefined : parsedBaselineValueCents);
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
  if (mode !== "create" && parsedBaselineValueCents != null && parsedBaselineValueCents < 0) {
    alert("Baseline value is invalid.");
    return;
  }
  if (mode !== "create" && baselineValueRaw !== "" && parsedBaselineValueCents == null) {
    alert("Baseline value is invalid.");
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
    existing.baselineValueCents = baselineValueCents;
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
    baselineValueCents,
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
  if (nextArchived) {
    rec.active = false;
  }
  rec.archivedAt = nextArchived ? nowIso() : undefined;
  rec.updatedAt = nowIso();
  await putInventoryRecord(rec);
  await reloadData();
}

async function setCategorySubtreeArchived(categoryId: string, nextArchived: boolean) {
  const rootCategory = getCategoryById(categoryId);
  if (nextArchived && rootCategory && !window.confirm(`Archive market subtree "${rootCategory.pathNames.join(" / ")}"?`)) return;
  const subtreeIds = collectSubtreeIds(state.categories, categoryId);
  const timestamp = nowIso();
  for (const id of subtreeIds) {
    const cat = await getCategory(id);
    if (!cat) continue;
    cat.isArchived = nextArchived;
    if (nextArchived) {
      cat.active = false;
    }
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
    evaluationMode: raw.evaluationMode === "spot" || raw.evaluationMode === "snapshot" ? raw.evaluationMode : "snapshot",
    spotValueCents: raw.spotValueCents == null || raw.spotValueCents === "" ? undefined : Number(raw.spotValueCents),
    spotCode: raw.spotCode == null || raw.spotCode === "" ? undefined : String(raw.spotCode),
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
  const baseline =
    raw.baselineValueCents == null || raw.baselineValueCents === ""
      ? undefined
      : Number(raw.baselineValueCents);
  const unit = raw.unitPriceCents == null || raw.unitPriceCents === "" ? undefined : Number(raw.unitPriceCents);
  return {
    id: String(raw.id),
    purchaseDate: String(raw.purchaseDate),
    productName: String(raw.productName),
    quantity,
    totalPriceCents,
    baselineValueCents: Number.isFinite(baseline) ? baseline : undefined,
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
  let parsed: ExportBundle | any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    alert("Import JSON is not valid.");
    return;
  }
  if (parsed?.schemaVersion !== 1 && parsed?.schemaVersion !== 2) {
    alert("Unsupported schemaVersion. Expected 1 or 2.");
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
        { key: "darkMode", value: DEFAULT_DARK_MODE },
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

  const matchesFilter = (f: FilterClause, candidate: Pick<FilterClause, "viewId" | "field" | "op" | "value">) =>
    f.viewId === candidate.viewId &&
    f.field === candidate.field &&
    f.op === candidate.op &&
    f.value === candidate.value;

  let nextFilters = addFilter(state.filters, { viewId, field, op, value, label });
  const crossInventoryCategoryId = el.dataset.crossInventoryCategoryId;
  if (crossInventoryCategoryId) {
    const category = getCategoryById(crossInventoryCategoryId);
    if (category) {
      const parentFilter = nextFilters.find((f) => matchesFilter(f, { viewId, field, op, value }));
      if (parentFilter) {
        const childLabel = `Market: ${category.pathNames.join(" / ")}`;
        nextFilters = nextFilters.filter((f) => f.linkedToFilterId !== parentFilter.id);
        const existingChildIndex = nextFilters.findIndex((f) =>
          matchesFilter(f, {
            viewId: "inventoryTable",
            field: "categoryId",
            op: "inCategorySubtree",
            value: category.id,
          }),
        );
        if (existingChildIndex >= 0) {
          const existingChild = nextFilters[existingChildIndex];
          nextFilters = [
            ...nextFilters.slice(0, existingChildIndex),
            { ...existingChild, label: childLabel, linkedToFilterId: parentFilter.id },
            ...nextFilters.slice(existingChildIndex + 1),
          ];
        } else {
          nextFilters = [
            ...nextFilters,
            {
              id: crypto.randomUUID(),
              viewId: "inventoryTable",
              field: "categoryId",
              op: "inCategorySubtree",
              value: category.id,
              label: childLabel,
              linkedToFilterId: parentFilter.id,
            },
          ];
        }
      }
    }
  }

  let nextState: Partial<AppState> = {
    filters: nextFilters,
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

function removeLatestFilterForView(viewId: ViewId) {
  const viewFilters = state.filters.filter((f) => f.viewId === viewId);
  const latest = viewFilters[viewFilters.length - 1];
  if (!latest) return;
  setState({ filters: removeFilter(state.filters, latest.id) });
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
  if (action === "apply-report-range") {
    const fromInput = rootEl.querySelector<HTMLInputElement>('input[name="reportDateFrom"]');
    const toInput = rootEl.querySelector<HTMLInputElement>('input[name="reportDateTo"]');
    if (!fromInput || !toInput) return;
    const from = fromInput.value;
    const to = toInput.value;
    const fromMs = parseYyyyMmDdToMs(from);
    const toMs = parseYyyyMmDdToMs(to, true);
    if (fromMs == null || toMs == null || fromMs > toMs) {
      setToast({ tone: "warning", text: "Select a valid report date range." });
      return;
    }
    setState({ reportDateFrom: from, reportDateTo: to });
    return;
  }
  if (action === "reset-report-range") {
    setState({ reportDateFrom: isoDateDaysAgo(365), reportDateTo: new Date().toISOString().slice(0, 10) });
    return;
  }
  if (action === "copy-total-to-baseline") {
    const form = actionEl.closest("form");
    if (!(form instanceof HTMLFormElement) || form.id !== "inventory-form") return;
    const totalEl = form.querySelector<HTMLInputElement>('input[name="totalPrice"]');
    const baselineEl = form.querySelector<HTMLInputElement>('input[name="baselineValue"]');
    const baselineDisplayEl = form.querySelector<HTMLInputElement>('input[name="baselineValueDisplay"]');
    const statusEl = form.querySelector<HTMLElement>('[data-role="baseline-copy-status"]');
    if (!totalEl || !baselineEl) return;
    baselineEl.value = totalEl.value.trim();
    if (baselineDisplayEl) {
      baselineDisplayEl.value = baselineEl.value;
    }
    if (statusEl) {
      statusEl.innerHTML = '<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>';
      if (baselineCopyStatusTimer != null) {
        window.clearTimeout(baselineCopyStatusTimer);
      }
      baselineCopyStatusTimer = window.setTimeout(() => {
        baselineCopyStatusTimer = null;
        if (statusEl.isConnected) statusEl.textContent = "";
      }, 1800);
    }
    return;
  }
  if (action === "toggle-growth-children") {
    const marketId = actionEl.dataset.marketId;
    if (!marketId) return;
    const next = new Set(expandedGrowthMarketIds);
    const willExpand = !next.has(marketId);
    if (willExpand) next.add(marketId);
    else next.delete(marketId);
    expandedGrowthMarketIds = next;
    setGrowthChildrenExpandedInDom(marketId, willExpand);
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
    downloadTextFile(`investments-app-${new Date().toISOString().slice(0, 10)}.json`, buildExportJsonText(), "application/json");
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

  if (rowEdit === "inventory") {
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
      syncInventoryFormBaselineValue(form);
    }
  }
  if (target.id === "import-text") {
    state = { ...state, importText: target.value };
    return;
  }
  if (target.name === "reportDateFrom" || target.name === "reportDateTo") {
    if (target.name === "reportDateFrom") {
      state = { ...state, reportDateFrom: target.value };
    } else {
      state = { ...state, reportDateTo: target.value };
    }
  }
});

rootEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.name === "categoryId") {
    const form = target.closest("form");
    if (form instanceof HTMLFormElement && form.id === "inventory-form") {
      syncInventoryFormFieldsByMarket(form);
      syncInventoryFormUnitPrice(form);
    }
    return;
  }
  if (target instanceof HTMLSelectElement && target.name === "evaluationMode") {
    const form = target.closest("form");
    if (form instanceof HTMLFormElement && form.id === "category-form") {
      syncCategoryEvaluationFields(form);
    }
    return;
  }
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id !== "import-file") return;
  const file = target.files?.[0];
  if (!file) return;
  const text = await file.text();
  setState({ importText: text });
});

rootEl.addEventListener("pointermove", (event) => {
  const target = getEventTargetElement(event);
  if (!target) return;
  const section = target.closest<HTMLElement>("[data-filter-section-view-id]");
  hoveredFilterSectionViewId = (section?.dataset.filterSectionViewId as ViewId | undefined) || null;
});

rootEl.addEventListener("pointerleave", () => {
  hoveredFilterSectionViewId = null;
});

document.addEventListener("keydown", (event) => {
  if (modalState.kind === "none") {
    if (event.key !== "Escape") return;
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      return;
    }
    if (!hoveredFilterSectionViewId) return;
    event.preventDefault();
    removeLatestFilterForView(hoveredFilterSectionViewId);
    return;
  }

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
