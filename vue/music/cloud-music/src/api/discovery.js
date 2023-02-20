import { request } from '../utils/request'
// banner( 轮播图 )
export const getBanner = () => {
  return request({
    url: '/banner?type=0',
    method: 'get'
  })
}

// 推荐歌单
export const getPlayList = () => {
  return request({
    url: '/personalized?limit=10',
    method: 'get'
  })
}

// 推荐新音乐
export const getNewSong = () => {
  return request({
    url: '/personalized/newsong',
    method: 'get'
  })
}

// 推荐 mv
export const getMv = () => {
  return request({
    url: '/personalized/mv',
    method: 'get'
  })
}

// 推荐电台
// export function djprogram () {
//   return request({
//     url: '/personalized/djprogram',
//     method: 'GET'
//   })
// }

// // 推荐节目
// 说明 : 调用此接口 , 可获取推荐电台

// 接口地址 : /program/recommend

// 调用例子 : /program/recommend
