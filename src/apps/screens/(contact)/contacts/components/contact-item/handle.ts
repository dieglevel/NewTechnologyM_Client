import { ErrorResponse } from "@/libs/axios/axios.config";
import { unFriend } from "@/services";
import { IFriend } from "@/types/implement";
import Toast from "react-native-toast-message";

export const handleUnFriend = async (item: IFriend) => {
   try {
      const response = await unFriend(item.friendId ?? "");
      if (response?.statusCode === 200) {
         Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Hủy kết bạn thành công",
         });
      }
   } catch (error) {
      const e = error as ErrorResponse;
      Toast.show({
         type: "error",
         text1: "Thất bại",
         text2: e.message,
      });
   }
};
