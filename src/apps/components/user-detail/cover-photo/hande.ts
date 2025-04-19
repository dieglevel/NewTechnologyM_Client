import { SocketEmit } from "@/constants/socket";
import { store } from "@/libs/redux/redux.config";
import { setDetailInformation } from "@/libs/redux/stores";
import { socketService } from "@/libs/socket/socket";
import { uploadSingleImageApi } from "@/services/upload";
import { IDetailInformation } from "@/types/implement";
import * as DocumentPicker from 'expo-document-picker';
import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-toast-message";

export const pickImage = async (setImage: Dispatch<SetStateAction<string | null>>) => {
   try {
      const result = await DocumentPicker.getDocumentAsync({
         type: 'image/*',
         copyToCacheDirectory: true,
      });

      // console.log(result);
      if (result.canceled === false) {
         const formData = new FormData();

         formData.append('file', {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: result.assets[0].mimeType,
         } as unknown as Blob);

         const response = await uploadSingleImageApi(formData);
         if (response?.data) {
            setImage(response.data.url ?? null);
            Toast.show({
               type: 'success',
               text1: 'Upload',
               text2: 'Tải ảnh thành công',
            });
            socketService.emit(SocketEmit.detailInformation, {
               thumbnailUrl: response.data.url,
            });

            socketService.on(SocketEmit.detailInformation, (data: IDetailInformation) => {
               store.dispatch(setDetailInformation(data));
            });
         } else {
            Toast.show({
               type: 'error',
               text1: 'Error',
               text2: 'Không thể tải ảnh lên.',
            });
         }
      }
   } catch (error) {
      console.error('Error picking document:', error);
   }

};
