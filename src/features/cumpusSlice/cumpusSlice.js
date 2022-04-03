import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CumpusApi from '../../API/Cumpus'

export const getListCumpus = createAsyncThunk(
  "cumpus/getListCumpus",
   async () => {
  const { data } = await CumpusApi.getList();
  return data.cumpusList;
});

const cumpusSlice = createSlice({
  name: "cumpus",
  initialState: {
    listCumpus:[],
    loading:false,
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
  },
});

export default cumpusSlice.reducer;
