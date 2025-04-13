import { SocketEmit } from "@/constants/socket";
import { StackScreenNavigationProp } from "@/libs/navigation";
import { socketService } from "@/libs/socket/socket"

export const handleProfileUpdate = (fullName: string, dateOfBirth: string, gender: boolean, navigate: StackScreenNavigationProp) => {
   socketService.emit(SocketEmit.detailInformation, {

      fullName,
      dateOfBirth,
      gender
   });

   navigate.goBack();
}