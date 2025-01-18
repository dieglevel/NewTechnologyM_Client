import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export function ActionButtons() {
  return (
    <View className="flex-row justify-between border-t-2 border-[#eaeff5] pt-2">
      <TouchableOpacity className="flex-1 mr-2">
        <Text className="text-blue-500 text-center font-bold text-base">
          Gửi tin nhắn
        </Text>
      </TouchableOpacity>
      <View className='bg-[#eaeff5] w-[2]'></View>
      <TouchableOpacity className="flex-1 ml-2">
        <Text className="text-blue-500 text-center font-bold text-base">
          Gọi tổng đài
        </Text>
      </TouchableOpacity>
    </View>
  );
}