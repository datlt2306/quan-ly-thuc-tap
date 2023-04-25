import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import majorAPI from '../../API/majorAPi';

export const getListMajor = createAsyncThunk('major/getListMajor', async () => {
	const { data } = await majorAPI.getList();
	return data;
});
export const getMajor = createAsyncThunk('major/getMajor', async (id) => {
	const { data } = await majorAPI.get(id);
	return data;
});
export const createMajor = createAsyncThunk('major/createMajor', async (z) => {
	const { data } = await majorAPI.create(z.data);
	if (!data.statusCode) {
		z.callback(true, 'Thêm ngành học thành công!');
		return data;
	}
	z.callback(false, data.message);
	return {};
});
export const updateMajor = createAsyncThunk('major/updateMajor', async (z) => {
	const id = z.data._id;
	delete z.data._id;
	const { data } = await majorAPI.update(id, z.data);
	if (!data.statusCode) {
		z.callback(true, 'Sửa ngành học thành công!');
		return data;
	}
	z.callback(false, data.message);
	return {};

});

export const removeMajor = createAsyncThunk('major,removeMajor', async (id) => {
	const { data } = await majorAPI.remove(id);
	return data;
});
const majorSlice = createSlice({
	name: 'major',
	initialState: {
		listMajor: [],
		loading: false,
		major: {},
		message: '',
		success: false,
	},
	extraReducers: (builder) => {
		//getListMajor
		builder.addCase(getListMajor.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getListMajor.fulfilled, (state, action) => {
			state.listMajor = action.payload;
			state.loading = false;
		});
		builder.addCase(getListMajor.rejected, (state) => {
			state.loading = false;
		});

		//getMajor
		builder.addCase(getMajor.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getMajor.fulfilled, (state, action) => {
			state.major = action.payload;
			state.loading = false;
		});
		builder.addCase(getMajor.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(createMajor.pending, (state, { payload }) => {
			state.loading = true;
		});
		builder.addCase(createMajor.fulfilled, (state, { payload }) => {
			// if (payload.status === "ok") {
			//   state.listMajor = [payload.data, ...state.listMajor];
			// }
			state.loading = false;
		});
		builder.addCase(createMajor.rejected, (state) => {
			state.loading = false;
			state.success = false;
		});

		//updateMajor
		builder.addCase(updateMajor.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateMajor.fulfilled, (state, { payload }) => {
			// let data = state.listMajor.filter((item) => item._id !== payload._id);
			// state.listMajor = [payload, ...data];
			state.loading = false;
		});
		builder.addCase(updateMajor.rejected, (state, payload) => {
			state.loading = false;
			state.success = false;
		});

		//removeMajor
		builder.addCase(removeMajor.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(removeMajor.fulfilled, (state, { payload }) => {
			state.listMajor = state.listMajor.filter((item) => item._id !== payload.major._id);
			state.message = payload.message;
			state.loading = false;
		});
		builder.addCase(removeMajor.rejected, (state) => {
			state.loading = false;
			state.success = false;
		});
	},
});

export default majorSlice.reducer;
