import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Loading } from "./src/apps/components";
import { RootScreenApp } from "./src/apps/navigations/root-screen-app";
import { fonts } from "./src/assets/fonts";
import i18n from "./src/libs/language/i8next.config";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "@/libs/redux/redux.config";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/libs/firebase-push-notification/firebase-push-notification";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});


export default function App() {
	const [fontsLoaded] = useFonts(fonts);

	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	useEffect(() => {
		i18n.changeLanguage("vi");
	}, []);

	useEffect(() => {
		// Lấy push token
		const getToken = async () => {
			try {
				const token = await registerForPushNotificationsAsync();
				console.log("📲 Push notification token:", token);
			} catch (error) {
				console.error("❌ Error getting push notification token:", error);
			}
		};
		getToken();

		// Nhận thông báo khi app đang mở
		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			console.log("📩 Notification received in foreground:", notification);
		});

		//  // Nhận thông báo khi app ở background hoặc đã tắt
		notificationListener.current = Notifications.addNotificationResponseReceivedListener((notification) => {
			console.log("📩 Notification received in background:", notification);
		});
		//  Nhận thông báo khi app đã tắt
		notificationListener.current = Notifications.addNotificationResponseReceivedListener((notification) => {
			console.log("📩 Notification received when app is closed:", notification);
		});

		// Nhận khi user nhấn vào thông báo
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log("👆 User clicked notification:", response);
			// Ví dụ: điều hướng đến màn hình cụ thể
			// navigation.navigate('Chat', { id: response.notification.request.content.data.chatId });
		});

		return () => {
			if (notificationListener.current)
				Notifications.removeNotificationSubscription(notificationListener.current);
			if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	if (!fontsLoaded) {
		return <Loading size={300} />;
	}

	return (
		<I18nextProvider i18n={i18n}>
			<Provider store={store}>
				<SafeAreaProvider>
					<RootScreenApp />
				</SafeAreaProvider>
			</Provider>
			<Toast
				position="top"
				visibilityTime={5000}
			/>
		</I18nextProvider>
	);
}
