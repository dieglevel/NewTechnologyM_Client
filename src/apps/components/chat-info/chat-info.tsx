import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Switch, Alert } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useAppSelector } from "@/libs/redux/redux.config";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { images } from "@/assets/images";

const ChatInfo = () => {
	const navigation = useNavigation();

	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

  const [myUserId, setMyUserId] = useState<string | null>(null);

	const route = useRoute();
	const colorScheme = useColorScheme();
	const isDark = false;

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getSecure(ExpoSecureStoreKeys.UserId);
      setMyUserId(userId);
    };
    fetchUserId();
  }, [])

	const [isMuted, setIsMuted] = useState(false);
	const [isHidden, setIsHidden] = useState(false);

	const toggleMute = () => setIsMuted((prev) => !prev);
	const toggleHide = () => setIsHidden((prev) => !prev);

	const renderAvatar = () => {
		if (selectedRoom?.type === "single") {
			const account = selectedRoom.detailRoom.find((detail) => {
				return detail.id !== myUserId;
			});

			return (
				<Image
					source={{
						uri: account?.avatar,
					}}
					style={styles.avatar}
				/>
			);
		} else {
			return (
				<Image
          source={selectedRoom?.avatar ? { uri: selectedRoom.avatar } : images.avatarDefault}
          style={styles.avatar}
        />
			);
		}
	};

	const renderName = () => {
		if (selectedRoom?.type === "single") {
			const account = selectedRoom.detailRoom.find((detail) => {
				return detail.id !== myUserId;
			});
			return account?.fullName || "Unknown User";
		} else {
			return selectedRoom?.name || "Group Chat";
		}
	};

	const deleteChatHistory = () => {
		Alert.alert(
			"Xóa lịch sử trò chuyện",
			"Bạn có chắc chắn muốn xóa lịch sử trò chuyện? Hành động này không thể hoàn tác.",
			[
				{ text: "Hủy", style: "cancel" },
				{
					text: "Xóa",
					style: "destructive",
					onPress: () => {
						Alert.alert("Đã xóa", "Lịch sử trò chuyện đã được xóa.");
						// Add logic to actually delete chat history if needed
					},
				},
			],
			{ cancelable: true },
		);
	};

	return (
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
					<TouchableOpacity
						style={styles.featureItem}
						onPress={() => alert("Tạo nhóm trò chuyện")}
					>
						<View style={styles.iconCircle}>
							<Feather
								name="user-plus"
								size={20}
								color="#1e3a8a"
							/>
						</View>
						<Text style={styles.featureText}>Tạo nhóm trò chuyện</Text>
					</TouchableOpacity>
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

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>Ảnh/Video</Text>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>File</Text>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}>Link</Text>
					</View>
				</View>

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
					<TouchableOpacity
						style={styles.securityItem}
						onPress={deleteChatHistory}
					>
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
	);
};

const styles = StyleSheet.create({
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
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 8,
		borderWidth: 2,
		borderColor: "#3b82f6",
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
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
	},
	sectionHeader: {
		flexDirection: "row",
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
		fontSize: 14,
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
});

export default ChatInfo;
