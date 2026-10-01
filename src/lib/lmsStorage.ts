/**
 * LMS Local Storage & IndexedDB Persistence Layer
 *
 * Ensures all course materials, custom uploaded PDFs, bookmarks,
 * and user changes remain permanently available on this PC,
 * even after shutting down, restarting, or clearing browser cache.
 */

import { LmsPdfDocument } from "@/components/lms/LmsLibraryCard";

const DB_NAME = "fasttask_lms_db";
const DB_VERSION = 1;
const STORE_UPLOADS = "custom_uploads";
const STORE_PREFS = "user_preferences";

const LOCAL_STORAGE_BACKUP_KEY = "fasttask_course_uploads_v2";
const BOOKMARKS_KEY = "fasttask_lms_bookmarks";
const DELETED_DOCS_KEY = "fasttask_lms_deleted_docs";

function getDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_UPLOADS)) {
          db.createObjectStore(STORE_UPLOADS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_PREFS)) {
          db.createObjectStore(STORE_PREFS, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn("IndexedDB open error, falling back to local storage");
        resolve(null);
      };
    } catch (e) {
      console.warn("IndexedDB not accessible:", e);
      resolve(null);
    }
  });
}

/**
 * Save a newly uploaded course PDF permanently to IndexedDB
 */
export async function persistCoursePdfUpload(
  doc: LmsPdfDocument,
  fileBlob?: Blob | null
): Promise<void> {
  const db = await getDB();

  // Always backup lightweight metadata to localStorage
  try {
    const existing = getStoredMetadataBackup();
    const filtered = existing.filter((d) => d.id !== doc.id);
    const itemToSave = { ...doc, fileUrl: undefined };
    localStorage.setItem(
      LOCAL_STORAGE_BACKUP_KEY,
      JSON.stringify([itemToSave, ...filtered])
    );
  } catch (err) {
    console.warn("LocalStorage backup warning:", err);
  }

  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_UPLOADS, "readwrite");
      const store = tx.objectStore(STORE_UPLOADS);
      store.put({
        id: doc.id,
        metadata: { ...doc, fileUrl: undefined },
        blob: fileBlob || null,
        savedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (e) {
      console.warn("Failed to write PDF to IndexedDB:", e);
      resolve();
    }
  });
}

/**
 * Load all custom uploaded course documents and reconstruct valid Blob URLs
 * that remain active even across computer restarts.
 */
export async function loadPersistedCourseUploads(): Promise<LmsPdfDocument[]> {
  const db = await getDB();
  const backup = getStoredMetadataBackup();

  if (!db) {
    return backup;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_UPLOADS, "readonly");
      const store = tx.objectStore(STORE_UPLOADS);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = req.result || [];
        if (!records.length && backup.length > 0) {
          resolve(backup);
          return;
        }

        const documents: LmsPdfDocument[] = records.map(
          (rec: { id: string; metadata: LmsPdfDocument; blob?: Blob | null }) => {
            let activeUrl: string | undefined = undefined;
            if (rec.blob && typeof window !== "undefined") {
              try {
                activeUrl = URL.createObjectURL(rec.blob);
              } catch (e) {
                console.warn("Could not create object URL for doc", rec.id, e);
              }
            }

            return {
              ...rec.metadata,
              fileUrl: activeUrl,
            };
          }
        );

        resolve(documents);
      };

      req.onerror = () => {
        resolve(backup);
      };
    } catch {
      resolve(backup);
    }
  });
}

/**
 * Remove an uploaded document from persistent storage
 */
export async function removePersistedCourseUpload(id: string): Promise<void> {
  try {
    const existing = getStoredMetadataBackup();
    const filtered = existing.filter((d) => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(filtered));
  } catch {}

  const db = await getDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_UPLOADS, "readwrite");
      const store = tx.objectStore(STORE_UPLOADS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Bookmarks persistence across reboots
 */
export function getStoredBookmarks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const item = localStorage.getItem(BOOKMARKS_KEY);
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
}

export function saveStoredBookmark(id: string, isBookmarked: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredBookmarks();
    current[id] = isBookmarked;
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn("Failed to persist bookmark:", e);
  }
}

/**
 * Deleted Document IDs persistence across reboots
 */
export function getStoredDeletedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const item = localStorage.getItem(DELETED_DOCS_KEY);
    const parsed = item ? JSON.parse(item) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function saveStoredDeletedId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredDeletedIds();
    current.add(id);
    localStorage.setItem(DELETED_DOCS_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.warn("Failed to persist deleted document id:", e);
  }
}

function getStoredMetadataBackup(): LmsPdfDocument[] {
  if (typeof window === "undefined") return [];
  try {
    // Check both v2 and legacy key
    const raw =
      localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY) ||
      localStorage.getItem("fasttask_course_uploads");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
