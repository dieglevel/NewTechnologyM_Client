import { TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import { pickImage } from "./hande";
import { colors } from "@/constants";

interface HeaderDetailUserProps {}

export const CoverPhoto = ({}: HeaderDetailUserProps) => {
	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);
	return (
		<>
			{status === "loading" ? (
				<ActivityIndicator
					size="large"
					color={colors.brand}
					style={styles.touchable}
				></ActivityIndicator>
			) : (
				<>
					<Image
						source={
							detailInformation?.thumbnailUrl
								? { uri: detailInformation?.thumbnailUrl }
								: images.background
						}
						style={styles.image}
					/>
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
