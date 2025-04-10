import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActionButtons } from "./otp-action-button";

export function InfoBox() {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.marginBottom]}>
        Để lấy mã xác thực, bạn cần:
      </Text>
      <Text style={styles.text}>
        Soạn <Text style={styles.bold}>ZALO</Text> gửi{" "}
        <Text style={styles.bold}>6020</Text> (1000đ/tin nhắn) hoặc gọi đến tổng đài{" "}
        <Text style={styles.bold}>19001223</Text> (1000đ/phút) và làm theo hướng dẫn
      </Text>
      <ActionButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f7fb", // bg-[#f2f7fb]
    padding: 16, // p-4
    borderRadius: 8, // rounded-lg
    marginTop: 24, // mt-6
  },
  text: {
    color: "#4B5563", // text-gray-700
    fontSize: 16, // text-base
  },
  marginBottom: {
    marginBottom: 16, // mb-4
    paddingTop: 8, // pt-2
  },
  bold: {
    fontWeight: "bold", // font-bold
  },
});