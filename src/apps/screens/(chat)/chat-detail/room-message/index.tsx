import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Image,
	Modal,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { colors } from "@/constants";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { useAppSelector } from "@/libs/redux/redux.config";
import { socketService } from "@/libs/socket/socket";
import { getMessageByRoomId } from "@/services/message";
import { IMessage, IRoom } from "@/types/implement";
import RenderMessageItem from "./body/message-item";
import Footer from "./footer/chat-footer";
import Header from "./header/chat-header";
import {
	copyMessage,
	getRooms,
	handleEditMessage,
	handleForwardMessage,
	handleRecallMessage,
	toggleSearchBar,
} from "./message-utils";
import RenderActionItem from "./render-action-item";
import RenderImageItem from "./render-image-item";
import styles from "./styles";
import { closeUserInfoModal, showUserInfo } from "./user-modal";

const ITEM_HEIGHT = 60;

const ChatDetail = () => {
	const navigation = useNavigation();
	const isDark = false;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(false); // Thêm trạng thái loading cho rooms
	const [myUserId, setMyUserId] = useState<string | null>(null);
	const { detailInformation } = useAppSelector((state) => state.detailInformation);
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const [messages, setMessages] = useState<IMessage[]>([]);
	const [showReactionPicker, setShowReactionPicker] = useState(false);
	const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [showImageModal, setShowImageModal] = useState(false);
	const [allImageUris, setAllImageUris] = useState<string[]>([]);
	const [initialImageIndex, setInitialImageIndex] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showActionModal, setShowActionModal] = useState(false);
	const [actionMessage, setActionMessage] = useState<IMessage | null>(null);
	const [showForwardModal, setShowForwardModal] = useState(false);
	const [rooms, setRooms] = useState<IRoom[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [showUserInfoModal, setShowUserInfoModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{
		name: string;
		avatar: string;
		status?: string;
		phone?: string;
	} | null>(null);
	const [isForwarding, setIsForwarding] = useState(false);

	const flatListRef = useRef<FlatList>(null);
	const imageFlatListRef = useRef<FlatList>(null);
	const isFocused = useIsFocused();

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await getMessageByRoomId(selectedRoom?.id || "");
				if (response.statusCode === 200 && response.data) {
					setMessages(response.data);
				}
			} catch (error) {
				const e = error as ErrorResponse;
				console.error("Error fetching messages:", e);
			} finally {
				setIsLoading(false);
			}
		};

		const getUserId = async () => {
			const userId = await getSecure(ExpoSecureStoreKeys.UserId);
			if (userId) {
				setMyUserId(userId);
			}
		};

		const fetchRooms = async () => {
			setIsLoadingRooms(true);
			try {
				const roomsData = await getRooms();
				setRooms(roomsData || []);
			} catch (error) {
				setRooms([]);
			} finally {
				setIsLoadingRooms(false);
			}
		};

		fetchMessages();
		getUserId();
		fetchRooms();
	}, [isFocused]);

	useEffect(() => {
		socketService.emit(SocketEmit.joinRoom, {
			room_id: selectedRoom?.id || "",
		});
		socketService.on(SocketOn.joinRoom, (data: any) => {});

		socketService.on(SocketOn.sendMessage, (data: any) => {
			const { message, behavior } = data;

			switch (behavior) {
				case "add":
					setMessages((prev) => [...prev, data.message]);
					break;
				case "update":
					setMessages((prev) => {
						const index = prev.findIndex((msg) => msg._id === message._id);
						if (index !== -1) {
							const updatedMessages = [...prev];
							updatedMessages[index] = message;
							return updatedMessages;
						}
						return prev;
					});
					break;
				case "revoke":
					setMessages((prev) => {
						const index = prev.findIndex((msg) => msg._id === message._id);
						if (index !== -1) {
							const updatedMessages = [...prev];
							updatedMessages[index] = {
								...updatedMessages[index],
								content: "Tin nhắn đã được thu hồi",
							};
							return updatedMessages;
						}
						return prev;
					});
					break;
				case "delete":
					break;
				default:
					break;
			}
		});

		socketService.on(SocketOn.forwardMessage, (data: any) => {
			const { message, toRoomId } = data;
			if (toRoomId === selectedRoom?.id) {
				setMessages((prev) => [...prev, message]);
			}
		});

		return () => {
			socketService.off(SocketOn.sendMessage);
			socketService.off(SocketOn.joinRoom);
			socketService.off(SocketOn.forwardMessage);
		};
	}, [isFocused]);
	const filteredMessages = messages?.filter((msg) => {
		if (!msg.isRevoked) {
			return msg.content?.toLowerCase().includes(searchQuery.toLowerCase());
		}
	});

	const getActionItems = () => {
		if (!actionMessage) return [];

		const isMyMessage = actionMessage.accountId === myUserId;
		const items = [
			{
				icon: "heart-outline",
				label: "Thêm Reaction",
				onPress: () => {
					setSelectedMessageId(actionMessage._id ?? "");
					setShowReactionPicker(true);
					setShowActionModal(false);
				},
			},
			{
				icon: "copy-outline",
				label: "Sao chép",
				onPress: () => copyMessage(actionMessage.content ?? "", setShowActionModal),
			},
			{
				icon: "share-outline",
				label: "Chuyển tiếp",
				onPress: () => {
					if (rooms.length === 0) {
						alert("Không có cuộc trò chuyện nào để chuyển tiếp.");
					} else {
						setShowForwardModal(true);
						setShowActionModal(false);
					}
				},
			},
			{
				icon: "remove",
				label: "Thu hồi tin nhắn",
				onPress: () => {
					if (rooms.length === 0) {
						alert("Không có cuộc trò chuyện nào để chuyển tiếp.");
					} else {
						handleRecallMessage(
							actionMessage?._id ?? "",
							isMyMessage,
							setMessages,
							setShowActionModal,
						);
					}
				},
			},
		];

		if (isMyMessage && actionMessage.content !== "Tin nhắn đã được thu hồi") {
			items.push(
				{
					icon: "pencil-outline",
					label: "Chỉnh sửa",
					onPress: () =>
						handleEditMessage(
							actionMessage._id || "",
							actionMessage.content || "",
							setEditingMessageId,
							setShowActionModal,
						),
				},
				{
					icon: "trash-outline",
					label: "Thu hồi",
					onPress: () =>
						handleRecallMessage(
							actionMessage._id || "",
							isMyMessage,
							setMessages,
							setShowActionModal,
						),
				},
			);
		}

		return items;
	};

	const RenderRoomItem = ({ item }: { item: IRoom }) => {
		const renderAvatar = () => {
			if (item.type === "single") {
				const account = item.detailRoom?.find((detail) => detail.id !== myUserId);
				return (
					<Image
						source={account?.avatar ? { uri: account.avatar } : { uri: "default_avatar" }}
						style={styles.forwardRoomAvatar}
					/>
				);
			} else {
				return (
					<Image
						source={item.avatar ? { uri: item.avatar } : { uri: "default_group" }}
						style={styles.forwardRoomAvatar}
					/>
				);
			}
		};

		const renderName = () => {
			if (item.type === "single") {
				const account = item.detailRoom?.find((detail) => detail.id !== myUserId);
				return account?.fullName || "Unknown User";
			} else {
				return item.name || "Group Chat";
			}
		};

		return (
			<TouchableOpacity
				style={styles.forwardRoomItem}
				disabled={isForwarding}
				onPress={async () => {
					setIsForwarding(true);
					try {
						await handleForwardMessage(
							actionMessage?._id || "",
							item.id,
							myUserId || "",
							item.id,
							setShowActionModal,
						);
						setShowForwardModal(false);
					} catch (error) {
						console.error("Lỗi khi chuyển tiếp tin nhắn:", error);
					} finally {
						setIsForwarding(false);
					}
				}}
			>
				{isForwarding && (
					<ActivityIndicator
						size="small"
						color={colors.brand}
					/>
				)}
				{renderAvatar()}
				<Text style={styles.forwardRoomName}>{renderName()}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={[styles.container]}>
			<Header
				myUserId={myUserId}
				showSearchBar={showSearchBar}
				searchQuery={searchQuery}
				setShowSearchBar={setShowSearchBar}
				setSearchQuery={setSearchQuery}
			/>
			<Footer
				isDark={isDark}
				editingMessageId={editingMessageId}
				setEditingMessageId={setEditingMessageId}
				setMessages={setMessages}
			/>
		</View>
	);
};

export default ChatDetail;

// {showSearchBar && (
//   <View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
//     <TextInput
//       style={[styles.searchInput, isDark && styles.darkSearchInput]}
//       placeholder="Tìm kiếm tin nhắn..."
//       placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
//       value={searchQuery}
//       onChangeText={setSearchQuery}
//       autoFocus
//     />
//     <TouchableOpacity
//       onPress={() => toggleSearchBar(showSearchBar, setShowSearchBar, setSearchQuery)}
//       style={styles.cancelSearchButton}
//     >
//       <Text style={styles.cancelSearchText}>Hủy</Text>
//     </TouchableOpacity>
//   </View>
// )}

// {isLoading ? (
//   <View style={{ flex: 1, justifyContent: "center" }}>
//     <ActivityIndicator size={"large"} color={colors.brand} />
//   </View>
// ) : (
//   <>
//     {messages.length <= 0 ? (
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <Text style={{ textAlign: "center", fontWeight: "bold" }}>
//           Chưa có tin nhắn nào
//         </Text>
//       </View>
//     ) : (
//       <FlatList
//         ref={flatListRef}
//         data={searchQuery ? filteredMessages : messages.toReversed()}
//         keyExtractor={(item: IMessage, index) => item._id.toString()}
//         initialNumToRender={20}
//         maxToRenderPerBatch={20}
//         windowSize={5}
//         removeClippedSubviews
//         getItemLayout={(_, index) => ({
//           length: ITEM_HEIGHT,
//           offset: ITEM_HEIGHT * index,
//           index,
//         })}
//         inverted
//         renderItem={({ item }) => (
//           <RenderMessageItem
//             key={item._id}
//             item={item}
//             myUserId={myUserId}
//             setMessages={setMessages}
//             detailInformation={detailInformation}
//             setActionMessage={setActionMessage}
//             setShowActionModal={setShowActionModal}
//             showUserInfo={(user) =>
//               showUserInfo(user, setSelectedUser, setShowUserInfoModal)
//             }
//             setShowUserInfoModal={setShowUserInfoModal}
//             isDark={isDark}
//           />
//         )}
//         contentContainerStyle={styles.flatListContent}
//       />
//     )}
//   </>
// )}

// <Modal visible={showReactionPicker} transparent animationType="fade">
//   <TouchableOpacity
//     style={styles.reactionModalContainer}
//     onPress={() => setShowReactionPicker(false)}
//   >
//     <View style={styles.reactionModalContent}>
//       {/* Reaction picker content */}
//     </View>
//   </TouchableOpacity>
// </Modal>

// <Modal visible={showImageModal} transparent animationType="fade">
//   <View style={styles.imageModalContainer}>
//     <TouchableOpacity
//       style={styles.imageModalOverlay}
//       onPress={() => {
//         setShowImageModal(false);
//         setAllImageUris([]);
//         setInitialImageIndex(0);
//         setCurrentImageIndex(0);
//       }}
//     />
//     <View style={styles.imageModalContent}>
//       <FlatList
//         ref={imageFlatListRef}
//         data={allImageUris}
//         renderItem={RenderImageItem}
//         keyExtractor={(item, index) => index.toString()}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         initialScrollIndex={initialImageIndex}
//         getItemLayout={(data, index) => ({
//           length: Dimensions.get("window").width,
//           offset: Dimensions.get("window").width * index,
//           index,
//         })}
//         onMomentumScrollEnd={(event) => {
//           const index = Math.round(
//             event.nativeEvent.contentOffset.x / Dimensions.get("window").width
//           );
//           setCurrentImageIndex(index);
//         }}
//       />
//       {allImageUris.length > 0 && (
//         <Text style={styles.imageCounter}>
//           {currentImageIndex + 1}/{allImageUris.length}
//         </Text>
//       )}
//       <TouchableOpacity
//         style={styles.closeImageButton}
//         onPress={() => {
//           setShowImageModal(false);
//           setAllImageUris([]);
//           setInitialImageIndex(0);
//           setCurrentImageIndex(0);
//         }}
//       >
//         <Ionicons name="close" size={30} color="white" />
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>

// <Modal visible={showActionModal} transparent animationType="fade">
//   <TouchableOpacity
//     style={styles.actionModalContainer}
//     onPress={() => setShowActionModal(false)}
//   >
//     <View style={[styles.actionModalContent, isDark && styles.darkActionModalContent]}>
//       <FlatList
//         data={getActionItems()}
//         renderItem={({ item }) => <RenderActionItem item={item} />}
//         keyExtractor={(item) => item.label}
//         contentContainerStyle={styles.actionListContent}
//       />
//     </View>
//   </TouchableOpacity>
// </Modal>

// <Modal visible={showForwardModal} transparent animationType="fade">
//   <TouchableOpacity
//     style={styles.forwardModalContainer}
//     onPress={() => setShowForwardModal(false)}
//   >
//     <View style={[styles.forwardModalContent, isDark && styles.darkForwardModalContent]}>
//       <Text style={[styles.forwardModalTitle, isDark && styles.darkForwardModalTitle]}>
//        Chọn cuộc trò chuyện
//       </Text>
//       {isLoadingRooms ? (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <ActivityIndicator size="large" color={colors.brand} />
//         </View>
//       ) : rooms.length === 0 ? (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <Text style={[styles.noRoomsText, isDark && styles.darkNoRoomsText]}>
//             Không có cuộc trò chuyện nào
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={rooms}
//           renderItem={ ({ item }) => (
//     <RenderRoomItem item={item} />
//   )}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.chatListContent}
//         />
//       )}
//       <TouchableOpacity
//         style={styles.cancelForwardButton}
//         onPress={() => setShowForwardModal(false)}
//       >
//         <Text style={styles.cancelForwardText}>Hủy</Text>
//       </TouchableOpacity>
//     </View>
//   </TouchableOpacity>
// </Modal>

// <Modal visible={showUserInfoModal} transparent animationType="fade">
//   <TouchableOpacity
//     style={styles.userInfoModalContainer}
//     onPress={() => closeUserInfoModal(setShowUserInfoModal, setSelectedUser)}
//   >
//     <View style={[styles.userInfoModalContent, isDark && styles.darkUserInfoModalContent]}>
//       {selectedUser && (
//         <>
//           <Image source={{ uri: selectedUser.avatar }} style={styles.userInfoAvatar} />
//           <Text style={[styles.userInfoName, isDark && styles.darkUserInfoName]}>
//             {selectedUser.name}
//           </Text>
//           <View style={styles.userInfoDetail}>
//             <Ionicons
//               name="ellipse"
//               size={16}
//               color={selectedUser.status === "Đang hoạt động" ? "#22c55e" : "#6b7280"}
//               style={styles.userInfoIcon}
//             />
//             <Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
//               {selectedUser.status}
//             </Text>
//           </View>
//           <View style={styles.userInfoDetail}>
//             <Ionicons
//               name="call-outline"
//               size={16}
//               color="#3b82f6"
//               style={styles.userInfoIcon}
//             />
//             <Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
//               {selectedUser.phone}
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.closeUserInfoButton}
//             onPress={() => closeUserInfoModal(setShowUserInfoModal, setSelectedUser)}
//           >
//             <Text style={styles.closeUserInfoText}>Đóng</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   </TouchableOpacity>
// </Modal>
