<script>
	import { Message } from 'element-ui';
	import {session, storage, kickUrl} from '@/assets/js/utils';
	export default {
		data() {
			return {
				websock: null,
				timer: null,
				youke:''
			}
		},
		methods: {
			// base64转字符串
			decode(base64){
			// 对base64转编码
			var decode = atob(base64);
			// 编码转字符串
			var str = decodeURI(decode);
			return str;
			},
			chatWebsocket() {
				if(this.websock) {
					return;
				}
				this.youke =`youke${new Date().getTime()}`
				// https /wss 协议兼容
				// 接口地址
				const wsUrl = location.protocol === 'https:' 
				? `wss://${kickUrl}/userLogin?
						account=${this.youke}&
						loginType=web&
						mark=${new Date().getTime()}`
				: `ws://${kickUrl}/userLogin?
						account=${this.youke}&
						loginType=web&
						mark=${new Date().getTime()}`;
				this.websock = new WebSocket(wsUrl);
				this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
				this.websock.onclose = this.websocketclose;
			},
			websocketonopen() { // 连接建立之后执行send方法发送数据
			// console.log(this.userInfo)
			let initData = {
						type:'liveChat',
						themeInfo :{
							type: 1, // 1 进入直播  2 发送消息 3 禁言 4 取消禁言
							speaker: 0, // 1是  0否 主讲 
							themeId: this.$route.query.themeid, //主题id
							interactiveStatus: this.interactiveStatus,  // 互动讨论是否开启 1开启 0关闭
							roleType: 0, //角色类型 1 教师 0 学生  2教师
							userName: this.youke, //名字
							message: '',
							createAccount: this.createAccount,
							account: '' // 账号
					}
				}
			if(this.userInfo){
				initData.themeInfo.roleType = this.userInfo.roleType; //角色类型 1 教师 0 学生  2教师
				initData.themeInfo.userName = this.userInfo.nickName || this.youke;  //名字
				initData.themeInfo.account = this.userInfo.account || '' // 账号
			}
				this.websock.send(JSON.stringify(initData))
				if(this.userInfo && this.userInfo.account) {
					let accountData = {
							type: "login",
							account: this.userInfo.account,
							loginType: "web",
							mark:storage.get('time')
					}
					this.websock.send(JSON.stringify(accountData))
				}
				
				clearInterval(this.timer); // 建立之后关闭定时器
			},
			websocketonerror() { // 连接建立失败重连
				clearInterval(this.timer);
				this.timer = setInterval(() => {
						this.chatWebsocket();
				}, 60000);
			},
			websocketonmessage(e) {
				const resdata = JSON.parse(e.data);
				if(resdata.type === 'liveChat'){

						if(resdata.themeInfo.type == 2){
							resdata.themeInfo.message = this.decode(resdata.themeInfo.message)
						
							if(this.userInfo && resdata.themeInfo.account !=  this.userInfo.account) {
								this.selfSend = false;
							}
							this.inList.push(resdata.themeInfo)
							if(this.scrollIsBottom == false) {
								this.toNew = true
								this.num++
							}else {
								this.num = 0;
								this.toNew = false
							}
						}

						if(resdata.themeInfo.type == 3){
							// 禁言
							this.forbidden = true
						}

						if(resdata.themeInfo.type == 4){
							// 不禁言
							this.forbidden = false
						}
					}
				
			},
      websocketsend(Data) { // 数据发送
				this.websock.send(Data);
			},
			websocketclose(e) { // 关闭 || 断开连接
				console.log('断开连接',e);
				clearInterval(this.timer);
        this.timer = setInterval(() => {
					this.chatWebsocket();
				}, 60000);
			},
		}
	}
</script>