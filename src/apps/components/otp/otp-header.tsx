import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function Header() {
  return (
    <View className="mb-8">
      <TouchableOpacity className="mb-8">
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-center mb-4">
        Nhập mã xác thực
      </Text>

      <Text className="text-gray-500 text-center mb-2">
        Nhập dãy 6 số được gửi đến số điện thoại
      </Text>
      <Text className="text-black text-center font-medium">
        0522 206 965
      </Text>
    </View>
  );
}