import { ContactsScreen, HomeScreen, ListChatScreen, UserScreen } from "@/apps/screens";
import { Message, Profile } from "@/assets/svgs";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp, Tab } from "@/libs/navigation";
import { store } from "@/libs/redux/redux.config";
import { initMyListFriend } from "@/libs/redux/stores/friend-slice";
import { initRequestFriend } from "@/libs/redux/stores/request-friend-slice";
import { initSendedFriend } from "@/libs/redux/stores/sended-friend-slice";
import { socketService } from "@/libs/socket/socket";
import { getAccountApi } from "@/services/auth";
import { getListFriend, getListResponseFriend, getListSended } from "@/services/friend";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Text } from "react-native";

export const BottomTabScreenApp = () => {
	const navigator = useNavigation<StackScreenNavigationProp>();


	useEffect(() => {
		const getDetailInformation = async () => {
			const response  = await getAccountApi();
			if (response.statusCode === 200) {
				const data = response.data?.detailInformation;
				// console.log("data", data);
				if (!data?.fullName && !data?.dateOfBirth && !data?.avatarUrl && !data?.thumbnailUrl ) {
					navigator.push("UpdateProfileScreen")
				}
			}
		}
		getDetailInformation();
	},[])



	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await getListSended();
				if (response?.statusCode === 200) {
					// console.log("response: ", response.data);
					store.dispatch(initSendedFriend(response.data || []));
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}
		};
		fetch();
	}, []);

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await getListResponseFriend();
				if (response?.statusCode === 200) {
					// console.log("response: ", response.data);
					store.dispatch(initRequestFriend(response.data || []));
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}
		};
		fetch();
	}, []);

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
