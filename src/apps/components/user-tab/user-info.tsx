import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { ChangeAccount } from "@/assets/svgs";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/libs/redux/redux.config";

interface Props {}

export const UserInfo = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => navigation.navigate("UserDetail", { userId: detailInformation?.id ?? "" })}
		>
			<View style={styles.row}>
				<Image
					source={{
						uri: detailInformation?.avatarUrl || "https://example.com/default-avatar.png",
					}}
					style={styles.avatar}
				/>
				<View style={styles.infoContainer}>
					<Text style={styles.name}>{detailInformation?.fullName ?? "-"}</Text>
					<Text style={styles.link}>{t("Xem trang cá nhân")}</Text>
				</View>
			</View>
			<TouchableOpacity>
				<ChangeAccount
					color="#1d91fa"
					size={28}
				/>
			</TouchableOpacity>
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
