import { NavigationContainer } from "@react-navigation/native";

<<<<<<< HEAD
import { Stack } from "@/src/libs/navigation";
import { RegisterScreen } from "../screens";
=======
import { Chat, LoginScreen, OTPScreen, RegisterScreen, UserDetailScreen, LoginUserScreen } from "@/apps/screens";
import { Stack } from "@/libs/navigation";
>>>>>>> 5988c41 (Link screens and add a login screen)
import { BottomTabScreenApp } from "./bottom-tab-acreen-app";

export const RootScreenApp = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
<<<<<<< HEAD
				initialRouteName="Register"
=======
				// initialRouteName="Chat"
				initialRouteName="Login"
>>>>>>> 5988c41 (Link screens and add a login screen)
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
<<<<<<< HEAD
=======
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
					name="LoginUserScreen"
					component={LoginUserScreen}
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
					name="Chat"
					component={Chat}
				/>
				
>>>>>>> 5988c41 (Link screens and add a login screen)
			</Stack.Navigator>
		</NavigationContainer>
	);
};
