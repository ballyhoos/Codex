import { openDB, type DBSchema } from "idb";
import type { AppSetting, CategoryNode, PurchaseRecord } from "./types";

interface TrackerDB extends DBSchema {
  purchases: {
    key: string;
    value: PurchaseRecord;
    indexes: {
      by_purchaseDate: string;
      by_productName: string;
      by_categoryId: string;
      by_active: boolean;
      by_archived: boolean;
      by_updatedAt: string;
    };
  };
  categories: {
    key: string;
    value: CategoryNode;
    indexes: {
      by_parentId: string | null;
      by_name: string;
      by_isArchived: boolean;
    };
  };
  settings: {
    key: string;
    value: AppSetting;
  };
}

export const dbPromise = openDB<TrackerDB>("investment_purchase_tracker", 1, {
  async upgrade(db, _oldVersion, _newVersion, tx) {
    let purchasesStore = db.objectStoreNames.contains("purchases")
      ? tx.objectStore("purchases")
      : null;
    if (!db.objectStoreNames.contains("purchases")) {
      purchasesStore = db.createObjectStore("purchases", { keyPath: "id" });
      purchasesStore.createIndex("by_purchaseDate", "purchaseDate");
      purchasesStore.createIndex("by_productName", "productName");
      purchasesStore.createIndex("by_categoryId", "categoryId");
      purchasesStore.createIndex("by_active", "active");
      purchasesStore.createIndex("by_archived", "archived");
      purchasesStore.createIndex("by_updatedAt", "updatedAt");
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
    if (purchasesStore) {
      let cursor = await purchasesStore.openCursor();
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

export async function listPurchases() {
  return (await dbPromise).getAll("purchases");
}

export async function putPurchase(record: PurchaseRecord) {
  await (await dbPromise).put("purchases", record);
}

export async function getPurchase(id: string) {
  return (await dbPromise).get("purchases", id);
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
  const tx = db.transaction(["purchases", "categories", "settings"], "readwrite");
  await tx.objectStore("purchases").clear();
  await tx.objectStore("categories").clear();
  await tx.objectStore("settings").clear();
  for (const p of payload.purchases) await tx.objectStore("purchases").put(p);
  for (const c of payload.categories) await tx.objectStore("categories").put(c);
  for (const s of payload.settings) await tx.objectStore("settings").put(s);
  await tx.done;
}

export async function clearAllData() {
  const db = await dbPromise;
  const tx = db.transaction(["purchases", "categories", "settings"], "readwrite");
  await tx.objectStore("purchases").clear();
  await tx.objectStore("categories").clear();
  await tx.objectStore("settings").clear();
  await tx.done;
}
