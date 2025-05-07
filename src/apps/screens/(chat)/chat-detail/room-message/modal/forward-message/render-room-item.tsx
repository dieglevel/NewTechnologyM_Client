import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { IMessage, IRoom } from "@/types/implement";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles";
import { colors } from "@/constants";
import { useState } from "react";
import { handleForwardMessage } from "./handle";
import { images } from "@/assets/images";

interface Props {
	item: IRoom;

	actionMessage: IMessage | null;
	setActionMessageAction: React.Dispatch<React.SetStateAction<IMessage | null>>;

	setShowForwardModalAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RenderRoomItem = ({ item, setShowForwardModalAction, actionMessage, setActionMessageAction }: Props) => {
	const myUserId = ExpoSecureValueService.getUserId();

	const [isSubmit, setIsSubmit] = useState<boolean>(false);

	const renderAvatar = () => {
		if (item.type === "single") {
			const account = item.detailRoom?.find((detail) => detail.id !== myUserId);
			return (
				<Image
					source={account?.avatar ? { uri: account.avatar } : images.avatarDefault}
					style={{
						width: 48,
						height: 48,
						objectFit: "cover",
						borderRadius: 999,
						borderWidth: 2,
						borderColor: "#3b82f6",
					}}
				/>
			);
		} else {
			return (
				<Image
					source={item.avatar ? { uri: item.avatar } : images.group}
					style={[
						,
						{ width: 30, height: 30 },
						item.avatar && {
							width: 48,
							height: 48,
							objectFit: "cover",
							borderRadius: 999,
							borderWidth: 2,
							borderColor: "#3b82f6",
						},
					]}
				/>
			);
		}
	};

	const renderName = () => {
		if (item.type === "single") {
			const account = item.detailRoom?.find((detail) => detail.id !== myUserId);
			return account?.fullName || "Unknown User";
		} else {
			return item.name || "Group Chat";
		}
	};

	return (
		<TouchableOpacity
			style={styles.forwardRoomItem}
			disabled={isSubmit}
			onPress={async () => {
				setIsSubmit(true);
				try {
					await handleForwardMessage(actionMessage?._id || "", item.id);
					setShowForwardModalAction(false);
				} catch (error) {
					console.error("Lỗi khi chuyển tiếp tin nhắn:", error);
				} finally {
					setIsSubmit(false);
				}
			}}
		>
			<View
				style={{
					width: 48,
					height: 48,
					borderRadius: 999,
					alignItems: "center",
					justifyContent: "center",
					borderWidth: 2,
					borderColor: "#3b82f6",
				}}
			>
				{renderAvatar()}
			</View>
			<Text style={styles.forwardRoomName}>{renderName()}</Text>
			{isSubmit && (
				<ActivityIndicator
					size="small"
					color={colors.brand}
				/>
			)}
		</TouchableOpacity>
	);
};
