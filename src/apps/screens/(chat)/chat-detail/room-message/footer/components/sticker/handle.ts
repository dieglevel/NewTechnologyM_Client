import { ErrorResponse } from "@/libs/axios/axios.config"
import { ExpoSecureValueService } from "@/libs/expo-secure-store/implement"
import { sendMessage } from "@/services"

export const sendSticker = async (sticker: string | null, roomId: string) => {
   const accountId = ExpoSecureValueService.getUserId() ?? ""
   if (accountId && sticker) {
      try {
         const response = await sendMessage({ roomId, type: "sticker", accountId: accountId, sticker })
      }
      catch (error) {
         const e = error as ErrorResponse
      }
   }
} 