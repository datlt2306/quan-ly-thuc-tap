import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CumpusApi from "../../API/Cumpus";

export const getListCumpus = createAsyncThunk(
  "cumpus/getListCumpus",
  async () => {
    const { data } = await CumpusApi.getList();
    return data.listCumpus;
  }
);

export const getCumpus = createAsyncThunk(
  "cumpus/getCumpus",
  async (id) => {
    const { data } = await CumpusApi.get(id);
    return data.cumpus;
  }
);

export const createCumpus = createAsyncThunk(
  "cumpus/createCumpus",
  async (payload) => {
    const {dataForm, callback} = payload
    const { data } = await CumpusApi.create(dataForm);
    if (callback) callback(data)
      return data
  }
);

export const updateCumpus = createAsyncThunk(
  "cumpus/updateCumpus",
  async (payload) => {
    const {dataForm, callback} = payload
    const { data } = await CumpusApi.update( dataForm);
    if (callback) callback(data)
    return data;
  }
);

export const removeCumpus = createAsyncThunk(
  "cumpus/removeCumpus",
  async (payload) => {
    const{id, callback} =  payload
    const { data } = await CumpusApi.remove(id);
    if (callback) callback(data)
      return data
  }
);

const cumpusSlice = createSlice({
  name: "cumpus",
  initialState: {
    listCumpus: [],
    campus:{},
    loading: false,
    message: "",
    error: "",
    success: false,
  },

  extraReducers: (builder) => {
    builder.addCase(getListCumpus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListCumpus.fulfilled, (state, action) => {
      state.loading = false;
      state.listCumpus = action.payload;
    });
    builder.addCase(getListCumpus.rejected, (state) => {
      state.messages = "Get list cumpus fail";
    });

    //getCumpus
    builder.addCase(getCumpus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCumpus.fulfilled, (state, action) => {
      state.loading = false;
      state.campus = action.payload;
    });
    builder.addCase(getCumpus.rejected, (state) => {
      state.messages = "Get cumpus fail";
    });


    //createCumpus
    builder.addCase(createCumpus.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createCumpus.fulfilled, (state, { payload }) => {
      if (payload.success === true) {

      state.listCumpus = [payload.cumpus, ...state.listCumpus];
      }
      state.loading = false;
    });
    builder.addCase(createCumpus.rejected, (state, action) => {
      state.error = "Không thể tạo mới cơ sở";
    });

    //updateCumpus
    builder.addCase(updateCumpus.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateCumpus.fulfilled, (state, { payload }) => {
      let data = state.listCumpus.filter(
        (item) => item._id !== payload.cumpus._id
      );
      if (payload.success === true) {
      state.listCumpus = [payload.cumpus ,...data]}
      state.loading = false;
    });
    builder.addCase(updateCumpus.rejected, (state, action) => {
      state.error = "Không thể sửa thông tin quản lý";
    });

    //removeCumpus
    builder.addCase(removeCumpus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeCumpus.fulfilled, (state, { payload }) => {
      state.listCumpus = state.listCumpus.filter(
        (item) => item._id !== payload.cumpus._id
      );
      state.message = payload.message;
      state.loading = false;
    });
    builder.addCase(removeCumpus.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  },
});

export default cumpusSlice.reducer;
