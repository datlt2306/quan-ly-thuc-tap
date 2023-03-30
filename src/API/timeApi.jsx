import { axiosClient } from "./Link";
import { stringify } from "qs";
const TimeApi = {
    setTimeDate(data) {
        const url = `/settime`;
        return axiosClient.post(url, data);
    },
    getTimeForm(query){
        const url = `/settime/find-one?${stringify(query)}`;
        return axiosClient.get(url);
    },
    getListTime(query){
        const url = `/settime?${stringify(query)}`;
        return axiosClient.get(url);
    }
};
export default TimeApi;