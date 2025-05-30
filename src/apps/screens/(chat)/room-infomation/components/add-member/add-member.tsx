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

export const AddMember = () => {
	const navigation = useNavigation();
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);
	const { room } = useAppSelector((state) => state.room);

	const dispatch = useAppDispatch();

	const { myListFriend } = useAppSelector((state) => state.myListFriend);
	const [checked, setChecked] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const handleChecked = (accountId: string) => {
		setChecked((prev) =>
			prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
		);
	};

	useEffect(() => {
		if (selectedRoom && selectedRoom.detailRoom) {
			setChecked(selectedRoom.detailRoom?.map((member) => member.id || ""));
		}
	}, [selectedRoom]);

	const handlePressCreateGroup = async () => {
		try {
			// create array of checked members no have selectedRoom.detailRoom.id
			const checkedSet = new Set(checked);
			if (selectedRoom && selectedRoom.detailRoom) {
				selectedRoom.detailRoom.forEach((member) => {
					checkedSet.delete(member.id || "");
				});
			}

			const response = await addMemberToRoom({
				roomId: selectedRoom?.id || "",
				accountIds: Array.from(checkedSet),
			});
			if (response && response.statusCode === 200) {
				if (selectedRoom && myListFriend) {
					const roomDetail: IDetailAccountRoom[] = selectedRoom.detailRoom || [];

					const addMemberToRoom: IDetailAccountRoom[] = myListFriend
						.filter((item) => checkedSet.has(item.accountId || ""))
						.map((item) => ({
							id: item.accountId || "",
							fullName: item.detail?.fullName || "",
							avatar: item.detail?.avatarUrl || "",
							role: "noob", // Assuming new members are added as 'noob'
						}));

					const updatedRoom: IRoom = {
						...selectedRoom,
						detailRoom: [...roomDetail, ...addMemberToRoom],
					};

					dispatch(setSelectedRoom(updatedRoom));
					setChecked([]);
					setSearch("");
					Toast.show({
						type: "success",
						text1: "Thêm thành viên thành công",
					});

					navigation.goBack();
				}
			}
		} catch (error) {
			const e = error as ErrorResponse;
			console.error("Error creating group:", error);
			Toast.show({
				type: "error",
				text1: e.message,
			});
		}
	};

	// Filter friends by search text
	const filteredFriends = () => {
		if (myListFriend === null) {
			return [];
		} else {
			return myListFriend.filter((item) =>
				item.detail?.fullName?.toLowerCase().includes(search.toLowerCase()),
			);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={{ alignSelf: "flex-start", marginBottom: 5, fontWeight: "bold", fontSize: 16 }}>
				Thêm thành viên
			</Text>
			<TextInput
				style={styles.input}
				placeholder="Tìm kiếm bạn bè"
				value={search}
				onChangeText={setSearch}
			/>
			<FlatList
				data={filteredFriends()}
				keyExtractor={(item) => item.accountId?.toString() || ""}
				style={{ width: "100%" }}
				renderItem={({ item }) => (
					<FriendItem
						item={item}
						checked={checked}
						isDisabled={selectedRoom?.detailRoom?.some((member) => member.id === item.accountId)}
						onChecked={(contact) => handleChecked(contact.accountId ?? "")}
					/>
				)}
			/>
			<TouchableOpacity
				style={styles.createBtn}
				onPress={handlePressCreateGroup}
			>
				<Text style={styles.createBtnText}>Thêm</Text>
			</TouchableOpacity>
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
