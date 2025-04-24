import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { initRoom } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { BaseResponse } from "@/types";
import { IRoom } from "@/types/implement";

export const getMyListRoom = async () => {
   try{
      const response = await api.get<BaseResponse<IRoom[]>>("/chatroom-merge/my-list-room");
      return response.data;
   }
   catch (error) {
      throw error as ErrorResponse;
   }
}