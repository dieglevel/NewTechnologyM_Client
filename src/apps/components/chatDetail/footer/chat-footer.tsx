import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { sendMessage } from "../message-utils";
import { useAppSelector } from "@/libs/redux/redux.config";
import { startRecording, stopRecording } from "../audio-utils";
import { IMessage } from "@/types/implement";

interface Props {
   isDark: boolean;
   editingMessageId: string | null;
   setEditingMessageId: (id: string | null) => void;
	setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const Footer = ({isDark, editingMessageId, setEditingMessageId, setMessages}: Props) => {
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

      const [inputText, setInputText] = useState("");
   
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; type: string }[]>([]);

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [recording, setRecording] = useState<any>(null);

	const uploadFiles = async (files: { uri: string; name: string; type: string }[]) => {
		try {
			const uploadedUrls: string[] = [];

			for (const file of files) {
				const formData = new FormData();
				formData.append("file", {
					uri: file.uri,
					name: file.name,
					type: file.type,
				} as any);

				// console.log("Uploading file:", file);

				// const response = await axios.post(
				//    "https://your-api-domain.com/api/file-cloud/upload-single-file",
				//    formData,
				//    {
				//       headers: {
				//          "Content-Type": "multipart/form-data",
				//       },
				//    },
				// );

				// console.log("Upload response:", response.data);

				// if (response.data && response.data.url) {
				//    uploadedUrls.push(response.data.url);
				// }
			}

			if (uploadedUrls.length > 0) {
				// console.log("Uploaded URLs:", uploadedUrls);
				// sendMessage(
				// 	"",
				// 	[],
				// 	uploadedUrls,
				// 	setMessages,
				// 	editingMessageId,
				// 	setEditingMessageId,
				// 	setEditText,
				// 	setInputText,
				// 	setIsTyping,
				// 	setSelectedImages,
				// 	setSelectedFiles,
				// );
			} else {
				alert("Lỗi: Không thể tải file lên server.");
			}
		} catch (error) {
			alert("Lỗi: Đã xảy ra lỗi khi tải file. Vui lòng thử lại.");
			// console.error("Error in uploadFiles:", error);
		}
	};

	const pickImages = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Quyền truy cập bị từ chối. Vui lòng cấp quyền truy cập vào thư viện ảnh.");
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsMultipleSelection: true,
			quality: 0.5,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const imageUris = result.assets.map((asset) => asset.uri);
			setSelectedImages(imageUris);
			// sendMessage(
			// 	"",
			// 	imageUris,
			// 	[],
			// 	setMessages,
			// 	editingMessageId,
			// 	setEditingMessageId,
			// 	setEditText,
			// 	setInputText,
			// 	setIsTyping,
			// 	setSelectedImages,
			// 	setSelectedFiles,
			// );
		}
	};

	const pickDocument = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					"application/pdf",
					"application/msword",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				],
				multiple: true,
			});

			if (!result.canceled) {
				const files = result.assets.map((asset) => ({
					uri: asset.uri,
					name: asset.name,
					type: asset.mimeType || "application/octet-stream",
				}));
				setSelectedFiles(files);
				uploadFiles(files);
			}
		} catch (error) {
			alert("Lỗi: Không thể chọn file. Vui lòng thử lại.");
			// console.error("Error in pickDocument:", error);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={80}
		>
			<View style={styles.inputContainer}>
				{editingMessageId && (
					<TouchableOpacity
						// onPress={() => cancelEdit(setEditingMessageId, setEditText, setInputText)}
						style={styles.inputIcon}
					>
						<Ionicons
							name="close-circle-outline"
							size={26}
							color="#ef4444"
						/>
					</TouchableOpacity>
				)}
				<TouchableOpacity
					onPress={pickImages}
					style={styles.inputIcon}
				>
					<Ionicons
						name="image-outline"
						size={26}
						color="#3b82f6"
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={pickDocument}
					style={styles.inputIcon}
				>
					<Ionicons
						name="document-attach-outline"
						size={26}
						color="#3b82f6"
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={
						isRecording
							? () => stopRecording(recording, setRecording, setIsRecording)
							: () => startRecording(setRecording, setIsRecording)
					}
					style={styles.inputIcon}
				>
					<Ionicons
						name={isRecording ? "stop-circle-outline" : "mic-outline"}
						size={26}
						color={isRecording ? "#ef4444" : "#3b82f6"}
					/>
				</TouchableOpacity>
				<TextInput
					style={[styles.textInput, isDark && styles.darkTextInput]}
					placeholder={editingMessageId ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."}
					placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
					value={inputText}
					onChangeText={(text) => {
						setInputText(text);
					}}
					// onSubmitEditing={() =>
					// 	sendMessage(
					// 		inputText,
					// 		[],
					// 		[],
					// 		setMessages,
					// 		editingMessageId,
					// 		setEditingMessageId,
					// 		setEditText,
					// 		setInputText,
					// 		setIsTyping,
					// 		setSelectedImages,
					// 		setSelectedFiles,
					// 	)
					// }
					returnKeyType="send"
				/>
				<TouchableOpacity
					onPress={() =>
						sendMessage(
							selectedRoom?.id || "",
							inputText,
                     setInputText,
                     setSelectedImages,
                     setSelectedFiles,
						)
					}
					style={styles.sendButton}
				>
					<Ionicons
						name={editingMessageId ? "save" : "send"}
						size={20}
						color="white"
					/>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Footer;
