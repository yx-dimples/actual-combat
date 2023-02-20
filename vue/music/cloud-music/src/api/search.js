import { request } from '../utils/request'
/**
 * 热门搜索
 */
export const getSearchHot = () => {
  return request({
    url: '/search/hot',
    method: 'get'
  })
}

// 搜索建议
export const getSearchSuggest = params => {
  return request({
    url: '/search/suggest',
    method: 'get',
    params
  })
}

// 搜索
export const getSearch = params => {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}
