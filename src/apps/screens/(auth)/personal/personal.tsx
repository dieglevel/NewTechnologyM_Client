import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
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
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.header}
        >
          <ArrowBack color="#292d32" outline="#292d32" />
          <Text style={styles.headerText}>Cá nhân</Text>
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatar} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Nguyễn Thanh Định</Text>
            <Text style={styles.profileLink}>Xem trang cá nhân</Text>
          </View>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => console.log(`Navigating to ${item.label}`)}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.description && (
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // bg-white
  },
  header: {
    padding: 16, // p-4
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
  },
  headerText: {
    marginLeft: 8, // ml-2
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
  },
  profileInfo: {
    padding: 16, // p-4
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  avatar: {
    width: 48, // w-12
    height: 48, // h-12
    borderRadius: 24, // rounded-full
    backgroundColor: "#d1d5db", // bg-gray-300
  },
  profileTextContainer: {
    marginLeft: 16, // ml-4
  },
  profileName: {
    fontSize: 18, // text-lg
    fontWeight: "bold", // font-bold
  },
  profileLink: {
    fontSize: 14, // text-sm
    color: "#3b82f6", // text-blue-500
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row", // flex-row
    justifyContent: "space-between", // justify-between
    alignItems: "center", // items-center
    padding: 16, // p-4
    borderBottomWidth: 1, // border-b
    borderBottomColor: "#e5e7eb", // border-gray-200
  },
  menuItemContent: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
  },
  menuIcon: {
    fontSize: 24, // text-2xl
  },
  menuTextContainer: {
    marginLeft: 16, // ml-4
  },
  menuLabel: {
    fontSize: 16, // text-base
    fontWeight: "500", // font-medium
  },
  menuDescription: {
    fontSize: 14, // text-sm
    color: "#6b7280", // text-gray-500
  },
  menuArrow: {
    fontSize: 18, // text-xl
    color: "#9ca3af", // text-gray-400
  },
});