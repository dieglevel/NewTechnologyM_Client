import { images } from "@/assets/images";
import { colors } from "@/constants";
import { useAppSelector } from "@/libs/redux/redux.config";
import { IDetailAccountRoom, IFriend } from "@/types/implement";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ContactItemProps {
	item: IDetailAccountRoom;
	myUserId?: string | null;
}

export const FriendItem = ({ item, myUserId }: ContactItemProps) => {
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const renderRole = (role: "admin" | "subadmin" | "noob" | null | undefined) => {
		if (!role) return "Khách";
		switch (role) {
			case "admin":
				return "Trưởng nhóm";
			case "subadmin":
				return "Phó nhóm";
			default:
				return "Thành viên";
		}
	};
	return (
		<View style={styles.contactItem}>
			<Image
				source={item.avatar ? { uri: item.avatar } : images.avatarDefault}
				style={styles.avatar}
				resizeMode="cover"
			/>
			{/* </View> */}
			<View style={styles.contactInfo}>
				<Text style={styles.contactName}>{item.fullName}</Text>
				<Text style={styles.role}>{renderRole(item.role)}</Text>
			</View>
			<TouchableOpacity
				style={{
					backgroundColor: colors.brand,
					padding: 8,
					borderRadius: 4,
				}}
				onPress={() => {
					if (myUserId && selectedRoom) {
						// Add logic to handle friend action, e.g., add to room
						console.log(`Adding ${item.fullName} to room ${selectedRoom.id}`);
					}
				}}
			>
				<Text style={{ color: "white" }}>Thêm</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	contactItem: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderTopWidth: 1,
		borderTopColor: "#e5e7eb",
	},
	avatar: {
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 999,
		borderWidth: 2,
		borderColor: "#3b82f6",
	},
	contactInfo: {
		marginLeft: 12,
		flex: 1,
	},
	contactName: {
		fontWeight: "600",
		color: "black",
	},
	role: {
		fontSize: 12,
		color: "#6b7280",
	},
});
