import { axiosClient } from "./Link";
const UsersAPI = {
    getAll() {
        const url = `/users`;
        return axiosClient.get(url);
    },
    get(id) {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },
    add(user) {
        const url = `/users`;
        return axiosClient.post(url, user);
    },
    remove(id) {
        const url = `/users/${id}`;
        return axiosClient.delete(url);
    },
    upload(id, data) {
        const url = `/users/${id}`;
        return axiosClient.put(url, data);
    },

};
export default UsersAPI;