import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Linking, Image } from "react-native";
import { WebView } from "react-native-webview";
import { ResizeMode, Video } from "expo-av";
import { IMessageFile } from "@/types/implement";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { StackScreenNavigationProp } from "@/libs/navigation";

type FileType = "image" | "pdf" | "video" | "doc" | "unknown";

interface FilePreviewProps {
	data: IMessageFile;
	action: () => void
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const getFileType = (uri: string): FileType => {
	const ext = uri.split(".").pop()?.toLowerCase() || "";
	if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
	if (["pdf"].includes(ext)) return "pdf";
	if (["mp4", "mov", "webm"].includes(ext)) return "video";
	if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "doc";
	return "unknown";
};

const FilePreview: React.FC<FilePreviewProps> = ({ data, action }) => {
	const navigate = useNavigation<StackScreenNavigationProp>();
	const type = getFileType(data?.url);
	const [aspectRatio, setAspectRatio] = useState<number>(1);
	useEffect(() => {
		if (type === "image") {
			Image.getSize(data.url, (width, height) => {
				setAspectRatio(width / height);
			}, (error) => {
				console.log("❌ Lấy kích thước hình ảnh thất bại:", error);
				console.log("❌ URL hình ảnh:", data.url);
				setAspectRatio(1); // Đặt tỉ lệ mặc định nếu không lấy được kích thước
			});
		} else {
			setAspectRatio(1); // Đặt tỉ lệ mặc định cho các loại file khác
		}
	}, []);

	const downloadFile = async () => {
		Toast.show({
			text1: "File đang được tải xuống",
			type: "info",
		});
		try {
			const fileUrl = data.url;
			const fileName = fileUrl.split("/").pop(); // Tách tên file từ URL

			const documentDir = FileSystem.documentDirectory;
			if (!documentDir) {
				throw new Error("Không thể truy cập thư mục documentDirectory");
			}
			const fileUri = documentDir + fileName;

			const result = await FileSystem.downloadAsync(fileUrl, fileUri);
			Toast.show({
				text1: "File đã tả thành công",
				type: "success",
			});
		} catch (error) {
			console.error("❌ Tải file thất bại:", error);
			Toast.show({
				text1: "File đã tả thành công",
				type: "error",
			});
		}
	};
	switch (type) {
		case "image":

			return (
				<TouchableOpacity
					onPress={() => {
						navigate.navigate("ImagePreviewScreen", { url: data.url });
					}}
					onLongPress={action}
					
				>
					<Image
						source={{ uri: data.url }}
						style={{
							flex: 1,
							width: "100%",
							backgroundColor: "#0553",
							aspectRatio: aspectRatio,
						}}
						resizeMode="contain"
					/>
				</TouchableOpacity>
			);

		// case "pdf":
		// 	return (
		// 		<WebView
		// 			source={{
		// 				uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data.url)}`,
		// 			}}
		// 			style={{ flex: 1 }}
		// 		/>
		// 	);

		// case "doc":
		// 	return (
		// 		<WebView
		// 			source={{
		// 				uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data.url)}`,
		// 			}}
		// 			style={{ flex: 1 }}
		// 		/>
		// 	);

		case "video":
			return (
				<Video
					source={{ uri: data.url }}
					rate={1.0}
					volume={1.0}
					isMuted={false}
					useNativeControls
					style={{ width: "100%", height: "auto", flex: 1, aspectRatio: 926 / 606 }}
					resizeMode={ResizeMode.CONTAIN}
				/>
			);

		default:
			return (
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						flex: 1,
						borderWidth: 1,
						borderColor: "gray",
						borderRadius: 10,
						flexDirection: "row",
						gap: 10,
						paddingVertical: 20,
						paddingHorizontal: 10,
						backgroundColor: "white",
					}}
				>
					<Ionicons
						name="document-outline"
						size={40}
					/>
					<View style={{ flex: 1, flexDirection: "column" }}>
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							style={{ fontWeight: "bold" }}
						>
							{data.data.name}
						</Text>
						<Text>{data.data.size && (Number.parseInt(data.data.size) / 8000000).toFixed(1)} MB</Text>
						<TouchableOpacity
							style={{}}
							onPress={() => downloadFile()}
						>
							<Text style={{ color: "black", fontWeight: "bold" }}>Nhấn để tải xuống</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
	}
};

export default FilePreview;
