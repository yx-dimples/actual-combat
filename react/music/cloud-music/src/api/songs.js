import request from '../utils/request'

// 获取每日推荐歌曲
export const getRecommendSongs = () => {
  return request({
    url: '/recommend/songs'
  })
}

// 最近播放-歌曲
export const getRecentSong = () => {
  return request({
    url: '/record/recent/song'
  })
}

// 喜欢音乐列表
export const getLikelist = (uid) => {
  return request({
    url: `/likelist?uid=${uid}`
  })
}

// 获取歌曲详情
export const getSongDetail = ids => {
  return request({
    url: `/song/detail?ids=${ids}`
  })
}

// 私人FM
export const getPersonalFm = () => {
  return request({
    url: '/personal_fm'
  })
}

// 音乐是否可用
export const checkMusic = id => {
  return request({
    url: `/check/music?id=${id}`
  })
}

// 获取音乐 url
export const getSongUrl = id => {
  return request({
    url: `/song/url?id=${id}`
  })
}

// 喜欢音乐
export const likeSong = params => {
  return request({
    url: '/like',
    params
  })
}

// 获取歌词
export const getLyric = id => {
  return request({
    url: `/lyric?id=${id}`
  })
}