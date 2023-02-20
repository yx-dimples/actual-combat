import { request } from '../utils/request'
// mv 详情
export const getMvDetail = id => {
  return request({
    url: `/mv/detail?mvid=${id}`,
    method: 'get'
  })
}

// mv 地址
export const getMvUrl = id => {
  return request({
    url: `/mv/url?id=${id}`,
    method: 'get'
  })
}

// 相似 mv
export const getSimiMv = id => {
  return request({
    url: `/simi/mv?mvid=${id}`,
    method: 'get'
  })
}

// 全部 mv
export const getAllMV = params => {
  return request({
    url: '/mv/all',
    method: 'get',
    params
  })
}

// 获取视频标签列表
export const getVideoGroup = () => {
  return request({
    url: '/video/group/list',
    method: 'get'
  })
}

// 获取视频分类列表
export const getVideoCategory = () => {
  return request({
    url: '/video/category/list',
    method: 'get'
  })
}

// 获取视频标签/分类下的视频
export const getVideo = params => {
  return request({
    url: '/video/group',
    method: 'get',
    params
  })
}

// 视频详情
export const getVideoDetail = id => {
  return request({
    url: `/video/detail?id=${id}`,
    method: 'get'
  })
}

// 获取视频播放地址
export const getVideoUrl = id => {
  return request({
    url: `/video/url?id=${id}`,
    method: 'get'
  })
}

// 相关视频
export const relatedVideo = id => {
  return request({
    url: `/related/allvideo?id=${id}`,
    method: 'get'
  })
}
