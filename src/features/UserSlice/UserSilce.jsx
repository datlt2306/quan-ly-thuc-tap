import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UsersAPI from "../../API/UsersAPI";

export const getUser=createAsyncThunk(
    "user/getUser",
    async ()=>{
        const {data:users}=await UsersAPI.getAll()
        return users
    }
)
export const editStudent=createAsyncThunk(
    "user/editStudent",
    async (id,data)=>{
        const {data:users}=await UsersAPI.upload(id,data)
        console.log(users)
        return users
    }
)
const userSlice=createSlice({
    name:"user",
    initialState:{
        value:[]
    },
    reducers:{
        addUser(state,action){
            // state.value.push(action.payload)
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getUser.fulfilled,(state,action)=>{
            state.value = action.payload
        })
        builder.addCase(editStudent.fulfilled,(state,action)=>{
            // console.log(action.payload)
            // state.value = action.payload
        })
    }
    
})
export default userSlice.reducer