import { useFonts } from "expo-font";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Loading } from "./src/apps/components";
import { RootScreenApp } from "./src/apps/navigations/root-screen-app";
import { fonts } from "./src/assets/fonts";
import i18n from "./src/libs/language/i8next.config";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "@/libs/redux/redux.config";

export default function App() {
	const [fontsLoaded] = useFonts(fonts);

	useEffect(() => {
		i18n.changeLanguage("vi");
	}, []);

	if (!fontsLoaded) {
		return <Loading size={300} />;
	}

	return (
		<I18nextProvider i18n={i18n}>
			<Provider store={store}>
				<SafeAreaProvider>
					<RootScreenApp />
					<Toast position="top" visibilityTime={1000} />
				</SafeAreaProvider>
			</Provider>
		</I18nextProvider>
	);
}
