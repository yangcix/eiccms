<script>
	import { Message } from 'element-ui';
	export default {
		data() {
			return {
				ws:null,
				lockReconnect:false, // 避免重复连接
				timer: null, // 定时器
				wsUrl:'wss://123.207.136.134:9010/ajaxchattest' // 接口地址
			}
		},
		created() {
			// https /wss 协议兼容
			this.wsUrl = location.protocol === 'https:' 
			? 'wss://123.207.136.134:9010/ajaxchattest'
			: 'ws://123.207.136.134:9010/ajaxchattest';
		},
		destroyed() {
			this.ws.close() // 离开页面关闭
		},
		methods: {
			// 通过createWebSocket创建连接
			createWebSocket() {
				try {
					this.ws = new WebSocket(this.wsUrl);
					this.ws.onopen = this.wsOnopen;
					this.ws.onmessage = this.wsOnmessage;
					this.ws.onerror = this.wsOnerror;
					this.ws.onclose = this.wsOnclose;
				} catch(e) {
					console.log(e);
					reconnect(this.wsUrl);
				}
			},
			// 2.2 创建init方法，初始化一些监听事件，如果希望websocket连接一直保持, 我们会在close或者error上绑定重新连接方法。
			wsOnopen() {
				clearInterval(this.timer); // 建立后清除定时器
				//心跳检测重置
				this.heartCheck().start();
				setTimeout(() => {
					this.ws.send('wwwwwww')
				},10000)
			},

			wsOnmessage() {
				// console.log(event);
				//拿到任何消息都说明当前连接是正常的
				if(event.data.slice(0,7) === 'wwwwwww'){
					this.getThemeList()
					// console.log(this.ws.readyState)
					// this.ws.close()
					// console.log(this.ws.readyState)
					// setTimeout(() => {
					// 	console.log(this.ws.readyState)
					// },10000)
				}
				this.heartCheck().start();
			},

			wsOnclose() {
				console.log('链接关闭-正在重连');
		
					// this.reconnect(this.wsUrl); 

			},

			wsOnerror() {
				console.log('发生异常了-正在重连');
				this.reconnect(this.wsUrl);
			},
			// 2.3 重连操作，通过设置lockReconnect变量避免重复连接
			reconnect(url) {
				//没连接上会一直重连，设置延迟避免请求过多
				// var tt = setTimeout(()=> {
				// 	this.createWebSocket(url);
				// 	this.lockReconnect = false;
				// }, 4000);
				clearInterval(this.timer);
				this.timer = setInterval(() => {
						this.createWebSocket(url);
				}, 30000);
			},

			// 心跳检测
			heartCheck (){
				let vm = this
				return {
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
											vm.ws.send("123456789"); // 心跳包
											_num--;
											//计算答复的超时次数
											if(_num === 0) {
													vm.ws.close();
											}
								}, this.timeout)
							}
					}
			}
	}
}
</script>
