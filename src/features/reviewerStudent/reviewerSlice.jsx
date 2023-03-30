import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StudentAPI from "../../API/StudentAPI";

export const getListStudentAssReviewer = createAsyncThunk(
  "reviewer/getListStudentAssReviewer",
  async (dataForm) => {
    const { data } = await StudentAPI.listStudentAssReviewer(dataForm);
    return data;
  }
);

export const getListStudentAssReviewerExportExcel = createAsyncThunk(
  "reviewer/getListStudentAssReviewerExportExcel",
  async (dataForm) => {
    const { data } = await StudentAPI.listStudentAssReviewer(dataForm);
    return data;
  }
);

export const updateReviewerListStudent = createAsyncThunk(
  "student/updateReviewerListStudent",
  async ({listIdStudent, email, callback}) => {
    const { data } = await StudentAPI.updateReviewerSudent({listIdStudent, email});
    if (callback) callback(true)
    return data;
  }
);
export const updateStatusListStudent = createAsyncThunk(
  "student/updateStatusListStudent",
  async (dataForm) => {
    const { data } = await StudentAPI.updateStatusSudent(dataForm);
    return data;
  }
);
export const listStudentForm = createAsyncThunk(
  "student/listStudent",
  async (dataForm) => {
    const { data } = await StudentAPI.listStudentForm(dataForm);
    return data;
  }
);

export const listStudentReport = createAsyncThunk(
  "student/listStudentReport",
  async (dataForm) => {
    const { data } = await StudentAPI.listStudentReport(dataForm);
    return data;
  }
);

export const exportFormData = createAsyncThunk(
  "student/exportFormData",
  async ({val, callback}) => {
    const { data } = await StudentAPI.listStudentForm(val);
    if (callback) callback(data)
    return data.result;
  }
);
const reviewerSlice = createSlice({
  name: "reviewer",
  initialState: {
    listStudentAssReviewer: {
      list: [],
      total: 0,
    },
    listStudentAssReviewerExportExcel: {
      list: [],
      total: 0,
    },
    listStudentFormData: {
      list: [],
      total: 0,
    },
    export: [],
    loading: false
  },
  reducers: {
    uploadStudent(state, action) {
      state.listStudentAssReviewer.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    //reviewerListStudent
    builder.addCase(updateReviewerListStudent.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateReviewerListStudent.fulfilled, (state, action) => {
      const { email, listIdStudent } = action.payload;
      listIdStudent.forEach((id) => {
        const student = state.listStudentAssReviewer.list.find(
          (item) => item._id === id
        );
        if (student) {
          student.reviewer = email;
        }
      });
      state.loading = false;
    });
    builder.addCase(updateReviewerListStudent.rejected, (state, action) => {
      state.error = "Update reviewer student fail";
    });
    //UpdateStatusStudent
    builder.addCase(updateStatusListStudent.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateStatusListStudent.fulfilled, (state, action) => {
      const dataArr = [];
      state.listStudentAssReviewer.list.forEach((data) => {
        action.payload.listStudentChangeStatus.forEach((item) => {
          if (data.mssv !== item.mssv) {
            dataArr.push(data);
          }
        });
      });
      if (
        (action.payload.status === 2 ||
          action.payload.status === 1 ||
          action.payload.status === 3 ||
          action.payload.status === 6 ||
          action.payload.status === 5) &&
        state.listStudentAssReviewer.list.length ===
          action.payload.listStudentChangeStatus.length
      ) {
        state.listStudentAssReviewer.list = [];
      } else if (
        (action.payload.status === 2 ||
          action.payload.status === 1 ||
          action.payload.status === 3 ||
          action.payload.status === 6 ||
          action.payload.status === 5) &&
        state.listStudentAssReviewer.list.length >
          action.payload.listStudentChangeStatus.length
      ) {
        const listMssv = [];
        action.payload.listStudentChangeStatus.forEach((item) => {
          listMssv.push(item.mssv);
        });
        state.listStudentAssReviewer.list =
          state.listStudentAssReviewer.list.filter(
            (item) => !listMssv.includes(item.mssv)
          );
      } else {
        state.listStudentAssReviewer.list =
          action.payload.listStudentChangeStatus.concat(dataArr);
      }
      state.loading = false;
    });
    builder.addCase(updateStatusListStudent.rejected, (state, action) => {
      state.error = "Update reviewer student fail";
    });
    //getListReviewerStudent
    builder.addCase(getListStudentAssReviewer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getListStudentAssReviewer.fulfilled, (state, action) => {
      state.loading = false;
      state.listStudentAssReviewer = action.payload;
    });
    builder.addCase(getListStudentAssReviewer.rejected, (state, action) => {
      state.error = "get reviewer student fail";
    });
    //getListStudentAssReviewerExportExcel
    builder.addCase(
      getListStudentAssReviewerExportExcel.pending,
      (state, action) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getListStudentAssReviewerExportExcel.fulfilled,
      (state, action) => {
        state.loading = false;
        state.listStudentAssReviewerExportExcel = action.payload;
      }
    );
    builder.addCase(
      getListStudentAssReviewerExportExcel.rejected,
      (state, action) => {
        state.error = "get reviewer student fail";
      }
    );
    //list Student form
    builder.addCase(listStudentForm.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(listStudentForm.fulfilled, (state, action) => {
      state.loading = false;
      state.listStudentAssReviewer = action.payload;
    });
    builder.addCase(listStudentForm.rejected, (state, action) => {
      state.error = "get reviewer student fail";
    });
    //list Student report
    builder.addCase(listStudentReport.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(listStudentReport.fulfilled, (state, action) => {
      state.loading = false;
      state.listStudentAssReviewer = action.payload;
    });
    builder.addCase(listStudentReport.rejected, (state, action) => {
      state.error = "get reviewer student fail";
    });

    //export

    builder.addCase(exportFormData.pending, (state, {payload})=>{
      state.loading = true
    })

    builder.addCase(exportFormData.fulfilled, (state, {payload})=>{
      state.loading = false
    })
    builder.addCase(exportFormData.rejected, (state, {payload})=>{
      state.loading = false
    })
  },
});
export const { uploadStudent } = reviewerSlice.actions;
export default reviewerSlice.reducer;
