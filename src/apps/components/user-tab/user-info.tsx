import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { ChangeAccount } from "@/assets/svgs";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/libs/navigation";

interface Props {
  user: {
    name: string;
    mainAvatar: string;
    coverAvatar: string;
  };
}

export const UserInfo = ({ user }: Props) => {
  const navigation = useNavigation<StackScreenNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("UserDetail", { user: user })}
    >
      <View style={styles.row}>
        <Image
          source={{
            uri: user.mainAvatar,
          }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.link}>{t("Xem trang cá nhân")}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <ChangeAccount color="#1d91fa" size={28} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    justifyContent: "space-between", // justify-between
    paddingHorizontal: 16, // px-4
    paddingVertical: 16, // py-4
    backgroundColor: "white", // bg-white
  },
  row: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
  },
  avatar: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 28, // rounded-full
  },
  infoContainer: {
    marginLeft: 12, // ml-3
  },
  name: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
  },
  link: {
    color: "#6B7280", // text-gray-500
  },
});