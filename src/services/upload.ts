import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { BaseResponse } from "@/types";
import { ICloud } from "@/types/base-cloud";

export const uploadSingleImageApi = async (file: FormData | null) => {
   if (!file) {
      return;
   }

   try {
      const response = await api.post<BaseResponse<ICloud>>("/cloud/upload-file", file, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}