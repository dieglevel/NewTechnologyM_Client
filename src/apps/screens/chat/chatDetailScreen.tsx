// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";

// const ChatDetailScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { name, message } = route.params || { name: "Nhóm", message: "Không có tin nhắn" };

//   return (
//     <View className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center p-3 bg-blue-600">
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text className="ml-3 text-white text-lg font-semibold">{name}</Text>
//       </View>

//       {/* Nội dung chat */}
//       <View className="flex-1 p-4">
//         <Text className="text-gray-700 text-base">Tin nhắn gần nhất: {message}</Text>
//       </View>
//     </View>
//   );
// };

// export default ChatDetailScreen;
