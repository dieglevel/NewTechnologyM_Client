import React, {useState} from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, SearchHeader, UserInfo } from "@/apps/components";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { fetchUser } from "./handle";

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
		<SafeAreaView>
			<View className="w-full">
				<SearchHeader/>
				<UserInfo navigation={navigation} user={user} />
			</View>
		</SafeAreaView>
	);
};
