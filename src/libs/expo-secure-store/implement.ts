import { ExpoSecureStoreKeys, getSecure, removeSecure, setSecure } from "./expo-secure-store"

class ExpoSecureValue {
   private static instance: ExpoSecureValue;

   private AccessToken: string | null = null;
   private IpDevice: string | null = null;
   private UserId: string | null = null;

   public constructor() { }

   public static getInstance(): ExpoSecureValue {
      if (!ExpoSecureValue.instance) {
         ExpoSecureValue.instance = new ExpoSecureValue;

         ExpoSecureValue.instance.initialData();
      }
      return ExpoSecureValue.instance;
   }

   public getAccessToken() {
      return this.AccessToken;
   }

   public getIpDevice() {
      return this.IpDevice;
   }
   public getUserId() {
      return this.UserId;
   }

   public async setAccessToken(key: string | null) {
      key && await setSecure(ExpoSecureStoreKeys.AccessToken, key)
      this.AccessToken = await getSecure(ExpoSecureStoreKeys.AccessToken);
   }

   public async setIpDevice(key: string | null) {
      key && await setSecure(ExpoSecureStoreKeys.IpDevice, key)
      this.IpDevice = await getSecure(ExpoSecureStoreKeys.IpDevice);
   }
   public async setUserId(key: string | null) {
      key && await setSecure(ExpoSecureStoreKeys.UserId, key)
      this.UserId = await getSecure(ExpoSecureStoreKeys.UserId);
   }

   public async removeAccessToken() {
      await removeSecure(ExpoSecureStoreKeys.AccessToken);
      this.AccessToken = null;
   }

   public async removeIpDevice() {
      await removeSecure(ExpoSecureStoreKeys.IpDevice);
      this.IpDevice = null;
   }
   public async removeUserId() {
      await removeSecure(ExpoSecureStoreKeys.UserId);
      this.UserId = null;
   }

   public async initialData() {
      this.AccessToken = await getSecure(ExpoSecureStoreKeys.AccessToken);
      this.IpDevice = await getSecure(ExpoSecureStoreKeys.IpDevice);
      this.UserId = await getSecure(ExpoSecureStoreKeys.UserId);
   }

}

export const ExpoSecureValueService = ExpoSecureValue.getInstance()