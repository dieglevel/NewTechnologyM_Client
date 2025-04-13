import { io, Socket } from "socket.io-client";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { IDetailInformation } from "@/types/implement";
import { ExpoSecureStoreKeys, getSecure } from "../expo-secure-store/expo-secure-store";
import { fetchDetailInformation, setDetailInformation } from "../redux/stores";
import { store } from "../redux/redux.config";
import NetInfo from "@react-native-community/netinfo"; // Thêm dòng này

class SocketService {
   private static instance: SocketService;
   private socket: Socket | null = null;
   private URL = process.env.EXPO_PUBLIC_BACKEND_SOCKET || "";

   private constructor() { }

   public static getInstance(): SocketService {
      if (!SocketService.instance) {
         SocketService.instance = new SocketService();
      }
      return SocketService.instance;
   }

   public async connect() {
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected && netState.isInternetReachable;

      if (this.socket || !isConnected) {
         console.warn("Already connected or offline.");
         store.dispatch(fetchDetailInformation());
         return;
      }

      console.log("status:", netState.isConnected, netState.isInternetReachable);

      const token = await getSecure(ExpoSecureStoreKeys.AccessToken);
      console.log("Connecting to socket with token:", token);

      this.socket = io(this.URL, {
         autoConnect: true,
         extraHeaders: {
            token: `${token}`,
         },
      });

      this.registerCoreEvents();
   }

   private registerCoreEvents() {
      if (!this.socket) return;

      this.socket.emit(SocketEmit.connectServer, {});
      this.socket.on(SocketOn.connectServer, (data) => {
         console.log("Connected to server:", data);
      });

      this.socket.emit(SocketEmit.detailInformation, {});
      this.socket.on(SocketOn.updateUserDetailInformation, (data: IDetailInformation) => {
         store.dispatch(setDetailInformation(data));
      });
   }

   public disconnect() {
      this.socket?.disconnect();
      this.socket = null;
   }

   public getSocket(): Socket | null {
      return this.socket;
   }

   public emit(event: string, data: any) {
      this.socket?.emit(event, data);
   }

   public on(event: string, callback: (...args: any[]) => void) {
      this.socket?.on(event, callback);
   }

   public off(event: string, callback?: (...args: any[]) => void) {
      if (!this.socket) return;
      if (callback) {
         this.socket.off(event, callback);
      } else {
         this.socket.removeAllListeners(event);
      }
   }
}

export const socketService = SocketService.getInstance();
