import { StackScreenNavigationProp } from "@/libs/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

interface IChatItem {
    item: {
        id: string;
        name: string;
        message: string;
        time: string;
    };
    navigation: StackScreenNavigationProp;
}

const ChatItem = ({ item, navigation }: IChatItem) => {
    return (
        <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={() => navigation.navigate("ChatScreen")}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{item.name}</Text>
            </View>

            <View style={styles.chatContent}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage}>{item.message}</Text>
            </View>
            <Text style={styles.chatTime}>{item.time}</Text>
        </TouchableOpacity>
    );
};

export const ListChat = () => {
    const navigation = useNavigation<StackScreenNavigationProp>();

    const chatData: IChatItem[] = [
        {
            item: {
                id: "1",
                name: "Nhóm 2 - QLDA",
                message: "Tài Nguyên: Đang thoi",
                time: "T5",
            },
            navigation: navigation,
        },
        {
            item: {
                id: "2",
                name: "Nhóm 3 - QLDA",
                message: "Huy: Đã gửi tài liệu",
                time: "T4",
            },
            navigation: navigation,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="black" style={styles.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm"
                    placeholderTextColor="black"
                />
                <Ionicons name="qr-code" size={20} color="black" style={styles.icon} />
                <Ionicons name="add" size={24} color="black" style={styles.icon} />
            </View>

            <FlatList
                data={chatData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <ChatItem item={item.item} navigation={item.navigation} />}
                style={styles.chatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3b82f6",
        padding: 8,
        borderRadius: 8,
        width: "100%",
    },
    icon: {
        marginHorizontal: 8,
    },
    searchInput: {
        flex: 1,
        color: "black",
        fontSize: 16,
    },
    chatList: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        width: "100%",
    },
    chatItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#ef4444",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    chatContent: {
        marginLeft: 12,
        flex: 1,
    },
    chatName: {
        fontWeight: "600",
        color: "black",
    },
    chatMessage: {
        color: "#6b7280",
        fontSize: 14,
    },
    chatTime: {
        color: "#9ca3af",
        fontSize: 12,
    },
});

export default ListChat;