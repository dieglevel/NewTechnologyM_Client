import { SocketEmit, SocketOn } from "@/constants/socket";
import { deleteRoom, setRoom } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { IRoom } from "@/types/implement";
import { Socket } from "socket.io-client";

export const MyListRoomSocket = (socket: Socket | null) => {
   socket?.emit(SocketEmit.myListRoom, {});
   socket?.on(SocketOn.myListRoom, (data: { accountOwner: string[], behavior: "add" | "update" | "delete" | "disband", room: IRoom }) => {
      console.log("Socket - MyListRoom:", data);
      switch (data.behavior) {
         case "add": {
            store.dispatch(setRoom([data.room]))
            break;
         }
         case "update": {
            store.dispatch(setRoom([data.room]))
            break;
         }
         // case "delete": {
         //    store.dispatch(deleteRoom())
         // }
      }
   });

}