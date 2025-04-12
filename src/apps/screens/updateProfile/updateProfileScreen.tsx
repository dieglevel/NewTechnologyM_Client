import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import { UpdateProfileComponent } from "@/apps/components/updateProfile/UpdateProfileComponent.tsx";


export const UpdateProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UpdateProfileComponent/>
    </SafeAreaView>
  );
};