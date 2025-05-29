// import { BaseEntity } from "../base-entity";
import { IMessageFile } from "./file.interface";


export interface IMessage {
	_id: string;
	message_id?: string;
	accountId?: string;
	roomId?: string;
	content?: string;
	sticker?: string;
	files?: IMessageFile[]; 
	isRevoked?: boolean;
	isDeleted?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	hiddenWith?: string[];
    isPinned?: boolean;
	type: "mixed" | "sticker" | "call",
}