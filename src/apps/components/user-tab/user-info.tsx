import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { ChangeAccount } from "@/assets/svgs";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";

interface Props {}

export const UserInfo = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);

	useEffect(() => {
		console.log("UserInfo component mounted, detailInformation:", detailInformation);
		console.log("UserInfo component mounted, status:", status);
	}, []);

	const handleUpdateProfile = () => {
		navigation.navigate("UserDetail", { userId: detailInformation?.id || "" });
	}

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={handleUpdateProfile}
		>
			<View style={styles.row}>
				<Image
					source={
						detailInformation?.avatarUrl
							? { uri: detailInformation?.avatarUrl }
							: images.avatarDefault
					}
					style={styles.avatar}
				/>
				<View style={styles.infoContainer}>
					<Text style={styles.name}>{detailInformation?.fullName ?? "-"}</Text>
					<Text style={styles.link}>{t("Xem trang cá nhân")}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
		justifyContent: "space-between", // justify-between
		paddingHorizontal: 16, // px-4
		paddingVertical: 16, // py-4
		backgroundColor: "white", // bg-white
	},
	row: {
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
	},
	avatar: {
		width: 56, // w-14
		height: 56, // h-14
		borderRadius: 28, // rounded-full
	},
	infoContainer: {
		marginLeft: 12, // ml-3
	},
	name: {
		fontSize: 18, // text-lg
		fontWeight: "600", // font-semibold
	},
	link: {
		color: "#6B7280", // text-gray-500
	},
});
