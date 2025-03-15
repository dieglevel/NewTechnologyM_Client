import { SafeAreaView } from "react-native-safe-area-context";
import ChatDetail from "@/apps/components/chatDetail/chat-screen";

export const ChatScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatDetail />
    </SafeAreaView>
  );
};
