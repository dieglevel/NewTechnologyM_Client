import { CoverPhoto, HeaderDetailUser, MainPhoto, NewSection } from "@/apps/components/user-detail";
import { images } from "@/assets/images";
import { colors } from "@/constants";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useAppSelector } from "@/libs/redux/redux.config";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const UserDetailScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);

	const handleBack = () => {
		navigation.goBack();
	};

	const handleEditProfile = () => {
		navigation.navigate("UpdateProfileScreen");
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HeaderDetailUser onPress={handleBack} />
			<ScrollView>
				<View>
					<View
						style={styles.container}
						// onPress={handleUpdateProfile}
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
					<NewSection />
				</View>
				<TouchableOpacity
					style={{
						marginTop: 32,
						paddingHorizontal: 24,
						paddingVertical: 16,
						backgroundColor: colors.brand,
						marginHorizontal: 24,
						borderRadius: 8,
						minWidth: 100,
					}}
					onPress={handleEditProfile}
				>
					<Text
						style={{
							fontSize: 16,
							color: "white",
							fontWeight: "600",
							textAlign: "center",
						}}
					>
						Chỉnh sửa thông tin
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 60, // mt-8
		width: "100%", // w-full
		flexDirection: "column", // flex-row
		alignItems: "center", // items-center
		alignContent: "center", // content-center
		justifyContent: "center", // justify-between
		paddingHorizontal: 16, // px-4
		paddingVertical: 16, // py-4
		paddingBottom: 0,
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
