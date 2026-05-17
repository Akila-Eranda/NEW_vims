import axios from "axios";

const BASE_URL = "https://api.vims.hexalyte.com/v1/"

const axiosInstance = axios.create({
  baseURL: BASE_URL
})

export default axiosInstance;