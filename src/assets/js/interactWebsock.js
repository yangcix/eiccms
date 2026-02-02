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
      console.log('111111')
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





// 2.1 通过createWebSocket创建连接

export function createWebSocket(wsUrl,vm) {
  try {
    var ws = new WebSocket(wsUrl);
    init(ws);
  } catch(e) {
    console.log(e);
    reconnect(wsUrl);
  }
  // 2.2 创建init方法，初始化一些监听事件，如果希望websocket连接一直保持, 我们会在close或者error上绑定重新连接方法。
  function init(ws) {
    ws.onclose = function () {
      console.log('链接关闭-正在重连');
      reconnect(wsUrl);
    };
    ws.onerror = function() {
      console.log('发生异常了-正在重连');
      reconnect(wsUrl);
    };
    ws.onopen = function () {
      //心跳检测重置
      heartCheck.start();
    };
    ws.onmessage = function (event) {
      console.log(vm)
      vm.add1()
      // console.log(event);
      //拿到任何消息都说明当前连接是正常的
      heartCheck.start();
    }
  }
  // 　2.3 重连操作，通过设置lockReconnect变量避免重复连接

  var lockReconnect = false;//避免重复连接
  function reconnect(url) {
        if(lockReconnect) {
          return;
        };
        lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        tt && clearTimeout(tt);
        var tt = setTimeout(function () {
          createWebSocket(url);
          lockReconnect = false;
        }, 4000);
  }
  // 　2.4 心跳检测
  //心跳检测
  // var heartCheck = {
  //       timeout: 3000, //每隔三秒发送心跳
  //       severTimeout: 5000,  //服务端超时时间
  //       timeoutObj: null,
  //       serverTimeoutObj: null,
  //       start: function(){
  //         var _this = this;
  //         this.timeoutObj && clearTimeout(this.timeoutObj);
  //         this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
  //         this.timeoutObj = setTimeout(function(){
  //               //这里发送一个心跳，后端收到后，返回一个心跳消息，
  //               //onmessage拿到返回的心跳就说明连接正常
  //               ws.send("123456789"); // 心跳包
  //               //计算答复的超时时间
  //               _this.serverTimeoutObj = setTimeout(function() {
  //                   ws.close();
  //               }, _this.severTimeout);
  //         }, this.timeout)
  //       }
  // }
  // 　　有的时候，客户端发送3次心跳包服务端均未回复才判定为失去连接，所以这时需要加上计数来判断。
  //心跳检测
  var heartCheck = {
        timeout: 3000, //每隔三秒发送心跳
        num: 3,  //3次心跳均未响应重连
        timeoutObj: null,
        serverTimeoutObj: null,
        start: function(){
          var _this = this;
          var _num = this.num;
          this.timeoutObj && clearTimeout(this.timeoutObj);
          this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
          this.timeoutObj = setTimeout(function(){
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                //onmessage拿到返回的心跳就说明连接正常
                ws.send("123456789"); // 心跳包
                _num--;
                //计算答复的超时次数
                if(_num === 0) {
                    ws.colse();
                }
          }, this.timeout)
        }
  }
}
