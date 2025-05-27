// roomSlice.ts
import { roomStorage } from "@/libs/mmkv";
import { IRoom } from "@/types/implement";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Config constants
const storeName = "room";
const thunkDB = "mmkv/";
const thunkName = "Room";

const thunkAction = { fetch: "fetch", set: "set", delete: "delete", init: "init" };

// IDB instance

// Async thunks
export const fetchRoom = createAsyncThunk(`${thunkDB}${thunkAction.fetch}${thunkName}`, async (): Promise<IRoom[]> => {
	const rooms = roomStorage.getAll();
	// console.log("rooms", rooms);
	return rooms || null;
});

export const setRoom = createAsyncThunk(`${thunkDB}${thunkAction.set}${thunkName}`, async (rooms: IRoom[]) => {
	const updatedRooms = roomStorage.setMany(rooms);
	const room = roomStorage.getAll();
	// console.log("room", room);
	return room;
});

export const deleteRoom = createAsyncThunk(`${thunkDB}${thunkAction.delete}${thunkName}`, async (id: string) => {
	roomStorage.delete(id);
	const room = roomStorage.getAllKeys();
	// console.log("Remaining rooms", room);
	return id;
});

export const initRoom = createAsyncThunk(`${thunkDB}${thunkAction.init}${thunkName}`, async (rooms: IRoom[]): Promise<IRoom[]> => {
	roomStorage.clearAll();
	roomStorage.setMany(rooms);
	// console.log("rooms", roomStorage.getAll());
	return rooms;
});

// Slice state interface
interface RoomState {
	room: IRoom[] | null;
	status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RoomState = { room: null, status: "idle" };

const roomSlice = createSlice({
	name: "room",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRoom.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchRoom.fulfilled, (state, action: PayloadAction<IRoom[]>) => {
				state.status = "succeeded";
				state.room = action.payload;
			})
			.addCase(fetchRoom.rejected, (state) => {
				state.status = "failed";
			})

			.addCase(setRoom.pending, (state) => {
				state.status = "loading";
			})
			.addCase(setRoom.fulfilled, (state, action: PayloadAction<IRoom[]>) => {
				state.status = "succeeded";
				state.room = action.payload;
			})
			.addCase(setRoom.rejected, (state) => {
				state.status = "failed";
			})

			.addCase(deleteRoom.pending, (state) => {
				state.status = "loading";
			})
			.addCase(deleteRoom.fulfilled, (state, action: PayloadAction<string>) => {
				state.status = "succeeded";
				if (state.room) {
					state.room = state.room.filter((r) => r.id !== action.payload);
				}
			})
			.addCase(deleteRoom.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(initRoom.pending, (state) => {
				state.status = "loading";
			})
			.addCase(initRoom.fulfilled, (state, action: PayloadAction<IRoom[]>) => {
				state.status = "succeeded";
				state.room = action.payload;
			})
			.addCase(initRoom.rejected, (state) => {
				state.status = "failed";
			})

	},
});

export const RoomReducer = roomSlice.reducer;
