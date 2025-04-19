import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchHeader, UserInfo } from "@/apps/components/user-tab";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { SafeAreaView } from "@/apps/components";
import { colors } from "@/constants";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { deleteItemAsync } from "expo-secure-store";
import { api } from "@/libs/axios/axios.config";
import { socketService } from "@/libs/socket/socket";
import { detailInformationStorage, requestFriendStorage, sendedFriendStorage } from "@/libs/mmkv/mmkv";

export const UserScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const handleLogout = async () => {
		deleteItemAsync(ExpoSecureStoreKeys.AccessToken);
		deleteItemAsync(ExpoSecureStoreKeys.IpDevice);
		api.defaults.headers.common["Authorization"] = undefined;
		api.defaults.headers.common["ip-device"] = undefined;

		socketService.disconnect();
		detailInformationStorage.clearAll();

		navigation.reset({routes: [{ name: "Login" }]});
	}

	const handleResetMMKV = async () => {
		detailInformationStorage.clearAll();
		sendedFriendStorage.clearAll();
		requestFriendStorage.clearAll();
		sendedFriendStorage.clearAll();
		alert("MMKV has been reset.");
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, width: "100%" }}>
				<SearchHeader />
				<UserInfo />
				<TouchableOpacity onPress={handleLogout}>
					<View style={{ padding: 8, backgroundColor: colors.brand, borderRadius: 10, margin: 10 }}>
						<Text
							style={{
								color: colors.background,
								fontWeight: "bold",
								textAlign: "center",
								fontSize: 20,
							}}
						>
							Đăng xuất
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleResetMMKV}>
					<View style={{ padding: 8, backgroundColor: colors.brand, borderRadius: 10, margin: 10 }}>
						<Text
							style={{
								color: colors.background,
								fontWeight: "bold",
								textAlign: "center",
								fontSize: 20,
							}}
						>
							Reset MMKV
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};
