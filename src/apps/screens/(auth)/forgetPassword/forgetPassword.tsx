import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/libs/navigation";

export const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation<StackScreenNavigationProp>();

  const handleClearPhoneNumber = () => {
    setPhoneNumber("");
  };

  const handleContinue = () => {
    console.log("Số điện thoại:", phoneNumber);
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Nhập số điện thoại của bạn để nhận mã xác thực
      </Text>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Số điện thoại</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            style={styles.textInput}
            keyboardType="phone-pad"
          />
          {phoneNumber.length > 0 && (
            <TouchableOpacity onPress={handleClearPhoneNumber} style={styles.clearButton}>
              {/* <Icon name="close" size={20} color="gray" /> */}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={phoneNumber.trim() === ""}
        style={[
          styles.continueButton,
          phoneNumber.trim() === "" ? styles.disabledButton : styles.enabledButton,
        ]}
      >
        <Text style={styles.continueText}>Tiếp tục</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // bg-white
    paddingHorizontal: 24, // px-6
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "bold", // font-bold
    textAlign: "center",
    marginTop: 48, // mt-12
    color: "#3b82f6", // text-blue-500
  },
  inputSection: {
    marginTop: 40, // mt-10
  },
  label: {
    fontSize: 16, // text-base
    color: "#1f2937", // text-gray-800
    marginBottom: 8, // mb-2
  },
  inputContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    borderWidth: 1, // border
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
  },
  textInput: {
    flex: 1, // flex-1
    fontSize: 16, // text-base
  },
  clearButton: {
    marginLeft: 8, // ml-2
  },
  continueButton: {
    marginTop: 32, // mt-8
    padding: 16, // p-4
    borderRadius: 8, // rounded-lg
    alignItems: "center", // items-center
  },
  enabledButton: {
    backgroundColor: "#3b82f6", // bg-blue-500
  },
  disabledButton: {
    backgroundColor: "#d1d5db", // bg-gray-300
  },
  continueText: {
    color: "white", // text-white
    fontSize: 18, // text-lg
    fontWeight: "500", // font-medium
    textAlign: "center",
  },
});