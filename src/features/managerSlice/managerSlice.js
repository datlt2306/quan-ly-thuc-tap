import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import managerApi from "../../API/managerApi";
export const fetchManager=createAsyncThunk(
    "manager/fetchManager",
    async (page)=>{
        const {data}=await managerApi.getAll()

        return data.managers
    }
)
const managerSlice=createSlice({
    name:"manager",
    initialState:{
        listManager:[],
        loading: false,
        error: ''
    },
    reducers:{
      
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchManager.fulfilled,(state,action)=>{
            state.loading=false
            state.listManager = action.payload
        })
        builder.addCase(fetchManager.pending, (state, action)=> {
            state.loading = true
        })
        builder.addCase(fetchManager.rejected, (state,action) =>{
            state.error = 'Không thể truy vấn'
        } )
     
    }
})
export default managerSlice.reducer