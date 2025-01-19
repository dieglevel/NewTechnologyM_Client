import React from "react";
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ArrowBack, ChangeAccount, Search, Setting } from "@/assets/svgs";
import { SafeAreaView } from "@/apps/components";
import { StackScreenNavigationProp } from "@/libs/navigation";

export const UserScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const { t } = useTranslation();

	return (
		<SafeAreaView>
			<View className="w-full">
				<View className="bg-blue-500 px-4 pt-2 pb-2">
					<View className="flex-row items-center">
						<View className="flex-1 flex-row items-center justify-center">
							<Search
								color="white"
								outline="white"
							/>
							<TextInput
								placeholder={t("Tìm kiếm")}
								placeholderTextColor="#85bffa"
								className="flex-1 ml-2 text-gray-200"
							/>
						</View>
						<TouchableOpacity className="ml-4">
							<Setting
								color="white"
								outline="white"
							/>
						</TouchableOpacity>
					</View>
				</View>

				<TouchableOpacity  className="flex-row items-center justify-between px-4 py-4 bg-white" onPress={() => navigation.navigate("UserDetail")}>
					<View className="flex-row items-center">
						<Image
							source={{
								uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5rFvMGR1oc2EMEpHwxCK4Yf8p8L5zo.png",
							}}
							className="w-14 h-14 rounded-full"
						/>
						<View className="ml-3">
							<Text className="text-lg font-semibold">Nguyễn Tú</Text>
							<Text className="text-gray-500">{t("Xem trang cá nhân")}</Text>
						</View>
					</View>
					<TouchableOpacity>
						<ChangeAccount color="#1d91fa" size={28}/>
					</TouchableOpacity>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};
