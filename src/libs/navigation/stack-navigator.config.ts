import { UpdatePasswordComponent } from './../../apps/components/updatePassword/UpdatePasswordComponent';
import { ForgotPasswordComponent } from '@/apps/components/forgotPassword/forgot-password';
import { UpdatePasswordScreen } from './../../apps/screens/updatePassword/updatePasswordScreen';
import { UpdateProfileScreen } from '../../apps/screens/update-profile/update-profile-screen';
import { ChatScreen } from '../../apps/screens/chat-detail/chat-screen';
import { ForgotPasswordScreen } from "@/apps/screens/forgotPassword/forgot-password-screen";
import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { IRoom } from '@/types/implement';

export type RootStackParamList = {
  BottomTabScreenApp: undefined;
  Register: undefined;
  Login: undefined;
  OTP: { identifier: string; type: "phone" | "email" };
  UserDetail: undefined
  Chat: undefined;
  ChatScreen: { room: IRoom };
  LoginUser: undefined;
  ForgotPasswordScreen: undefined; 
  UpdatePasswordScreen: {identifier: string};
  UpdateProfileScreen: undefined;
  ForgotPasswordComponent: undefined;
  Qr: undefined;
  RequestFriendScreen: undefined;
  ChatInfoScreen: undefined;
  
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
export type UpdatePasswordRouteProp = RouteProp<RootStackParamList, "UpdatePasswordScreen">;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;