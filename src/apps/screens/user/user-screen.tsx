import React, {useState} from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchHeader, UserInfo } from "@/apps/components/user-tab";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { fetchUser } from "./handle";
import { SafeAreaView } from "@/apps/components";

export const UserScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const [user, setUser] = useState<{ name: string; mainAvatar: string; coverAvatar: string }>({
		name: '',
		mainAvatar: '',
		coverAvatar: ''
	});

	const fetchdata = async () => {
		fetchUser(setUser);
	}

	fetchdata();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, width: "100%" }}>
				<SearchHeader/>
				<UserInfo user={user} />
			</View>
		</SafeAreaView>
	);
};
