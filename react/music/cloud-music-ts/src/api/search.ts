import request from '../utils/request'

interface Search {
  keywords: any
  limit?: number,
  offset?: number
  type?: number
}

/**
 * 搜索建议
 */
export const getSuggest = (keywords: any) => {
  return request({
    url: `/search/suggest?keywords=${keywords}`
  })
}

/**
 * 搜索
 */
 export const getSearch = (params: Search) => {
  return request({
    url: '/search',
    params
  })
}