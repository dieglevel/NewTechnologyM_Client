import React from "react";
import { Text } from "react-native";

const FooterLink = ({ text }) => {
  return (
    <Text className="text-blue-500 text-center text-base mt-4">{text}</Text>
  );
};

export default FooterLink;
