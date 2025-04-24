import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { DetailInformationReducer, MessageReducer, MyListFriendReducer, RequestFriendReducer, RoomReducer, SendedFriendReducer } from "./stores/model";
import { SelectedRoomReducer } from "./stores";


export const store = configureStore({
	reducer: {
		detailInformation: DetailInformationReducer,
		myListFriend: MyListFriendReducer,
		requestFriend: RequestFriendReducer,
		sendedFriend: SendedFriendReducer,
		room: RoomReducer,
		message: MessageReducer,
		selectedRoom: SelectedRoomReducer
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
