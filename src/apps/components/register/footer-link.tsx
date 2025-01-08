import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface IProps {
  text: string;
  textLink: string;
  onPress?: () => void;
}

export const FooterLink = ({ text, textLink, onPress }: IProps) => {
  return (
    <View className="flex-row justify-center items-center mt-4">
      <Text className="text-black text-sm">{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-blue-500 text-sm font-semibold">{textLink}</Text>
      </TouchableOpacity>
    </View>
  );
};