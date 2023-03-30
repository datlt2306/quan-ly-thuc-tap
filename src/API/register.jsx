import { axiosClient } from "./Link";
const RegisterCompany = {
    getAll(page) {
        const url = `/intern/support`;
        return axiosClient.get(url);
    },

    

};
export default RegisterCompany;