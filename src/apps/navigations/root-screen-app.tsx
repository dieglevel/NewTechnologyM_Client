import { NavigationContainer } from "@react-navigation/native";

import { RegisterScreen, OTPScreen, LoginScreen } from "../screens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabScreenApp } from "./bottom-tab-acreen-app";
import { Stack } from "@/libs/navigation";

export const RootScreenApp = () => {
	const insets = useSafeAreaInsets();

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Register"
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
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="Login"
					component={LoginScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
