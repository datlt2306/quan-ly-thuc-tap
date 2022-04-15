import axios from "axios";
import { getCookie, STORAGEKEY } from "../ultis/storage";
const accessToken = getCookie(STORAGEKEY.ACCESS_TOKEN)

export const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    'Authorization':`Bearer ${accessToken}`
  },
});

