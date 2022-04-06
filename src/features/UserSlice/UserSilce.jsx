import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UsersAPI from "../../API/UsersAPI";

export const getUser=createAsyncThunk(
    "users/getUser",
    async ()=>{
        const {data:users}=await UsersAPI.getAll()
        console.log("!")
        return users
    }
)
const userSlice=createSlice({
    name:"users",
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