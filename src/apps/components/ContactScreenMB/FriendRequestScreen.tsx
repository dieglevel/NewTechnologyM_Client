// import React, { useState } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { FriendRequestStyles } from "../styles/FriendRequestStyle";

// const data_sample = [
//   { id: "8", name: "User 1", status: "Từ của số trò chuyện", date: "13/02", statusType: "Muốn kết bạn" },
//   { id: "9", name: "User 2", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "10", name: "User 3", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "11", name: "User 4", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "12", name: "User 5", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "13", name: "User 6", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "14", name: "User 7", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "15", name: "User 8", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "16", name: "User 9", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },
//   { id: "17", name: "User 10", status: "Muốn kết bạn", statusType: "Muốn kết bạn" },

//   { id: "18", name: "User 11", status: "Từ gợi ý kết bạn", date: "02/02", statusType: "Đã gửi" },

//   { id: "19", name: "Suggested 1", status: "Gợi ý", statusType: "Gợi ý" },
//   { id: "20", name: "Suggested 2", status: "Gợi ý", statusType: "Gợi ý" },
// ];

// const FriendRequestScreen = ({ navigation }) => {
//   const [friendRequestTab, setFriendRequestTab] = useState("received");

//   // Lọc dữ liệu theo trạng thái
//   const getFilteredData = (statusType) => {
//     return data_sample.filter(item => item.statusType === statusType);
//   };

//   const friendRequestCount = getFilteredData("Muốn kết bạn").length;
//   const sentRequestCount = getFilteredData("Đã gửi").length;
//   const suggestedCount = getFilteredData("Gợi ý").length;

//   const renderContactItem = ({ item }) => (
//     <View style={FriendRequestStyles.contactItem}>
//       <Image
//         source={{ uri: item.avatar || "[img]https://i.ibb.co/DH5q4b0c/999-hinh-nen-may-tinh-pc-laptop-full-hd-2k-4k-8k-cuc-dep-2019-3.jpg[/img]" }}
//         style={FriendRequestStyles.avatar}
//       />
//       <View style={{ flex: 1 }}>
//         <Text style={FriendRequestStyles.contactName}>{item.name}</Text>
//         {item.status && <Text style={FriendRequestStyles.contactStatus}>{item.status}</Text>}
//         {item.date && <Text style={FriendRequestStyles.contactDate}>{item.date}</Text>}
//       </View>
//       {item.statusType === "Muốn kết bạn" && (
//         <View style={FriendRequestStyles.actionIcons}>
//           <TouchableOpacity style={FriendRequestStyles.actionButton}>
//             <Text style={FriendRequestStyles.actionButtonText}>Từ chối</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[FriendRequestStyles.actionButton, { backgroundColor: "#007AFF" }]}>
//             <Text style={FriendRequestStyles.actionButtonText}>Đồng ý</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       {item.statusType === "Đã gửi" && (
//         <View style={FriendRequestStyles.actionIcons}>
//           <TouchableOpacity style={FriendRequestStyles.actionButton}>
//             <Text style={FriendRequestStyles.actionButtonText}>Thu hồi</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       {item.statusType === "Gợi ý" && (
//         <TouchableOpacity style={[FriendRequestStyles.actionButton, { backgroundColor: "#007AFF" }]}>
//           <Text style={FriendRequestStyles.actionButtonText}>Thêm bạn</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={FriendRequestStyles.container}>
//       <View style={FriendRequestStyles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={20} color="#fff" />
//         </TouchableOpacity>
//         <Text style={FriendRequestStyles.headerTitle}>Lời mời kết bạn</Text>
//       </View>
//       <View style={FriendRequestStyles.tabSwitchContainer}>
//         <TouchableOpacity onPress={() => setFriendRequestTab("received")} style={FriendRequestStyles.tabItem}>
//           <Text style={[FriendRequestStyles.tabText, friendRequestTab === "received" && FriendRequestStyles.tabActive]}>
//             Đã nhận ({friendRequestCount})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setFriendRequestTab("sent")} style={FriendRequestStyles.tabItem}>
//           <Text style={[FriendRequestStyles.tabText, friendRequestTab === "sent" && FriendRequestStyles.tabActive]}>
//             Đã gửi ({sentRequestCount})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setFriendRequestTab("suggested")} style={FriendRequestStyles.tabItem}>
//           <Text style={[FriendRequestStyles.tabText, friendRequestTab === "suggested" && FriendRequestStyles.tabActive]}>
//             Gợi ý ({suggestedCount})
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={
//           friendRequestTab === "received"
//             ? getFilteredData("Muốn kết bạn")
//             : friendRequestTab === "sent"
//             ? getFilteredData("Đã gửi")
//             : getFilteredData("Gợi ý")
//         }
//         keyExtractor={(item) => item.id}
//         renderItem={renderContactItem}
//         style={FriendRequestStyles.list}
//       />
//     </View>
//   );
// };

// export default FriendRequestScreen;