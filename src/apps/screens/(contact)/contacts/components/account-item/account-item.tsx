import { RootState } from "@/libs/redux/redux.config";
import { ISearchAccount } from "@/types/implement/response";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { checkSendedFriend, handleSubmit } from "./handle";

interface AccountItemProps {
	data: ISearchAccount;
	onPress: (contact: ISearchAccount) => void;
}

export const AccountItem = ({ data, onPress }: AccountItemProps) => {
	const { sendedFriends } = useSelector((state: RootState) => state.sendedFriend);
	const { myListFriend } = useSelector((state: RootState) => state.myListFriend);



	return (
		<TouchableOpacity
			style={styles.contactItem}
			onPress={() => onPress(data)}
		>
			{data.detailInformation.avatarUrl ? (
				<Image
					source={{ uri: data.detailInformation.avatarUrl }}
					style={styles.avatar}
					resizeMode="cover"
				/>
			) : (
				<Text style={styles.avatarText}>{(data.detailInformation?.fullName ?? "-").charAt(0)}</Text>
			)}
			<View style={styles.contactInfo}>
				<Text style={styles.contactName}>{data.detailInformation?.fullName}</Text>
			</View>
			<View style={{ flex: 1, gap: 8, justifyContent: "flex-end", flexDirection: "row" }}>
				{!checkSendedFriend(sendedFriends, data, myListFriend) && (
					<TouchableOpacity onPress={() => handleSubmit(data)}>
						<Ionicons
							name="person-add"
							size={20}
							color="gray"
							style={styles.icon}
						/>
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity>
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
