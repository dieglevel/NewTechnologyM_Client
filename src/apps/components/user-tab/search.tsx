import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Setting, Search } from "@/assets/svgs";
import { t } from "i18next";

export const SearchHeader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.searchContainer}>
                    <Search color="white" outline="white" />
                    <TextInput
                        placeholder={t("Tìm kiếm")}
                        placeholderTextColor="#85bffa"
                        style={styles.textInput}
                    />
                </View>
                <TouchableOpacity style={styles.settingButton}>
                    <Setting color="white" outline="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3b82f6", // bg-blue-500
        paddingHorizontal: 16, // px-4
        paddingTop: 8, // pt-2
        paddingBottom: 8, // pb-2
    },
    row: {
        flexDirection: "row", // flex-row
        alignItems: "center", // items-center
    },
    searchContainer: {
        flex: 1, // flex-1
        flexDirection: "row", // flex-row
        alignItems: "center", // items-center
        justifyContent: "center", // justify-center
    },
    textInput: {
        flex: 1, // flex-1
        marginLeft: 8, // ml-2
        color: "#e5e7eb", // text-gray-200
    },
    settingButton: {
        marginLeft: 16, // ml-4
    },
});