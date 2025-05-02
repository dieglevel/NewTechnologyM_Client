import { detailInformationStorage } from "@/libs/mmkv/mmkv";
import { IDetailInformation } from "@/types/implement";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MMKV } from 'react-native-mmkv';


// Tên store trong MMKV
const storeName = "detailInformation"; // Tên của item trong MMKV
const thunkDB = "mmkv/"
const thunkName = "DetailInformation";

const thunkAction = {
  fetch: "fetch",
  set: "set",
  delete: "delete",
  init: "init"
};


// Fetch dữ liệu từ MMKV
export const fetchDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.fetch}${thunkName}`,
  async (): Promise<IDetailInformation | null> => {
    const detailInformations = detailInformationStorage.getAll();
    // console.log("detailInformations", detailInformations);
    return detailInformations[0] || null;
  }
);

// Lưu dữ liệu vào MMKV
export const setDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.set}${thunkName}`,
  async (detailInformation: IDetailInformation) => {
    detailInformationStorage.set(detailInformation);
    return detailInformation;
  }
);

// Xóa thông tin trong MMKV
export const deleteDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.delete}${thunkName}`,
  async (id: string) => {

    detailInformationStorage.delete(id);
    return id;
  }
);

export const initDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.init}${thunkName}`,
  async (detailInformation: IDetailInformation) => {
    detailInformationStorage.clearAll();
    detailInformationStorage.initData([detailInformation]);
    return detailInformationStorage.getAll();
  }
)

interface State {
  detailInformation: IDetailInformation | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: State = {
  detailInformation: null,
  status: "idle",
};

const detailInformationSlice = createSlice({
  name: "detail-information",
  initialState,
  reducers: {
    setDetailInformationReducer: (state, action: PayloadAction<IDetailInformation>) => {
      state.detailInformation = action.payload;
    },
    clearDetailInformationReducer: (state) => {
      state.detailInformation = null;
      state.status = "idle";
    },
    setDetailInformationStatusReducer: (state, action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailInformation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDetailInformation.fulfilled, (state, action: PayloadAction<IDetailInformation | null>) => {
        state.status = "succeeded";
        state.detailInformation = action.payload;
      })
      .addCase(fetchDetailInformation.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(setDetailInformation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setDetailInformation.fulfilled, (state, action: PayloadAction<IDetailInformation>) => {
        state.status = "succeeded";
        state.detailInformation = action.payload;
      })
      .addCase(setDetailInformation.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(deleteDetailInformation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDetailInformation.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        if (state.detailInformation && state.detailInformation.id === action.payload) {
          state.detailInformation = null;
        }
      })
      .addCase(deleteDetailInformation.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setDetailInformationReducer, clearDetailInformationReducer, setDetailInformationStatusReducer } = detailInformationSlice.actions;
export const DetailInformationReducer = detailInformationSlice.reducer;
