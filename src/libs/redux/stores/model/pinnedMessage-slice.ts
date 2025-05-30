import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PinnedMessagesState {
  [chatRoomId: string]: any | null;
}

const initialState: PinnedMessagesState = {};

const pinnedMessageSlice = createSlice({
  name: "pinnedMessage",
  initialState,
  reducers: {
    setPinnedMessage: (
      state,
      action: PayloadAction<{ chatRoomId: string; message: any }>
    ) => {
      state[action.payload.chatRoomId] = action.payload.message;
    },
    clearPinnedMessage: (state, action: PayloadAction<{ chatRoomId: string }>) => {
      state[action.payload.chatRoomId] = null;
    },
  },
});

export const { setPinnedMessage, clearPinnedMessage } = pinnedMessageSlice.actions;
export default pinnedMessageSlice.reducer;
