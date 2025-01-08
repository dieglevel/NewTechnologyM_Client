import { NavigationContainer } from "@react-navigation/native";

import { Stack } from "@/src/libs/navigation";
import { RegisterScreen, LoginScreen } from "../screens";
import { BottomTabScreenApp } from "./bottom-tab-acreen-app";

export const RootScreenApp = () => {
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
					name="Register"
					component={RegisterScreen}
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
