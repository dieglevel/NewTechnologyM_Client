import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ChangeAccount } from "@/assets/svgs";
import { t } from "i18next";

interface UserInfoProps {
    navigation: any;
	user:{
		name:string,
		mainAvatar:string,
		coverAvatar:string,
	};
}

export const UserInfo = ({navigation, user}:UserInfoProps) => {
	return (
		<TouchableOpacity
			className="flex-row items-center justify-between px-4 py-4 bg-white"
			onPress={() => navigation.navigate("UserDetail", {user: user})}
		>
			<View className="flex-row items-center">
				<Image
					source={{
						uri: user.mainAvatar,
					}}
					className="w-14 h-14 rounded-full"
				/>
				<View className="ml-3">
					<Text className="text-lg font-semibold">{user.name}</Text>
					<Text className="text-gray-500">{t("Xem trang cá nhân")}</Text>
				</View>
			</View>
			<TouchableOpacity>
				<ChangeAccount
					color="#1d91fa"
					size={28}
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};
