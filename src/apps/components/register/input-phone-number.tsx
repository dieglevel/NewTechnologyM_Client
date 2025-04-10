import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

interface Props {
  onChangePhone: (value: string) => void;
  numPhone: string;
}

export const InputPhoneNumber = ({ numPhone, onChangePhone }: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập số điện thoại</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.inputFocused : styles.inputBlurred,
        ]}
      >
        <Text style={styles.countryCode}>+84</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={numPhone}
          onChangeText={onChangePhone}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // mb-5
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    textAlign: "center",
    marginBottom: 20, // mb-5
  },
  inputContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    borderWidth: 1, // border
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 12, // px-3
  },
  inputFocused: {
    borderColor: "#3b82f6", // border-blue-500
  },
  inputBlurred: {
    borderColor: "#d1d5db", // border-gray-300
  },
  countryCode: {
    fontSize: 16, // text-base
    marginRight: 8, // mr-2
  },
  textInput: {
    flex: 1, // flex-1
    fontSize: 16, // text-base
  },
});