import { IFileData } from "./file-data.interface";

export interface IMessageFile {
  uri: boolean;
  name: boolean;
	data: IFileData;
	index: number;
	url: string;
	_id: string;
}
