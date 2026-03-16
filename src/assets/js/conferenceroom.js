import kurentoUtils from './kurento-utils'  //本地引用便于扩展
// import kurentoUtils from 'kurento-utils'  // npm 包引入
import SlowlyDo from './SlowlyDo.js'
import {baseUrl, session} from "./utils";
import Event from "./event.js"
import store from "../../store/index"
import axios from 'axios'
import { off } from 'video.js';
export const MyEvent = new Event()
const role = window.localStorage.getItem('role')
var applyConnect
var participants = {};
var name;
var islocalMode;
var time = new Date().getTime();
var maxFrameRate;
var minFrameRate;
var iceservers={
	"iceServers":[
		// {
		// 	urls:"stun:129.28.159.115:3478"
		// 	// urls:"stun:222.76.253.9:3478"
		// },
		// {
		// 	// urls:["turn:222.76.253.9:3478"],
		// 	urls: ["turn:129.28.159.115:3478"],
		// 	username:"admin",
		// 	credential: "admin"
		// },
		{
			// urls:["turn:222.76.253.9:3478"],
			// urls: ["turn:47.112.213.162:3478"],
			urls: ["turn:110.80.40.206:3478"],
			username:"admin",
			credential: "admin"
		}
	]
}
function handleGetQueryString(name) { // 获取当前url参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
	var context = "";
	if (r != null) {
		context = r[2];
		reg = null;
		r = null;
		return context == null || context == "" || context == "undefined" ? "" : context;
	}
};
var websockUrl; // 跨校获取接口返回url
var ws;
var islocalModes;
var localNames;
var isBystanderIns;
var wsSuccess = 0 // websocket 连接状态 1成功
window.sysConnect = 4
window.numConnect = 0
window.systime = 4
var sysConnects = 3
var numConnects = 0
var sysConnects5 = 4
var numConnects5 = 0
console.log(process.env.NODE_ENV,location.hostname)
// let wsHost = process.env.NODE_ENV === "production" ? `${location.hostname}` : baseUrl.split('//')[1].split(':')[0];
// let wsHost = process.env.NODE_ENV === "production" ? `${location.hostname}` : '192.168.190.75:8443/';
// let wsHost = process.env.NODE_ENV === "production" ? `${location.hostname}` : '192.168.164.59:8443/';
let wsHost = process.env.NODE_ENV === "production" ? `${location.hostname}` : '192.168.164.59:8443/';
export async function connectWs(islocalMode,localName,isBystanderIn){   // islocalMode ：是否是本机  localName：校外本机采用的name值
	return new Promise( (resolve, reject) => {
	islocalModes = islocalMode
  localNames = localName
  isBystanderIns = isBystanderIn
	var querySearch; // websock参数
	websockUrl = session.get('websockUrl');
	
	if (websockUrl) { // 校外
		querySearch = islocalMode ? `?room=${handleGetQueryString('mainId')}&name=${localName}` : `?room=${handleGetQueryString('mainId')}&name=${time}`;
	} else {
		// 校内
		if(isBystanderIn){
			// 旁观者
			querySearch = `${location.search.replace('id', 'room').split('&isBystanderIn')[0]}&name=${time}`
		}else {
			// 主副讲
			querySearch = location.search.replace('room', 'name').replace('id', 'room')
		}
	}
	if(ws){
		console.log('正在关闭111111')
		ws.close()
	}
	console.log(islocalMode,localName)
	if (process.env.NODE_ENV === "production") { // 线上版本
		if (websockUrl) {
			wsHost = websockUrl;
		}
		// https /wss 协议兼容
		let protocol = location.protocol === 'https:' 
		? `wss://${wsHost}/netty/groupcall${querySearch}`
		: `ws://${wsHost}/netty/groupcall${querySearch}`;
		ws = new WebSocket(protocol);
	} else { //本地环境
		if (websockUrl) { // 是否跨校
			querySearch = islocalMode ? `?room=${handleGetQueryString('mainId')}&name=${localName}` : `?room=${handleGetQueryString('mainId')}&name=${time}`;
			wsHost = websockUrl;
			const tip = session.get('tIp');
			const icesObj = {
				urls: [`turn:${tip}:3478`],
				username:"admin",
				credential: "admin"
			};
			if (tip) iceservers.iceServers.push(icesObj);
		}
		// ws = new WebSocket('wss://' + wsHost + ':8443/groupcall' + querySearch);
		// https /wss 协议兼容
		let protocol = location.protocol === 'https:' 
		? `wss://${wsHost}/netty/groupcall${querySearch}`
		: `ws://${wsHost}/netty/groupcall${querySearch}`;
		ws = new WebSocket(protocol);
	}
	window.onbeforeunload = function() { // 离开刷新或关闭
		leaveRoom()
		console.log('正在关65555555555')
		ws.close();
	};
	ws.onerror = function(e){
		// leaveRoom()
		let timeOut = setTimeout(() => {
			console.log('websocket error', e);
			console.log('websocket重连中')
			store.commit('setVideoMsg', '网络不稳定，正在重新连接.....')
			have = true
			refreshs()
			reconnect()
		}, 2000);
		clearTimeout(timeOut)
	}
	ws.onclose = function(e){
		// leaveRoom()
		wsSuccess = 0
		console.log('websocket close', e);
		// location.reload()
	}
	ws.onopen = function(e) {
		wsSuccess = 1;
		resolve('200')
	}
	ws.onmessage = function(message) {
		sysConnects = 4
		var parsedMessage = JSON.parse(message.data);
		// console.log('webSocket连接成功！',parsedMessage)
		MyEvent.emit('message', parsedMessage)
		if(parsedMessage.type == 0){ //请求连麦
			if(typeof applyConnect == 'function'){
				applyConnect(parsedMessage);
			}
			return
		}else if(parsedMessage.type == -1){ //joinroom回调
			
		}else if(parsedMessage.type == 4){ //joinroom回调
			// const arr = parsedMessage.allMicrophoneStatus
			// const id = window.localStorage.getItem('assisId')
			// for(let key in arr) {
			// 	if(key == id) {
			// 		console.log('12',arr[key])
			// 		store.commit('setApplyMsg', arr[key])
			// 	}
			// }
		}else if(parsedMessage.type == 5){ //检测流地址
			have = true
			refreshs()
			reconnect()
			// if(sysConnects5 > 0) {
			// 	sysConnects5 --;
			// 	console.log(parsedMessage,'检测kms地址未获取')
			// 	connectWs(islocalMode,localName,isBystanderIn)
			// 	setTimeout(() => {
			// 		register(objBox.roomId, objBox.room, objBox.role, objBox.url, objBox.classroom, objBox.callback, objBox.schoolId, objBox.mode, objBox.cacheTime, objBox.maxBandwidth, objBox.minBandwidth, objBox.maxFrameRate, objBox.minFrameRate)
			// 	}, 1000);
			// } else {
			// 	store.commit('setVideoMsg', '重连超时，请手动刷新页面...')
			// }
		}else if(parsedMessage.type == 3){ //结束互动
			if(typeof applyConnect == 'function'){
				applyConnect(parsedMessage);
			}
			return
		}else if(parsedMessage.type == -99){ //心跳
			return
		}else{
			let video = document.getElementsByTagName('video');
			if(video){
				video = Array.prototype.slice.call(video);
				video.forEach(v => v.volume = session.get("sliderValue") || 0);
			}
			// console.log('Received message: have received---------', parsedMessage.id);
			switch (parsedMessage.id) {
				case 'existingParticipants':   // 已存在房间
				// console.log('已存在房间')
					onExistingParticipants(parsedMessage);
					break;
				case 'newParticipantArrived':  // 加入房间
				// console.log('加入房间')
					onNewParticipant(parsedMessage);
					// MyEvent.emit('message', onNewParticipant(parsedMessage))
					break;
				case 'participantLeft':  // 离开房间
					onParticipantLeft(parsedMessage);
					break;
				case 'receiveVideoAnswer':  //接收视频答复
				// console.log('接收视频答复',parsedMessage)
					receiveVideoResponse(parsedMessage);
					break;
				case 'iceCandidate':  //接收ICE候选人
				// console.log('接收ICE候选人')
				sysConnects5 = 4
					participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
						if (error) {
							console.error("Error adding candidate: " + error);
							return;
						}
					});
					break;
				default:
					console.error('Unrecognized message', parsedMessage);
			}
		}
		// if(isFlash && isFlash == 1) {
		// 	register(objBox.roomId, objBox.room, objBox.role, objBox.url, objBox.classroom, objBox.callback, objBox.schoolId, objBox.mode, objBox.cacheTime, objBox.maxBandwidth, objBox.minBandwidth, objBox.maxFrameRate, objBox.minFrameRate)
		// }
	}
})
}

function deleteKey(){
	axios.post('/sm/interactive/delRedisKey', {key: 'INTERACTIVE:CLASSROOM:LOGIN:' + name})
}

function onNewParticipant(request) {
	receiveVideo(request);
}

function receiveVideoResponse(result) {
	console.log(result,'resulllll',participants)
	participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
		if (error) return console.error (error);
	});
}
var objBox
var slowlyDo = new SlowlyDo({ delay: 200 }); // 添加至队列
let have = false
function onExistingParticipants(msg) {

	var constraints = {
		audio : true,
		video : {
			mandatory : {
				maxWidth : 1080,
				maxFrameRate : maxFrameRate? maxFrameRate : 60,
				minFrameRate : minFrameRate? maxFrameRate : 30
			}
		}
	};
	// debugger;
	var participant = new Participant(name);
	participants[name] = participant;
	
	var video = participant.getVideoElement();
	let sliderValue = session.get("sliderValue");
	if(sliderValue) {
		video.volume = sliderValue
	}
	
	if(islocalMode){
		var options = {
			localVideo: video,
			mediaConstraints: constraints,
			onicecandidate: participant.onIceCandidate.bind(participant)
		}
	}else{
		var options = {
			configuration: iceservers,
			remoteVideo: video,
			// localVideo: video,
			mediaConstraints: constraints,
			onicecandidate: participant.onIceCandidate.bind(participant),
		}
	}
	
	// 本机
	if(islocalMode){
		participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, // 获取本地摄像头方法
			function (error) {
				if(error) {
					return console.error(error);
				}
				this.generateOffer (participant.offerToReceiveVideo.bind(participant));
			});
	}else {
		// debugger
		  participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, // 线上摄像头
				function (error) {
					if(error) {
						if (error.message === 'refalsh') {
							store.commit('setVideoMsg', '网络不稳定，正在重新连接...')
							return
						}else if(error.message == 'cutoff') {
							store.commit('setVideoMsg', '网络不稳定，正在重新连接...')
							have = true
							refreshs()
							reconnect()
							return
						} else {
							return console.error(error);
						}
					}
					this.peerConnection.addEventListener('connectionstatechange', (event) => {
						let sliderValue = session.get("sliderValue");
						console.log(sliderValue,'sliderValuessssssssssssssssssss')
						if(this.peerConnection.connectionState == 'connected' && sliderValue){
							console.log(document.getElementsByTagName('video'),'99999')
							let video = document.getElementsByTagName('video');
							video = Array.prototype.slice.call(video);
							video.forEach(v => {
								v.volume = sliderValue;
							});
						}
						if(this.peerConnection.connectionState=='failed'){
							// if(have||ws.readyState==2) return
							have = true
							restrl()
						}
						if(this.peerConnection.connectionState === 'disconnected') {
							if(role != 2) {
								store.commit('setVideoMsg', '网络不稳定，正在重新连接...')
							}
							console.log('出错了，正在重连')
							have = true
							// restrl()
							refreshs()
							reconnect()
						}
					})
					this.generateOffer(participant.offerToReceiveVideo.bind(participant));
				});
	}
	
	// msg.data.forEach(receiveVideo);
	msg.dataObj.forEach((item) => { // 接手修改队列方式发送请求 修复同步发起问题
		slowlyDo.push(receiveVideo, item)
	})
}

function refreshs() {
	// ws.close();
	for ( var key in participants) {
		participants[key].dispose();
	}
	have = false
}
	function reconnect() {
		console.log('重连中',window.sysConnect)
		if(window.sysConnect > 0){
			window.sysConnect --;
			window.numConnect ++;
			console.log("第"+window.numConnect+"次重连");
			connectWs(islocalModes,localNames,isBystanderIns).then(res => {
				console.log(res,'999888')
				if(res == 200){
					setTimeout(() => {
						console.log('registerrrrr')
							register(objBox.roomId, objBox.room, objBox.role, objBox.url, objBox.classroom, objBox.callback, objBox.schoolId, objBox.mode, objBox.cacheTime, objBox.maxBandwidth, objBox.minBandwidth, objBox.maxFrameRate, objBox.minFrameRate)
						}, 3000);
				}
			}).catch(res => {
				setTimeout(() => {
					console.log('registeeeee')
						register(objBox.roomId, objBox.room, objBox.role, objBox.url, objBox.classroom, objBox.callback, objBox.schoolId, objBox.mode, objBox.cacheTime, objBox.maxBandwidth, objBox.minBandwidth, objBox.maxFrameRate, objBox.minFrameRate)
					}, 3000);
			})
			// 进行重连
			// setTimeout(() => {
			// 	register(objBox.roomId, objBox.room, objBox.role, objBox.url, objBox.classroom, objBox.callback, objBox.schoolId, objBox.mode, objBox.cacheTime, objBox.maxBandwidth, objBox.minBandwidth, objBox.maxFrameRate, objBox.minFrameRate)
			// }, 4000);
		}else{
			console.log('重连超时了了')
			store.commit('setVideoMsg', '重连超时，请手动刷新页面...')
			ws.close()
		}
}

function restrl(){
	leaveRoom()
	MyEvent.emit('restrl')
	have = false
}

function receiveVideo(sender) {
	console.log('执行receiveVideo',sender);
	let senderId = parseInt(sender.classroomId)
	setTimeout(function () {
		var participant = new Participant(senderId);
		participants[senderId] = participant;
		var video = participant.getVideoElement();
		let sliderValue = session.get("sliderValue");
		if(sliderValue >= 0) {
			video.volume = sliderValue
		}
		var constraints = {
			audio : true,	
			video : {
				mandatory : {
					maxWidth : 1080,
					maxFrameRate : sender.maxFrameRate ? sender.maxFrameRate : 60,
					minFrameRate : sender.minFrameRate ? sender.minFrameRate : 30
				}
			}
		};
		var options = {
			configuration: iceservers,
			remoteVideo: video,
			mediaConstraints: constraints,
			onicecandidate: participant.onIceCandidate.bind(participant)
		}
		
		participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function (error) {
			if(error) {
				return console.error(error);
			}
			this.generateOffer (participant.offerToReceiveVideo.bind(participant));
		});
	}, 5)
}

function onParticipantLeft(request) {
	var participant = participants[request.name];
	// console.log(participants,'77777')
	if(participant){
		// console.log('5656',participant)
		participant.dispose();
		delete participants[request.name];
	}
}
var data
export function sendMessage(message) {
	var jsonMessage = JSON.stringify(message);
	// console.log('logsend',message)
	// if(message.type == 'joinRoom') {
	// 	data = jsonMessage
	// }
	// console.log('logsend',message)
	// console.log(wsSuccess,'wsssssssss',data)
	// if(wsSuccess == 0) {
	// 	clearTimeout()
	// 	connectWs(islocalModes,localNames,isBystanderIns)
	// 	setTimeout(() => {
	// 		console.log(wsSuccess,'3333333333')
	// 		register(objBox.roomId, objBox.room, objBox.role, objBox.url, objBox.classroom, objBox.callback, objBox.schoolId, objBox.mode, objBox.cacheTime, objBox.maxBandwidth, objBox.minBandwidth, objBox.maxFrameRate, objBox.minFrameRate)
	// 	}, 1000);
	// } else {
	// 	ws.send(jsonMessage);
	// }
	ws.send(jsonMessage);
}

//进入房间
export function register(roomId, room, role, url, classroom, callback, schoolId, mode, cacheTime, maxBandwidth, minBandwidth, maxFrameRate, minFrameRate) { // roomId=教室id
	objBox = {
		roomId, room, role, url, classroom, callback, schoolId, mode, cacheTime, maxBandwidth, minBandwidth, maxFrameRate, minFrameRate
	}
	name = session.get("websockUrl") ? time : roomId; // 如果是校外name = 当前时间戳
	name = role == 2  ? time : parseInt(name); // 如果是校内旁观者 = 当前时间戳
	mode ? name = roomId : name = name; // 如果是本机那就用roomid
	islocalMode = mode;
	applyConnect = callback;
	maxFrameRate = maxFrameRate;
	minFrameRate = minFrameRate;
	var message = {
		type : 'joinRoom',
		name: name,
		classroomName: classroom, // 教室名称
		room : room,  //  主题id
		role : role, // 角色（主讲1 || 副讲0 || 旁观2）
		mode: mode ? mode : session.get("websockUrl") ? 2 : 0, // mode 校外统一=2  本机1
		url: url,  // 校内本机不需要
		schoolId: schoolId,  // 校内不需要
		realName: `${schoolId}-${roomId}`,  // 校内不需要
		cacheTime: role == 2 ? null : cacheTime, // 缓存时间
		maxBandwidth: role == 2 ? null : maxBandwidth, // 最大码率
		minBandwidth: role == 2 ? null : minBandwidth, // 最小码率
		maxFrameRate: role == 2 ? null : maxFrameRate, // 最大帧率
		minFrameRate: role == 2 ? null : minFrameRate, // 最小帧率
	}
	if(websockUrl){
		window.localStorage.setItem('realName', (`${'video-'+ schoolId}-${roomId}`))
	}else{
		window.localStorage.setItem('realName', (`${'video-'+ name}`))
	}
	sendMessage(message);
}
//离开房间
export function leaveRoom() {
	sendMessage({
		type : 'leaveRoom'
	});
	for ( var key in participants) {
		participants[key].dispose();
	}
	ws.close();
	console.log('离开房间')
}
export function haveWs() {
	return ws;
}
function Participant(name) {
	this.name = name;
	var video = document.createElement('video');
	video.id = 'video-' + name;
	video.autoplay = true;
	video.controls = false;
	video.setAttribute('width', '100%');
	video.setAttribute('height', '100%');
	video.style.position = 'relative';
	video.style.zIndex = 'relative';
	var timer = setInterval(function () {
		// console.log('未发现dom，1秒后重试')
		var el = document.getElementById('wrap' + name)
		if (el) {
			// console.log(el, 'el');
			// console.log(name, 'name');
			clearInterval(timer)
			el.appendChild(video)
		}
	}, 1000)
	// document.getElementById('wrap' + name).appendChild(video);
	this.getVideoElement = function() {
		return video;
	}
	
	this.offerToReceiveVideo = function(error, offerSdp, wp){
		if (error) return console.error ("sdp offer error",error)
		var msg =  {
			type : "receiveVideoFrom",
			sender : name,
			sdpOffer : offerSdp
		};
		sendMessage(msg);
	}
	
	
	this.onIceCandidate = function (candidate, wp) {
		let isLocal = candidate.candidate.indexOf('.local');
		if (isLocal != -1) { // 过滤不发送
			console.error('sendCandidate islocal', candidate.isLocal);
			return;
		}
		var message = {
			type: 'onIceCandidate',
			candidate: candidate,
			name: name
		};
		// console.log(message)
		console.log('onIceCandidate send----------------------------');
		sendMessage(message);
	}
	
	Object.defineProperty(this, 'rtcPeer', { writable: true});
	
	this.dispose = function() {
		this.rtcPeer.dispose();
		if(video.parentNode) video.parentNode.removeChild(video);
		
	};
}
