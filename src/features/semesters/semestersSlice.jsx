import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SemestersAPI from '../../API/SemestersAPI';

export const getSemesters = createAsyncThunk('semesters/getSemesters', async (action) => {
	const { data } = await SemestersAPI.getSemesters(action);
	return data;
});

export const insertSemester = createAsyncThunk('semesters/insertSemester', async (action) => {
	const { data } = await SemestersAPI.insertSemester(action);
	return data;
});

export const updateSemester = createAsyncThunk('semesters/updateSemester', async (action) => {
	const { data } = await SemestersAPI.updateSemester(action);
	return data;
});

export const defaultTime = createAsyncThunk('semesters/defaultTime', async (action) => {
	const { callback, filter } = action;
	const { data } = await SemestersAPI.getDefaultSemester(filter);
	if (callback) callback(data);
	return data.result;
});

const semesterSlice = createSlice({
	name: 'semesters',
	initialState: {
		listSemesters: [],
		defaultSemester: {},
		loading: false,
		mesg: '',
	},

	extraReducers: (builder) => {
		builder.addCase(getSemesters.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getSemesters.fulfilled, (state, action) => {
			state.loading = false;
			state.defaultSemester = action.payload.defaultSemester;
			state.listSemesters = action.payload.listSemesters;
		});
		builder.addCase(getSemesters.rejected, (state) => {
			state.mesg = 'Thất bại';
			state.loading = false;
		});
		builder.addCase(insertSemester.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(insertSemester.fulfilled, (state, { payload }) => {
			state.loading = false;
			// state.listSemesters = [payload,...state.listSemesters];
			state.mesg = 'Thành công';
		});
		builder.addCase(insertSemester.rejected, (state) => {
			state.mesg = 'Thất bại';
			state.loading = false;
		});

		builder.addCase(updateSemester.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateSemester.fulfilled, (state, { payload }) => {
			// let data = state.listSemesters.filter(
			//   (item) => item._id !== payload._id
			// );
			// state.listSemesters = [payload,...data, ];
			state.mesg = 'Thành công';
			state.loading = false;
		});
		builder.addCase(updateSemester.rejected, (state) => {
			state.mesg = 'Thất bại';
			state.loading = false;
		});

		builder.addCase(defaultTime.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(defaultTime.fulfilled, (state, { payload }) => {
			state.defaultSemester = payload;
			state.loading = false;
		});
	},
});

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const URL = import.meta.env.VITE_BASE_URL_API;

// const baseQuery = fetchBaseQuery({
// 	baseUrl: URL,
// 	prepareHeaders: (headers, { getState }) => {
// 		const token = getLocal();

// 		headers.set('Content-Type', 'apllication/json');
// 		if (token) headers.set('authorization', `Bearer ${token}`);

// 		return headers;
// 	},
// });

// // Define a service using a base URL and expected endpoints
// export const _semesterAPI = createApi({
// 	reducerPath: 'authAPI',
// 	baseQuery: baseQuery,
// 	endpoints: (builder) => ({
// 		login: builder.query({
// 			query: (payload) => ({
// 				url: `/login-google`,
// 				method: 'POST',
// 				body: payload,
// 			}),
// 		}),
// 	}),
// });

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
// export const { useLoginMutation } = _semesterAPI;

export default semesterSlice.reducer;
