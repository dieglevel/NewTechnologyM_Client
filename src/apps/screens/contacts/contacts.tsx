import React, { useState } from "react";
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
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={ContactItem}
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
        />
        <Ionicons name="person-add" size={24} color="white" />
      </View>

      <View style={styles.tabs}>
        {Tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
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
  container: {
    flex: 1,
    backgroundColor: "white", // bg-white
  },
  searchBar: {
    backgroundColor: "#3b82f6", // bg-blue-500
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    paddingHorizontal: 12, // px-3
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    paddingBottom: 12, // pb-3
  },
  searchInput: {
    flex: 1, // flex-1
    color: "white", // text-white
    marginHorizontal: 8, // mx-2
  },
  tabs: {
    flexDirection: "row", // flex-row
    borderBottomWidth: 1, // border-b
    borderBottomColor: "#e5e7eb", // border-gray-200
    backgroundColor: "white", // bg-white
  },
  tab: {
    flex: 1, // flex-1
    padding: 12, // p-3
    alignItems: "center", // items-center
  },
  activeTab: {
    borderBottomWidth: 2, // border-b-2
    borderBottomColor: "#3b82f6", // border-blue-500
  },
  tabText: {
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
    color: "#6b7280", // text-gray-500
  },
  activeTabText: {
    color: "#3b82f6", // text-blue-500
  },
  tabContent: {
    flex: 1, // flex-1
    backgroundColor: "white", // bg-white
  },
  listHeader: {
    paddingHorizontal: 12, // px-3
    paddingTop: 16, // pt-4
    paddingBottom: 8, // pb-2
  },
  listHeaderItem: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    padding: 12, // p-3
    backgroundColor: "#f3f4f6", // bg-gray-100
    borderRadius: 8, // rounded-lg
    marginBottom: 8, // mb-2
  },
  listHeaderText: {
    marginLeft: 8, // ml-2
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
    color: "#374151", // text-gray-700
  },
  filterButtons: {
    flexDirection: "row", // flex-row
    justifyContent: "space-between", // justify-between
    marginTop: 8, // mt-2
  },
  filterButtonActive: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 9999, // rounded-full
    backgroundColor: "#3b82f6", // bg-blue-500
  },
  filterButtonTextActive: {
    color: "white", // text-white
    fontWeight: "500", // font-medium
  },
  filterButtonInactive: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 9999, // rounded-full
    backgroundColor: "#e5e7eb", // bg-gray-200
  },
  filterButtonTextInactive: {
    color: "#374151", // text-gray-800
    fontWeight: "500", // font-medium
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
    color: "#374151", // text-gray-800
  },
  icon: {
    marginHorizontal: 8, // mx-2
  },
  emptyTab: {
    flex: 1, // flex-1
    justifyContent: "center", // justify-center
    alignItems: "center", // items-center
  },
  emptyTabText: {
    color: "#6b7280", // text-gray-500
    fontSize: 16, // text-lg
  },
});

export default ContactsScreen;