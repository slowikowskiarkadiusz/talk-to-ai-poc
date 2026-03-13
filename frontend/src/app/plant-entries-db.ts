import { Injectable } from '@angular/core';
import { PlantEntry } from './records-list/records-list';

const DB_NAME = 'plant-growth-db';
const STORE_NAME = 'plant-entries';
const DB_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class PlantEntriesDb {
  private db: IDBDatabase | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getAll(): Promise<PlantEntry[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve((req.result as PlantEntry[]).reverse());
      req.onerror = () => reject(req.error);
    });
  }

  async add(entry: Omit<PlantEntry, 'id' | 'createdAt'>): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const record = { ...entry, createdAt: new Date().toISOString() };
      const req = tx.objectStore(STORE_NAME).add(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}
