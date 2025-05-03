import { ArrowBack } from "@/assets/svgs";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Button, FooterLink, InputPhoneNumber, TermsCheckBox, VerificationModal } from "@/apps/components/register";
import { checkRegister } from "./handle";
import Toast from "react-native-toast-message";
import { registerApi } from "@/services/auth";
import { ErrorResponse } from "@/libs/axios/axios.config";

export const RegisterScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [identifier, setIdentifier] = useState<string>("");

	const [password, setPassword] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [rePassword, setRePassword] = useState<string>("");
	const [isRePasswordVisible, setIsRePasswordVisible] = useState(false);

	const [error, setError] = useState<{
		errorIdentify: string;
		errorPassword: string;
		errorRePassword: string;
	}>({
		errorIdentify: "",
		errorPassword: "",
		errorRePassword: "",
	});

	const { t } = useTranslation();

	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = () => {
		setLoading(true);
		const checkField = checkRegister(identifier, password, rePassword, setError);
		if (!checkField) {
			setLoading(false);
			return;
		}

		const handleRegister = async () => {
			try {
				const response = await registerApi(identifier, password);
				if (response?.statusCode === 201) {
					Toast.show({
						text1: "Đăng ký thành công",
						text2: "Vui lòng xác thực tài khoản của bạn",
						type: "success",
					});

					if (identifier.match(/^\d{10}$/)) {
						navigation.navigate("OTP", { identifier, type: "phone" });
					} else {
						navigation.navigate("OTP", { identifier, type: "email" });
					}
				}
			} catch (e) {
				const errorResponse = e as ErrorResponse;
				if (errorResponse.statusCode === 409) {
					Toast.show({
						text1: "Đăng ký thất bại",
						text2: "Số điện thoại hoặc email đã tồn tại",
						type: "error",
					});
				}
			} finally {
				setLoading(false);
			}
		};

		handleRegister();

		// Call API to register here
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View>
					<Text
						style={{
							fontSize: 14,
							fontWeight: "bold",
							marginBottom: 4,
							color: `${error.errorIdentify ? "red" : "black"}`,
						}}
					>
						Số điện thoại hoặc email
					</Text>
					<TextInput
						style={{
							borderWidth: 1,
							borderColor: `${error.errorIdentify ? "red" : "#ccc"}`,
							borderRadius: 8,
							padding: 10,
							marginBottom: 16,
						}}
						placeholder="Nhập số điện thoại hoặc email"
						value={identifier}
						onChangeText={setIdentifier}
					/>
					{error.errorIdentify ? (
						<Text style={{ color: "red", marginBottom: 16 }}>{error.errorIdentify}</Text>
					) : null}
					<Text
						style={{
							fontSize: 14,
							fontWeight: "bold",
							marginBottom: 4,
							color: `${error.errorPassword ? "red" : "black"}`,
						}}
					>
						Mật khẩu
					</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.textInput}
							placeholder="Mật khẩu"
							secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
						/>
						<TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
							<Text style={styles.togglePasswordText}>{isPasswordVisible ? "ẨN" : "HIỆN"}</Text>
						</TouchableOpacity>
					</View>
					{error.errorPassword ? (
						<Text style={{ color: "red", marginBottom: 16 }}>{error.errorPassword}</Text>
					) : null}
					<Text
						style={{
							fontSize: 14,
							fontWeight: "bold",
							marginBottom: 4,
							color: `${error.errorRePassword ? "red" : "black"}`,
						}}
					>
						Xác nhận mật khẩu
					</Text>


					<View style={styles.inputContainer}>
						<TextInput
							style={styles.textInput}
							placeholder="Xác nhận mật khẩu"
							secureTextEntry={!isRePasswordVisible}
                            value={rePassword}
                            onChangeText={setRePassword}
						/>
						<TouchableOpacity onPress={() => setIsRePasswordVisible(!isRePasswordVisible)}>
							<Text style={styles.togglePasswordText}>{isRePasswordVisible ? "ẨN" : "HIỆN"}</Text>
						</TouchableOpacity>
					</View>
					{error.errorRePassword ? (
						<Text style={{ color: "red", marginBottom: 16 }}>{error.errorRePassword}</Text>
					) : null}
					<Button
						title="Đăng ký"
						disabled={loading}
						onPress={handleSubmit}
					/>
				</View>
				<View>
					<FooterLink
						onPress={() => navigation.navigate("LoginUser")}
						text="Bạn đã có tài khoản? "
						textLink="Đăng nhập ngay"
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white", // bg-white
		width: "100%", // w-full
	},

	content: {
		flex: 1,
		padding: 16, // p-4
		justifyContent: "space-between", // justify-between
	},
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
