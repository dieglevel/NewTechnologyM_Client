import {
	ChatScreen,
	LoginScreen,
	OTPScreen,
	RegisterScreen,
	UserDetailScreen,
	QrScreen,
	ForgotPasswordScreen,
	UpdateProfileScreen,
	ListChatScreen,
} from "@/apps/screens";

import { Stack } from "@/libs/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabScreenApp } from "./bottom-tab-screen-app";
import { LoginUserScreen } from "../screens/(auth)/login-user/login-user-screen";
import { useEffect } from "react";
import { getAccountApi } from "@/services/auth";
import { socketService } from "@/libs/socket/socket";
import RequestFriendScreen from "../screens/(contact)/request-friend/request-friend-screen";
import ChatInfo from "../components/chat-info/chat-info";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { UpdatePasswordScreen } from "../screens/(auth)/updatePassword/updatePasswordScreen";

export const RootScreenApp = () => {
	useEffect(() => {
		const checkToken = async () => {
			const token = ExpoSecureValueService.getAccessToken();

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
					}}
					name="UpdatePasswordScreen"
					component={UpdatePasswordScreen}
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
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
						headerShown: true,
						headerTitle: "Yêu cầu kết bạn",
					}}
					name="RequestFriendScreen"
					component={RequestFriendScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="ChatInfoScreen"
					component={ChatInfo}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="ListChatScreen"
					component={ListChatScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
