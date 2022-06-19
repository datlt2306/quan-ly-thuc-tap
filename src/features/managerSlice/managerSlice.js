import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import managerApi from "../../API/managerApi";

export const fetchManager = createAsyncThunk(
  "manager/fetchManager",
  async () => {
    const { data } = await managerApi.getAll();
    return data?.manager;
  }
);

export const createManager = createAsyncThunk(
  "manager/createManager",
  async (dataForm) => {
    const { data } = await managerApi.create(dataForm);

    return data;
  }
);

export const updateManager = createAsyncThunk(
  "manager/updateManager",
  async (id, dataForm) => {
    const { data } = await managerApi.update(id, dataForm);

    return data;
  }
);

export const removeManager = createAsyncThunk(
  "major,removeManager",
  async (id) => {
    const { data } = await managerApi.remove(id);
    return data;
  }
);

const managerSlice = createSlice({
  name: "manager",
  initialState: {
    listManager: [],
    loading: false,
    error: "",
    message: "",
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchManager.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchManager.fulfilled, (state, action) => {
      state.loading = false;
      state.listManager = action.payload;
    });
    builder.addCase(fetchManager.rejected, (state, action) => {
      state.error = "Không thể truy vấn";
    });

    //createManager
    builder.addCase(createManager.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createManager.fulfilled, (state, { payload }) => {
      state.listManager = payload.data.manager;
      state.loading = false;
      state.message = payload.message;
    });
    builder.addCase(createManager.rejected, (state, action) => {
      state.error = "Không thể tạo mới người quản lý";
    });

    //updateManager
    builder.addCase(updateManager.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateManager.fulfilled, (state, { payload }) => {
      let data = state.listManager.filter(
        (item) => item._id !== payload.manager._id
      );
      state.listManager = [...data, payload.manager];
      state.loading = false;
      state.message = payload.message;
    });
    builder.addCase(updateManager.rejected, (state, action) => {
      state.error = "Không thể sửa thông tin quản lý";
    });

    //removeManager
    builder.addCase(removeManager.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeManager.fulfilled, (state, { payload }) => {
      state.listManager = state.listManager.filter(
        (item) => item._id !== payload.manager._id
      );
      state.message = payload.message;
      state.loading = false;
    });
    builder.addCase(removeManager.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  },
});
export default managerSlice.reducer;
