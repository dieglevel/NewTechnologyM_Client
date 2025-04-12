import { OtpHeader, InfoBox, OTPInput } from "@/apps/components/otp";
import { ArrowBack } from "@/assets/svgs";
import { OTPRouteProp, StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "@/apps/components";
import { Button, FooterLink } from "@/apps/components/register";
import { verifyAccount } from "@/services/auth";
import Toast from "react-native-toast-message";
import { ErrorResponse } from "@/libs/axios/axios.config";

export const OTPScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const route = useRoute<OTPRouteProp>();

    const [identifier, setIdentifier] = useState<string>(route.params?.identifier);
    const [isLoading, setIsLoading] = useState<boolean>(false);

	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const inputRefs = Array(6)
		.fill(0)
		.map(() => React.createRef<HTMLInputElement>());

	const handleSubmit = async () => {
		setIsLoading(true);
		console.log("identifier", identifier);
		try {
			const response = await verifyAccount(identifier, otp.join(""));
			if (response?.statusCode === 201) {
                Toast.show({
                    text1: "Xác thực thành công",
                    text2: "Vui lòng đăng nhập lại",
                    type: "success",
                });
                navigation.navigate("LoginUser");
			}
		} catch (e) {
            const  errorResponse = e as ErrorResponse;
            Toast.show({
                text1: "Xác thực thất bại",
                text2: "Sai mã xác thực",
                type: "error",
            });
            setOtp(["", "", "", "", "", ""]);
            inputRefs[0]?.current?.focus();
		} finally {
			setIsLoading(false);
		}
	};

	const handleOtpChange = (value: string, index: number) => {
		if (value.length > 1) {
			value = value[0];
		}

		const newOtp = [...otp];
		if (value !== "B") newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 5 && value != "B") {
			inputRefs[index + 1]?.current?.focus();
		} else if (index > 0 && value == "B") {
			inputRefs[index - 1]?.current?.focus();
		}
	};

	return (
		<SafeAreaView>
			<View style={styles.content}>
				<OtpHeader textPhone={route.params?.type === "phone" ? "Điện thoại" : "Email xác thực"} />
				<OTPInput
					otp={otp}
					inputRefs={inputRefs}
					handleOtpChange={handleOtpChange}
				/>
				<Button
					title="Tiếp tục"
					disabled={otp.includes("") || isLoading}
					onPress={() => {handleSubmit()}}
				/>
				{/* <InfoBox /> */}
			</View>
			<View style={styles.footer}>
				<FooterLink
					text=""
					textLink="Tôi cần hỗ trợ thêm về mã xác thực"
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	backButton: {
		padding: 16, // p-4
	},
	content: {
		paddingHorizontal: 16, // px-4
		paddingVertical: 24, // py-6
	},
	footer: {
		marginBottom: 12, // mb-3
	},
});
