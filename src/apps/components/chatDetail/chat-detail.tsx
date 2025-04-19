import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  useColorScheme,
  Alert,
  Dimensions,
  Modal,
  Clipboard,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

const REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "😡"];

const ChatDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name }: any = route.params || { name: "Người dùng" };
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [messages, setMessages] = useState<
    {
      id: string;
      text: string;
      sender: string;
      time: string;
      read?: boolean;
      avatar: string;
      senderName: string;
      reaction: string | null;
      images?: string[] | null;
      files?: string[] | null;
      isEdited?: boolean;
    }[]
  >([
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

  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const imageFlatListRef = useRef<FlatList>(null);

  const sendMessage = (text?: string, images?: string[], files?: string[]) => {
    if ((text?.trim() ?? "") === "" && (!images || images.length === 0) && (!files || files.length === 0)) return;

    if (editingMessageId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessageId
            ? { ...msg, text: text || "", isEdited: true }
            : msg
        )
      );
      setEditingMessageId(null);
      setEditText("");
    } else {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: text || "",
          sender: "me",
          time: currentTime,
          read: true,
          avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
          senderName: "Tôi",
          images: images || null,
          files: files || null,
          reaction: null,
        },
      ]);
    }

    setInputText("");
    setShowEmoji(false);
    setIsTyping(false);
    setSelectedImages([]);
    setSelectedFiles([]);
  };

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
      sendMessage("", imageUris);
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

      if (result.type === "success") {
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
      console.error(error);
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

        const response = await axios.post(
          "https://your-api-domain.com/api/file-cloud/upload-single-file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // Authorization: `Bearer ${yourToken}`,
            },
          }
        );

        if (response.data && response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        sendMessage("", [], uploadedUrls);
      } else {
        Alert.alert("Lỗi", "Không thể tải file lên server.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải file. Vui lòng thử lại.");
      console.error(error);
    }
  };

  const copyMessage = (text: string) => {
    if (text === "Tin nhắn đã được thu hồi") {
      Alert.alert("Không thể sao chép");
      return;
    }
    Clipboard.setString(text);
    setShowActionModal(false);
  };

  const handleReactionSelect = (emoji: string) => {
    if (!selectedMessageId) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessageId ? { ...msg, reaction: emoji } : msg
      )
    );
    setShowReactionPicker(false);
    setSelectedMessageId(null);
    setShowActionModal(false);
  };

  const handleRecallMessage = (id: string, isMyMessage: boolean) => {
    if (!isMyMessage) {
      Alert.alert("Lỗi", "Chỉ có thể thu hồi tin nhắn của bạn!");
      return;
    }

    Alert.alert("Thu hồi tin nhắn", "Bạn có chắc muốn thu hồi tin nhắn này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Thu hồi",
        style: "destructive",
        onPress: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === id
                ? { ...msg, text: "Tin nhắn đã được thu hồi", images: null, files: null, reaction: null }
                : msg
            )
          );
          setShowActionModal(false);
        },
      },
    ]);
  };

  const handleEditMessage = (id: string, text: string) => {
    setEditingMessageId(id);
    setEditText(text);
    setInputText(text);
    setShowActionModal(false);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
    setInputText("");
  };

  const openImageModal = (messageImages: string[], selectedIndex: number) => {
    const allImages: string[] = [];
    messages.forEach((msg) => {
      if (msg.images && msg.images.length > 0) {
        allImages.push(...msg.images);
      }
    });

    let globalIndex = 0;
    let found = false;
    for (const msg of messages) {
      if (msg.images && msg.images.length > 0) {
        for (let i = 0; i < msg.images.length; i++) {
          if (msg.images[i] === messageImages[selectedIndex]) {
            globalIndex += i;
            found = true;
            break;
          }
          globalIndex++;
        }
        if (found) break;
      }
    }

    setAllImageUris(allImages);
    setInitialImageIndex(globalIndex);
    setCurrentImageIndex(globalIndex);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setAllImageUris([]);
    setInitialImageIndex(0);
    setCurrentImageIndex(0);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    setSearchQuery("");
  };

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderImageItem = ({ item }: { item: string }) => (
    <View style={styles.fullScreenImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.fullScreenImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMyMessage = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          {
            justifyContent: isMyMessage ? "flex-end" : "flex-start",
          },
        ]}
      >
        {!isMyMessage && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
        <TouchableOpacity
          onLongPress={() => {
            setActionMessage(item);
            setShowActionModal(true);
          }}
          onPress={() => handleRecallMessage(item.id, isMyMessage)}
          activeOpacity={0.8}
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.otherMessage,
            isDark && {
              backgroundColor: isMyMessage ? "#2563eb" : "#374151",
            },
          ]}
        >
          {!isMyMessage && <Text style={styles.senderName}>{item.senderName}</Text>}
          {item.images && item.images.length > 0 && (
            <View style={styles.imageContainer}>
              {item.images.length === 1 ? (
                <TouchableOpacity onPress={() => openImageModal(item.images, 0)}>
                  <Image source={{ uri: item.images[0] }} style={styles.singleImage} />
                </TouchableOpacity>
              ) : (
                <View style={styles.imageGrid}>
                  {item.images.map((imageUri: string, index: number) => (
                    <TouchableOpacity key={index} onPress={() => openImageModal(item.images, index)}>
                      <Image source={{ uri: imageUri }} style={styles.gridImage} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          {item.files && item.files.length > 0 && (
            <View style={styles.fileContainer}>
              {item.files.map((fileUrl: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    Alert.alert("Mở file", `Mở file tại: ${fileUrl}`);
                  }}
                  style={styles.fileItem}
                >
                  <Ionicons name="document-outline" size={20} color="#3b82f6" style={{ marginRight: 8 }} />
                  <Text style={styles.fileText}>{fileUrl.split("/").pop()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {item.text !== "" && (
            <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
              {item.text}
              {item.isEdited && (
                <Text style={styles.editedLabel}> (đã chỉnh sửa)</Text>
              )}
            </Text>
          )}
          {item.reaction && (
            <Text style={{ fontSize: 18, marginTop: 4, textAlign: "right" }}>{item.reaction}</Text>
          )}
          <View style={styles.metaInfo}>
            <Text style={styles.timestamp}>{item.time}</Text>
            {item.read && isMyMessage && (
              <MaterialIcons name="check-circle" size={14} color="#3b82f6" style={{ marginLeft: 4 }} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActionItem = ({ item }: { item: { icon: string; label: string; onPress: () => void; destructive?: boolean } }) => (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={item.onPress}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={item.destructive ? "#ef4444" : isDark ? "#d1d5db" : "#374151"}
        style={{ marginRight: 10 }}
      />
      <Text
        style={[
          styles.actionText,
          item.destructive && { color: "#ef4444" },
          isDark && !item.destructive && { color: "#d1d5db" },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

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
        onPress: () => copyMessage(actionMessage.text),
      },
    ];

    if (isMyMessage && actionMessage.text !== "Tin nhắn đã được thu hồi") {
      items.push(
        {
          icon: "pencil-outline",
          label: "Chỉnh sửa",
          onPress: () => handleEditMessage(actionMessage.id, actionMessage.text),
        },
        {
          icon: "trash-outline",
          label: "Thu hồi",
          onPress: () => handleRecallMessage(actionMessage.id, isMyMessage),
          destructive: true,
        }
      );
    }

    return items;
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#111827" }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{name}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginHorizontal: 6 }}>
            <Ionicons name="call-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 6 }}>
            <Ionicons name="videocam-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 6 }} onPress={toggleSearchBar}>
            <Ionicons name="search-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 6 }}>
            <Feather name="info" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {showSearchBar && (
        <View style={[styles.searchContainer, isDark && { backgroundColor: "#1f2937" }]}>
          <TextInput
            style={[styles.searchInput, isDark && { color: "white", backgroundColor: "#374151" }]}
            placeholder="Tìm kiếm tin nhắn..."
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <TouchableOpacity onPress={toggleSearchBar} style={styles.cancelSearchButton}>
            <Text style={styles.cancelSearchText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={searchQuery ? filteredMessages : messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {isTyping && !showSearchBar && (
        <Text style={{ marginLeft: 16, marginBottom: 4, color: isDark ? "#d1d5db" : "#4b5563", fontStyle: "italic" }}>
          Đang gõ...
        </Text>
      )}

      {showEmoji && (
        <View style={{ height: 300 }}>
          <EmojiSelector
            onEmojiSelected={(emoji) => setInputText((prev) => prev + emoji)}
            showSearchBar={false}
            showTabs={true}
            showHistory={true}
            showSectionTitles={false}
            theme={isDark ? "dark" : "light"}
          />
        </View>
      )}

      <Modal visible={showReactionPicker} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000066" }}
          onPress={() => setShowReactionPicker(false)}
        >
          <View style={{ backgroundColor: "white", padding: 12, borderRadius: 12, flexDirection: "row" }}>
            {REACTIONS.map((emoji) => (
              <TouchableOpacity key={emoji} onPress={() => handleReactionSelect(emoji)} style={{ marginHorizontal: 6 }}>
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity style={styles.imageModalOverlay} onPress={closeImageModal} />
          <View style={styles.imageModalContent}>
            <FlatList
              ref={imageFlatListRef}
              data={allImageUris}
              renderItem={renderImageItem}
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
            <TouchableOpacity style={styles.closeImageButton} onPress={closeImageModal}>
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
          <View style={[styles.actionModalContent, isDark && { backgroundColor: "#1f2937" }]}>
            <FlatList
              data={getActionItems()}
              renderItem={renderActionItem}
              keyExtractor={(item) => item.label}
              contentContainerStyle={{ padding: 10 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
        <View style={styles.inputContainer}>
          {editingMessageId && (
            <TouchableOpacity onPress={cancelEdit} style={{ marginHorizontal: 6 }}>
              <Ionicons name="close-circle-outline" size={26} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
            <Ionicons name="happy-outline" size={26} color="#3b82f6" style={{ marginHorizontal: 6 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImages}>
            <Ionicons name="image-outline" size={26} color="#3b82f6" style={{ marginHorizontal: 6 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickDocument}>
            <Ionicons name="document-attach-outline" size={26} color="#3b82f6" style={{ marginHorizontal: 6 }} />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.textInput,
              isDark && { backgroundColor: "#1f2937", color: "white" },
            ]}
            placeholder={editingMessageId ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."}
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              setIsTyping(text.length > 0);
            }}
            onSubmitEditing={() => sendMessage(inputText)}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={() => sendMessage(inputText)} style={styles.sendButton}>
            <Ionicons name={editingMessageId ? "save" : "send"} size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 12,
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 12,
    flex: 1,
  },
  headerIcons: { flexDirection: "row" },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: "#E1F5FE",
    borderTopRightRadius: 0,
    alignSelf: "flex-end",
    marginLeft: 50,
  },
  otherMessage: {
    backgroundColor: "#e5e7eb",
    borderTopLeftRadius: 0,
    alignSelf: "flex-start",
    marginRight: 50,
  },
  myMessageText: { color: "black", fontSize: 16 },
  otherMessageText: { color: "#111827", fontSize: 16 },
  senderName: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4,
    color: "#374151",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#6b7280",
  },
  imageContainer: { marginBottom: 6 },
  singleImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: Dimensions.get("window").width * 0.65,
  },
  gridImage: {
    width: Dimensions.get("window").width * 0.65 / 3 - 8,
    height: Dimensions.get("window").width * 0.65 / 3 - 8,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  fileContainer: {
    marginBottom: 6,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 4,
  },
  fileText: {
    fontSize: 14,
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 8,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 25,
  },
  editedLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "#000000cc",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageModalContent: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImageContainer: {
    width: Dimensions.get("window").width,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  closeImageButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#00000066",
    borderRadius: 20,
    padding: 8,
  },
  imageCounter: {
    position: "absolute",
    bottom: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#00000066",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  actionModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
  },
  actionModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: 250,
    maxHeight: 300,
    padding: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 16,
    color: "#374151",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
    fontSize: 16,
    marginRight: 10,
  },
  cancelSearchButton: {
    paddingHorizontal: 10,
  },
  cancelSearchText: {
    fontSize: 16,
    color: "#3b82f6",
  },
});

export default ChatDetail;