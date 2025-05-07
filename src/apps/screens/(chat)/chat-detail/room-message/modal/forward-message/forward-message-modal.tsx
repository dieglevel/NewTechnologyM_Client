import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles";
import { useAppSelector } from "@/libs/redux/redux.config";
import { colors } from "@/constants";
import { RenderRoomItem } from "./render-room-item";
import { IMessage } from "@/types/implement";

interface Props {
	showForwardModal: boolean;
	setShowForwardModalAction: React.Dispatch<React.SetStateAction<boolean>>;

	actionMessage: IMessage | null;
	setActionMessageAction: React.Dispatch<React.SetStateAction<IMessage | null>>;
}

export const ForwardMessageModal = ({
	showForwardModal,
	setShowForwardModalAction,
	actionMessage,
	setActionMessageAction,
}: Props) => {
	const { room } = useAppSelector((state) => state.room);

	const isDark = false;
	return (
		<Modal
			visible={showForwardModal}
			transparent
			animationType="fade"
		>
			<TouchableOpacity
				style={styles.forwardModalContainer}
				onPress={() => setShowForwardModalAction(false)}
			>
				<View style={[styles.forwardModalContent, isDark && styles.darkForwardModalContent]}>
					<Text style={[styles.forwardModalTitle, isDark && styles.darkForwardModalTitle]}>
						Chọn cuộc trò chuyện
					</Text>
					{!(room && room.length > 0) ? (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
							<ActivityIndicator
								size="large"
								color={colors.brand}
							/>
						</View>
					) : room?.length === 0 ? (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
							<Text style={[styles.noRoomsText, isDark && styles.darkNoRoomsText]}>
								Không có cuộc trò chuyện nào
							</Text>
						</View>
					) : (
						<FlatList
							data={room}
							renderItem={({ item }) => (
								<RenderRoomItem
									item={item}
									setShowForwardModalAction={setShowForwardModalAction}
									actionMessage={actionMessage}
									setActionMessageAction={setActionMessageAction}
								/>
							)}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.chatListContent}
						/>
					)}
					<TouchableOpacity
						style={styles.cancelForwardButton}
						onPress={() => setShowForwardModalAction(false)}
					>
						<Text style={styles.cancelForwardText}>Hủy</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};
