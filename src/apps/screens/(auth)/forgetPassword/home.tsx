import { SafeAreaView } from "@/apps/components";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Modal } from "react-native";
import { useTailwind } from "tailwind-rn";

export const LoginScreen = () => {
  const tailwind = useTailwind();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    console.log('Username:', username, 'Password:', password);
  };

  const handlePressCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView>
      <Text className="text-2xl font-bold text-center mt-24 text-blue-500">Zalo</Text>

      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handlePressCloseModal}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View className="flex-1 bg-black bg-opacity-50 items-center justify-center">
              <View className="bg-white p-6 rounded-lg shadow">
                <TouchableOpacity onPress={handlePressCloseModal}>
                  <Text className="text-lg p-2">Tiếng Việt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePressCloseModal}>
                  <Text className="text-lg p-2">English</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <Text style={tailwind('text-2xl font-bold mb-6 text-center')}>
        Bạn có thể đăng nhập bằng số điện thoại hoặc username
      </Text>

      <TextInput
        style={tailwind('w-full p-3 border border-gray-300 rounded mb-4')}
        placeholder="Số điện thoại hoặc Username"
        value={username}
        onChangeText={setUsername}
      />

      <View style={tailwind('relative w-full')}>
        <TextInput
          style={tailwind('w-full p-3 border border-gray-300 rounded mb-4')}
          placeholder="Mật khẩu"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={tailwind('absolute right-3 top-1/2 transform -translate-y-1/2')}
          onPress={togglePasswordVisibility}
        >
          <Image
            source={passwordVisible ? require('./assets/eye-open.png') : require('./assets/eye-closed.png')}
            style={tailwind('w-6 h-6')}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tailwind('w-full bg-blue-500 py-3 rounded mb-4')}
        onPress={handleLogin}
      >
        <Text style={tailwind('text-center text-white font-bold')}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log('Quên mật khẩu')}>
        <Text style={tailwind('text-blue-500 text-center')}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tailwind('bg-gray-200 py-3 rounded mt-4')}
        onPress={() => console.log('Tạo tài khoản')}
      >
        <Text style={tailwind('text-center text-gray-800')}>Tạo tài khoản</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
