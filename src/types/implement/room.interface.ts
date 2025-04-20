import { BaseEntity } from "../base-entity";
import { IMessage } from "./message.interface";


export interface IRoom extends BaseEntity {
	id: string;
	name: string;
	isSeen?: string[];
	leader_account_id: string;
	lastMessage: IMessage;
	type: string;
	isDelete: boolean;
	isLoad: boolean;
}