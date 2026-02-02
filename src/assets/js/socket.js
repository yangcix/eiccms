import { Message } from 'element-ui';
import { session, storage } from '@/assets/js/utils';
let websock
export function initWebSocket(options) { // 账号，登录设备，唯一时间戳
  // https /wss 协议兼容
  let protocol = location.protocol === 'https:' 
  ? 'wss://192.168.164.59:8443'
  : 'ws://192.168.164.59:8443';
  const {
    url = protocol,
    account,
    loginType,
    time = storage.get('time'),
    // onmessage, // 回调函数
    vm, // 当前vue实例(this)
    openUrl,
    onopen = function(){},
  } = options
  if (!websock) {
    const wsUrl = `${url}/userLogin?account=${account}&loginType=${loginType}&mark=${time}`
    websock = new WebSocket(wsUrl);
    function reConnect () {
      setTimeout(function () {
        initWebSocket(options)
      }, 10 *1000) // 10秒后重连
    }
    websock.onopen = onopen;
    websock.onerror = function (err) {
      console.log('onError', err)
      reConnect()
    };
    websock.onclose = function (e) {
      console.log('onClosed--断开连接', e)
      reConnect()
    };
  } else {
    setTimeout(onopen, 200)
  }
  websock.onmessage = function (e) {
    const redata = JSON.parse(e.data);
    if (redata.type === -10001) {
      console.log('2222222')
      Message.closeAll();
      vm.$message(redata.message, 'error');
      vm.userInfo = null;
      if (openUrl) vm.$router.push(openUrl);
      console.log("跳转");
    }
    if (redata.type === -10002) {
      vm.userInfo = null;
    }
  };
  
  return websock
};
// let websock = null;
// let globalCallback = null;

// export function initWebSocket(account, loginType, mark) { // 账号，登录设备，唯一时间戳
//   let wsUrl = `wss://192.168.164.59:8443/userLogin?account=${this.userInfo.account}&loginType=webMobile&mark=${this.$route.query.time ? this.$route.query.time : storage.get('time')}`;
//   websock = new WebSocket(wsUrl);
//   websock.onmessage = function(e) {
//     websocketonmessage(e);
//   };
//   websock.onopen = function() {
//     websocketonopen();
//   };
//   websock.onerror = function() {
//     websocketonerror();
//     console.log('WebSocket连接发生错误');
//   };
//   websock.onclose = function(e) {
//     websocketclose(e);
//   };
// };

// function sendSock (agentData, callback) {
//   globalCallback = callback;
// };

// function websocketonmessage(e) {
//   const redata = JSON.parse(e.data);
//   return redata;
// };

// function websocketonopen() { // 连接建立之后执行send方法发送数据
//   console.log("建立连接");
// };

// function websocketonerror() {
//   initWebSocket();
// };

// function websocketclose(e) {
//   console.log('断开连接',e);
// };