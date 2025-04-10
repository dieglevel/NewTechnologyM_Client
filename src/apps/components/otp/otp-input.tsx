import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface OTPInputProps {
  otp: string[];
  inputRefs: any[];
  handleOtpChange: (value: string, index: number) => void;
}

export function OTPInput({ otp, inputRefs, handleOtpChange }: OTPInputProps) {
  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={[
            styles.input,
            digit ? styles.inputActive : styles.inputInactive,
          ]}
          maxLength={1}
          keyboardType="number-pad"
          value={digit}
          onKeyPress={(e) => handleOtpChange(e.nativeEvent.key, index)}
          onChangeText={(value) => handleOtpChange(value, index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20, // mb-5
  },
  input: {
    width: 48, // w-12
    height: 56, // h-14
    borderWidth: 2, // border-2
    borderRadius: 8, // rounded-lg
    textAlign: "center", // text-center
    fontSize: 18, // text-lg
    marginHorizontal: 4, // space-x-2
  },
  inputActive: {
    borderColor: "#3b82f6", // border-blue-500
  },
  inputInactive: {
    borderColor: "#d1d5db", // border-gray-300
  },
});