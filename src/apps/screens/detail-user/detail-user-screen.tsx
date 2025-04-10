import { CoverPhoto, HeaderDetailUser, MainPhoto, NewSection } from "@/apps/components/detail-user";
import { StackScreenNavigationProp, UserDetailRouteProp } from "@/libs/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {SafeAreaView, ScrollView } from "react-native";

export const UserDetailScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const route = useRoute<UserDetailRouteProp>();
	

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<HeaderDetailUser onPress={handleBack}/>
			<ScrollView>
				<CoverPhoto mainAvatar={route.params.user.mainAvatar}/>
				<MainPhoto user={route.params.user}/>

				<NewSection/>
			</ScrollView>
		</SafeAreaView>
	);
};
