import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import StudentAPI from '../../API/StudentAPI';
import _ from 'lodash'
import { Button } from 'antd';
export const getStudent = createAsyncThunk('student/getStudent', async (page) => {
  const {onShowDetail} = page
  const { data } = await StudentAPI.getAll(page);
  return {data: data,
    func: onShowDetail}
});
export const insertStudent = createAsyncThunk('student/insertStudent', async (action) => {
  const { data } = await StudentAPI.add(action);
  return data;
});
export const getSmester = createAsyncThunk('student/getSmester', async (action) => {
  const { data } = await StudentAPI.getSmesterSchool(action);
  return data;
});


export const getStudentId = createAsyncThunk(
  "student/getById",
   async (id) => {
  const { data } = await StudentAPI.get(id);
  return data;
});

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    listStudent: {},
    loading: false,
    listSmester: [],
    defaultSemester:{},
    studentById:{},
    error: ''
  },
  reducers: {
    addStudent(state, action) {
      state.listStudent.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStudent.fulfilled, (state, {payload}) => {
      const {data, func} = payload
      state.loading = false;
      state.listStudent = {
        ...data,
        list: _.reduce(data.list, (res, item)=>{
          res.push({
            ...item,
            mssv: (<Button type='link' onClick={() => func(item.mssv, item) } >{item.mssv}</Button>)
          })
          return res
        },[])
      }
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
    builder.addCase(getSmester.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.listSmester = payload.listSemesters;
      state.defaultSemester = payload.defaultSemester
    });
    builder.addCase(getSmester.rejected, (state, action) => {
      state.loading = false;
      state.error = 'Thất bại';
    });
    //studentByID

    builder.addCase(getStudentId.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getStudentId.fulfilled, (state, action) => {
      state.loading = false;
      state.studentById = action.payload;
    });
    builder.addCase(getStudentId.rejected, (state) => {
      state.messages = "Get student fail";
    });

  },
});
export const { uploadStudent } = studentSlice.actions;
export default studentSlice.reducer;
