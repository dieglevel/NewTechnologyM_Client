import React, {useState} from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchHeader, UserInfo } from "@/apps/components/user-tab";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { SafeAreaView } from "@/apps/components";

export const UserScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, width: "100%" }}>
				<SearchHeader/>
				<UserInfo />
			</View>
		</SafeAreaView>
	);
};
