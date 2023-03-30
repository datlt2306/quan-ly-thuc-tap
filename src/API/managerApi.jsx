import { axiosClient } from "./Link";
const managerApi = {
  getAll() {
    const url = `/manager`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/manager/${id}`;
    return axiosClient.get(url);
  },
  create(data) {
    const url = `/manager`;
    return axiosClient.post(url, data);
  },
  remove(id) {
    const url = `/manager/${id}`;
    return axiosClient.delete(url);
  },
  update(data) {
    const url = `/manager/${data.id}`;
    return axiosClient.patch(url, data);
  },
};
export default managerApi;
