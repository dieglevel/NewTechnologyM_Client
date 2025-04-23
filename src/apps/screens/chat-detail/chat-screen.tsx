import { SafeAreaView } from "react-native-safe-area-context";
import ChatDetail from "@/apps/components/chatDetail/chat-detail";
import { ChatScreenRouteProp } from "@/libs/navigation";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { socketService } from "@/libs/socket/socket";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { useDispatch } from "react-redux";
import { initMessage, setMessage } from "@/libs/redux/stores/message-slice";
import { store } from "@/libs/redux/redux.config";
import { getMessageByRoomId } from "@/services/chat";

export const ChatScreen = () => {
	const route = useRoute<ChatScreenRouteProp>();
	const isFocused = useIsFocused();

	useEffect(() => {
		const fetchMessageApi = async () => {
			try {
				const response = await getMessageByRoomId(route.params.room.id || "");
				console.log(route.params.room.id);
				if (response.statusCode === 200 && response.data) {
					console.log("message", response.data);
					store.dispatch(initMessage({ messages: response.data, roomId: route.params.room.id || "" }));
				}
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		};

		socketService.emit(SocketEmit.getMessageByChatRoom, {
			roomId: route.params.room.id,
		});

		socketService.on(SocketOn.getMessageByChatRoom, async (data) => {
			console.log("message socket", data);
			// store.dispatch(setMessage({ messages: data, roomId: route.params.room.id }));
		});

		fetchMessageApi();
	}, [isFocused]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ChatDetail room={route.params.room} />
		</SafeAreaView>
	);
};
