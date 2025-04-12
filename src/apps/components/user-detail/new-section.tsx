import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { changeDateToString } from "@/utils/change-date-to-string";

export const NewSection = () => {
	const { detailInformation, status } = useAppSelector((state) => state.detailInformation);

	return (
		<View style={styles.container}>
			{/* Label and detail */}
			{(status === "loading") ? (
				<ActivityIndicator
					size="large"
					color="#0000ff"
					style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
				/>
			) : (
				<>
					<View style={{flex: 1, alignItems: "flex-start", justifyContent: "flex-start", width: "100%"}}>
						<View style={styles.row}>
							<Text style={styles.title}>Họ và tên:</Text>
							<Text style={styles.description}>{detailInformation?.fullName ?? "Chưa có "}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.title}>Giới tính:</Text>
							<Text style={styles.description}>
								{detailInformation?.gender === null
									? "Chưa chọn giới tính"
									: detailInformation?.gender
									? "Nam"
									: "Nữ"}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.title}>Ngày sinh:</Text>
							<Text style={styles.description}>
								{detailInformation?.dateOfBirth
									? changeDateToString(detailInformation?.dateOfBirth)
									: "Chưa chọn ngày sinh"}
							</Text>
						</View>
					</View>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 32, // mt-8
		paddingHorizontal: 24, // px-6
		alignItems: "center",
		justifyContent: "center", // justify-center
		flex: 1,
	},
	row: {
		flex: 1,
		alignItems: "flex-end", // items-end
		justifyContent: "center", // justify-center
		flexDirection: "row", // flex-row
		gap: 8, // gap-2
		marginBottom: 12, // mb-3
	},
	title: {
		minWidth: 100, // w-24
		fontSize: 20, // text-xl
		fontWeight: "600", // font-semibold
	},
	description: {
		color: "#6B7280", // text-gray-500
		textAlign: "center",
		fontSize: 18, // text-base
	},
	button: {
		backgroundColor: "#007AFF", // bg-[#007AFF]
		borderRadius: 9999, // rounded-full
		paddingVertical: 12, // py-3
		marginTop: 24, // mt-6
		width: "50%", // w-1/2
	},
	buttonText: {
		color: "white", // text-white
		textAlign: "center",
		fontWeight: "600", // font-semibold
	},
});
