import { axiosClient } from "./Link";
import { stringify } from "qs";
const StudentAPI = {
  getAll(page) {
    const url = `/student?${stringify(page)}`;
    return axiosClient.get(url);
  },
  get(id) {
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
  updateStatusSudent(data) {
    const url = `/student/status`;
    return axiosClient.patch(url, data);
  },
  listStudentAssReviewer(data) {
    const url = `/review?${stringify(data)}`;
    return axiosClient.get(url);
  },
};
export default StudentAPI;
