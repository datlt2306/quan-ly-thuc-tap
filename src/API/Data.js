import { axiosClient } from "./Link";
import {stringify} from 'qs'
const DataAPI = {
    getAll(page) {
        const url = `/data?${stringify(page)}`;
        return axiosClient.get(url);
    },
    get(id) {
        const url = `/data/${id}`;
        return axiosClient.get(url);
    },
    add(data) {
        const url = `/data`;
        return axiosClient.post(url, data);
    },
    remove(id) {
        const url = `/data/${id}`;
        return axiosClient.delete(url);
    },
    upload(id, data) {
        const url = `/data/${id}`;
        return axiosClient.put(url, data);
    },

};
export default DataAPI;