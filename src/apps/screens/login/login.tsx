import { SafeAreaView } from "@/apps/components";
import React, { useState } from "react";
import {
	Image,
	Modal,
	PanResponder,
	PanResponderInstance,
	Pressable,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { texts } from "./handle";

export const LoginScreen = () => {
	const [language, setLanguage] = useState<string>("vi");
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [imageSource, setImageSource] = useState<any>(texts[language].pages[0].image);

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

	return (
		<SafeAreaView>
			<TouchableOpacity
				onPress={() => setIsModalVisible(true)}
				className="p-4 rounded-full flex-row items-center"
			>
				<Text className="text-base text-gray-800">{language === "vi" ? "Tiếng Việt" : "English"}</Text>
			</TouchableOpacity>

			<Text className="text-2xl font-bold text-center mt-24 text-blue-500">Zalo</Text>

			{isModalVisible && (
				<Modal
					visible={isModalVisible}
					transparent={true}
					animationType="fade"
					onRequestClose={handlePressCloseModal}
				>
					<TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
						<View className="flex-1 bg-black bg-opacity-50 items-center justify-center">
							<View className="bg-white p-6 rounded-lg shadow">
								<TouchableOpacity onPress={() => handlePressLanguage("vi")}>
									<Text className="text-lg p-2">
										{language === "vi" ? "✓ Tiếng Việt" : "Tiếng Việt"}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => handlePressLanguage("en")}>
									<Text className="text-lg p-2">
										{language === "en" ? "✓ English" : "English"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			)}

			<Pressable
				onPress={handleImagePress}
				className=""
			>
				<Image
					{...panResponder.panHandlers}
					source={imageSource}
					className="w-60 h-60"
					resizeMode="contain"
				/>
			</Pressable>

			<Text className="text-2xl font-bold text-center mt-6">{texts[language].pages[currentPage].title}</Text>
			<Text className="text-gray-500 text-center mt-2">{texts[language].pages[currentPage].description}</Text>

			<View className="flex-row mt-4">
				{texts[language].pages.map((_, index) => (
					<View
						key={index}
						className={`w-2 h-2 rounded-full bg-gray-400 ${
							currentPage === index ? "bg-blue-500" : ""
						}`}
					/>
				))}
			</View>

			<View className="flex-col w-full items-center mb-6">
				<TouchableOpacity className="bg-blue-500 p-4 rounded-full w-4/5 items-center">
					<Text className="text-white text-center font-medium">{texts[language].login}</Text>
				</TouchableOpacity>
				<TouchableOpacity className="bg-gray-200 p-4 rounded-full w-4/5 items-center mt-4">
					<Text className="text-gray-800 text-center font-medium">{texts[language].createAccount}</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};
