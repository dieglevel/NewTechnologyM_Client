import { ErrorResponse } from "@/libs/axios/axios.config";
import { deleteMessageById, revokeMessage } from "@/services";
import { IMessage } from "@/types/implement";
import { Clipboard } from "react-native";
import Toast from "react-native-toast-message";

export const copyMessage = (
  data: IMessage
) => {
  Clipboard.setString(data.content || "");
  Toast.show({
    type: "success",
    text1: "Sao chép thành công",
  });
};

export const handleRevokeMessage = async (message: IMessage) => {
  try {
    const response = await revokeMessage({ messageId: message._id })
  } catch (e) {
    const error = e as ErrorResponse
  }
}

export const handleRemoveMessageByMyself = async (messageId: string) => {
  try {
    const response = await deleteMessageById({ messageId })
    if (response.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "Đã thu hồi tin nhắn",
      });
    }
  } catch (e) {
    const error = e as ErrorResponse
    console.log("Error when revoke message:", error);
  }
}