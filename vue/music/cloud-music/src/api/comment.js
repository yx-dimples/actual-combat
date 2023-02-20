import { request } from '../utils/request'
// mv评论
export const getMvComment = params => {
  return request({
    url: '/comment/mv',
    method: 'get',
    params
  })
}

// 视频评论
export const getVideoComment = params => {
  return request({
    url: '/comment/video',
    method: 'get',
    params
  })
}

// 发送/删除评论
export const comment = params => {
  return request({
    url: '/comment',
    method: 'get',
    params
  })
}

// 专辑评论
export const getAlbumComment = params => {
  return request({
    url: '/comment/album',
    method: 'get',
    params
  })
}

// 歌曲评论
export const getMusicComment = params => {
  return request({
    url: '/comment/music',
    method: 'get',
    params
  })
}

// 歌单评论
export const getPlaylistComment = params => {
  return request({
    url: '/comment/playlist',
    method: 'get',
    params
  })
}
