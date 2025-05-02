import { SocketEmit, SocketOn } from "@/constants/socket";
import { Socket } from "socket.io-client";


export const ConnectServerSocket = (socket: Socket | null) => {
   socket?.emit(SocketEmit.connectServer, {});
   socket?.on(SocketOn.connectServer, (data) => {
      console.log("Connected to server:", data);
   });

}