import { SafeAreaView } from "react-native-safe-area-context";
import ChatDetail from "@/apps/components/chatDetail/chat-detail";
import { ChatScreenRouteProp } from "@/libs/navigation";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { socketService } from "@/libs/socket/socket";
import { SocketEmit, SocketOn } from "@/constants/socket";
import { useDispatch } from "react-redux";
import { store } from "@/libs/redux/redux.config";
import { getMessageByRoomId } from "@/services/message";

export const ChatScreen = () => {
	const route = useRoute<ChatScreenRouteProp>();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ChatDetail  />
		</SafeAreaView>
	);
};
