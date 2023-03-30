import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const updateIsMobile=createAsyncThunk(
    "global/updateIsMobile",
    async (payload)=>{
        return payload.isMobile
    }
)
const global =createSlice({
    name:"global",
    initialState:{
        isMobile:false
    },
    extraReducers:(builder)=>{
        builder.addCase(updateIsMobile.fulfilled,(state,action)=>{
            state.isMobile = action.payload
        })
    }
    
})
export default global.reducer