import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// instance.interceptors.request.use(config => {
//   let token = localStorage.getItem('x-auth-token')
//   if (token) {
//     config.headers = {
//       'x-auth-token': token
//     }
//   }
//   return config
// }, error => {
//   return Promise.reject(error)
// })

// instance.interceptors.response.use(response => {
//   return response.data
// }, error => {
//   return Promise.reject(error)
// })

export default instance