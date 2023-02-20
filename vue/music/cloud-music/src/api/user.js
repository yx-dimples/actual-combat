import { request } from '../utils/request'

// 获取用户信息
export const userDetail = id => {
  return request({
    url: `/user/detail?uid=${id}`,
    method: 'get'
  })
}

// 获取用户播放记录
export const userRecord = params => {
  return request({
    url: '/user/record',
    method: 'get',
    params
  })
}

// 获取用户歌单
export const userPlaylist = params => {
  return request({
    url: '/user/playlist',
    method: 'get',
    params
  })
}
