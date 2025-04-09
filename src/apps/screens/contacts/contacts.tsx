import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const contacts = [
  { id: "1", name: "Advertisement And Edu" },
  { id: "2", name: "Anh Ngữ Betma" },
  { id: "3", name: "Anl Nguyen" },
  { id: "4", name: "Bảo" },
  { id: "5", name: "Linh" },
];

const ContactItem = ({ item }: any) => (
  <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-200">
    <View className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
      <Text className="text-white font-bold text-lg">{item.name.charAt(0)}</Text>
    </View>
    <View className="ml-3 flex-1">
      <Text className="font-semibold text-black">{item.name}</Text>
    </View>
    <Ionicons name="call" size={20} color="gray" className="mx-2" />
    <Ionicons name="videocam" size={20} color="gray" className="mx-2" />
  </TouchableOpacity>
);

const Tabs = ["Bạn bè", "Nhóm", "OA"];

const ContactsScreen = () => {
  const [activeTab, setActiveTab] = useState("Bạn bè");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bạn bè":
        return (
          <FlatList
            ListHeaderComponent={
              <View className="px-3 pt-4 pb-2 space-y-4">
                <TouchableOpacity className="flex-row items-center p-3 bg-gray-100 rounded-lg">
                  <Ionicons name="person-add" size={24} color="#2563eb" />
                  <Text className="ml-3 font-semibold text-black">Lời mời kết bạn</Text>
                </TouchableOpacity>

                <View className="flex-row items-center p-3 bg-gray-100 rounded-lg">
                  <Ionicons name="people" size={20} color="gray" />
                  <Text className="ml-2 text-gray-700 font-semibold">Danh bạ máy</Text>
                </View>

                <View>
                  <TouchableOpacity className="flex-row items-center p-3 bg-gray-100 rounded-lg">
                    <Ionicons name="gift" size={24} color="#f59e0b" />
                    <Text className="ml-3 font-semibold text-black">Sinh nhật</Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-between mt-3 px-1">
                    <TouchableOpacity className="px-4 py-2 rounded-full bg-blue-500">
                      <Text className="text-white font-medium">Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-4 py-2 rounded-full bg-gray-200">
                      <Text className="text-black font-medium">Mới truy cập</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={ContactItem}
          />
        );
      case "Nhóm":
        return (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">Danh sách nhóm sẽ hiển thị ở đây</Text>
          </View>
        );
      case "OA":
        return (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">Danh sách OA sẽ hiển thị ở đây</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#3b82f6"
        translucent
      />
      <View
        className="bg-blue-500 flex-row items-center px-3"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
          paddingBottom: 12,
        }}
      >
        <Ionicons name="search" size={20} color="white" />
        <TextInput
          className="flex-1 text-white ml-3"
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
        />
        <Ionicons name="person-add" size={24} color="white" />
      </View>

      <View className="flex-row border-b border-gray-200 bg-white">
        {Tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 p-3 items-center ${
              activeTab === tab ? "border-b-2 border-blue-500" : ""
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1 bg-white">{renderTabContent()}</View>
    </View>
  );
};

export default ContactsScreen;
