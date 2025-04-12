import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import React from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import { colors } from "@/constants";

interface HeaderDetailUserProps {}

export const MainPhoto = ({}: HeaderDetailUserProps) => {
	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.avatarContainer}>
				<Image
					source={
						detailInformation?.avatarUrl
							? { uri: detailInformation?.avatarUrl }
							: images.avatarDefault
					}
					style={styles.avatar}
				/>
			</TouchableOpacity>

			<Text style={styles.userName}>{detailInformation?.fullName || "-"}</Text>
			{/* <TouchableOpacity style={styles.updateButton}>
				<Text style={styles.updateText}>Cập nhật giới thiệu bản thân</Text>
			</TouchableOpacity> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginTop: -64, // -16 * 4 (converted from -mt-16)
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
