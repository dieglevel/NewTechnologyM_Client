import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";

interface HeaderDetailUserProps {
	onPress?: () => void;
    user: any;
}

export const MainPhoto = ({ onPress, user }: HeaderDetailUserProps) => {
	return (
		<View className="items-center -mt-16">
			<TouchableOpacity className="border-4 border-white rounded-full">
				<Image
					source={{
						uri: user.mainAvatar,
					}}
					className="w-32 h-32 rounded-full "
				/>
			</TouchableOpacity>

			<Text className="text-2xl font-semibold mt-4">{user.name}</Text>
			<TouchableOpacity className="flex-row items-center mt-2">
				<Text className="text-[#007AFF] ml-2">Cập nhật giới thiệu bản thân</Text>
			</TouchableOpacity>
		</View>
	);
};
