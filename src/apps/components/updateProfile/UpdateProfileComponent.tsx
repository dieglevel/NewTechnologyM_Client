import React, { useState } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UpdateProfileComponentProps {
  user: {
    name: string;
    dob: string;
    gender: "Nam" | "Nữ";
    mainAvatar: string;
  };
  onSave?: (data: any) => void;
}

export const UpdateProfileComponent = ({ user, onSave }: UpdateProfileComponentProps) => {
  const [name, setName] = useState(user.name);
  const [dob, setDob] = useState(user.dob);
  const [gender, setGender] = useState<"Nam" | "Nữ">(user.gender);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center p-4 bg-blue-500">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">Chỉnh sửa thông tin</Text>
      </View>

      <View className="items-center -mt-8">
        <TouchableOpacity className="border-4 border-white rounded-full">
          <Image source={{ uri: user.mainAvatar }} className="w-32 h-32 rounded-full" />
          <View className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
            <Ionicons name="camera" size={18} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <View className="px-6 mt-6 space-y-4">
        <View className="border-b border-gray-300 pb-2 flex-row items-center justify-between">
          <TextInput
            value={name}
            onChangeText={setName}
            className="text-base flex-1"
            placeholder="Nhập họ tên"
          />
          <Ionicons name="pencil-outline" size={20} color="gray" />
        </View>

        <View className="border-b border-gray-300 pb-2 flex-row items-center justify-between">
          <TextInput
            value={dob}
            onChangeText={setDob}
            className="text-base flex-1"
            placeholder="DD/MM/YYYY"
          />
          <Ionicons name="calendar-outline" size={20} color="gray" />
        </View>

        <View className="flex-row items-center space-x-6 mt-2">
          <Pressable className="flex-row items-center" onPress={() => setGender("Nam")}>
            <View className={`w-5 h-5 rounded-full border ${gender === "Nam" ? "bg-blue-500" : "border-gray-400"}`} />
            <Text className="ml-2 text-base">Nam</Text>
          </Pressable>
          <Pressable className="flex-row items-center" onPress={() => setGender("Nữ")}>
            <View className={`w-5 h-5 rounded-full border ${gender === "Nữ" ? "bg-blue-500" : "border-gray-400"}`} />
            <Text className="ml-2 text-base">Nữ</Text>
          </Pressable>
        </View>
        <TouchableOpacity
          className="bg-blue-500 mt-6 py-3 rounded-full items-center"
          onPress={() => onSave?.({ name, dob, gender })}
        >
          <Text className="text-white font-semibold text-base">LƯU</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
