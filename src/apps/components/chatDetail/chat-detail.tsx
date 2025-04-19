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
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";

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
      isEdited?: boolean; // Thêm thuộc tính để theo dõi tin nhắn đã chỉnh sửa
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
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // Theo dõi tin nhắn đang chỉnh sửa
  const [editText, setEditText] = useState(""); // Nội dung tin nhắn đang chỉnh sửa
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text?: string, images?: string[]) => {
    if ((text?.trim() ?? "") === "" && (!images || images.length === 0)) return;

    if (editingMessageId) {
      // Lưu chỉnh sửa tin nhắn
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
      // Gửi tin nhắn mới
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
          reaction: null,
        },
      ]);
    }

    setInputText("");
    setShowEmoji(false);
    setIsTyping(false);
    setSelectedImages([]);
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

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleReactionSelect = (emoji: string) => {
    if (!selectedMessageId) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessageId ? { ...msg, reaction: emoji } : msg
      )
    );
    setShowReactionPicker(false);
    setSelectedMessageId(null);
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
              msg.id === id ? { ...msg, text: "Tin nhắn đã được thu hồi", images: null, reaction: null } : msg
            )
          );
        },
      },
    ]);
  };

  const handleEditMessage = (id: string, text: string) => {
    setEditingMessageId(id);
    setEditText(text);
    setInputText(text);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
    setInputText("");
  };

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
            if (isMyMessage && item.text !== "Tin nhắn đã được thu hồi") {
              Alert.alert("Tùy chọn", "Chọn hành động", [
                {
                  text: "Thêm Reaction",
                  onPress: () => {
                    setSelectedMessageId(item.id);
                    setShowReactionPicker(true);
                  },
                },
                {
                  text: "Chỉnh sửa",
                  onPress: () => handleEditMessage(item.id, item.text),
                },
                {
                  text: "Thu hồi",
                  onPress: () => handleRecallMessage(item.id, isMyMessage),
                },
                { text: "Hủy", style: "cancel" },
              ]);
            } else {
              setSelectedMessageId(item.id);
              setShowReactionPicker(true);
            }
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
                <Image source={{ uri: item.images[0] }} style={styles.singleImage} />
              ) : (
                <View style={styles.imageGrid}>
                  {item.images.map((imageUri: string, index: number) => (
                    <Image key={index} source={{ uri: imageUri }} style={styles.gridImage} />
                  ))}
                </View>
              )}
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
          <TouchableOpacity style={{ marginHorizontal: 6 }}>
            <Feather name="info" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {isTyping && (
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
});

export default ChatDetail;