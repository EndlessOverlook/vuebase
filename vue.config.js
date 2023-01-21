const { defineConfig } = require('@vue/cli-service');
const isProd = process.env.NODE_ENV == 'production';
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
console.log('process.env.VUE_APP_URL: ' + process.env.VUE_APP_URL);
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');
function resolve(src) {
  return path.resolve(__dirname, src);
}

// CDN预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT'
};
// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
    js: []
  },
  // 生产环境
  build: {
    css: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
      'https://unpkg.com/element-ui/lib/index.js'
    ]
  }
};

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
      // HTML不压缩
      args[0].minify = {};
      if (!isProd) {
        args[0].cdn = cdn.build;
      } else {
        args[0].cdn = cdn.dev;
      }
      return args;
    });
    // console.log('config.plugins: ' + JSON.stringify(config.plugins));
    // config.plugins.push('prefetch');
    // config.plugins.push('preload');

    if (isProd) {
      // 打包时NPM包转CDN
      config.externals = externals;
    }

    config.optimization
      .minimize(true)
      .minimizer('terser')
      .tap(args => {
        let { terserOptions } = args[0];
        terserOptions.compress.drop_console = true;
        terserOptions.compress.drop_debugger = true;
        return args;
      });

    // 压缩图片
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true });
  },
  configureWebpack: config => {
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\/html$|\.css$/u,
        threshold: 4096 // 超过4KB则开启gzip压缩
      }),
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: resolve('./src/entry-skeleton.js')
          }
        },
        minimize: true,
        quiet: true
        // 如果不设置那么所有的路由都会共享这个骨架屏组件
        // router: {
        //     mode: 'hash',
        //     // 给对应的路由设置对应的骨架屏组件，skeletonId 的值根据组件设置的 id
        //     routes: [
        //         { path: '/home', skeletonId: 'home' },
        //         { path: '/about', skeletonId: 'about' }
        //     ]
        // }
      }),
      new BundleAnalyzerPlugin()
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
          },
          //公用模块抽离
          common: {
            name: 'common', // chunk 名称
            priority: 0, // 优先级
            test: resolve('src/utils'),
            minSize: 0, // 公共模块的大小限制
            minChunks: 1 // 公共模块最少复用过几次，把公共模块拆分
          },
          components: {
            name: 'chunk-components',
            test: resolve('src/components'),
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          },
          //样式抽离
          styles: {
            name: 'styles',
            test: /\.(sa|sc|le|c)ss$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    };

    // config.output.filename = 'js/[name].[contenthash:4].js';
    // config.output.chunkFilename = 'js/[name].[contenthash:4].js';
  },
  devServer: {
    proxy: {
      '/books': {
        target: 'https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0',
        changeOrigin: true,
        headers: {
          key: 'value'
        }
      },
      '/api': {
        target: 'http://192.168.1.30:8085', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        //pathRewrite方法重写url
        pathRewrite: {
          '^/api': '/'
          //pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
          //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        },
        headers: {
          Cookie: 'test-test'
        }
      }
    }
  }
});
