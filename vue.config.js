const { defineConfig } = require('@vue/cli-service');
const isProd = process.env.NODE_ENV == 'production';
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
console.log('process.env.VUE_APP_URL: ' + process.env.VUE_APP_URL);
const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: 'https://cnd.xxx.com',
  assetsDir: 'assets',
  outputDir: isProd ? 'dist' : 'qa',
  productionSourceMap: false,
  chainWebpack: config => {
    // config.module
    //   .rule('images')
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => Object.assign(options, { name: './images/[name].[ext]', limit: 10000 }));
    config.plugin('html').tap(args => {
      args[0].title = 'Ralph-Vue';
      return args;
    });
  },
  configureWebpack: config => {
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\/html$|\.css$/u,
        threshold: 4096 // 超过4KB则开启gzip压缩
      })
    );
    // console.log('config.optimization: ' + JSON.stringify(config.optimization));
    config.optimization = {
      splitChunks: {
        chunks: 'all', // initial同步，async异步，all同步或者异步
        automaticNameDelimiter: '-', // 打包文件名默认连接符号
        minSize: 1,
        cacheGroups: {
          elementUI: {
            name: 'chunk-elementUI',
            priority: 30,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            reuseExistingChunk: true
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            minChunks: 1,
            chunks: 'initial', // 仅打包同步引用的依赖
            reuseExistingChunk: true
          }
        }
      }
    };
  }
});
