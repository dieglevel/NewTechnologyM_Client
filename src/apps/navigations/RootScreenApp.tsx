import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { SafeAreaView, View, StatusBar } from "react-native";
import { Stack } from "@/src/libs/navigation";
import { BottomTabScreenApp } from "./BottomTabScreenApp";
import Register from "../screens/Register";

export const RootScreenApp = () => {
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
					name="TabScreenApp"
					component={BottomTabScreenApp}
				/>
				<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="Register"
					component={Register}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
