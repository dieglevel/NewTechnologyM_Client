import { sendedFriendStorage } from "@/libs/mmkv";
import { ISendedFriend } from "@/types/implement";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";



const storeName = "sendedFriend"; // Tên store trong IndexedDB
const thunkDB = "mmkv/"
const thunkName = "SendedFriend";

const thunkAction = {
  fetch: "fetch",
  set: "set",
  delete: "delete",
  init: "init",
}


export const fetchSendedFriend = createAsyncThunk(`${thunkDB}${thunkAction.fetch}${thunkName}`, async (): Promise<ISendedFriend[]> => {
  const sendedFriendStorages = sendedFriendStorage.getAll();
  // console.log("sendedFriendStorages", sendedFriendStorages);
  return sendedFriendStorages;
});

export const setSendedFriend = createAsyncThunk(`${thunkDB}${thunkAction.set}${thunkName}`, async (friend: ISendedFriend[]) => {
  const sendedFriendStorages = sendedFriendStorage.setMany(friend);
  // console.log("sendedFriendStorages", sendedFriendStorages);
  const data = sendedFriendStorage.getAll();
  return data;
});

export const deleteSendedFriend = createAsyncThunk(`${thunkDB}${thunkAction.delete}${thunkName}`, async (id: string) => {
  sendedFriendStorage.delete(id);
  return id;
});

export const initSendedFriend = createAsyncThunk(`${thunkDB}${thunkAction.init}${thunkName}`, async (friends: ISendedFriend[]) => {
  sendedFriendStorage.clearAll();
  sendedFriendStorage.setMany(friends);
  return friends;
});

interface state {
  sendedFriends: ISendedFriend[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: state = {
  sendedFriends: null,
  status: "idle",
};

const sendedFriendSlice = createSlice({
  name: "sended-friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSendedFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSendedFriend.fulfilled, (state, action: PayloadAction<ISendedFriend[]>) => {
        state.status = "succeeded";
        state.sendedFriends = action.payload;
      })
      .addCase(fetchSendedFriend.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(setSendedFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setSendedFriend.fulfilled, (state, action: PayloadAction<ISendedFriend[]>) => {
        state.status = "succeeded";
        state.sendedFriends = action.payload;
      })
      .addCase(setSendedFriend.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(deleteSendedFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSendedFriend.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        const index = state.sendedFriends?.findIndex((friend) => friend.receiver_id === action.payload);
        if (index !== undefined && index !== -1) {
          if (state.sendedFriends) {
            state.sendedFriends.splice(index, 1);
          }
        }
      })
      .addCase(deleteSendedFriend.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initSendedFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initSendedFriend.fulfilled, (state, action: PayloadAction<ISendedFriend[]>) => {
        state.status = "succeeded";
        state.sendedFriends = action.payload;
      })
      .addCase(initSendedFriend.rejected, (state) => {
        state.status = "failed";
      });


  },
});


export const SendedFriendReducer = sendedFriendSlice.reducer;

