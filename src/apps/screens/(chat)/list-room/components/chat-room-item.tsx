import { StackScreenNavigationProp } from "@/libs/navigation";
import { setSelectedRoom } from "@/libs/redux";
import { IRoom } from "@/types/implement";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { images } from "@/assets/images";
import { caculateDuration } from "@/utils/caculate-duration";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface IChatItem {
	item: IRoom;
	myUserId: string | null;
}

export const ChatItem = ({ item, myUserId }: IChatItem) => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const dispatch = useDispatch();
	const route = useRoute<any>();

	const handlePress = () => {
		dispatch(setSelectedRoom(item));
		navigation.navigate("ChatScreen", { room: item });
	};

	const renderAvatar = () => {
		if (item.type === "single") {
			const account = item.detailRoom?.find((detail) => {
				return detail.id !== myUserId;
			});

			return (
				<Image
					source={account?.avatar ? { uri: account?.avatar } : images.avatarDefault}
					style={styles.avatar}
				/>
			);
		} else {
			return (
				<>
					{item.avatar ? (
						<Image
							source={{ uri: item.avatar }}
							style={styles.avatar}
						/>
					) : (
						<View style={{}}>
							<MaterialIcons name="group" size={24} color="#6b7280" />
						</View>
					)}
				</>
			);
		}
	};

	const renderName = () => {
		if (item.type === "single") {
			const account = item.detailRoom?.find((detail) => {
				return detail.id !== myUserId;
			});
			return account?.fullName || "Unknown User";
		} else {
			return item.name || "Group Chat";
		}
	};

	const renderMessage = () => {
		if (item.isDisbanded === true) {
			return "Nhóm đã bị giải tán";
		}

		const message = () => {
			if (item.latestMessage?.isRevoked) {
				return "Đã thu hồi tin nhắn";
			}
			if (item.latestMessage?.sticker) {
				return "Đã gửi một nhãn dán";
			}
			if (item.latestMessage?.content) {
				return item.latestMessage.content;
			}
			if (item.latestMessage?.files) {
				return "Đã gửi tệp";
			}
			return null;
		};

		const accountMessage = item.latestMessage?.accountId;

		const account = item.detailRoom?.find((detail) => {
			return detail.id === accountMessage;
		});

		return message() !== null
			? account
				? account?.fullName + ": " + message()
				: "Bạn: " + message()
			: "Chưa có tin nhắn";
	};

	return (
		<TouchableOpacity
			style={styles.chatItemContainer}
			onPress={handlePress}
		>
			<View style={styles.avatarContainer}>{renderAvatar()}</View>
			<View style={styles.chatContent}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text style={styles.chatName}>{renderName()}</Text>
					<Text style={styles.chatTime}>{caculateDuration(item.updatedAt || null)}</Text>
				</View>
				<Text style={styles.chatMessage}>{renderMessage()}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	chatItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "white",
	},
	avatarContainer: {
		backgroundColor: "#f4f4f4",
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 9999,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	chatContent: {
		marginLeft: 12,
		flex: 1,
	},
	chatName: {
		fontWeight: "600",
		color: "black",
		fontSize: 16,
	},
	chatMessage: {
		color: "#6b7280",
		fontSize: 14,
	},
	avatar: {
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 999,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	chatTime: {
		color: "#9ca3af",
		fontSize: 12,
	},
});
