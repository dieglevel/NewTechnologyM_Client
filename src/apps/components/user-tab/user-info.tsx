import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { ChangeAccount } from "@/assets/svgs";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import { colors } from "@/constants";

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
	};

	return (
		<View
			style={styles.container}
		>
			<View style={styles.rowDetail}>
				<Image
					source={
						detailInformation?.thumbnailUrl
							? { uri: detailInformation?.thumbnailUrl }
							: images.background
					}
					style={styles.thumbnail}

				/>
				<Image
					source={
						detailInformation?.avatarUrl
							? { uri: detailInformation?.avatarUrl }
							: images.avatarDefault
					}
					style={styles.avatar}
				/>
			</View>
			<View style={styles.row}>
				<View style={styles.infoContainer}>
					<Text style={styles.name}>{detailInformation?.fullName ?? "-"}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%", // w-full
		flexDirection: "column", // flex-row
		alignItems: "center", // items-center
		alignContent: "center", // content-center
		justifyContent: "center", // justify-between
		paddingHorizontal: 16, // px-4
		paddingVertical: 16, // py-4
	},
	row: {
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
		alignContent: "center", // content-center
		justifyContent: "center", // justify-between
	},
	rowDetail: {
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
		justifyContent: "center", // justify-center
		marginBottom: 40, // mb-3
		position: "relative", // relative
	},
	avatar: {
		position: "absolute", // absolute
		bottom: -40, // -mt-8
		width: 100, // w-14
		height: 100, // h-14
		borderRadius: 20, // rounded-full
		borderWidth: 4, // border-2
		borderColor: "white", // border-gray-200
		alignItems: "center", // items-center
		justifyContent: "center", // justify-center
	},
	infoContainer: {
		flex: 1,

	},
	name: {
		fontSize: 30, // text-lg
		fontWeight: "600", // font-semibold
		textAlign: "center", // text-center
	},
	link: {
		color: "#6B7280", // text-gray-500
	},
	thumbnail: {
		width: "100%",
		height: 200, // h-24
		borderRadius: 12, // rounded-lg
		backgroundColor: "#E5E7EB", // bg-gray-200
		alignSelf: "center", // self-center
		resizeMode: "cover", // object-cover
	},
});
