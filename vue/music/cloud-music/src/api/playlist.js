import { request } from '../utils/request'
// 获取精品歌单
export const getPlayList = params => {
  return request({
    url: '/top/playlist',
    method: 'get',
    params
  })
}

// 获取歌单分类
export const getCatList = () => {
  return request({
    url: '/playlist/catlist',
    method: 'get'
  })
}

// 获取歌单详情
export const getPlayListDetails = id => {
  return request({
    url: `/playlist/detail?id=${id}`,
    method: 'get'
  })
}

// 获取歌单收藏者
export const getSubscribers = params => {
  return request({
    url: '/playlist/subscribers',
    method: 'get',
    params
  })
}

// 收藏/取消收藏歌单
export const subPlayList = params => {
  return request({
    url: '/playlist/subscribe',
    method: 'get',
    params
  })
}

// 新建歌单
export const createPlayList = params => {
  return request({
    url: '/playlist/create',
    method: 'get',
    params
  })
}

// 对歌单添加或删除歌曲
export const tracksPlayList = params => {
  return request({
    url: '/playlist/tracks',
    method: 'get',
    params
  })
}
