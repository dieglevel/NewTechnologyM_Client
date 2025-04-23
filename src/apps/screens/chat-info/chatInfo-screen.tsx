import ChatInfo from "@/apps/components/chatInfo/chat-info";
import { SafeAreaView } from "react-native-safe-area-context";

export const ChatInfoScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatInfo/>
    </SafeAreaView>
  );
};
