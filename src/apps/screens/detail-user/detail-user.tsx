import { CoverPhoto, HeaderDetailUser, MainPhoto, NewSection } from "@/apps/components";
import { ArrowBack } from "@/assets/svgs";
import { More } from "@/assets/svgs/more";
import { StackScreenNavigationProp, UserDetailRouteProp } from "@/libs/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";

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
