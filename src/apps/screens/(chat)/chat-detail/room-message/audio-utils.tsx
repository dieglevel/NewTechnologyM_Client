import { Audio } from "expo-av";
import { uploadAudioToMessageApi } from "@/services/upload";
import { Alert } from "react-native";

const checkAudioPermissions = async () => {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Quyền truy cập bị từ chối", "Vui lòng cấp quyền truy cập microphone.");
    return false;
  }
  return true;
};

const startRecording = async (setRecording: (recording: Audio.Recording | null) => void, setIsRecording: (isRecording: boolean) => void) => {
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
    Alert.alert("Lỗi", "Không thể bắt đầu ghi âm. Vui lòng thử lại.");
    console.error("Error in startRecording:", error);
  }
};

const stopRecording = async (recording: Audio.Recording | null, setRecording: (recording: Audio.Recording | null) => void, setIsRecording: (isRecording: boolean) => void) => {
  if (!recording) return;

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setIsRecording(false);
    setRecording(null);

    if (uri) {
      const file = {
        uri,
        name: `recording_${Date.now()}.m4a`,
        type: "audio/m4a",
      };
      uploadAudio(file);
    }
  } catch (error) {
    Alert.alert("Lỗi", "Không thể dừng ghi âm. Vui lòng thử lại.");
    console.error("Error in stopRecording:", error);
  }
};

const uploadAudio = async (file: { uri: string; name: string; type: string }) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    formData.append("chatId", "default_chat_id");
    formData.append("senderId", "me");
    formData.append("timestamp", new Date().toISOString());


    const response = await uploadAudioToMessageApi(formData);

    if (response && (response.data as any)?.audioUrl) {
      sendAudioMessage((response.data as any).audioUrl);
    } else {
      Alert.alert("Lỗi", "Không thể tải file âm thanh lên server.");
    }
  } catch (error) {
    Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải file âm thanh. Vui lòng thử lại.");
    console.error("Error in uploadAudio:", error);
  }
};

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
    Alert.alert("Lỗi", "Không thể gửi tin nhắn thoại. Vui lòng thử lại.");
    console.error("Error in sendAudioMessage:", error);
  }
};

const playAudio = async (audioUrl: string, messageId: string, sound: any, setSound: (sound: any) => void, playingAudioId: string | null, setPlayingAudioId: (id: string | null) => void) => {
  try {
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
    Alert.alert("Lỗi", "Không thể phát âm thanh. Vui lòng thử lại.");
    console.error("Error in playAudio:", error);
  }
};

export { checkAudioPermissions, startRecording, stopRecording, uploadAudio, sendAudioMessage, playAudio };