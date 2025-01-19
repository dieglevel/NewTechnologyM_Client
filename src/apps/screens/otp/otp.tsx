import { Button, FooterLink, Header, InfoBox, OTPInput, SafeAreaView } from "@/apps/components";
import { ArrowBack } from "@/assets/svgs";
import { OTPRouteProp, StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { fetchdata } from "../register/handle";

export const OTPScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const route = useRoute<OTPRouteProp>();

	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const inputRefs = Array(6)
		.fill(0)
		.map(() => React.createRef<HTMLInputElement>());

	const handleLogin = () => {
		fetchdata(setOtp);
	}

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
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				className="p-4"
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
