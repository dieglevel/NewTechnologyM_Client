import { IDetailInformation } from "@/types/implement";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Tên store trong MMKV
const storeName = "detailInformation"; // Tên của item trong MMKV
const thunkDB = "mmkv/"
const thunkName = "DetailInformation";

const thunkAction = {
  fetch: "fetch",
  set: "set",
  delete: "delete",
};

const getKey = (id: string) => `${storeName}:${id}`;

// Fetch dữ liệu từ MMKV
export const fetchDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.fetch}${thunkName}`,
  async (): Promise<IDetailInformation | null> => {
    const json = storage.getString(storeName);
    if (json) {
      const detailInformations: IDetailInformation[] = JSON.parse(json);
      console.log("DetailInformation MMKV: ", detailInformations);
      return detailInformations[0] || null;
    }
    return null;
  }
);

// Lưu dữ liệu vào MMKV
export const setDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.set}${thunkName}`,
  async (detailInformation: IDetailInformation) => {
    const existingData = storage.getString(storeName);
    let updatedData: IDetailInformation[] = [];

    if (existingData) {
      updatedData = JSON.parse(existingData);
    }

    // Cập nhật hoặc thêm mới thông tin
    const index = updatedData.findIndex(item => item.id === detailInformation.id);
    if (index >= 0) {
      updatedData[index] = detailInformation; // Cập nhật nếu có
    } else {
      updatedData.push(detailInformation); // Thêm mới nếu chưa có
    }

    storage.set(storeName, JSON.stringify(updatedData)); // Lưu lại
    return detailInformation;
  }
);

// Xóa thông tin trong MMKV
export const deleteDetailInformation = createAsyncThunk(
  `${thunkDB}${thunkAction.delete}${thunkName}`,
  async (id: string) => {
    const existingData = storage.getString(storeName);
    if (existingData) {
      let updatedData: IDetailInformation[] = JSON.parse(existingData);
      updatedData = updatedData.filter(item => item.id !== id); // Lọc ra thông tin cần xóa
      storage.set(storeName, JSON.stringify(updatedData)); // Lưu lại danh sách sau khi xóa
    }
    return id;
  }
);

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
  reducers: {},
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

export const DetailInformationReducer = detailInformationSlice.reducer;
