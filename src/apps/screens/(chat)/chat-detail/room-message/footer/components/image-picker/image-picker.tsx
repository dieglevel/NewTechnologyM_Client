import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePickerExpo from "expo-image-picker";
import styles from "../../../styles";
import { ImageType } from "@/services";
import { sendImage } from "./handle";
import { useAppSelector } from "@/libs/redux/redux.config";
import { BaseFile } from "@/types/base-file";

export const ImagePicker = () => {
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const handlePicker = async () => {
		const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Quyền truy cập bị từ chối. Vui lòng cấp quyền truy cập vào thư viện ảnh.");
			return;
		}

		let result = await ImagePickerExpo.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsMultipleSelection: true,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const file: BaseFile[] = [];
			result.assets.forEach((item) => {
				const temp: BaseFile = {
					name: item.fileName || "upload.img",
					type: item.mimeType || "image/jpeg",
					uri: item.uri,
				};
				file.push(temp);
			});

			sendImage(file, selectedRoom?.id || "");
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePicker}
			style={styles.inputIcon}
		>
			<Ionicons
				name="image-outline"
				size={26}
				color="#3b82f6"
			/>
		</TouchableOpacity>
	);
};
