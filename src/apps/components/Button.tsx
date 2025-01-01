import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Button = ({ title, disabled }) => {
  return (
    <TouchableOpacity
      className={`rounded-lg py-3 items-center ${
        disabled ? "bg-gray-300" : "bg-blue-500"
      }`}
      disabled={disabled}
    >
      <Text className="text-white text-lg ">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
