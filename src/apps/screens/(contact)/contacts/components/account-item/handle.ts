import { ErrorResponse } from "@/libs/axios/axios.config";
import { sendRequestFriend } from "@/services";
import { IFriend, ISendedFriend } from "@/types/implement";
import { ISearchAccount } from "@/types/implement/response";
import Toast from "react-native-toast-message";

export const handleSubmit = async (data: ISearchAccount) => {
   try {
      const response = await sendRequestFriend(data.id, "Kết bạn với tôi nhé");
      if (response.statusCode === 201) {
         Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Gửi lời mời kết bạn thành công",
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

export const checkSendedFriend = (sendedFriends: ISendedFriend[] | null, data: ISearchAccount, myListFriend: IFriend[] | null) => {
   if (sendedFriends) {
      const sendedFriend = sendedFriends.find((friend) => friend.receiver_id === data.id);
      if (sendedFriend) {
         return true;
      }
   }

   if (myListFriend) {
      const myFriend = myListFriend.find((friend) => friend.accountId === data.id);
      if (myFriend) {
         return true;
      }
   }

   return false;
};
