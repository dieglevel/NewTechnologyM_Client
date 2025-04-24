import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Modal,
	Dimensions,
	Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";

import axios from "axios";
import { useColorScheme } from "react-native";
import { Audio } from "expo-av";
import RenderChatItem from "./render-chat-item";
import RenderImageItem from "./render-image-item";
import RenderActionItem from "./render-action-item";
import { startRecording, stopRecording } from "./audio-utils";
import {
	copyMessage,
	handleEditMessage,
	handleRecallMessage,
	// copyMessage,
	// handleEditMessage,
	sendMessage,
	toggleSearchBar,
	// handleRecallMessage,
	// handleReactionSelect,
	// closeImageModal,
	// forwardMessage,
	// cancelEdit,
} from "./message-utils";
import { showUserInfo, closeUserInfoModal } from "./user-modal";
import styles from "./styles";
import { ChatScreenRouteProp } from "@/libs/navigation";
import { IMessage, IRoom } from "@/types/implement";
import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { getMessageByRoomId, IMessageResponse } from "@/services/message";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { store, useAppSelector } from "@/libs/redux/redux.config";
import { socketService } from "@/libs/socket/socket";
import { SocketEmit, SocketOn } from "@/constants/socket";
import Header from "./header/chat-header";
import Footer from "./footer/chat-footer";
import RenderMessageItem from "./body/render-message-item";

const ITEM_HEIGHT = 60;

const ChatDetail = () => {
	const navigation = useNavigation();
	const isDark = false;

	const [myUserId, setMyUserId] = useState<string | null>(null);
	const { detailInformation } = useAppSelector((state) => state.detailInformation);
	const {selectedRoom} = useAppSelector((state) => state.selectedRoom)

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

	const [searchQuery, setSearchQuery] = useState("");
	const [showSearchBar, setShowSearchBar] = useState(false);

	const [showUserInfoModal, setShowUserInfoModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{
		name: string;
		avatar: string;
		status?: string;
		phone?: string;
	} | null>(null);
	const flatListRef = useRef<FlatList>(null);
	const imageFlatListRef = useRef<FlatList>(null);
	
	const isFocused = useIsFocused();


	useEffect(() => {
		
		const fetchMessages = async () => {
			try {
				const response = await getMessageByRoomId(selectedRoom?.id || "");
				if (response.statusCode === 200 && response.data) {
					console.log("Messages fetched:", response.data);
					setMessages(response.data);
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}
		};

		const getUserId = async () => {
			const userId = await getSecure(ExpoSecureStoreKeys.UserId);
			if (userId) {
				setMyUserId(userId);
			}
		};
		fetchMessages();
		getUserId();
	},[])

	useEffect(() => {


		socketService.emit(SocketEmit.joinRoom, {
			room_id: selectedRoom?.id || "",
		});
		socketService.on(SocketOn.joinRoom, (data: any) => {
		});

		socketService.on(SocketOn.sendMessage, (data: IMessageResponse) => {
			setMessages((prev) => {

				return [...prev, data.message];
			});
		});

		return () => {
			socketService.off(SocketOn.sendMessage);
			socketService.off(SocketOn.joinRoom);
		};
	}, [isFocused]);

	const scrollToBottom = () => {
		flatListRef.current?.scrollToEnd({ animated: true });
	};

	const filteredMessages = messages?.filter((msg) =>
		msg.content?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const getActionItems = () => {
		if (!actionMessage) return [];

		const isMyMessage = actionMessage._id === myUserId;
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
					setShowForwardModal(true);
					setShowActionModal(false);
				},
			},
		];

		// if (isMyMessage && actionMessage.content !== "Tin nhắn đã được thu hồi") {
		// 	items.push(
		// 		{
		// 			icon: "pencil-outline",
		// 			label: "Chỉnh sửa",
		// 			onPress: () =>
		// 				handleEditMessage(
		// 					actionMessage._id || "",
		// 					actionMessage.content || "",
		// 					setEditingMessageId,
		// 					setEditText,
		// 					setInputText,
		// 					setShowActionModal,
		// 				),
		// 		},
		// 		{
		// 			icon: "trash-outline",
		// 			label: "Thu hồi",
		// 			onPress: () =>
		// 				handleRecallMessage(
		// 					actionMessage._id || "",
		// 					isMyMessage,
		// 					setMessages,
		// 					setShowActionModal,
		// 				),
		// 		},
		// 	);
		// }

		return items;
	};

	return (
		<View style={[styles.container, isDark && styles.darkContainer]}>
			<Header
				showSearchBar={showSearchBar}
				setShowSearchBar={setShowSearchBar}
				setSearchQuery={setSearchQuery}
			/>

			{showSearchBar && (
				<View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
					<TextInput
						style={[styles.searchInput, isDark && styles.darkSearchInput]}
						placeholder="Tìm kiếm tin nhắn..."
						placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
						value={searchQuery}
						onChangeText={setSearchQuery}
						autoFocus
					/>
					<TouchableOpacity
						onPress={() => toggleSearchBar(showSearchBar, setShowSearchBar, setSearchQuery)}
						style={styles.cancelSearchButton}
					>
						<Text style={styles.cancelSearchText}>Hủy</Text>
					</TouchableOpacity>
				</View>
			)}

			<FlatList
				ref={flatListRef}
				data={showSearchBar ? filteredMessages : messages.slice().reverse()}
				keyExtractor={(item: IMessage, index) =>
					index.toString()
				}
				initialNumToRender={20}
				maxToRenderPerBatch={20}
				windowSize={5}
				removeClippedSubviews
				getItemLayout={(_, index) => ({
				  length: ITEM_HEIGHT,
				  offset: ITEM_HEIGHT * index,
				  index,
				})}
				inverted
				renderItem={({ item }) => (
					<RenderMessageItem
						item={item}
						myUserId={myUserId}
						setMessages={setMessages}
						detailInformation={detailInformation}
						setActionMessage={setActionMessage}
						setShowActionModal={setShowActionModal}
						showUserInfo={(user) => showUserInfo(user, setSelectedUser, setShowUserInfoModal)}
						setShowUserInfoModal={setShowUserInfoModal}
						isDark={isDark}
					/>
				)}
				contentContainerStyle={styles.flatListContent}
			/>

			<Modal
				visible={showReactionPicker}
				transparent
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.reactionModalContainer}
					onPress={() => setShowReactionPicker(false)}
				>
					<View style={styles.reactionModalContent}>
						{/* {REACTIONS.map((emoji) => (
							<TouchableOpacity
								key={emoji}
								onPress={() =>
									handleReactionSelect(
										emoji,
										selectedMessageId,
										setMessages,
										setShowReactionPicker,
										setSelectedMessageId,
										setShowActionModal,
									)
								}
								style={styles.reactionButton}
							>
								<Text style={styles.reactionEmoji}>{emoji}</Text>
							</TouchableOpacity>
						))} */}
					</View>
				</TouchableOpacity>
			</Modal>

			<Modal
				visible={showImageModal}
				transparent
				animationType="fade"
			>
				<View style={styles.imageModalContainer}>
					<TouchableOpacity
						style={styles.imageModalOverlay}
						// onPress={() =>
						// 	closeImageModal(
						// 		setShowImageModal,
						// 		setAllImageUris,
						// 		setInitialImageIndex,
						// 		setCurrentImageIndex,
						// 	)
						// }
					/>
					<View style={styles.imageModalContent}>
						<FlatList
							ref={imageFlatListRef}
							data={allImageUris}
							renderItem={RenderImageItem}
							keyExtractor={(item, index) => index.toString()}
							horizontal
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							initialScrollIndex={initialImageIndex}
							getItemLayout={(data, index) => ({
								length: Dimensions.get("window").width,
								offset: Dimensions.get("window").width * index,
								index,
							})}
							onMomentumScrollEnd={(event) => {
								const index = Math.round(
									event.nativeEvent.contentOffset.x / Dimensions.get("window").width,
								);
								setCurrentImageIndex(index);
							}}
						/>
						{allImageUris.length > 0 && (
							<Text style={styles.imageCounter}>
								{currentImageIndex + 1}/{allImageUris.length}
							</Text>
						)}
						<TouchableOpacity
							style={styles.closeImageButton}
							// onPress={() =>
							// 	closeImageModal(
							// 		setShowImageModal,
							// 		setAllImageUris,
							// 		setInitialImageIndex,
							// 		setCurrentImageIndex,
							// 	)
							// }
						>
							<Ionicons
								name="close"
								size={30}
								color="white"
							/>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal
				visible={showActionModal}
				transparent
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.actionModalContainer}
					onPress={() => setShowActionModal(false)}
				>
					<View style={[styles.actionModalContent, isDark && styles.darkActionModalContent]}>
						<FlatList
							data={getActionItems()}
							renderItem={({ item }) => <RenderActionItem item={item} />}
							keyExtractor={(item) => item.label}
							contentContainerStyle={styles.actionListContent}
						/>
					</View>
				</TouchableOpacity>
			</Modal>

			<Modal
				visible={showForwardModal}
				transparent
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.forwardModalContainer}
					onPress={() => setShowForwardModal(false)}
				>
					<View style={[styles.forwardModalContent, isDark && styles.darkForwardModalContent]}>
						<Text style={[styles.forwardModalTitle, isDark && styles.darkForwardModalTitle]}>
							Chọn cuộc trò chuyện
						</Text>
						{/* <FlatList
							data={mockChats}
							renderItem={({ item }) => (
								<RenderChatItem
									item={item}
									forwardMessage={() =>
										forwardMessage(
											item.id,
											actionMessage,
											setShowForwardModal,
											setShowActionModal,
										)
									}
								/>
							)}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.chatListContent}
						/> */}
						<TouchableOpacity
							style={styles.cancelForwardButton}
							onPress={() => setShowForwardModal(false)}
						>
							<Text style={styles.cancelForwardText}>Hủy</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			<Modal
				visible={showUserInfoModal}
				transparent
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.userInfoModalContainer}
					onPress={() => closeUserInfoModal(setShowUserInfoModal, setSelectedUser)}
				>
					<View style={[styles.userInfoModalContent, isDark && styles.darkUserInfoModalContent]}>
						{selectedUser && (
							<>
								<Image
									source={{ uri: selectedUser.avatar }}
									style={styles.userInfoAvatar}
								/>
								<Text style={[styles.userInfoName, isDark && styles.darkUserInfoName]}>
									{selectedUser.name}
								</Text>
								<View style={styles.userInfoDetail}>
									<Ionicons
										name="ellipse"
										size={16}
										color={
											selectedUser.status === "Đang hoạt động" ? "#22c55e" : "#6b7280"
										}
										style={styles.userInfoIcon}
									/>
									<Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
										{selectedUser.status}
									</Text>
								</View>
								<View style={styles.userInfoDetail}>
									<Ionicons
										name="call-outline"
										size={16}
										color="#3b82f6"
										style={styles.userInfoIcon}
									/>
									<Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
										{selectedUser.phone}
									</Text>
								</View>
								<TouchableOpacity
									style={styles.closeUserInfoButton}
									onPress={() => closeUserInfoModal(setShowUserInfoModal, setSelectedUser)}
								>
									<Text style={styles.closeUserInfoText}>Đóng</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</TouchableOpacity>
			</Modal>

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
