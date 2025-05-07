import { FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SetStateAction, useEffect, useState } from "react";
import styles from "../../../styles";
import GiphyApi from "@/libs/giphy";
import { GifsResult } from "@giphy/js-fetch-api";
import { useAppSelector } from "@/libs/redux/redux.config";
import { sendSticker } from "./handle";

interface Props {
	showEmoji: boolean;
	setShowEmoji: React.Dispatch<SetStateAction<boolean>>;
}

export const ModalSticker = ({ showEmoji, setShowEmoji }: Props) => {
	const [emoji, setEmoji] = useState<GifsResult>();
	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);
	const isDark = false;

	useEffect(() => {
		const fetchGiphy = async () => {
			const data = await GiphyApi.search("happy", { limit: 30, type: "stickers" });
			setEmoji(data);
		};
		fetchGiphy();
	}, []);

	const handlePress = () => {
		
	}

	return (
		<>
			<Modal
				visible={showEmoji}
				transparent
				animationType="fade"
			>
				<TouchableOpacity
					style={[styles.reactionModalContainer, { width: "100%", height: "100%", padding: 30 }]}
					onPress={() => {
						setShowEmoji(false);
					}}
				>
					<View
						style={{
							padding: 10,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							borderRadius: 10,
							backgroundColor: isDark ? "#1f2937" : "white",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								marginBottom: 10,
							}}
						>
							<Feather
								name="x"
								size={24}
								color={isDark ? "white" : "black"}
								style={{ position: "absolute", top: 0, right: 0 }}
								onPress={() => setShowEmoji(false)}
							/>
							<Text
								style={[
									{
										color: isDark ? "white" : "black",
										fontSize: 18,
										fontWeight: "bold",
									},
									{ marginBottom: 10 },
								]}
							>
								Chọn biểu tượng cảm xúc
							</Text>
						</View>
						<FlatList
							style={{
								flex: 1,
								width: "100%",
							}}
							data={emoji?.data}
							keyExtractor={(item) => item.id.toString()}
							contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => {
										sendSticker(item.images.fixed_width.url, selectedRoom?.id || "");
										setShowEmoji(false);
									}}
								>
									<Image
										source={{ uri: item.images.fixed_width.url }}
										style={{ width: 100, height: 100, margin: 2 }}
									/>
								</TouchableOpacity>
							)}
							numColumns={3}
						/>
					</View>
				</TouchableOpacity>
			</Modal>
		</>
	);
};
