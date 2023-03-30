import { axiosClient } from "./Link";
const RegisterInternAPI = {
  upload(data) {
    const url = `/intern/support`;
    return axiosClient.patch(url, data);
  },
  uploadProactive(data) {
    const url = `/intern/proactive`;
    return axiosClient.patch(url, data);
  },
};
export default RegisterInternAPI;
