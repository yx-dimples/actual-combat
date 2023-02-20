import axios from 'axios'
// import { hideScreenLoading } from './loading'

const baseURL = process.env.VUE_APP_BASE_URL

export function request (config) {
  const instance = axios.create({
    baseURL,
    timeout: 50000,
    withCredentials: true
  })

  // 请求拦截
  instance.interceptors.request.use(
    config => {
      if (config.url !== '/login/qr/check') {
        // showScreenLoading(config.headers)
      }
      return config
    }, error => {
      return Promise.reject(error)
    }
  )

  // 响应拦截
  instance.interceptors.request.use(
    response => {
      // hideScreenLoading()
      return response
    }, error => {
      // hideScreenLoading()
      return Promise.reject(error)
    }
  )
  instance.defaults.withCredentials = true
  return instance(config)
}

// 下载音乐
export function downloadMusic (config) {
  const instance = axios.create({
    timeout: 30000,
    responseType: 'blob'
  })

  // 请求拦截
  instance.interceptors.request.use(
    config => {
      // showScreenLoading(config.headers)
      return config
    }, error => {
      return Promise.reject(error)
    }
  )
  // 响应拦截
  instance.interceptors.request.use(
    response => {
      // endLoading()
      // hideScreenLoading()
      return response
    }, error => {
      // endLoading()
      // hideScreenLoading()
      return Promise.reject(error)
    }
  )
}
