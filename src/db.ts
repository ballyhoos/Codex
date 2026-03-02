import { openDB } from "idb";
import type { DBSchema } from "idb";
import type { AppSetting, CategoryNode, InventoryRecord, ValuationSnapshot } from "./types";

interface TrackerDB extends DBSchema {
  inventory: {
    key: string;
    value: InventoryRecord;
    indexes: {
      by_purchaseDate: string;
      by_productName: string;
      by_categoryId: string;
      by_active: number;
      by_archived: number;
      by_updatedAt: string;
    };
  };
  categories: {
    key: string;
    value: CategoryNode;
    indexes: {
      by_parentId: string;
      by_name: string;
      by_isArchived: number;
    };
  };
  settings: {
    key: string;
    value: AppSetting;
  };
  valuationSnapshots: {
    key: string;
    value: ValuationSnapshot;
    indexes: {
      by_capturedAt: string;
      by_scope: string;
      by_marketId: string;
      by_marketId_capturedAt: [string, string];
    };
  };
}

export const dbPromise = openDB<TrackerDB>("investment_purchase_tracker", 3, {
  async upgrade(db, _oldVersion, _newVersion, tx) {
    const legacyTx = tx as any;
    const legacyPurchasesStore = (db.objectStoreNames as any).contains("purchases")
      ? legacyTx.objectStore("purchases")
      : null;

    let inventoryStore = db.objectStoreNames.contains("inventory")
      ? tx.objectStore("inventory")
      : null;
    if (!db.objectStoreNames.contains("inventory")) {
      inventoryStore = db.createObjectStore("inventory", { keyPath: "id" });
      inventoryStore.createIndex("by_purchaseDate", "purchaseDate");
      inventoryStore.createIndex("by_productName", "productName");
      inventoryStore.createIndex("by_categoryId", "categoryId");
      inventoryStore.createIndex("by_active", "active");
      inventoryStore.createIndex("by_archived", "archived");
      inventoryStore.createIndex("by_updatedAt", "updatedAt");
    }

    // Migrate legacy "purchases" store records into "inventory" if present.
    if (inventoryStore && legacyPurchasesStore) {
      let cursor = await legacyPurchasesStore.openCursor();
      while (cursor) {
        await inventoryStore.put(cursor.value as InventoryRecord);
        cursor = await cursor.continue() as typeof cursor;
      }
    }

    let categoriesStore = db.objectStoreNames.contains("categories")
      ? tx.objectStore("categories")
      : null;
    if (!db.objectStoreNames.contains("categories")) {
      categoriesStore = db.createObjectStore("categories", { keyPath: "id" });
      categoriesStore.createIndex("by_parentId", "parentId");
      categoriesStore.createIndex("by_name", "name");
      categoriesStore.createIndex("by_isArchived", "isArchived");
    }

    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings", { keyPath: "key" });
    }
    if (!db.objectStoreNames.contains("valuationSnapshots")) {
      const valuationStore = db.createObjectStore("valuationSnapshots", { keyPath: "id" });
      valuationStore.createIndex("by_capturedAt", "capturedAt");
      valuationStore.createIndex("by_scope", "scope");
      valuationStore.createIndex("by_marketId", "marketId");
      valuationStore.createIndex("by_marketId_capturedAt", ["marketId", "capturedAt"]);
    }

    // Backfill defaults for older records if they exist.
    if (inventoryStore) {
      let cursor = await inventoryStore.openCursor();
      while (cursor) {
        const p = cursor.value as InventoryRecord;
        let changed = false;
        if (typeof p.active !== "boolean") {
          p.active = true;
          changed = true;
        }
        if (typeof p.archived !== "boolean") {
          p.archived = false;
          changed = true;
        }
        if (changed) {
          p.updatedAt = new Date().toISOString();
          await cursor.update(p);
        }
        cursor = await cursor.continue();
      }
    }

    if (categoriesStore) {
      let cursor = await categoriesStore.openCursor();
      while (cursor) {
        const c = cursor.value as CategoryNode;
        let changed = false;
        if (typeof c.active !== "boolean") {
          c.active = true;
          changed = true;
        }
        if (typeof c.isArchived !== "boolean") {
          c.isArchived = false;
          changed = true;
        }
        if (changed) {
          c.updatedAt = new Date().toISOString();
          await cursor.update(c);
        }
        cursor = await cursor.continue();
      }
    }
  },
});

export async function listInventoryRecords() {
  return (await dbPromise).getAll("inventory");
}

export async function putInventoryRecord(record: InventoryRecord) {
  await (await dbPromise).put("inventory", record);
}

export async function getInventoryRecord(id: string) {
  return (await dbPromise).get("inventory", id);
}

export async function listCategories() {
  return (await dbPromise).getAll("categories");
}

export async function putCategory(record: CategoryNode) {
  await (await dbPromise).put("categories", record);
}

export async function getCategory(id: string) {
  return (await dbPromise).get("categories", id);
}

export async function listSettings() {
  return (await dbPromise).getAll("settings");
}

export async function putSetting<T>(key: string, value: T) {
  await (await dbPromise).put("settings", { key, value });
}

export async function listValuationSnapshots() {
  return (await dbPromise).getAll("valuationSnapshots");
}

export async function putValuationSnapshot(snapshot: ValuationSnapshot) {
  await (await dbPromise).put("valuationSnapshots", snapshot);
}

export async function putValuationSnapshots(snapshots: ValuationSnapshot[]) {
  if (!snapshots.length) return;
  const db = await dbPromise;
  const tx = db.transaction("valuationSnapshots", "readwrite");
  for (const snapshot of snapshots) {
    await tx.store.put(snapshot);
  }
  await tx.done;
}

export async function replaceAllData(payload: {
  purchases: InventoryRecord[];
  categories: CategoryNode[];
  settings: AppSetting[];
  valuationSnapshots?: ValuationSnapshot[];
}) {
  const db = await dbPromise;
  const tx = db.transaction(["inventory", "categories", "settings", "valuationSnapshots"], "readwrite");
  await tx.objectStore("inventory").clear();
  await tx.objectStore("categories").clear();
  await tx.objectStore("settings").clear();
  await tx.objectStore("valuationSnapshots").clear();
  for (const p of payload.purchases) await tx.objectStore("inventory").put(p);
  for (const c of payload.categories) await tx.objectStore("categories").put(c);
  for (const s of payload.settings) await tx.objectStore("settings").put(s);
  for (const snapshot of payload.valuationSnapshots || []) await tx.objectStore("valuationSnapshots").put(snapshot);
  await tx.done;
}

export async function clearAllData() {
  const db = await dbPromise;
  const tx = db.transaction(["inventory", "categories", "settings", "valuationSnapshots"], "readwrite");
  await tx.objectStore("inventory").clear();
  await tx.objectStore("categories").clear();
  await tx.objectStore("settings").clear();
  await tx.objectStore("valuationSnapshots").clear();
  await tx.done;
}

export async function clearValuationSnapshots() {
  const db = await dbPromise;
  const tx = db.transaction("valuationSnapshots", "readwrite");
  await tx.objectStore("valuationSnapshots").clear();
  await tx.done;
}
