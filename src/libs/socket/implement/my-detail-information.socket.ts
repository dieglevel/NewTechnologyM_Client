import { SocketEmit, SocketOn } from "@/constants/socket";
import { initDetailInformation } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { IDetailInformation } from "@/types/implement";
import { Socket } from "socket.io-client";

export const DetailInformationSocket = (socket: Socket | null) => {
   socket?.on(SocketOn.updateUserDetailInformation, (data: IDetailInformation) => {
      console.log("Socket - MyDetailInformation:", data);
      store.dispatch(initDetailInformation(data));
   });
}