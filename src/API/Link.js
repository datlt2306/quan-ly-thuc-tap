import axios from "axios";

export const axiosClient = axios.create({
    baseURL: "http://139.180.196.74:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});