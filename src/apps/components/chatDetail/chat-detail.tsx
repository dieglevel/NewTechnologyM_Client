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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";

const ChatDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name }: any = route.params || { name: "Người dùng" };

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
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: inputText,
        sender: "me",
        time: currentTime,
        read: true,
        avatar: "https://i.pravatar.cc/150?img=3",
        senderName: "Tôi",
      },
    ]);
    setInputText("");
    setShowEmoji(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  const renderMessageItem = ({ item }: { item: any }) => {
    const isMyMessage = item.sender === "me";
    return (
      <View style={styles.messageRow}>
        {!isMyMessage && (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        )}
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.otherMessage,
          ]}
        >
          {!isMyMessage && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text
            style={
              isMyMessage ? styles.myMessageText : styles.otherMessageText
            }
          >
            {item.text}
          </Text>
          <View style={styles.metaInfo}>
            <Text style={styles.timestamp}>{item.time}</Text>
            {item.read && (
              <MaterialIcons
                name="check-circle"
                size={14}
                color="#3b82f6"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </Animatable.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{name}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {showEmoji && (
        <View style={{ height: 300 }}>
          <EmojiSelector
            onEmojiSelected={(emoji) => setInputText((prev) => prev + emoji)}
            showSearchBar={false}
            showTabs={true}
            showHistory={true}
            showSectionTitles={false}
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
            style={styles.textInput}
            placeholder="Nhập tin nhắn..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
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
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
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
    alignSelf: "flex-end",
    backgroundColor: "#3b82f6",
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e7eb",
    borderTopLeftRadius: 0,
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
