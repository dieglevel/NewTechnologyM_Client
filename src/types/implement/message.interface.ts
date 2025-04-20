import { BaseEntity } from "../base-entity";


export interface IMessage extends BaseEntity {
	_id: string;
	message_id: string;
	accountId: string;
	room_id: string;
	content: string;
	file?: string;
}