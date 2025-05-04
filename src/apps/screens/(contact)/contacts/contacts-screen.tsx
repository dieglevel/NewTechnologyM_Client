import { SafeAreaView } from "@/apps/components";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { initMyListFriend, initRequestFriend, initSendedFriend } from "@/libs/redux";
import { RootState, store } from "@/libs/redux/redux.config";
import { findAccount } from "@/services/auth";
import { getListFriend, getListResponseFriend, getListSended } from "@/services/friend";
import { ISearchAccount } from "@/types/implement/response";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { AccountItem } from "./components/account-item/account-item";
import { ContactItem } from "./components/contact-item/contact-item";

export const ContactsScreen = () => {
	const navigator = useNavigation<StackScreenNavigationProp>();

	const { myListFriend } = useSelector((state: RootState) => state.myListFriend);
	

	const [search, setSearch] = useState<string>("");
	const [searchResult, setSearchResult] = useState<ISearchAccount[]>([]);

	const isFocused = useIsFocused();

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await getListFriend();
				if (response?.statusCode === 200) {
					// console.log("response: ", response.data);
					store.dispatch(initMyListFriend(response?.data || []));
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}

			try {
				const response = await getListResponseFriend();
				if (response?.statusCode === 200) {
					// console.log("response: ", response.data);
					store.dispatch(initRequestFriend(response.data || []));
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}

			try {
				const response = await getListSended();
				if (response?.statusCode === 200) {
					// console.log("response: ", response.data);
					store.dispatch(initSendedFriend(response.data || []));
				}
			} catch (error) {
				const e = error as ErrorResponse;
			}
		};

		fetch();
	}, [isFocused]);

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await findAccount(search);
				if (response.statusCode === 200) {
					setSearchResult(response.data || []);
				}
			} catch (error) {
				const e = error as ErrorResponse;
				// console.log("error: ", e.message);
			}
		};

		const timeoutId = setTimeout(() => {
			if (search) {
				fetch();
			} else {
				setSearchResult([]);
			}
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [search]);


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
						value={search}
						onChangeText={setSearch}
					/>
					<Ionicons
						name="person-add"
						size={24}
						color="white"
						style={styles.icon}
					/>
				</View>

				<FlatList
					data={searchResult}
					style={{ display: search.length > 0 ? "flex" : "none" }}
					keyExtractor={(item) => item.id?.toString() || ""}
					renderItem={({ item }) => (
						<AccountItem
							data={item}
							onPress={handleContactPress}
						/>
					)}
				/>

				<View style={{ flex: 1, display: searchResult.length > 0 ? "none" : "flex" }}>
					<TouchableOpacity
						style={styles.contactItem}
						onPress={handleRequestFriendPress}
					>
						<Text style={{ color: "black", padding: 12, fontSize: 16 }}>
							Danh sách lời mời kết bạn
						</Text>
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
				</View>
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
