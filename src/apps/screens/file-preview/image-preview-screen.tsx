import React from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ImageViewer from "react-native-image-zoom-viewer";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { ImagePreviewScreenRouteProp, StackScreenNavigationProp } from "@/libs/navigation";
import Toast from "react-native-toast-message";
import * as MediaLibrary from 'expo-media-library';

export const ImagePreviewScreen = () => {
	const navigate = useNavigation<StackScreenNavigationProp>();
	const route = useRoute<ImagePreviewScreenRouteProp>();
	const { url } = route.params;

const handleDownload = async () => {
  const fileName = url.split('/').pop() || 'image.jpg';
  const fileUri = FileSystem.documentDirectory + fileName;

  try {
    // Xin quyền truy cập Media Library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission denied',
        text2: 'Không có quyền truy cập thư viện.',
      });
      return;
    }

    // Tải ảnh về thư mục tạm trước
    const downloadedFile = await FileSystem.downloadAsync(url, fileUri);

    // Tạo Asset trong MediaLibrary
    const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);

    // Thêm vào album "Download" (hoặc album riêng của app bạn nếu muốn)
    await MediaLibrary.createAlbumAsync('Download', asset, false);

    Toast.show({
      type: 'success',
      text1: 'Tải ảnh thành công',
      text2: 'Ảnh đã được lưu vào thư viện (Download)',
    });
  } catch (error) {
    console.error('Download error:', error);
    Toast.show({
      type: 'error',
      text1: 'Lỗi tải ảnh',
      text2: 'Không thể tải ảnh xuống. Vui lòng thử lại.',
    });
  }
};

	const handleOpenInBrowser = () => {
		Linking.openURL(url);
	};

	return (
		<Modal
			visible={true}
			animationType="fade"
			transparent={false}
		>
			<View style={{ flex: 1, backgroundColor: "black" }}>
				<TouchableOpacity
					style={styles.closeButton}
					onPress={() => navigate.goBack()}
				>
					<Ionicons
						name="close"
						size={32}
						color="white"
					/>
				</TouchableOpacity>
				<ImageViewer
					imageUrls={[{ url }]}
					enableSwipeDown
					backgroundColor="black"
					onSwipeDown={() => navigate.goBack()}
				/>
				<View style={styles.actionBar}>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={handleDownload}
					>
						<Ionicons
							name="download-outline"
							size={24}
							color="white"
						/>
						<Text style={styles.actionText}>Tải về</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={handleOpenInBrowser}
					>
						<Ionicons
							name="open-outline"
							size={24}
							color="white"
						/>
						<Text style={styles.actionText}>Mở trình duyệt</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Toast />
		</Modal>
	);
};

const styles = StyleSheet.create({
	closeButton: {
		position: "absolute",
		top: 40,
		left: 20,
		zIndex: 10,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 20,
		padding: 4,
	},
	actionBar: {
		position: "absolute",
		bottom: 30,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.6)",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 24,
		marginHorizontal: 8,
	},
	actionText: {
		color: "white",
		marginLeft: 6,
		fontWeight: "bold",
	},
});

export default ImagePreviewScreen;
