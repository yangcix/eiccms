import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as $comjs from "@/utils/common";

import axios from '@/assets/js/axios';
Vue.prototype.$axios = axios;

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/js/element-component.js';

import '@/assets/css/reset.css';

//import '@/assets/css/fonts/iconfont.css';
import '@/assets/icons/alitubiao.css';

import '@/assets/js/filters-directives.js';
import '@/assets/js/form-verify.js';

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
import 'xgplayer'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/assets/css/common.css';

import VueBus from '@/assets/js/bus.js'
import preventReClick from '@/assets/js/preventReClick'
Vue.use(preventReClick)
    // use
Vue.use(mavonEditor)
Vue.use(VueBus)

Vue.prototype.$comjs = $comjs
window.axiosCancel = []
    // 将上传文件请求的cancel方法,挂载到vue原型上
Vue.prototype.cancel = function(item) {
    // 获取缓存的 请求取消标识 数组，取消所有关联的请求
    console.log(window.axiosCancel, 'window.axiosCancel')
    let cancelArr = window.axiosCancel;
    // cancelArr.cancel(`取消了上传${item.name}`);
    cancelArr.forEach((ele, index) => {
        console.log(ele, '取消视频上传')
        if (ele.uploadId === item.uploadId) {
            ele.cancel(`取消成功`) // 在失败函数中返回这里自定义的错误信息
            delete window.axiosCancel[index]
        }
    })
}


Vue.config.productionTip = false;
if (!Array.prototype.includes) {
    Array.prototype.includes = function(search) {
        return !!~this.indexOf(search);
    }
}


window.axiosCancelTerminal = []
    // 将上传文件请求的cancel方法,挂载到vue原型上
Vue.prototype.cancelTerminal = function() {
        // 获取缓存的 请求取消标识 数组，取消所有关联的请求
        let cancelArr = window.axiosCancelTerminal;
        // cancelArr.cancel(`取消了上传${item.name}`);
        cancelArr.forEach((ele, index) => {
            ele.cancel(`取消了获取状态`) // 在失败函数中返回这里自定义的错误信息
            delete window.axiosCancelTerminal[index]
        })
    }
    // router.afterEach((to,from,next) => {
    //   window.scrollTo(0,0);
    // });
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')