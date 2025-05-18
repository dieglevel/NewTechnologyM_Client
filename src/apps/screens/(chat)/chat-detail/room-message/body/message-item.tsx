// MessageItem.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking, Modal } from "react-native";
import { IDetailInformation, IMessage } from "@/types/implement";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import styles from "../styles";
import FilePreview from "../../../../../components/file-preview/file-preview";
import { getProfileFromAnotherUser } from "@/services";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { changeDateToString } from "@/utils/change-date-to-string";

interface Props {
	item: IMessage;
	myUserId: string | null;
	detailInformation: IDetailInformation | null;
	setActionMessage: (message: IMessage) => void;
	setShowActionModal: (show: boolean) => void;
	isDark: boolean;
}

const MessageItem: React.FC<Props> = React.memo(
	({ item, myUserId, detailInformation, setActionMessage, setShowActionModal, isDark }) => {
		const isMyMessage = item.accountId === myUserId;
		const { selectedRoom } = useAppSelector((state) => state.selectedRoom);
		const [showUserInfoModal, setShowUserInfoModal] = useState(false);
		const [userInfoarmtion, setUserInformation] = useState<IDetailInformation>();

		useEffect(() => {
			const fetch = async () => {
				try {
					const response = await getProfileFromAnotherUser(item.accountId || "");
					setUserInformation(response.data);
				} catch (e) {
					const error = e as ErrorResponse;
					console.error("Error fetching profile:", error);
				}
			};
			if (showUserInfoModal) fetch();
		}, [showUserInfoModal]);

		const renderFile = () => {
			return item.files?.map((file, index) => (
				<View key={index} style={{ marginBottom: 10 }}>
					<FilePreview data={file} />
				</View>
			));
		};

		const renderAvatar = () => {
			const account = selectedRoom?.detailRoom?.find((a) => a.id === item.accountId);
			return (
				<Image
					source={account?.avatar ? { uri: account.avatar } : images.avatarDefault}
					style={styles.avatar}
				/>
			);
		};

		return (
			<>
				<View
					style={[
						styles.messageRow,
						{ justifyContent: isMyMessage ? "flex-end" : "flex-start" },
					]}
				>
					{!isMyMessage && (
						<TouchableOpacity onPress={() => setShowUserInfoModal(true)}>
							{renderAvatar()}
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onLongPress={() => {
							setActionMessage(item);
							setShowActionModal(true);
						}}
						delayLongPress={1000}
						activeOpacity={0.8}
						style={[
							styles.messageContainer,
							isMyMessage ? styles.myMessage : styles.otherMessage,
							isDark && {
								backgroundColor: isMyMessage ? "#2563eb" : "#374151",
							},
							{ gap: 10, flex: !item.isRevoked && item.files?.length ? 1 : 0 },
						]}
					>
						{item.isRevoked ? (
							<Text style={styles.senderName}>Tin nhắn đã thu hồi</Text>
						) : (
							<>
								{renderFile()}
								{item.sticker ? (
									<Image
										source={{ uri: item.sticker }}
										style={{ width: 100, height: 100 }}
									/>
								) : (
									item.content && <Text style={styles.senderName}>{item.content}</Text>
								)}
							</>
						)}
					</TouchableOpacity>
				</View>

				<Modal visible={showUserInfoModal} transparent animationType="fade">
					<TouchableOpacity
						style={styles.userInfoModalContainer}
						onPress={() => setShowUserInfoModal(false)}
					>
						<View style={[styles.userInfoModalContent, isDark && styles.darkUserInfoModalContent]}>
							{userInfoarmtion && (
								<>
									<Image
										source={{ uri: userInfoarmtion.avatarUrl }}
										style={styles.userInfoAvatar}
									/>
									<Text style={[styles.userInfoName, isDark && styles.darkUserInfoName]}>
										{userInfoarmtion.fullName}
									</Text>
									<View style={{ flex: 1, alignItems: "flex-start", width: "100%" }}>
										<View style={styles.userInfoDetail}>
											<Text style={[styles.userInfoTextHeader, isDark && styles.darkUserInfoText]}>
												Họ và tên:
											</Text>
											<Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
												{userInfoarmtion.fullName}
											</Text>
										</View>
										<View style={styles.userInfoDetail}>
											<Text style={[styles.userInfoTextHeader, isDark && styles.darkUserInfoText]}>
												Giới tính:
											</Text>
											<Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
												{userInfoarmtion.gender ? "Nam" : "Nữ"}
											</Text>
										</View>
										<View style={styles.userInfoDetail}>
											<Text style={[styles.userInfoTextHeader, isDark && styles.darkUserInfoText]}>
												Ngày sinh:
											</Text>
											<Text style={[styles.userInfoText, isDark && styles.darkUserInfoText]}>
												{changeDateToString(userInfoarmtion.dateOfBirth || null)}
											</Text>
										</View>
									</View>
									<TouchableOpacity
										style={styles.closeUserInfoButton}
										onPress={() => setShowUserInfoModal(false)}
									>
										<Text style={styles.closeUserInfoText}>Đóng</Text>
									</TouchableOpacity>
								</>
							)}
						</View>
					</TouchableOpacity>
				</Modal>
			</>
		);
	},
);

export default MessageItem;
