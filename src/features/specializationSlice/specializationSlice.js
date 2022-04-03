import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SpecializationApi from '../../API/Specialization'

export const getListSpecialization = createAsyncThunk(
  "specialization/getListSpecialization",
   async () => {
  const { data } = await SpecializationApi.getList();
  return data.listSpecialization;
});

const specializationSlice = createSlice({
  name: "specialization",
  initialState: {
    listSpecialization:[],
    loading:false,
  },
  
  extraReducers: (builder) => {
    builder.addCase(getListSpecialization.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListSpecialization.fulfilled, (state, action) => {
      state.loading = false;
      state.listSpecialization = action.payload;
    });
    builder.addCase(getListSpecialization.rejected, (state) => {
      state.messages = "Get list cumpus fail";
    });
  },
});

export default specializationSlice.reducer;
