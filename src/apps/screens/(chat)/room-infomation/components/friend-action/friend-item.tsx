import { images } from "@/assets/images";
import { colors } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/redux.config";
import { IDetailAccountRoom, IFriend } from "@/types/implement";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { assignSubAdmin, removeMemberFromRoom } from "@/services";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { setSelectedRoom } from "@/libs/redux";

interface ContactItemProps {
	item: IDetailAccountRoom;
	myUserId?: string | null;
}

export const FriendItem = ({ item, myUserId }: ContactItemProps) => {
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

	const dispatch = useAppDispatch()

	const handlePressCloseModal = () => {
		setIsModalVisible(false);
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const renderRole = (role: "admin" | "subadmin" | "noob" | null | undefined) => {
		if (!role) return "Khách";
		switch (role) {
			case "admin":
				return "Trưởng nhóm";
			case "subadmin":
				return "Phó nhóm";
			default:
				return "Thành viên";
		}
	};

	const renderActionAssign = () => {
		if (myUserId === item.id) return null; // No action for self
		if (
			selectedRoom?.detailRoom?.some(
				(member: IDetailAccountRoom) =>
					member.id === myUserId && member.role === "subadmin" && item.role === "admin",
			)
		) {
			return null; // No action for admin if user is subadmin
		}
		if (
			selectedRoom?.detailRoom?.some(
				(member: IDetailAccountRoom) => member.id === myUserId && member.role === "noob",
			)
		) {
			return null; // No action for noob
		}
		return true; // Action available
	};

	const actionPressAssign = async ({ payload }: { payload: "admin" | "subadmin" | "noob" }) => {
		try {
			const response = await assignSubAdmin({
				accountId: item.id || "",
				chatRoomId: selectedRoom?.id || "",
				role: payload,
			});
			if (response.statusCode === 200) {
				if (selectedRoom) {
					const updatedRoom = {
						...selectedRoom,
						detailRoom: selectedRoom.detailRoom?.map((member: IDetailAccountRoom) => {
							if (member.id === item.id) {
								return { ...member, role: payload };
							}
							return member;
						}),
					};
					// Dispatch the updated room to the store
					dispatch(setSelectedRoom(updatedRoom));
				}
			} else {
				// Handle error response
				console.error("Error assigning role:", response.data);
			}
		} catch (error) {
			const err = error as ErrorResponse;
		}
	};

	const actionPressRemove = async () => {
		try {
			if (selectedRoom) {
				const response = await removeMemberFromRoom({
					accountId: item.id || "",
					roomId: selectedRoom.id || "",
				})
				if (response.statusCode === 200) {
					// Update the selectedRoom in the store
					const updatedRoom = {
						...selectedRoom,
						detailRoom: selectedRoom.detailRoom?.filter(
							(member: IDetailAccountRoom) => member.id !== item.id,
						),
					};
					dispatch(setSelectedRoom(updatedRoom));
				} else {
					console.error("Error removing member:", response.data);
				}
			}
		} catch (error) {
			const err = error as ErrorResponse;
			console.error("Error removing member:", err);
		}

	}

	return (
		<>
			<View style={styles.contactItem}>
				<Image
					source={item.avatar ? { uri: item.avatar } : images.avatarDefault}
					style={styles.avatar}
					resizeMode="cover"
				/>
				{/* </View> */}
				<View style={styles.contactInfo}>
					<Text style={styles.contactName}>{item.fullName}</Text>
					<Text style={styles.role}>{renderRole(item.role)}</Text>
				</View>
				{renderActionAssign() && (
					<TouchableOpacity
						style={{
							padding: 8,
							borderRadius: 4,
						}}
						onPress={() => {
							setIsModalVisible(true);
						}}
					>
						<FontAwesome
							name="exchange"
							size={12}
							color="black"
						/>
					</TouchableOpacity>
				)}
				{renderActionAssign() && (
					<TouchableOpacity
						style={{
							padding: 8,
							borderRadius: 4,
						}}
						onPress={() => {
							actionPressRemove()
						}}
					>
					<FontAwesome name="user-times" size={16} color="black" />
					</TouchableOpacity>
				)}

				
			</View>

			<Modal
				visible={isModalVisible}
				transparent
				animationType="fade"
				onRequestClose={handlePressCloseModal}
			>
				<TouchableWithoutFeedback onPress={handlePressCloseModal}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContent}>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={handlePressCloseModal}
									hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								>
									<FontAwesome
										name="close"
										size={22}
										color="#888"
									/>
								</TouchableOpacity>
								<Text style={styles.title}>Chọn quyền</Text>
								<Text style={styles.subtitle}>
									Bạn muốn chuyển quyền cho{" "}
									<Text style={{ color: "#2563eb", fontWeight: "bold" }}>
										{item.fullName}
									</Text>
								</Text>
								<TouchableOpacity
									style={styles.modalOption}
									onPress={() => {
										actionPressAssign({ payload: "admin" });
										handlePressCloseModal();
									}}
								>
									<Text style={styles.modalOptionText}>Trưởng nhóm</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.modalOption}
									onPress={() => {
										actionPressAssign({ payload: "subadmin" });
										handlePressCloseModal();
									}}
								>
									<Text style={styles.modalOptionText}>Phó nhóm</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.modalOption}
									onPress={() => {
										actionPressAssign({ payload: "noob" });
										handlePressCloseModal();
									}}
								>
									<Text style={styles.modalOptionText}>Thành viên</Text>
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	contactItem: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderTopWidth: 1,
		borderTopColor: "#e5e7eb",
	},
	avatar: {
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 999,
		borderWidth: 2,
		borderColor: "#3b82f6",
	},
	contactInfo: {
		marginLeft: 12,
		flex: 1,
	},
	contactName: {
		fontWeight: "600",
		color: "black",
	},
	role: {
		fontSize: 12,
		color: "#6b7280",
	},
	title: {
		fontSize: 24, // text-2xl
		fontWeight: "bold", // font-bold
		textAlign: "center",
		color: "#3b82f6", // text-blue-500
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.35)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: 340,
		backgroundColor: "white",
		borderRadius: 18,
		padding: 28,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.18,
		shadowRadius: 12,
		elevation: 10,
		position: "relative",
	},
	closeButton: {
		position: "absolute",
		top: 12,
		right: 12,
		zIndex: 2,
		padding: 4,
	},
	modalOption: {
		width: "100%",
		paddingVertical: 14,
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	modalOptionText: {
		fontSize: 18,
		color: "#222",
		fontWeight: "500",
	},
	subtitle: {
		fontSize: 16,
		color: "#222",
		textAlign: "center",
		marginBottom: 24,
		marginTop: 4,
	},
	input: {
		width: "100%",
		padding: 12, // p-3
		borderWidth: 1, // border
		borderColor: "#d1d5db", // border-gray-300
		borderRadius: 8, // rounded
		marginBottom: 16, // mb-4
	},
	passwordContainer: {
		position: "relative",
		width: "100%",
	},
	passwordToggle: {
		position: "absolute",
		right: 12, // right-3
		top: "50%",
		transform: [{ translateY: -12 }], // -translate-y-1/2
	},
	passwordIcon: {
		width: 24, // w-6
		height: 24, // h-6
	},
	loginButton: {
		width: "100%",
		backgroundColor: "#3b82f6", // bg-blue-500
		paddingVertical: 12, // py-3
		borderRadius: 8, // rounded
		marginBottom: 16, // mb-4
	},
	loginButtonText: {
		textAlign: "center",
		color: "white", // text-white
		fontWeight: "bold", // font-bold
	},
	forgotPasswordText: {
		color: "#3b82f6", // text-blue-500
		textAlign: "center",
	},
	createAccountButton: {
		backgroundColor: "#e5e7eb", // bg-gray-200
		paddingVertical: 12, // py-3
		borderRadius: 8, // rounded
		marginTop: 16, // mt-4
	},
	createAccountText: {
		textAlign: "center",
		color: "#374151", // text-gray-800
	},
});
