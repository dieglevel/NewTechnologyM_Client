import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();

  const handleClearPhoneNumber = () => {
    setPhoneNumber("");
  };

  const handleContinue = () => {
    console.log("Số điện thoại:", phoneNumber);
    navigation.navigate("RegisterScreen", { phone: phoneNumber });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Text className="text-2xl font-bold text-center mt-12 text-blue-500">
        Nhập số điện thoại của bạn để nhận mã xác thực
      </Text>

      <View className="mt-10">
        <Text className="text-base text-gray-800 mb-2">Số điện thoại</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            className="flex-1 text-base"
            keyboardType="phone-pad"
          />
          {phoneNumber.length > 0 && (
            <TouchableOpacity onPress={handleClearPhoneNumber} className="ml-2">
              <Icon name="close" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={phoneNumber.trim() === ""}
        className={`mt-8 p-4 rounded-lg items-center ${
          phoneNumber.trim() === "" ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text className="text-white text-center text-lg font-medium">Tiếp tục</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
