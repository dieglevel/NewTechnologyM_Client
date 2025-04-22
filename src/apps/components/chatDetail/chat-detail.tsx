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
  Image,
  Alert,
  Dimensions,
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
  sendMessage,
  toggleSearchBar,
  handleReactionSelect,
  handleRecallMessage,
  handleEditMessage,
  cancelEdit,
  forwardMessage,
  openImageModal,
  closeImageModal,
  copyMessage,
  Message,
} from "./message-utils";
import { showUserInfo, closeUserInfoModal } from "./user-utils";
import styles from "./styles";

const REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "😡"];
const mockChats = [
  { id: "chat1", name: "Nhóm bạn", avatar: "https://example.com/avatar1.png" },
  { id: "chat2", name: "Gia đình", avatar: "https://example.com/avatar2.png" },
  { id: "chat3", name: "Công việc", avatar: "https://example.com/avatar3.png" },
];

const ChatDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name, chatId }: any = route.params || { name: "Người dùng", chatId: "default_chat_id" };
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào!",
      sender: "me",
      time: "10:00",
      read: true,
      avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
      senderName: "Tôi",
      reaction: null,
    },
    {
      id: "2",
      text: "Chào bạn!",
      sender: "other",
      time: "10:01",
      avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
      senderName: "Minh",
      reaction: null,
    },
  ]);
  // Ghi chú: Bạn có thể thay thế dữ liệu mock trên bằng API để lấy danh sách tin nhắn từ server
  // Ví dụ:
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(`https://your-api-domain.com/api/chats/${chatId}/messages`);
  //       setMessages(response.data);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };
  //   fetchMessages();
  // }, [chatId]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
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
  const [actionMessage, setActionMessage] = useState<Message | null>(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; avatar: string; status?: string; phone?: string } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const imageFlatListRef = useRef<FlatList>(null);

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền truy cập bị từ chối", "Vui lòng cấp quyền truy cập vào thư viện ảnh.");
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
      sendMessage("", imageUris, [], null, setMessages, editingMessageId, setEditingMessageId, setEditText, setInputText, setIsTyping, setSelectedImages, setSelectedFiles);
      // Ghi chú: Sau khi gửi hình ảnh cục bộ, bạn có thể tích hợp API để gửi tin nhắn chứa hình ảnh lên server
      // Ví dụ:
      // const payload = {
      //   chatId: chatId,
      //   senderId: "me",
      //   images: imageUris,
      //   timestamp: new Date().toISOString(),
      // };
      // await axios.post("https://your-api-domain.com/api/messages", payload);
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
      Alert.alert("Lỗi", "Không thể chọn file. Vui lòng thử lại.");
      console.error("Error in pickDocument:", error);
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

        console.log("Uploading file:", file);

        // Ghi chú: Thay thế URL này bằng API thực tế của bạn để tải file lên server
        const response = await axios.post(
          "https://your-api-domain.com/api/file-cloud/upload-single-file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", response.data);

        if (response.data && response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        console.log("Uploaded URLs:", uploadedUrls);
        sendMessage("", [], uploadedUrls, null, setMessages, editingMessageId, setEditingMessageId, setEditText, setInputText, setIsTyping, setSelectedImages, setSelectedFiles);
        // Ghi chú: Sau khi gửi file cục bộ, bạn có thể tích hợp API để gửi tin nhắn chứa file lên server
        // Ví dụ:
        // const payload = {
        //   chatId: chatId,
        //   senderId: "me",
        //   files: uploadedUrls,
        //   timestamp: new Date().toISOString(),
        // };
        // await axios.post("https://your-api-domain.com/api/messages", payload);
      } else {
        Alert.alert("Lỗi", "Không thể tải file lên server.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải file. Vui lòng thử lại.");
      console.error("Error in uploadFiles:", error);
    }
  };

  // const handleStopRecording = async () => {
  //   const uri = await stopRecording(recording, setRecording, setIsRecording);
  //   if (uri) {
  //     const audioFile = {
  //       uri: uri,
  //       name: `recording_${Date.now()}.m4a`,
  //       type: "audio/m4a",
  //     };
  //     uploadAudio(audioFile);
  //   }
  // };

  const uploadAudio = async (audioFile: { uri: string; name: string; type: string }) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: audioFile.uri,
        name: audioFile.name,
        type: audioFile.type,
      } as any);

      console.log("Uploading audio:", audioFile);

      // Ghi chú: Thay thế URL này bằng API thực tế của bạn để tải file âm thanh lên server
      const response = await axios.post(
        "https://your-api-domain.com/api/file-cloud/upload-single-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload audio response:", response.data);

      if (response.data && response.data.url) {
        const audioUrl = response.data.url;
        sendMessage("", [], [], audioUrl, setMessages, editingMessageId, setEditingMessageId, setEditText, setInputText, setIsTyping, setSelectedImages, setSelectedFiles);
        // Ghi chú: Sau khi gửi âm thanh cục bộ, bạn có thể tích hợp API để gửi tin nhắn chứa âm thanh lên server
        // Ví dụ:
        // const payload = {
        //   chatId: chatId,
        //   senderId: "me",
        //   audio: audioUrl,
        //   timestamp: new Date().toISOString(),
        // };
        // await axios.post("https://your-api-domain.com/api/messages", payload);
      } else {
        Alert.alert("Lỗi", "Không thể tải file âm thanh lên server.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải file âm thanh. Vui lòng thử lại.");
      console.error("Error in uploadAudio:", error);
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
          // Ghi chú: Bạn có thể tích hợp API để gửi phản ứng lên server
          // Ví dụ (trong handleReactionSelect trong message-utils.tsx):
          // await axios.post("https://your-api-domain.com/api/messages/reaction", {
          //   messageId: selectedMessageId,
          //   reaction: emoji,
          // });
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
          onPress: () => handleEditMessage(actionMessage.id, actionMessage.text, setEditingMessageId, setEditText, setInputText, setShowActionModal),
          // Ghi chú: Bạn có thể tích hợp API để gửi tin nhắn đã chỉnh sửa lên server
          // Ví dụ (trong sendMessage trong message-utils.tsx khi editingMessageId tồn tại):
          // await axios.put(`https://your-api-domain.com/api/messages/${editingMessageId}`, {
          //   text: text,
          // });
        },
        {
          icon: "trash-outline",
          label: "Thu hồi",
          onPress: () => handleRecallMessage(actionMessage.id, isMyMessage, setMessages, setShowActionModal),
          // Ghi chú: Bạn có thể tích hợp API để gửi yêu cầu thu hồi tin nhắn lên server
          // Ví dụ (trong handleRecallMessage trong message-utils.tsx):
          // await axios.delete(`https://your-api-domain.com/api/messages/${id}`);
        },
      );
    }

    return items;
  };

  // Tối ưu hóa FlatList: Cuộn đến tin nhắn mới nhất khi có tin nhắn mới
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{name}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="call-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="videocam-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => toggleSearchBar(showSearchBar, setShowSearchBar, setSearchQuery)}>
            <Ionicons name="search-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="info" size={22} color="white" />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity onPress={() => toggleSearchBar(showSearchBar, setShowSearchBar, setSearchQuery)} style={styles.cancelSearchButton}>
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
        initialNumToRender={10} // Tối ưu hóa hiệu suất
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {isTyping && !showSearchBar && (
        <Text style={[styles.typingIndicator, isDark && styles.darkTypingIndicator]}>
          Đang gõ...
        </Text>
      )}

      <Modal visible={showReactionPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.reactionModalContainer}
          onPress={() => setShowReactionPicker(false)}
        >
          <View style={styles.reactionModalContent}>
            {REACTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReactionSelect(emoji, selectedMessageId, setMessages, setShowReactionPicker, setSelectedMessageId, setShowActionModal)}
                style={styles.reactionButton}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity style={styles.imageModalOverlay} onPress={() => closeImageModal(setShowImageModal, setAllImageUris, setInitialImageIndex, setCurrentImageIndex)} />
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
                const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get("window").width);
                setCurrentImageIndex(index);
              }}
            />
            {allImageUris.length > 0 && (
              <Text style={styles.imageCounter}>
                {currentImageIndex + 1}/{allImageUris.length}
              </Text>
            )}
            <TouchableOpacity style={styles.closeImageButton} onPress={() => closeImageModal(setShowImageModal, setAllImageUris, setInitialImageIndex, setCurrentImageIndex)}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showActionModal} transparent animationType="fade">
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

      <Modal visible={showForwardModal} transparent animationType="fade">
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
                  forwardMessage={() => {
                    if (actionMessage) {
                      forwardMessage(item.id, actionMessage, setShowForwardModal, setShowActionModal);
                    }
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatListContent}
            />
            {/* Ghi chú: Thay thế mockChats bằng API để lấy danh sách cuộc trò chuyện thực tế */}
            {/* Ví dụ: */}
            {/* useEffect(() => {
              const fetchChats = async () => {
                try {
                  const response = await axios.get("https://your-api-domain.com/api/chats");
                  setChats(response.data);
                } catch (error) {
                  console.error("Error fetching chats:", error);
                }
              };
              fetchChats();
            }, []); */}
            <TouchableOpacity
              style={styles.cancelForwardButton}
              onPress={() => setShowForwardModal(false)}
            >
              <Text style={styles.cancelForwardText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showUserInfoModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.userInfoModalContainer}
          onPress={() => closeUserInfoModal(setShowUserInfoModal, setSelectedUser)}
        >
          <View style={[styles.userInfoModalContent, isDark && styles.darkUserInfoModalContent]}>
            {selectedUser && (
              <>
                <Image source={{ uri: selectedUser.avatar }} style={styles.userInfoAvatar} />
                <Text style={[styles.userInfoName, isDark && styles.darkUserInfoName]}>
                  {selectedUser.name}
                </Text>
                <View style={styles.userInfoDetail}>
                  <Ionicons name="ellipse" size={16} color={selectedUser.status === "Đang hoạt động" ? "#22c55e" : "#6b7280"} style={styles.userInfoIcon} />
                  <Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
                    {selectedUser.status}
                  </Text>
                </View>
                <View style={styles.userInfoDetail}>
                  <Ionicons name="call-outline" size={16} color="#3b82f6" style={styles.userInfoIcon} />
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

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
        <View style={styles.inputContainer}>
          {editingMessageId && (
            <TouchableOpacity onPress={() => cancelEdit(setEditingMessageId, setEditText, setInputText)} style={styles.inputIcon}>
              <Ionicons name="close-circle-outline" size={26} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={pickImages} style={styles.inputIcon}>
            <Ionicons name="image-outline" size={26} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickDocument} style={styles.inputIcon}>
            <Ionicons name="document-attach-outline" size={26} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isRecording) {
                // handleStopRecording();
              } else {
                startRecording(setRecording, setIsRecording);
              }
            }}
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
            onSubmitEditing={() => {
              sendMessage(inputText, [], [], null, setMessages, editingMessageId, setEditingMessageId, setEditText, setInputText, setIsTyping, setSelectedImages, setSelectedFiles);
              // Ghi chú: Sau khi gửi tin nhắn cục bộ, bạn có thể tích hợp API để gửi tin nhắn lên server
              // Ví dụ:
              // const payload = {
              //   chatId: chatId,
              //   senderId: "me",
              //   content: inputText,
              //   timestamp: new Date().toISOString(),
              // };
              // await axios.post("https://your-api-domain.com/api/messages", payload);
            }}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={() => {
            sendMessage(inputText, [], [], null, setMessages, editingMessageId, setEditingMessageId, setEditText, setInputText, setIsTyping, setSelectedImages, setSelectedFiles);
            // Ghi chú: Sau khi gửi tin nhắn cục bộ, bạn có thể tích hợp API để gửi tin nhắn lên server (tương tự như trên)
          }} style={styles.sendButton}>
            <Ionicons name={editingMessageId ? "save" : "send"} size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatDetail;