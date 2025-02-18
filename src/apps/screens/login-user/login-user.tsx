import { StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const LoginUserScreen = () => {
  const navigation = useNavigation<StackScreenNavigationProp>();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-gray-500 mb-4 text-center">
          Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
        </Text>

        <View className="border border-gray-300 rounded-lg p-3 flex-row items-center mb-4">
          <TextInput
            className="flex-1 text-base"
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          {phone.length > 0 && (
            <TouchableOpacity onPress={() => setPhone("")}> 
            </TouchableOpacity>
          )}
        </View>

        <View className="border border-gray-300 rounded-lg p-3 flex-row items-center mb-4">
          <TextInput
            className="flex-1 text-base"
            placeholder="Nhập mật khẩu"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Text className="text-blue-500 font-medium">
              {isPasswordVisible ? "ẨN" : "HIỆN"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text className="text-blue-500 text-center font-medium">Lấy lại mật khẩu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
