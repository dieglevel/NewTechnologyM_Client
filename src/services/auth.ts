import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { BaseResponse } from "@/types";
import { IAuth, IDetailInformation } from "@/types/implement";
import { ISearchAccount } from "@/types/implement/response";

export const loginApi = async (identifier: string, password: string) => {
	try {
		const isPhone = identifier.match(/^\d{10}$/);
		if (isPhone) {
			const phone84 = identifier.replace(/^0/, "+84");
			const response = await api.post<BaseResponse<IAuth>>("/auth/login", {
				identifier: phone84,
				password,
			});

			// localStorage.setItem(LocalStorage.token, response.data.data.accessToken);
			await ExpoSecureValueService.setAccessToken(response.data.data?.accessToken || null)
			await ExpoSecureValueService.setUserId(response.data.data?.userId || null)
			return response.data;
		}
		const response = await api.post<BaseResponse<IAuth>>("/auth/login", { identifier, password });
		
		console.log(response.data.data)
		await ExpoSecureValueService.setAccessToken(response.data.data?.accessToken || null)
		await ExpoSecureValueService.setUserId(response.data.data?.userId || null)
		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

// getAccount | Check account | Check connection
export const getAccountApi = async () => {
	try {
		const response = await api.get<
			BaseResponse<{
				detailInformation: IDetailInformation;
			}>
		>("/auth/my-account");

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const getInformationVerifyApi = async () => {
	try {
		const response = await api.get<BaseResponse<IAuth>>("/auth/my-account");

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const registerApi = async (identifier: string, password: string) => {
	try {
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = identifier.replace(/^0/, "+84");
			const response = await api.post<BaseResponse<IAuth>>("/auth/register", {
				email: "",
				phone: phone84,
				password,
			});
			return response.data;
		}

		// check if email === true
		const isEmail = identifier.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
		if (isEmail) {
			const response = await api.post<BaseResponse<IAuth>>("/auth/register", {
				email: identifier.toLowerCase(),
				phone: "",
				password,
			});
			return response.data;
		}
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const forgetApi = async (identifier: string) => {
	try {
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		const isEmail = identifier.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

		if (isPhoneNumber || isEmail) {
			const phone84 = identifier.replace(/^0/, "+84");
			const response = await api.post<BaseResponse<IAuth>>("/auth/send-otp-forget", {
				identifier: isPhoneNumber ? phone84 : identifier,
			});
			return response.data;
		}
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const updatePasswordApi = async (identifier: string, password: string) => {
	try {
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = identifier.replace(/^0/, "+84");
			const response = await api.post<BaseResponse<IAuth>>("/auth/update-password-forget", {
				identifier: phone84,
				newPassword: password,
			});
			return response.data;
		}

		const isEmail = identifier.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
		if (isEmail) {
			const response = await api.post<BaseResponse<IAuth>>("/auth/update-password-forget", {
				identifier: identifier.toLowerCase(),
				newPassword: password,
			});
			return response.data;
		}
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const verifyAccount = async (identifier: string, otp: string) => {
	try {
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = identifier.replace(/^0/, "+84");
			const response = await api.post<BaseResponse<null>>("/auth/verify-otp", { identifier: phone84, otp });

			return response.data;
		}
		const response = await api.post<BaseResponse<null>>("/auth/verify-otp", { identifier, otp });

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const verifyForgetPassword = async (identifier: string, otp: string) => {
	try {
		const isPhoneNumber = identifier.match(/^\d{10}$/);
		if (isPhoneNumber) {
			const phone84 = identifier.replace(/^0/, "+84");
			const response = await api.post<BaseResponse<null>>("/auth/verify-otp-forget", {
				identifier: phone84,
				otp,
			});

			return response.data;
		}
		const response = await api.post<BaseResponse<null>>("/auth/verify-otp-forget", { identifier, otp });

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const verifyUpdtateAccount = async (otp: string) => {
	try {
		const response = await api.put<BaseResponse<null>>("/auth/verify-update-account", { otp });

		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const changePasswordApi = async (oldPassword: string, newPassword: string) => {
	try {
		const response = await api.put<BaseResponse<IAuth>>("/auth/update-password", {
			currentPassword: oldPassword,
			newPassword: newPassword,
		});
		return response.data;
	} catch (e) {
		throw e as ErrorResponse;
	}
};

export const changeEmailApi = async (email: string, phone: string, typeSend: string) => {
	try {
		const phone84 = phone.replace(/^0/, "+84");
		const response = await api.put<BaseResponse<boolean>>("/auth/update-account", {
			email: email,
			phone: phone84,
			typeSend: typeSend,
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