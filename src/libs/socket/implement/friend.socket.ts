import { SocketEmit, SocketOn } from "@/constants/socket";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { deleteMyListFriend, deleteRequestFriend, deleteSendedFriend, setMyListFriend, setRequestFriend, setSendedFriend } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { IDetailInformation, IFriend, ISendedFriend } from "@/types/implement";
import { IRequestFriend } from "@/types/implement/response/request-friend.interface";
import { Socket } from "socket.io-client";

export const FriendSocket = (socket: Socket | null) => {
   socket?.on(SocketOn.requestFriend, (data:
      { behavior: string; data: IRequestFriend }
   ) => {
      console.log("Socket - RequestFriend: ", data);

      switch (data.behavior) {
         case "add": {
            const friendRequest: IRequestFriend[] = [data.data];
            const myAccountId = ExpoSecureValueService.getUserId();
            if (data.data.sender_id !== myAccountId) {
               console.log("data in requestFriend add:", friendRequest)
               store.dispatch(setRequestFriend(friendRequest));
            }
            const sendedFriend: ISendedFriend = data.data as ISendedFriend;
            const sendedFriends = [sendedFriend];
            store.dispatch(setSendedFriend(sendedFriends));
            socket.emit(SocketEmit.myListRoom, {
               lastUpdatedAt: "2025-04-10T06:14:28.148+00:00",
            });
            break;
         }
         case "remove": {
            // console.log("Friend request deleted:", data.data);
            store.dispatch(deleteRequestFriend(data.data.sender_id ?? ""));
            store.dispatch(deleteSendedFriend(data.data.receiver_id ?? ""));
            break;
         }
      }

   });

   socket?.on(
      SocketOn.friend,
      (data:
         {
            behavior: string;
            friend: {
               accountId: string;
               friendId: string;
            };
            detail_friend: IDetailInformation;
            accountOwner: string;
         }
      ) => {
         console.log("Socket - Friend:", data);

         switch (data.behavior) {
            case "add": {
               // console.log("Friend added:", data);
               const friend: IFriend[] = [
                  {
                     accountId: data.friend.accountId,
                     friendId: data.friend.friendId,
                     detail: data.detail_friend,
                  },
               ];
               store.dispatch(deleteRequestFriend(data.friend.accountId));
               store.dispatch(deleteSendedFriend(data.friend.accountId));
               store.dispatch(setMyListFriend(friend));
               break;
            }
            case "remove": {
               // console.log("Friend deleted:", data.friend);
               store.dispatch(deleteRequestFriend(data.friend.accountId));
               store.dispatch(deleteMyListFriend(data.friend.friendId));
               break;
            }
         }
      },
   );

}