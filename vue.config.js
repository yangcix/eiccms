var webpack = require('webpack');
module.exports = {
    runtimeCompiler: true,
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "@/assets/css/mixins.scss";`
            },
        }
    },
    lintOnSave: false,
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                // target: process.env.VUE_APP_BASE_URL, //对应自己的接口
                // target: 'http://192.168.164.157:8081', //研发测试地址
                // target: 'http://192.168.164.66:8081', //研发测试地址
                target: 'http://127.0.0.1:8081', //本地开发地址
                // target: 'http://192.168.166.83:8081', // 测试地址
                secure: false,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
}