import { IFileData } from "./file-data.interface";

export interface IMessageFile {
	data: IFileData;
	index: number;
	url: string;
	_id: string;
}
