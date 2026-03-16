<template>
	<div class="">
		<header>
			<div @click="goHome">
				<img :src="logoImg" alt="">
				<span>{{systemName}}</span>
			</div>
			<p class="menu">
				<span @click="goHome">首页</span>
				<span @click="goHelpHome">帮助中心</span>
			</p>
		</header>
		<div class="login-wrap">
			<div class="bg-wrap">
				<img :src="loginImg" alt="">
			</div>
			<div class="login-content">
				<p class="title">账号登录</p>
				<p><input type="text" placeholder="账号" @keyup.enter="login" v-model.trim="account"></p>
				<p><input type="password" placeholder="密码" @keyup.enter="login" v-model="password" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></p>
				<p class="remember"><el-checkbox v-model="remember">自动登录</el-checkbox></p>
				<button v-preventReClick="1000"  @click="login">登录</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { Message } from 'element-ui';
	import MD5 from 'js-md5';
	import {session} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				account: '',
				password: '',
				logoImg: '',
				loginImg: '',
				systemName: '',
				remember: false
			}
		},
		components: {},
		mounted() {
			session.set('systemMenuList', '');
			this.getLogo();
		},
		methods: {
			//获取登录底图
			getLogo(){
				this.$axios.get('/index/systemInfo').then(res => {
					this.loginImg = res.data.loginImg;
					this.logoImg = res.data.pcLogo;
					this.systemName = res.data.name;
					document.title = res.data.name ? res.data.name : '劢联科技';
					session.set('userInfo', res.data);
					localStorage.setItem('version',res.data.version)
				});
			},
			login(){
				Message.closeAll();
				if(this.$verify.isEmpty(this.account)){
					this.$message('账号不能为空', 'error');
				}else if(this.$verify.isEmpty(this.password)){
					this.$message('密码不能为空', 'error');
				}else{
					this.$axios.post('/auth/login', {
						account: this.account,
						password: MD5(this.password),
						remember: this.remember,
						loginType: "web",
						type: 1
					}).then(res => {
						if(res.code == 200){
							if(res.data.status == 0){
								this.$router.replace('/expire')
							}
							else {
								if(res.data.systemPermission){
								this.$router.replace('/sys/home');
								this.$message('登录成功', 'success');
								res.data.password = MD5(this.password);
								window.localStorage.setItem('isAdmin', res.data.adminOrSuper);
								window.localStorage.setItem('userInfo', JSON.stringify(res.data));
								}
								else{
								this.$message('该账号暂无权限进入后台，请联系管理员', 'error');
								}
							}
						}
					});
				};
			},
			//logo跳转首页
			goHome(){
				let routeUrl = this.$router.resolve({
					path: "/home"
				});
				window.open(routeUrl.href, '_blank');
			},
			goHelpHome() {
				let routeUrl = this.$router.resolve({
					path: "/helpHome"
				});
				window.open(routeUrl.href, '_blank');
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding: 0 130px;
		background: #409EFF;
		font-size: 19px;
		color: #fff;
		cursor: pointer;
		img{
			height: 30px;
			margin-right: 16px;
			vertical-align: middle;
		}
		.menu{
			cursor: pointer;
			font-size: 14px;
			span{
				margin: 0 15px;
			}
		}
	}
	.login-wrap{
		display: flex;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
		margin-top: 83px;
		.bg-wrap{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 44%;
			height: 577px;
			background: #409EFF;
			img{
				width: 100%;
				max-height: 100%;
			}
		}
		.login-content{
			width: 30%;
			margin-left: 70px;
			background: #fff;
			text-align: center;
			.title{
				margin: 96px 0 90px 0;
				font-size: 36px;
				color: #1E1E1E;
			}
			input{
				width: 71%;
				height: 24px;
				margin-top: 35px;
				border-bottom: solid 1px #409EFF;
				outline: none;
				font-size: 14px;
			}
			button{
				width: 71%;
				height: 42px;
				margin-top: 90px;
				border: 0;
				border-radius: 4px;
				background: #409EFF;
				color: #fff;
			}
			.remember{
				width: 71%;
				margin: 20px 0 0 14.5%;
				text-align: left;
			}
		}
	}
</style>
