import { axiosClient } from "./Link";
const CumpusApi = {
  getList() {
    const url = `/cumpus`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/cumpus/${id}`;
    return axiosClient.get(url);
  },
  create(data) {
    const url = `/cumpus`;
    return axiosClient.post(url, data);
  },
  remove(id) {
    const url = `/cumpus/${id}`;
    return axiosClient.delete(url);
  },
  update(id, data) {
    const url = `/cumpus/${id}`;
    return axiosClient.patch(url, data);
  },
};
export default CumpusApi;
