import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleRecallMessage } from "@/apps/components/chatDetail/message-utils";
import { IDetailInformation, IMessage } from "@/types/implement";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import styles from "../styles";

interface Props {
	item: IMessage;
	myUserId: string | null;
	detailInformation: IDetailInformation | null;
	setActionMessage: (message: IMessage) => void;
	setShowActionModal: (show: boolean) => void;
	setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
	showUserInfo: (user: { name?: string; avatar?: string }) => void;
	setShowUserInfoModal: (show: boolean) => void;
	isDark: boolean;
}

const RenderMessageItem: React.FC<Props> = ({
	item,
	myUserId,
	detailInformation,
	setActionMessage,
	setShowActionModal,
	setMessages,
	showUserInfo,
	setShowUserInfoModal,
	isDark,
}) => {
	const isMyMessage = item.accountId === myUserId;

	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const renderFile = () => {
		const file = item.files;
		return file?.map((file, index) => {
			if (file.data.type.startsWith("image/")) {
				console.log("File is an image:", file.url);
				return (
					<TouchableOpacity
						key={index}
						onPress={() => {
							// openImageModal(
							// 	item.images ?? [],
							// 	index,
							// 	messages,
							// 	setAllImageUris,
							// 	setInitialImageIndex,
							// 	setCurrentImageIndex,
							// 	setShowImageModal,
							// );
						}}
					>
						<Image
							source={{
								uri: file.url,
							}}
							resizeMode={"cover"}
							style={{ width: 200, height: 200 }}
							width={300}
							height={300}
						/>
					</TouchableOpacity>
				);
			}
		});
	};
	const renderAvatar = () => {
		const account = selectedRoom?.detailRoom.find((account) => account.id === item.accountId);

		return (
			<Image
				source={account?.avatar ? { uri: account.avatar } : images.avatarDefault}
				style={styles.avatar}
			/>
		);
	};

	return (
		<View
			style={[
				styles.messageRow,
				{
					justifyContent: isMyMessage ? "flex-end" : "flex-start",
				},
			]}
		>
			{!isMyMessage && (
				<TouchableOpacity
					onPress={() =>
						showUserInfo({
							name: detailInformation?.fullName || "-",
							avatar: detailInformation?.avatarUrl,
						})
					}
				>
					{renderAvatar()}
				</TouchableOpacity>
			)}
			<TouchableOpacity
				onLongPress={() => {
					setActionMessage(item);
					setShowActionModal(true);
				}}
				onPress={() => handleRecallMessage(item?._id ?? "", isMyMessage, setMessages, setShowActionModal)}
				delayLongPress={1000}
				activeOpacity={0.8}
				style={[
					styles.messageContainer,
					isMyMessage ? styles.myMessage : styles.otherMessage,
					isDark && {
						backgroundColor: isMyMessage ? "#2563eb" : "#374151",
					},
				]}
			>
				{renderFile()}
				{item.sticker ? (
					<Image
						source={{ uri: item.sticker }}
						style={{ width: 100, height: 100, objectFit: "contain" }}
					/>
				) : (
					<>
						{item.isRevoked ? (
							<Text style={styles.senderName}>Tin nhắn đã thu hồi</Text>
						) : (
							<Text style={styles.senderName}>{item.content}</Text>
						)}
					</>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default RenderMessageItem;
