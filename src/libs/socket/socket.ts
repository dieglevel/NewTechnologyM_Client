import { io, Socket } from "socket.io-client";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { IDetailInformation, IFriend, IRequestFriend, IRoom, ISendedFriend } from "@/types/implement";
import { ExpoSecureStoreKeys, getSecure } from "../expo-secure-store/expo-secure-store";
import { deleteMyListFriend, deleteRequestFriend, deleteSendedFriend, fetchDetailInformation, initRoom, setDetailInformation, setMyListFriend, setRequestFriend, setRoom, setSendedFriend } from "../redux/stores";
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

      // console.log("status:", netState.isConnected, netState.isInternetReachable);

      const token = await getSecure(ExpoSecureStoreKeys.AccessToken);
      // console.log("Connecting to socket with token:", token);

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
         // console.log("Connected to server:", data);
      });

      this.socket.emit(SocketEmit.detailInformation, {});
      this.socket.on(SocketOn.updateUserDetailInformation, (data: IDetailInformation) => {
         store.dispatch(setDetailInformation(data));
      });
      // ---------------------------------------------------------------------------------------------------------------------------------------------

      // this.socket.on(SocketOn.myRoom, (data: {
      //    behavior: string, room: IRoom, accountOwner: {
      //       id: string,
      //    }[]
      // }) => {
      //    const room = [data.room];
      //    store.dispatch(setRoom(room));
      // });

      // ---------------------------------------------------------------------------------------------------------------------------------------------

      this.socket.on(SocketOn.myListRoom, (data: IRoom[]) => {
         console.log("My list room updated:", data);
         store.dispatch(initRoom(data));
      });
      // ---------------------------------------------------------------------------------------------------------------------------------------------

      this.socket.on(SocketOn.requestFriend, async (data: {
         behavior: string, data: IRequestFriend
      }) => {
         console.log("Socket REQUESTFRIEND request event:", data);
         if (data.behavior === "add") {
            // console.log("Friend request received:", data.data);
            const friendRequest: IRequestFriend[] = [
               data.data
            ]
            const myAccountId = await getSecure(ExpoSecureStoreKeys.UserId) ?? "`";
            if (data.data.sender_id !== myAccountId) {
               store.dispatch(setRequestFriend(friendRequest));
            }
            const sendedFriend: ISendedFriend = data.data as ISendedFriend;
            const sendedFriends = [sendedFriend]
            store.dispatch(setSendedFriend(sendedFriends));

         }
         else if (data.behavior === "remove") {
            // console.log("Friend request deleted:", data.data);
            store.dispatch(deleteRequestFriend(data.data.sender_id ?? ""));
            store.dispatch(deleteSendedFriend(data.data.receiver_id ?? ""));
         }
      });

      this.socket.on(SocketOn.friend, (data: {
         behavior: string, friend: {
            accountId: string,
            friendId: string,
         }
         detail_friend: IDetailInformation,
         accountOwner: string
      }) => {
         console.log("Socket FRIENDq event:", data);

         if (data.behavior === "add") {
            // console.log("Friend added:", data);
            const friend: IFriend[] = [{
               accountId: data.friend.accountId,
               friendId: data.friend.friendId,
               detail: data.detail_friend,
            }]
            store.dispatch(deleteRequestFriend(data.friend.accountId));
            store.dispatch(deleteSendedFriend(data.friend.accountId));
            store.dispatch(setMyListFriend(friend));
         } else if (data.behavior === "remove") {
            // console.log("Friend deleted:", data.friend);
            store.dispatch(deleteRequestFriend(data.friend.accountId));
            store.dispatch(deleteMyListFriend(data.friend.friendId));
         }
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
