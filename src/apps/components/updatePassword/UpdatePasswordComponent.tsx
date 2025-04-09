import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export const UpdatePasswordComponent = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { phone } = route.params as { phone: string };

  const handleUpdatePassword = () => {
    console.log("SĐT:", phone);
    console.log("Mật khẩu mới:", newPassword);
    console.log("Xác nhận mật khẩu mới:", confirmPassword);

    if (newPassword !== confirmPassword) {
      console.warn("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Gọi API cập nhật mật khẩu
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Đổi mật khẩu</Text>
      </View>

      <Text className="mb-2 text-gray-700">Mật khẩu mới</Text>
      <TextInput
        secureTextEntry
        className="border rounded-lg p-2 mb-4"
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text className="mb-2 text-gray-700">Xác nhận lại mật khẩu mới</Text>
      <TextInput
        secureTextEntry
        className="border rounded-lg p-2 mb-6"
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        onPress={handleUpdatePassword}
        className="bg-blue-500 p-3 rounded-lg items-center"
      >
        <Text className="text-white font-semibold">Cập nhật mật khẩu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
