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

  try{
    const response = await apiSendMessage({ roomId, content: text, type: "message" });
    if (response.statusCode === 200) {
    }
  } catch (error) {
    const e = error as ErrorResponse;
    Toast.show({
      type: "error",
      text1: "Có lỗi xảy ra khi gửi tin nhắn",
    })
  }
  finally{
    setInputText("");
    setSelectedImages([]);
    setSelectedFiles([]);
  }


};

// const forwardMessage = async (
//   targetChatId: string,
//   actionMessage: IMessage,
//   setShowForwardModal: (show: boolean) => void,
//   setShowActionModal: (show: boolean) => void
// ) => {
//   if (!actionMessage) return;

//   try {
//     const payload: any = {
//       chatId: targetChatId,
//       senderId: "me",
//       content: actionMessage.text || "",
//       timestamp: new Date().toISOString(),
//     };

//     if (actionMessage.images) payload.images = actionMessage.images;
//     if (actionMessage.files) payload.files = actionMessage.files;
//     if (actionMessage.audio) payload.audioUrl = actionMessage.audio;
//     // Ghi chú: Gửi API để chuyển tiếp tin nhắn
//     // axios.post("/api/message/forward", payload);
//     const response = await axios.post("/api/message", payload);

//     console.log("Forward message response:", response.data);
//     if (response.status === 200) {
//       Toast.show({
//         type: "success",
//         text1: "Chuyển tiếp tin nhắn thành công",
//       });
//     } else {
//       Toast.show({
//         type: "error",
//         text1: "Chuyển tiếp tin nhắn thất bại",
//       });
//     }
//     setShowForwardModal(false);
//     setShowActionModal(false);
//   } catch (error) {
//     Toast.show({
//       type: "error",
//       text1: "Có lỗi xảy ra khi chuyển tiếp tin nhắn",
//     });
//     console.error("Error in forwardMessage:", error);
//   }
// };

// const handleReactionSelect = (
//   emoji: string,
//   selectedMessageId: string | null,
//   setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
//   setShowReactionPicker: (show: boolean) => void,
//   setSelectedMessageId: (id: string | null) => void,
//   setShowActionModal: (show: boolean) => void
// ) => {
//   if (!selectedMessageId) return;

//   setMessages((prev) =>
//     prev.map((msg) =>
//       msg._id === selectedMessageId ? { ...msg, reaction: emoji } : msg
//     )
//   );
//   // Ghi chú: Gửi API để lưu phản ứng lên server
//   // axios.post("/api/messages/reaction", {
//   //   messageId: selectedMessageId,
//   //   reaction: emoji,
//   // });
//   setShowReactionPicker(false);
//   setSelectedMessageId(null);
//   setShowActionModal(false);
// };

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
          prev?.map((msg) =>
            msg._id === id
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

// const openImageModal = (
//   messageImages: string[],
//   selectedIndex: number,
//   messages: IMessage[],
//   setAllImageUris: (uris: string[]) => void,
//   setInitialImageIndex: (index: number) => void,
//   setCurrentImageIndex: (index: number) => void,
//   setShowImageModal: (show: boolean) => void
// ) => {
//   const allImages: string[] = [];
//   messages.forEach((msg) => {
//     if (msg.images) {
//       allImages.push(...msg.images);
//     }
//   });

//   let globalIndex = 0;
//   let found = false;
//   for (const msg of messages) {
//     if (msg.images) {
//       for (let i = 0; i < msg.images.length; i++) {
//         if (msg.images[i] === messageImages[selectedIndex]) {
//           globalIndex += i;
//           found = true;
//           break;
//         }
//         globalIndex++;
//       }
//       if (found) break;
//     }
//   }

//   setAllImageUris(allImages);
//   setInitialImageIndex(globalIndex);
//   setCurrentImageIndex(globalIndex);
//   setShowImageModal(true);
// };

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
  })
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
  // forwardMessage,
  // handleReactionSelect,
  handleRecallMessage,
  handleEditMessage,
  // cancelEdit,
  // openImageModal,
  // closeImageModal,
  copyMessage,
  toggleSearchBar,
  // Message,
};
