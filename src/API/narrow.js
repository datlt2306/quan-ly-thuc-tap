import { axiosClient } from './Link';

export const getNarrowAPI = () => {
	const url = '/narrows';
	return axiosClient.get(url);
};
export const createNarrow = (req) => {
	const url = '/narrow';
	return axiosClient.post(url, req);
};
export const updateNarrows = (id, data) => {
	const url = `/narrow/${id}`;
	return axiosClient.put(url, data);
};
