import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface VerificationModalProps {
  visible: boolean;
  phoneNumber: string;
  onContinue: () => void;
  onChangeNumber: () => void;
  onClose: () => void;
}

export const VerificationModal = ({
  visible,
  phoneNumber,
  onContinue,
  onChangeNumber,
  onClose,
}: VerificationModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {`Nhận mã xác thực qua số\n${phoneNumber}?`}
          </Text>

          <Text style={styles.description}>
            Zalo sẽ gửi mã xác thực cho bạn qua số điện thoại này
          </Text>
          <View style={styles.divider}></View>

          <TouchableOpacity
            onPress={onContinue}
            style={[styles.button, styles.continueButton]}
          >
            <Text style={styles.continueText}>Tiếp tục</Text>
          </TouchableOpacity>
          <View style={styles.divider}></View>
          <TouchableOpacity
            onPress={onChangeNumber}
            style={[styles.button, styles.changeButton]}
          >
            <Text style={styles.changeText}>Đổi số khác</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // bg-black/50
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12, // px-12
  },
  modalContainer: {
    width: "100%", // w-full
    backgroundColor: "white", // bg-white
    borderRadius: 16, // rounded-xl
    paddingHorizontal: 20, // px-5
    paddingTop: 20, // pt-5
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    marginBottom: 8, // mb-2
    textAlign: "center",
  },
  description: {
    color: "#6B7280", // text-gray-600
    marginBottom: 24, // mb-6
    textAlign: "center",
  },
  divider: {
    borderTopWidth: 2, // border-t-2
    borderColor: "#f6f6f6", // border-[#f6f6f6]
  },
  button: {
    width: "100%", // w-full
    paddingVertical: 12, // py-3
    alignItems: "center",
  },
  continueButton: {
    borderRadius: 8, // rounded-lg
    marginBottom: 4, // mb-1
  },
  continueText: {
    color: "#3b82f6", // text-blue-500
    fontWeight: "600", // font-semibold
    textAlign: "center",
  },
  changeButton: {
    marginBottom: 12, // mb-3
  },
  changeText: {
    fontWeight: "600", // font-semibold
    textAlign: "center",
  },
});