// services/axiosService.ts
import axios, { type AxiosInstance } from 'axios'

// Create a new Axios instance with the base URL
const baseURL = 'https://budget-planner-backend.onrender.com'
const axiosInstance: AxiosInstance = axios.create({
  baseURL
})

// Export the Axios instance
export default axiosInstance
