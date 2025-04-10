import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import React from "react";

interface HeaderDetailUserProps {
    onPress?: () => void;
    user: any;
}

export const MainPhoto = ({ onPress, user }: HeaderDetailUserProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.avatarContainer}>
                <Image
                    source={{
                        uri: user.mainAvatar,
                    }}
                    style={styles.avatar}
                />
            </TouchableOpacity>

            <Text style={styles.userName}>{user.name}</Text>
            <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateText}>Cập nhật giới thiệu bản thân</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: -64, // -16 * 4 (converted from -mt-16)
    },
    avatarContainer: {
        borderWidth: 4,
        borderColor: "white",
        borderRadius: 9999, // Fully rounded
    },
    avatar: {
        width: 128, // 32 * 4 (converted from w-32)
        height: 128, // 32 * 4 (converted from h-32)
        borderRadius: 9999, // Fully rounded
    },
    userName: {
        fontSize: 24, // text-2xl
        fontWeight: "600", // font-semibold
        marginTop: 16, // mt-4
    },
    updateButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8, // mt-2
    },
    updateText: {
        color: "#007AFF",
        marginLeft: 8, // ml-2
    },
});