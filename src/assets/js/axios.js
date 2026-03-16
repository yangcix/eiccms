import axios from 'axios'
import { Message} from 'element-ui';
import Router from '@/router';
import {cookie, baseUrl, storage, session} from '@/assets/js/utils';
import store from "../../store/index"
let refreshing = false // 是否正在刷新token

// 刷新token时的的队列
const { todoList, start } = (function () {
  const todoList = []
  function next() {
    // 刷新完毕按顺序全部执行
    const current = todoList.shift();
    if (current) {
      const {fn, params, resolve, reject} = current;
      fn(...params).then(resolve).catch(reject);
      setTimeout(next);
    }
  }
  return {
    todoList,
    start: next
  }
})()

//请求拦截器
axios.interceptors.request.use(config => {
  // 上传取消处理
  if(config.url === '/sm/file/save' ||
   config.url === '/sm/file/update' ||
   config.url === '/index/personal/sm/file/save' ||
   config.url === '/index/personal/sm/file/update' ||
   config.url === '/index/personal/comment/save' ||
   config.url === '/index/personal/comment/update'||
   config.url === '/index/personal/aiGrinding/save'||
   config.url === '/index/personal/aiGrinding/update'||
   config.url === '/sm/comment/save'||
   config.url === '/sm/comment/update'||
   config.url === '/sm/comment/fastRelease'||
   config.url === '/aiGrinding/save'||
   config.url === '/aiGrinding/update') {
    console.log(config.headers)
    config.cancelToken = new axios.CancelToken(cancel => {
      window.axiosCancel.push({
        cancel:cancel,
        uploadId:config.headers.uploadId
      })
    })
    console.log(window.axiosCancel)
  }
  //获取设备在线状态取消处理
  if(config.url === '/sys/terminal/getTerminalStatus') {
    config.cancelToken = new axios.CancelToken(cancel => {
      window.axiosCancelTerminal.push({
        cancel
      })
    })
  }
  return config
}, error => error);

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  if(response.config.url == '/auth/signOut' || response.config.url == '/auth/signOutBackStage' || response.config.url == '/sys/user/updatePwdBackStage' ||response.config.url == '/sys/user/updatePwd') {
    window.localStorage.removeItem('userInfo');
    window.sessionStorage.removeItem('interactData')
  }
  if(response.config.url == '/index/systemInfo'){
    localStorage.setItem('sysInfo',JSON.stringify(response.data.data))
    localStorage.setItem('uiType', response.data.data.uiType);
    localStorage.setItem('mapVal',JSON.stringify({
      lat: response.data.data.latitude,
      lng: response.data.data.longitude 
    }))
  }
  if(response.config.url == '/auth/loginByToken' && response.data.code == "200") {
    // window.localStorage.setItem('userInfo', JSON.stringify(response.data.data));
    window.localStorage.setItem('userInfo', JSON.stringify(response.data.data));
  }
  // 下载文件流token失效
  if(response.data.type && response.data.type == 'application/json'){
    const fileReader = new FileReader();
    fileReader.readAsText(response.data);
    fileReader.onload = function (e) {
      const result = JSON.parse(e.target.result);
      if(result.code == 400){
        session.remove('time');
        if(!storage.get('tokenFlag')){
          storage.set('tokenFlag', true);
          setTimeout(() => {
            storage.remove('tokenFlag');
          }, 1000)
        }
        // 开始刷新token
        // debugger
        if (!refreshing) {
          refreshing = true
          axios.post('/auth/refreshToken').then(function (res) {
            if (!/40(0|5)/.test(res.code)) {
              refreshing = false // 刷新完毕
              axios.get('/index/systemInfo').then(ress => {
                store.commit('setSysInfo', ress.data)
                document.title = ress.data.name ? ress.data.name : '劢联科技';
                session.set('userInfo', ress.data);
                localStorage.setItem('version',ress.data.version)
              })
              start() // 开始执行请求队列
            }
          });
        }
        return {
          code: 400
        };
      }
    }
  }
  if (response.data.code == "400") {
    // const queryToken = session.get("clientToken");
    // if (queryToken) {
    //   console.log(queryToken);
    //   console.log("queryToken-you");
    // } else {
    //   console.log("queryToken-meiyou");
    // }
    session.remove('time');
    if(!storage.get('tokenFlag')){
      storage.set('tokenFlag', true);
      setTimeout(() => {
        storage.remove('tokenFlag');
      }, 1000)
    }
    // 开始刷新token
    // debugger
    if (!refreshing) {
      refreshing = true
      axios.post('/auth/refreshToken').then(function (res) {
        if (!/40(0|5)/.test(res.code)) {
          refreshing = false // 刷新完毕
          axios.get('/index/systemInfo').then(ress => {
            store.commit('setSysInfo', ress.data)
            document.title = ress.data.name ? ress.data.name : '劢联科技';
            session.set('userInfo', ress.data);
            localStorage.setItem('version',ress.data.version)
          })
          start() // 开始执行请求队列
        }
      });
    }
  }else if (response.data.code == "405") {
    window.localStorage.removeItem('userInfo');
    session.remove('time');
    // Message.closeAll();
    // 2 秒内不重复提示
    // Message({
    //   type: 'error',
    //   message: response.data.message,
    //   center: true,
    //   offset: 70
    // });
    // window._code405 = true;
    // setTimeout(() => {
    //   window._code405 = false;
    // }, 2000);
    Router.push('/login');
    // setTimeout(() => {
    //   location.reload();
    //   // Router.go(0);
    // }, 1000);
  }else if (response.data.code == "-10000") {
    Message.closeAll();
    if(response.config.url !== '/sm/recordOverview/list') {
      Message({
        type: 'error',
        message: response.data.message,
        center: true,
        offset: 70
      });
    }
    // window._code10000 = true;
    // setTimeout(() => {
    //     window._code10000 = false; 
    // }, 2000);
  }else if (response.data.code == "-20000") {
    Message({
      type: 'error',
      // message: '系统错误，请稍后重试',
      message: response.data.message,
      center: true,
      offset: 70
    });
  }
  //通过headers取数据，下载文件使用
  let resUrl = response.config.url
  if(resUrl.includes('/sys/user/importUserInfo') 
  || resUrl.includes('/sm/theme/exportVisitedData')
  || resUrl.includes('/sm/theme/exportUnvisitorInfo')
  || resUrl.includes('/sm/comment/exportCommentReportTwo')
  || resUrl.includes('/sys/user/getExcel')) {
    return response;
  }else{
    return response.data;
  }
}, error => {
  return Promise.reject(error); 
});

//设置默认地址
axios.defaults.baseURL = baseUrl;
//超时时间
// axios.defaults.timeout = 60000;
//设置携带cookie
axios.defaults.withCredentials = true;

// get方法
function get(url, data = {},responseType) {
  return new Promise((resolve, reject) => {
    const params = [url, { params: data, responseType: responseType}]
    const reqObj = {
      fn: axios.get,
      params,
      resolve: resolveCallback,
      reject: rejectCallback,
    }

    function resolveCallback(response) {
      if (response.code == 400) {
        todoList.push(reqObj) // 需要刷新token，加入队列
      } else if(response !== 'error'){
        resolve(response);
      };
    }

    function rejectCallback(err) {
      console.log(err)
      reject(err)
    }

    if (refreshing && url !== '/index/systemInfo') {
      todoList.push(reqObj) // 正在刷新token，加入队列
    } else {
      // axios.get(...params).then(resolveCallback).catch(rejectCallback)
      axios.get(...params).then(function (data) {
        if (url === '/index/systemInfo') {
          refreshing = false;
          // start();
        }
        resolveCallback(data);
      }).catch(rejectCallback)
    }
  })
}

// post请求
function post(url, data = {},uploadId) {
  return new Promise((resolve, reject) => {
    const params = [url, data,uploadId]

    const reqObj = {
      fn: axios.post,
      params,
      uploadId,
      resolve: resolveCallback,
      reject: rejectCallback,
    }

    function resolveCallback(response) {
      if (response.code == 400) {
        todoList.push(reqObj) // 需要刷新token，加入队列
      } else if(response !== 'error'){
        resolve(response);
      };
    }

    function rejectCallback(err) {
      console.log(err)
      reject(err)
    }

    if (refreshing && (url !== '/auth/login')) {
      todoList.push(reqObj) // 正在刷新token，加入队列
    } else {
      axios.post(...params).then(function (data) {
        if (url === '/auth/login') {
          refreshing = false // 登录完毕
          todoList.splice(0,todoList.length);// 清空请求队列
          // start() // 开始执行请求队列
        }
        resolveCallback(data)
      }).catch(rejectCallback)
    }
  })
}

// post上传进度
function postProgress(url, data = {}, set = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, set).then(response => {
      if(response !== 'error'){
        resolve(response);
      };
    }, err => {
      console.log(err)
      reject(err)
    })
  })
}
export default {get, post, postProgress}
