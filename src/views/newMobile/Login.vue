<template>
	<div class="login-wrap">
		<p class="welcome-title">欢迎登录</p>
		<p class="operate-notice">您好，请在下方输入账户与登录密码进行登录</p>
		<div class="login-box">
			<div class="item">
				<i class="iconfont icon-yonghu"></i>
				<input type="text" placeholder="请输入账户" v-model.trim="account">
			</div>
			
			<div class="item">
				<i class="iconfont icon-mima"></i>
				<input type="password" placeholder="请输入登录密码" v-model.trim="password">
			</div>
			<el-checkbox v-model="remember" class="auto">自动登录</el-checkbox>
			<fieldset class="forget-pwd">
			<legend @click="forgetShow">忘记密码?</legend>
		</fieldset>
			<p class="login-btn" @click="login">登录</p>
		</div>
	</div>
</template>

<script>
	import MD5 from 'js-md5';
	import { Message } from 'element-ui';
	import {session, storage, kickUrl} from '@/assets/js/utils';
	import wsMixin from "@/components/wsMixin.vue";
	export default {
		mixins: [wsMixin],
		name: '',
		data() {
			return {
				account: '',
				password: '',
				remember: false,
				websock: null,
				userInfo: {},
				loginType: "webMobile"
			}
		},
		components: {},
		mounted() {
			this.$store.dispatch('commitChatLogin',localStorage.getItem('chatLogin'))
		},
		methods: {
			toLogin() {
				this.$router.push("/mobile/login");
			},
			forgetShow(){
				this.$message('请联系管理员修改', 'success');
			},
			//登录
			login(){
				this.errInfo = '';
				if(this.$verify.isEmpty(this.account)){
					this.$message('账号不能为空', 'error');
				}else if(this.$verify.isEmpty(this.password)){
					this.$message('密码不能为空', 'error');
				}else{
					this.$axios.post('/auth/login', {
						account: this.account,
						password: MD5(this.password),
						remember: this.remember,
						loginType: "webMobile",
						type: 0
					}).then(res => {
						if(res.code == 200){
							this.$message('登录成功', 'success');
							this.userInfo = res.data;
							window.localStorage.setItem('isAdmin', res.data.adminOrSuper)
							res.data.password = MD5(this.password);
							this.account = '';
							this.password = '';
							localStorage.setItem('chatLogin',JSON.stringify(this.userInfo))
							window.localStorage.setItem('userInfo', JSON.stringify(res.data));
							this.$store.dispatch('commitChatLogin',localStorage.getItem('chatLogin'))
							this.handleGetWebsocket();
							// this.$router.replace(this.$route.query.redirect);
							// this.$router.replace("/mobile/home");
							this.$router.go(-1);
						}
					});
				};
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.login-wrap{
		overflow: hidden;
		width: 100%;
		height: 100%;
		background: #fff;
	}
	.welcome-title{
		margin: pvw(112) 0 0 6%;
		font-size: fs(21);
		color: #232323;
	}
	.operate-notice{
		margin:pvw(24) 0 0 6%;
		font-size: fs(12);
		color: #989898;
	}
	.login-box{
		width: 88%;
		margin: pvw(98) 0 0 6%;
		.auto{
			margin-left: pvw(27);
			font-size: fs(11);
		}
		.item{
			height: pvw(68);
			margin-bottom: pvw(30);
			border-bottom: solid 1px #F2F2F2;
			i{
				margin: 0 pvw(27);
				font-size: fs(18);
				line-height: pvw(68);
				color: #989898;
			}
			input{
				height: 90%;
				width: 80%;
				text-indent: pvw(20);
				font-size: fs(14);
				outline: none;
			}
		}
		.login-btn{
			width: 100%;
			margin-top: pvw(40);
			border-radius: pvw(40);
			line-height: pvw(78);
			text-align: center;
			font-size: fs(14);
			background: #409EFF;
			color: #fff;
		}
	}
	.forget-pwd{
		margin-top: pvw(40);
		// position: absolute;
		bottom: pvw(58);
		// width: 88%;
		left: 6%;
		border: 0;
		border-top: solid 1px #F2F2F2;
		text-align: center;
		font-size: fs(14);
		color: #989898;
		legend{
			padding: 0 pvw(18);
		}
	}
</style>
