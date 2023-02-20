import request from '../utils/request'

/**
 * 推荐新音乐
 */
export const getNewSongs = (limit: number) => {
  return request({
    url: `/personalized/newsong?limit=${limit}`
  })
}

/**
 * 获取歌曲详情
 */
 export const getSongDetail = (ids: any) => {
  return request({
    url: `/song/detail?ids=${ids}`
  })
}

/**
 * 新歌速递
 */
export const getTopSong = (type: number) => {
  return request({
    url: `/top/song?type=${type}`
  })
}

/**
 * 歌手热门 50 首歌曲
 */
export const getArtistTopSong = (id: number) => {
  return request({
    url: `/artist/top/song?id=${id}`
  })
}

// 获取每日推荐歌曲
export const getRecommend = () => {
  return request({
    url: '/recommend/songs'
  })
}

// 音乐是否可用
export const checkSong = (id: number) => {
  return request({
    url: `/check/music?id=${id}`
  })
}

// 获取音乐 url
export const getSongUrl = (id: number) => {
  return request({
    url: `/song/url?id=${id}`
  })
}

// 获取歌词
export const getLyric = (id: number) => {
  return request({
    url: `/lyric?id=${id}`
  })
}