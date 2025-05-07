import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";

interface Props {
	item: { icon?: string; label?: string; onPress?: () => void; destructive?: boolean };
}

const RenderActionItem: React.FC<Props> = ({ item }) => {
	const isDark = false;

	return (
		<TouchableOpacity
			style={styles.actionItem}
			onPress={item.onPress}
		>
			<Ionicons
				name={item.icon as keyof typeof Ionicons.glyphMap}
				size={20}
				color={item.destructive ? "#ef4444" : isDark ? "#d1d5db" : "#374151"}
				style={styles.actionIcon}
			/>
			<Text
				style={[
					styles.actionText,
					item.destructive && styles.destructiveText,
					isDark && !item.destructive && styles.darkActionText,
				]}
			>
				{item.label}
			</Text>
		</TouchableOpacity>
	);
};

export default RenderActionItem;
