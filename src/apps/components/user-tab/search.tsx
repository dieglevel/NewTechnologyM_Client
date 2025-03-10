import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Setting, Search } from "@/assets/svgs";
import { t } from "i18next";

export const SearchHeader = () => {
	return (
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
	);
};
