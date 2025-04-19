import { SafeAreaView } from "@/apps/components";
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  StyleSheet,
} from "react-native";

export const LoginScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    // console.log("Username:", username, "Password:", password);
  };

  const handlePressCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Zalo</Text>

      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handlePressCloseModal}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={handlePressCloseModal}>
                  <Text style={styles.modalOption}>Tiếng Việt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePressCloseModal}>
                  <Text style={styles.modalOption}>English</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <Text style={styles.subtitle}>
        Bạn có thể đăng nhập bằng số điện thoại hoặc username
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại hoặc Username"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={togglePasswordVisibility}
        >
          <Image
            source={
              passwordVisible
                ? require("./assets/eye-open.png")
                : require("./assets/eye-closed.png")
            }
            style={styles.passwordIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => // console.log("Quên mật khẩu")}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => // console.log("Tạo tài khoản")}
      >
        <Text style={styles.createAccountText}>Tạo tài khoản</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "bold", // font-bold
    textAlign: "center",
    marginTop: 96, // mt-24
    color: "#3b82f6", // text-blue-500
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // bg-black bg-opacity-50
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white", // bg-white
    padding: 24, // p-6
    borderRadius: 8, // rounded-lg
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    fontSize: 18, // text-lg
    padding: 8, // p-2
  },
  subtitle: {
    fontSize: 18, // text-lg
    fontWeight: "bold", // font-bold
    textAlign: "center",
    marginBottom: 24, // mb-6
    marginTop: 24, // mt-6
  },
  input: {
    width: "100%",
    padding: 12, // p-3
    borderWidth: 1, // border
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 8, // rounded
    marginBottom: 16, // mb-4
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordToggle: {
    position: "absolute",
    right: 12, // right-3
    top: "50%",
    transform: [{ translateY: -12 }], // -translate-y-1/2
  },
  passwordIcon: {
    width: 24, // w-6
    height: 24, // h-6
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#3b82f6", // bg-blue-500
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded
    marginBottom: 16, // mb-4
  },
  loginButtonText: {
    textAlign: "center",
    color: "white", // text-white
    fontWeight: "bold", // font-bold
  },
  forgotPasswordText: {
    color: "#3b82f6", // text-blue-500
    textAlign: "center",
  },
  createAccountButton: {
    backgroundColor: "#e5e7eb", // bg-gray-200
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded
    marginTop: 16, // mt-4
  },
  createAccountText: {
    textAlign: "center",
    color: "#374151", // text-gray-800
  },
});