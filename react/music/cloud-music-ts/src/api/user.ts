import request from '../utils/request'

interface Record {
  uid: number
  type: number // 1: weekData 0: allData
}

/**
 * 获取账号信息
 */
export const getUserAccount = () => {
  return request({
    url: '/user/account'
  })
}

/**
 * 获取用户详情
 */
export const getUserDetail = (uid: number) => {
  return request({
    url: `/user/detail?uid=${uid}`
  })
}

/**
 * 获取用户歌单
 */
export const getUserPlaylist= (uid: number) => {
  return request({
    url: '/user/playlist',
    params: {
      uid,
      limit: 10000
    }
  })
}

/**
 * 喜欢音乐列表
 */
export const getUserLikeSong = (uid: number) => {
  return request({
    url: `/likelist?uid=${uid}`
  })
}

/**
 * 获取用户播放记录
 */
export const getUserRecord = (params: Record) => {
  return request({
    url: '/user/record',
    params
  })
}

/**
 * 用户创建的电台
 */
export const getUserAudio = (uid: number) => {
  return request({
    url: `/user/audio?uid=${uid}`
  })
}
