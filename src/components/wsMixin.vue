<script>
	import { Message } from 'element-ui';
	import {session, storage, kickUrl} from '@/assets/js/utils';
	import {leaveRoom, haveWs} from "../assets/js/conferenceroom";
	import { mapState, mapMutations, mapActions } from "vuex";
	export default {
		data() {
			return {
				websock: null,
				userInfo: {},
				timer: null
			}
		},
		created() {
			const { loginType, toLogin, outLogin } = this;
			if (!loginType) console.log('loginType 未定义');
      if (!(toLogin instanceof Function)) console.log('toLogin 方法未定义');
		},
		computed: {
			...mapState({
				interactUploadTable: "interactUploadTable",
			}),
		},
		methods: {
			...mapActions({
				commitInteractUploadTable: "commitInteractUploadTable",
				commitInteracUploadBoxVisible: "commitInteracUploadBoxVisible",
			}),
			handleGetWebsocket() {
				// console.log('3333',this.websock )
        if (!this.userInfo || this.userInfo.account == null || this.websock !== null) return; 
				// https /wss 协议兼容
				// 接口地址
				const wsUrl = location.protocol === 'https:' 
				? `wss://${kickUrl}/userLogin?
					account=${this.userInfo.account}&
					loginType=${this.loginType}&
					mark=${this.$route.query.time ? this.$route.query.time : storage.get('time')}
				`
				: `ws://${kickUrl}/userLogin?
					account=${this.userInfo.account}&
					loginType=${this.loginType}&
					mark=${this.$route.query.time ? this.$route.query.time : storage.get('time')}
				`;
				this.websock = new WebSocket(wsUrl);
				this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
				this.websock.onclose = this.websocketclose;
			},
			websocketonopen() { // 连接建立之后执行send方法发送数据
				clearInterval(this.timer); // 建立之后关闭定时器
			},
			websocketonerror() { // 连接建立失败重连
			  console.log('close')
				clearInterval(this.timer);
				this.timer = setInterval(() => {
						this.handleGetWebsocket();
				}, 60000);
			},
				websocketonmessage(e) {
				const redata = JSON.parse(e.data);
				if (redata.type === -10001) { // 10001该账号已在其他设备登录 + 账号禁用 + token失效,
					Message.closeAll();
					console.log(33333,this.$route.path)
					this.$message(redata.message, 'error');
					window.localStorage.removeItem('userInfo');
					window.sessionStorage.removeItem('interactData')
					// this.userInfo = null;
					// this.toLogin();
					if(this.$route.path == '/mainroom' || this.$route.path == '/assistantroom' || this.$route.path == '/normalmainroom' || this.$route.path == '/normalassistantroom'){
						console.log('ffgg')
						this.$router.push('/home')
					}else{
						setTimeout(() => {
							location.reload()
						}, 800);
					}
					// setTimeout(() => {
					// 	location.reload()
					// }, 800);
				}
				if (redata.type === -10002) { // 10002:手动退出登录
					// this.userInfo = null;
					// this.loginShow = true; // InteractLogin互动登录弹窗
					window.localStorage.removeItem('userInfo');
					this.toLogin();
					setTimeout(() => {
						location.reload()
					}, 800);
				}
				if (redata.type === 1) { // 互动开始授课提醒
					if(redata.startTime){
						let index = this.interactUploadTable.length;
						this.commitInteractUploadTable({
							type: "push",
							index: index,
							item: {
								id: redata.id,
								name: redata.name,
								time: redata.startTime,
								type: 1
							},
						});
						this.commitInteracUploadBoxVisible(true);
					}else{
						this.commitInteractUploadTable({
							type: "splice",
							index: redata.id,
						});
					}
				}
				if (redata.type === 2) { // 常态化互动开始授课提醒
					if(redata.startTime){
						let index = this.interactUploadTable.length;
						this.commitInteractUploadTable({
							type: "push",
							index: index,
							item: {
								id: redata.id,
								name: redata.name,
								time: redata.startTime,
								type: 2,
								themeId: redata.themeId
							},
						});
						this.commitInteracUploadBoxVisible(true);
					}else{
						this.commitInteractUploadTable({
							type: "splice",
							index: redata.id,
						});
					}
				}
				if (redata.type === 3) { // 常态化互动开始授课提醒
					this.commitInteractUploadTable({
						type: "splice",
						index: redata.id,
					});
				}
			},
      websocketsend(Data) { // 数据发送
				this.websock.send(Data);
			},
			websocketclose(e) { // 关闭 || 断开连接
				console.log('断开连接',e);
				clearInterval(this.timer);
        this.timer = setInterval(() => {
					this.handleGetWebsocket();
				}, 60000);
			},
		}
	}
</script>
