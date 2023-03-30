import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import requestApi from '../../API/requestStudent';

export const sendRequest = createAsyncThunk('request/sendRequest', async ({ val, callback }) => {
  const { data } = await requestApi.requestOfStudent(val);
  if (callback) callback(data);
  return data;
});

export const getRequest = createAsyncThunk('request/getRequest', async () => {
  const { data } = await requestApi.getRequestOfStudent();
  return data;
});

export const resetStudentRequestModel = createAsyncThunk(
  "request/resetStudentRequestModel",
  async ({val, callback}) =>{
    const { data } = await requestApi.resetStudentRequest(val);
    if (callback) callback(data)
    return data
  }
)

const semesterSlice = createSlice({
  name: 'request',
  initialState: {
    loading: false,
    data: [],
  },

  extraReducers: (builder) => {
    builder.addCase(sendRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendRequest.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(sendRequest.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRequest.fulfilled, (state, { payload }) => {
      if (payload.success) {
        state.data = payload.data;
        state.loading = false;
      } else {
        state.data = [];
        state.loading = false;
      }
    });
    builder.addCase(getRequest.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(resetStudentRequestModel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetStudentRequestModel.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(resetStudentRequestModel.rejected, (state) => {
      state.loading = false;
    });



  },
});

export default semesterSlice.reducer;
