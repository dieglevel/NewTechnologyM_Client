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

import { AppState, AppStateStatus } from "react-native";
import { useState } from "react";
import { init } from "i18next";
import { initialDataPage } from "@/apps/navigations/handle-initital-page";
import { socketService } from "@/libs/socket/socket";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		priority: Notifications.AndroidNotificationPriority.HIGH,
	}),
});

export default function App() {
	const [fontsLoaded] = useFonts(fonts);

	const appState = useRef<AppStateStatus>(AppState.currentState);

	const fetch = async () => {
		await initialDataPage();
		await socketService.disconnect();
		await socketService.connect();
	};

	useEffect(() => {
		const subscription = AppState.addEventListener("change", async (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				console.log("🔄 App quay trở lại → làm mới app ở đây");

				fetch();
				// ⚠️ Đừng dùng Updates.reloadAsync() trừ khi bắt buộc
				// await Updates.reloadAsync();

				// Gợi ý: Dispatch Redux action để refetch, hoặc reset screen
				// store.dispatch(fetchDataAgain());

				// Hoặc reload theo nhu cầu
			}
			appState.current = nextAppState;
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		i18n.changeLanguage("vi");
	}, []);

	useEffect(() => {
		const getToken = async () => {
			try {
				const token = await registerForPushNotificationsAsync();
				console.log("📲 Push notification token:", token);
			} catch (error) {
				console.error("❌ Error getting push notification token:", error);
			}
		};
		getToken();

		// const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
		// 	console.log("📩 Gốc từ server:", notification.request.content.data);
		// 	notification.request.content.body && console.log("📩 Nội dung thông báo:", notification.request.content.body);
		// 	notification.request.content.title && console.log("📩 Tiêu đề thông báo:", notification.request.content.title)
		// 	notification.request.content.data && console.log("📩 Dữ liệu thông báo:", notification.request.content.data);
		// });

		const backgroundSubscription = Notifications.addNotificationResponseReceivedListener((notification) => {
			console.log("📩 Notification received in background or closed:", notification);
		});

		const terminalSubscription = Notifications.addNotificationResponseReceivedListener((notification) => {
			console.log("📩 Notification clicked:", notification);
		});

		return () => {
			// Notifications.removeNotificationSubscription(foregroundSubscription);
			Notifications.removeNotificationSubscription(backgroundSubscription);
			Notifications.removeNotificationSubscription(terminalSubscription);
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
