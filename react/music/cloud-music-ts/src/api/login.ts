import request from '../utils/request'

interface Phone {
  phone: string,
  password: string
  captcha?: string
  nickname?: string
}

interface Captcha {
  phone: string
  captcha: string
}

/**
 * 1. 手机登录
 */

export const getLoginCellPhone = (params: Phone) => {
  return request({
    url: '/login/cellphone',
    params
  })
}

/**
 * 3. 二维码登录
*/

// 3.1 二维码 key 生成接口
export const getQrKey = () => {
  return request({
    url: '/login/qr/key'
  })
}

// 3.2 二维码生成接口
export const getQrCreate = (key: string) => {
  return request({
    url: `/login/qr/create?key=${key}&qrimg=true`
  })
}

// 3.3 二维码检测扫码状态接口
export const getQrCheck = (key: string) => {
  return request({
    url: `/login/qr/check?key=${key}`
  })
}

// 注册(修改密码)
export const getRegisterCellPhone = (params: Phone) => {
  return request({
    url: '/register/cellphone',
    params
  })
}

// 发送验证码
export const getSentCode = (phone: number) => {
  return request({
    url: `/captcha/sent?phone=${phone}`
  })
}

// 检测手机号码是否已注册
export const checkPhone = (phone: number) => {
  return request({
    url: `/cellphone/existence/check?phone=${phone}`
  })
}

// 验证验证码
export const checkCaptcha = (params: Captcha) => {
  return request({
    url: '/captcha/verify',
    params
  })
}
