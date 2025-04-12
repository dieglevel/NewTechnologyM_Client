import { CoverPhoto, HeaderDetailUser, MainPhoto, NewSection } from "@/apps/components/user-detail";
import { colors } from "@/constants";
import { StackScreenNavigationProp, UserDetailRouteProp } from "@/libs/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";

export const UserDetailScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const route = useRoute<UserDetailRouteProp>();

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HeaderDetailUser onPress={handleBack} />
			<ScrollView>
				<CoverPhoto />
				<MainPhoto />

				<NewSection />
				<TouchableOpacity
					style={{
						marginTop: 32,
						paddingHorizontal: 24,
						paddingVertical: 16,
						backgroundColor: colors.brand,
						marginHorizontal: 24,
						borderRadius: 8,
						minWidth: 100,
					}} // w-24
					// onPress={() => navigation.navigate("EditUserScreen", { userId: route.params.userId })}
				>
					<Text style={{ fontSize: 16, color: "white", fontWeight: "600", textAlign:"center" }}>Chỉnh sửa thông tin</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};
