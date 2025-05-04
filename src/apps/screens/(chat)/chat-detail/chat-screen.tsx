import ChatDetail from "@/apps/screens/(chat)/chat-detail/room-message";
import { SafeAreaView } from "react-native-safe-area-context";

export const ChatScreen = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ChatDetail />
		</SafeAreaView>
	);
};
