import { ReactNode } from "react";
import { BaseEntity } from "../base-entity";


export interface IMessage {
	read: boolean;
	reaction: ReactNode;
	time: ReactNode;
	audio: any;
	isEdited: any;
	_id: string;
	accountId?: string;
	room_id?: string;
	content?: string;
	files?: IMessageFile[];
	isDeleted?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	sticker?: string;
	roomId?: string;
	isRevoked?: boolean;
	hiddenWith?: string[];
	type: "mixed" | "sticker" | "call";

}

export interface IMessageFile {
	data: {
		name: string;
		type: string;
		size: string;
	};
	url: string;
	index: number;
	_id: string;
}