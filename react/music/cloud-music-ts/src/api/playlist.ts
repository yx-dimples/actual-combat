import request from '../utils/request'

interface Playlist {
  order?: string
  cat?: string
  limit?: number
  offset?: number
  id?: number
}

// 精品歌单标签列表
export const getHighquality = () => {
  return request({
    url: '/playlist/highquality/tags'
  })
}

// 歌单分类
export const getCatlist = () => {
  return request({
    url: '/playlist/catlist'
  })
}

// 推荐歌单
export const getPersonalized = (limit: number) => {
  return request({
    url: `/personalized?limit=${limit}`
  })
}

// 歌单
export const getPlayList = (params: Playlist) => {
  return request({
    url: '/top/playlist',
    params
  })
}

// 获取歌单详情
export const getPlaylistDetail = (id: number) => {
  return request({
    url: `/playlist/detail?id=${id}`
  })
}

// 获取歌单所有歌曲
export const getTrackAll = (params: Playlist) => {
  return request({
    url: `/playlist/track/all`,
    params
  })
}