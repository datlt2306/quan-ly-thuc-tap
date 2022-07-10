import axios from "axios";
const token = localStorage.getItem("token");
export const axiosClient = axios.create({
  // Localhost
  //baseURL: "http://localhost:8000/api",
  // DEV
  // baseURL: "http://hbgreen.com.vn/api",
  // Main
  baseURL: "http://139.180.196.74:8000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
