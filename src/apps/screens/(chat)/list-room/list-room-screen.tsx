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
import { createGroup, fetchedFriend } from "./handle";
import { SafeAreaView } from "react-native-safe-area-context";

export const ListRoomScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const { room, status } = useSelector((state: RootState) => state.room);
	const { myListFriend } = useSelector((state: RootState) => state.myListFriend);

	const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
	const [checked, setChecked] = useState<string[]>([]);
	const [nameGroup, setNameGroup] = useState<string>("");

	const [searchText, setSearchText] = useState<string>("");

	const myUserId = ExpoSecureValueService.getUserId();

	const isFocused = useIsFocused();

	const sortRoom = () => {
		if (room && room.length > 0) {
			const sortedRoom = [...room].sort((a, b) => {
				const aTime = new Date(a.updatedAt ? a.updatedAt : "").getTime();
				const bTime = new Date(b.updatedAt ? b.updatedAt : "").getTime();
				return bTime - aTime; // Sort in descending order
			});
			return sortedRoom;
		}
		return room;
	};

	const filteredRooms = () => {
		const sortedRoom = sortRoom();
		if (sortedRoom === null) {
			return [];
		}
		if (searchText.trim() === "") {
			return sortedRoom;
		} else {
			return sortedRoom.filter((item) => {
				if (item.type === "group") {
					return item.name?.toLowerCase().includes(searchText.toLowerCase());
				} else {
					if (item.detailRoom && item.detailRoom.length > 0) {
						return item.detailRoom.some((detail) => {
							return detail.fullName?.toLowerCase().includes(searchText.toLowerCase());
						});
					}
				}
			});
		}
	};

	useEffect(() => {
		setSearchText("");
	}, [isFocused]);
	const handleChecked = (id: string) => {
		if (checked.includes(id)) {
			setChecked(checked.filter((item) => item !== id));
		} else {
			setChecked([...checked, id]);
		}
	};

	// useEffect(() => {
	// 	fetchedFriend();
	// }, [isFocused]);
	return (
		<SafeAreaView>
			<View style={styles.container}>
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
									size={20}
									color="white"
									style={styles.icon}
									onPress={() => {
										navigation.push("CreateRoomScreen");
									}}
								/>
							</View>
				{status === "loading" ? (
					<ActivityIndicator size={"large"} />
				) : (
					<FlatList
					
						data={filteredRooms()}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<>
								<ChatItem
									item={item}
									myUserId={myUserId}
								/>
							</>
						)}
						ListEmptyComponent={() => (
							<View
								style={{
									flex: 1,
									justifyContent: "center",
									alignItems: "center",
									width: "100%",
								}}
							>
								<Text style={{ color: "#6b7280", textAlign: "center" }}>
									{searchText ? "Không tìm thấy phòng nào" : "Không có cuộc trò chuyện nào"}
								</Text>
							</View>
						)}
						style={styles.chatList}
						contentContainerStyle={{
							justifyContent: "flex-start",
							alignItems: "flex-start",
						}}
						scrollEnabled={true}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					/>
				)}
			</View>
		</SafeAreaView>
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
		minHeight: 50,
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
		marginHorizontal: 8,
		fontSize: 16,
	},
	chatList: {

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
