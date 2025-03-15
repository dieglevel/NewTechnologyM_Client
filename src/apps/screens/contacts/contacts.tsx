import React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const contacts = [
  { id: "1", name: "Advertisement And Edu" },
  { id: "2", name: "Anh Ngữ Betma" },
  { id: "3", name: "Anl Nguyen" },
  { id: "4", name: "Bảo" },
  { id: "5", name: "Bảo" },
];

const ContactItem = ({ item }) => (
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

const ContactsScreen = () => {
  return (
    <View className="flex-1">
      <View className="bg-blue-500 p-3 flex-row items-center">
        <Ionicons name="search" size={20} color="white" className="mx-2" />
        <TextInput className="flex-1 text-white" placeholder="Tìm kiếm" placeholderTextColor="white" />
        <Ionicons name="person-add" size={24} color="white" className="mx-2" />
      </View>
      <FlatList data={contacts} keyExtractor={(item) => item.id} renderItem={ContactItem} />
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Messages" component={ContactsScreen} options={{
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />,
        }} />
        <Tab.Screen name="Contacts" component={ContactsScreen} options={{
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
