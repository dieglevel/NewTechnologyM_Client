import { ErrorResponse } from "@/libs/axios/axios.config";
import { socketService } from "@/libs/socket/socket";
import * as Sharing from "expo-sharing";
import {
  deleteMessageById,
  revokeMessage,
  createPinnedMessage,
  removePinnedMessage,
  getPinnedMessages,
} from "@/services";
import { IMessage } from "@/types/implement";
import { Clipboard, Share } from "react-native";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";

export const copyMessage = (data: IMessage) => {
  Clipboard.setString(data.content || "");
  Toast.show({
    type: "success",
    text1: "Sao chép thành công",
  });
};

export const handleRevokeMessage = async (message: IMessage) => {
  try {
    await revokeMessage({ messageId: message._id });
  } catch (e) {
    const error = e as ErrorResponse;
    console.error("Error when revoking message:", error);
  }
};

export const handleRemoveMessageByMyself = async (messageId: string) => {
  try {
    const response = await deleteMessageById({ messageId });
    if (response.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Đã thu hồi tin nhắn",
      });
    }
  } catch (e) {
    const error = e as ErrorResponse;
    console.log("Error when revoke message:", error);
  }
};

export const handlePinMessage = async (message: IMessage, chatRoomId: string) => {
  try {
    if (!message._id) throw new Error("Thiếu ID tin nhắn");
    if (!chatRoomId || chatRoomId.trim() === "") throw new Error("Không tìm thấy ID phòng chat");

    const response = await createPinnedMessage({
      messageId: message._id,
      chatRoomId,
    });

    if (response.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Tin nhắn đã được ghim",
      });

      // Gửi sự kiện socket đến các thành viên trong phòng
      socketService.emit("pinMessage", {
        message: { ...message, isPinned: true },
        chatRoomId,
      });

      // Cập nhật danh sách tin nhắn ghim trên client
      const pinnedResponse = await getPinnedMessages(chatRoomId);
      if (pinnedResponse.statusCode === 200 && pinnedResponse.data) {
        // Cập nhật danh sách tin nhắn ghim (sẽ xử lý ở ChatDetail)
      }
    }
  } catch (error) {
    const err = error as ErrorResponse;
    console.log("Error when pinning message:", err);
    Toast.show({
      type: "error",
      text1: "Ghim tin nhắn thất bại",
      text2: err?.response?.data?.message || err.message || "Lỗi máy chủ",
    });
  }
};

export const handleUnpinMessage = async (message: IMessage, chatRoomId: string) => {
  try {
    if (!message._id) throw new Error("Thiếu ID tin nhắn");
    if (!chatRoomId || chatRoomId.trim() === "") throw new Error("Không tìm thấy ID phòng chat");

    const response = await removePinnedMessage({
      messageId: message._id,
      chatRoomId,
    });

    if (response.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Đã bỏ ghim tin nhắn",
      });

      // Gửi sự kiện socket đến các thành viên trong phòng
      socketService.emit("unpinMessage", {
        chatRoomId,
      });

      // Nếu dùng Redux hoặc store local
      // store.dispatch(clearPinnedMessage({ chatRoomId }));
    }
  } catch (error) {
    const err = error as ErrorResponse;
    console.log("Error when unpinning message:", err);
    Toast.show({
      type: "error",
      text1: "Bỏ ghim thất bại",
      text2: err?.response?.data?.message || err.message || "Đã xảy ra lỗi",
    });
  }
};

export const handleShareMessage = async (message: IMessage) => {
  try {
    // Nếu là tin nhắn chứa file
    if (message.files && message.files.length > 0) {
      const fileUrl = message.files[0].url;

      if (!FileSystem.documentDirectory) {
        throw new Error("Không thể xác định thư mục lưu trữ tệp.");
      }
      const fileUri = FileSystem.documentDirectory + (message.files[0].name || "shared-file");

      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        fileUri
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult) {
        throw new Error("Tải file thất bại.");
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          dialogTitle: "Chia sẻ file từ ứng dụng chat",
        });

        Toast.show({
          type: "success",
          text1: "Đã chia sẻ file thành công",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Thiết bị không hỗ trợ chia sẻ file",
        });
      }
    } else {
      // Nếu chỉ là tin nhắn văn bản
      await Share.share({
        message: message.content || "",
        title: "Chia sẻ từ ứng dụng chat",
      });

      Toast.show({
        type: "success",
        text1: "Tin nhắn đã được chia sẻ",
      });
    }
  } catch (error) {
    console.log("Error sharing message:", error);
    Toast.show({
      type: "error",
      text1: "Chia sẻ tin nhắn thất bại",
      text2: "Vui lòng thử lại sau",
    });
  }
};