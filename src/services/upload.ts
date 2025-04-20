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
export const uploadMultipleImageApi = async (file: FormData | null) => {
   if (!file) {
      return;
   }

   try {
      const response = await api.post<BaseResponse<ICloud>>("/cloud/upload-multiple-file", file, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}

export const deleteFileApi = async (fileId: string) => {
   try {
      const response = await api.delete<BaseResponse<ICloud>>(`/cloud/delete-file/${fileId}`);
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}
export const deleteMultipleFileApi = async (fileIds: string[]) => {
   try {
      const response = await api.delete<BaseResponse<ICloud>>("/cloud/delete-multiple-file", {
         data: { fileIds },
      });
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}
export const updateFileApi = async (fileId: string, file: FormData | null) => {
   if (!file) {
      return;
   }

   try {
      const response = await api.put<BaseResponse<ICloud>>(`/cloud/update-file/${fileId}`, file, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}
export const updateMultipleFileApi = async (fileIds: string[], files: FormData | null) => {
   if (!files) {
      return;
   }

   try {
      const response = await api.put<BaseResponse<ICloud>>("/cloud/update-multiple-file", files, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
         data: { fileIds },
      });
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}
export const messageApi = async (fileId: string) => {
   try {
      const response = await api.post<BaseResponse<ICloud>>(`/cloud/message/${fileId}`);
      return response.data
   } catch (error) {
      throw error as ErrorResponse
   }
}
export const uploadAudioToMessageApi = async (formData: FormData) => {
   try {
     const response = await api.post<BaseResponse<ICloud>>("/message", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });
     return response.data;
   } catch (error) {
     throw error as ErrorResponse;
   }
 };
 