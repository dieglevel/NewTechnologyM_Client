import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { getListFriend, getListResponseFriend, getListSended } from "@/services/friend";
import { initMyListFriend, initRequestFriend, initSendedFriend } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { ErrorResponse } from "@/libs/axios/axios.config";

const contacts = [
  { id: "1", name: "Advertisement And Edu" },
  { id: "2", name: "Anh Ngữ Betma" },
  { id: "3", name: "Anl Nguyen" },
  { id: "4", name: "Bảo" },
  { id: "5", name: "Linh" },
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

const Tabs = ["Bạn bè", "Nhóm", "OA"];

const ContactsScreen = () => {
  const [activeTab, setActiveTab] = useState("Bạn bè");
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused  = useIsFocused();

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bạn bè":
        return (
          <FlatList
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <TouchableOpacity style={styles.listHeaderItem}>
                  <Ionicons name="person-add" size={24} color="#2563eb" />
                  <Text style={styles.listHeaderText}>Lời mời kết bạn</Text>
                </TouchableOpacity>

                <View style={styles.listHeaderItem}>
                  <Ionicons name="people" size={20} color="gray" />
                  <Text style={styles.listHeaderText}>Danh bạ máy</Text>
                </View>

                <View>
                  <TouchableOpacity style={styles.listHeaderItem}>
                    <Ionicons name="gift" size={24} color="#f59e0b" />
                    <Text style={styles.listHeaderText}>Sinh nhật</Text>
                  </TouchableOpacity>

                  <View style={styles.filterButtons}>
                    <TouchableOpacity style={styles.filterButtonActive}>
                      <Text style={styles.filterButtonTextActive}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButtonInactive}>
                      <Text style={styles.filterButtonTextInactive}>
                        Mới truy cập
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={ContactItem}
            ListEmptyComponent={
              <View style={styles.emptyTab}>
                <Text style={styles.emptyTabText}>Không tìm thấy liên hệ</Text>
              </View>
            }
          />
        );
      case "Nhóm":
        return (
          <View style={styles.emptyTab}>
            <Text style={styles.emptyTabText}>
              Danh sách nhóm sẽ hiển thị ở đây
            </Text>
          </View>
        );
      case "OA":
        return (
          <View style={styles.emptyTab}>
            <Text style={styles.emptyTabText}>
              Danh sách OA sẽ hiển thị ở đây
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" translucent />
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="white" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="person-add" size={24} color="white" />
      </View>

      <View style={styles.tabs}>
        {Tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchBar: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    paddingBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginHorizontal: 8,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "white",
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  tabContent: {
    flex: 1,
    backgroundColor: "white",
  },
  listHeader: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listHeaderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 8,
  },
  listHeaderText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  filterButtonActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#3b82f6",
  },
  filterButtonTextActive: {
    color: "white",
    fontWeight: "500",
  },
  filterButtonInactive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#e5e7eb",
  },
  filterButtonTextInactive: {
    color: "#374151",
    fontWeight: "500",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
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
    color: "#374151",
  },
  icon: {
    marginHorizontal: 8,
  },
  emptyTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTabText: {
    color: "#6b7280",
    fontSize: 16,
  },
});

export default ContactsScreen;
