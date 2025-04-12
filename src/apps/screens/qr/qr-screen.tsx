import { ArrowBack } from "@/assets/svgs";
import { useNavigation } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const QrScreen = () => {
	const navigate = useNavigation();

	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text>We need your permission to show the camera</Text>
				<Button
					onPress={requestPermission}
					title="grant permission"
				/>
			</View>
		);
	}



	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={facing}
				onBarcodeScanned={({ data }) => {
					console.log("Barcode scanned: ", data);
				}}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
							navigate.goBack()
						}}
					>
						<ArrowBack
							color="white"
							outline="white"
						/>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center", // Center content vertically
		alignItems: "center", // Center content horizontally
		backgroundColor: "black", // Background color for the camera screen
	},
	camera: {
		flex: 1,
		width: "100%", // Full width of the screen
	},
	buttonContainer: {
		position: "absolute",
		left: 10,
		top: 10, // Position the button at the bottom
		width: "100%", // Full width of the screen
		flexDirection: "row", // Arrange buttons in a row
		justifyContent: "flex-start", // Center the button horizontally
	},
	button: {
		backgroundColor: "#007AFF", // Blue button background
		padding: 10, // Padding around the button

		borderRadius: 9999, // Rounded corners
	},
	text: {
		color: "white", // White text color
		fontSize: 16, // Font size
		fontWeight: "600", // Semi-bold text
		textAlign: "center", // Center the text
	},
});
