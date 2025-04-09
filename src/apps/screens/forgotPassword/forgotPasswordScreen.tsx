// forgotPasswordScreen.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { ForgotPasswordComponent } from "./../../components/forgotPassword/ForgotPasswordComponent";

export const ForgotPasswordScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ForgotPasswordComponent />
    </SafeAreaView>
  );
};