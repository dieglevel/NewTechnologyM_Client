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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChatDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name }: any = route.params || { name: "Người dùng" };
  const [messages, setMessages] = useState([
    { id: "1", text: "Xin chào!", sender: "me", time: "10:00" },
    { id: "2", text: "Chào bạn!", sender: "other", time: "10:01" },
  ]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: inputText, sender: "me", time: currentTime },
    ]);
    setInputText("");
  };

  useEffect(() => {
    // Tự động cuộn xuống khi có tin nhắn mới
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={item.sender === "me" ? styles.myMessageText : styles.otherMessageText}>
              {item.text}
            </Text>
            <Text style={styles.timestamp}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
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
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
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
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 16,
    maxWidth: "75%",
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
  myMessageText: {
    color: "white",
    fontSize: 16,
  },
  otherMessageText: {
    color: "#111827",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
    alignSelf: "flex-end",
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
