import * as SecureStore from "expo-secure-store";

export enum ExpoSecureStoreKeys {
	AccessToken = "accessToken",
	IpDevice = "ipDevice"
}


const setSecure = async (key: string, value: string) => {
	await SecureStore.setItemAsync(key, value);
}

const getSecure = async (key: string) => {
	const value: string | null = await SecureStore.getItemAsync(key);
	return value;
}

const removeSecure = async (key: string) => {
	await SecureStore.deleteItemAsync(key);
}

export { setSecure, getSecure, removeSecure };