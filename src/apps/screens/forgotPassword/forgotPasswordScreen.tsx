import { ForgotPasswordScreen as ForgotPasswordComponent } from "./forgotPasswordScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export const ForgotPasswordScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ForgotPasswordComponent />
    </SafeAreaView>
  );
};
