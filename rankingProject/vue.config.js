module.exports = {
  configureWebpack: {
    externals : {
      // 'element-ui':'element-ui'
    },
    devServer: {
      proxy: {
        '/api': {
          target: 'http://39.105.231.43:9001',
          changeOrigin: true, // 是否开启跨域
          // pathRewrite: {'^/api' : ''}
        }
      }
    }
  }
}