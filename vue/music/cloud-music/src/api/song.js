import { request } from '../utils/request'

// 获取音乐详情
export const getSongDetail = ids => {
  return request({
    url: `/song/detail?ids=${ids}`,
    method: 'get'
  })
}

// 音乐是否可用
export const checkMusic = id => {
  return request({
    url: `/check/music?id=${id}`,
    method: 'get'
  })
}

// 获取音乐 url
export const getSongUrl = id => {
  return request({
    url: `/song/url?id=${id}`,
    method: 'get'
  })
}

// 获取歌词
export const getLyric = id => {
  return request({
    url: `/lyric?id=${id}`,
    method: 'get'
  })
}

// 获取每日推荐歌曲
export const getRecommend = () => {
  return request({
    url: '/recommend/songs',
    method: 'get'
  })
}
