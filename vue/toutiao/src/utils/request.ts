import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { userStore } from '../store/user'

const instance = axios.create({
  baseURL: '/api',
  timeout: 3000
})

const user = userStore()

// 添加请求拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (user.user) {
    if (config && config?.headers) {
      config.headers.Authorization = `Bearer ${user.user.token}`
    }
  }
  return config
}, (error: AxiosError) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // const { status, message } = response.data
    // if (status !== 200) {
    //   ElMessage.error({ message: message || 'error', type: 'warning' })
    // }
    return response
  }, (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default instance
