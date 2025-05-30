import { IDetailInformation, IFriend, IMessage, IRoom, ISendedFriend } from '@/types/implement';
import { IRequestFriend } from '@/types/implement/response';
import { MMKV } from 'react-native-mmkv';


export class GenericMMKVStorage<T> {
   private storage: MMKV;
   private prefix: string;
   private keyListKey: string;
   private primaryField: keyof T;

   constructor(prefix: string, primaryField: keyof T) {
      this.prefix = prefix;
      this.keyListKey = `${prefix}:keys`;
      this.primaryField = primaryField;
      this.storage = new MMKV();
   }

   private getKey(primaryValue: string) {
      return `${this.prefix}:${primaryValue}`;
   }

   private getKeyList(): string[] {
      const json = this.storage.getString(this.keyListKey);
      return json ? JSON.parse(json) : [];
   }

   private saveKeyList(keys: string[]) {
      this.storage.set(this.keyListKey, JSON.stringify(keys));
   }

   private ensureKeyExists(primaryValue: string) {
      const keys = this.getKeyList();
      if (!keys.includes(primaryValue)) {
         this.saveKeyList([...keys, primaryValue]);
      }
   }

   public get(primaryValue: string): T | undefined {
      const json = this.storage.getString(this.getKey(primaryValue));
      return json ? JSON.parse(json) : undefined;
   }

   public getAll(): T[] {
      const keys = this.getKeyList();
      return keys.map(k => this.get(k)).filter((item): item is T => item !== undefined);
   }

   public set(item: T): void {
      const primaryValue = item[this.primaryField];
      if (typeof primaryValue !== 'string') {
         throw new Error(`Primary field "${String(this.primaryField)}" must be a string`);
      }

      this.ensureKeyExists(primaryValue);
      this.storage.set(this.getKey(primaryValue), JSON.stringify(item));
   }

   public setMany(items: T[]): void {
      const keyList = this.getKeyList();
      const keySet = new Set(keyList);

      for (const item of items) {
         const primaryValue = item[this.primaryField];
         if (typeof primaryValue !== 'string') {
            throw new Error(`Primary field "${String(this.primaryField)}" must be a string`);
         }

         if (!keySet.has(primaryValue)) {
            keySet.add(primaryValue);
         }

         this.storage.set(this.getKey(primaryValue), JSON.stringify(item));
      }

      this.saveKeyList(Array.from(keySet));
   }

   public update(primaryValue: string, updater: Partial<T>): void {
      const item = this.get(primaryValue);
      if (!item) return;

      const updated = { ...item, ...updater };
      this.set(updated);
   }

   public updateMany(updater: (item: T) => Partial<T>): void {
      const keys = this.getKeyList();
      for (const key of keys) {
         const item = this.get(key);
         if (item) {
            const updated = { ...item, ...updater(item) };
            this.set(updated);
         }
      }
   }

   public delete(primaryValue: string): void {
      this.storage.delete(this.getKey(primaryValue));
      const keys = this.getKeyList().filter(k => k !== primaryValue);
      this.saveKeyList(keys);
   }

   public clearAll(): void {
      const keys = this.getKeyList();
      for (const k of keys) {
         this.storage.delete(this.getKey(k));
      }
      this.storage.delete(this.keyListKey);
   }

   public getAllKeys(): string[] {
      return this.getKeyList();
   }

   public initData(initialData: T[]): void {
      const existingKeys = this.getKeyList();
      if (existingKeys.length > 0) return;
   
      this.setMany(initialData);
   }
   
}


export const detailInformationStorage = new GenericMMKVStorage<IDetailInformation>('detailInformation', 'id');
export const requestFriendStorage = new GenericMMKVStorage<IRequestFriend>('requestFriend', 'sender_id');
export const myListFriendStorage = new GenericMMKVStorage<IFriend>('myListFriend', 'accountId');
export const sendedFriendStorage = new GenericMMKVStorage<ISendedFriend>('sendedFriend', 'receiver_id');
export const roomStorage = new GenericMMKVStorage<IRoom>('room', 'id');
export const messageStorage = new GenericMMKVStorage<IMessage>('message', '_id');