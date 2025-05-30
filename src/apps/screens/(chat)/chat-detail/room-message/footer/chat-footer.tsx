import {
	FlatList,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import styles from "../styles";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePickerExpo from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/libs/redux/redux.config";
import { startRecording, stopRecording } from "../audio-utils";
import { IMessage } from "@/types/implement";
import GiphyApi from "@/libs/giphy";
import { GifsResult } from "@giphy/js-fetch-api";
import { ModalSticker } from "./components/sticker/modal-sticker";
import { ImagePicker } from "./components/image-picker/image-picker";
import { FilePicker } from "./components/file-picker/file-picker";
import { sendMessages } from "./handle";

interface Props {
	isDark: boolean;
	editingMessageId: string | null;
	setEditingMessageId: (id: string | null) => void;
	setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const Footer = ({ isDark, editingMessageId, setEditingMessageId, setMessages }: Props) => {
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);

	const [inputText, setInputText] = useState<string>("");

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [recording, setRecording] = useState<any>(null);

	const [showEmoji, setShowEmoji] = useState<boolean>(false);

	const handleSendMessage = () => {
		sendMessages(inputText, selectedRoom?.id || "");
		setInputText("");
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={80}
		>
			<View style={styles.inputContainer}>
				<ModalSticker
					showEmoji={showEmoji}
					setShowEmoji={setShowEmoji}
				/>

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

				<ImagePicker />

				<FilePicker />

				<TextInput
					style={[styles.textInput, isDark && styles.darkTextInput]}
					placeholder={editingMessageId ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."}
					placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
					value={inputText}
					onChangeText={(text) => {
						setInputText(text);
					}}
					onSubmitEditing={handleSendMessage}
					returnKeyType="send"
				/>
				<TouchableOpacity
					style={styles.inputIcon}
					onPress={() => setShowEmoji(!showEmoji)}
				>
					<Ionicons
						name="happy-outline"
						size={26}
						color="#3b82f6"
					/>
				</TouchableOpacity>
<TouchableOpacity
	style={styles.inputIcon}
	onPress={async () => {
		if (isRecording) {
			await stopRecording(recording, setRecording, setIsRecording, selectedRoom?.id || "");
		} else {
			await startRecording(setRecording, setIsRecording);
		}
	}}
>
	<Ionicons
		name={isRecording ? "stop-circle-outline" : "mic-outline"}
		size={26}
		color={isRecording ? "#ef4444" : "#3b82f6"}
	/>
</TouchableOpacity>

				<TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
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
