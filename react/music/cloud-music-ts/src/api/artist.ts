import request from '../utils/request'

interface ArtistList {
  limit?: number
  offset?: number
  type?: number
  area?: number
  initial?: string | number // 按首字母索引查找参数
}

interface Album {
  limit?: number
  offset?: number
  id: number
}

// 歌手分类列表
export const getArtistList = (params: ArtistList) => {
  return request({
    url: '/artist/list',
    params
  })
}

// 获取歌手详情
export const getArtistdetail = (id: number) => {
  return request({
    url: `/artist/detail?id=${id}`,
  })
}

// 获取歌手描述
export const getArtistDesc = (id: number) => {
  return request({
    url: `/artist/desc?id=${id}`,
  })
}

// 获取歌手 mv
export const getArtistMv = (id: number) => {
  return request({
    url: `/artist/mv?id=${id}`,
  })
}

// 获取歌手 album
export const getArtistAlbum = (params: Album) => {
  return request({
    url: '/artist/album',
    params
  })
}

// 收藏的歌手列表
export const getArtistSublist = () => {
  return request({
    url: '/artist/sublist'
  })
}