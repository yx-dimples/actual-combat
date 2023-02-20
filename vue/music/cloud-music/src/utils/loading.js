import { Loading } from 'element-ui'
import _ from 'lodash'

let loading = null
let needRequestCount = 0

// 开启loading状态
const startLoading = (headers = {}) => {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

// 关闭loading状态
const endLoading = _.debounce(() => {
  loading.close()
  loading = null
}, 300)

export const showScreenLoading = headers => {
  if (needRequestCount === 0 && !loading) {
    startLoading(headers)
  }
  needRequestCount++
}

export const hideScreenLoading = () => {
  if (needRequestCount <= 0) return false
  needRequestCount--
  needRequestCount = Math.max(needRequestCount, 0)
  if (needRequestCount === 0) {
    endLoading()
  }
}

export default {}
