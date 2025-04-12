import { api, ErrorResponse } from "@/libs/axios/axios.config";
import { BaseResponse } from "@/types";
import { ICloud } from "@/types/base-cloud";

export const uploadSingleImageApi = async (formData: FormData | null) => {
   if (!formData) {
      return;
   }

   console.log("file", formData.getAll("file"));

   try {
      const response = await api.post<BaseResponse<ICloud>>("/cloud/upload-file", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}