
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationProp, RouteProp } from "@react-navigation/native";

export const Tab = createBottomTabNavigator<RootTabParamList>();

export type RootTabParamList = {
	ListRoomScreen: undefined;
	UserScreen: undefined;
	ContactScreen: undefined
};

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootTabParamList {}
	}
}

export type ScreenTabNavigationProp = NavigationProp<RootTabParamList>;
export type ScreenTabRouteProp = RouteProp<RootTabParamList>;
