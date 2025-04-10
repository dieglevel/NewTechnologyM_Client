import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, setSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { BaseResponse } from "@/types";
import { IAuth } from "@/types/implement";

export const loginApi = async (username: string, password: string) => {
	try {
		const response = await api.post<BaseResponse<IAuth>>(`auth/login`, { identifier: username, password });
		const { data, statusCode } = response.data;
		
		if (statusCode === 200) {
			setSecure(ExpoSecureStoreKeys.AccessToken, data?.accessToken || "");
		}
		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};
