import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking, Modal, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { IDetailInformation, IMessage } from "@/types/implement";
import { useAppSelector } from "@/libs/redux/redux.config";
import { images } from "@/assets/images";
import styles from "../styles";
import FilePreview from "../../../../../components/file-preview/file-preview";
import { getProfileFromAnotherUser } from "@/services";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { changeDateToString } from "@/utils/change-date-to-string";
import { colors } from "@/constants";

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
		const [showUserInfoModal, setShowUserInfoModal] = useState<boolean>(false);
		const [userInfoarmtion, setUserInformation] = useState<IDetailInformation>();

		useEffect(() => {
			const fetch = async () => {
				try {
					const response = await getProfileFromAnotherUser(item.accountId || "");
					setUserInformation(response.data);
				} catch (e) {
					const error = e as ErrorResponse;
				}
			};

			if (showUserInfoModal === true) {
				fetch();
			}
		}, [showUserInfoModal]);

		const renderFile = () => {
			const file = item.files;

			return file?.map((file, index) => {
				// return <FilePreview uri={file.url} />;

				return (
					<FilePreview
						action={longPressAction}
						data={file}
						key={index}
					/>
				);
			});
		};
		const renderAvatar = () => {
			const account = selectedRoom?.detailRoom?.find((account) => account.id === item.accountId);

			return (
				<Image
					source={account?.avatar ? { uri: account.avatar } : images.avatarDefault}
					style={styles.avatar}
				/>
			);
		};

		const longPressAction = () => {
			if (!item.isRevoked) {
				setActionMessage(item);
				setShowActionModal(true);
			}
		};
		return (
			<>
				<Modal
					visible={showUserInfoModal}
					transparent
					animationType="fade"
				>
					<TouchableOpacity
						style={styless.profileSection}
						onPress={() => setShowUserInfoModal(false)}
					>
						{userInfoarmtion && (
							<>
								<View style={styless.container}>
									<View style={styless.rowDetail}>
										<Image
											source={
												userInfoarmtion?.thumbnailUrl
													? { uri: userInfoarmtion?.thumbnailUrl }
													: images.background
											}
											style={styless.thumbnail}
										/>
										<Image
											source={
												userInfoarmtion?.avatarUrl
													? { uri: userInfoarmtion?.avatarUrl }
													: images.avatarDefault
											}
											style={styless.avatar}
										/>
									</View>

									
									<View style={styless.row}>
										<View style={styless.infoContainer}>
											<Text style={styless.name}>
												{userInfoarmtion?.fullName ?? "-"}
											</Text>
										</View>
									</View>
										

									<View style={stylesss.container}>
										<View style={stylesss.row}>
											<Text style={stylesss.title}>Họ và tên:</Text>
											<Text style={stylesss.description}>
												{detailInformation?.fullName ?? "Chưa có "}
											</Text>
										</View>
										<View style={stylesss.row}>
											<Text style={stylesss.title}>Giới tính:</Text>
											<Text style={stylesss.description}>
												{detailInformation?.gender === null
													? "Chưa chọn giới tính"
													: detailInformation?.gender
													? "Nam"
													: "Nữ"}
											</Text>
										</View>
										<View style={stylesss.row}>
											<Text style={stylesss.title}>Ngày sinh:</Text>
											<Text style={stylesss.description}>
												{detailInformation?.dateOfBirth
													? changeDateToString(detailInformation?.dateOfBirth)
													: "Chưa chọn ngày sinh"}
											</Text>
										</View>
									</View>
									<TouchableOpacity
										style={styless.closeUserInfoButton}
										onPress={() => setShowUserInfoModal(false)}
									>
										<Text style={styless.closeUserInfoText}>Đóng</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
					</TouchableOpacity>
				</Modal>

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
							onPress={() => {
								setShowUserInfoModal(true);
							}}
						>
							{renderAvatar()}
						</TouchableOpacity>
					)}
					<TouchableOpacity
						onLongPress={longPressAction}
						delayLongPress={1000}
						activeOpacity={0.8}
						style={[
							styles.messageContainer,
							isMyMessage ? styles.myMessage : styles.otherMessage,
							item.sticker && { backgroundColor: "#f9fafb" },
							isDark && {
								backgroundColor: isMyMessage ? "#2563eb" : "#374151",
							},
							{ gap: 10, flex: !item.isRevoked && item.files && item.files?.length > 0 ? 1 : 0 },
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
										width={300}
										height={300}
									/>
								) : (
									item.content && <Text style={styles.senderName}>{item.content}</Text>
								)}
							</>
						)}
					</TouchableOpacity>
				</View>
			</>
		);
	},
);

export default MessageItem;

const styless = StyleSheet.create({
	profileSection: {
		width: "100%", // w-full
		borderRadius: 12, // rounded-lg
		flex: 1,
		justifyContent: "center", // justify-center
		alignItems: "center", // items-center
		backgroundColor: "#00000066",
	},
	container: {
		backgroundColor: "white",
		flexDirection: "column", // flex-row
		alignItems: "center", // items-center
		alignContent: "center", // content-center
		justifyContent: "flex-start", // justify-between
		paddingHorizontal: 16, // px-4
		paddingVertical: 16, // py-4
		borderRadius: 12, // rounded-lg
	},
	row: {
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
		alignContent: "center", // content-center
		justifyContent: "center", // justify-between
	},
	rowDetail: {
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
		justifyContent: "center", // justify-center
		marginBottom: 40, // mb-3
		position: "relative", // relative
	},
	avatar: {
		position: "absolute", // absolute
		bottom: -40, // -mt-8
		width: 100, // w-14
		height: 100, // h-14
		borderRadius: 20, // rounded-full
		borderWidth: 4, // border-2
		borderColor: "white", // border-gray-200
		alignItems: "center", // items-center
		justifyContent: "center", // justify-center
	},
	infoContainer: {
		flex: 1,
	},
	name: {
		fontSize: 30, // text-lg
		fontWeight: "600", // font-semibold
		textAlign: "center", // text-center
	},
	link: {
		color: "#6B7280", // text-gray-500
	},
	thumbnail: {
		width: "100%",
		height: 200, // h-24
		borderRadius: 12, // rounded-lg
		backgroundColor: "#E5E7EB", // bg-gray-200
		alignSelf: "center", // self-center
		resizeMode: "cover", // object-cover
	},
	closeUserInfoButton: {
		backgroundColor: colors.brand, // bg-blue-500
		paddingVertical: 10, // py-2
		paddingHorizontal: 20, // px-4
		borderRadius: 8, // rounded-md
		marginTop: 20, // mt-4
		width: "100%", // w-full
	},
	closeUserInfoText: {
		color: "white", // text-white
		fontSize: 16, // text-base
		fontWeight: "500", // font-medium
		textAlign: "center", // text-center
	},
});

const stylesss = StyleSheet.create({
	container: {
		gap: 8,
		flexDirection: "column", // flex-row
		alignItems: "flex-start", // items-center
		justifyContent: "flex-start", // justify-between
		minWidth: "100%",
		paddingHorizontal: 32, // px-4
		marginTop: 16, // mt-4
	},
	row: {
		alignItems: "flex-end", // items-end
		justifyContent: "flex-start", // justify-center
		flexDirection: "row", // flex-row
		gap: 8, // gap-2
		width: "100%", // w-full
	},
	title: {
		minWidth: 100, // w-24
		fontSize: 20, // text-xl
		fontWeight: "600", // font-semibold
	},
	description: {
		color: "#6B7280", // text-gray-500
		textAlign: "center",
		fontSize: 18, // text-base
	},
	button: {
		backgroundColor: "#007AFF", // bg-[#007AFF]
		borderRadius: 9999, // rounded-full
		paddingVertical: 12, // py-3
		marginTop: 24, // mt-6
		width: "50%", // w-1/2
	},
	buttonText: {
		color: "white", // text-white
		textAlign: "center",
		fontWeight: "600", // font-semibold
	},
});
