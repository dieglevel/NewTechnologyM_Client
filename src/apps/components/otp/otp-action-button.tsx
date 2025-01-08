import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export function ActionButtons() {
  return (
    <View className="flex-row justify-between mb-8">
      <TouchableOpacity className="flex-1 mr-2">
        <Text className="text-blue-500 text-center font-medium">
          Gửi tin nhắn
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-1 ml-2">
        <Text className="text-blue-500 text-center font-medium">
          Gọi tổng đài
        </Text>
      </TouchableOpacity>
    </View>
  );
}