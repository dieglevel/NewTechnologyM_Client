import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface IProps {
	title: string;
	disabled: boolean;
}

export const Button = ({ title, disabled }: IProps) => {
	return (
		<TouchableOpacity
			className={`mt-8 rounded-full py-3 items-center ${disabled ? "bg-gray-300" : "bg-blue-500"}`}
			disabled={disabled}
		>
			<Text className="text-gray-400 text-sm font-semibold">{title}</Text>
		</TouchableOpacity>
	);
};
