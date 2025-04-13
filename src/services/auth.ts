import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure, setSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { BaseResponse } from "@/types";
import { IAuth, IDetailInformation } from "@/types/implement";

export const loginApi = async (username: string, password: string) => {
	try {
		const response = await api.post<BaseResponse<IAuth>>(`auth/login`, { identifier: username, password });
		const { data, statusCode } = response.data;

		if (statusCode === 200) {
			console.log("Login successful:", data);
			setSecure(ExpoSecureStoreKeys.AccessToken, data?.accessToken || "");
			console.log("Access token set:", getSecure(ExpoSecureStoreKeys.AccessToken));
		}
		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const registerApi = async (identifier: string, password: string) => {
	try {

		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const response = await api.post<BaseResponse<IAuth>>("/auth/register", { "email": "", "phone": identifier, password });
			return response.data;
		}

		// check if email === true
		const isEmail = identifier.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
		if (isEmail) {
			const response = await api.post<BaseResponse<IAuth>>("/auth/register", { "email": identifier, "phone": "", password });
			return response.data;
		}

	} catch (e) {
		throw e as ErrorResponse;
	}
}

export const verifyAccount = async (identifier: string, otp: string) => {
	try {
		const response = await api.post<BaseResponse<null>>("/auth/verify-otp", { identifier, otp });

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
}

export const getAccountApi = async () => {
	try {
		const response = await api.get<BaseResponse<{
			detailInformation: IDetailInformation;
		}>>("/auth/my-account");

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};


export const verifyLoginQrApi = async (qrCode: {
	ipDevice: string,
	userAgent: string,
}) => {
	try {
		const response = await api.post<BaseResponse<null>>("/auth/verify-loginQR", qrCode);

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
}