import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { stringify } from "qs";
import StudentAPI from "../../API/StudentAPI";
export const uploadCv = createAsyncThunk("upload/uploadCv", async (page) => {
  const { data } = await StudentAPI.getAll(page);
  return data;
});

const uploadCvSlice = createSlice({
  name: "upload",
  initialState: {
    loading: false,
    error: "",
  },
  reducers: {
    uploadFile(state, action) {
      state.loading = true;
      axios.post(
        "https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec",
        stringify(action).then((res) => res.json)
      );
    },
  },
  extraReducers: (builder) => {},
});
export default uploadCvSlice.reducer;
