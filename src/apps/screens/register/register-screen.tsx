import { ArrowBack } from "@/assets/svgs";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

import { Button, FooterLink, InputPhoneNumber, TermsCheckBox, VerificationModal } from "@/apps/components/register";
import { SafeAreaView } from "@/apps/components";

export const RegisterScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	// const [isTermsAccepted, setIsTermsAccepted] = useState(false);
	// const [isSocialTermsAccepted, setIsSocialTermsAccepted] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [identifier, setIdentifier] = useState<string>("");

	const { t } = useTranslation();

	const handlePress = () => {
		setIsModalVisible(true);
	};

	return (
		<SafeAreaView style={{}}>
			<View className="flex-1 bg-white w-full">
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					className="p-4"
				>
					<ArrowBack
						color="#292d32"
						outline="#292d32"
					/>
				</TouchableOpacity>
				<View className="flex-1 p-4 justify-between">
					<View>
						<TextInput
						 
							value={identifier}
							onChangeText={setIdentifier}
						/>
						{/* <TermsCheckBox
							text="Tôi đồng ý với các "
							textLink="điều khoản sử dụng Zalo"
							isChecked={isTermsAccepted}
							onCheck={setIsTermsAccepted}
						/>
						<TermsCheckBox
							text="Tôi đồng ý với "
							textLink="điều khoản Mạng xã hội của Zalo"
							isChecked={isSocialTermsAccepted}
							onCheck={setIsSocialTermsAccepted}
						/> */}
						<Button
							title="Đăng ký"
							// disabled={!isTermsAccepted || !isSocialTermsAccepted}
							onPress={handlePress}
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
		</SafeAreaView>
	);
};
