import { images } from "@/assets/images";
import { colors } from "@/constants";
import { IFriend } from "@/types/implement";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ContactItemProps {
	item: IFriend;
	checked: string[];
	onChecked?: (contact: IFriend) => void;
	isDisabled?: boolean;
}

export const FriendItem = ({ item, checked, onChecked, isDisabled }: ContactItemProps) => {
	return (
		<TouchableOpacity
			style={styles.contactItem}
			onPress={() => {
				if (onChecked) {
					onChecked(item);
				}
			}}
			disabled={isDisabled}
		>
			{/* <View style={[styles.avatar, { backgroundColor: getRandomColor(item.detail?.fullName ?? "-") }]}> */}

			<Image
				source={item.detail?.avatarUrl ? { uri: item.detail?.avatarUrl } : images.avatarDefault}
				style={styles.avatar}
				resizeMode="cover"
			/>
			{/* </View> */}
			<View style={styles.contactInfo}>
				<Text style={styles.contactName}>{item.detail?.fullName}</Text>
			</View>
			<View style={{ marginLeft: 10 }}>
				<View
					style={{
						width: 15,
						height: 15,
						borderRadius: 10,
						borderWidth: 0.5,
						borderColor: checked.includes(item.accountId ?? "") ? colors.brand : "#9ca3af",
						backgroundColor: isDisabled ? "gray" : checked.includes(item.accountId ?? "") ? colors.brand : "white",
					}}
				/>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	contactItem: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
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
});
