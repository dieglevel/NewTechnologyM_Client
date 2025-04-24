import { images } from "@/assets/images";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { setSelectedRoom } from "@/libs/redux";
import { RootState } from "@/libs/redux/redux.config";
import { getProfileFromAnotherUser } from "@/services/auth";
import { IDetailInformation, IRoom } from "@/types/implement";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface IChatItem {
	item: IRoom;
	myUserId: string;
}

const ChatItem = ({ item, myUserId }: IChatItem) => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const dispatch = useDispatch();

	const handlePress = () => {
		dispatch(setSelectedRoom(item));
		navigation.navigate("ChatScreen", { room: item });
	};

	const renderImage = () => {
		if (item.type === "single") {
			const account = item.detailRoom.find((detail) => {
				return detail.id !== myUserId;
			});


			return (
				<Image
					source={account?.avatar ? { uri: account?.avatar } : images.avatarDefault}
					style={styles.avatarContainer}
				/>
			);
		} else {
			return (
				<Image
					source={item.avatar ? { uri: item?.avatar } : images.group}
					style={[, { width: 30, height: 30 }]}
				/>
			);
		}
	};

	return (
		<TouchableOpacity
			style={styles.chatItemContainer}
			onPress={handlePress}
		>
			<View style={styles.avatarContainer}>{renderImage()}</View>

			<View style={styles.chatContent}>
				<Text style={styles.chatName}>{item.name}</Text>
				<Text style={styles.chatMessage}>{item.latestMessage ? item.latestMessage.content : ""}</Text>
			</View>
			{/* <Text style={styles.chatTime}>{item.lastMessage. ?? ""}</Text> */}
		</TouchableOpacity>
	);
};

export const ListChat = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const { room } = useSelector((state: RootState) => state.room);

	const [searchText, setSearchText] = useState<string>("");
	const [myUserId, setMyUserId] = useState<string>("");

	useEffect(() => {
		const getMyId = async () => {
			const value = await getSecure(ExpoSecureStoreKeys.UserId);
			setMyUserId(value ?? "");
			return;
		};
		getMyId();
	}, []);
	return (
		<View style={styles.container}>
			<View style={styles.searchBar}>
				<Ionicons
					name="search"
					size={20}
					color="black"
					style={styles.icon}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="Tìm kiếm"
					placeholderTextColor="black"
					value={searchText}
					onChangeText={setSearchText}
				/>
				<Ionicons
					name="qr-code"
					size={20}
					color="black"
					style={styles.icon}
					onPress={() => navigation.push("Qr")}
				/>
				<Ionicons
					name="add"
					size={24}
					color="black"
					style={styles.icon}
				/>
			</View>

			<FlatList
				data={room}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ChatItem
						item={item}
						myUserId={myUserId}
					/>
				)}
				style={styles.chatList}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#3b82f6",
		padding: 8,
		borderRadius: 8,
		width: "100%",
	},
	icon: {
		marginHorizontal: 8,
	},
	searchInput: {
		flex: 1,
		color: "black",
		fontSize: 16,
	},
	chatList: {
		flex: 1,
		backgroundColor: "#f3f4f6",
		width: "100%",
	},
	chatItemContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
	},
	avatarContainer: {
		width: 48,
		height: 48,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,	
		borderColor: "#3b82f6",
	},
	avatarText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	chatContent: {
		marginLeft: 12,
		flex: 1,
	},
	chatName: {
		fontWeight: "600",
		color: "black",
	},
	chatMessage: {
		color: "#6b7280",
		fontSize: 14,
	},
	chatTime: {
		color: "#9ca3af",
		fontSize: 12,
	},
});

export default ListChat;
