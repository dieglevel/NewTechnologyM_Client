import { ErrorResponse } from "@/libs/axios/axios.config";
import { initMyListFriend, initRoom } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { addMember, createRoom, getListFriend, getRoom } from "@/services";
import Toast from "react-native-toast-message";

export const fetchedFriend = async () => {
   try {
      const response = await getListFriend();
      if (response?.statusCode === 200) {
         // console.log("response: ", response.data);
         store.dispatch(initMyListFriend(response?.data || []));
      }
   } catch (error) {
      const e = error as ErrorResponse;
   }
};

export const fetchedRoom = async () => {
   const response = await getRoom();
   if (response?.statusCode === 200 && response.data) {
      await store.dispatch(initRoom(response?.data.listRoomResponse || []));
   }
};


export const createGroup = async (nameGroup: string, checked: string[], setShowCreateGroupModal: React.Dispatch<React.SetStateAction<boolean>>, setChecked: React.Dispatch<React.SetStateAction<string[]>>, setNameGroup: React.Dispatch<React.SetStateAction<string>>) => {
   if (nameGroup.trim() === "") {
      Toast.show({
         type: "error",
         text1: "Tên nhóm không được để trống",
         position: "top",
      });
      return;
   }
   if (checked.length < 2) {
      Toast.show({
         type: "error",
         text1: "Bạn cần chọn ít nhất 2 người bạn",
         position: "top",
      });
      return;
   }
   try {
      const response = await createRoom({ name: nameGroup });
      if (response?.statusCode === 200) {
         const roomId = response.data?.id || "";
         const listAccount = checked.map((item) => item);
         const responseAddMember = await addMember({ roomId: roomId, listAccount: listAccount });
         if (responseAddMember?.statusCode === 200) {
            Toast.show({
               type: "success",
               text1: "Tạo nhóm thành công",
               position: "top",
            });
            setShowCreateGroupModal(false);
            setChecked([]);
            setNameGroup("");
            return;
         }
      }
   } catch (error) {
      const e = error as ErrorResponse;
      Toast.show({
         type: "error",
         text1: e.message,
         position: "top",
      });
   }
};