import request from '../utils/request'

// 电台节目评论
export const getCommentDj = params => {
  return request({
    url: '/comment/dj',
    params
  })
}
// 歌曲评论
export const getCommentMusic = params => {
  return request({
    url: '/comment/music',
    params
  })
}