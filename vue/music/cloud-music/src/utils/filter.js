import Vue from 'vue'
// 全局过滤器(秒数转化为分钟)
Vue.filter('timeFormat', time => {
  // 分钟
  const minute = time / 60
  let minutes = parseInt(minute)

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  // 秒
  const second = time % 60
  let seconds = Math.floor(second)
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return `${minutes}:${seconds}`
})
