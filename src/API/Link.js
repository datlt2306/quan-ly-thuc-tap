import axios from 'axios';
import { getLocal } from '../ultis/storage';

const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_TEST_API,
});

axiosClient.interceptors.request.use((req) => {
	const token = getLocal();
	req.headers['Authorization'] = 'Bearer ' + token.accessToken;
	req.headers['Content-Type'] = 'application/json';
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
