import axios from 'axios'
// import {}

const instance = axios.create({
  baseURL: '/api',	// 通过使用配置的proxy来解决跨域
  timeout: 5000
});

// // 添加请求拦截器
// instance.interceptors.request.use(function (config) {
// //  console.log('请求拦截');
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });

// // 添加响应拦截器
// instance.interceptors.response.use(function (response) {
//   return response.data;
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error);
// });


export default instance;
