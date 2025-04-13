import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "@/apps/components";

const rawContacts = [
  { id: "1", name: "Advertisement And Edu", online: true },
  { id: "2", name: "Anh Ngữ Betma", online: false },
  { id: "3", name: "Anl Nguyen", online: true },
  { id: "4", name: "Bảo", online: false },
  { id: "5", name: "Bảo", online: true },
];

// Xử lý loại bỏ trùng tên
const uniqueContacts = Array.from(
  new Map(rawContacts.map((c) => [c.name, c])).values()
);

// Phân nhóm liên hệ theo chữ cái đầu
const groupContacts = (contacts: any[]) => {
  const grouped = contacts.reduce((acc, contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(grouped).map(([title, data]) => ({
    title,
    data: data as any[], // Explicitly type data as an array
  }));
};

const getRandomColor = (name: string) => {
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const ContactItem = ({ item, onPress }: any) => (
  <TouchableOpacity style={styles.contactItem} onPress={() => onPress(item)}>
    <View
      style={[styles.avatar, { backgroundColor: getRandomColor(item.name) }]}
    >
      <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={[styles.statusText, { color: item.online ? "green" : "gray" }]}>
        {item.online ? "Đang hoạt động" : "Ngoại tuyến"}
      </Text>
    </View>
    <Ionicons name="call" size={20} color="gray" style={styles.icon} />
    <Ionicons name="videocam" size={20} color="gray" style={styles.icon} />
  </TouchableOpacity>
);

export const ContactsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Mock fetch
  }, []);

  const filtered = useMemo(() => {
    return uniqueContacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const sections = useMemo(() => groupContacts(filtered), [filtered]);

  const handleContactPress = (contact: any) => {
    console.log("Contact selected:", contact);
    // Navigate to contact detail here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="white" style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="white"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="person-add" size={24} color="white" style={styles.icon} />
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy liên hệ nào</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ContactItem item={item} onPress={handleContactPress} />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionText}>{title}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  searchBar: {
    backgroundColor: "#3b82f6",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginHorizontal: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontWeight: "600",
    color: "black",
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  icon: {
    marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  sectionHeader: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionText: {
    fontWeight: "bold",
    color: "#374151",
  },
});
