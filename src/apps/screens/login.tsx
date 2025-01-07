import React, { useState } from "react";
import {
  Image,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
    <View className="flex-1 bg-white items-center justify-between">
      <Text className="text-2xl font-bold text-center mt-24 text-blue-500">Zalo</Text>

      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="absolute top-0 right-9 p-4 bg-gray-100 rounded-full flex-row items-center"
      >
        <Text className="text-base text-gray-800">{language === "vi" ? "Tiếng Việt" : "English"}</Text>
      </TouchableOpacity>

      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View className="flex-1 bg-black bg-opacity-50 items-center justify-center">
              <View className="bg-white p-6 rounded-lg shadow">
                <TouchableOpacity onPress={() => setLanguage("vi")}>
                  <Text className="text-lg p-2">{language === "vi" ? "✓ Tiếng Việt" : "Tiếng Việt"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguage("en")}>
                  <Text className="text-lg p-2">{language === "en" ? "✓ English" : "English"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <Image
        {...panResponder.panHandlers}
        source={imageSource}
        className="w-60 h-60"
        resizeMode="contain"
        onPress={handleImagePress}
      />
      <Text className="text-2xl font-bold text-center mt-6">
        {texts[language].pages[currentPage].title}
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        {texts[language].pages[currentPage].description}
      </Text>

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
          <Text className="text-gray-800 text-center font-medium">
            {texts[language].createAccount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
