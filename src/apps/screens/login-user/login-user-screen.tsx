import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { loginApi } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
			})
		}
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
					{phone.length > 0 && <TouchableOpacity onPress={() => setPhone("")}></TouchableOpacity>}
				</View>

				<View className="border border-gray-300 rounded-lg p-3 flex-row items-center mb-4">
					<TextInput
						className="flex-1 text-base"
						placeholder="Nhập mật khẩu"
						secureTextEntry={!isPasswordVisible}
						value={password}
						onChangeText={setPassword}
						onSubmitEditing={handleLogin}
					/>
					<TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
						<Text className="text-blue-500 font-medium">{isPasswordVisible ? "ẨN" : "HIỆN"}</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
					<Text className="text-blue-500 text-center font-medium">Lấy lại mật khẩu</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};
