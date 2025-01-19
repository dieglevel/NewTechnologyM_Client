import { TouchableOpacity, Image } from "react-native";
import React from "react";

interface HeaderDetailUserProps {
	onPress?: () => void;
	mainAvatar: string;
}

export const CoverPhoto = ({ onPress, mainAvatar }: HeaderDetailUserProps) => {
	return (
		<TouchableOpacity
			className="relative h-60"
			onPress={onPress}
		>
			<Image
				source={{
					uri: mainAvatar,
				}}
				className="w-full h-full"
			/>
		</TouchableOpacity>
	);
};
