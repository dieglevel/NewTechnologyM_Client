import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/redux.config";
import { FriendItem } from "./friend-item";
import { use } from "i18next";
import { addMemberToRoom } from "@/services";
import Toast from "react-native-toast-message";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { setSelectedRoom } from "@/libs/redux";
import { IDetailAccountRoom, IRoom } from "@/types/implement";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";

export const FriendAction = () => {
	const navigation = useNavigation();
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const [myUserId, setMyUserId] = useState<string | null>(null);

	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchUserId = async () => {
			const userId = ExpoSecureValueService.getUserId();
			setMyUserId(userId);
		};
		fetchUserId();
	}, []);

	// Filter friends by search text
	const filteredFriends = () => {
		if (selectedRoom?.detailRoom) {
			return selectedRoom.detailRoom.filter((friend: IDetailAccountRoom) => {
				const fullName = friend.fullName?.toLowerCase() || "";
				const searchText = search.toLowerCase();
				return fullName.includes(searchText);
			});
		}
		return [];
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Tìm kiếm bạn bè"
				value={search}
				onChangeText={setSearch}
			/>
			<FlatList
				data={filteredFriends()}
				keyExtractor={(item) => item.id?.toString() || ""}
				style={{ width: "100%" }}
				renderItem={({ item }) => <FriendItem myUserId={myUserId} item={item} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		width: "100%",
		height: 50,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 10,
		paddingHorizontal: 10,
		marginBottom: 10,
	},
	createBtn: {
		width: "100%",
		height: 50,
		backgroundColor: colors.brand,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	createBtnText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});
