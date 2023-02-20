import request from '../utils/request'
// banner
export const getBanner = () => {
  return request({
    url: '/banner',
    method: 'get'
  })
}
// 推荐歌单
export const getPersonalized = () => {
  return request({
    url: '/personalized?limit=6'
  })
}
// 新歌速递
export const getTopSong = () => {
  return request({
    url: '/top/song'
  })
}
// 新碟上架
export const getTopAlbum = params => {
  return request({
    url: '/top/album',
    params
  })
}
// 最新 mv
export const getMvFirst = () => {
  return request({
    url: '/mv/first'
  })
}

// 音乐日历
export const getCalendar = params => {
  return request({
    url: '/calendar',
    params
  })
}