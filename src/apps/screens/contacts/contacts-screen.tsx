import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	SectionList,
	TouchableOpacity,
	StyleSheet,
	RefreshControl,
	Image,
	FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "@/apps/components";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList, StackScreenNavigationProp } from "@/libs/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/libs/redux/redux.config";
import { IFriend } from "@/types/implement";
import { unFriend } from "@/services/friend";
import Toast from "react-native-toast-message";
import { ErrorResponse } from "@/libs/axios/axios.config";
import Delete from "@/assets/svgs/delete";

// // Phân nhóm liên hệ theo chữ cái đầu
// const groupContacts = (contacts: IFriend[]) => {
// 	const grouped = contacts.reduce((acc, contact) => {
// 		const firstLetter = contact.detail?.fullName?.charAt(0).toUpperCase() || "A";
// 		if (!acc[firstLetter]) acc[firstLetter] = [];
// 		acc[firstLetter].push(contact);
// 		return acc;
// 	}, {} as Record<string, IFriend[]>);

// 	return Object.entries(grouped).map(([title, data]) => ({
// 		title,
// 		data: data as IFriend[], // Explicitly type data as an array
// 	}));
// };

// const getRandomColor = (name: string) => {
// 	const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
// 	const index = name.charCodeAt(0) % colors.length;
// 	return colors[index];
// };

interface ContactItemProps {
	item: IFriend;
	onPress: (contact: IFriend) => void;
}

const ContactItem = ({ item, onPress }: ContactItemProps) => {
	const handleUnFriend = async () => {
		try {
			const response = await unFriend(item.friendId ?? "");
			if (response?.statusCode === 200) {
				Toast.show({
					type: "success",
					text1: "Thành công",
					text2: "Hủy kết bạn thành công",
				});
			}
		} catch (error) {
			const e = error as ErrorResponse;
			Toast.show({
				type: "error",
				text1: "Thất bại",
				text2: e.message,
			});
		}
	};

	return (
		<TouchableOpacity
			style={styles.contactItem}
			onPress={() => onPress(item)}
		>
			{/* <View style={[styles.avatar, { backgroundColor: getRandomColor(item.detail?.fullName ?? "-") }]}> */}
			{item.detail?.avatarUrl ? (
				<Image
					source={{ uri: item.detail?.avatarUrl }}
					style={styles.avatar}
					resizeMode="cover"
				/>
			) : (
				<Text style={styles.avatarText}>{(item.detail?.fullName ?? "-").charAt(0)}</Text>
			)}
			{/* </View> */}
			<View style={styles.contactInfo}>
				<Text style={styles.contactName}>{item.detail?.fullName}</Text>
				{/* <Text style={[styles.statusText, { color: item.online ? "green" : "gray" }]}>
        {item.online ? "Đang hoạt động" : "Ngoại tuyến"}
      </Text> */}
			</View>
			<View style={{ flex: 1, gap: 8, justifyContent: "flex-end", flexDirection: "row" }}>
				<TouchableOpacity onPress={handleUnFriend}>
					<Ionicons
						name="person-remove"
            size={20}
            color="gray"
            style={styles.icon}
					/>
				</TouchableOpacity>

				<Ionicons
					name="call"
					size={20}
					color="gray"
					style={styles.icon}
				/>
				<Ionicons
					name="videocam"
					size={20}
					color="gray"
					style={styles.icon}
				/>
			</View>
		</TouchableOpacity>
	);
};

export const ContactsScreen = () => {
	const navigator = useNavigation<StackScreenNavigationProp>();

	const { myListFriend } = useSelector((state: RootState) => state.myListFriend);

	useEffect(() => {
		console.log("myListFriend", myListFriend);
	}, [myListFriend]);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [refreshing, setRefreshing] = useState<boolean>(false);

	// const handleRefresh = useCallback(() => {
	// 	setRefreshing(true);
	// 	setTimeout(() => setRefreshing(false), 1000); // Mock fetch
	// }, []);

	const filtered = useMemo(() => {
		return myListFriend?.filter((contact) =>
			contact?.detail?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery]);

	const handleContactPress = (contact: any) => {
		// console.log("Contact selected:", contact);
		// Navigate to contact detail here
	};

	const handleRequestFriendPress = () => {
		navigator.navigate("RequestFriendScreen");
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.searchBar}>
					<Ionicons
						name="search"
						size={20}
						color="white"
						style={styles.icon}
					/>
					<TextInput
						style={styles.searchInput}
						placeholder="Tìm kiếm"
						placeholderTextColor="white"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					<Ionicons
						name="person-add"
						size={24}
						color="white"
						style={styles.icon}
					/>
				</View>

				<TouchableOpacity
					style={styles.contactItem}
					onPress={handleRequestFriendPress}
				>
					<Text style={{ color: "black", padding: 12, fontSize: 16 }}>Danh sách lời mời kết bạn</Text>
				</TouchableOpacity>

				<FlatList
					data={myListFriend}
					keyExtractor={(item) => item.friendId?.toString() || ""}
					renderItem={({ item }) => (
						<ContactItem
							item={item}
							onPress={handleContactPress}
						/>
					)}
				/>

				<SectionList
					sections={[]}
					data={myListFriend}
					keyExtractor={(item) => item.friendId?.toString() || ""}
					renderItem={({ item }) => (
						<ContactItem
							item={item}
							onPress={handleContactPress}
						/>
					)}
					// renderSectionHeader={({ section: { title } }) => (
					// 	<View style={styles.sectionHeader}>
					// 		<Text style={styles.sectionText}>{title}</Text>
					// 	</View>
					// )}
					// refreshControl={
					// 	<RefreshControl
					// 		refreshing={refreshing}
					// 		onRefresh={handleRefresh}
					// 	/>
					// }
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		width: "100%",
	},
	container: {
		flex: 1,
		width: "100%",
	},
	searchBar: {
		backgroundColor: "#3b82f6",
		padding: 12,
		flexDirection: "row",
		alignItems: "center",
	},
	searchInput: {
		flex: 1,
		color: "white",
		marginHorizontal: 8,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "#fff",
		borderRadius: 12,
		marginHorizontal: 8,
		marginVertical: 4,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 2,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
	},
	contactInfo: {
		marginLeft: 12,
		flex: 1,
	},
	contactName: {
		fontWeight: "600",
		color: "black",
	},
	statusText: {
		fontSize: 12,
		marginTop: 2,
	},
	icon: {
		marginHorizontal: 4,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: "gray",
	},
	sectionHeader: {
		backgroundColor: "#f3f4f6",
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	sectionText: {
		fontWeight: "bold",
		color: "#374151",
	},
});
