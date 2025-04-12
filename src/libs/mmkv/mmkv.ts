import { IDetailInformation } from '@/types/implement';
import { MMKV } from 'react-native-mmkv';


export class GenericMMKVStorage<T extends { id: string }> {
   private storage: MMKV;
   private prefix: string;
   private keyListKey: string;

   constructor(prefix: string) {
      this.prefix = prefix; // ví dụ: 'user', 'product'
      this.keyListKey = `${prefix}:keys`;
      this.storage = new MMKV();
   }

   private getKey(id: string) {
      return `${this.prefix}:${id}`;
   }

   private getKeyList(): string[] {
      const json = this.storage.getString(this.keyListKey);
      return json ? JSON.parse(json) : [];
   }

   private saveKeyList(keys: string[]) {
      this.storage.set(this.keyListKey, JSON.stringify(keys));
   }

   private ensureKeyExists(id: string) {
      const keys = this.getKeyList();
      if (!keys.includes(id)) {
         this.saveKeyList([...keys, id]);
      }
   }

   public get(id: string): T | undefined {
      const json = this.storage.getString(this.getKey(id));
      return json ? JSON.parse(json) : undefined;
   }

   public getAll(): T[] {
      const ids = this.getKeyList();
      return ids
         .map(id => this.get(id))
         .filter((item): item is T => item !== undefined);
   }

   public set(item: T): void {
      this.ensureKeyExists(item.id);
      this.storage.set(this.getKey(item.id), JSON.stringify(item));
   }

   public setMany(items: T[]): void {
      const keyList = this.getKeyList();
      const keySet = new Set(keyList);

      for (const item of items) {
         if (!keySet.has(item.id)) {
            keySet.add(item.id);
         }

         this.storage.set(this.getKey(item.id), JSON.stringify(item));
      }

      this.saveKeyList(Array.from(keySet));
   }

   public update(id: string, updater: Partial<T>): void {
      const item = this.get(id);
      if (!item) return;

      const updated = { ...item, ...updater };
      this.storage.set(this.getKey(id), JSON.stringify(updated));
   }

   public delete(id: string): void {
      this.storage.delete(this.getKey(id));
      const keys = this.getKeyList().filter(k => k !== id);
      this.saveKeyList(keys);
   }

   public clearAll(): void {
      const keys = this.getKeyList();
      for (const id of keys) {
         this.storage.delete(this.getKey(id));
      }
      this.storage.delete(this.keyListKey);
   }

   public getAllKeys(): string[] {
      return this.getKeyList();
   }
}

export const detailInformationStorage = new GenericMMKVStorage<IDetailInformation>('detailInformation');