import { StackScreenNavigationProp } from "@/libs/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

interface IChatItem {
	item: {
    id: string;
    name: string;
    message: string;
    time: string
  }
	navigation: StackScreenNavigationProp;
}

const ChatItem = ({ item, navigation }: IChatItem) => {
	return (
		<TouchableOpacity
			className="flex-row items-center p-3 border-b border-gray-200"
			onPress={() => navigation.navigate("ChatScreen")}
		>
			<View className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
				<Text className="text-white font-bold text-lg">{item.name}</Text>
			</View>

			<View className="ml-3 flex-1">
				<Text className="font-semibold text-black">{item.name}</Text>
				<Text className="text-gray-500 text-sm">{item.message}</Text>
			</View>
			<Text className="text-gray-400 text-xs">{item.time}</Text>
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
				id: "1",
				name: "Nhóm 2 - QLDA",
				message: "Tài Nguyên: Đang thoi",
				time: "T5",
			},
			navigation: navigation,
		},
	];

  const temp = {
    item: {
      id: "1",
      name: "Nhóm 2 - QLDA",
      message: "Tài Nguyên: Đang thoi",
      time: "T5",
    },
    navigation: navigation,
  }

	return (
		<View className="w-full h-screen">
			<View className="flex-row items-center bg-gradient-to-r from-blue-500 to-blue-900 p-2 rounded-lg w-full">
				<Ionicons
					name="search"
					size={20}
					color="black"
					className="mx-2"
				/>
				<TextInput
					className="flex-1 text-black text-base"
					placeholder="Tìm kiếm"
					placeholderTextColor="black"
				/>
				<Ionicons
					name="qr-code"
					size={20}
					color="black"
					className="mx-2"
				/>
				<Ionicons
					name="add"
					size={24}
					color="black"
					className="mx-2"
				/>
			</View>

			{/* <View className="flex-1 bg-gray-100 w-full"></View> */}
			{/* Danh sách hội thoại */}
			<FlatList
				data={chatData}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => <ChatItem item={item.item} navigation={item.navigation} />}
				className="flex-1 bg-gray-100 w-full"
			/>

			{/* <View className="absolute bottom-0 w-full bg-white p-3 border-t border-gray-300 flex-row justify-around items-center">
				<TouchableOpacity className="items-center">
					<View className="relative">
						<Ionicons
							name="chatbubbles"
							size={24}
							color="blue"
						/>
						<View className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1">
							<Text className="text-white text-xs">5</Text>
						</View>
					</View>
					<Text className="text-blue-500 text-xs">Tin nhắn</Text>
				</TouchableOpacity>

				<TouchableOpacity className="items-center">
					<Ionicons
						name="book"
						size={24}
						color="gray"
					/>
				</TouchableOpacity>

				<TouchableOpacity className="items-center">
					<View className="relative">
						<Ionicons
							name="grid"
							size={24}
							color="gray"
						/>
						<View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-2 h-2"></View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity className="items-center">
					<View className="relative">
						<Ionicons
							name="time-outline"
							size={24}
							color="gray"
						/>
						<View className="absolute -top-1 -right-2 bg-red-500 rounded-full px-1">
							<Text className="text-white text-xs">N</Text>
						</View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity className="items-center">
					<Ionicons
						name="person-outline"
						size={24}
						color="gray"
					/>
				</TouchableOpacity>
			</View> */}
		</View>
	);
};

export default ListChat;
