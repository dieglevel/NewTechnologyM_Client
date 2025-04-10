import { ArrowBack } from "@/assets/svgs";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet,  TextInput,  View } from "react-native";

import { Button, FooterLink, InputPhoneNumber, TermsCheckBox, VerificationModal } from "@/apps/components/register";

export const RegisterScreen = () => {
    const navigation = useNavigation<StackScreenNavigationProp>();

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [identifier, setIdentifier] = useState<string>("213123123");

    const { t } = useTranslation();

    const handlePress = () => {
        setIsModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <ArrowBack
                    color="#292d32"
                    outline="#292d32"
                />
            </TouchableOpacity> */}
            <View style={styles.content}>
                <View>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 16,
                        }}

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white", // bg-white
        width: "100%", // w-full
    },
    backButton: {
        padding: 16, // p-4
    },
    content: {
        flex: 1,
        padding: 16, // p-4
        justifyContent: "space-between", // justify-between
    },
});