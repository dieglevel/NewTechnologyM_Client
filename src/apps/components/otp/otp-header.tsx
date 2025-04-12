import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface HeaderProps {
  textPhone: string;


}

export function OtpHeader({ textPhone }: HeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable}></TouchableOpacity>

      <Text style={styles.title}>Nhập mã xác thực</Text>

      <Text style={styles.description}>
        Nhập dãy 6 số được gửi đến {textPhone} của bạn
      </Text>
      <Text style={styles.phoneNumber}>{textPhone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32, // mb-8
  },
  touchable: {
    marginBottom: 32, // mb-8
  },
  title: {
    fontSize: 24, // text-3xl
    fontWeight: "bold", // font-bold
    textAlign: "center",
    marginBottom: 16, // mb-4
  },
  description: {
    color: "#6B7280", // text-gray-500
    textAlign: "center",
    fontSize: 16, // text-base
  },
  phoneNumber: {
    color: "black", // text-black
    textAlign: "center",
    fontWeight: "500", // font-medium
    fontSize: 16, // text-base
  },
});