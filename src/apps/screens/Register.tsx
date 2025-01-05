import React, { useState } from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, FooterLink, InputPhoneNumber, TermsCheckBox } from "../components";

export const RegisterScreen = () => {
	const [isTermsAccepted, setIsTermsAccepted] = useState(false);
	const [isSocialTermsAccepted, setIsSocialTermsAccepted] = useState(false);
	const insets = useSafeAreaInsets(); // Lấy thông tin vùng an toàn

	const { t } = useTranslation();

	const handlePress = () => {};

	return (
		<SafeAreaView
			style={{ paddingTop: insets.top }}
			className="flex-1 bg-white"
		>
			{/* Cấu hình StatusBar */}
			<View className="flex-1 p-4 justify-between">
				<View>
					<InputPhoneNumber/>
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
					/>
					<Text>{t("welcome")}</Text>
				</View>
				<View>
					<FooterLink text="Bạn đã có tài khoản? " textLink="Đăng nhập ngay" />
				</View>
			</View>
		</SafeAreaView>
	);
};
