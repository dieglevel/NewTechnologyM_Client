import Toast from "react-native-toast-message";
import { forwardMessage } from "@/services";
import { ErrorResponse } from "@/libs/axios/axios.config";

export const handleForwardMessage = async (
   messageId: string,
   roomId: string,
   // targetRoomId: string,
) => {
   // if (!targetRoomId) {
   //    Toast.show({
   //       type: "error",
   //       text1: "Vui lòng chọn phòng để chuyển tiếp",
   //    });
   //    return;
   // }

   try {
      const response = await forwardMessage({ messageId, roomId });
      if (response.statusCode === 200) {
         Toast.show({
            type: "success",
            text1: "Tin nhắn đã được chuyển tiếp thành công",
         });
      }

   } catch (error) {
      const e = error as ErrorResponse;
      Toast.show({
         type: "error",
         text1: e.message || "Có lỗi xảy ra khi chuyển tiếp tin nhắn",
      });
   }
};
