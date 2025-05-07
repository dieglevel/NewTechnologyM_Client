import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import RenderActionItem from "./render-action-item";
import { IMessage } from "@/types/implement";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { copyMessage, handleRevokeMessage } from "./handle";
import { useAppSelector } from "@/libs/redux/redux.config";
import Toast from "react-native-toast-message";
import { ForwardMessageModal } from "./forward-message/forward-message-modal";
import { useState } from "react";

interface Props {
	showActionModal: boolean;
	setShowActionModalAction: React.Dispatch<React.SetStateAction<boolean>>;

	actionMessage: IMessage | null;
	setActionMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
}

export const ActionModalMessage = ({
	showActionModal,
	setShowActionModalAction,
	actionMessage,
	setActionMessage,
}: Props) => {
	const myUserId = ExpoSecureValueService.getUserId();

	const { room } = useAppSelector((state) => state.room);

	const [showForwardModal, setShowForwardModal] = useState<boolean>(false);

	const getActionItems = () => {
		if (!actionMessage) return [];

		const isMyMessage = actionMessage.accountId === myUserId;
		const items: { icon: string; label: string; onPress: () => void }[] = [];

		!actionMessage.isRevoked &&
			!actionMessage.sticker &&
			items.push({
				icon: "copy-outline",
				label: "Sao chép",
				onPress: () => {
					copyMessage(actionMessage);
					setShowActionModalAction(false);
				},
			});

		!actionMessage.isRevoked &&
			items.push({
				icon: "share-outline",
				label: "Chuyển tiếp",
				onPress: () => {
					if (room?.length === 0) {
						Toast.show({
							text1: "Không có phòng nào để chọn",
							type: "info",
						});
					} else {
						setShowForwardModal(true);
						setShowActionModalAction(false);
					}
				},
			});

		!actionMessage.isRevoked &&
			isMyMessage &&
			items.push({
				icon: "trash-outline",
				label: "Thu hồi",
				onPress: () => {
					try {
						handleRevokeMessage(actionMessage);
						setShowActionModalAction(false);
					} catch (e) {}
				},
			});

		// if (isMyMessage && actionMessage.content !== "Tin nhắn đã được thu hồi") {
		// 	items.push(
		// 		{
		// 			icon: "pencil-outline",
		// 			label: "Chỉnh sửa",
		// 			onPress: () =>
		// 				handleEditMessage(
		// 					actionMessage._id || "",
		// 					actionMessage.content || "",
		// 					setEditingMessageId,
		// 					setShowActionModal,
		// 				),
		// 		},
		// 		{
		// 			icon: "trash-outline",
		// 			label: "Thu hồi",
		// 			onPress: () =>
		// 				handleRecallMessage(
		// 					actionMessage._id || "",
		// 					isMyMessage,
		// 					setMessages,
		// 					setShowActionModal,
		// 				),
		// 		},
		// 	);
		// }

		return items;
	};

	const isDark = false;
	return (
		<>
			<Modal
				visible={showActionModal}
				transparent
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.actionModalContainer}
					onPress={() => setShowActionModalAction(false)}
				>
					<View style={[styles.actionModalContent, isDark && styles.darkActionModalContent]}>
						<FlatList
							data={getActionItems()}
							renderItem={({ item }) => <RenderActionItem item={item} />}
							keyExtractor={(item, index) => index.toString()}
							contentContainerStyle={styles.actionListContent}
						/>
					</View>
				</TouchableOpacity>
				<Toast />
			</Modal>

			<ForwardMessageModal
				actionMessage={actionMessage}
				setActionMessageAction={setActionMessage}
				setShowForwardModalAction={setShowForwardModal}
				showForwardModal={showForwardModal}
			/>
		</>
	);
};
