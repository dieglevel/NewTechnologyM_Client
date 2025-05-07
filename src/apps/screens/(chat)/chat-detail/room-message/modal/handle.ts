import { ErrorResponse } from "@/libs/axios/axios.config";
import { revokeMessage } from "@/services";
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