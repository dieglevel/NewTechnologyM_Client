import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { DetailInformationReducer } from "./stores/detail-information-slice";
import { MyListFriendReducer } from "./stores/friend-slice";
import { RequestFriendReducer } from "./stores/request-friend-slice";

export const store = configureStore({
	reducer: {
		detailInformation: DetailInformationReducer,
		myListFriend: MyListFriendReducer,
		requestFriend: RequestFriendReducer,
		
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
