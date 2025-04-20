import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure, setSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { BaseResponse } from "@/types";
import { IAuth, IDetailInformation } from "@/types/implement";
import { ISearchAccount } from "@/types/implement/response";

export const loginApi = async (username: string, password: string) => {
	try {
		const isPhoneNumber = username.match(/^\d{10}$/);

		if (isPhoneNumber) {
			const phone84 = username.startsWith("0") ? username.replace(/^0/, "+84") : username;
			const response = await api.post<BaseResponse<IAuth>>(`auth/login`, { identifier: phone84, password });
			const { data, statusCode } = response.data;

			if (statusCode === 200) {
				// console.log("Login successful:", data);
				await setSecure(ExpoSecureStoreKeys.AccessToken, data?.accessToken || "");
				await setSecure(ExpoSecureStoreKeys.UserId, data?.userId || "");
				// console.log("Access token set:", await getSecure(ExpoSecureStoreKeys.AccessToken));
			}
			return response.data;
		}

		const response = await api.post<BaseResponse<IAuth>>(`auth/login`, { identifier: username, password });
		const { data, statusCode } = response.data;

		if (statusCode === 200) {
			// console.log("Login successful:", data);
			await setSecure(ExpoSecureStoreKeys.AccessToken, data?.accessToken || "");
			await setSecure(ExpoSecureStoreKeys.UserId, data?.userId || "");
			// console.log("Access token set:", await getSecure(ExpoSecureStoreKeys.AccessToken));
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
			const phone84 = identifier.startsWith("0") ? identifier.replace(/^0/, "+84") : identifier;
			const response = await api.post<BaseResponse<IAuth>>("/auth/register", { "email": "", "phone": phone84, password });
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
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = identifier.startsWith("0") ? identifier.replace(/^0/, "+84") : identifier;
			const response = await api.post<BaseResponse<null>>("/auth/verify-otp", { identifier: phone84, otp });

			return response.data;
		}
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
};

export const sendOTPPasswordApi = async (identifier: string) => {
	try {
		const response = await api.post<BaseResponse<null>>("/auth/send-OTP-forget", {
			identifier
		});

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const verifyOTPPasswordApi = async (otp: string, identifier: string) => {
	try {

		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = identifier.startsWith("0") ? identifier.replace(/^0/, "+84") : identifier;
			const response = await api.post<BaseResponse<null>>("/auth/verify-OTP-forget", {
				otp: otp,
				identifier: phone84
			});

			return response.data;
		}

		const response = await api.post<BaseResponse<null>>("/auth/verify-OTP-forget", {
			otp: otp,
			identifier: identifier
		});

		return response.data;
	} catch (e) {
		// console.log(e)
		throw e as ErrorResponse;
	}
};

export const changePasswordApi = async (phone: string, newPassword: string) => {
	try {
		const isPhoneNumber = phone.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = phone.startsWith("0") ? phone.replace(/^0/, "+84") : phone;
			const response = await api.post<BaseResponse<null>>("/auth/update-password-forget", {
				identifier: phone84,
				newPassword,
			});

			return response.data;
		}

		const response = await api.post<BaseResponse<null>>("/auth/update-password-forget", {
			identifier: phone,
			newPassword,
		});

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const findAccount = async (identifier: string) => {
	try {

		// check if phone number === true
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const response = await api.get<BaseResponse<ISearchAccount[]>>(`auth/search?keywork=${identifier}`,);
			return response.data;
		}

		const response = await api.get<BaseResponse<ISearchAccount[]>>(`auth/search?keywork=${identifier}`,);

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
}

export const getProfileFromAnotherUser = async (id: string) => {
	try {
		const response = await api.get<BaseResponse<IDetailInformation>>(`/detail-information/${id}`);
		return response.data;
	} catch (error) {
		throw error as ErrorResponse;
	}
};