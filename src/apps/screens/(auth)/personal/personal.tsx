import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "@/apps/components";
import { ArrowBack } from "@/assets/svgs";

export const UserProfileScreen = () => {
  const navigation = useNavigation();

  const menuItems = [
    { id: 1, label: "zStyle – Nổi bật trên Zalo", description: "Hình nền và nhạc cho cuộc gọi Zalo", icon: "🎨" },
    { id: 2, label: "Ví QR", description: "Lưu trữ và xuất trình các mã QR quan trọng", icon: "📱" },
    { id: 3, label: "Cloud của tôi", description: "Lưu trữ các tin nhắn quan trọng", icon: "☁️" },
    { id: 4, label: "zCloud", description: "Không gian lưu trữ dữ liệu trên đám mây", icon: "🗄️" },
    { id: 5, label: "Dữ liệu trên máy", description: "Quản lý dữ liệu Zalo của bạn", icon: "💾" },
    { id: 6, label: "Tài khoản và bảo mật", description: null, icon: "🔒" },
    { id: 7, label: "Quyền riêng tư", description: null, icon: "🛡️" },
  ];

  return (
    <SafeAreaView>
      <View className="flex-1 bg-white">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-4 flex-row items-center"
        >
          <ArrowBack color="#292d32" outline="#292d32" />
          <Text className="ml-2 text-lg font-semibold">Cá nhân</Text>
        </TouchableOpacity>

        {/* Profile Info */}
        <View className="p-4 flex-row items-center bg-gray-100">
          <View className="w-12 h-12 rounded-full bg-gray-300"></View>
          <View className="ml-4">
          {/*  thay thành tên người dùng đăng nhập sau */}
            <Text className="text-lg font-bold">Nguyễn Thanh Định</Text>  
            <Text className="text-sm text-blue-500">Xem trang cá nhân</Text>
          </View>
        </View>

        <ScrollView className="flex-1">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row justify-between items-center p-4 border-b border-gray-200"
              onPress={() => console.log(`Navigating to ${item.label}`)}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl">{item.icon}</Text>
                <View className="ml-4">
                  <Text className="text-base font-medium">{item.label}</Text>
                  {item.description && (
                    <Text className="text-sm text-gray-500">{item.description}</Text>
                  )}
                </View>
              </View>
              <Text className="text-gray-400 text-xl">›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
