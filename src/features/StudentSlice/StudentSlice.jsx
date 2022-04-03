import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import StudentAPI from "../../API/StudentAPI";
export const getStudent=createAsyncThunk(
    "student/getStudent",
    async ()=>{
        const {data:student}=await StudentAPI.getAll()
        return student
    }
)
const studentSlice=createSlice({
    name:"student",
    initialState:{
        value:[]
    },
    reducers: {
        updateStudent(state, action){
            state.value = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getStudent.fulfilled,(state,action)=>{
            state.value = action.payload
        })
    }
});

export const { updateStudent } =  studentSlice.actions
export default studentSlice.reducer