import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowBack } from "@/assets/svgs";
import { More } from "@/assets/svgs/more";

interface HeaderDetailUserProps {
    onPress?: () => void;
}

export const HeaderDetailUser = ({onPress} : HeaderDetailUserProps) => {
	return (
		<View className="absolute w-full z-10 flex-row items-center justify-between p-4 pt-14 bg-black/5">
			<TouchableOpacity className="w-10 h-8 items-center justify-center" onPress={onPress}>
				<ArrowBack
					size={25}
					color="white"
					outline="white"
				/>
			</TouchableOpacity>
			<TouchableOpacity className="w-10 h-1 items-center justify-center">
				<More
					size={45}
					color="white"
					outline="white"
				/>
			</TouchableOpacity>
		</View>
	);
};
