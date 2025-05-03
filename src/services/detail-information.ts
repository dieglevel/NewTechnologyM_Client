import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement";
import { BaseResponse } from "@/types";
import { IDetailInformation } from "@/types/implement";

export interface UpdateProfileRequest {
   thumbnailUrl?: string;
   gender?: boolean;
   fullName?: string;
   dateOfBirth?: Date;
   avatarUrl?: string;
}

export const updateProfile = async (profile: UpdateProfileRequest) => {
   try {
      const response = await api.post<BaseResponse<IDetailInformation>>("/detail-information/update", {
         ...profile,
      })

      return response.data

   } catch (error) {
      throw error as ErrorResponse
   }
}

export const getProfile = async () => {
   const userId = ExpoSecureValueService.getUserId();
   try {
      const response = await api.get<BaseResponse<IDetailInformation>>(`/detail-information/${userId}`)
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}

export const getProfileFromAnotherUser = async (id: string) => {
	try {
		const response = await api.get<BaseResponse<IDetailInformation>>(`/detail-information/${id}`);
		return response.data;
	} catch (error) {
		throw error as ErrorResponse;
	}
};
