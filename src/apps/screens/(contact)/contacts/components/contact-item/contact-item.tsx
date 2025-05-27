import { ErrorResponse } from "@/libs/axios/axios.config";
import { unFriend } from "@/services";
import { IFriend } from "@/types/implement";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { handleUnFriend } from "./handle";

interface ContactItemProps {
	item: IFriend;
	onPress: (contact: IFriend) => void;
}

export const ContactItem = ({ item, onPress }: ContactItemProps) => {
	return (
		<View style={styles.contactItem}>
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
			</View>
			<View style={{ flex: 1, gap: 8, justifyContent: "flex-end", flexDirection: "row" }}>
				<TouchableOpacity onPress={() => handleUnFriend(item)}>
					<Ionicons
						name="person-remove-outline"
						size={17}
						color="gray"
						style={styles.icon}
					/>
				</TouchableOpacity>
				<TouchableOpacity
				//  onPress={() => handleUnFriend(item)}
				>
					<Ionicons
						name="call-outline"
						size={17}
						color="gray"
						style={styles.icon}
					/>
				</TouchableOpacity>
				<TouchableOpacity
				// onPress={() => handleUnFriend(item)}
				>
					<Ionicons
						name="videocam-outline"
						size={17}
						color="gray"
						style={styles.icon}
					/>
				</TouchableOpacity>
			</View>
		</View>
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
