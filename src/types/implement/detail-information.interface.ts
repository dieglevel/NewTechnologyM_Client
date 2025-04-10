import { BaseEntity } from "../base-entity";


export interface IDetailInformation extends BaseEntity {
   fullName?: string;
   // address?: string;
   // bio?: string;
   dateOfBirth?: Date;
   avatarUrl?: string;
   gender?: boolean;
   thumbnailUrl?: string;
}