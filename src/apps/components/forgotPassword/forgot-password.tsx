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
	StyleSheet,
	Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendOTPPasswordApi, verifyOTPPasswordApi } from "@/services/auth";
import Toast from "react-native-toast-message";

export const ForgotPasswordComponent = () => {
	const navigation = useNavigation();
	const [phone, setPhone] = useState<string>("");
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showOTPModal, setShowOTPModal] = useState(false);
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);

	const inputRefs = useRef<Array<TextInput | null>>([]);

	const handlePhoneSubmit = () => {
		if (phone.trim().length > 0) {
			setShowConfirmModal(true);
		} else {
			alert("Vui lòng nhập số điện thoại.");
		}
	};

	const handlePhoneConfirmation = () => {
		setShowConfirmModal(false);
		setShowOTPModal(true);
		console.log("OTP đã được gửi:", phone);
		const sendEmail = async () => {
			try {
				const response = await sendOTPPasswordApi(phone);
				if (response.statusCode === 200) {
					console.log("Gửi OTP thành công:", response);
				}
			} catch (error) {
				console.error("Lỗi kết nối:", error);
			}
		};
		sendEmail();
	};

	const handleOtpChange = (text: string, index: number) => {
		const newOtp = [...otp];

		// Chỉ cho phép nhập số
		if (!/^\d*$/.test(text)) return;

		newOtp[index] = text;
		setOtp(newOtp);

		if (text && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}

		if (!text && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}

		if (text && index === 5) {
			Keyboard.dismiss();
		}
	};

	const handleOtpSubmit = () => {
		const otpValue = otp.join("");
		const otpIsNumeric = /^\d{6}$/.test(otpValue);

		if (!otpIsNumeric) {
			alert("Vui lòng nhập đúng 6 chữ số OTP.");
			return;
		}

		const verify = async () => {
			try {
				const response = await verifyOTPPasswordApi(otpValue, phone);
        console.log(response)
				if (response.statusCode === 201) {
					Toast.show({
						type: "success",
						text1: "Xác thực thành công",
						text2: "Mã OTP đã được xác thực thành công.",
					});

					navigation.navigate("UpdatePasswordScreen", {identifier: phone});
				} else {
					Toast.show({
						type: "error",
						text1: "Xác thực thất bại",
						text2: "Mã OTP không chính xác.",
					});
					console.log("Xác thực thất bại:", response);
				}
			} catch (error) {
				console.log(error);
			}
		};

		verify();
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.flexOne}
			>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons
							name="arrow-back"
							size={24}
							color="white"
						/>
					</TouchableOpacity>
					<Text style={styles.headerText}>Lấy lại mật khẩu</Text>
				</View>

				<View style={styles.formContainer}>
					<Text style={styles.formLabel}>Nhập số điện thoại để lấy lại mật khẩu</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder="Nhập số điện thoại"
							keyboardType="phone-pad"
							value={phone}
							onChangeText={setPhone}
						/>
						{phone.length > 0 && (
							<TouchableOpacity
								onPress={() => setPhone("")}
								style={styles.clearButton}
							>
								<Ionicons
									name="close-circle"
									size={20}
									color="gray"
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>

				<View style={styles.footer}>
					<TouchableOpacity
						onPress={handlePhoneSubmit}
						style={styles.submitButton}
					>
						<Ionicons
							name="arrow-forward"
							size={24}
							color="white"
						/>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>

			<Modal
				transparent={true}
				visible={showConfirmModal}
				animationType="fade"
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Xác nhận số điện thoại</Text>
						<Text style={styles.modalMessage}>
							(+84) {phone}
							{"\n"}Sẽ được sử dụng để nhận mã xác thực.
						</Text>
						<View style={styles.modalActions}>
							<TouchableOpacity
								onPress={() => setShowConfirmModal(false)}
								style={styles.cancelButton}
							>
								<Text style={styles.cancelButtonText}>Hủy</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handlePhoneConfirmation}
								style={styles.confirmButton}
							>
								<Text style={styles.confirmButtonText}>Xác nhận</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
				transparent={true}
				visible={showOTPModal}
				animationType="fade"
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Nhập mã xác thực</Text>
						<Text style={styles.modalMessage}>Đã gửi mã OTP đến {phone}</Text>

						<View style={styles.otpContainer}>
							{otp.map((digit, index) => (
								<TextInput
									key={index}
									ref={(ref) => (inputRefs.current[index] = ref)}
									style={styles.otpInput}
									keyboardType="number-pad"
									maxLength={1}
									value={digit}
									onChangeText={(text) => handleOtpChange(text, index)}
								/>
							))}
						</View>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: "#e5e7eb" }]}
							onPress={() => {
								setShowOTPModal(false);
								setOtp(["", "", "", "", "", ""]);
							}}
						>
							<Text style={[styles.submitButtonText, {color: "black"}]}>Huỷ</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.button}
							onPress={handleOtpSubmit}
						>
							<Text style={styles.submitButtonText}>Tiếp tục</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	flexOne: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#3b82f6",
	},
	headerText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		marginLeft: 16,
	},
	formContainer: {
		padding: 16,
	},
	formLabel: {
		color: "#4b5563",
		marginBottom: 8,
	},
	inputContainer: {
		borderBottomWidth: 1,
		borderBottomColor: "#06b6d4",
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
	},
	input: {
		flex: 1,
		fontSize: 16,
		paddingVertical: 8,
		paddingRight: 32,
	},
	clearButton: {
		position: "absolute",
		right: 0,
		padding: 8,
	},
	footer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		padding: 16,
	},
	submitButton: {
		width: 48,
		height: 48,
		backgroundColor: "#3b82f6",
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		paddingHorizontal: 24,
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 24,
		width: "100%",
		maxWidth: 400,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
		textAlign: "center",
	},
	modalMessage: {
		textAlign: "center",
		color: "#4b5563",
		marginBottom: 16,
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 8,
		marginRight: 8,
		backgroundColor: "#e5e7eb",
		borderRadius: 8,
		alignItems: "center",
	},
	cancelButtonText: {
		color: "#4b5563",
		fontWeight: "500",
	},
	confirmButton: {
		flex: 1,
		paddingVertical: 8,
		marginLeft: 8,
		backgroundColor: "#3b82f6",
		borderRadius: 8,
		alignItems: "center",
	},
	confirmButtonText: {
		color: "white",
		fontWeight: "500",
	},
	otpContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	otpInput: {
		width: 40,
		height: 48,
		borderWidth: 1,
		borderRadius: 8,
		textAlign: "center",
		fontSize: 18,
	},
	submitButtonText: {
		color: "white",
		fontWeight: "500",
	},
	button: {
		backgroundColor: "#3b82f6",
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
	},
});
