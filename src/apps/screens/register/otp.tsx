import React, { useState } from "react";
import { View, SafeAreaView, TouchableOpacity } from "react-native";
import { ActionButtons, Button, FooterLink, Header, InfoBox, OTPInput } from "../../components";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/src/libs/navigation";
import { ArrowBack } from "@/src/assets/svgs";

export const OTPScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const route = useRoute<RouteProp<{ phoneNumber: { phone: string } }, "phoneNumber">>();

	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const inputRefs = Array(6)
		.fill(0)
		.map(() => React.createRef<HTMLInputElement>());

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
		<SafeAreaView className="flex-1 bg-white justify-between">
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				className="p-4 mt-8"
			>
				<ArrowBack
					color="#292d32"
					outline="#292d32"
				/>
			</TouchableOpacity>
			<View className="px-4 py-6">
				<Header textPhone={route.params?.phone} />
				<OTPInput
					otp={otp}
					inputRefs={inputRefs}
					handleOtpChange={handleOtpChange}
				/>
				<Button
					title="Tiếp tục"
					disabled={otp.includes("")}
					onPress={() => {}}
				></Button>
				<InfoBox />
			</View>
			<View className="mb-3">
				<FooterLink
					text=""
					textLink="Tôi cần hỗ trợ thêm về mã xác thực"
				/>
			</View>
		</SafeAreaView>
	);
};
