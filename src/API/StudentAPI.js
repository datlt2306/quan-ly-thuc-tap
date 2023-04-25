import { axiosClient } from './Link';
import { stringify } from 'qs';
const StudentAPI = {
	getAll(page) {
		const url = `/student?${stringify(page)}`;
		return axiosClient.get(url);
	},
	get(infoUser) {
		const url = `/student/${infoUser.student._id}`;
		return axiosClient.get(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${infoUser.accessToken}`,
			},
		});
	},
	getStudentById(id) {
		const url = `/student/${id}`;
		return axiosClient.get(url);
	},
	getMajors(majors) {
		const url = `/students/${majors}`;
		return axiosClient.get(url);
	},
	add(product) {
		const url = `/student`;
		return axiosClient.post(url, product);
	},
	remove(id) {
		const url = `/students/${id}`;
		return axiosClient.delete(url);
	},
	upload(id, data) {
		const url = `/students/${id}`;
		return axiosClient.patch(url, data);
	},
	updateReviewerSudent(data) {
		const url = `/student`;
		return axiosClient.patch(url, data);
	},
	updateBusinessStudent(data) {
		const url = `/student/business`;
		return axiosClient.patch(url, data);
	},
	updateStatusSudent(data) {
		const url = `/student/status`;
		return axiosClient.patch(url, data);
	},
	updateStudent(data) {
		const url = `/student/${data._id}`;
		return axiosClient.patch(url, data);
	},
	listStudentAssReviewer(data) {
		const url = `/review?${stringify(data)}`;
		return axiosClient.get(url);
	},
	listStudentForm(data) {
		const url = `/reivewForm?${stringify(data)}`;
		return axiosClient.get(url);
	},
	listStudentReport(data) {
		const url = `/reivewreport?${stringify(data)}`;
		return axiosClient.get(url);
	},
	getSmesterSchool() {
		const url = '/smester';
		return axiosClient.get(url);
	},
	resetApi(idStudent) {
		const url = `/student/reset/${idStudent}`;
		return axiosClient.get(url);
	},
};
export default StudentAPI;
