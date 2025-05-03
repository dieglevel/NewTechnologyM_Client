// roomSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "@/types/implement/message.interface";
import { messageStorage } from "@/libs/mmkv";
import { init } from "i18next";

// Config constants
const storeName = "message";
const thunkDB = "mmkv/";
const thunkName = "Message";

const thunkAction = { fetch: "fetch", set: "set", delete: "delete", setOne: "setOne", fetchByRoomId: "fetchByRoomId", init: "init" };

// IDB instance

// Async thunks
export const fetchMessage = createAsyncThunk(
	`${thunkDB}${thunkAction.fetch}${thunkName}`,
	async (): Promise<IMessage[]> => {
		const message = messageStorage.getAll();
		// console.log("messageStorage fetch", messageStorage.getAll());
		// console.log("messageStorage fetch", message);
		return message;
	},
);

export const fetchMessageByRoomId = createAsyncThunk(
	`${thunkDB}${thunkAction.fetchByRoomId}${thunkName}`,
	async (roomId: string): Promise<IMessage[]> => {
		const message = messageStorage.getAll().filter((message) => message.roomId === roomId);
		// console.log("messageStorage fetch", messageStorage.getAll());
		// console.log("messageStorage fetch", message);
		return message;

	},
);

export const setMessage = createAsyncThunk(
	`${thunkDB}${thunkAction.set}${thunkName}`,
	async ({ messages, roomId }: { messages: IMessage[]; roomId: string }): Promise<IMessage[]> => {



		// Fetch existing messages for the room
		const existingMessages = messageStorage.getAll().filter((message) => message.roomId === roomId);
		// If there are existing messages, delete the first one
		if (existingMessages.length > 0) {
			if (existingMessages[0]._id) {
				messageStorage.delete(existingMessages[0]._id);
			}
		}
		messageStorage.setMany(messages);
		return messages;
	},
);

export const setOneMessage = createAsyncThunk(
	`${thunkDB}${thunkAction.setOne}${thunkName}`,
	async (m: IMessage) => {
		const messageStorageData = messageStorage.getAll().filter((message) => message.roomId === m.roomId);
		if (messageStorageData.length > 0) {
			if (messageStorageData[0]._id) {
				messageStorage.delete(messageStorageData[0]._id);
			}
		}
		messageStorage.set(m);
		return m;
	},
);

export const deleteMessage = createAsyncThunk(`${thunkDB}${thunkAction.delete}${thunkName}`, async (id: string) => {
	const messageStorageData = messageStorage.getAll().filter((m) => m._id === id);
	if (messageStorageData.length > 0) {
		if (messageStorageData[0]._id) {
			messageStorage.delete(messageStorageData[0]._id);
		}
	}
	return id;
});

export const initMessage = createAsyncThunk(`${thunkDB}${thunkAction.init}${thunkName}`, async ({ messages, roomId }: { messages: IMessage[], roomId: string }) => {
	// messageStorage.clearAll();
	// console.log("messageStorage init", messages);
	messageStorage.setMany(messages);
	// const messageStorageData = messageStorage.getAll()
	return messages;
});

// Slice state interface
interface MessageState {
	message: IMessage[] | null;
	status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: MessageState = { message: null, status: "idle" };

const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMessage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchMessage.fulfilled, (state, action: PayloadAction<IMessage[]>) => {
				state.status = "succeeded";
				state.message = action.payload;
			})
			.addCase(fetchMessage.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(fetchMessageByRoomId.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchMessageByRoomId.fulfilled, (state, action: PayloadAction<IMessage[]>) => {
				state.status = "succeeded";
				state.message = action.payload;
			})
			.addCase(fetchMessageByRoomId.rejected, (state) => {
				state.status = "failed";
			})

			.addCase(setMessage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(setMessage.fulfilled, (state, action: PayloadAction<IMessage[]>) => {
				state.status = "succeeded";

				if (action.payload) {
					if (state.message) {
						action.payload.forEach((newMessage) => {
							const index = state.message!.findIndex((m) => m._id === newMessage._id);
							if (index >= 0) {
								state.message![index] = newMessage;
							} else {
								state.message!.push(newMessage);
							}
						});
					} else {
						state.message = action.payload;
					}
				}
			})
			.addCase(setMessage.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(setOneMessage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(setOneMessage.fulfilled, (state, action: PayloadAction<IMessage | undefined>) => {
				state.status = "succeeded";

				const newMessage = action.payload;

				if (newMessage) {
					if (state.message) {
						const index = state.message.findIndex((m) => m._id === newMessage._id);
						if (index >= 0) {
							state.message![index] = newMessage;
						} else {
							state.message = [...state.message, newMessage];
						}
					} else {
						state.message = [newMessage];
					}
				}
			})
			.addCase(setOneMessage.rejected, (state) => {
				state.status = "failed";
			})

			.addCase(deleteMessage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(deleteMessage.fulfilled, (state, action: PayloadAction<string>) => {
				state.status = "succeeded";
				if (state.message) {
					state.message = state.message.filter((m) => m._id !== action.payload);
				}
			})
			.addCase(deleteMessage.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(initMessage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(initMessage.fulfilled, (state, action: PayloadAction<IMessage[]>) => {
				state.status = "succeeded";
				state.message = action.payload;
			})
			.addCase(initMessage.rejected, (state) => {
				state.status = "failed";
			});

	},
});

export const MessageReducer = messageSlice.reducer;
