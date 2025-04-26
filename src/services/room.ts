import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { initRoom } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { BaseResponse } from "@/types";
import { IRoom } from "@/types/implement";

interface ICreateGroup {
	name: string;
}
interface IAddMember {
	roomId: string;
	listAccount: string[];
}

interface IDeleteMember {
	roomId: string;
	removeUserID: string;
}

export const getMyListRoom = async () => {
   try{
      const response = await api.get<BaseResponse<{listRoomResponse: IRoom[]}>>("/chatroom-merge/my-list-room");
      return response.data;
   }
   catch (error) {
      throw error as ErrorResponse;
   }
}
export const createRoom = async (data: ICreateGroup) => {
	try {
		const response = await api.post<BaseResponse<IRoom>>(`/chat-room/create-group`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("Room created successfully:", response.data);
		return response.data;
	} catch (error) {
		throw error as ErrorResponse;
	}
};

export const addMember = async (data: IAddMember) => {
	try {
		const response = await api.post<BaseResponse<IRoom>>(
			`/chat-room/add-member?chatRoomID=${data.roomId}`,
			{ userAddIDs: data.listAccount },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		console.log("Member added successfully:", response.data);
		return response.data;
	} catch (error) {
		throw error as ErrorResponse;
	}
};

export const deleteMember = async (data: IDeleteMember) => {
	try {
		const response = await api.post<BaseResponse<IRoom>>(
			`/chat-room/remove-member?chatRoomID=${data.roomId}`,
			{ removeUserID: data.removeUserID },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		console.log("Member removed successfully:", response.data);
		return response.data;
	} catch (error) {
		throw error as ErrorResponse;
	}
};

export const disbandGroup = async (data: string) => {
	try {
		const response = await api.post<BaseResponse<IRoom>>(
			`/chat-room/disband?chatRoomID=${data}`
		);
		console.log("Group disbanded successfully:", response.data);
		return response.data;
	} catch (error) {
		throw error as ErrorResponse;
	}
};