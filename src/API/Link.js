import axios from "axios";
import { getLocal } from "../ultis/storage";
const axiosClient = axios.create({
  // Localhost
  // baseURL: "http://localhost:8000/api",
  // DEV
  baseURL: "http://3.0.249.70:8000/api",
  // Main
  // baseURL: "http://139.180.196.74:8000/api",
});
axiosClient.interceptors.request.use((req) => {
  const token = getLocal();
  req.headers["Authorization"] = "Bearer " + token.accessToken;
  req.headers["Content-Type"] = "application/json";
  return req;
});
axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    return error.response;
  }
);

export { axiosClient };
