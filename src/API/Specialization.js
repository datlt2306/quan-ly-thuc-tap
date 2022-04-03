import { axiosClient } from "./Link";
const SpecializationApi = {
    getList() {
        const url = `/specialization`;
        return axiosClient.get(url);
    },
};
export default SpecializationApi;