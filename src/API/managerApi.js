import { axiosClient } from "./Link";
const managerApi = {
    getAll() {
        const url = `/manager`;
        return axiosClient.get(url);
    },
  

};
export default managerApi;