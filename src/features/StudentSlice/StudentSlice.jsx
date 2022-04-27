import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import StudentAPI from '../../API/StudentAPI';
export const getStudent = createAsyncThunk('student/getStudent', async (page) => {
  const { data } = await StudentAPI.getAll(page);
  return data;
});
export const insertStudent = createAsyncThunk('student/insertStudent', async (action) => {
  const { data } = await StudentAPI.add(action);
  return data;
});
export const getSmester = createAsyncThunk('student/getSmester', async (action) => {
  const { data } = await StudentAPI.getSmesterSchool(action);
  return data;
});
const studentSlice = createSlice({
  name: 'student',
  initialState: {
    listStudent: {},
    loading: false,
    listSmester: [],
    error: '',
  },
  reducers: {
    addStudent(state, action) {
      state.listStudent.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.listStudent = action.payload;
    });
    builder.addCase(getStudent.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getStudent.rejected, (state, action) => {
      state.error = 'Không thể truy vấn';
    });
    builder.addCase(insertStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.listStudent = action.payload;
    });
    builder.addCase(insertStudent.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(insertStudent.rejected, (state, action) => {
      state.error = 'Không đúng định dạng';
    });
    //smester
    builder.addCase(getSmester.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getSmester.fulfilled, (state, action) => {
      state.loading = false;
      state.listSmester = action.payload;
    });
    builder.addCase(getSmester.rejected, (state, action) => {
      state.loading = false;
      state.error = 'Thất bại';
    });
  },
});
export const { uploadStudent } = studentSlice.actions;
export default studentSlice.reducer;
