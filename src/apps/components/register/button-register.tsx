import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface IProps {
  title: string;
  disabled?: boolean;
  onPress: any;
}

export const Button = ({ title, disabled = false, onPress }: IProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonEnabled,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          disabled ? styles.textDisabled : styles.textEnabled,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 32, // mt-8
    borderRadius: 9999, // rounded-full
    paddingVertical: 12, // py-3
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#3b82f6", // bg-blue-500
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db", // bg-gray-300
  },
  text: {
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
  },
  textEnabled: {
    color: "white", // text-white
  },
  textDisabled: {
    color: "#9ca3af", // text-gray-400
  },
});