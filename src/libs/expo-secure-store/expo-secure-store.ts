import * as SecureStore from "expo-secure-store";


export class ExpoSecureStoreKeys {
	public static readonly AccessToken = "accessToken";
	public static readonly IpDevice = "ipDevice";
	public static readonly UserId = "userId";
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