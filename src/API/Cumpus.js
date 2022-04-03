import { axiosClient } from "./Link";
const CumpusApi = {
    getList() {
        const url = `/cumpus`;
        return axiosClient.get(url);
    },
};
export default CumpusApi;