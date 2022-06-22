import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createNarrow, getNarrow } from "../API/narrow";
export const createNarrows = createAsyncThunk(
    "narrows/createNarrows", async (req) => {
  const { data } = await createNarrow(req)
      return data
});
export const getNarow = createAsyncThunk(
  "narrows/getNarow", async (req, func) => {
const { data } = await getNarrow()
    return data
});
const narrows = createSlice({
  name: "narrows",
  initialState: {
    listNarrow: [],
    loadings: false,
    message: "",
  },
  extraReducers: (builder) => {
    //getListMajor
    builder.addCase(createNarrows.pending, (state) => {
      state.loadings = true; 
    });
    builder.addCase(createNarrows.fulfilled, (state, action) => {
      state.listNarrow.push(action.payload)
      state.loadings = false;
    });
    builder.addCase(createNarrows.rejected, (state) => {
      state.loadings = false;
    });

    //createMajor
    builder.addCase(getNarow.pending, (state, { payload }) => {
      state.loadings = true;
    });
    builder.addCase(getNarow.fulfilled, (state, action) => {
      state.listNarrow = action.payload
      state.loadings = false;
    });
    builder.addCase(getNarow.rejected, (state) => {
      state.loadings = false;
    });

    // //updateMajor
    // builder.addCase(updateMajor.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(updateMajor.fulfilled, (state, { payload }) => {
    //   let data = state.listMajor.filter(item => item._id !== payload.major._id)
    //   state.listMajor = [payload.major, ...data,]
    //   state.message = payload.message
    //   state.loading = false;
    // });
    // builder.addCase(updateMajor.rejected, (state) => {
    //   state.loading = false;
    //   state.success = false;
    // });

    // //removeMajor
    // builder.addCase(removeMajor.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(removeMajor.fulfilled, (state, {payload}) => {
    //   state.listMajor = state.listMajor.filter(item => item._id !== payload.major._id)
    //   state.message = payload.message;
    //   state.loading = false;
    // });
    // builder.addCase(removeMajor.rejected, (state) => {
    //   state.loading = false;
    //   state.success = false;
    // });
  },
});

export default narrows.reducer;
