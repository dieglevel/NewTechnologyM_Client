import React from "react";
import { View, Image } from "react-native";
import styles from "./styles";

const RenderImageItem = ({ item }: { item: string }) => (
  <View style={styles.fullScreenImageContainer}>
    <Image
      source={{ uri: item }}
      style={styles.fullScreenImage}
      resizeMode="contain"
    />
  </View>
);

export default RenderImageItem;