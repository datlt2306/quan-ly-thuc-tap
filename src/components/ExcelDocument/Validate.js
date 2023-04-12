import * as yup from 'yup';

export const statusValidationSchema = yup.object().shape({
	mssv: yup.string().required('Yêu cầu MSSV'),
	name: yup.string().required('Yêu cầu tên'),
	course: yup.string(),
	status: yup.string(),
	majorCode: yup.string().required('Yêu cầu chuyên ngành'),
	email: yup.string().email('Email không hợp lệ').required('Yêu cầu email'),
	supplement: yup.string(),
});

export const businessValidationSchema = yup.object().shape({
	name: yup.string().required('Yêu cầu tên'),
	internshipPosition: yup.string().required('Yêu cầu vị trí thực tập'),
	amount: yup.number().required('Yêu cầu số lượng'),
	address: yup.string().required('Yêu cầu địa chỉ'),
	majorCode: yup.string().required('Yêu cầu chuyên ngành'),
	description: yup.string(),
	request: yup.string(),
	code_request: yup.string(),
	benefish: yup.string(),
});
