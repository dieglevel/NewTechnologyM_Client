import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export const NewSection = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hôm nay Nguyễn Tú có gì vui?</Text>
            <Text style={styles.description}>
                Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỷ niệm đáng nhớ nhé!
            </Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Đăng lên Nhật ký</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32, // mt-8
        paddingHorizontal: 24, // px-6
        alignItems: "center",
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: "600", // font-semibold
    },
    description: {
        color: "#6B7280", // text-gray-500
        textAlign: "center",
        marginTop: 8, // mt-2
    },
    button: {
        backgroundColor: "#007AFF", // bg-[#007AFF]
        borderRadius: 9999, // rounded-full
        paddingVertical: 12, // py-3
        marginTop: 24, // mt-6
        width: "50%", // w-1/2
    },
    buttonText: {
        color: "white", // text-white
        textAlign: "center",
        fontWeight: "600", // font-semibold
    },
});