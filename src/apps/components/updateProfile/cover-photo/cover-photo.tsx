import { TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import { pickImage } from "./hande";
import { colors } from "@/constants";

interface HeaderDetailUserProps {
	uri: string | null;
}

export const CoverPhoto = ({ uri }: HeaderDetailUserProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [imageUri, setImageUri] = useState<string | null>(uri);

	useEffect(() => {
		setImageUri(uri);
	}, [uri]);

	return (
		<>
			{isLoading ? (
				<ActivityIndicator
					size="large"
					color={colors.brand}
					style={styles.touchable}
				></ActivityIndicator>
			) : (
				<>
					<TouchableOpacity
						onPress={() => pickImage(setImageUri, setIsLoading)}
						style={styles.touchable}
					>
						<Image
							source={imageUri ? { uri: imageUri } : images.background}
							style={styles.image}
						/>
					</TouchableOpacity>
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	touchable: {
		position: "relative",
		height: 240, // 60 * 4 (converted from h-60)
	},
	image: {
		width: "100%",
		height: 240,
	},
});
