import * as yup from 'yup';

export const statusValidationSchema = yup.object().shape({
	mssv: yup.string().required('MSSV is required'),
	name: yup.string().required('Name is required'),
	course: yup.string(),
	status: yup.string(),
	majors: yup.string().required('Majors is required'),
	email: yup.string().email('Invalid email').required('Email is required'),
	supplement: yup.string(),
});

export const businessValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required'),
	internshipPosition: yup.string().required('Internship position is required'),
	amount: yup.number().required('Amount is required'),
	address: yup.string().required('Address is required'),
	majors: yup.string().required('Majors is required'),
	description: yup.string(),
	request: yup.string(),
	code_request: yup.string(),
	benefish: yup.string(),
});
