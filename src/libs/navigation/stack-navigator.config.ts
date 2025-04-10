import { ChatScreen } from '../../apps/screens/chatDetail/chat-screen';
import { ForgotPasswordScreen } from "@/apps/screens/forgotPassword/forgot-password-screen";
import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

export type RootStackParamList = {
  BottomTabScreenApp: undefined;
  Register: undefined;
  Login: undefined;
  OTP: { phone: string };
  UserDetail: {
    user: {
      name: string;
      mainAvatar: string;
      coverAvatar: string;
    };
  };
  Chat: undefined;
  ChatDetail: { chatId: string };
  ChatScreen: undefined;
  LoginUser: undefined;
  ForgotPasswordScreen: undefined; 
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type StackScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type OTPRouteProp = RouteProp<RootStackParamList, "OTP">;
export type UserDetailRouteProp = RouteProp<RootStackParamList, "UserDetail">;
