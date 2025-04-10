import React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "@/apps/components";

const contacts = [
    { id: "1", name: "Advertisement And Edu" },
    { id: "2", name: "Anh Ngữ Betma" },
    { id: "3", name: "Anl Nguyen" },
    { id: "4", name: "Bảo" },
    { id: "5", name: "Bảo" },
];

const ContactItem = ({ item }: any) => (
    <TouchableOpacity style={styles.contactItem}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name}</Text>
        </View>
        <Ionicons name="call" size={20} color="gray" style={styles.icon} />
        <Ionicons name="videocam" size={20} color="gray" style={styles.icon} />
    </TouchableOpacity>
);

export const ContactsScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="white" style={styles.icon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm"
                        placeholderTextColor="white"
                    />
                    <Ionicons name="person-add" size={24} color="white" style={styles.icon} />
                </View>
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={ContactItem}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: "100%",
        flex: 1,
    },
    container: {
        flex: 1,
        width: "100%",
    },
    searchBar: {
        backgroundColor: "#3b82f6", // bg-blue-500
        padding: 12, // p-3
        flexDirection: "row", // flex-row
        alignItems: "center", // items-center
    },
    searchInput: {
        flex: 1, // flex-1
        color: "white", // text-white
        marginHorizontal: 8, // mx-2
    },
    contactItem: {
        flexDirection: "row", // flex-row
        alignItems: "center", // items-center
        padding: 12, // p-3
        borderBottomWidth: 1, // border-b
        borderBottomColor: "#e5e7eb", // border-gray-200
    },
    avatar: {
        width: 48, // w-12
        height: 48, // h-12
        borderRadius: 24, // rounded-full
        backgroundColor: "#3b82f6", // bg-blue-500
        alignItems: "center", // items-center
        justifyContent: "center", // justify-center
    },
    avatarText: {
        color: "white", // text-white
        fontWeight: "bold", // font-bold
        fontSize: 18, // text-lg
    },
    contactInfo: {
        marginLeft: 12, // ml-3
        flex: 1, // flex-1
    },
    contactName: {
        fontWeight: "600", // font-semibold
        color: "black", // text-black
    },
    icon: {
        marginHorizontal: 8, // mx-2
    },
});