import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

interface IProps {
	text: string;
	textLink: string;
	isChecked: boolean;
	onCheck: any;
}

export const TermsCheckBox = ({ text, textLink, isChecked, onCheck }: IProps) => {
	return (
		<TouchableOpacity
			className="flex-row items-center mb-3"
			onPress={() => onCheck(!isChecked)}
		>
			<View className={`w-5 h-5 border-2 border-gray-300 rounded-md ${isChecked ? "bg-blue-500" : ""}`} />
			<View className="flex-row">
				<Text className="ml-2 text-left text-xs">{text}</Text>
				<TouchableOpacity>
					<Text className="text-left text-xs text-blue-500 font-bold">{textLink}</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};
