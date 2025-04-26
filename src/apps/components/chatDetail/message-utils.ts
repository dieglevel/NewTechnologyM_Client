import { Alert, Clipboard } from "react-native";
import { IMessage, IRoom } from "@/types/implement";
import Toast from "react-native-toast-message";

import { sendMessage as apiSendMessage, forwardMessage, revokeMessage } from "@/services/message";
import { socketService } from "@/libs/socket/socket";
import { ErrorResponse, BaseResponse } from "@/libs/axios/axios.config";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { store } from "@/libs/redux/redux.config";
import { api } from "@/libs/axios/axios.config";
import { getMyListRoom } from "@/services/room";

// Hàm lấy danh sách phòng
const getRooms = async (): Promise<IRoom[]> => {
  try {
    const response = await getMyListRoom();
    console.log("response", response);
    if (response.statusCode === 200) {
      return response.data?.listRoomResponse ?? [];
    }
    return [];
  } catch (error) {
    const e = error as ErrorResponse;
    Toast.show({
      type: 'error',
      text1: 'Có lỗi xảy ra khi tải danh sách phòng',
    });
    return [];
  }
};


// Hàm gửi tin nhắn
const sendMessage = async (
  roomId: string,
  sticker: string | undefined,
  text: string | undefined,
  setInputText: (text: string) => void,
  setSelectedImages: (images: string[]) => void,
  setSelectedFiles: React.Dispatch<
    React.SetStateAction<{
      uri: string;
      name: string;
      type: string;
    }[]>
  >
) => {
  if (!sticker) {
    if (!text?.trim()) {
      return;
    }
  }

  try {
    const response = await apiSendMessage({ roomId, content: text, type: "message", sticker });
    if (response.statusCode === 200) {
      socketService.emit(SocketEmit.sendMessage, {
        roomId,
        message: response.data,
      });
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

// Hàm thu hồi tin nhắn
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
      onPress: async () => {
        try {
          const response = await revokeMessage({ messageId: id });
          if (response.statusCode === 200) {
            Toast.show({
              type: "success",
              text1: "Đã thu hồi tin nhắn",
            });
          }
        } catch (error) {
          const e = error as ErrorResponse;
          Toast.show({
            type: "success",
            text1: "Có lỗi xảy ra khi thu hồi tin nhắn",
          });
        }
        setShowActionModal(false);
      },
    },
  ]);
};

// Hàm chỉnh sửa tin nhắn
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

// Hàm hủy chỉnh sửa
const cancelEdit = (
  setEditingMessageId: (id: string | null) => void,
  setEditText: (text: string) => void,
  setInputText: (text: string) => void
) => {
  setEditingMessageId(null);
  setEditText("");
  setInputText("");
};

// Hàm đóng modal hình ảnh
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

// Hàm sao chép tin nhắn
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

// Hàm hiển thị/ẩn thanh tìm kiếm
const toggleSearchBar = (
  showSearchBar: boolean,
  setShowSearchBar: (show: boolean) => void,
  setSearchQuery: (query: string) => void
) => {
  setShowSearchBar(!showSearchBar);
  setSearchQuery("");
};

// Hàm chuyển tiếp tin nhắn
const pushforwardMessage = async ({
  messageId,
  roomId,
  senderId,
  targetRoomId,
}: {
  messageId: string;
  roomId: string;
  senderId: string;
  targetRoomId: string;
}) => {
  try {
    // Gọi lại hàm forwardMessage để chuyển tiếp tin nhắn
    const response = await forwardMessage({ messageId, roomId, senderId });

  } catch (error) {
    const e = error as ErrorResponse;
    throw new Error(e.message || "Lỗi khi gọi API chuyển tiếp tin nhắn");
  }
};

// Hàm xử lý chuyển tiếp tin nhắn
const handleForwardMessage = async (
  messageId: string,
  roomId: string,
  senderId: string,
  targetRoomId: string,
  setShowActionModal: (show: boolean) => void
) => {
  if (!targetRoomId) {
    Toast.show({
      type: "error",
      text1: "Vui lòng chọn phòng để chuyển tiếp",
    });
    return;
  }

  try {
    const forwardedMessage = await pushforwardMessage({ messageId, roomId, senderId, targetRoomId });

    Toast.show({
      type: "success",
      text1: "Tin nhắn đã được chuyển tiếp thành công",
    });

    socketService.emit(SocketEmit.sendMessage, {
      roomId: targetRoomId,
      message: forwardedMessage,
    });
  } catch (error) {
    const e = error as ErrorResponse;
    Toast.show({
      type: "error",
      text1: e.message || "Có lỗi xảy ra khi chuyển tiếp tin nhắn",
    });
  } finally {
    setShowActionModal(false);
  }
};

export {
  getRooms,
  sendMessage,
  handleRecallMessage,
  handleEditMessage,
  cancelEdit,
  closeImageModal,
  copyMessage,
  toggleSearchBar,
  pushforwardMessage,
  handleForwardMessage,
};