import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UpdateProfileComponentProps {
 
}

export const UpdateProfileComponent = () => {
  const [name, setName] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>
      </View>

      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          {/* <Image source={{ uri: user.mainAvatar }} style={styles.avatar} /> */}
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <TextInput
            value={name}
            style={styles.input}
            placeholder="Nhập họ tên"
          />
          <Ionicons name="pencil-outline" size={20} color="gray" />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={dob}
            style={styles.input}
            placeholder="DD/MM/YYYY"
          />
          <Ionicons name="calendar-outline" size={20} color="gray" />
        </View>

        <View style={styles.genderContainer}>
          <Pressable style={styles.genderOption} onPress={() => setGender(true)}>
            <View
              style={[
                styles.genderCircle,
                gender === true ? styles.genderSelected : styles.genderUnselected,
              ]}
            />
            <Text style={styles.genderLabel}>Nam</Text>
          </Pressable>

          <Pressable style={styles.genderOption} onPress={() => setGender(false)}>
            <View
              style={[
                styles.genderCircle,
                gender === false ? styles.genderSelected : styles.genderUnselected,
              ]}
            />
            <Text style={styles.genderLabel}>Nữ</Text>
          </Pressable>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>LƯU</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3B82F6",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -32,
  },
  avatarWrapper: {
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 999,
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 999,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    padding: 4,
    borderRadius: 999,
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 16,
  },
  inputGroup: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 16,
    flex: 1,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 24,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderCircle: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
  },
  genderSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  genderUnselected: {
    borderColor: "#9CA3AF",
  },
  genderLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
