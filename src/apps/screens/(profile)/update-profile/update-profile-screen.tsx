import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UpdateProfileComponent } from "@/apps/components/updateProfile/update-profile-component";


export const UpdateProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UpdateProfileComponent/>
    </SafeAreaView>
  );
};