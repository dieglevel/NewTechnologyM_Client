import React from 'react';
import { View, Text } from 'react-native';

export function InfoBox() {
  return (
    <View className="bg-gray-50 p-4 rounded-lg mb-8">
      <Text className="text-gray-700 mb-4">
        Để lấy mã xác thực, bạn cần:
      </Text>
      <Text className="text-gray-700">
        Soạn <Text className="font-bold">ZALO</Text> gửi{' '}
        <Text className="font-bold">6020</Text> (1000đ/tin nhắn) hoặc gọi đến tổng đài{' '}
        <Text className="font-bold">19001223</Text> (1000đ/phút) và làm theo hướng dẫn
      </Text>
    </View>
  );
}