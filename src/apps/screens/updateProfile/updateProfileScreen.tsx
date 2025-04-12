import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import { UpdateProfileComponent } from "@/apps/components/updateProfile/UpdateProfileComponent.tsx";
type RootStackParamList = {
  UpdateProfileScreen: {
    user: {
      name: string;
      dob: string;
      gender: "Nam" | "Nữ";
      mainAvatar: string;
    };
  };
};

type UpdateProfileScreenRouteProp = RouteProp<RootStackParamList, "UpdateProfileScreen">;

export const UpdateProfileScreen = () => {
  const route = useRoute<UpdateProfileScreenRouteProp>();
  const { user } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UpdateProfileComponent user={user} />
    </SafeAreaView>
  );
};