module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/dataanalysis/'
  : '/',
  pages: {
    index: {
      // entry for the page
      entry: 'src/pages/index/index.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    giftDetail: 'src/pages/giftDetail/index.js',
    giftAnalysis: {
      entry:'src/pages/giftAnalysis/index.js',
      title: '礼品分析'
    },
    equipmentDetail: {
      entry: 'src/pages/equipmentDetail/index.js',
      title: '设备使用详情统计'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
  },
  configureWebpack: {
    devServer: {
      host: '0.0.0.0',
      // proxy: {
      //   '/api': {
      //     target: 'http://39.105.231.43:9001', // 测试
      //     // target: 'http://10.1.2.172',
      //     changeOrigin: false,
      //   },
      // }
    },
    externals : {
      // 'element-ui':'element-ui'
    },
  }
}