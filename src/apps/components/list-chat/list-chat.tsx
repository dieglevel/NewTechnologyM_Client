import { colors } from "@/constants";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { initMyListFriend, initRoom } from "@/libs/redux";
import { RootState, store } from "@/libs/redux/redux.config";
import { getListFriend } from "@/services/friend";
import { addMember, createRoom, getRoom } from "@/services/room";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { ChatItem } from "./components/chat-room-item";
import { FriendItem } from "./components/friend-item";

export const ListChat = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const { room, status } = useSelector((state: RootState) => state.room);
	const { myListFriend } = useSelector((state: RootState) => state.myListFriend);

	const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
	const [checked, setChecked] = useState<string[]>([]);
	const [nameGroup, setNameGroup] = useState<string>("");

	const isFocused = useIsFocused();
	const [searchText, setSearchText] = useState<string>("");

	const myUserId = ExpoSecureValueService.getUserId();

	useEffect(() => {
		const fetchedRoom = async () => {
			const response = await getRoom();
			if (response?.statusCode === 200 && response.data) {
				await store.dispatch(initRoom(response?.data.listRoomResponse || []));
			}
		};

		fetchedRoom();
	}, [isFocused]);

	const handleChecked = (id: string) => {
		if (checked.includes(id)) {
			setChecked(checked.filter((item) => item !== id));
		} else {
			setChecked([...checked, id]);
		}
	};

	const handlePressCreateGroup = async () => {
		if (nameGroup.trim() === "") {
			Toast.show({
				type: "error",
				text1: "Tên nhóm không được để trống",
				position: "top",
			});
			return;
		}
		if (checked.length < 2) {
			Toast.show({
				type: "error",
				text1: "Bạn cần chọn ít nhất 2 người bạn",
				position: "top",
			});
			return;
		}
		try {
			const response = await createRoom({ name: nameGroup });
			if (response?.statusCode === 200) {
				const roomId = response.data?.id || "";
				const listAccount = checked.map((item) => item);
				const responseAddMember = await addMember({ roomId: roomId, listAccount: listAccount });
				if (responseAddMember?.statusCode === 200) {
					Toast.show({
						type: "success",
						text1: "Tạo nhóm thành công",
						position: "top",
					});
					setShowCreateGroupModal(false);
					setChecked([]);
					setNameGroup("");
					fetchedRoom();
					return;
				}
			}
		} catch (error) {
			const e = error as ErrorResponse;
			Toast.show({
				type: "error",
				text1: e.message,
				position: "top",
			});
		}
	};

	const fetchedRoom = async () => {
		const response = await getRoom();
		if (response?.statusCode === 200 && response.data) {
			await store.dispatch(initRoom(response?.data.listRoomResponse || []));
		}
	};

	useEffect(() => {
		const fetchedFriend = async () => {
			try {
				const response = await getListFriend();
				if (response?.statusCode === 200) {
					// console.log("response: ", response.data);
					store.dispatch(initMyListFriend(response?.data || []));
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}
		};

		fetchedFriend();
	}, [isFocused]);
	return (
		<View style={styles.container}>
			<Modal
				visible={showCreateGroupModal}
				transparent={true}
				animationType="fade"
				presentationStyle="overFullScreen"
			>
				<View style={[{ width: "100%", height: "100%", padding: 30 }]}>
					<View
						style={{
							padding: 10,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							borderRadius: 10,
							backgroundColor: "white",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								marginBottom: 10,
							}}
						>
							<Feather
								name="x"
								size={24}
								color={"black"}
								style={{ position: "absolute", top: 0, right: 0 }}
								onPress={() => {
									setShowCreateGroupModal(false);
									setChecked([]);
								}}
							/>
							<Text
								style={[
									{
										color: "black",
										fontSize: 18,
										fontWeight: "bold",
									},
									{ marginBottom: 10 },
								]}
							>
								Tạo nhóm trò chuyện
							</Text>
						</View>
						<TextInput
							style={{
								width: "100%",
								height: 50,
								borderWidth: 1,
								borderColor: "#e5e7eb",
								borderRadius: 10,
								paddingHorizontal: 10,
								marginBottom: 10,
							}}
							placeholder="Nhập tên nhóm"
							value={nameGroup}
							onChangeText={(text) => setNameGroup(text)}
						/>
						<FlatList
							data={myListFriend}
							keyExtractor={(item) => item.accountId?.toString() || ""}
							style={{ width: "100%" }}
							renderItem={({ item }) => (
								<FriendItem
									item={item}
									checked={checked}
									onChecked={(contact) => {
										handleChecked(contact.accountId ?? "");
									}}
								/>
							)}
						/>
						<TouchableOpacity
							style={{
								width: "100%",
								height: 50,
								backgroundColor: colors.brand,
								borderRadius: 10,
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={handlePressCreateGroup}
						>
							<Text
								style={{
									color: "white",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Tạo nhóm
							</Text>
						</TouchableOpacity>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								marginBottom: 10,
							}}
						></View>
					</View>
				</View>
			</Modal>

			<View style={styles.searchBar}>
				<Ionicons
					name="search"
					size={20}
					color="white"
					style={styles.icon}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="Tìm kiếm"
					placeholderTextColor="white"
					value={searchText}
					onChangeText={setSearchText}
				/>
				<Ionicons
					name="qr-code"
					size={20}
					color="white"
					style={styles.icon}
					onPress={() => navigation.push("Qr")}
				/>
				<Ionicons
					name="add"
					size={24}
					color="white"
					style={styles.icon}
					onPress={() => {
						setShowCreateGroupModal(true);
					}}
				/>
			</View>

			{status === "loading" ? (
				<ActivityIndicator size={"large"} />
			) : (
				<FlatList
					data={room}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ChatItem
							item={item}
							myUserId={myUserId}
						/>
					)}
					ListEmptyComponent={() => (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
							<Text style={{ color: "#6b7280", textAlign: "center" }}>
								Không có cuộc trò chuyện nào
							</Text>
						</View>
					)}
					style={styles.chatList}
					contentContainerStyle={{
						justifyContent: "flex-start",
						alignItems: "flex-start",
						flex: 1,
						width: "100%",
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
	searchBar: {
		flex: 1,
		maxHeight: 50,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#3b82f6",
		padding: 8,
		width: "100%",
	},
	icon: {
		marginHorizontal: 8,
	},
	searchInput: {
		flex: 1,
		color: "white",
		fontSize: 16,
	},
	chatList: {
		flex: 1,
		backgroundColor: "#f3f4f6",
		width: "100%",
	},
	chatItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "white",
	},
	avatarContainer: {
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#3b82f6",
	},
	avatarText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	chatContent: {
		marginLeft: 12,
		flex: 1,
	},
	chatName: {
		fontWeight: "600",
		color: "black",
	},
	chatMessage: {
		color: "#6b7280",
		fontSize: 14,
	},
	chatTime: {
		color: "#9ca3af",
		fontSize: 12,
	},
	safeArea: {
		flex: 1,
		width: "100%",
	},

	contactItem: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
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
	statusText: {
		fontSize: 12,
		marginTop: 2,
	},

	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: "gray",
	},
	sectionHeader: {
		backgroundColor: "#f3f4f6",
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	sectionText: {
		fontWeight: "bold",
		color: "#374151",
	},
});

export default ListChat;
