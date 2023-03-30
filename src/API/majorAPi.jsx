import { axiosClient } from "./Link";
const majorAPI = {
    getList() {
        const url = `/major`;
        return axiosClient.get(url);
    },
    get(id) {
        const url = `/major/${id}`;
        return axiosClient.get(url);
    },
    create(data) {
        const url = `/major`;
        return axiosClient.post(url, data);
    },
    remove(id) {
        const url = `/major/${id}`;
        return axiosClient.delete(url);
    },
    update(id, data) {
        const url = `/major/${id}`;
        return axiosClient.patch(url, data);
    },

};
export default majorAPI;