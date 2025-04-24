import { BaseEntity } from "../base-entity";


export interface IMessage {
	_id: string;
	accountId?: string;
	room_id?: string;
	content?: string;
	files?: IMessageFile[];
	isDeleted?: boolean;
   createdAt?: Date;
   updatedAt?: Date;
	sticker?: string;
	
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