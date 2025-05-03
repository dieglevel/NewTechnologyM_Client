import { UpdatePasswordComponent } from "@/apps/components/updatePassword/UpdatePasswordComponent";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
export const UpdatePasswordScreen = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<UpdatePasswordComponent />
		</SafeAreaView>
	);
};
