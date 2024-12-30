export interface BaseAxiosResponse<T> {
	data: T | null;
	statusCode: number;
	message: string;
}