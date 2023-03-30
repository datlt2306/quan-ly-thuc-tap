import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BusinessAPI from "../../API/Business";
export const insertBusiness = createAsyncThunk(
  "business/insertBusiness",
  async (action) => {
    const { data } = await BusinessAPI.add(action);
    return data;
  }
);
export const getBusiness = createAsyncThunk(
  "business/getBusiness",
  async (action) => {
    const { data } = await BusinessAPI.get(action);
    return data;
  }
);

export const getDataBusinessExport = createAsyncThunk(
  'business/getDataBusinessExport',
  async ({ filter, callback }) => {
    const { data } = await BusinessAPI.get(filter);
    if (callback) callback(data.list);
    return data;
  },
);

export const updateWaitBusiness = createAsyncThunk(
  "business/updateWaitBusiness",
  async ({ listIdBusiness, smester_id, callback }) => {
    const { data } = await BusinessAPI.updateMany({
      listIdBusiness,
      smester_id,
    });
    if (callback) callback();
    return data;
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState: {
    listBusiness: {},
    loading: false,
    error: "",
  },
  reducers: {
    getBusinessStudent: (state, action) => {
      state.listBusiness = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBusiness.fulfilled, (state, action) => {
      state.loading = false;
      state.listBusiness = action.payload;
    });
    builder.addCase(getBusiness.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getBusiness.rejected, (state, action) => {
      state.error = "Thất bại";
    });

    builder.addCase(insertBusiness.fulfilled, (state, action) => {
      state.loading = false;
      state.listBusiness = action.payload;
    });
    builder.addCase(insertBusiness.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(insertBusiness.rejected, (state, action) => {
      state.error = "Không đúng định dạng";
    });

    builder.addCase(updateWaitBusiness.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateWaitBusiness.fulfilled, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateWaitBusiness.rejected, (state, action) => {
      state.error = "Update business fail";
    });

     ///export

    builder.addCase(getDataBusinessExport.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getDataBusinessExport.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
  },
});

export const { getBusinessStudent } = businessSlice.actions;
export default businessSlice.reducer;
