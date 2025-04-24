import { BaseEntity } from "../base-entity";


export interface IMessage {
	_id?: string;
	accountId?: string;
	room_id?: string;
	content?: string;
	file?: IMessageFile[];
	isDeleted?: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface IMessageFile{
	data: {
		name: string;
		type: string;
		size: string;
	};
	url: string;
	index: number;
	_id: string;
}