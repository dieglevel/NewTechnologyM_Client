import { TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";

interface HeaderDetailUserProps {
    onPress?: () => void;
    mainAvatar: string;
}

export const CoverPhoto = ({ onPress, mainAvatar }: HeaderDetailUserProps) => {
    return (
        <TouchableOpacity
            style={styles.touchable}
            onPress={onPress}
        >
            <Image
                source={{
                    uri: mainAvatar,
                }}
                style={styles.image}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        position: "relative",
        height: 240, // 60 * 4 (converted from h-60)
    },
    image: {
        width: "100%",
        height: "100%",
    },
});