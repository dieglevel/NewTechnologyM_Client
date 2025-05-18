// FilePreview.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { ResizeMode, Video } from "expo-av";
import { IMessageFile } from "@/types/implement";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";

type FileType = "image" | "pdf" | "video" | "doc" | "unknown";

interface FilePreviewProps {
	data: IMessageFile;
}

const getFileType = (uri: string): FileType => {
	const ext = uri.split(".").pop()?.toLowerCase() || "";
	if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
	if (["pdf"].includes(ext)) return "pdf";
	if (["mp4", "mov", "webm"].includes(ext)) return "video";
	if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "doc";
	return "unknown";
};

const FilePreview: React.FC<FilePreviewProps> = ({ data }) => {
	const type = getFileType(data?.url);

	const downloadFile = async () => {
		Toast.show({ text1: "Đang tải xuống...", type: "info" });
		try {
			const fileUrl = data.url;
			const fileName = fileUrl.split("/").pop();
			if (!FileSystem.documentDirectory) {
				Toast.show({ text1: "Không thể xác định thư mục lưu trữ!", type: "error" });
				return;
			}
			const fileUri = FileSystem.documentDirectory + fileName;

			await FileSystem.downloadAsync(fileUrl, fileUri);
			Toast.show({ text1: "Tải xuống thành công!", type: "success" });
		} catch (error) {
			console.error("❌ Lỗi tải file:", error);
			Toast.show({ text1: "Tải xuống thất bại!", type: "error" });
		}
	};

	switch (type) {
		case "image":
			return (
				<Image
					source={{ uri: data.url }}
					style={{ width: "100%", height: 200, borderRadius: 8 }}
					resizeMode="cover"
				/>
			);

		case "pdf":
		case "doc":
			return (
				<WebView
					source={{
						uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data.url)}`,
					}}
					style={{ height: 300 }}
				/>
			);

		case "video":
			return (
				<Video
					source={{ uri: data.url }}
					useNativeControls
					style={{ width: "100%", height: 200 }}
					resizeMode={ResizeMode.CONTAIN}
				/>
			);

		default:
			return (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						borderWidth: 1,
						borderColor: "#ccc",
						padding: 10,
						borderRadius: 8,
						backgroundColor: "#fff",
					}}
				>
					<Ionicons name="document-outline" size={40} />
					<View style={{ marginLeft: 10, flex: 1 }}>
						<Text numberOfLines={1} style={{ fontWeight: "bold" }}>
							{data.data.name}
						</Text>
						<Text>{(Number(data.data.size) / 1_000_000).toFixed(2)} MB</Text>
						<TouchableOpacity onPress={downloadFile}>
							<Text style={{ color: "#1e40af", marginTop: 5 }}>Tải xuống</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
	}
};

export default FilePreview;
