import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ForgotPasswordComponent = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    console.log("SĐT gửi yêu cầu: ", phone);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center p-4 bg-blue-500">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ml-4">
            Lấy lại mật khẩu
          </Text>
        </View>

        <View className="p-4">
          <Text className="text-gray-600 mb-2">
            Nhập số điện thoại để lấy lại mật khẩu
          </Text>
          <View className="border-b border-cyan-500 flex-row items-center">
            <TextInput
              className="flex-1 text-base py-2"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => setPhone("")}>
                <Ionicons name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex-1 justify-end items-end p-4">
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
