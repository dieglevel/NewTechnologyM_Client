import { SafeAreaView } from "@/apps/components";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { socketService } from "@/libs/socket/socket";
import { getAccountApi } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Modal,
	PanResponder,
	PanResponderInstance,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { texts } from "./handle";
import { colors } from "@/constants";

export const LoginScreen = () => {
	const navigation = useNavigation<StackScreenNavigationProp>();
	const [language, setLanguage] = useState<string>("vi");
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [imageSource, setImageSource] = useState<any>(texts[language].pages[0].image);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkToken = async () => {
			const token = await getSecure(ExpoSecureStoreKeys.AccessToken);

			try {
				const accountResponse = await getAccountApi();
				if (accountResponse.statusCode === 200) {
					socketService.connect();
					navigation.navigate("BottomTabScreenApp");
				}
			} catch (error) {
				const e = error as ErrorResponse;
				setIsLoading(false);
			}
		};
		checkToken();
	}, []);

	const handleImagePress = () => {
		if (currentPage < texts[language].pages.length - 1) {
			setCurrentPage(currentPage + 1);
			setImageSource(texts[language].pages[currentPage + 1].image);
		}
	};

	const panResponder: PanResponderInstance = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderMove: (e, gestureState) => {
			if (gestureState.dx > 50) {
				if (currentPage < texts[language].pages.length - 1) {
					setCurrentPage(currentPage + 1);
					setImageSource(texts[language].pages[currentPage + 1].image);
				}
			} else if (gestureState.dx < -50) {
				if (currentPage > 0) {
					setCurrentPage(currentPage - 1);
					setImageSource(texts[language].pages[currentPage - 1].image);
				}
			}
		},
		onPanResponderRelease: () => {},
	});

	const handlePressLanguage = (language: string) => {
		setLanguage(language);
		setIsModalVisible(false);
	};

	const handlePressCloseModal = () => {
		setIsModalVisible(false);
	};

	const handleLoginPress = () => {
		navigation.navigate("LoginUser");
	};

	const handleRegisterPress = () => {
		navigation.navigate("Register");
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff", width: "100%" }}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "75%" }}>
				{isLoading ? (
					<ActivityIndicator
						size={"large"}
						color={colors.brand}
					/>
				) : (
					<>
						{/* <TouchableOpacity
							onPress={() => setIsModalVisible(true)}
							style={styles.languageButton}
						>
							<Text style={styles.languageText}>
								{language === "vi" ? "Tiếng Việt" : "English"}
							</Text>
						</TouchableOpacity> */}

						{/* {isModalVisible && (
							<Modal
								visible={isModalVisible}
								transparent={true}
								animationType="fade"
								onRequestClose={handlePressCloseModal}
							>
								<TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
									<View style={styles.modalOverlay}>
										<View style={styles.modalContent}>
											<TouchableOpacity onPress={() => handlePressLanguage("vi")}>
												<Text style={styles.modalOption}>
													{language === "vi" ? "✓ Tiếng Việt" : "Tiếng Việt"}
												</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => handlePressLanguage("en")}>
												<Text style={styles.modalOption}>
													{language === "en" ? "✓ English" : "English"}
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								</TouchableWithoutFeedback>
							</Modal>
						)} */}

						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignContent: "center",
								gap: 16,
								width: "100%",
							}}
						>
							<Text style={styles.title}>Zalo</Text>

								<Image
									{...panResponder.panHandlers}
									source={imageSource}
									style={styles.image}
									resizeMode="contain"
								/>

							<Pressable
								onPress={handleImagePress}
								style={{ alignItems: "center", justifyContent: "center", width: "100%" }}
							>

								{/* <Text style={styles.pageTitle}>{texts[language].pages[currentPage].title}</Text>
								<Text style={styles.pageDescription}>
									{texts[language].pages[currentPage].description}
								</Text>

								<View style={[styles.pagination]}>
									{texts[language].pages.map((_, index) => (
										<View
											key={index}
											style={[
												styles.paginationDot,
												currentPage === index && styles.paginationDotActive,
											]}
										/>
									))}
								</View> */}
							</Pressable>

							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.loginButton}
									onPress={handleLoginPress}
								>
									<Text style={styles.loginButtonText}>{texts[language].login}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.registerButton}
									onPress={handleRegisterPress}
								>
									<Text style={styles.registerButtonText}>
										{texts[language].createAccount}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	languageButton: {
		padding: 16, // p-4
		borderRadius: 9999, // rounded-full
		flexDirection: "row", // flex-row
		alignItems: "center", // items-center
	},
	languageText: {
		fontSize: 16, // text-base
		color: "#374151", // text-gray-800
	},
	title: {
		fontSize: 80, // text-2xl
		fontWeight: "bold", // font-bold
		textAlign: "center",
		marginTop: 96, // mt-24
		color: "#3b82f6", // text-blue-500
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)", // bg-black bg-opacity-50
		alignItems: "center", // items-center
		justifyContent: "center", // justify-center
	},
	modalContent: {
		backgroundColor: "white", // bg-white
		padding: 24, // p-6
		borderRadius: 8, // rounded-lg
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	modalOption: {
		fontSize: 18, // text-lg
		padding: 8, // p-2
	},
	image: {
		width: 300, // w-60
		height: 300, // h-60
		alignSelf: "center",
	},
	pageTitle: {
		fontSize: 24, // text-2xl
		fontWeight: "bold", // font-bold
		textAlign: "center",
		marginTop: 24, // mt-6
	},
	pageDescription: {
		color: "#6b7280", // text-gray-500
		textAlign: "center",
		marginTop: 8, // mt-2
	},
	pagination: {
		flexDirection: "row", // flex-row
		justifyContent: "center", // justify-center
		marginTop: 16,
	},
	paginationDot: {
		width: 8, // w-2
		height: 8, // h-2
		borderRadius: 4, // rounded-full
		backgroundColor: "#d1d5db", // bg-gray-400
		marginHorizontal: 4, // mx-1
	},
	paginationDotActive: {
		backgroundColor: "#3b82f6", // bg-blue-500
	},
	buttonContainer: {
		alignItems: "center", // items-center
	},
	loginButton: {
		backgroundColor: "#3b82f6", // bg-blue-500
		padding: 16, // p-4
		borderRadius: 8, // rounded-full
		width: "100%", // w-4/5
		alignItems: "center", // items-center
	},
	loginButtonText: {
		color: "white", // text-white
		fontWeight: "500", // font-medium
	},
	registerButton: {
		backgroundColor: "#e5e7eb", // bg-gray-200
		padding: 16, // p-4
		borderRadius: 8, // rounded-full
		width: "100%", // w-4/5
		alignItems: "center", // items-center
		marginTop: 12, // mt-4
	},
	registerButtonText: {
		color: "#374151", // text-gray-800
		fontWeight: "500", // font-medium
	},
});
