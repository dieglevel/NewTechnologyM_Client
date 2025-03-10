import React from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ChatHeader = () => {
  return (
    <View className="w-full h-screen">
      <View className="flex-row items-center bg-gradient-to-r from-blue-500 to-blue-900 p-2 rounded-lg w-full">
        <Ionicons name="search" size={20} color="black" className="mx-2" />
        <TextInput
          className="flex-1 text-black text-base"
          placeholder="Tìm kiếm"
          placeholderTextColor="black"
        />
        <Ionicons name="qr-code" size={20} color="black" className="mx-2" />
        <Ionicons name="add" size={24} color="black" className="mx-2" />
      </View>

      {/* Nội dung chính */}
      <View className="flex-1 bg-gray-100 w-full"></View>

      <View className="absolute bottom-0 w-full bg-white p-3 border-t border-gray-300 flex-row justify-around items-center">
        <TouchableOpacity className="items-center">
          <View className="relative">
            <Ionicons name="chatbubbles" size={24} color="blue" />
            <View className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1">
              <Text className="text-white text-xs">5</Text>
            </View>
          </View>
          <Text className="text-blue-500 text-xs">Tin nhắn</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Ionicons name="book" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <View className="relative">
            <Ionicons name="grid" size={24} color="gray" />
            <View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-2 h-2"></View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <View className="relative">
            <Ionicons name="time-outline" size={24} color="gray" />
            <View className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1">
              <Text className="text-white text-xs">N</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Ionicons name="person-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
