import { ErrorResponse } from "@/libs/axios/axios.config"
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement"
import { sendMessage } from "@/services"
import { BaseFile } from "@/types/base-file"

export const sendFile = async (files: BaseFile[], roomId: string) => {
   const accountId = ExpoSecureValueService.getUserId() ?? ""
   if (accountId && files) {
      try {
         const response = await sendMessage({ roomId, type: "mixed", accountId: accountId, files })
      }
      catch (error) {
         const e = error as ErrorResponse
      }
   }
}