import { io, Socket } from "socket.io-client";
import { ConnectServerSocket } from "./implement/connect-server.socket";
import { DetailInformationSocket } from "./implement/my-detail-information.socket";
import { MyListRoomSocket } from "./implement/my-list-room.socket";
import { FriendSocket } from "./implement/friend.socket";
import NetInfo from "@react-native-community/netinfo";
import { ExpoSecureStoreKeys, getSecure } from "../expo-secure-store/expo-secure-store";
import { store } from "../redux/redux.config";
import { fetchDetailInformation } from "../redux";

class SocketService {
	private static instance: SocketService;
	private socket: Socket | null = null;
	private URL = process.env.EXPO_PUBLIC_BACKEND_SOCKET || "";

	private constructor() { }

	public static getInstance(): SocketService {
		if (!SocketService.instance) {
			SocketService.instance = new SocketService();

			SocketService.instance.connect();
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

		const token = await getSecure(ExpoSecureStoreKeys.AccessToken);

		this.socket = io(this.URL, {
			autoConnect: true,
			extraHeaders: {
				token: `${token}`,
			},
		});
		this.registerCoreEvents();

		console.log("Socket connected:", this.socket.id);

		setInterval(async () => {
			const netState = await NetInfo.fetch();
			const isConnected = netState.isConnected && netState.isInternetReachable;
			if (!isConnected && this.socket) {
				this.disconnect();
				console.warn("Network disconnected. Socket closed.");
			} else if (isConnected && !this.socket) {
				console.warn("Network reconnected. Reconnecting socket...");
				this.connect();
			}
		}, 5000);
	}

	private registerCoreEvents() {
		if (!this.socket) return;

		ConnectServerSocket(this.socket);

		// ---------------------------------------------------------------------------------------------------------------------------------------------

		DetailInformationSocket(this.socket)

		// ---------------------------------------------------------------------------------------------------------------------------------------------

		MyListRoomSocket(this.socket)

		// ---------------------------------------------------------------------------------------------------------------------------------------------

		FriendSocket(this.socket)
	}

	public disconnect() {
		this.socket?.disconnect();
		this.socket = null;
		console.log("Socket disconnected.");
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
