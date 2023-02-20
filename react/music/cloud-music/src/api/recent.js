import request from '../utils/request'

// 电台 最近播放
export const getRecordRecent = (type, params) => {
  return request({
    url: `/record/recent/${type}`,
    method: 'get'
  })
}
