import { IRoom } from "@/types/implement/room.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedRoomState {
	selectedRoom: IRoom | null;
}

const initialState: SelectedRoomState = {
	selectedRoom: null,
};

const selectedRoomSlice = createSlice({
	name: "selectedRoom",
	initialState,
	reducers: {
		setSelectedRoom: (state, action: PayloadAction<IRoom>) => {
			state.selectedRoom = action.payload;
		},
		clearSelectedRoom: (state) => {
			state.selectedRoom = null;
		},
	},
});

export const { setSelectedRoom, clearSelectedRoom } = selectedRoomSlice.actions;
export const SelectedRoomReducer = selectedRoomSlice.reducer;
