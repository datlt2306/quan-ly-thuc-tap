import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginGoogle = createAsyncThunk("auth/loginGoogle", async (token) => {
  const { data } = await axios.post('http://localhost:8080/api/login-google',token);
  if(data){
    localStorage.setItem("token",data.token)
  }
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    infoUser: {},
    loading: false,
    messages:"",
    success:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginGoogle.pending, (state) => {
      state.loading = true;
      state.success = false;
    });
    builder.addCase(loginGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.infoUser = action.payload;
    });
    builder.addCase(loginGoogle.rejected, (state) => {
      state.messages = "Login google fail";
      state.success = false;
    });
  },
});

export default authSlice;
