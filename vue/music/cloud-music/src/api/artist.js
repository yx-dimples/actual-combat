import { request } from '../utils/request'
// 获取歌手详情
export const getArtistDetails = id => {
  return request({
    url: `/artist/detail?id=${id}`,
    method: 'get'
  })
}

// 获取歌手单曲
export const getArtists = id => {
  return request({
    url: `/artists?id=${id}`,
    method: 'get'
  })
}

// 获取歌手专辑
export const getArtistAlbum = params => {
  return request({
    url: '/artist/album',
    method: 'get',
    params
  })
}

// 获取歌手 mv
export const getArtistMv = id => {
  return request({
    url: `/artist/mv?id=${id}`,
    method: 'get'
  })
}

// 获取歌手描述
export const getArtistDesc = id => {
  return request({
    url: `/artist/desc?id=${id}`,
    method: 'get'
  })
}

// 获取相似歌手
export const getSimiArtist = id => {
  return request({
    url: `/simi/artist?id=${id}`,
    method: 'get'
  })
}

// 歌手分类列表
export const getArtistList = params => {
  return request({
    url: '/artist/list',
    method: 'get',
    params
  })
}

// 收藏/取消收藏歌手
export const subArtist = params => {
  return request({
    url: '/artist/sub',
    params
  })
}

// 收藏的歌手列表
export const sublistArtis = () => {
  return request({
    url: '/artist/sublist'
  })
}
