import { Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  read?: boolean;
  avatar: string;
  senderName: string;
  reaction: string | null;
  images?: string[] | null;
  files?: string[] | null;
  audio?: string | null;
  isEdited?: boolean;
}

interface FileObject {
  uri: string;
  name: string;
  type: string;
}

const sendMessage = (
  text: string = "",
  images: string[] = [],
  files: string[] = [],
  audio: string | null = null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  editingMessageId: string | null,
  setEditingMessageId: (id: string | null) => void,
  setEditText: (text: string) => void,
  setInputText: (text: string) => void,
  setIsTyping: (typing: boolean) => void,
  setSelectedImages: (images: string[]) => void,
  setSelectedFiles: (files: FileObject[]) => void
) => {
  const trimmedText = text.trim();
  if (!trimmedText && images.length === 0 && files.length === 0 && !audio) {
    return;
  }

  if (editingMessageId) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId
          ? { ...msg, text: trimmedText, isEdited: true }
          : msg
      )
    );
        // Ghi chú: Gửi API cập nhật tin nhắn đã chỉnh sửa
    // axios.put(`/api/messages/${editingMessageId}`, {
    //   text,
    //   images,
    //   files,
    //   audio,
    //   editedAt: new Date().toISOString(),
    // });
    setEditingMessageId(null);
    setEditText("");
  } else {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: "me",
      time: currentTime,
      read: true,
      avatar: "https://tse4.mm.bing.net/th?id=OIP.3AiVQskb9C_qFJB52BzF7QHaHa&pid=Api&P=0&h=180",
      senderName: "Tôi",
      images: images.length > 0 ? images : null,
      files: files.length > 0 ? files : null,
      audio: audio || null,
      reaction: null,
    };
    setMessages((prev) => [...prev, newMessage]);
  }
   // Ghi chú: Gửi API tạo tin nhắn mới
    // axios.post("/api/messages", {
    //   chatId: "your-chat-id",
    //   senderId: "me",
    //   content: text,
    //   images,
    //   files,
    //   audio,
    //   timestamp: new Date().toISOString(),
    // });
  setInputText("");
  setIsTyping(false);
  setSelectedImages([]);
  setSelectedFiles([]);
};

const forwardMessage = async (
  targetChatId: string,
  actionMessage: Message,
  setShowForwardModal: (show: boolean) => void,
  setShowActionModal: (show: boolean) => void
) => {
  if (!actionMessage) return;

  try {
    const payload: any = {
      chatId: targetChatId,
      senderId: "me",
      content: actionMessage.text || "",
      timestamp: new Date().toISOString(),
    };

    if (actionMessage.images) payload.images = actionMessage.images;
    if (actionMessage.files) payload.files = actionMessage.files;
    if (actionMessage.audio) payload.audioUrl = actionMessage.audio;
    // Ghi chú: Gửi API để chuyển tiếp tin nhắn
    // axios.post("/api/message/forward", payload);
    const response = await axios.post("/api/message", payload);

    console.log("Forward message response:", response.data);
    Alert.alert("Thành công", "Tin nhắn đã được chuyển tiếp!");
    setShowForwardModal(false);
    setShowActionModal(false);
  } catch (error) {
    Alert.alert("Lỗi", "Không thể chuyển tiếp tin nhắn. Vui lòng thử lại.");
    console.error("Error in forwardMessage:", error);
  }
};

const handleReactionSelect = (
  emoji: string,
  selectedMessageId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setShowReactionPicker: (show: boolean) => void,
  setSelectedMessageId: (id: string | null) => void,
  setShowActionModal: (show: boolean) => void
) => {
  if (!selectedMessageId) return;

  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === selectedMessageId ? { ...msg, reaction: emoji } : msg
    )
  );
  // Ghi chú: Gửi API để lưu phản ứng lên server
  // axios.post("/api/messages/reaction", {
  //   messageId: selectedMessageId,
  //   reaction: emoji,
  // });
  setShowReactionPicker(false);
  setSelectedMessageId(null);
  setShowActionModal(false);
};

const handleRecallMessage = (
  id: string,
  isMyMessage: boolean,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setShowActionModal: (show: boolean) => void
) => {
  if (!isMyMessage) {
    Alert.alert("Lỗi", "Chỉ có thể thu hồi tin nhắn của bạn!");
    return;
  }

  Alert.alert("Thu hồi tin nhắn", "Bạn có chắc muốn thu hồi tin nhắn này?", [
    { text: "Hủy", style: "cancel" },
    {
      text: "Thu hồi",
      style: "destructive",
      onPress: () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? {
                  ...msg,
                  text: "Tin nhắn đã được thu hồi",
                  images: null,
                  files: null,
                  audio: null,
                  reaction: null,
                }
              : msg
          )
        );
        // Ghi chú: Gửi API để thu hồi tin nhắn khỏi server
        // axios.delete(`/api/messages/${id}`);

        setShowActionModal(false);
      },
    },
  ]);
};

const handleEditMessage = (
  id: string,
  text: string,
  setEditingMessageId: (id: string | null) => void,
  setEditText: (text: string) => void,
  setInputText: (text: string) => void,
  setShowActionModal: (show: boolean) => void
) => {
  setEditingMessageId(id);
  setEditText(text);
  setInputText(text);
  setShowActionModal(false);
};

const cancelEdit = (
  setEditingMessageId: (id: string | null) => void,
  setEditText: (text: string) => void,
  setInputText: (text: string) => void
) => {
  setEditingMessageId(null);
  setEditText("");
  setInputText("");
};

const openImageModal = (
  messageImages: string[],
  selectedIndex: number,
  messages: Message[],
  setAllImageUris: (uris: string[]) => void,
  setInitialImageIndex: (index: number) => void,
  setCurrentImageIndex: (index: number) => void,
  setShowImageModal: (show: boolean) => void
) => {
  const allImages: string[] = [];
  messages.forEach((msg) => {
    if (msg.images) {
      allImages.push(...msg.images);
    }
  });

  let globalIndex = 0;
  let found = false;
  for (const msg of messages) {
    if (msg.images) {
      for (let i = 0; i < msg.images.length; i++) {
        if (msg.images[i] === messageImages[selectedIndex]) {
          globalIndex += i;
          found = true;
          break;
        }
        globalIndex++;
      }
      if (found) break;
    }
  }

  setAllImageUris(allImages);
  setInitialImageIndex(globalIndex);
  setCurrentImageIndex(globalIndex);
  setShowImageModal(true);
};

const closeImageModal = (
  setShowImageModal: (show: boolean) => void,
  setAllImageUris: (uris: string[]) => void,
  setInitialImageIndex: (index: number) => void,
  setCurrentImageIndex: (index: number) => void
) => {
  setShowImageModal(false);
  setAllImageUris([]);
  setInitialImageIndex(0);
  setCurrentImageIndex(0);
};

const copyMessage = (
  text: string,
  setShowActionModal: (show: boolean) => void
) => {
  if (text === "Tin nhắn đã được thu hồi") {
    Alert.alert("Không thể sao chép");
    return;
  }
  Clipboard.setString(text);
  setShowActionModal(false);
};

const toggleSearchBar = (
  showSearchBar: boolean,
  setShowSearchBar: (show: boolean) => void,
  setSearchQuery: (query: string) => void
) => {
  setShowSearchBar(!showSearchBar);
  setSearchQuery("");
};

export {
  sendMessage,
  forwardMessage,
  handleReactionSelect,
  handleRecallMessage,
  handleEditMessage,
  cancelEdit,
  openImageModal,
  closeImageModal,
  copyMessage,
  toggleSearchBar, Message,
};
