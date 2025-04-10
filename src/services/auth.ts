import { api } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, setSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { BaseResponse } from "@/types";
import { Auth } from "@/types/entity";

export const loginApi = async (username: string, password: string) => {
	try {
		const response = await api.post<BaseResponse<Auth>>(`auth/login`, { identifier: username, password });

		console.log(response.data);

		const { data, statusCode } = response.data;
		if (statusCode === 200) {
			setSecure(ExpoSecureStoreKeys.AccessToken, data?.accessToken || "");
		}
		return response.data;
	} catch (e) {
		throw e as BaseResponse<null>;
	}
};
