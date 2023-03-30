import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import AuthApi from "../../API/Auth";
import { saveLocal } from "../../ultis/storage";

export const loginGoogle = createAsyncThunk(
  "auth/loginGoogle",
  async ({val, callback}) => {
    const {data} = await AuthApi.login(val);
    if (_.get(data, 'success', false)) {
      saveLocal(data);
    }
    if (callback) callback(data)
    return data
  }
);

export const logout = createAsyncThunk("auth/logout", async (callback) => {
  const { data } = await AuthApi.logout();
  if (data) {
    localStorage.removeItem("user")
  }
  callback()
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    infoUser: {},
    loading: false,
    messages: "",
    token: undefined,
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.accessToken;
      state.infoUser = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.infoUser = action.payload;
      state.token = action.payload.token;
    });
    builder.addCase(loginGoogle.rejected, (state) => {
      state.messages = "Login google fail";
    });

    //logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.messages = "Logout google fail";
    });
  },
});

export const { loginSuccess } = authSlice.actions;

export default authSlice.reducer;
