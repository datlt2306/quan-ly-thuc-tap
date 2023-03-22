export const $ = (selector) => {
	const elements = document.querySelectorAll(selector);
	return elements.length === 1 ? elements[0] : [...elements];
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

export const roles = {
	DEV: 2,
	MANAGER: 1,
	STUDENT: 0,
};
