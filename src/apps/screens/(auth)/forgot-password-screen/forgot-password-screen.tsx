import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { ForgotPasswordComponent } from "@/apps/components/forgotPassword/forgot-password";
 

export const ForgotPasswordScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ForgotPasswordComponent />
    </SafeAreaView>
  );
};
