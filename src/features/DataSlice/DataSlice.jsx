import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StudentAPI from "../../API/StudentAPI";
import DataAPI from "../../API/Data";
export const getData = createAsyncThunk(
  "data/getData",
  async (page) => {
    const { data: data } = await DataAPI.getAll(page)
    return data
  }
)
export const insertData = createAsyncThunk(
  'data/insertData',
  async (action) => {
    const { data } = await DataAPI.add(action)
    return data
  }
)
const dataSlice = createSlice({
  name: "data",
  initialState: {
    listData: {

    },
    loading: false,
    error: ''
  },
  reducers: {
    addStudent(state, action) {
      state.listData.push(action.payload)
    },
    upData(state, action) {
      console.log(action.payload)
      state.listData = action.payload

    }
  },
  extraReducers: (builder) => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.loading = false
      state.listData = action.payload
    })
    builder.addCase(getData.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(getData.rejected, (state, action) => {
      state.error = 'Không thể truy vấn'
    })
    // builder.addCase(insertStudent.fulfilled, (state, action)=>{
    //     state.listStudent = action.payload
    // })
    // builder.addCase(insertStudent.pending, (state, action)=> {
    //     state.loading = true
    // })
    // builder.addCase(insertStudent.rejected, (state, action) => {
    //     state.error = 'Không đúng định dạng'
    // })
  }
})
export const { upData } = dataSlice.actions
export default dataSlice.reducer