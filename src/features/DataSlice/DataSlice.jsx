import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import DataAPI from "../../API/Data";
export const getData=createAsyncThunk(
    "student/getData",
    async ()=>{
        const {data:data}=await DataAPI.getAll()
        return data
    }
)
const dataSlice=createSlice({
    name:"data",
    initialState:{
        value:[]
    },
    reducers: {
        updateData(state, action){
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getData.fulfilled,(state,action)=>{
            state.value = action.payload
        })
    }
});

export const { updateData } =  dataSlice.actions
export default dataSlice.reducer