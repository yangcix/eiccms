import {EventEmitter} from 'events'//(http://nodejs.cn/api/)Node.js文档
import * as mediaSoupClient from "mediasoup-client";
//(https://mediasoup.org/documentation/v3/mediasoup-client/api/)mediaSoup-client-v3API
import protooClient from 'protoo-client';
import Event from "./event.js"
export const MyEvent = new Event()
const WEBCAM_SIMULCAST_ENCODINGS =
[
	{ scaleResolutionDownBy: 4, maxBitrate: 500000 },
	{ scaleResolutionDownBy: 2, maxBitrate: 1000000 },
	{ scaleResolutionDownBy: 1, maxBitrate: 5000000 }
];

// Used for VP9 webcam video.
const WEBCAM_KSVC_ENCODINGS =
[
	{ scalabilityMode: 'S3T3_KEY' }
];
/*自定义客户端*/
class RoomClient extends EventEmitter{
  /*构造函数*/
  constructor({ account,password, url, id, isLocal, localAudioId, localVideoId }){
    super();
    this._closed = false;//Closed flag.
    this._account = account;//Room id.
    this._password = password;//userName.
    this.localAudioId = localAudioId
    this.localVideoId = localVideoId
    this._device = account;//userName.
    this._router_server = null;
    this._router_port = null;
    this._socket = null;//socket.
    this._protoo = null;
    this._roomId = null;
    this._userId = null;
    this._userName = null;
    this._userNickName = null;
    this._userLists = null;
    this._mainId = null;
    this._peerId = null;
    this._userType = null; //1主讲 0副讲 2旁观
    this.master_user = null;
    this.assistant_list = null;
    this._url = url;
    this._id = id;
    this.audioTrack = null;
    this.videoTrack = null;
    this.localTrack = null;
    this._isLocal = isLocal; // 是否本地信号 1是 0否
    this._mediaSoupDevice = null;//mediaSoup-client Device instance.
    this._sendTransport = null;//mediaSoup Transport for sending.
    this._chatDataProducer = null;
    this._botDataProducer = null;
    this._recvTransport = null;//mediaSoup Transport for receiving.
    this._micProducer = null;//Local mic mediaSoup Producer.
    this._webcamProducer = null;//Local webcam mediaSoup Producer.
    this._shareProducer = null;//Local share mediaSoup Producer.
    this._consumers = new Map();//mediaSoup Consumers.
    this._consumersLength = 0;//mediaSoup Consumers.
    this._dataConsumers = new Map();
    this._webcams = new Map();
    this._webcam =
		{
			device     : null,
			resolution : 'hd'
		};
    this.videoStream = null;
    this.audioStream = null;
  }
   /*退出房间*/
  leaveRoom(){
    this.sendMessage({
      "method_type":"logoutRoom",
      "room_id": this._roomId
    })
    this._socket.close();
  }
  closeSocket(){
    console.log('关闭连接socket')
    this._socket.close();
    this._socket = null
  }
  /*客户端销毁*/
  destoryRoom(){
    this.sendMessage({
      "method_type":"destoryRoom",
      "room_id": this._roomId,
    })
    this._socket.close();
    this._closed = true;
  }
  // 结束主题
  finishTheme(id){
    this.sendMessage({
      "method_type":"stopInteractionTheme",
      "id": id,
    })
  }
  // 刷新流
  streamRefresh(){
    this.sendMessage({
      "method_type":"streamRefresh",
      "room_id": this._roomId,
      "user_id": this._userId,
    })
  }
  // 切换信号源
  changeSign(url, id){
    this.sendMessage({
      "method_type":"proxyPushStream",
      "user_id": this._userId,
      "user_name": this._userName,
      "url": url,
      'terminal_id': id,
      "room_id": this._roomId,
      "video": 1,
      "audio": 1
    })
  }
  // 通知java推流
  requestForward(url, id){
    console.log('通知推流')
    this.sendMessage({
      "method_type":"proxyPushStream",
      "user_id": this._userId,
      "user_name": this._userName,
      "url": url,
      'terminal_id': id,
      "room_id": this._roomId,
      "video": 1,
      "audio": 1
    })
  }
  // 通知java退出推流
  requestExitForward(val){
    this.sendMessage({
      "method_type":"proxyExitPushStream",
      "user_id": this._userId,
      "room_id": this._roomId,
      "type": val
    })
  }
  /*请求连麦*/
  connectApply(){
    console.log(this.master_user,'rrrr')
    this.sendMessage({
      "method_type":"requestConnectMicrophone",
      "user_id": this._userId,
      "master_id": this.master_user.user_id,
      "room_id": this._roomId,
      "code": 0,
      'user_name': this._account
    })
  }
   /*主讲开任何人麦*/
   mainChangeApplys(id,type){
    if(type){
      this.sendMessage({
        "method_type": "notifyOwnMicrophone",
        "user_id" : id.toString(),
        "audio_state" : 2,
      })
    }else{
      this.sendMessage({
        "method_type":"forceOnMicrophone",
        "user_id": id.toString(),
        "room_id": this._roomId,
        'master_id': this._userId
      })
    }
  }
  /*主讲关任何人麦*/
  mainChangeApply(id,type){
    if(type){
      this.sendMessage({
        "method_type": "notifyOwnMicrophone",
        "user_id" : id.toString(),
        "audio_state" : 0,
      })
    }else{
      this.sendMessage({
        "method_type":"forceOffMicrophone",
        "user_id": id.toString(),
        "room_id": this._roomId,
        'master_id': this._userId
      })
    }
  }
  /*主讲允许副讲开麦*/
  mainChangeMicPhone(id){
    this.sendMessage({
      "method_type":"responseConnectMicrophone",
      "user_id": id,
      "code": 0,
      "reason": "1",
      "master_id": this.master_user.user_id,
      "room_id": this._roomId,
      "method": "responseConnectMicrophone"
    })
  }
  /*副讲允许主讲操作麦 0关闭 1开启*/ 
  assisChangeMicPhone(data, type){
    if(type == 0){
      this.sendMessage({
        "method_type":"responseForceOffMicrophone",
        "user_id": data.user_id,
        "master_id": data.master_id,
        "room_id": data.room_id,
        "code": 0,
        "reason": "1",
        "method":"forceOnMicrophone"
      })
    }else{
      this.sendMessage({
        "method_type":"responseForceOnMicrophone",
        "user_id": data.user_id,
        "master_id": data.master_id,
        "room_id": data.room_id,
        "code": 0,
        "reason": "1",
        "method":"forceOnMicrophone"
      })
    }
  }
  // 开始授课
  startTheme(type){
    this.sendMessage({
      "method_type":"startInteractionTheme",
      "id": parseInt(this._roomId),
      'type': type
    })
  }
  /*加入房间*/
  joinRoom(){
    let _this=this;
    if(_this._socket !== null){
      console.log('关闭上一个')
      _this.closeSocket()
    }
    const {_account,_password,_isLocal}=_this;
    let wsHost = process.env.NODE_ENV === "production" ? `${location.hostname}` : '192.168.164.59';
    let protocol = location.protocol === 'https:' 
      ? `wss://${wsHost}:8553/interaction`
      : `ws://${wsHost}:8553/interaction`;
    const socket = new WebSocket(protocol);
    /*连接成功*/
    socket.onopen = function() {
      const data = {
        method_type: 'connectServer',
        server_addr: process.env.NODE_ENV === "production" ? `${location.hostname}` : '192.168.164.59',
        server_port: '8553',
        user_name: _account,
        password: _password,
        enterprise_id: '13137761501',
        device: 'pc-web',
        source: _isLocal == 1 ? 1 : 0
      }
      _this.sendMessage(data)
    };
    /*断开连接时触发*/
    socket.onclose = function(e){
      // console.log('重连中')
      // setTimeout(() => {
      //   console.log('正在重连')
      //   _this.joinRoom();
      // }, 5000);
    };
    /*命名空间中间件错误时触发*/
    socket.onerror = function(err){
      console.log(err); // true
      console.log(err.message); // not authorized
      _this.close(err.message);
    };
    socket.onmessage = function(message) {
      var parsedMessage = JSON.parse(message.data);
      MyEvent.emit('message', parsedMessage)
      if(parsedMessage.method == ''){ //请求连麦
        
      }else{
        // let video = document.getElementsByTagName('video');
        // if(video){
        //   video = Array.prototype.slice.call(video);
        //   video.forEach(v => v.volume = session.get("sliderValue") || 0);
        // }
        switch (parsedMessage.method) {
          case 'connectServer': // 登录返回信息
            if(parsedMessage.code == 0) {
              _this._userId = parsedMessage.user_id
              _this._userName = parsedMessage.user_name;
              _this._userNickName = parsedMessage.user_nick_name
              _this.sendMessage({
                "method_type":"getRoomInfos",
              })
            }else{
              // _this.sendMessage({
              //   "method_type":"logoutConferenceRoom",
              //   "room_id":"57abda852acd491ea8f97af2c8009cd1"
              // })
            }
            break;
          case 'getRoomInfos': // 请求所有房间信息
            if(parsedMessage.code == 0) {
              let data = {};
              parsedMessage.room_list.forEach(el => {
                if(el.id == _this._id) {
                  data = el;
                }
              });
              _this.assistant_list = data.assistant_lists
              _this.master_user = {
                org_name: data.affiliated_unit,
                user_id: data.master_user_id,
                user_name: data.master_user_name
              }
              let isassis = data.assistant_lists.find(el => {
                return el.user_id == _this._userId
              })
              if(data.master_user_id == _this._userId){
                _this._userType = 1
              }else if(isassis){
                _this._userType = 0
              }else{
                _this._userType = 0
              }
              const { router_server, router_port, room_id } = data;
              _this._router_server = router_server;
              _this._router_port = router_port;
              _this._roomId = room_id;
              _this.sendMessage({
                "method_type":"getConferenceCurrentState",
                "room_id": _this._roomId
              })
            }
            break;
          case 'getConferenceCurrentState':
              _this.sendMessage({
                "method_type":"loginRoom",
                "room_id": _this._roomId,
                'type': 'conference',
                'is_master': _this._userType,
                "audio_state": _this._userType == 1 ? 2 : 0,
                'user_id': _this._userId,
                'user_name': _this._userName,
                'user_nick_name': _this._userNickName,
                "device": "pc-web",
                'source': _this._isLocal == 1 ? 1 : 0
              })
            break;
          case 'startInteractionTheme':
            // if(parsedMessage.code == 0){
            //   _this.sendMessage({
            //     "method_type":"loginRoom",
            //     "room_id": _this._roomId,
            //     'type': 'conference',
            //     'is_master': _this._userType,
            //     "audio_state": _this._userType == 1 ? 2 : 0,
            //     'user_id': _this._userId,
            //     'user_name': _this._userName,
            //     'user_nick_name': _this._userNickName,
            //     "device": "pc-web",
            //     'source': _this._isLocal == 1 ? 1 : 0
            //   })
            // }
            break;
          case 'heartConnect' : // 心跳
            _this.sendMessage({
              "method_type":"heartConnect",
              "type": 'pong',
            })
            break;
          case 'proxyPushStream': // 成功推流通知
            // setTimeout(() => {
            //   _this.sendMessage({
            //     "method_type":"requestForwardMessage",
            //     "method_private": "proxyExitPushStream",
            //     "user_id": _this._userId,
            //     "room_id": _this._roomId,
            //   })
            // }, 5000);
            break;
          case 'logoutConferenceRoom': // 退出房间
          
            break;
          
          default:
            // console.error('Unrecognized message', parsedMessage);
        }
      }
    }
    _this._socket = socket;
  }
  sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    this._socket.send(jsonMessage);
  }
}
export default RoomClient;
