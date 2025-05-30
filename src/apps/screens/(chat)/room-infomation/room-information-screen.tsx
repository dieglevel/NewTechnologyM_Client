import { images } from "@/assets/images";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useAppSelector } from "@/libs/redux/redux.config";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const RoomInformationScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const [myUserId, setMyUserId] = useState<string | null>(null);

	const isDark = false;

	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [isHidden, setIsHidden] = useState<boolean>(false);

	useEffect(() => {
		const fetchUserId = async () => {
			const userId = ExpoSecureValueService.getUserId();
			setMyUserId(userId);
		};
		fetchUserId();
	}, []);

	const toggleMute = () => setIsMuted((prev) => !prev);
	const toggleHide = () => setIsHidden((prev) => !prev);

	const renderAvatar = () => {
		if (selectedRoom?.type === "single") {
			const account = selectedRoom.detailRoom?.find((detail) => {
				return detail.id !== myUserId;
			});

			return (
				<Image
					source={account?.avatar ? { uri: account?.avatar } : images.avatarDefault}
					style={styles.avatar}
				/>
			);
		} else {
			return (
				<>
					{selectedRoom?.avatar ? (
						<Image
							source={{ uri: selectedRoom?.avatar }}
							style={styles.avatar}
						/>
					) : (
						<View style={styles.avatarContainer}>
							<MaterialIcons
								name="group"
								size={40}
								color="#6b7280"
							/>
						</View>
					)}
				</>
			);
		}
	};

	const renderName = () => {
		console.log("selectedRoom", selectedRoom);
		if (selectedRoom?.type === "single") {
			const account = selectedRoom.detailRoom?.find((detail) => {
				return detail.id !== myUserId;
			});
			return account?.fullName || "Unknown User";
		} else {
			return selectedRoom?.name || "Group Chat";
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={[styles.container, isDark && styles.darkContainer]}>
				{/* Header chỉ có nút quay lại và tên */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons
							name="arrow-back"
							size={24}
							color="white"
						/>
					</TouchableOpacity>
					<Text style={styles.headerText}>Thông tin hội thoại</Text>
				</View>

				{/* Avatar + Tên + Bút */}
				<View style={styles.profileContainer}>
					{renderAvatar()}
					{/* Avatar */}
					<View style={styles.nameRow}>
						<Text style={[styles.nameText, isDark && styles.darkNameText]}>{renderName()}</Text>
						<TouchableOpacity
							style={styles.editIcon}
							onPress={() => alert("Chỉnh sửa biệt danh")}
						>
							<Feather
								name="edit-2"
								size={16}
								color={isDark ? "#e5e7eb" : "#333"}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.featuresContainer}>
					<View style={styles.featureRow}>
						<TouchableOpacity
							style={styles.featureItem}
							onPress={() => alert("Tắt thông báo")}
						>
							<View style={styles.iconCircle}>
								<Feather
									name="bell-off"
									size={20}
									color="#1e3a8a"
								/>
							</View>
							<Text style={styles.featureText}>Tắt thông báo</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.featureItem}
							onPress={() => alert("Ghim hội thoại")}
						>
							<View style={styles.iconCircle}>
								<Feather
									name="bookmark"
									size={20}
									color="#1e3a8a"
								/>
							</View>
							<Text style={styles.featureText}>Ghim hội thoại</Text>
						</TouchableOpacity>
						{selectedRoom?.type === "group" ? (
							<TouchableOpacity
								style={styles.featureItem}
								onPress={() => {
									navigation.navigate("AddMember");
								}}
							>
								<View style={styles.iconCircle}>
									<Feather
										name="user-plus"
										size={20}
										color="#1e3a8a"
									/>
								</View>
								<Text style={styles.featureText}>Thêm thành viên</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={styles.featureItem}
								onPress={() => {
									navigation.navigate("CreateRoomScreen");
								}}
							>
								<View style={styles.iconCircle}>
									<Feather
										name="user-plus"
										size={20}
										color="#1e3a8a"
									/>
								</View>
								<Text style={styles.featureText}>Tạo cuộc trò chuyện</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>

				<ScrollView style={styles.content}>
					{/* <View style={styles.section}>
					<View style={styles.memberItem}>
						<Feather
							name="clock"
							style={[styles.sectionIcon, isDark && styles.darkSectionIcon]}
						/>
						<Text style={[styles.memberText, isDark && styles.darkMemberText]}>
							Danh sách nhắc hẹn
						</Text>
					</View>
					<View style={styles.memberItem}>
						<Feather
							name="users"
							style={[styles.sectionIcon, isDark && styles.darkSectionIcon]}
						/>
						<Text style={[styles.memberText, isDark && styles.darkMemberText]}>2 nhóm chung</Text>
					</View>
				</View> */}

					{selectedRoom?.type === "group" && (
						<Pressable
							style={styles.section}
							onPress={() => navigation.navigate("FriendAction")}
						>
							<View style={styles.sectionHeader}>
								<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>
									Thành viên
								</Text>
							</View>

							<View style={{ flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
								<>
									{selectedRoom.detailRoom && selectedRoom.detailRoom?.length > 0 ? (
										<>
											{selectedRoom.detailRoom.slice(0, 4).map((member) => (
												<View
													key={member.id}
													style={styles.memberItem}
												>
													<Image
														source={{ uri: member.avatar }}
														style={styles.avatarMember}
													/>
													<Text
														style={[
															styles.memberText,
															isDark && styles.darkMemberText,
														]}
													>
														{member.fullName}
													</Text>
												</View>
											))}
										</>
									) : null}
								</>
							</View>
						</Pressable>
					)}
					{/* <View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>
								Ảnh/Video
							</Text>
						</View>
					</View> */}

					{/* <View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>File</Text>
						</View>
					</View> */}

					{/* <View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>Link</Text>
						</View>
					</View> */}

					{/* Security Settings Section */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>
								Thiết lập bảo mật
							</Text>
						</View>
						<View style={styles.securityItem}>
							<View style={styles.securityRow}>
								<Feather
									name="bell-off"
									style={[styles.sectionIcon, isDark && styles.darkSectionIcon]}
								/>
								<Text style={[styles.securityText, isDark && styles.darkSecurityText]}>
									Tắt thông báo trò chuyện
								</Text>
								<TouchableOpacity onPress={() => alert("Thông tin về tắt thông báo")}>
									<Feather
										name="help-circle"
										size={20}
										color={isDark ? "#60a5fa" : "#3b82f6"}
									/>
								</TouchableOpacity>
							</View>
							<Switch
								value={isMuted}
								onValueChange={toggleMute}
								trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
								thumbColor={isMuted ? "#ffffff" : "#f4f4f5"}
							/>
						</View>
						<View style={styles.securityItem}>
							<View style={styles.securityRow}>
								<Feather
									name="eye-off"
									style={[styles.sectionIcon, isDark && styles.darkSectionIcon]}
								/>
								<Text style={[styles.securityText, isDark && styles.darkSecurityText]}>
									Ẩn trò chuyện
								</Text>
							</View>
							<Switch
								value={isHidden}
								onValueChange={toggleHide}
								trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
								thumbColor={isHidden ? "#ffffff" : "#f4f4f5"}
							/>
						</View>
						<TouchableOpacity style={styles.securityItem}>
							<View style={styles.securityRow}>
								<Feather
									name="alert-triangle"
									style={[styles.sectionIcon, { color: "#ef4444" }]}
								/>
								<Text style={[styles.securityText, { color: "#ef4444" }]}>
									Xóa lịch sử trò chuyện
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	avatarMember: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 8,
		borderWidth: 1,
		borderColor: "#3b82f6",
	},
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	darkContainer: {
		backgroundColor: "#1f2937",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#3b82f6",
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	headerText: {
		flex: 1,
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
		marginRight: 24,
	},
	profileContainer: {
		alignItems: "center",
		marginTop: 16,
		marginBottom: 16,
	},
	avatar: {
		width: 100,
		height: 100,
		objectFit: "cover",
		borderRadius: 999,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	nameText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	darkNameText: {
		color: "#e5e7eb",
	},
	editIcon: {
		marginLeft: 8,
	},
	featuresContainer: {
		marginBottom: 16,
	},
	featureRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	featureItem: {
		alignItems: "center",
	},
	iconCircle: {
		backgroundColor: "#e5e7eb",
		borderRadius: 50,
		padding: 12,
		marginBottom: 6,
	},
	featureText: {
		fontSize: 13,
		textAlign: "center",
		color: "#1e3a8a",
	},
	content: {
		flex: 1,
		padding: 16,
	},
	section: {
		flexDirection: "column",
		width: "100%",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
	},
	sectionHeader: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	darkSectionTitle: {
		color: "#e5e7eb",
	},
	memberItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		gap: 8,
		borderTopColor: "#eee",
		borderTopWidth: 1,
		width: "100%",
	},
	sectionIcon: {
		color: "#3b82f6",
		fontSize: 20,
		marginRight: 8,
	},
	darkSectionIcon: {
		color: "#60a5fa",
	},
	memberText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	darkMemberText: {
		color: "#e5e7eb",
	},
	pinnedItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
	},
	pinnedText: {
		fontSize: 14,
		color: "#333",
	},
	darkPinnedText: {
		color: "#e5e7eb",
	},
	securityItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
	},
	securityRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	securityText: {
		fontSize: 14,
		color: "#333",
	},
	darkSecurityText: {
		color: "#e5e7eb",
	},
	avatarContainer: {
		backgroundColor: "#f4f4f4",
		width: 100,
		height: 100,
		objectFit: "cover",
		borderRadius: 9999,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
});
