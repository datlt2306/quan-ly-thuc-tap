// eslint-disable-next-line import/no-anonymous-default-export
export default {
	PAGE_SIZE: 10,
};
export const statusConfigCV = [
	{
		title: 'Sửa lại CV',
		value: 1,
	},
	{
		title: 'Nhận CV',
		value: 2,
	},
];
export const statusConfigForm = [
	{
		title: 'Sửa biên bản',
		value: 5,
	},
	{
		title: 'Đã nhận biên bản',
		value: 6,
	},
];
export const statusConfigReport = [
	// {
	//   title: "Sửa biên bản",
	//   value: 5,
	// },
	{
		title: 'Sửa báo cáo',
		value: 8,
	},
	{
		title: 'Hoàn thành',
		value: 9,
	},
	{
		title: 'Trượt',
		value: 3,
	},
];

export const roles = {
	DEV: 2,
	MANAGER: 1,
	STUDENT: 0,
};

//status trả về của danh sách yêu cầu tư sinh viên
export const statusRequestStudent = {
	PENDING: 1,
	ACCEPT: 2,
	CANCEL: 3,
};

export const signTheContractValues = [
	{
		type: 0,
		value: 'Có',
	},
	{
		type: 1,
		value: 'Không',
	},
	{
		type: 2,
		value: 'Không nhận lời',
	},
];

export const $ = (selector) => {
	const elements = document.querySelectorAll(selector);
	return elements.length === 1 ? elements[0] : [...elements];
};
