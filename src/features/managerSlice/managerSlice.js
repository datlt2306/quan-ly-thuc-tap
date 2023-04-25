import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reduce } from 'lodash';
import managerApi from '../../API/managerApi';
import { getLocal } from '../../ultis/storage';

export const fetchManager = createAsyncThunk('manager/fetchManager', async () => {
	const { data } = await managerApi.getAll();
	return data;
});

export const createManager = createAsyncThunk('manager/createManager', async (payload) => {
	const { dataForm, callback } = payload;
	const { data } = await managerApi.create(dataForm);
	if (callback) callback(data);
	return data;
});

export const updateManager = createAsyncThunk('manager/updateManager', async (payload) => {
	const { dataForm, callback } = payload;
	const { data } = await managerApi.update(dataForm);
	if (callback) callback(data);
	return data;
});

export const removeManager = createAsyncThunk('major,removeManager', async (payload) => {
	const { id, callback } = payload;
	const { data } = await managerApi.remove(id);
	if (callback) callback(data);
	return data;
});

const managerSlice = createSlice({
	name: 'manager',
	initialState: {
		listManager: [],
		loading: false,
		error: '',
		message: '',
		success: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchManager.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchManager.fulfilled, (state, { payload }) => {
			state.loading = false;
			// const user = getLocal();

			// state.listManager = reduce(
			//   payload,
			//   (res, item) => {
			//     if (item._id !== user.manager._id) {
			//       res.push(item);
			//     }
			//     return res;
			//   },
			//   [],
			// );
			state.listManager = payload;
		});
		builder.addCase(fetchManager.rejected, (state, action) => {
			state.error = 'Không thể truy vấn';
		});

		//createManager
		builder.addCase(createManager.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(createManager.fulfilled, (state, { payload }) => {
			// if (payload.success === true) {
			//   state.listManager = [payload.manager, ...state.listManager];
			// }
			state.loading = false;
		});
		builder.addCase(createManager.rejected, (state, action) => {
			state.error = 'Không thể tạo mới người quản lý';
		});

		//updateManager
		builder.addCase(updateManager.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(updateManager.fulfilled, (state, { payload }) => {
			// let data = state.listManager.filter((item) => item._id !== payload._id);
			// if (payload.success === true) {
			//   state.listManager = [payload.manager, ...data];
			// }
			state.loading = false;
		});
		builder.addCase(updateManager.rejected, (state, action) => {
			state.error = 'Không thể sửa thông tin quản lý';
		});

		//removeManager
		builder.addCase(removeManager.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(removeManager.fulfilled, (state, { payload }) => {
			state.listManager = state.listManager.filter(
				(item) => item._id !== payload.manager._id
			);
			state.loading = false;
		});
		builder.addCase(removeManager.rejected, (state) => {
			state.loading = false;
			state.success = false;
		});
	},
});
export default managerSlice.reducer;
