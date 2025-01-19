import { NavigationContainer } from "@react-navigation/native";

import { LoginScreen, OTPScreen, RegisterScreen,  UserDetailScreen } from "@/apps/screens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabScreenApp } from "./bottom-tab-acreen-app";
import { Stack } from "@/libs/navigation";

export const RootScreenApp = () => {


	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="BottomTabScreenApp"
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
					name="Register"
					component={RegisterScreen}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="OTP"
					component={OTPScreen}
					initialParams={{ phone: "" }}
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
					}}
					name="UserDetail"
					component={UserDetailScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
