import request from '../utils/request'

// 推荐歌单
export const getPersonalized = params => {
  return request({
    url: '/personalized',
    params
  })
}

// 获取歌单详情
export const getPlayListDetail = id => {
  return request({
    url: `/playlist/detail?id=${id}`
  })
}

// 获取歌单所有歌曲
export const getPlayTrackAll = id => {
  return request({
    url: `/playlist/track/all?id=${id}`
  })
}

// 热门歌单分类
export const getPlayListHot = () => {
  return request({
    url: '/playlist/hot'
  })
}

// 新建歌单
export const getCreatePlayList = params => {
  return request({
    url: '/playlist/create',
    params
  })
}

// 歌单 ( 网友精选碟 )
export const getTopPlaylist = params => {
  return request({
    url: '/top/playlist',
    params
  })
}