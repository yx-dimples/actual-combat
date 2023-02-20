import request from '../utils/request'

// banner
export const getBanner = () => {
  return request({
    url: '/banner'
  })
}

// 所有榜单内容摘要
export const getTopList = () => {
  return request({
    url: '/toplist'
  })
}