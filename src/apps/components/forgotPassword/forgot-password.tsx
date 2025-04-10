import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ForgotPasswordComponent = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    console.log("SĐT gửi yêu cầu: ", phone);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex1}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Lấy lại mật khẩu</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Nhập số điện thoại để lấy lại mật khẩu
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => setPhone("")}>
                <Ionicons name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16, // p-4
    backgroundColor: "#3b82f6", // bg-blue-500
  },
  headerText: {
    color: "white", // text-white
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    marginLeft: 16, // ml-4
  },
  content: {
    padding: 16, // p-4
  },
  description: {
    color: "#6B7280", // text-gray-600
    marginBottom: 8, // mb-2
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#06b6d4", // border-cyan-500
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16, // text-base
    paddingVertical: 8, // py-2
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 16, // p-4
  },
  submitButton: {
    width: 48, // w-12
    height: 48, // h-12
    backgroundColor: "#3b82f6", // bg-blue-500
    borderRadius: 24, // rounded-full
    alignItems: "center",
    justifyContent: "center",
  },
});