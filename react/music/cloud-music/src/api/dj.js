import request from '../utils/request'
// 电台 banner
export const getDjBanner = () => {
  return request({
    url: '/dj/banner',
    method: 'get'
  })
}

// 电台 - 分类
export const getDjCatelist = () => {
  return request({
    url: '/dj/catelist',
    method: 'get'
  })
}

// 推荐节目
export const getProgramRecommend = () => {
  return request({
    url: '/program/recommend',
    method: 'get'
  })
}

// 电台 - 节目榜
export const getdjProgram = params => {
  return request({
    url: '/dj/program/toplist',
    method: 'get',
    params
  })
}

// 电台 - 分类推荐
export const getDjRecommend = type => {
  return request({
    url: `/dj/recommend/type?type=${type}`,
    method: 'get'
  })
}

// 电台 - 详情
export const getDjDetail = rid => {
  return request({
    url: `/dj/detail?rid=${rid}`,
    method: 'get'
  })
}

// 电台 - 节目
export const getDjProgram = params => {
  return request({
    url: '/dj/program',
    method: 'get',
    params
  })
}

// 电台 - 节目详情
export const getDjProgramDetail = id => {
  return request({
    url: `/dj/program/detail?id=${id}`,
    method: 'get',
  })
}