import { axiosClient } from "./Link";
import { stringify } from "qs";
const SemestersAPI = {
  getSemesters(query) {
    const url = `/smester?${stringify(query)}`;
    return axiosClient.get(url);
  },

  getDefaultSemester(query){
    const url = `/smester/default?${stringify(query)}`;
    return axiosClient.get(url);
  },

  insertSemester(data) {
    const url = `/add-mester`;
    return axiosClient.post(url, data);
  },

  updateSemester(data) {
    const url = `/update-mester/${data.id}`;
    return axiosClient.patch(url, data);
  },
};

export default SemestersAPI;
