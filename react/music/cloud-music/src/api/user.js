import request from '../utils/request'
// 手机号登录
export const login = params => {
  return request({
    url: '/login/cellphone',
    params
  })
}
// 获取用户详情
export const userDetail = id => {
  return request({
    url: `/user/detail?uid=${id}`,
    method: 'get'
  })
}

// 获取用户歌单
export const userPlaylist = id => {
  return request({
    url: `/user/playlist?uid=${id}`,
    method: 'get'
  })
}

// 获取账号信息
export const getUserAccount = () => {
  return request({
    url: '/user/account'
  })
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export const getUserSubcount = () => {
  return request({
    url: '/user/subcount'
  })
}

// 获取用户播放记录
export const getUserRecord = params => {
  return request({
    url: '/user/record',
    params
  })
}

// 获取用户历史评论
export const getUserComment = params => {
  return request({
    url: '/user/comment/history',
    params
  })
}

// 获取用户动态
export const getUserEvent = params => {
  return request({
    url: '/user/event',
    params
  })
}