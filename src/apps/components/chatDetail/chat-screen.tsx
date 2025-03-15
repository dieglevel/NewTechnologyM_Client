import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const ChatDetail = () => {
  const route = useRoute();
  const { name } = route.params || { name: "Người dùng" }; 
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
    <View className="flex-1 bg-white">
      <View className="p-3 bg-blue-500 flex-row items-center">
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="text-white font-bold text-lg ml-3">{name}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`p-3 my-1 mx-2 rounded-lg max-w-[70%] ${
              item.sender === "me" ? "self-end bg-blue-500" : "self-start bg-gray-200"
            }`}
          >
            <Text className={item.sender === "me" ? "text-white" : "text-black"}>{item.text}</Text>
          </View>
        )}
      />
      <View className="flex-row items-center border-t p-2">
        <TextInput
          className="flex-1 border rounded-full p-2"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} className="ml-2 p-2 bg-blue-500 rounded-full">
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatDetail;
