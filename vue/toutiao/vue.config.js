
module.exports = {
  devServer: {
    open: true,
    // 跨域
    proxy: {
      '/api': {
        // 目标路径
        // target: 'http://api-toutiao-web.itheima.net/',
        // target: 'http://ttapi.research.itcast.cn',
        // target: 'http://toutiao.itheima.net',
        target: 'https://m.toutiao.com',
        // http://toutiao.itheima.net
        // 允许跨域
        changeOrigin: true,
        // 重写路径
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
