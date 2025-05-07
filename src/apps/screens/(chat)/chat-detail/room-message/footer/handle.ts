import { ErrorResponse } from "@/libs/axios/axios.config"
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement"
import { sendMessage } from "@/services"

export const sendMessages = async (content: string, roomId: string) => {
   const accountId = ExpoSecureValueService.getUserId() ?? ""
   if (accountId && content) {
      try {
         const response = await sendMessage({ roomId, type: "mixed", accountId: accountId, content })
      }
      catch (error) {
         const e = error as ErrorResponse
      }
   }
}