import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

interface IProps {
  text: string;
  textLink: string;
  onPress?: () => void;
}

export const FooterLink = ({ text, textLink, onPress }: IProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.textLink}>{textLink}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // flex-row
    justifyContent: "center", // justify-center
    alignItems: "center", // items-center
    marginTop: 16, // mt-4
  },
  text: {
    color: "black", // text-black
    fontSize: 14, // text-sm
  },
  textLink: {
    color: "#3b82f6", // text-blue-500
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
    marginLeft: 4, // Add spacing between text and link
  },
});