import { FlatList, Modal, TouchableOpacity, View, Text, Share } from "react-native";
import styles from "../styles";
import RenderActionItem from "./render-action-item";
import { IMessage, IRoom } from "@/types/implement";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { copyMessage, handlePinMessage, handleRemoveMessageByMyself, handleRevokeMessage, handleUnpinMessage } from "./handle";
import { store, useAppSelector } from "@/libs/redux/redux.config";
import Toast from "react-native-toast-message";
import { ForwardMessageModal } from "./forward-message/forward-message-modal";
import { useState, useEffect } from "react";
import { setRoom } from "@/libs/redux";

interface Props {
  data: IMessage[];
  setData: React.Dispatch<React.SetStateAction<IMessage[]>>;
  showActionModal: boolean;
  setShowActionModalAction: React.Dispatch<React.SetStateAction<boolean>>;
  actionMessage: IMessage | null;
  setActionMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
  pinnedMessage: IMessage | null;
  setPinnedMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
  chatRoomId: string;
}

export const ActionModalMessage = ({
  data,
  setData,
  showActionModal,
  setShowActionModalAction,
  actionMessage,
  setActionMessage,
  pinnedMessage,
  setPinnedMessage,
  chatRoomId,
}: Props) => {
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const { room } = useAppSelector((state) => state.room);
  const [showForwardModal, setShowForwardModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await ExpoSecureValueService.getUserId();
      setMyUserId(id);
    };
    fetchUserId();
  }, []);

  const handlePinToggle = async () => {
    if (!actionMessage) return;

    try {
      if (pinnedMessage && pinnedMessage._id === actionMessage._id) {
        await handleUnpinMessage(actionMessage, chatRoomId);
        setPinnedMessage(null);
        setData((prevData) =>
          prevData.map((msg) =>
            msg._id === actionMessage._id ? { ...msg, isPinned: false } : msg
          )
        );

        Toast.show({
          text1: "Đã bỏ ghim tin nhắn",
          type: "info",
        });
      } else {
        await handlePinMessage(actionMessage, chatRoomId);
        setPinnedMessage(actionMessage);
        setData((prevData) =>
          prevData.map((msg) =>
            msg._id === actionMessage._id ? { ...msg, isPinned: true } : msg
          )
        );

        Toast.show({
          text1: "Đã ghim tin nhắn",
          type: "success",
        });
      }

      setShowActionModalAction(false);
    } catch (error) {
      console.log("Error toggling pin:", error);
      Toast.show({
        type: "error",
        text1: "Không thể ghim/bỏ ghim tin nhắn",
        text2: "Vui lòng thử lại",
      });
    }
  };

  const handleShareMessage = async () => {
    if (!actionMessage) return;

    try {
      const shareOptions = {
        message: actionMessage.content || "", // Nội dung tin nhắn
        // Nếu có file (hình ảnh, video, v.v.), bạn có thể thêm vào
        url: actionMessage.files?.[0]?.url || "", // Chia sẻ URL của file đầu tiên nếu có
        title: "Chia sẻ từ ứng dụng chat",
      };

      await Share.share(shareOptions);
      setShowActionModalAction(false);
      Toast.show({
        type: "success",
        text1: "Đã mở chia sẻ",
      });
    } catch (error) {
      console.log("Error sharing message:", error);
      Toast.show({
        type: "error",
        text1: "Không thể chia sẻ tin nhắn",
        text2: "Vui lòng thử lại",
      });
    }
  };

  const getActionItems = () => {
    if (!actionMessage || !myUserId) return [];

    const isMyMessage = actionMessage.accountId === myUserId;
    const items: { icon: string; label: string; onPress: () => void }[] = [];

    !actionMessage.isRevoked &&
      !actionMessage.sticker &&
      items.push({
        icon: "copy-outline",
        label: "Sao chép",
        onPress: () => {
          copyMessage(actionMessage);
          setShowActionModalAction(false);
        },
      });

    !actionMessage.isRevoked &&
      isMyMessage &&
      items.push({
        icon: "pin-outline",
        label: pinnedMessage?._id === actionMessage._id ? "Bỏ ghim tin nhắn" : "Ghim tin nhắn",
        onPress: handlePinToggle,
      });

    !actionMessage.isRevoked &&
      items.push({
        icon: "share-outline",
        label: "Chuyển tiếp",
        onPress: () => {
          if (!room || room.length === 0) {
            Toast.show({
              text1: "Không có phòng nào để chọn",
              type: "info",
            });
          } else {
            setShowForwardModal(true);
            setShowActionModalAction(false);
          }
        },
      });

    // Thêm mục chia sẻ lên các nền tảng khác
    !actionMessage.isRevoked &&
      items.push({
        icon: "share-social-outline",
        label: "Chia sẻ lên nền tảng khác",
        onPress: handleShareMessage,
      });

    !actionMessage.isRevoked &&
      isMyMessage &&
      items.push({
        icon: "trash-outline",
        label: "Thu hồi",
        onPress: () => {
          try {
            handleRevokeMessage(actionMessage);
            setShowActionModalAction(false);
          } catch (e) {
            console.log("Error revoking message", e);
          }
        },
      });

    !actionMessage.isRevoked &&
      isMyMessage &&
      items.push({
        icon: "trash-outline",
        label: "Thu hồi chỉ mình tôi",
        onPress: () => {
          try {
            handleRemoveMessageByMyself(actionMessage._id);
            setData((prev) => prev.filter((item) => item._id !== actionMessage._id));
            setShowActionModalAction(false);

            let newRoom: IRoom | null = room?.find((item) => item.id === actionMessage.roomId) || null;

            if (newRoom) {
              newRoom.latestMessage = {
                ...newRoom.latestMessage,
                _id: actionMessage._id,
                type: newRoom.latestMessage?.type || "mixed",
                isRevoked: true,
                chatRoomId: newRoom.latestMessage?.chatRoomId ?? chatRoomId,
              };

              store.dispatch(setRoom([newRoom]));
            }
          } catch (e) {
            console.log("Error removing message for myself", e);
          }
        },
      });

    return items;
  };

  const isDark = false;

  return (
    <>
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.actionModalContainer}
          onPress={() => setShowActionModalAction(false)}
        >
          <View style={[styles.actionModalContent, isDark && styles.darkActionModalContent]}>
            <FlatList
              data={getActionItems()}
              renderItem={({ item }) => <RenderActionItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.actionListContent}
            />
          </View>
        </TouchableOpacity>
        <Toast />
      </Modal>

      <ForwardMessageModal
        actionMessage={actionMessage}
        setActionMessageAction={setActionMessage}
        setShowForwardModalAction={setShowForwardModal}
        showForwardModal={showForwardModal}
      />
    </>
  );
};