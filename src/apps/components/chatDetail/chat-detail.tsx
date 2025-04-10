import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const ChatDetail = () => {
  const route = useRoute();
  const { name }: any = route.params || { name: "Người dùng" }; 
  const [messages, setMessages] = useState([
    { id: "1", text: "Xin chào!", sender: "me" },
    { id: "2", text: "Chào bạn!", sender: "other" },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: "me" }]);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.headerText}>{name}</Text>
      </View>
      <FlatList
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
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    maxWidth: "70%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3b82f6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e7eb",
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 25,
    padding: 8,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 25,
  },
});

export default ChatDetail;