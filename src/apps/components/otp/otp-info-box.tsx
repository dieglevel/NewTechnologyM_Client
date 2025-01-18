import React from 'react';
import { View, Text } from 'react-native';
import { ActionButtons } from './otp-action-button';

export function InfoBox() {
  return (
    <View className="bg-[#f2f7fb] p-4 rounded-lg mt-6 ">
      <Text className="text-gray-700 mb-4 text-base pt-2">
        Để lấy mã xác thực, bạn cần:
      </Text>
      <Text className="text-gray-700 text-base mb-2">
        Soạn <Text className="font-bold">ZALO</Text> gửi{' '}
        <Text className="font-bold">6020</Text> (1000đ/tin nhắn) hoặc gọi đến tổng đài{' '}
        <Text className="font-bold">19001223</Text> (1000đ/phút) và làm theo hướng dẫn
      </Text>
      <ActionButtons />
    </View>
  );
}