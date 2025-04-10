import { Header, InfoBox, OTPInput } from "@/apps/components/otp";
import { ArrowBack } from "@/assets/svgs";
import { OTPRouteProp, StackScreenNavigationProp } from "@/libs/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { fetchdata } from "../register/handle";
import { SafeAreaView } from "@/apps/components";
import { Button, FooterLink } from "@/apps/components/register";

export const OTPScreen = () => {
    const navigation = useNavigation<StackScreenNavigationProp>();
    const route = useRoute<OTPRouteProp>();

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRefs = Array(6)
        .fill(0)
        .map(() => React.createRef<HTMLInputElement>());

    const handleLogin = () => {
        fetchdata(setOtp);
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
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <ArrowBack color="#292d32" outline="#292d32" />
            </TouchableOpacity>
            <View style={styles.content}>
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
                />
                <InfoBox />
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