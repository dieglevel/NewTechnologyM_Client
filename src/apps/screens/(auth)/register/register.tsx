import { ArrowBack } from "@/assets/svgs";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "@/apps/components";
import i18n from "@/libs/language/i8next.config";
import { Button, FooterLink, InputPhoneNumber, TermsCheckBox, VerificationModal } from "@/apps/components/register";

export const RegisterScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
	const [isSocialTermsAccepted, setIsSocialTermsAccepted] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [phone, setPhone] = useState<string>("");

	const { t } = useTranslation();
	const handleChangeLanguage = () => {
		i18n.changeLanguage(i18n.language === "en" ? "vi" : "en");
	};

	const handlePress = () => {
		setIsModalVisible(true);
	};

	return (
		<SafeAreaView>
			<View className="flex-1 w-full">
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
					<View className="flex-1">
						<InputPhoneNumber
							numPhone={phone}
							onChangePhone={setPhone}
						/>
						<TermsCheckBox
							text={t("Tôi đồng ý với các") + " "}
							textLink={t("điều khoản sử dụng Zalo")}
							isChecked={isTermsAccepted}
							onCheck={setIsTermsAccepted}
						/>
						<TermsCheckBox
							text={t("Tôi đồng ý với") + " "}
							textLink={t("điều khoản Mạng xã hội của Zalo")}
							isChecked={isSocialTermsAccepted}
							onCheck={setIsSocialTermsAccepted}
						/>
						<Button
							title="Tiếp tục"
							disabled={!isTermsAccepted || !isSocialTermsAccepted}
							onPress={handlePress}
						/>
						<Button
							title="Change Language"
							onPress={handleChangeLanguage}
						/>
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
			</View>
		</SafeAreaView>
	);
};
