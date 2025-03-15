import { HomeScreen, UserScreen } from "@/apps/screens";
import { Message, Profile } from "@/assets/svgs";
import { Tab } from "@/libs/navigation";
import { Text } from "react-native";

export const BottomTabScreenApp = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarShowLabel: true,
				headerShown: false,
				tabBarLabel: ({ focused, color }) => {
					const labels = {
						HomeScreen: "Tin nhắn",
						UserScreen: "Cá nhân",
						ContactScreen: "Liên lạc",
					};
					return focused ? (
						<Text style={{ color: focused ? "#1d91fa" : "gray" }}>{labels[route.name]}</Text>
					) : (
						<Text style={{ color: focused ? "#1d91fa" : "gray" }}></Text>
					);
				},
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === "HomeScreen")
						return focused ? (
							<Message
								outline="white"
								color="#1d91fa"
								size={25}
							/>
						) : (
							<Message
								outline="gray"
								color="white"
								size={25}
							/>
						);
					else if (route.name === "UserScreen")
						return focused ? (
							<Profile
								color="#1d91fa"
								size={25}
								outline="#1d91fa"
							/>
						) : (
							<Profile
								outline="gray"
								color="white"
								size={25}
							/>
						);
				},
			})}
		>
			<Tab.Screen
				name="HomeScreen"
				component={HomeScreen}
			/>

			<Tab.Screen
				name="UserScreen"
				component={UserScreen}
			/>

		</Tab.Navigator>
	);
};
