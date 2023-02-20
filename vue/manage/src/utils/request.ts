import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './local'

const instance = axios.create({
  baseURL: '/api',
  timeout: 3000
})

// 添加请求拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  // 在发送请求前做些什么
  // 获取并设置token
  const token: string = getToken()
  if (token) {
    if (config && config?.headers) {
      config.headers.token = getToken()
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
    const { status, message } = response.data
    if (status !== 200) {
      ElMessage.error({ message: message || 'error', type: 'warning' })
    }
    return response
  }, (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default instance
