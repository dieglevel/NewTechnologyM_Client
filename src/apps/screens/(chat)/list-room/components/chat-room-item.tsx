import { StackScreenNavigationProp } from "@/libs/navigation";
import { setSelectedRoom } from "@/libs/redux";
import { IRoom } from "@/types/implement";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { images } from "@/assets/images";
import { handleForwardMessage } from "@/apps/screens/(chat)/chat-detail/room-message/message-utils";

interface IChatItem {
   item: IRoom;
   myUserId: string | null;
}

export const ChatItem = ({ item, myUserId }: IChatItem) => {
   const navigation = useNavigation<StackScreenNavigationProp>();
   const dispatch = useDispatch();
   const route = useRoute<any>();

   const handlePress = () => {
      const { forwardMessage, senderId, roomId } = route.params || {};
      if (forwardMessage) {
         // Handle forwarding message
         handleForwardMessage(
            forwardMessage._id,
            roomId,
            senderId,
            item.id,
            () => {}, // No modal to close in this context
         );
         navigation.goBack();
      } else {
         // Normal chat navigation
         dispatch(setSelectedRoom(item));
         navigation.navigate("ChatScreen", { room: item });
      }
   };

   const renderAvatar = () => {
      if (item.type === "single") {
         const account = item.detailRoom?.find((detail) => {
            return detail.id !== myUserId;
         });

         return (
            <Image
               source={account?.avatar ? { uri: account?.avatar } : images.avatarDefault}
               style={styles.avatar}
            />
         );
      } else {
         return (
            <Image
               source={item.avatar ? { uri: item?.avatar } : images.group}
               style={[, { width: 30, height: 30 }, item.avatar && styles.avatar]}
            />
         );
      }
   };

   const renderName = () => {
      if (item.type === "single") {
         const account = item.detailRoom?.find((detail) => {
            return detail.id !== myUserId;
         });
         return account?.fullName || "Unknown User";
      } else {
         return item.name || "Group Chat";
      }
   };

   const renderMessage = () => {
      const message = () => {
         if(item.latestMessage?.isRevoked) {
            return "Đã thu hồi tin nhắn"
         }
         if (item.latestMessage?.sticker) {
            return "Đã gửi một nhãn dán";
         }
         if (item.latestMessage?.content) {
            return item.latestMessage.content;
         }
         if (item.latestMessage?.files){
            return "Đã gửi tệp"
         }
         return null;
      };

      const accountMessage = item.latestMessage?.accountId;

      const account = item.detailRoom?.find((detail) => {
         return detail.id === accountMessage;
      });

      return message() !== null
         ? account
            ? account?.fullName + ": " + message()
            : "Bạn: " + message()
         : "Chưa có tin nhắn";
   };

   return (
      <TouchableOpacity
         style={styles.chatItemContainer}
         onPress={handlePress}
      >
         <View style={styles.avatarContainer}>{renderAvatar()}</View>
         <View style={styles.chatContent}>
            <Text style={styles.chatName}>{renderName()}</Text>
            <Text style={styles.chatMessage}>{renderMessage()}</Text>
         </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
	chatItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "white",
	},
   avatarContainer: {
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#3b82f6",
	},	chatContent: {
		marginLeft: 12,
		flex: 1,
	},	chatName: {
		fontWeight: "600",
		color: "black",
	},
	chatMessage: {
		color: "#6b7280",
		fontSize: 14,
	},	avatar: {
		width: 48,
		height: 48,
		objectFit: "cover",
		borderRadius: 999,
		borderWidth: 2,
		borderColor: "#3b82f6",
	},
})