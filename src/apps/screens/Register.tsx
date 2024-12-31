import React, { useState } from "react";
import { View, StatusBar, TouchableOpacity } from "react-native";
import InputPhoneNumber from "../components/InputPhoneNumber";
import TermsCheckbox from "../components/TermsCheckbox";
import Button from "../components/Button";
import FooterLink from "../components/FooterLink";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const Register = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSocialTermsAccepted, setIsSocialTermsAccepted] = useState(false);
  const insets = useSafeAreaInsets(); // Lấy thông tin vùng an toàn

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-white"
    >
      {/* Cấu hình StatusBar */}
      <View className="flex-1 p-4 justify-between">
        <View>
          <InputPhoneNumber />
          <TermsCheckbox
            text="Tôi đồng ý với các điều khoản sử dụng Zalo"
            isChecked={isTermsAccepted}
            onCheck={setIsTermsAccepted}
          />
          <TermsCheckbox
            text="Tôi đồng ý với điều khoản Mạng xã hội của Zalo"
            isChecked={isSocialTermsAccepted}
            onCheck={setIsSocialTermsAccepted}
          />
          <Button
            title="Tiếp tục"
            disabled={!isTermsAccepted || !isSocialTermsAccepted}
          />
        </View>
        <View>
          
          <FooterLink text="Bạn đã có tài khoản? Đăng nhập ngay" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
