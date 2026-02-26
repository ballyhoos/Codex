import { openDB } from "idb";
import type { DBSchema } from "idb";
import type { AppSetting, CategoryNode, PurchaseRecord } from "./types";

interface TrackerDB extends DBSchema {
  inventory: {
    key: string;
    value: PurchaseRecord;
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
}

export const dbPromise = openDB<TrackerDB>("investment_purchase_tracker", 1, {
  async upgrade(db, _oldVersion, _newVersion, tx) {
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

    // Backfill defaults for older records if they exist.
    if (inventoryStore) {
      let cursor = await inventoryStore.openCursor();
      while (cursor) {
        const p = cursor.value as PurchaseRecord;
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
        if (typeof c.isArchived !== "boolean") {
          c.isArchived = false;
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

export async function putInventoryRecord(record: PurchaseRecord) {
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

export async function replaceAllData(payload: {
  purchases: PurchaseRecord[];
  categories: CategoryNode[];
  settings: AppSetting[];
}) {
  const db = await dbPromise;
  const tx = db.transaction(["inventory", "categories", "settings"], "readwrite");
  await tx.objectStore("inventory").clear();
  await tx.objectStore("categories").clear();
  await tx.objectStore("settings").clear();
  for (const p of payload.purchases) await tx.objectStore("inventory").put(p);
  for (const c of payload.categories) await tx.objectStore("categories").put(c);
  for (const s of payload.settings) await tx.objectStore("settings").put(s);
  await tx.done;
}

export async function clearAllData() {
  const db = await dbPromise;
  const tx = db.transaction(["inventory", "categories", "settings"], "readwrite");
  await tx.objectStore("inventory").clear();
  await tx.objectStore("categories").clear();
  await tx.objectStore("settings").clear();
  await tx.done;
}
