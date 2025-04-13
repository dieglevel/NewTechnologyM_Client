import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type RouteParams = {
  params: {
    phone: string;
  };
};

export const UpdatePasswordComponent = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { phone } = route.params;

  const onUpdatePasswordPress = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    console.log("SĐT:", phone);
    console.log("Mật khẩu mới:", newPassword);
    console.log("Xác nhận mật khẩu:", confirmPassword);

    // TODO: Gọi API đổi mật khẩu
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đổi mật khẩu</Text>
      </View>

      {/* Form nhập mật khẩu */}
      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Xác nhận lại mật khẩu</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Button cập nhật */}
      <TouchableOpacity style={styles.updateButton} onPress={onUpdatePasswordPress}>
        <Text style={styles.updateButtonText}>Cập nhật mật khẩu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  label: {
    marginBottom: 8,
    color: "#374151", // text-gray-700
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
