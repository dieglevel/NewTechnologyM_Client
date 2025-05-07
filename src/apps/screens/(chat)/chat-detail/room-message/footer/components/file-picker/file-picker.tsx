import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePickerExpo from "expo-image-picker";
import styles from "../../../styles";
import { ImageType } from "@/services";
import { useAppSelector } from "@/libs/redux/redux.config";
import { sendFile } from "./handle";
import * as DocumentPicker from "expo-document-picker";
import { BaseFile } from "@/types/base-file";

export const FilePicker = () => {
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const handlePicker = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				multiple: true,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				const file: BaseFile[] = [];

				result.assets.forEach((item) => {
					const temp: BaseFile = {
						name: item.name,
						type: item.mimeType || "",
						uri: item.uri,
					};
					file.push(temp);
				});
				sendFile(file, selectedRoom?.id || "");
			}
		} catch (error) {
			alert("Lỗi: Không thể chọn file. Vui lòng thử lại.");
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePicker}
			style={styles.inputIcon}
		>
			<Ionicons
				name="document-attach-outline"
				size={26}
				color="#3b82f6"
			/>
		</TouchableOpacity>
	);
};
