import { SocketEmit, SocketOn } from "@/constants/socket";
import { deleteRoom, setRoom, updateRoom } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { IDetailAccountRoom, IRoom } from "@/types/implement";
import { Socket } from "socket.io-client";

export const MyListRoomSocket = (socket: Socket | null) => {
   socket?.emit(SocketEmit.myListRoom, {});
   socket?.on(SocketOn.myListRoom,async (data: {
      accountOwner: {
         id: string, fullName: string, avatarUrl: string, role: string
      }[], behavior: "add" | "update" | "delete" | "disband", room: IRoom
   }) => {
      console.log("Socket - MyListRoom:", data);

      const detailRoom: IDetailAccountRoom[] = data.accountOwner.map((account) => ({
         id: account.id,
         fullName: account.fullName,
         avatar: account.avatarUrl,
         role: account.role,
      }));

      const roomtemp: IRoom = {
         ...data.room,
         detailRoom: detailRoom
      }

      console.log("Socket - MyListRoom - roomtemp:", roomtemp);

      switch (data.behavior) {
         case "add": {
            const data = await store.dispatch(setRoom([roomtemp]))

            console.log("Socket - MyListRoom - add:", data);
            break;
         }
         case "update": {
            await store.dispatch(updateRoom([roomtemp]))
            break;
         }
         // case "delete": {
         //    store.dispatch(deleteRoom())
         // }
      }
   });

}