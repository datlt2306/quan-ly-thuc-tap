import { stringify } from "qs";
import { axiosClient } from "./Link";
const BusinessAPI = {
  add(product) {
    const url = `/business`;
    return axiosClient.post(url, product);
  },
  create(data) {
    const url = `/business/new`;
    return axiosClient.post(url, data);
  },
  get(range) {
    const url = `/business?${stringify(range)}`;
    return axiosClient.get(url);
  },
  getItem(id) {
    const url = `/business/${id}`;
    return axiosClient.get(url);
  },
  delete(id) {
    const url = `/business/${id}`;
    return axiosClient.delete(url);
  },
  update(params) {
    const { val: id, ...data } = params;
    const url = `/business/${id}`;
    return axiosClient.patch(url, data);
  },
  updateMany(params) {
    const url = `/business`;
    return axiosClient.patch(url, params);
  },
};
export default BusinessAPI;
