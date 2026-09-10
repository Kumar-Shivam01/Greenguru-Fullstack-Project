import axios from 'axios'
const axiosClient = axios.create({
    baseURL: "http://localhost:8001/api/v1",
    withCredentials: true, //include cookies when making requests to my backend
})
export default axiosClient