import { IDetailInformation } from "./detail-information.interface";

export interface IFriend  {
   accountId?: string;
   friendId?: string;
   detail?: IDetailInformation;
}