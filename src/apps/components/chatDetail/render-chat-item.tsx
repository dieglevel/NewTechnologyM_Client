import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

interface Props {
  item: { id: string; name: string; avatar: string };
  forwardMessage: () => void;
  isDark?: boolean;
}

const RenderChatItem: React.FC<Props> = ({ item, forwardMessage, isDark }) => (
  <TouchableOpacity style={styles.chatItem} onPress={forwardMessage}>
    <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
    <Text style={[styles.chatName, isDark && styles.darkChatName]}>{item.name}</Text>
  </TouchableOpacity>
);

export default RenderChatItem;