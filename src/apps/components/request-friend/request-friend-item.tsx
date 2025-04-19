import { images } from "@/assets/images";
import Add from "@/assets/svgs/add";
import Delete from "@/assets/svgs/delete";
import { colors } from "@/constants";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { acceptRequestFriend, rejectRequestFriend } from "@/services/friend";
import { IRequestFriend } from "@/types/implement";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	data: IRequestFriend;
}

const RequestFriendItem = ({ data }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleAcceptFriend = async () => {
		setIsSubmitting(true);
		try {
			const response = await acceptRequestFriend(data.requestId ?? "");
			if (response.statusCode === 200) {
				Toast.show({
					type: "success",
					text1: "Chấp nhận lời mời kết bạn thành công",
					visibilityTime: 2000,
				});
			}
		} catch (error) {
			const err = error as ErrorResponse;
			Toast.show({
				type: "error",
				text1: err.message,
				visibilityTime: 2000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRejectFriend = async () => {
		setIsSubmitting(true);
		try {
			const response = await rejectRequestFriend(data.requestId ?? "");
			if (response.statusCode === 200) {
				Toast.show({
					type: "success",
					text1: "Từ chối lời mời kết bạn thành công",
					visibilityTime: 2000,
				});
			}
		} catch (error) {
			const err = error as ErrorResponse;
			Toast.show({
				type: "error",
				text1: err.message,
				visibilityTime: 2000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
				borderBottomWidth: 1,
				borderBottomColor: colors.outline,
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "row",
				gap: 10,
				padding: 10,
				backgroundColor: colors.mainBackground,
			}}
		>
			<Image
				style={{
					width: 60,
					height: 60,
					borderRadius: 9999,
					borderColor: colors.brand,
					borderWidth: 3,
				}}
				source={data.detail?.avatarUrl ? { uri: data.detail?.avatarUrl } : images.avatarDefault}
			/>
			<View style={{ flex: 1, alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
				<Text style={{ fontSize: 16, fontWeight: "bold" }}>{data.detail?.fullName ?? "-"}</Text>
				<View
					style={{
						flex: 1,
						justifyContent: "flex-end",
						flexDirection: "row",
						gap: 10,
					}}
				>
					<TouchableOpacity
						style={{ padding: 10, borderRadius: 9999 }}
						onPress={handleRejectFriend}
					>
						<Delete
							size={23}
							color="black"
							outline="black"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ padding: 10, borderRadius: 9999 }}
						onPress={handleAcceptFriend}
					>
						<Add
							size={23}
							color="black"
							outline="black"
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default RequestFriendItem;
