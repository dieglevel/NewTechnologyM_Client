// import { io, Socket } from "socket.io-client";
// import { LocalStorage } from "@/lib/local-storage";
// import { SocketEmit, SocketOn } from "@/constants/socket";
// import { store } from "@/redux/store";
// import { setDetailInformation, fetchDetailInformation } from "@/redux/store/models";
// import { IDetailInformation } from "@/types/implement";

// class SocketService {
//   private static instance: SocketService;
//   private socket: Socket | null = null;
//   private URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

//   private constructor() {}

//   public static getInstance(): SocketService {
//     if (!SocketService.instance) {
//       SocketService.instance = new SocketService();
//     }
//     return SocketService.instance;
//   }

//   public connect() {
//     if (this.socket || !navigator.onLine) {
//       console.warn("Already connected or offline.");
//       store.dispatch(fetchDetailInformation());
//       return;
//     }

//     const token = localStorage.getItem(LocalStorage.token);

//     this.socket = io(this.URL, {
//       autoConnect: true,
//       extraHeaders: {
//         token: `${token}`,
//       },
//     });

//     this.registerCoreEvents();
//   }

//   private registerCoreEvents() {
//     if (!this.socket) return;

//     this.socket.emit(SocketEmit.connectServer, {});
//     this.socket.on(SocketOn.connectServer, (data) => {
//       console.log("Connected to server:", data);
//     });

//     this.socket.emit(SocketEmit.detailInformation, {});
//     this.socket.on(SocketOn.updateUserDetailInformation, (data: IDetailInformation) => {
//       console.log("User detail info updated:", data);
//       store.dispatch(setDetailInformation(data));
//     });
//   }

//   public disconnect() {
//     this.socket?.disconnect();
//     this.socket = null;
//   }

//   public getSocket(): Socket | null {
//     return this.socket;
//   }

//   public emit(event: string, data: any) {
//     this.socket?.emit(event, data);
//   }

//   public on(event: string, callback: (...args: any[]) => void) {
//     this.socket?.on(event, callback);
//   }

//   public off(event: string, callback?: (...args: any[]) => void) {
//     if (!this.socket) return;
//     if (callback) {
//       this.socket.off(event, callback);
//     } else {
//       this.socket.removeAllListeners(event);
//     }
//   }
// }

// export const socketService = SocketService.getInstance();