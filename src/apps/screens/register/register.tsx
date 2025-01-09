import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, FooterLink, InputPhoneNumber, TermsCheckBox, VerificationModal } from "../../components";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { ArrowBack } from "@/assets/svgs";


export const RegisterScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const [isTermsAccepted, setIsTermsAccepted] = useState(false);
	const [isSocialTermsAccepted, setIsSocialTermsAccepted] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [phone, setPhone] = useState("");
	const insets = useSafeAreaInsets();

	const { t } = useTranslation();

	const handlePress = () => {
		setIsModalVisible(true);
	};

	return (
		<SafeAreaView
			style={{ paddingTop: insets.top }}
			className="flex-1 bg-white"
		>
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
					<InputPhoneNumber
						numPhone={phone}
						onChangePhone={setPhone}
					/>
					<TermsCheckBox
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
					/>
					<Button
						title="Tiếp tục"
						disabled={!isTermsAccepted || !isSocialTermsAccepted}
						onPress={handlePress}
					/>
					<Text>{t("welcome")}</Text>
				</View>
				<View>
					<FooterLink
						text="Bạn đã có tài khoản? "
						textLink="Đăng nhập ngay"
					/>
				</View>

				<VerificationModal
					visible={isModalVisible}
					phoneNumber={"0" + phone}
					onContinue={() => {
						setIsModalVisible(false);
						navigation.navigate("OTP", { phone: "0" + phone });
					}}
					onChangeNumber={() => {
						setIsModalVisible(false);
					}}
					onClose={() => {
						setIsModalVisible(false);
					}}
				/>
			</View>
		</SafeAreaView>
	);
};
