import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/constants";
import { FriendItem } from "../list-room/components/friend-item";
import { useAppSelector } from "@/libs/redux/redux.config";
import { createGroup } from "../list-room/handle";

export const CreateRoomScreen = () => {
	const navigation = useNavigation();
	const { myListFriend } = useAppSelector((state) => state.myListFriend);
	const [nameGroup, setNameGroup] = useState("");
	const [checked, setChecked] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const handleChecked = (accountId: string) => {
		setChecked((prev) =>
			prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
		);
	};

	const handlePressCreateGroup = async () => {
		try {
			await createGroup(nameGroup, checked);
			setNameGroup("");
			setChecked([]);
			setSearch("");
			navigation.goBack();
		} catch (error) {
			console.error("Error creating group:", error);
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
			<TextInput
				style={styles.input}
				placeholder="Nhập tên nhóm"
				value={nameGroup}
				onChangeText={setNameGroup}
			/>
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
						onChecked={(contact) => handleChecked(contact.accountId ?? "")}
					/>
				)}
			/>
			<TouchableOpacity
				style={styles.createBtn}
				onPress={handlePressCreateGroup}
			>
				<Text style={styles.createBtnText}>Tạo nhóm</Text>
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
