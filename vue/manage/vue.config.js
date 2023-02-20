module.exports = {
  devServer: {
    open: true,
    // 跨域
    proxy: {
      '/api': {
        // 目标路径
        target: 'http://1.116.64.64:5004/api2',
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
