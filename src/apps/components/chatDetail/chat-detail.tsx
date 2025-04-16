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
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";

const ChatDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name }: any = route.params || { name: "Người dùng" };
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Xin chào!",
      sender: "me",
      time: "10:00",
      read: true,
      avatar: "https://i.pravatar.cc/150?img=3",
      senderName: "Tôi",
    },
    {
      id: "2",
      text: "Chào bạn!",
      sender: "other",
      time: "10:01",
      avatar: "https://i.pravatar.cc/150?img=5",
      senderName: "Minh",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text?: string, imageUri?: string) => {
    if ((text?.trim() ?? "") === "" && !imageUri) return;

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
        avatar: "https://i.pravatar.cc/150?img=3",
        senderName: "Tôi",
        image: imageUri || null,
      },
    ]);

    setInputText("");
    setShowEmoji(false);
    setIsTyping(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      sendMessage("", imageUri);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMyMessage = item.sender === "me";

    // Thu hồi tin nhắn
    const handleRecallMessage = (id: string) => {
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
                msg.id === id ? { ...msg, text: "Tin nhắn đã được thu hồi", image: null } : msg
              )
            );
          },
        },
      ]);
    };

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
          onLongPress={() => handleRecallMessage(item.id)}
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
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={{ width: 180, height: 180, borderRadius: 10, marginBottom: 6 }}
            />
          )}
          {item.text !== "" && (
            <Text
              style={isMyMessage ? styles.myMessageText : styles.otherMessageText}
            >
              {item.text}
            </Text>
          )}
          <View style={styles.metaInfo}>
            <Text style={styles.timestamp}>{item.time}</Text>
            {item.read && isMyMessage && (
              <MaterialIcons
                name="check-circle"
                size={14}
                color="#3b82f6"
                style={{ marginLeft: 4 }}
              />
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
        <Text
          style={{
            marginLeft: 16,
            marginBottom: 4,
            color: isDark ? "#d1d5db" : "#4b5563",
            fontStyle: "italic",
          }}
        >
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
            <Ionicons
              name="happy-outline"
              size={26}
              color="#3b82f6"
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage}>
            <Ionicons
              name="image-outline"
              size={26}
              color="#3b82f6"
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>

          <TextInput
            style={[
              styles.textInput,
              isDark && {
                backgroundColor: "#1f2937",
                color: "white",
              },
            ]}
            placeholder="Nhập tin nhắn..."
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
            <Ionicons name="send" size={20} color="white" />
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
  headerIcons: {
    flexDirection: "row",
  },
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
    backgroundColor: "#3b82f6",
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
  myMessageText: { color: "white", fontSize: 16 },
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
});

export default ChatDetail;