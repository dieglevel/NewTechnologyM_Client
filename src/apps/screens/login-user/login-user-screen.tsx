import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { loginApi } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

export const LoginUserScreen = () => {
  const navigation = useNavigation<StackScreenNavigationProp>();
  const [phone, setPhone] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    try {
      const response = await loginApi(phone, password);

      if (response.statusCode === 200) {
        navigation.navigate("BottomTabScreenApp");
      }
    } catch (error) {
      const err = error as ErrorResponse;
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: err.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.description}>
          Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
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
            <TouchableOpacity onPress={() => setPhone("")}></TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.togglePasswordText}>
              {isPasswordVisible ? "ẨN" : "HIỆN"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.forgotPasswordText}>Lấy lại mật khẩu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", // bg-white
  },
  scrollView: {
    padding: 16, // p-4
  },
  description: {
    color: "#6b7280", // text-gray-500
    marginBottom: 16, // mb-4
    textAlign: "center",
  },
  inputContainer: {
    borderWidth: 1, // border
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 8, // rounded-lg
    padding: 12, // p-3
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    marginBottom: 16, // mb-4
  },
  textInput: {
    flex: 1, // flex-1
    fontSize: 16, // text-base
  },
  togglePasswordText: {
    color: "#3b82f6", // text-blue-500
    fontWeight: "500", // font-medium
  },
  forgotPasswordText: {
    color: "#3b82f6", // text-blue-500
    textAlign: "center",
    fontWeight: "500", // font-medium
  },
});