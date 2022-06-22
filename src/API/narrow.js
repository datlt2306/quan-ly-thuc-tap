import { axiosClient } from "./Link"

export const getNarrow = () =>{
    const url = '/narrows'
    return axiosClient.get(url)
}
export const createNarrow = (req) => {
    const url = '/narrows'
    return axiosClient.post(url, req)
}