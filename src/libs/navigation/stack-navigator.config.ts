
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
  UserDetail: { userId: string }
  Chat: undefined;
  ChatScreen: { room: IRoom };
  LoginUser: undefined;
  ForgotPasswordScreen: undefined;
  UpdatePasswordScreen: { identifier: string };
  UpdateProfileScreen: undefined;
  ForgotPasswordComponent: undefined;
  Qr: undefined;
  RequestFriendScreen: undefined;
  RoomInformationScreen: undefined;
  ListRoomScreen: undefined;
  ImagePreviewScreen: { url: string }
  SendedFriendScreen: undefined
  CreateRoomScreen: undefined;
  
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type StackScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type OTPRouteProp = RouteProp<RootStackParamList, "OTP">;
export type UserDetailRouteProp = RouteProp<RootStackParamList, "UserDetail">;
export type UpdatePasswordRouteProp = RouteProp<RootStackParamList, "UpdatePasswordScreen">;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;
export type ImagePreviewScreenRouteProp = RouteProp<RootStackParamList, "ImagePreviewScreen">;