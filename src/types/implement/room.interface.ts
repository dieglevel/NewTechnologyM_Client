import { BaseEntity } from "../base-entity";
import { IMessage } from "./message.interface";

export interface LatestMessage {
	_id: string;
	accountId?: string;
	roomId?: string;
	content?: string;
	sticker?: string;
	isDeleted?: boolean;
	isRevoked?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	__v?: number;
 }
 
 export interface RoomMember {
	id: string;
	fullName?: string;
	avatar?: string
 }
 
 export interface IRoom {
	id: string;
	leader_account_id?: string;
	type?: "group" | "single" ;
	updatedAt?: Date; // ISO date string
	avatar?: string
	latestMessage?: LatestMessage;
	name?: string;
	detailRoom: RoomMember[];
 }
 