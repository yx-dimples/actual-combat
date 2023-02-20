import request from '../utils/request'

interface UserLogin{
  mobile: string
  code: string
}

interface Articles {
  channel_id: number
  page?: number,
  per_page?: number
}

interface UserProfile {
  name?: string,
  gender?: string | number,
  birthday?: string,
  intro?: string
}

interface UserPhoto {
  photo: any
}

interface Search {
  page?: number
  per_page?: number
  q: string
}

interface Suggestion {
  q: string
}

interface UserChannels {
  channels: [{
    id: number,
    seq?: number
  }]
}

/**
 * 获取短信验证码
 * @param mobile: 手机号
 * @returns
 */
export const sendCodes = (mobile: string) => {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    method: 'get'
  })
}
/**
 * 用户认证（登录注册）
 * @param data
 * @returns
 */
export const login = (data: UserLogin) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
/**
 * 获取用户频道列表
 * @returns
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
/**
 * 获取所有频道列表
 * @returns
 */
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 频道新闻推荐_V1.0
export const getArticles = (params: Articles) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/articles',
    params
  })
}

/**
 * 获取用户自己信息
 * @returns
 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

/**
 * 获取用户个人资料
 * @returns
 */
export const getUserProfile = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}
/**
 * 编辑用户个人资料
 * @param data
 * @returns
 */
export const updateUserProfile = (data: UserProfile) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
/**
 * 编辑用户照片资料（头像、身份证照片）
 * @param data
 * @returns
 */
export const updateUserPhoto = (data: UserPhoto) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
/**
 * 删除用户搜索历史
 * @returns
 */
export const delSearchHistory = () => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/search/histories'
  })
}
/**
 * 获取搜索结果
 * @returns
 */
export const getSearch = (params: Search) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
/**
 * 获取用户搜索历史
 * @returns
 */
export const getSearchHistory = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}
/**
 * 获取联想建议（自动补全）
 * @returns
 */
export const getSuggestion = (params: Suggestion) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}
/**
 * 批量修改用户频道列表（部分覆盖）
 * @param data
 * @returns
 */
export const addUserChannels = (data: UserChannels) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}
// 删除用户频道
export const delUserChannels = (target: number) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${target}`
  })
}
