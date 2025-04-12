import { uploadSingleImageApi } from "@/services/upload";
import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-toast-message";

export const pickImage = async (setImage: Dispatch<SetStateAction<string | null>>) => {
   const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

   if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
   }

   const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
   });

   if (!result.canceled && result.assets.length > 0) {
      const formData = new FormData();

      formData.append('file', {
         uri: result.assets[0].uri,
         name: result.assets[0].fileName || 'image.jpg',
         type: result.assets[0].type || 'image/jpeg',
      } as unknown as Blob);


      try {
         const response = await uploadSingleImageApi(formData);
         console.log("Response upload image:", response);
         if (response?.statusCode === 200) {
            setImage(response?.data?.url || null);
            Toast.show({
               type: "success",
               text1: "Upload ảnh thành công",
            });
         } else {
            Toast.show({
               type: "error",
               text1: "Upload ảnh thất bại",
            });
         }
      } catch (error) {
         console.log("Error uploading image:", error);
      }
   }
};
