import { ContactsScreen, ListRoomScreen, UserScreen } from "@/apps/screens";
import { Message, Profile } from "@/assets/svgs";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp, Tab } from "@/libs/navigation";
import { initRequestFriend, initSendedFriend } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { socketService } from "@/libs/socket/socket";
import { getAccountApi } from "@/services/auth";
import { getListFriend, getListResponseFriend, getListSended } from "@/services/friend";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Text } from "react-native";
import { initialDataPage } from "./handle-initital-page";
import AntDesign from "@expo/vector-icons/AntDesign";


export const BottomTabScreenApp = () => {
	const navigator = useNavigation<StackScreenNavigationProp>();

	useEffect(() => {
		const getDetailInformation = async () => {
			const response = await getAccountApi();
			if (response.statusCode === 200) {
				const data = response.data?.detailInformation;
				// console.log("data", data);
				if (!data?.fullName && !data?.dateOfBirth && !data?.avatarUrl && !data?.thumbnailUrl) {
					navigator.push("UpdateProfileScreen");
				}
			}
		};
		getDetailInformation();
	}, []);

	useEffect(() => {
		initialDataPage();
	}, []);

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarShowLabel: true,
				headerShown: false,
				tabBarLabel: ({ focused, color }) => {
					const labels = {
						ListRoomScreen: "Tin nhắn",
						UserScreen: "Cá nhân",
						ContactScreen: "Liên lạc",
					};
					return <Text style={{ color: focused ? "#1d91fa" : "black", fontWeight: "400" }}>{labels[route.name]}</Text>;
				},
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === "ListRoomScreen")
						return focused ? (
							<AntDesign
								name="message1"
								size={24}
								color="#1d91fa"
							/>
						) : (
							<AntDesign
								name="message1"
								size={24}
								color="gray"
							/>
						);
					else if (route.name === "UserScreen")
						return focused ? (
							<AntDesign
								name="user"
								size={24}
								color="#1d91fa"
								
							/>
						) : (
							<AntDesign
								name="user"
								size={24}
								color="gray"
							/>
						);
					else if (route.name === "ContactScreen")
						return focused ? (
							<AntDesign
								name="contacts"
								size={24}
								color="#1d91fa"
							/>
						) : (
							<AntDesign
								name="contacts"
								size={24}
								color="gray"
							/>
						);
				},
			})}
		>
			<Tab.Screen
				name="ListRoomScreen"
				component={ListRoomScreen}
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
