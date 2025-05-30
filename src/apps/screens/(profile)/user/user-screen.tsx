import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchHeader, UserInfo } from "@/apps/components/user-tab";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { SafeAreaView } from "@/apps/components";
import { colors } from "@/constants";
import { api } from "@/libs/axios/axios.config";
import { socketService } from "@/libs/socket/socket";
import {
	detailInformationStorage,
	messageStorage,
	myListFriendStorage,
	requestFriendStorage,
	roomStorage,
	sendedFriendStorage,
} from "@/libs/mmkv/mmkv";
import { useAppDispatch, useAppSelector } from "@/libs/redux/redux.config";
import { clearDetailInformationReducer } from "@/libs/redux";
import { MMKV } from "react-native-mmkv";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { logoutApi } from "@/services";

const OptionRow = ({
	icon,
	label,
	onPress,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	onPress: () => void;
	color?: string;
}) => (
	<TouchableOpacity
		style={styles.optionRow}
		onPress={onPress}
	>
		<View style={styles.iconContainer}>{icon}</View>
		<Text style={[styles.optionLabel, color ? { color } : null]}>{label}</Text>
		<Ionicons
			name="chevron-forward"
			size={20}
			color="#bbb"
		/>
	</TouchableOpacity>
);

export const UserScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const dispatch = useAppDispatch();
	const { detailInformation } = useAppSelector((state) => state.detailInformation);

	const handleLogout = async () => {
		try {
			const response = await logoutApi();
			if (response.statusCode === 200) {
				ExpoSecureValueService.removeAccessToken();
				ExpoSecureValueService.removeIpDevice();
				ExpoSecureValueService.removeUserId();
				api.defaults.headers.common["Authorization"] = undefined;
				api.defaults.headers.common["ip-device"] = undefined;
				dispatch(clearDetailInformationReducer());
				socketService.disconnect();
				new MMKV().clearAll();
				navigation.reset({ routes: [{ name: "Login" }] });
			}
		} catch (e) {
			console.error("Logout error:", e);
		}
	};

	const handleChangePassword = () => {
		navigation.navigate("ForgotPasswordScreen");
	};

	const handleResetMMKV = async () => {
		detailInformationStorage.clearAll();
		sendedFriendStorage.clearAll();
		requestFriendStorage.clearAll();
		sendedFriendStorage.clearAll();
		myListFriendStorage.clearAll();
		roomStorage.clearAll();
		messageStorage.clearAll();
		new MMKV().clearAll();
		alert("MMKV has been reset.");
	};

	const handleUpdateProfile = () => {
		navigation.navigate("UserDetail", { userId: detailInformation?.id || "" });
	};

	// Example handlers for other options
	const handleFavourites = () => {};
	const handleDownloads = () => {};
	const handleLanguages = () => {};
	const handleLocation = () => {};
	const handleSubscription = () => {};
	const handleDisplay = () => {};
	const handleClearCache = () => {};
	const handleClearHistory = () => {};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff", width: "100%" }}>
			<ScrollView
				contentContainerStyle={styles.container}
				style={{ flex: 1, width: "100%" }}
			>
				<View style={styles.profileSection}>
					<UserInfo />
				</View>

				{/* <View style={styles.divider} /> */}

				<View style={styles.optionGroup}>
					<OptionRow
						icon={
							<Ionicons
								name="person-outline"
								size={22}
								color="black"
							/>
						}
						label="Thông tin cá nhân"
						onPress={handleUpdateProfile}
					/>
					<OptionRow
						icon={
							<Ionicons
								name="key-outline"
								size={22}
								color="black"
							/>
						}
						label="Đổi mật khẩu"
						onPress={handleChangePassword}
					/>
					<OptionRow
						icon={
							<Ionicons
								name="refresh-outline"
								size={22}
								color="black"
							/>
						}
						label="Reset MMKV"
						onPress={handleResetMMKV}
					/>
					<OptionRow
						icon={
							<Ionicons
								name="log-out-outline"
								size={22}
								color="red"
							/>
						}
						label="Đăng xuất"
						onPress={handleLogout}
						color="red"
					/>
				</View>

				<Text style={styles.versionText}>App Version 0.1</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 4,
		paddingBottom: 40,
		backgroundColor: "#fff",
		width: "100%",
	},
	headerRow: {
		paddingHorizontal: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "bold",
	},
	profileSection: {
		alignItems: "center",
		marginBottom: 20,
		width: "100%",
	},
	editProfileBtn: {
		marginTop: 10,
		backgroundColor: "#3b82f6",
		borderRadius: 8,
		paddingHorizontal: 18,
		paddingVertical: 6,
	},
	editProfileText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	optionGroup: {
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
	},
	optionRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	iconContainer: {
		width: 32,
		alignItems: "center",
	},
	optionLabel: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
		color: "#222",
	},
	divider: {
		height: 1,
		backgroundColor: "#eee",
		marginVertical: 18,
	},
	versionText: {
		textAlign: "center",
		color: "#aaa",
		marginTop: 30,
		fontSize: 13,
	},
});

export default UserScreen;
