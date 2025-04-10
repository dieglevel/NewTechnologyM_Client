import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export function ActionButtons() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.marginRight]}>
        <Text style={styles.text}>Gửi tin nhắn</Text>
      </TouchableOpacity>
      <View style={styles.divider}></View>
      <TouchableOpacity style={[styles.button, styles.marginLeft]}>
        <Text style={styles.text}>Gọi tổng đài</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: "#eaeff5",
    paddingTop: 8, // pt-2
  },
  button: {
    flex: 1,
  },
  marginRight: {
    marginRight: 8, // mr-2
  },
  marginLeft: {
    marginLeft: 8, // ml-2
  },
  text: {
    color: "#3b82f6", // text-blue-500
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16, // text-base
  },
  divider: {
    backgroundColor: "#eaeff5",
    width: 2, // w-[2]
  },
});