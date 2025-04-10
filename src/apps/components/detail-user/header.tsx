import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ArrowBack } from "@/assets/svgs";
import { More } from "@/assets/svgs/more";

interface HeaderDetailUserProps {
    onPress?: () => void;
}

export const HeaderDetailUser = ({ onPress }: HeaderDetailUserProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <ArrowBack size={25} color="white" outline="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <More size={45} color="white" outline="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingTop: 56, // 14 * 4 (converted from pt-14)
        backgroundColor: "rgba(0, 0, 0, 0.05)", // bg-black/5
    },
    button: {
        width: 40, // 10 * 4 (converted from w-10)
        height: 32, // 8 * 4 (converted from h-8)
        alignItems: "center",
        justifyContent: "center",
    },
});