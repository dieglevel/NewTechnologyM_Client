import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { useAppSelector } from "@/libs/redux/redux.config";
import { socketService } from "@/libs/socket/socket";
import { getMessageByRoomId, getPinnedMessages } from "@/services/message";
import { IMessage } from "@/types/implement";
import RenderMessageItem from "./body/message-item";
import Footer from "./footer/chat-footer";
import Header from "./header/chat-header";
import { ActionModalMessage } from "./modal/action-modal";
import styles from "./styles";

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

  const [pinnedMessage, setPinnedMessage] = useState<IMessage | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedRoom?.id) {
          throw new Error("Không tìm thấy ID phòng chat");
        }

        const [messageResponse, pinnedResponse] = await Promise.all([
          getMessageByRoomId(selectedRoom.id),
          getPinnedMessages(selectedRoom.id),
        ]);

        if (messageResponse.statusCode === 200 && messageResponse.data) {
          setMessages(messageResponse.data);
        }

        if (pinnedResponse.statusCode === 200 && pinnedResponse.data) {
          setPinnedMessage(pinnedResponse.data[0] || null);
        }
      } catch (error) {
        const e = error as ErrorResponse;
        console.error("Lỗi khi tải tin nhắn hoặc tin nhắn đã ghim:", e);
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
  }, [isFocused, selectedRoom?.id]);

  useEffect(() => {
    socketService.emit(SocketEmit.joinRoom, {
      room_id: selectedRoom?.id || "",
    });
    socketService.on(SocketOn.joinRoom, (data: any) => {});

    socketService.on(SocketOn.pinMessage, (data: { message: IMessage; chatRoomId: string }) => {
      if (data.chatRoomId === selectedRoom?.id) {
        setPinnedMessage(data.message);
      }
    });

    socketService.on(SocketOn.unpinMessage, (data: { chatRoomId: string }) => {
      if (data.chatRoomId === selectedRoom?.id) {
        setPinnedMessage(null);
      }
    });

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
          setMessages((prev) => prev.filter((msg) => msg._id !== message._id));
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
      socketService.off(SocketOn.pinMessage);
      socketService.off(SocketOn.unpinMessage);
    };
  }, [isFocused, selectedRoom?.id]);

  const filteredMessages = messages?.filter((msg) => {
    if (!msg.isRevoked) {
      return msg.content?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
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

          {pinnedMessage && (
            <View style={styles.pinnedContainer}>
              <Text style={styles.pinnedLabel}>📌 Tin nhắn đã ghim:</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (!flatListRef.current || !pinnedMessage) return;
                  const currentDisplayedMessages = searchQuery ? filteredMessages : messages;
                  const index = currentDisplayedMessages.findIndex((msg) => msg._id === pinnedMessage._id);

                  if (index !== -1) {
                    const invertedIndex = currentDisplayedMessages.length - 1 - index;
                    flatListRef.current.scrollToIndex({ index: invertedIndex, animated: true });
                  } else {
                    console.warn("Tin nhắn ghim không tìm thấy trong danh sách hiển thị");
                  }
                }}
              >
                <RenderMessageItem
                  item={pinnedMessage}
                  myUserId={myUserId}
                  detailInformation={detailInformation}
                  setActionMessage={setActionMessage}
                  setShowActionModal={setShowActionModal}
                  isDark={isDark}
                />
              </TouchableOpacity>
            </View>
          )}

          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size={"large"} color={colors.brand} />
            </View>
          ) : (
            <>
              {messages.length <= 0 ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>Chưa có tin nhắn nào</Text>
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={searchQuery ? filteredMessages : messages.toReversed()}
                  keyExtractor={(item: IMessage) => item._id.toString()}
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
                  onScrollToIndexFailed={() => {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                  }}
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
            pinnedMessage={pinnedMessage}
            setPinnedMessage={setPinnedMessage}
            chatRoomId={selectedRoom?.id || ""}
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