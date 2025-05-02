import { avatar } from '@/assets/images';
import { BaseEntity } from "../base-entity";


export interface IDetailInformation extends BaseEntity {
   fullName?: string;
   dateOfBirth?: Date;
   avatarUrl?: string;
   gender?: boolean;
   thumbnailUrl?: string;
}