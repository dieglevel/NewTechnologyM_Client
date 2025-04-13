import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import { colors } from "@/constants";
import { pickImage } from "./hande";
import { use } from "i18next";

interface HeaderDetailUserProps {
	uri: string | null;
}

export const MainPhoto = ({ uri }: HeaderDetailUserProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [imageUri, setImageUri] = useState<string | null>(uri);

	useEffect(() => {
		setImageUri(uri);
	}, [uri]);

	return (
		<View style={styles.container}>
			{isLoading ? (
				<ActivityIndicator
					size="large"
					color={colors.brand}
					style={styles.avatarContainer}
				></ActivityIndicator>
			) : (
				<>
					<TouchableOpacity
						style={styles.avatarContainer}
						onPress={() => pickImage(setImageUri, setIsLoading)}
					>
						<Image
							source={imageUri ? { uri: imageUri } : images.avatarDefault}
							style={styles.avatar}
						/>
					</TouchableOpacity>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginTop: -64, // -16 * 4 (converted from -mt-16)
		marginBottom: 16, // mb-4
	},
	avatarContainer: {
		borderWidth: 4,
		borderColor: colors.brand,
		borderRadius: 9999, // Fully rounded
	},
	avatar: {
		width: 128, // 32 * 4 (converted from w-32)
		height: 128, // 32 * 4 (converted from h-32)
		borderRadius: 9999, // Fully rounded
	},
	userName: {
		fontSize: 24, // text-2xl
		fontWeight: "600", // font-semibold
		marginTop: 16, // mt-4
	},
	updateButton: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8, // mt-2
	},
	updateText: {
		color: "#007AFF",
		marginLeft: 8, // ml-2
	},
});
