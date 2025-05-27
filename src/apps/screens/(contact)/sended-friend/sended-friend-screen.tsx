import { SafeAreaView } from "@/apps/components";
import RequestFriendItem from "@/apps/screens/(contact)/request-friend/request-friend-item/request-friend-item";
import Add from "@/assets/svgs/add";
import Delete from "@/assets/svgs/delete";
import { colors } from "@/constants";
import { RootState } from "@/libs/redux/redux.config";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import SendedFriendItem from "./sended-friend-item/sended-friend-item";

const SendedFriendScreen = () => {
	const { sendedFriends } = useSelector((state: RootState) => state.sendedFriend);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<View
				style={{
					flex: 1,
					width: "100%",
					borderBottomWidth: 1,
					borderBottomColor: colors.outline,
					justifyContent: "flex-start",
					alignItems: "flex-start",
					flexDirection: "row",
					gap: 10,
					padding: 10,
					backgroundColor: colors.mainBackground,
				}}
			>
			<FlatList
				data={sendedFriends}
				renderItem={({ item }) => <SendedFriendItem data={item} />}
				keyExtractor={(item) => item.requestId?.toString() ?? ""}
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, width: "100%" }}
				ListEmptyComponent={() => (
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Không có lời mời nào</Text>
					</View>
				)}
			/>
			</View>
		</SafeAreaView>
	);
};

export default SendedFriendScreen;
