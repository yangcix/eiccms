<template>
	<div class="">
		<Head></Head>
		<ul class="info-list">
			<li>
				<span>账号</span>
				<span>{{userInfo.account}}</span>
			</li>
			<li>
				<span>姓名</span>
				<span>{{userInfo.nickName}}</span>
			</li>
			<li>
				<span>身份</span>
				<span>{{userInfo.roleType | roleType}}</span>
			</li>
		</ul>
		<p class="log-out" @click="logOut">退出登录</p>
	</div>
</template>

<script>
	import Head from './Head';
	import wsMixin from "@/components/wsMixin.vue";
	// import { initWebSocket } from '@/assets/js/socket';
	export default {
		mixins: [wsMixin],
		name: '',
		data() {
			return {
				userInfo: '',
				websock: null,
				loginType: "webMobile"
				// websock: null
			}
		},
		components: {Head},
		mounted() {
			this.loginInfo();
		},
		methods: {
			toLogin() {
				this.$router.replace('/mobile/home');
			},
			loginInfo(){
				this.$axios.get('/index/getUserInfo').then(res => {
					this.userInfo = res.data;
					if (this.userInfo) {
						if (this.websock) this.websock.close();
						this.handleGetWebsocket(); 
					}
				});
			},
			//退出登录
			logOut(){
				this.$axios.get('/auth/signOut').then(res => {
					if(res.code == 200){
						// this.$router.replace('/mobile/home');
						this.$message('退出成功', 'success');
						localStorage.setItem('chatLogin',false)
						this.$store.dispatch('commitChatLogin',localStorage.getItem('chatLogin'))
						const params = {
							type: "logout",
							account: this.userInfo.account,
							loginType: "webMobile",
						};
						console.log(params,'tuichudengle');
						this.websocketsend(JSON.stringify(params));
						// const params = {
						// 	type: "logout",
						// 	account: this.userInfo.account,
						// 	loginType: "web",
						// };
						// this.websocketsend(JSON.stringify(params));
					}
				})
			},
			// websocketsend(Data) { // 数据发送
			// 	this.websock.send(Data);
			// }
		},
		filters: {
			roleType(index){
				//0学生 1教师 2管理员
				let arr = ['学生', '教师', '管理员'];
				return arr[index];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.info-list{
		margin-top: pvh(30);
		box-sizing: border-box;
		padding: 0 pvh(45);
		background: #fff;
		li{
			border-bottom: solid 1px #F2F2F2;
			line-height: pvh(68);
			font-size: fs(14);
			color: #303133;
			span:last-child{
				margin-left: pvh(58);
				font-size: fs(13);
				color: #989898;
			}
		}
	}
	.log-out{
		// width: pvh(660);
		height: pvh(78);
		margin: pvh(40) auto;
		border-radius: pvh(39);
		font-size: fs(14);
		text-align: center;
		line-height: pvh(78);
		color: #fff;
		background: #409EFF;
	}
</style>
