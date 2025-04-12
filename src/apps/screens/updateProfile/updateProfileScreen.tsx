import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UpdateProfileComponent } from "../../components/updateProfile/updateProfileComponent";
import { RouteProp, useRoute } from "@react-navigation/native";
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
