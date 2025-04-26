import { Alert, Clipboard } from "react-native";
import { IMessage, IRoom } from "@/types/implement";
import Toast from "react-native-toast-message";

import { sendMessage as apiSendMessage } from "@/services/message";
import { socketService } from "@/libs/socket/socket";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { store } from "@/libs/redux/redux.config";

const sendMessage = async (
  roomId: string,
  text: string = "",
  setInputText: (text: string) => void,
  setSelectedImages: (images: string[]) => void,
  setSelectedFiles: React.Dispatch<React.SetStateAction<{
    uri: string;
    name: string;
    type: string;
  }[]>>
) => {
  if (!text.trim()) {
    return;
  }

  try {
    const response = await apiSendMessage({ roomId, content: text, type: "message" });
    if (response.statusCode === 200) {
      // Gửi thành công
    }
  } catch (error) {
    const e = error as ErrorResponse;
    Toast.show({
      type: "error",
      text1: "Có lỗi xảy ra khi gửi tin nhắn",
    });
  } finally {
    setInputText("");
    setSelectedImages([]);
    setSelectedFiles([]);
  }
};

const handleRecallMessage = (
  id: string,
  isMyMessage: boolean,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
  setShowActionModal: (show: boolean) => void
) => {
  if (!isMyMessage) {
    Toast.show({
      type: "error",
      text1: "Chỉ có thể thu hồi tin nhắn của chính mình",
    });
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
            msg._id === id
              ? {
                  ...msg,
                  content: "Tin nhắn đã được thu hồi",
                  images: null,
                  files: [],
                  audio: null,
                  reaction: null,
                  isRevoked: true,
                }
              : msg
          )
        );

        Toast.show({
          type: "success",
          text1: "Đã thu hồi tin nhắn",
        });

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
    Toast.show({
      type: "error",
      text1: "Không thể sao chép tin nhắn đã thu hồi",
    });
    return;
  }

  Clipboard.setString(text);
  Toast.show({
    type: "success",
    text1: "Sao chép thành công",
  });
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
  handleRecallMessage,
  handleEditMessage,
  cancelEdit,
  closeImageModal,
  copyMessage,
  toggleSearchBar,
};
