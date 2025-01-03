import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface IProps {
	title: string;
	disabled: boolean;
}

export const Button = ({ title, disabled }: IProps) => {
	return (
		<TouchableOpacity
			className={`rounded-lg py-3 items-center ${disabled ? "bg-gray-300" : "bg-blue-500"}`}
			disabled={disabled}
		>
			<Text className="text-white text-lg ">{title}</Text>
		</TouchableOpacity>
	);
};
