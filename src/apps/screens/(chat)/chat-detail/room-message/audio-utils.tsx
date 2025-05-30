import { Audio } from "expo-av";
import { Alert } from "react-native";
import { sendMessage } from "@/services";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";

// Hàm kiểm tra quyền ghi âm
const checkAudioPermissions = async () => {
	const { status } = await Audio.requestPermissionsAsync();
	if (status !== "granted") {
		Alert.alert("Quyền truy cập bị từ chối", "Vui lòng cấp quyền truy cập microphone.");
		return false;
	}
	return true;
};

// Hàm bắt đầu ghi âm
const startRecording = async (
	setRecording: (recording: Audio.Recording | null) => void,
	setIsRecording: (isRecording: boolean) => void
) => {
	const hasPermission = await checkAudioPermissions();
	if (!hasPermission) return;

	try {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			playsInSilentModeIOS: true,
		});

		const { recording } = await Audio.Recording.createAsync(
			Audio.RecordingOptionsPresets.HIGH_QUALITY
		);
		setRecording(recording);
		setIsRecording(true);
	} catch (error) {
		console.error("❌ Error in startRecording:", error);
		Alert.alert("Lỗi", "Không thể bắt đầu ghi âm. Vui lòng thử lại.");
	}
};

// Hàm dừng ghi âm và gửi file
const stopRecording = async (
	recording: Audio.Recording | null,
	setRecording: (recording: Audio.Recording | null) => void,
	setIsRecording: (isRecording: boolean) => void,
	roomId: string
) => {
	if (!recording) return;

	try {
		await recording.stopAndUnloadAsync();
		const uri = recording.getURI();
		setIsRecording(false);
		setRecording(null);

		if (uri) {
			const file = {
				uri,
				name: `recording_${Date.now()}.mp4`,
				type: "audio/mp4",
			};
			await uploadAudio(file, roomId);
		}
	} catch (error) {
		console.error("❌ Error in stopRecording:", error);
		Alert.alert("Lỗi", "Không thể dừng ghi âm. Vui lòng thử lại.");
	}
};

// Hàm upload và gửi tin nhắn âm thanh
const uploadAudio = async (
	file: { uri: string; name: string; type: string },
	roomId: string
) => {
	try {
		const accountId = await ExpoSecureValueService.getUserId();

		if (!accountId || !roomId) {
			Alert.alert("Lỗi", "Thiếu thông tin người dùng hoặc phòng chat.");
			return;
		}

		const response = await sendMessage({
			roomId,
			type: "voice",
			accountId,
			files: [file],
		});

		console.log("✅ Tin nhắn ghi âm đã gửi thành công:", response);
	} catch (error) {
		console.error("❌ Lỗi khi gửi tin nhắn âm thanh:", error);
		Alert.alert("Lỗi", "Không thể gửi tin nhắn âm thanh. Vui lòng thử lại.");
	}
};

// Hàm tạo tin nhắn ghi âm ảo (local UI preview)
const sendAudioMessage = async (audioUrl: string) => {
	try {
		const currentTime = new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		const message = {
			id: Date.now().toString(),
			text: "",
			sender: "me",
			time: currentTime,
			read: true,
			avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
			senderName: "Tôi",
			audio: audioUrl,
			reaction: null,
		};

		return message;
	} catch (error) {
		console.error("❌ Error in sendAudioMessage:", error);
		Alert.alert("Lỗi", "Không thể gửi tin nhắn thoại. Vui lòng thử lại.");
	}
};

// Hàm phát âm thanh từ URL
const playAudio = async (
	audioUrl: string,
	messageId: string,
	sound: any,
	setSound: (sound: any) => void,
	playingAudioId: string | null,
	setPlayingAudioId: (id: string | null) => void
) => {
	try {
		// Nếu đang phát và bấm lại => dừng
		if (sound && playingAudioId === messageId) {
			await sound.stopAsync();
			await sound.unloadAsync();
			setSound(null);
			setPlayingAudioId(null);
			return;
		}

		const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
		setSound(newSound);
		setPlayingAudioId(messageId);
		await newSound.playAsync();

		newSound.setOnPlaybackStatusUpdate((status) => {
			if (status.isLoaded && status.didJustFinish) {
				newSound.unloadAsync();
				setSound(null);
				setPlayingAudioId(null);
			}
		});
	} catch (error) {
		console.error("❌ Error in playAudio:", error);
		Alert.alert("Lỗi", "Không thể phát âm thanh. Vui lòng thử lại.");
	}
};

export {
	checkAudioPermissions,
	startRecording,
	stopRecording,
	uploadAudio,
	sendAudioMessage,
	playAudio,
};
