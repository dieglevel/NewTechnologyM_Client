import { NavigationContainer } from "@react-navigation/native";

import { LoginScreen, OTPScreen, RegisterScreen } from "@/apps/screens";
import { Stack } from "@/libs/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabScreenApp } from "./bottom-tab-acreen-app";

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
					initialParams={{ phone: "" }}
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
