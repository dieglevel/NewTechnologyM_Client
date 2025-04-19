// idbSlice.ts
import { myListFriendStorage } from "@/libs/mmkv";
import { IFriend } from "@/types/implement";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";



const storeName = "myListFriend"; // Tên store trong IndexedDB
const thunkDB = "mmkv/"
const thunkName = "MyListFriend";

const thunkAction = {
  fetch: "fetch",
  set: "set",
  delete: "delete",
  init: "init",
}


export const fetchMyListFriend = createAsyncThunk(`${thunkDB}${thunkAction.fetch}${thunkName}`, async (): Promise<IFriend[]> => {
  const myListFriendRequestStorages = myListFriendStorage.getAll();
  console.log("myListFriendRequestStorages fetch", myListFriendRequestStorages);
  return myListFriendRequestStorages;
});

export const setMyListFriend = createAsyncThunk(`${thunkDB}${thunkAction.set}${thunkName}`, async (friend: IFriend[]) => {
  const myListFriendRequestStorages = myListFriendStorage.setMany(friend);
  console.log("myListFriendRequestStorages", myListFriendRequestStorages);
  const data = myListFriendStorage.getAll();
  return data;
});

export const deleteMyListFriend = createAsyncThunk(`${thunkDB}${thunkAction.delete}${thunkName}`, async (id: string) => {
  myListFriendStorage.delete(id);
  return id;
});

export const initMyListFriend = createAsyncThunk(`${thunkDB}${thunkAction.init}${thunkName}`, async (friend: IFriend[]) => {
  myListFriendStorage.clearAll();
  myListFriendStorage.setMany(friend);
  console.log("myListFriendRequestStorages", myListFriendStorage.getAll());
  return friend;
});

interface state {
  myListFriend: IFriend[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: state = {
  myListFriend: null,
  status: "idle",
};

const myListFriendSlice = createSlice({
  name: "my-list-friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyListFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyListFriend.fulfilled, (state, action: PayloadAction<IFriend[]>) => {
        state.status = "succeeded";
        state.myListFriend = action.payload;
      })
      .addCase(fetchMyListFriend.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(setMyListFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setMyListFriend.fulfilled, (state, action: PayloadAction<IFriend[]>) => {
        state.status = "succeeded";
        state.myListFriend = action.payload;
      })
      .addCase(setMyListFriend.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(deleteMyListFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMyListFriend.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        const index = state.myListFriend?.findIndex((friend) => friend.accountId === action.payload);
        if (index !== undefined && index !== -1) {
          if (state.myListFriend) {
            state.myListFriend.splice(index, 1);
          }
        }
      })
      .addCase(deleteMyListFriend.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initMyListFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initMyListFriend.fulfilled, (state, action: PayloadAction<IFriend[]>) => {
        state.status = "succeeded";
        state.myListFriend = action.payload;
      })
      .addCase(initMyListFriend.rejected, (state) => {
        state.status = "failed";
      });
      

  },
});


export const MyListFriendReducer = myListFriendSlice.reducer;

