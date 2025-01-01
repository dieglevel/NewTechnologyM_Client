import React from "react";

import { Text } from "react-native";

interface IProps {
	text: string;
}

export const FooterLink = ({ text }: IProps) => {
	return <Text className="text-blue-500 text-center text-base mt-4">{text}</Text>;
};

export default FooterLink;
