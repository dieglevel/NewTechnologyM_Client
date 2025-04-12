import { TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import { pickImage } from "./hande";

interface HeaderDetailUserProps {}

export const CoverPhoto = ({}: HeaderDetailUserProps) => {
	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);

	const [image, setImage] = useState<string | null>(null);


	return (
		<TouchableOpacity
			style={styles.touchable}
			onPress={() => {
				pickImage(setImage)
			}}
		>
			<Image
				source={
					detailInformation?.thumbnailUrl ? { uri: detailInformation?.thumbnailUrl } : images.background
				}
				style={styles.image}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	touchable: {
		position: "relative",
		height: 240, // 60 * 4 (converted from h-60)
	},
	image: {
		width: "100%",
		height: "100%",
	},
});
