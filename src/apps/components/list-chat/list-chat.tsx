import { images } from "@/assets/images";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { initRoom, setSelectedRoom } from "@/libs/redux";
import { RootState, store } from "@/libs/redux/redux.config";
import { getProfileFromAnotherUser } from "@/services/auth";
import { getMyListRoom } from "@/services/room";
import { IDetailInformation, IRoom } from "@/types/implement";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { handleForwardMessage } from "./../chatDetail/message-utils";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";

interface IChatItem {
  item: IRoom;
  myUserId: string;
}

const ChatItem = ({ item, myUserId }: IChatItem) => {
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
        () => {} // No modal to close in this context
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
      const account = item.detailRoom.find((detail) => {
        return detail.id !== myUserId;
      });

      return (
        <Image
          source={account?.avatar ? { uri: account?.avatar } : images.avatarDefault}
          style={styles.avatarContainer}
        />
      );
    } else {
      return (
        <Image
          source={item.avatar ? { uri: item?.avatar } : images.group}
          style={[, { width: 30, height: 30 }]}
        />
      );
    }
  };

  const renderName = () => {
    if (item.type === "single") {
      const account = item.detailRoom.find((detail) => {
        return detail.id !== myUserId;
      });
      return account?.fullName || "Unknown User";
    } else {
      return item.name || "Group Chat";
    }
  };

  const renderMessage = () => {
    const message = () => {
      console.log(item.latestMessage);
      if (item.latestMessage?.sticker) {
        return "Đã gửi một nhãn dán";
      }
      if (item.latestMessage?.content) {
        return item.latestMessage.content;
      }
      return null;
    };

    const accountMessage = item.latestMessage?.accountId;

    const account = item.detailRoom.find((detail) => {
      return detail.id === accountMessage;
    });

    return message() !== null && (account ? account?.fullName + ": " + message() : "Bạn: " + message());
  };

  return (
    <TouchableOpacity style={styles.chatItemContainer} onPress={handlePress}>
      <View style={styles.avatarContainer}>{renderAvatar()}</View>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{renderName()}</Text>
        <Text style={styles.chatMessage}>{renderMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ListChat = () => {
  const navigation = useNavigation<StackScreenNavigationProp>();
  const { room, status } = useSelector((state: RootState) => state.room);
  const [searchText, setSearchText] = useState<string>("");
  const [myUserId, setMyUserId] = useState<string>("");
  const isFocused = useIsFocused();

  useEffect(() => {
    const getMyId = async () => {
      const value = await getSecure(ExpoSecureStoreKeys.UserId);
      setMyUserId(value ?? "");
      return;
    };
    const fetchedRoom = async () => {
      const response = await getMyListRoom();
      if (response?.statusCode === 200 && response.data) {
        await store.dispatch(initRoom(response?.data.listRoomResponse || []));
      }
    };
    fetchedRoom();
    getMyId();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="white" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons
          name="qr-code"
          size={20}
          color="white"
          style={styles.icon}
          onPress={() => navigation.push("Qr")}
        />
        <Ionicons name="add" size={24} color="white" style={styles.icon} />
      </View>

      {status === "loading" ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <FlatList
          data={room}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem item={item} myUserId={myUserId} />}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
              <Text style={{ color: "#6b7280", textAlign: "center" }}>
                Không có cuộc trò chuyện nào
              </Text>
            </View>
          )}
          style={styles.chatList}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flex: 1,
            width: "100%",
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  searchBar: {
    flex: 1,
    maxHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    padding: 8,
    width: "100%",
  },
  icon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  chatList: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    width: "100%",
  },
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
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  chatContent: {
    marginLeft: 12,
    flex: 1,
  },
  chatName: {
    fontWeight: "600",
    color: "black",
  },
  chatMessage: {
    color: "#6b7280",
    fontSize: 14,
  },
  chatTime: {
    color: "#9ca3af",
    fontSize: 12,
  },
});

export default ListChat;