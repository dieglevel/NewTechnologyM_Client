import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface IProps {
  text: string;
  textLink: string;
  isChecked: boolean;
  onCheck: any;
}

export const TermsCheckBox = ({ text, textLink, isChecked, onCheck }: IProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onCheck(!isChecked)}
    >
      <View
        style={[
          styles.checkbox,
          isChecked ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity>
          <Text style={styles.textLink}>{textLink}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    marginBottom: 12, // mb-3
  },
  checkbox: {
    width: 20, // w-5
    height: 20, // h-5
    borderWidth: 2, // border-2
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 4, // rounded-md
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6", // bg-blue-500
  },
  checkboxUnchecked: {
    backgroundColor: "transparent",
  },
  textContainer: {
    flexDirection: "row", // flex-row
    marginLeft: 8, // ml-2
  },
  text: {
    textAlign: "left", // text-left
    fontSize: 12, // text-xs
  },
  textLink: {
    textAlign: "left", // text-left
    fontSize: 12, // text-xs
    color: "#3b82f6", // text-blue-500
    fontWeight: "bold", // font-bold
    marginLeft: 4, // Add spacing between text and link
  },
});