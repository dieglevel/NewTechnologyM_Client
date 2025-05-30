import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { colors } from "@/constants";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { useAppSelector } from "@/libs/redux/redux.config";
import { socketService } from "@/libs/socket/socket";
import { getMessageByRoomId } from "@/services/message";
import { IMessage } from "@/types/implement";
import RenderMessageItem from "./body/message-item";
import Footer from "./footer/chat-footer";
import Header from "./header/chat-header";
import { ActionModalMessage } from "./modal/action-modal";
import styles from "./styles";
import { initialDataPage } from "@/apps/navigations/handle-initital-page";
import { AppState, AppStateStatus } from "react-native";
const ChatDetail = () => {
	const isDark = false;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [myUserId, setMyUserId] = useState<string | null>(null);
	const { detailInformation } = useAppSelector((state) => state.detailInformation);
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const [messages, setMessages] = useState<IMessage[]>([]);
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [showActionModal, setShowActionModal] = useState(false);
	const [actionMessage, setActionMessage] = useState<IMessage | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [showSearchBar, setShowSearchBar] = useState(false);

	const flatListRef = useRef<FlatList>(null);
	const isFocused = useIsFocused();

	const fetch = async () => {
			await initialDataPage();
			await socketService.disconnect();
			await socketService.connect();
		};
	const appState = useRef<AppStateStatus>(AppState.currentState);
		useEffect(() => {
			const subscription = AppState.addEventListener("change", async (nextAppState) => {
				if (appState.current.match(/inactive|background/) && nextAppState === "active") {
					console.log("🔄 App quay trở lại → làm mới app ở đây");
	
					fetch();
					// ⚠️ Đừng dùng Updates.reloadAsync() trừ khi bắt buộc
					// await Updates.reloadAsync();
	
					// Gợi ý: Dispatch Redux action để refetch, hoặc reset screen
					// store.dispatch(fetchDataAgain());
	
					// Hoặc reload theo nhu cầu
				}
				appState.current = nextAppState;
			});
	
			return () => {
				subscription.remove();
			};
		}, []);
	

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
		fetchMessages();
		getUserId();
	}, [isFocused]);

	useEffect(() => {
		socketService.emit(SocketEmit.joinRoom, {
			room_id: selectedRoom?.id || "",
		});
		socketService.on(SocketOn.joinRoom, (data: any) => {});

		socketService.on(SocketOn.sendMessage, (data: { behavior: string; message: IMessage }) => {
			const { message, behavior } = data;

			if (message.roomId !== selectedRoom?.id) {
				return;
			}

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
							updatedMessages[index] = message;
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

	return (
		<View style={[styles.container]}>
			{selectedRoom?.isDisbanded ? (
				<>
					<Header
						myUserId={myUserId}
						showSearchBar={showSearchBar}
						searchQuery={searchQuery}
						setShowSearchBar={setShowSearchBar}
						setSearchQuery={setSearchQuery}
					/>
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<Text style={{ color: "gray", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
							Nhóm chat đã bị giải tán.
						</Text>
					</View>
				</>
			) : (
				<>
					<Header
						myUserId={myUserId}
						showSearchBar={showSearchBar}
						searchQuery={searchQuery}
						setShowSearchBar={setShowSearchBar}
						setSearchQuery={setSearchQuery}
					/>
					{/* Message */}
					{isLoading ? (
						<View style={{ flex: 1, justifyContent: "center" }}>
							<ActivityIndicator
								size={"large"}
								color={colors.brand}
							/>
						</View>
					) : (
						<>
							{messages.length <= 0 ? (
								<View style={{ flex: 1, justifyContent: "center" }}>
									<Text style={{ textAlign: "center", fontWeight: "bold" }}>
										Chưa có tin nhắn nào
									</Text>
								</View>
							) : (
								<FlatList
									ref={flatListRef}
									data={searchQuery ? filteredMessages : messages.toReversed()}
									keyExtractor={(item: IMessage, index) => item._id.toString()}
									initialNumToRender={20}
									maxToRenderPerBatch={20}
									windowSize={5}
									removeClippedSubviews
									inverted
									renderItem={({ item }) => (
										<RenderMessageItem
											key={item._id}
											item={item}
											myUserId={myUserId}
											detailInformation={detailInformation}
											setActionMessage={setActionMessage}
											setShowActionModal={setShowActionModal}
											isDark={isDark}
										/>
									)}
									contentContainerStyle={styles.flatListContent}
								/>
							)}
						</>
					)}

					<ActionModalMessage
						data={messages}
						setData={setMessages}
						actionMessage={actionMessage}
						setActionMessage={setActionMessage}
						showActionModal={showActionModal}
						setShowActionModalAction={setShowActionModal}
					/>

					<Footer
						isDark={isDark}
						editingMessageId={editingMessageId}
						setEditingMessageId={setEditingMessageId}
						setMessages={setMessages}
					/>
				</>
			)}
		</View>
	);
};

export default ChatDetail;

// <Modal
// visible={showReactionPicker}
// transparent
// animationType="fade"
// >
// <TouchableOpacity
// 	style={styles.reactionModalContainer}
// 	onPress={() => setShowReactionPicker(false)}
// >
// 	<View style={styles.reactionModalContent}>{/* Reaction picker content */}</View>
// </TouchableOpacity>
// </Modal>
