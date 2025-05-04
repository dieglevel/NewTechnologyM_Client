import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import FilePreview from "@/apps/components/file-preview/file-preview";
import { FilePrewviewRouteProp } from "@/libs/navigation";

const FilePreviewScreen = () => {
	const { params } = useRoute<FilePrewviewRouteProp>();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<FilePreview
				uri={params?.uri}
			/>
		</SafeAreaView>
	);
};

export default FilePreviewScreen;
