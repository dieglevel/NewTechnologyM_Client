import React, { useState } from "react";
import { Image, Modal, PanResponder, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export const LoginScreen = () => {
	const [language, setLanguage] = useState<string>("vi");
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [imageSource, setImageSource] = useState(require("../image/logo.png"));
	const [currentPage, setCurrentPage] = useState<number>(0);

	const texts = {
		vi: {
			login: "Đăng nhập",
			createAccount: "Tạo tài khoản mới",
			pages: [
				{
					title: "Gọi video ổn định",
					description: "Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi",
					image: require("../image/logo.png"),
				},
				{
					title: "Chat nhóm tiện ích",
					description: "Nơi cùng nhau trao đổi, giữ liên lạc với gia đình, bạn bè, đồng nghiệp...",
					image: require("../image/logo1.png"),
				},
				{
					title: "Gửi ảnh nhanh chóng",
					description: "Trao đổi hình ảnh chất lượng cao với bạn bè và người thân nhanh và dễ dàng",
					image: require("../image/logo2.png"),
				},
				{
					title: "Nhật ký bạn bè",
					description: "Nơi cập nhật hoạt động mới nhất của những người bạn quan tâm",
					image: require("../image/logo3.png"),
				},
			],
		},
		en: {
			login: "Login",
			createAccount: "Create New Account",
			pages: [
				{
					title: "Stable Video Calls",
					description: "Chat easily with stable video quality anytime, anywhere",
					image: require("../image/logo.png"),
				},
				{
					title: "Group Chat with Features",
					description: "Group chat made easy with great features.",
					image: require("../image/logo1.png"),
				},
				{
					title: "Send Photos Quickly",
					description: "Exchange high-quality photos with friends and family easily and quickly",
					image: require("../image/logo2.png"),
				},
				{
					title: "Friends Journal",
					description: "Stay updated with the latest activities of your friends.",
					image: require("../image/logo3.png"),
				},
			],
		},
	};

	const handleImagePress = () => {
		if (currentPage < texts[language].pages.length - 1) {
			setCurrentPage(currentPage + 1);
			setImageSource(texts[language].pages[currentPage + 1].image);
		}
	};

	const panResponder = PanResponder.create({
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

	return (
		<View style={[tailwind.flex1, tailwind.bgWhite, tailwind.itemsCenter, tailwind.justifyBetween]}>
			<Text
				style={[
					tailwind.text2xl,
					tailwind.fontBold,
					tailwind.textCenter,
					{ marginTop: 100, color: "#0078FF" },
				]}
            className="mt"
			>
				Zalo
			</Text>

			<TouchableOpacity
				onPress={() => setIsModalVisible(true)}
				style={[
					tailwind.absolute,
					tailwind.top0,
					tailwind.right9,
					tailwind.p4,
					tailwind.bgGray100,
					tailwind.roundedFull,
					tailwind.flexRow,
					tailwind.itemsCenter,
				]}
			>
				<Text style={[tailwind.textBase, tailwind.textGray800]}>
					{language === "vi" ? "Tiếng Việt" : "English"}
				</Text>
				{/* <Ionicons name="md-arrow-dropdown" size={20} color="black" style={tailwind.ml2} /> */}
			</TouchableOpacity>

			{isModalVisible && (
				<Modal
					visible={isModalVisible}
					transparent={true}
					animationType="fade"
					onRequestClose={() => setIsModalVisible(false)}
				>
					<TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
						<View
							style={[
								tailwind.flex1,
								tailwind.bgBlackOpacity50,
								tailwind.itemsCenter,
								tailwind.justifyCenter,
							]}
						>
							<View style={[tailwind.bgWhite, tailwind.p6, tailwind.roundedLg, tailwind.shadow]}>
								<TouchableOpacity onPress={() => setLanguage("vi")}>
									<Text style={[tailwind.textLg, tailwind.p2]}>
										{language === "vi" ? "✓ Tiếng Việt" : "Tiếng Việt"}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => setLanguage("en")}>
									<Text style={[tailwind.textLg, tailwind.p2]}>
										{language === "en" ? "✓ English" : "English"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			)}

			<Image
				{...panResponder.panHandlers}
				source={imageSource}
				style={[tailwind.w60, tailwind.h60]}
				resizeMode="contain"
				onPress={handleImagePress}
			/>
			<Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textCenter, tailwind.mt6]}>
				{texts[language].pages[currentPage].title}
			</Text>
			<Text style={[tailwind.textGray500, tailwind.textCenter, tailwind.mt2]}>
				{texts[language].pages[currentPage].description}
			</Text>

			<View style={[tailwind.flexRow, tailwind.mt4]}>
				{texts[language].pages.map((_, index) => (
					<View
						key={index}
						style={[
							tailwind.w2,
							tailwind.h2,
							tailwind.roundedFull,
							tailwind.bgGray400,
							currentPage === index ? tailwind.bgBlue500 : {},
						]}
					/>
				))}
			</View>

			<View style={[tailwind.flexCol, tailwind.wFull, tailwind.itemsCenter, tailwind.mb6]}>
				<TouchableOpacity
					style={[
						tailwind.bgBlue500,
						tailwind.p4,
						tailwind.roundedFull,
						tailwind.w4_5,
						tailwind.itemsCenter,
					]}
				>
					<Text style={[tailwind.textWhite, tailwind.textCenter, tailwind.fontMedium]}>
						{texts[language].login}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						tailwind.bgGray200,
						tailwind.p4,
						tailwind.roundedFull,
						tailwind.w4_5,
						tailwind.itemsCenter,
						tailwind.mt4,
					]}
				>
					<Text style={[tailwind.textGray800, tailwind.textCenter, tailwind.fontMedium]}>
						{texts[language].createAccount}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};