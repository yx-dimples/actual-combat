import request from '../utils/request'

export const RegisterApi = (params) => {
  return request({
    url: '/1024/register',
    params
  })
}
