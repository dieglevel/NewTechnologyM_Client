import { UpdateProfileScreen } from '../../apps/screens/update-profile/update-profile-screen';
import { ChatScreen } from '../../apps/screens/chat-detail/chat-screen';
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
  OTP: { identifier: string; type: "phone" | "email" };
  UserDetail: undefined
  Chat: undefined;
  ChatDetail: { chatId: string };
  ChatScreen: undefined;
  LoginUser: undefined;
  ForgotPasswordScreen: undefined; 
  UpdateProfileScreen: undefined;
  Qr: undefined;
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
