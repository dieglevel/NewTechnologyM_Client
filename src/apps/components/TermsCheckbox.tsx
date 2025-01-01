import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface IProps {
  text: string;
  isChecked: boolean;
  onCheck: any
}


const TermsCheckbox = ({ text, isChecked, onCheck }: IProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center mb-3"
      onPress={() => onCheck(!isChecked)}
    >
      <View
        className={`w-5 h-5 border border-gray-300 rounded ${
          isChecked ? "bg-blue-500" : ""
        }`}
      />
      <Text className="ml-2 text-base text-left">{text}</Text>
    </TouchableOpacity>
  );
};

export default TermsCheckbox;
