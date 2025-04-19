import { IDetailInformation } from "./detail-information.interface";

export interface IRequestFriend {
   message?: string,
   receiver_id?: string,
   sender_id?: string,
   requestId?: string,
   detail?: IDetailInformation
}