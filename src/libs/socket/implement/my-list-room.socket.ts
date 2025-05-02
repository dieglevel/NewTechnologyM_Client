import { SocketEmit, SocketOn } from "@/constants/socket";
import { Socket } from "socket.io-client";

export const MyListRoomSocket = (socket: Socket | null) => {
   socket?.emit(SocketEmit.myListRoom, {});
   socket?.on(SocketOn.myListRoom, (data: any) => {
      console.log("Socket - MyListRoom:", data);
   });

}