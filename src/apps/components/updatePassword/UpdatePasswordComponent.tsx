import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export const UpdatePasswordComponent = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { phone } = route.params as { phone: string };

  const handleUpdatePassword = () => {
    console.log("SĐT:", phone);
    console.log("Mật khẩu mới:", newPassword);
    console.log("Xác nhận mật khẩu mới:", confirmPassword);

    if (newPassword !== confirmPassword) {
      console.warn("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Gọi API cập nhật mật khẩu
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đổi mật khẩu</Text>
      </View>

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Xác nhận lại mật khẩu mới</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        onPress={handleUpdatePassword}
        style={styles.updateButton}
      >
        <Text style={styles.updateButtonText}>Cập nhật mật khẩu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", // bg-white
    padding: 16, // p-4
  },
  header: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    marginBottom: 16, // mb-4
  },
  headerText: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    marginLeft: 16, // ml-4
  },
  label: {
    marginBottom: 8, // mb-2
    color: "#4B5563", // text-gray-700
  },
  input: {
    borderWidth: 1, // border
    borderColor: "#D1D5DB", // border-gray-300
    borderRadius: 8, // rounded-lg
    padding: 12, // p-2
    marginBottom: 16, // mb-4
  },
  updateButton: {
    backgroundColor: "#3B82F6", // bg-blue-500
    padding: 12, // p-3
    borderRadius: 8, // rounded-lg
    alignItems: "center", // items-center
  },
  updateButtonText: {
    color: "white", // text-white
    fontWeight: "600", // font-semibold
  },
});