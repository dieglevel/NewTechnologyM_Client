import { images } from "@/assets/images";
import { colors } from "@/constants";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { initMyListFriend, initRoom, setSelectedRoom } from "@/libs/redux";
import { RootState, store } from "@/libs/redux/redux.config";
import { getProfileFromAnotherUser } from "@/services/auth";
import { addMember, createRoom, getMyListRoom } from "@/services/room";
import { IDetailInformation, IFriend, IRoom } from "@/types/implement";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { handleForwardMessage } from "./../chatDetail/message-utils";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import Toast from "react-native-toast-message";
import { getListFriend } from "@/services/friend";

interface IChatItem {
  item: IRoom;
  myUserId: string;
}

const ChatItem = ({ item, myUserId }: IChatItem) => {
  const navigation = useNavigation<StackScreenNavigationProp>();
  const dispatch = useDispatch();
  const route = useRoute<any>();

  const handlePress = () => {
    const { forwardMessage, senderId, roomId } = route.params || {};
    if (forwardMessage) {
      // Handle forwarding message
      handleForwardMessage(
        forwardMessage._id,
        roomId,
        senderId,
        item.id,
        () => {} // No modal to close in this context
      );
      navigation.goBack();
    } else {
      // Normal chat navigation
      dispatch(setSelectedRoom(item));
      navigation.navigate("ChatScreen", { room: item });
    }
  };

  const renderAvatar = () => {
    if (item.type === "single") {
      const account = item.detailRoom.find((detail) => {
        return detail.id !== myUserId;
      });

      return (
        <Image
          source={account?.avatar ? { uri: account?.avatar } : images.avatarDefault}
          style={styles.avatarContainer}
        />
      );
    } else {
      return (
        <Image
          source={item.avatar ? { uri: item?.avatar } : images.group}
          style={[, { width: 30, height: 30 }]}
        />
      );
    }
  };

  const renderName = () => {
    if (item.type === "single") {
      const account = item.detailRoom.find((detail) => {
        return detail.id !== myUserId;
      });
      return account?.fullName || "Unknown User";
    } else {
      return item.name || "Group Chat";
    }
  };

  const renderMessage = () => {
    const message = () => {
      console.log(item.latestMessage);
      if (item.latestMessage?.sticker) {
        return "Đã gửi một nhãn dán";
      }
      if (item.latestMessage?.content) {
        return item.latestMessage.content;
      }
      return null;
    };

    const accountMessage = item.latestMessage?.accountId;

    const account = item.detailRoom.find((detail) => {
      return detail.id === accountMessage;
    });

    return message() !== null && (account ? account?.fullName + ": " + message() : "Bạn: " + message());
  };

  return (
    <TouchableOpacity style={styles.chatItemContainer} onPress={handlePress}>
      <View style={styles.avatarContainer}>{renderAvatar()}</View>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{renderName()}</Text>
        <Text style={styles.chatMessage}>{renderMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface ContactItemProps {
	item: IFriend;
	checked: string[];
	onChecked?: (contact: IFriend) => void;
}

const FriendItem = ({ item, checked, onChecked }: ContactItemProps) => {
	return (
		<TouchableOpacity
			style={styles.contactItem}
			onPress={() => {
				if (onChecked) {
					onChecked(item);
				}
			}}
		>
			{/* <View style={[styles.avatar, { backgroundColor: getRandomColor(item.detail?.fullName ?? "-") }]}> */}

			<Image
				source={item.detail?.avatarUrl ? { uri: item.detail?.avatarUrl } : images.avatarDefault}
				style={styles.avatar}
				resizeMode="cover"
			/>
			{/* </View> */}
			<View style={styles.contactInfo}>
				<Text style={styles.contactName}>{item.detail?.fullName}</Text>
			</View>
			<TouchableOpacity style={{ marginLeft: 10 }}>
				<View
					style={{
						width: 20,
						height: 20,
						borderRadius: 10,
						borderWidth: 1,
						borderColor: "black",
						backgroundColor: checked.includes(item.accountId ?? "") ? colors.brand : "white",
					}}
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export const ListChat = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const { room, status } = useSelector((state: RootState) => state.room);
	const { myListFriend } = useSelector((state: RootState) => state.myListFriend);

	const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
	const [checked, setChecked] = useState<string[]>([]);
	const [nameGroup, setNameGroup] = useState<string>("");


	const isFocused = useIsFocused();
	const [myUserId, setMyUserId] = useState<string>("");

	const [searchText, setSearchText] = useState<string>("");


  useEffect(() => {
    const getMyId = async () => {
      const value = await getSecure(ExpoSecureStoreKeys.UserId);
      setMyUserId(value ?? "");
      return;
    };
    const fetchedRoom = async () => {
      const response = await getMyListRoom();
      if (response?.statusCode === 200 && response.data) {
        await store.dispatch(initRoom(response?.data.listRoomResponse || []));
      }
    };
    fetchedRoom();
    getMyId();
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
		const response = await getMyListRoom();
		if (response?.statusCode === 200 && response.data) {
			await store.dispatch(initRoom(response?.data.listRoomResponse || []));
		}
	};

	useEffect(() => {
		const getMyId = async () => {
			const value = await getSecure(ExpoSecureStoreKeys.UserId);
			setMyUserId(value ?? "");
			return;
		};

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

		fetchedRoom();
		fetchedFriend();

		getMyId();
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
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
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
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
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