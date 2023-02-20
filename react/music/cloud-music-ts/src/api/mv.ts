import request from '../utils/request'

interface AllMv {
  area: string
  type: string
  order: string
  limit: number
  offset: number
}

interface Video {
  id: number, 
  offset?: number
}


// 独家放送(入口列表)
export const getPrivatecontent = () => {
  return request({
    url: '/personalized/privatecontent'
  })
}

// 最新 mv
export const getMV = (limit: number) => {
  return request({
    url: `/mv/first?limit=${limit}`
  })
}

// 获取 mv 数据
export const getMVDetail = (mvid: number) => {
  return request({
    url: `/mv/detail?mvid=${mvid}`
  })
}

// mv 地址
export const getMVUrl = (id: number) => {
  return request({
    url: `/mv/url?id=${id}`
  })
}

// 相似 mv
export const getSimiMv = (mvid: number) => {
  return request({
    url: `/simi/mv?mvid=${mvid}`
  })
}

// 全部 mv
export const getAllMv = (params: AllMv) => {
  return request({
    url: '/mv/all',
    params
  })
}

// 获取视频分类列表
export const getVideoCategory = () => {
  return request({
    url: '/video/category/list'
  })
}

// 获取视频标签列表
export const getVideoGroup = () => {
  return request({
    url: '/video/group/list'
  })
}

// 获取视频标签/分类下的视频
export const getVideo = (params: Video) => {
  return request({
    url: '/video/group',
    params
  })
}

// 收藏的 MV 列表
export const getMvSublist= () => {
  return request({
    url: '/mv/sublist'
  })
}
