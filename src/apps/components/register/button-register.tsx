import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface IProps {
	title: string;
	disabled: boolean;
	onPress: any;
}

export const Button = ({ title, disabled, onPress }: IProps) => {
	return (
		<TouchableOpacity
			className={`mt-8 rounded-full py-3 items-center ${disabled ? "bg-gray-300" : "bg-blue-500"}`}
			disabled={disabled}
			onPress={onPress}
		>
			<Text className={`${disabled ? "text-gray-400" : "text-white"}  text-sm font-semibold`}>{title}</Text>
		</TouchableOpacity>
	);
};
