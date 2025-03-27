export interface BaseResponse<T> {
	data?: T | null;
	statusCode: number;
	message: string;
}
