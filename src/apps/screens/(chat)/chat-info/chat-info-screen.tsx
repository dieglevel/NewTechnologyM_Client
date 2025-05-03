import ChatInfo from "@/apps/components/chat-info/chat-info";
import { SafeAreaView } from "react-native-safe-area-context";

export const ChatInfoScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatInfo/>
    </SafeAreaView>
  );
};
