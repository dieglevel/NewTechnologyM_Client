import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ForgotPasswordComponent = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleSubmit = () => {
    if (phone.trim().length > 0) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPhone = () => {
    setShowConfirmModal(false);
    setShowOTPModal(true);
    console.log("Đã gửi mã OTP về: ", phone);
  };

  const handleChangeOtp = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinueOTP = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      console.log("OTP hợp lệ:", otpValue);
      setShowOTPModal(false);
      navigation.navigate("UpdatePasswordScreen", { phone });
    } else {
      alert("Vui lòng nhập đầy đủ mã OTP.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center p-4 bg-blue-500">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ml-4">
            Lấy lại mật khẩu
          </Text>
        </View>

        <View className="p-4">
          <Text className="text-gray-600 mb-2">
            Nhập số điện thoại để lấy lại mật khẩu
          </Text>
          <View className="border-b border-cyan-500 flex-row items-center relative">
            <TextInput
              className="flex-1 text-base py-2 pr-8"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            {phone.length > 0 && (
              <TouchableOpacity
                onPress={() => setPhone("")}
                className="absolute right-0 p-2"
              >
                <Ionicons name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex-1 justify-end items-end p-4">
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal transparent={true} visible={showConfirmModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-lg font-semibold mb-2 text-center">
              Xác nhận số điện thoại
            </Text>
            <Text className="text-center text-gray-700 mb-4">
              (+84) {phone}
              {"\n"}Số điện thoại này sẽ được sử dụng để nhận mã xác thực.
            </Text>
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="flex-1 py-2 mr-2 bg-gray-200 rounded-lg items-center"
              >
                <Text className="text-gray-700 font-medium">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmPhone}
                className="flex-1 py-2 ml-2 bg-blue-500 rounded-lg items-center"
              >
                <Text className="text-white font-medium">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={showOTPModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-lg font-semibold mb-2 text-center">
              Nhập mã xác thực
            </Text>
            <Text className="text-center text-gray-700 mb-4">
              Đã gửi mã OTP đến số (+84) {phone}
            </Text>

            <View className="flex-row justify-between mb-4">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="w-10 h-12 border rounded-md text-center text-lg"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeOtp(text, index)}
                />
              ))}
            </View>

            <TouchableOpacity
              className="bg-blue-500 py-2 rounded-lg items-center"
              onPress={handleContinueOTP}
            >
              <Text className="text-white font-medium">Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
