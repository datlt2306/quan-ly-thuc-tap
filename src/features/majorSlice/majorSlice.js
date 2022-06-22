import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import majorAPI from "../../API/majorAPi";
export const getListMajor = createAsyncThunk("major/getListMajor", async () => {
  const { data } = await majorAPI.getList();
  return data?.majors;
});

export const updateMajor = createAsyncThunk("major/updateMajor", async (z) => {
  const { data } = await majorAPI.update(z._id, z);
  return data;
});

export const removeMajor = createAsyncThunk("major,removeMajor", async (id) => {
  const { data } = await majorAPI.remove(id);
  return data;
});
const majorSlice = createSlice({
  name: "major",
  initialState: {
    listMajor: [],
    loading: false,
    message: "",
    success: false,
  },
  extraReducers: (builder) => {
    //getListMajor
    builder.addCase(getListMajor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListMajor.fulfilled, (state, action) => {
      state.listMajor = action.payload;
      state.loading = false;
    });
    builder.addCase(getListMajor.rejected, (state) => {
      state.loading = false;
    });

    //createMajor
    // builder.addCase(majoradd.pending, (state, { payload }) => {
    //   state.listMajor.push(payload.major)
    //   state.message = payload.message
    //   state.loading = true;
    // });
    // builder.addCase(majoradd.fulfilled, (state, action) => {
    //   state.message = action.payload;
    //   state.success = true;
    //   state.loading = false;
    // });
    // builder.addCase(majoradd.rejected, (state) => {
    //   state.loading = false;
    //   state.success = false;
    // });

    //updateMajor
    builder.addCase(updateMajor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateMajor.fulfilled, (state, { payload }) => {
      let data = state.listMajor.filter(
        (item) => item._id !== payload.major._id
      );
      state.listMajor = [...data, payload.major];
      state.message = payload.message;
      state.loading = false;
    });
    builder.addCase(updateMajor.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });

    //removeMajor
    builder.addCase(removeMajor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeMajor.fulfilled, (state, { payload }) => {
      state.listMajor = state.listMajor.filter(
        (item) => item._id !== payload.major._id
      );
      state.message = payload.message;
      state.loading = false;
    });
    builder.addCase(removeMajor.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  },
});

export default majorSlice.reducer;
