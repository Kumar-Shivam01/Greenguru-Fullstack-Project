import axios from 'axios'
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, //include cookies when making requests to my backend
})
export default axiosClient