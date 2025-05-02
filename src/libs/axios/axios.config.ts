import { ExpoSecureStoreKeys, getSecure, removeSecure, setSecure } from "../expo-secure-store/expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
// import { eventEmitter } from "../eventemitter3";
import { BaseResponse } from "@/types";
import { getIpDeviceApi } from "@/services/ip-device";
import { ExpoSecureValueService } from "../expo-secure-store/implement";

export interface ErrorResponse {
	error: string;
	message: string;
	statusCode: number;
	timestamp: Date;
	path: string;
}

export const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
	headers: { "Content-Type": "application/json" },
});

// Interceptor trước khi gửi request
api.interceptors.request.use(
	async (config) => {
		const token = ExpoSecureValueService.getAccessToken()
		let idDevice = ExpoSecureValueService.getIpDevice()

		if (config.headers["Authorization"] && config.headers["ip-device"]) {
			return config;
		}

		if (!idDevice) {
			idDevice = await getIpDeviceApi();
			await ExpoSecureValueService.setIpDevice(idDevice)
		}

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		config.headers["ip-device"] = idDevice;

		return config;
	},
	(error) => Promise.reject(error),
);

// Interceptor xử lý lỗi
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// console.error("⛔ Axios: ", error.toJSON());
		const errorResponse: ErrorResponse = error.response.data;

		if (errorResponse.statusCode === 401) {
			ExpoSecureValueService.removeAccessToken();
			ExpoSecureValueService.removeIpDevice();
			ExpoSecureValueService.removeUserId();
		} else {
			console.error("⛔ Axios: ", error.status + " - " + error.config?.url + " - " + errorResponse.message);
		}

		return Promise.reject(errorResponse);
	},
);

export { BaseResponse };
