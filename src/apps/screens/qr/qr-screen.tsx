import { ArrowBack, Qr } from "@/assets/svgs";
import { verifyLoginQrApi } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const QrScreen = () => {
	const navigate = useNavigation();

	const [permission, requestPermission] = useCameraPermissions();

	const [isDisabled, setIsDisabled] = useState(false);

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

	const handleBarCodeScanned = async (data: string) => {
		if (isDisabled) return;
		setIsDisabled(true);
		try {
			console.log("Scanned data:", data);
			const qr = JSON.parse(data);
			const qrCode = { ipDevice: qr.ipDevice, userAgent: qr.userAgent };

			const response = await verifyLoginQrApi(qrCode);
			if (response.statusCode === 200) {
				console.log("Login successful:", response.data);
				// navigate to home screen
				navigate.navigate("BottomTabScreenApp");
			}
		} catch (error) {
			console.error("Error handling scanned data:", error);
		} finally {
			setIsDisabled(false);
		}
	};

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={"back"}
				onBarcodeScanned={({ data }) => handleBarCodeScanned(data)}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
							navigate.goBack();
						}}
					>
						<ArrowBack
							color="white"
							outline="white"
						/>
					</TouchableOpacity>
				</View>

				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Qr size={400} />
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
