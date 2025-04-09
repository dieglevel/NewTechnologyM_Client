import { 
	ChatScreen, 
	LoginScreen, 
	OTPScreen, 
	RegisterScreen, 
	UserDetailScreen, 
	ForgotPasswordScreen,
	UpdatePasswordScreen
  } from "@/apps/screens";
  
import { Stack } from "@/libs/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabScreenApp } from "./bottom-tab-screen-app";
import { LoginUserScreen } from "../screens/login-user/login-user";

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
					name="Login"
					component={LoginScreen}
				/>
								<Stack.Screen
					options={{
						statusBarBackgroundColor: "gray",
					}}
					name="LoginUser"
					component={LoginUserScreen}
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

			</Stack.Navigator>
		</NavigationContainer>
	);
};
