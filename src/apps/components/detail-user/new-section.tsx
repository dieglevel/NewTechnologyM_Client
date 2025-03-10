import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export const NewSection = () => {
	return (
		<View className="mt-8 px-6 items-center">
			<Text className="text-xl font-semibold">Hôm nay Nguyễn Tú có gì vui?</Text>
			<Text className="text-gray-500 text-center mt-2">
				Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỷ niệm đáng nhớ nhé!
			</Text>
			<TouchableOpacity className="bg-[#007AFF]  rounded-full py-3 mt-6 w-1/2">
				<Text className="text-white text-center font-semibold">Đăng lên Nhật ký</Text>
			</TouchableOpacity>
		</View>
	);
};
