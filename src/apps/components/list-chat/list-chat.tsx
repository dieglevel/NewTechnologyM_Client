import { images } from "@/assets/images";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { RootState } from "@/libs/redux/redux.config";
import { getProfileFromAnotherUser } from "@/services/auth";
import { IDetailInformation, IRoom } from "@/types/implement";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";

interface IChatItem {
	item: IRoom;
}

const ChatItem = ({ item }: IChatItem) => {
	const navigation = useNavigation<StackScreenNavigationProp>();

	const [detailRoom, setDetailRoom] = useState<IDetailInformation>();

	useEffect(() => {
		const fetchDetailRoom = async () => {
			try {
				const response = await getProfileFromAnotherUser(item.lastMessage.accountId);
				if (response.statusCode === 200) {
					setDetailRoom(response.data ?? undefined);
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}
		};
		fetchDetailRoom();
	}, []);

	return (
		<TouchableOpacity
			style={styles.chatItemContainer}
			onPress={() => navigation.navigate("ChatScreen", { room: item })}
		>
			<View style={styles.avatarContainer}>
				<Image
					source={detailRoom?.avatarUrl ? { uri: detailRoom?.avatarUrl } : images.avatarDefault}
					style={styles.avatarContainer}
				/>
			</View>

			<View style={styles.chatContent}>
				<Text style={styles.chatName}>{item.name}</Text>
				<Text style={styles.chatMessage}>{item.lastMessage.content}</Text>
			</View>
			{/* <Text style={styles.chatTime}>{item.lastMessage. ?? ""}</Text> */}
		</TouchableOpacity>
	);
};

export const ListChat = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const { room } = useSelector((state: RootState) => state.room);

	const [searchText, setSearchText] = useState<string>("");

	// useEffect(() => {
	//     const fetchRoom = async () => {
	//         try{
	//             const reponse = await
	//         }
	//         catch (error) {

	//         }
	//     }
	// },[])

	// const [filteredData, setFilteredData] = useState<IChatItem[]>(rawChatData);

	// useEffect(() => {
	// 	const text = searchText.toLowerCase();
	// 	const filtered = rawChatData.filter(
	// 		(chat) => chat.item.name.toLowerCase().includes(text) || chat.item.message.toLowerCase().includes(text),
	// 	);
	// 	setFilteredData(filtered);
	// }, [searchText]);

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
				renderItem={({ item }) => <ChatItem item={item} />}
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
		borderRadius: 24,
		backgroundColor: "#ef4444",
		alignItems: "center",
		justifyContent: "center",
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
