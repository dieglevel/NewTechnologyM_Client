import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

export const InputPhoneNumber = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-5">
      <Text className="text-lg font-semibold text-center mb-5">Nhập số điện thoại</Text>
      <View 
        className={`flex-row items-center border rounded-lg px-3 
          ${isFocused ? 'border-blue-500' : 'border-gray-300'}`}
      >
        <Text className="text-base mr-2">+84</Text>
        <TextInput
          className="flex-1 text-base"
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};