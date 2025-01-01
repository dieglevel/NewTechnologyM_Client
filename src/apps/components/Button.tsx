import React from "react";
import { TouchableOpacity, Text } from "react-native";

<<<<<<< Updated upstream
interface IProps {
  title: string;
  disabled: boolean;
}

export const Button = ({ title, disabled }: IProps) => {
=======


const Button = ({ title, disabled }) => {
>>>>>>> Stashed changes
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
