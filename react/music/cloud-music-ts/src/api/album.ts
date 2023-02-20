import request from '../utils/request'

interface TopAlbum {
  area: string,
  offset?: number
  limit?: number
}

interface Sublist {
  offset?: number
  limit?: number
}

/**
 * 新碟上架
 */
 export const getAlbumNew = (params: TopAlbum) => {
  return request({
    url: '/album/new',
    params
  })
}

/**
 * 数字专辑详情
 */
export const getAlbum = (id: Number) => {
  return request({
    url: `/album?id=${id}`
  })
}

// /album/detail/dynamic?id=6434
export const getAlbumDynamic = (id: Number) => {
  return request({
    url: `/album/detail/dynamic?id=${id}`
  })
}

// 获取已收藏专辑列表
export const getAlbumSublist = (params: Sublist) => {
  return request({
    url: '/album/sublist',
    params
  })
}
