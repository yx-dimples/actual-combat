import request from '../utils/request'

// 所有榜单
export const getTopList = () => {
  return request({
    url: '/toplist/detail'
  })
}
