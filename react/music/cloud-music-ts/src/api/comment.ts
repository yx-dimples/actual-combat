import request from '../utils/request'

interface Comment {
  id: number
  limit?: number
  offset?: number
  type?: number
}

// 歌单评论
export const getPlaylistComment = (params: Comment) => {
  return request({
    url: '/comment/playlist',
    params
  })
}
// mv评论
export const getMvComment = (params: Comment) => {
  return request({
    url: '/comment/mv',
    params
  })
}
// 视频评论
export const getVideoComment = (params: Comment) => {
  return request({
    url: '/comment/video',
    params
  })
}
// 专辑评论
export const getAlbumComment = (params: Comment) => {
  return request({
    url: '/comment/album',
    params
  })
}
// 歌曲评论
export const getMusicComment = (params: Comment) => {
  return request({
    url: '/comment/music',
    params
  })
}
// 热门评论
export const getHotComment = (params: Comment) => {
  return request({
    url: '/comment/hot',
    params
  })
}