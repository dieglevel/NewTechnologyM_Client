import {
	ChatScreen,
	LoginScreen,
	OTPScreen,
	RegisterScreen,
	UserDetailScreen,
	QrScreen,
	ForgotPasswordScreen,
	UpdateProfileScreen,
} from "@/apps/screens";

import { Stack } from "@/libs/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabScreenApp } from "./bottom-tab-screen-app";
import { LoginUserScreen } from "../screens/login-user/login-user-screen";
import { detailInformationStorage } from "@/libs/mmkv/mmkv";
import { useEffect } from "react";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { getAccountApi } from "@/services/auth";
import { socketService } from "@/libs/socket/socket";
import { MMKV } from "react-native-mmkv";

export const RootScreenApp = () => {
	useEffect(() => {
		const checkToken = async () => {

			const token = await getSecure(ExpoSecureStoreKeys.AccessToken);

			const accountResponse = await getAccountApi();
			if (accountResponse.statusCode === 200) {
				socketService.connect();
			}
		};
		checkToken();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Login"
				screenOptions={{
					headerShown: false,
					animation: "fade_from_bottom",
				}}
			>
				<Stack.Screen
					name="BottomTabScreenApp"
					component={BottomTabScreenApp}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="Login"
					component={LoginScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
						headerShown: true,
						headerTitle: "Đăng nhập",
					}}
					name="LoginUser"
					component={LoginUserScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
						headerShown: true,
						headerTitle: "Đăng ký",
					}}
					name="Register"
					component={RegisterScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
						headerShown: true,
						headerTitle: "Xác thực tài khoản",
					}}
					name="OTP"
					component={OTPScreen}
					initialParams={{ identifier: "", type: "phone" }}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="UserDetail"
					component={UserDetailScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="ChatScreen"
					component={ChatScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="ForgotPasswordScreen"
					component={ForgotPasswordScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
						headerShown: true,
						headerTitle: "Cập nhật thông tin",
					}}
					name="UpdateProfileScreen"
					component={UpdateProfileScreen}
				/>

				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="Qr"
					component={QrScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
