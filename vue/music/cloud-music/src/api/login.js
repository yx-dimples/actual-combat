import { request } from '../utils/request'
/**
 * 二维码 key 生成接口
 */
export const getLoginQRKey = () => {
  return request({
    url: '/login/qr/key',
    params: {
      timestamp: new Date().getTime(),
      withCredentials: true
    },
    method: 'GET'
  })
}

// 传入 key 生成二维码图片的 base64 和二维码信息
export const getLoginQR = key => {
  return request({
    url: '/login/qr/create',
    method: 'GET',
    params: {
      key: key,
      qrimg: true,
      timestamp: new Date().getTime(),
      withCredentials: true
    }
  })
}

// 获取登录状态
// export const getLoginStatus = () => {
//   return request({
//     url: '/login/status',
//     // params: {
//     //   timestamp: new Date().getTime(),
//     //   withCredentials: true
//     // },
//     method: 'GET'
//   })
// }

// 带上key 检查二维码是否过期
export const checkStatus = (key) => {
  return request({
    url: '/login/qr/check',
    method: 'GET',
    params: {
      key: key,
      timestamp: new Date().getTime(),
      withCredentials: true
    }
  })
}

// 获取用户信息
export const getUserAccount = function (cookier) {
  return request({
    url: '/user/account',
    method: 'GET',
    params: {
      cookie: cookier,
      timestamp: new Date().getTime(),
      withCredentials: true
    }
  })
}

// 发送验证码
export const sentPhone = params => {
  return request({
    url: '/captcha/sent',
    params,
    method: 'get'
  })
}

// 检测手机号码是否已注册
export const checkPhone = params => {
  return request({
    url: '/cellphone/existence/check',
    params,
    method: 'get'
  })
}

// 手机登录
export const cellPhone = params => {
  return request({
    url: '/login/cellphone',
    params,
    method: 'get'
  })
}

// 注册（修改密码）
export const registerPhone = params => {
  return request({
    url: '/register/cellphone',
    params,
    method: 'get'
  })
}

// 退出
export const logout = () => {
  return request({
    url: '/logout'
  })
}
