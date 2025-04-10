import { ContactsScreen, HomeScreen, ListChatScreen, UserScreen } from "@/apps/screens";
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
						ListChatScreen: "Tin nhắn",
						UserScreen: "Cá nhân",
						ContactScreen: "Liên lạc",
					};
					return <Text style={{ color: focused ? "#1d91fa" : "black" }}>{labels[route.name]}</Text>;
				},
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === "ListChatScreen")
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
					else if (route.name === "ContactScreen")
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
				name="ListChatScreen"
				component={ListChatScreen}
			/>

			<Tab.Screen
				name="ContactScreen"
				component={ContactsScreen}
			/>
			<Tab.Screen
				name="UserScreen"
				component={UserScreen}
			/>
		</Tab.Navigator>
	);
};
