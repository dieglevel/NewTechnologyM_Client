import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { UpdatePasswordComponent } from "../../components/updatePassword/UpdatePasswordComponent";
export const UpdatePasswordScreen = () => {
 return (
    <SafeAreaView style={{ flex: 1 }}>
      <UpdatePasswordComponent/>
    </SafeAreaView>
  );
};