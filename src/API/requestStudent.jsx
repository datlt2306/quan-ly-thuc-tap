import { axiosClient } from "./Link";
const requestApi = {
  requestOfStudent(data) {
    const url = `/request`;
    return axiosClient.post(url,data);
  },
  getRequestOfStudent(){
    const url = '/getRequest'
    return axiosClient.get(url)
  },
  resetStudentRequest(val){
    const url = `/resetStudent/${val.userId}`
    return axiosClient.patch(url, val)
  },
  removeRequestApi(id){
    const url = `/removeRequest/${id}`
    return axiosClient.patch(url)
  }
};
export default requestApi;
