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
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useColorScheme } from "react-native";
import { Audio } from "expo-av";
import RenderMessageItem from "./render-message-item";
import RenderChatItem from "./render-chat-item";
import RenderImageItem from "./render-image-item";
import RenderActionItem from "./render-action-item";
import { startRecording, stopRecording } from "./audio-utils";
import {
	copyMessage,
	handleEditMessage,
	sendMessage,
	toggleSearchBar,
	handleRecallMessage,
	handleReactionSelect,
	closeImageModal,
	forwardMessage,
	cancelEdit,
} from "./message-utils";
import { showUserInfo, closeUserInfoModal } from "./user-utils";
import styles from "./styles";
import { ChatScreenRouteProp } from "@/libs/navigation";
import { IMessage, IRoom } from "@/types/implement";

const REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "😡"];
const mockChats = [
	{ id: "chat1", name: "Nhóm bạn", avatar: "https://example.com/avatar1.png" },
	{ id: "chat2", name: "Gia đình", avatar: "https://example.com/avatar2.png" },
	{ id: "chat3", name: "Công việc", avatar: "https://example.com/avatar3.png" },
];

interface Props {
  room: IRoom
}

const ChatDetail = ({room}: Props) => {
	const navigation = useNavigation();
	const colorScheme = useColorScheme();
	const isDark = false;

	// const [messages, setMessages] = useState<
	// 	{
	// 		id: string;
	// 		text: string;
	// 		sender: string;
	// 		time: string;
	// 		read?: boolean;
	// 		avatar: string;
	// 		senderName: string;
	// 		reaction: string | null;
	// 		images?: string[] | null;
	// 		files?: string[] | null;
	// 		audio?: string | null;
	// 		isEdited?: boolean;
	// 	}[]
	// >([
	// 	{
	// 		id: "1",
	// 		text: "Xin chào!",
	// 		sender: "me",
	// 		time: "10:00",
	// 		read: true,
	// 		avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
	// 		senderName: "Tôi",
	// 		reaction: null,
	// 	},
	// 	{
	// 		id: "2",
	// 		text: "Chào bạn!",
	// 		sender: "other",
	// 		time: "10:01",
	// 		avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
	// 		senderName: "Minh",
	// 		reaction: null,
	// 	},
	// ]);

	const [messages, setMessages] = useState<IMessage[]>(); // Updated to IMessage[]

	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [recording, setRecording] = useState<any>(null);
	const [sound, setSound] = useState<any>(null);
	const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
	const [showReactionPicker, setShowReactionPicker] = useState(false);
	const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [editText, setEditText] = useState("");
	const [showImageModal, setShowImageModal] = useState(false);
	const [allImageUris, setAllImageUris] = useState<string[]>([]);
	const [initialImageIndex, setInitialImageIndex] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showActionModal, setShowActionModal] = useState(false);
	const [actionMessage, setActionMessage] = useState<any>(null);
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

	const filteredMessages = messages?.filter((msg) => msg.content?.toLowerCase().includes(searchQuery.toLowerCase()));

	const pickImages = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Quyền truy cập bị từ chối. Vui lòng cấp quyền truy cập vào thư viện ảnh.");
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsMultipleSelection: true,
			quality: 0.5,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const imageUris = result.assets.map((asset) => asset.uri);
			setSelectedImages(imageUris);
			sendMessage(
				"",
				imageUris,
				[],
				setMessages,
				editingMessageId,
				setEditingMessageId,
				setEditText,
				setInputText,
				setIsTyping,
				setSelectedImages,
				setSelectedFiles,
			);
		}
	};

	const pickDocument = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					"application/pdf",
					"application/msword",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				],
				multiple: true,
			});

			if (!result.canceled) {
				const files = result.assets.map((asset) => ({
					uri: asset.uri,
					name: asset.name,
					type: asset.mimeType || "application/octet-stream",
				}));
				setSelectedFiles(files);
				uploadFiles(files);
			}
		} catch (error) {
			alert("Lỗi: Không thể chọn file. Vui lòng thử lại.");
			// console.error("Error in pickDocument:", error);
		}
	};

	const uploadFiles = async (files: { uri: string; name: string; type: string }[]) => {
		try {
			const uploadedUrls: string[] = [];

			for (const file of files) {
				const formData = new FormData();
				formData.append("file", {
					uri: file.uri,
					name: file.name,
					type: file.type,
				} as any);

				// console.log("Uploading file:", file);

				const response = await axios.post(
					"https://your-api-domain.com/api/file-cloud/upload-single-file",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					},
				);

				// console.log("Upload response:", response.data);

				if (response.data && response.data.url) {
					uploadedUrls.push(response.data.url);
				}
			}

			if (uploadedUrls.length > 0) {
				// console.log("Uploaded URLs:", uploadedUrls);
				sendMessage(
					"",
					[],
					uploadedUrls,
					setMessages,
					editingMessageId,
					setEditingMessageId,
					setEditText,
					setInputText,
					setIsTyping,
					setSelectedImages,
					setSelectedFiles,
				);
			} else {
				alert("Lỗi: Không thể tải file lên server.");
			}
		} catch (error) {
			alert("Lỗi: Đã xảy ra lỗi khi tải file. Vui lòng thử lại.");
			// console.error("Error in uploadFiles:", error);
		}
	};

	const getActionItems = () => {
		if (!actionMessage) return [];

		const isMyMessage = actionMessage.sender === "me";
		const items = [
			{
				icon: "heart-outline",
				label: "Thêm Reaction",
				onPress: () => {
					setSelectedMessageId(actionMessage.id);
					setShowReactionPicker(true);
					setShowActionModal(false);
				},
			},
			{
				icon: "copy-outline",
				label: "Sao chép",
				onPress: () => copyMessage(actionMessage.text, setShowActionModal),
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

		if (isMyMessage && actionMessage.text !== "Tin nhắn đã được thu hồi") {
			items.push(
				{
					icon: "pencil-outline",
					label: "Chỉnh sửa",
					onPress: () =>
						handleEditMessage(
							actionMessage.id,
							actionMessage.text,
							setEditingMessageId,
							setEditText,
							setInputText,
							setShowActionModal,
						),
				},
				{
					icon: "trash-outline",
					label: "Thu hồi",
					onPress: () =>
						handleRecallMessage(actionMessage.id, isMyMessage, setMessages, setShowActionModal),
				},
			);
		}

		return items;
	};

	return (
		<View style={[styles.container, isDark && styles.darkContainer]}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons
						name="arrow-back"
						size={24}
						color="white"
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>{room.name}</Text>
				{/* <View style={styles.headerIcons}>
					<TouchableOpacity style={styles.headerIcon}>
						<Ionicons
							name="call-outline"
							size={22}
							color="white"
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerIcon}>
						<Ionicons
							name="videocam-outline"
							size={22}
							color="white"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerIcon}
						onPress={() => toggleSearchBar(showSearchBar, setShowSearchBar, setSearchQuery)}
					>
						<Ionicons
							name="search-outline"
							size={22}
							color="white"
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerIcon}>
						<Feather
							name="info"
							size={22}
							color="white"
						/>
					</TouchableOpacity>
				</View> */}
			</View>

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
				data={searchQuery ? filteredMessages : messages}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<RenderMessageItem
						item={item}
						setActionMessage={setActionMessage}
						setShowActionModal={setShowActionModal}
						messages={messages}
						setMessages={setMessages}
						setSelectedMessageId={setSelectedMessageId}
						setShowReactionPicker={setShowReactionPicker}
						setShowForwardModal={setShowForwardModal}
						setEditingMessageId={setEditingMessageId}
						setEditText={setEditText}
						setInputText={setInputText}
						setShowImageModal={setShowImageModal}
						setAllImageUris={setAllImageUris}
						setInitialImageIndex={setInitialImageIndex}
						setCurrentImageIndex={setCurrentImageIndex}
						showUserInfo={(user) => showUserInfo(user, setSelectedUser, setShowUserInfoModal)}
						setShowUserInfoModal={setShowUserInfoModal}
						setSelectedUser={setSelectedUser}
						sound={sound}
						setSound={setSound}
						playingAudioId={playingAudioId}
						setPlayingAudioId={setPlayingAudioId}
						isDark={isDark}
					/>
				)}
				contentContainerStyle={styles.flatListContent}
			/>

			{isTyping && !showSearchBar && (
				<Text style={[styles.typingIndicator, isDark && styles.darkTypingIndicator]}>Đang gõ...</Text>
			)}

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
						{REACTIONS.map((emoji) => (
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
						))}
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
						onPress={() =>
							closeImageModal(
								setShowImageModal,
								setAllImageUris,
								setInitialImageIndex,
								setCurrentImageIndex,
							)
						}
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
							onPress={() =>
								closeImageModal(
									setShowImageModal,
									setAllImageUris,
									setInitialImageIndex,
									setCurrentImageIndex,
								)
							}
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
						<FlatList
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
						/>
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

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={80}
			>
				<View style={styles.inputContainer}>
					{editingMessageId && (
						<TouchableOpacity
							onPress={() => cancelEdit(setEditingMessageId, setEditText, setInputText)}
							style={styles.inputIcon}
						>
							<Ionicons
								name="close-circle-outline"
								size={26}
								color="#ef4444"
							/>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						onPress={pickImages}
						style={styles.inputIcon}
					>
						<Ionicons
							name="image-outline"
							size={26}
							color="#3b82f6"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={pickDocument}
						style={styles.inputIcon}
					>
						<Ionicons
							name="document-attach-outline"
							size={26}
							color="#3b82f6"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={
							isRecording
								? () => stopRecording(recording, setRecording, setIsRecording)
								: () => startRecording(setRecording, setIsRecording)
						}
						style={styles.inputIcon}
					>
						<Ionicons
							name={isRecording ? "stop-circle-outline" : "mic-outline"}
							size={26}
							color={isRecording ? "#ef4444" : "#3b82f6"}
						/>
					</TouchableOpacity>
					<TextInput
						style={[styles.textInput, isDark && styles.darkTextInput]}
						placeholder={editingMessageId ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."}
						placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
						value={inputText}
						onChangeText={(text) => {
							setInputText(text);
							setIsTyping(text.length > 0);
						}}
						onSubmitEditing={() =>
							sendMessage(
								inputText,
								[],
								[],
								setMessages,
								editingMessageId,
								setEditingMessageId,
								setEditText,
								setInputText,
								setIsTyping,
								setSelectedImages,
								setSelectedFiles,
							)
						}
						returnKeyType="send"
					/>
					<TouchableOpacity
						onPress={() =>
							sendMessage(
								inputText,
								[],
								[],
								setMessages,
								editingMessageId,
								setEditingMessageId,
								setEditText,
								setInputText,
								setIsTyping,
								setSelectedImages,
								setSelectedFiles,
							)
						}
						style={styles.sendButton}
					>
						<Ionicons
							name={editingMessageId ? "save" : "send"}
							size={20}
							color="white"
						/>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

export default ChatDetail;
