import React from "react";
import { View, TextInput, Text } from "react-native";

export const InputPhoneNumber = () => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold mb-2">Nhập số điện thoại</Text>
      <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
        <Text className="text-lg mr-2">+84</Text>
        <TextInput
          className="flex-1 text-lg"
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

export default InputPhoneNumber;
