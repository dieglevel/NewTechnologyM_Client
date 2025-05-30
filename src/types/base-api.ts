export interface BaseResponse<T> {
	isPinned: boolean;
	data: T ;
	statusCode: number;
	message: string;
}
