import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleRecallMessage, handleEditMessage, openImageModal, copyMessage } from "./message-utils";
import { playAudio } from "./audio-utils";
import styles from "./styles";

interface Props {
  item: {
    id: string;
    text: string;
    sender: string;
    time: string;
    read?: boolean;
    avatar: string;
    senderName: string;
    reaction: string | null;
    images?: string[] | null;
    files?: string[] | null;
    audio?: string | null;
    isEdited?: boolean;
  };
  setActionMessage: (message: any) => void;
  setShowActionModal: (show: boolean) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
  setSelectedMessageId: (id: string | null) => void;
  setShowReactionPicker: (show: boolean) => void;
  setShowForwardModal: (show: boolean) => void;
  setEditingMessageId: (id: string | null) => void;
  setEditText: (text: string) => void;
  setInputText: (text: string) => void;
  setShowImageModal: (show: boolean) => void;
  setAllImageUris: (uris: string[]) => void;
  setInitialImageIndex: (index: number) => void;
  setCurrentImageIndex: (index: number) => void;
  showUserInfo: (user: { name: string; avatar: string }) => void;
  setShowUserInfoModal: (show: boolean) => void;
  setSelectedUser: (user: { name: string; avatar: string; status?: string; phone?: string } | null) => void;
  sound: any;
  setSound: (sound: any) => void;
  playingAudioId: string | null;
  setPlayingAudioId: (id: string | null) => void;
  isDark: boolean;
}

const RenderMessageItem: React.FC<Props> = ({
  item,
  setActionMessage,
  setShowActionModal,
  messages,
  setMessages,
  setSelectedMessageId,
  setShowReactionPicker,
  setShowForwardModal,
  setEditingMessageId,
  setEditText,
  setInputText,
  setShowImageModal,
  setAllImageUris,
  setInitialImageIndex,
  setCurrentImageIndex,
  showUserInfo,
  setShowUserInfoModal,
  setSelectedUser,
  sound,
  setSound,
  playingAudioId,
  setPlayingAudioId,
  isDark,
}) => {
  const isMyMessage = item.sender === "me";

  return (
    <View
      style={[
        styles.messageRow,
        {
          justifyContent: isMyMessage ? "flex-end" : "flex-start",
        },
      ]}
    >
      {!isMyMessage && (
        <TouchableOpacity onPress={() => showUserInfo({ name: item.senderName, avatar: item.avatar })}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onLongPress={() => {
          setActionMessage(item);
          setShowActionModal(true);
        }}
        // onPress={() => handleRecallMessage(item.id, isMyMessage, setMessages, setShowActionModal)}
        activeOpacity={0.8}
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
          isDark && {
            backgroundColor: isMyMessage ? "#2563eb" : "#374151",
          },
        ]}
      >
        {!isMyMessage && <Text style={styles.senderName}>{item.senderName}</Text>}
        {item.images && item.images.length > 0 && (
          <View style={styles.imageContainer}>
            {item.images.length === 1 ? (
              <TouchableOpacity onPress={() => openImageModal(item.images ?? [], 0, messages, setAllImageUris, setInitialImageIndex, setCurrentImageIndex, setShowImageModal)}>
                <Image source={{ uri: item.images[0] }} style={styles.singleImage} />
              </TouchableOpacity>
            ) : (
              <View style={styles.imageGrid}>
                {item.images.map((imageUri: string, index: number) => (
                  <TouchableOpacity key={index} onPress={() => openImageModal(item.images ?? [], index, messages, setAllImageUris, setInitialImageIndex, setCurrentImageIndex, setShowImageModal)}>
                    <Image source={{ uri: imageUri }} style={styles.gridImage} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        {item.files && item.files.length > 0 && (
          <View style={styles.fileContainer}>
            {item.files.map((fileUrl: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  alert(`Mở file tại: ${fileUrl}`);
                }}
                style={styles.fileItem}
              >
                <Ionicons name="document-outline" size={20} color="#3b82f6" style={styles.fileIcon} />
                <Text style={styles.fileText}>{fileUrl.split("/").pop()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {item.audio && (
          <View style={styles.audioContainer}>
            <TouchableOpacity
              onPress={() => playAudio(item.audio ?? "", item.id, sound, setSound, playingAudioId, setPlayingAudioId)}
              style={styles.audioButton}
            >
              <Ionicons
                name={playingAudioId === item.id ? "pause" : "play"}
                size={20}
                color="#3b82f6"
                style={styles.audioIcon}
              />
              <Text style={styles.audioText}>Tin nhắn thoại</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.text !== "" && (
          <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
            {item.text}
            {item.isEdited && (
              <Text style={styles.editedLabel}> (đã chỉnh sửa)</Text>
            )}
          </Text>
        )}
        {item.reaction && (
          <Text style={styles.reactionText}>{item.reaction}</Text>
        )}
        <View style={styles.metaInfo}>
          <Text style={styles.timestamp}>{item.time}</Text>
          {item.read && isMyMessage && (
            <MaterialIcons name="check-circle" size={14} color="#3b82f6" style={styles.readIcon} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RenderMessageItem;