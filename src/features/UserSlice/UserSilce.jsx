import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UsersAPI from "../../API/UsersAPI";

export const getUser=createAsyncThunk(
    "user/getUser",
    async ()=>{
        const {data:users}=await UsersAPI.getAll()
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
        
    }
    
})
export default userSlice.reducer