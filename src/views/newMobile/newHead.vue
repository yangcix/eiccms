<template>
	<div class="head-h">
		<header>
			<img :src="logoImg" alt="" @click="goTo('home')">
			<i class="iconfont iconsignin" @click="loginInfo"></i>
		</header>
	</div>
</template>

<script>
	import { Message } from 'element-ui';
	import {session, storage} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				logoImg: '',
				key: '输入关键字搜索'
			}
		},
		components: {},
		mounted() {
			if (!storage.get("time")) storage.set("time", new Date().getTime())
			if(this.$route.query.key){
				this.key = this.$route.query.key;
			}else{
				this.key = '输入关键字搜索';
			}
			this.getLogo();
		},
		methods: {
			//获取logo
			getLogo(){
				this.$axios.get('/index/systemInfo').then(res => {
					this.logoImg = res.data.mobileLogo;
					document.title = res.data.name ? res.data.name : '劢联科技';
					storage.set('version', res.data.version);
				});
			},
			goTo(path){
				this.$router.push({path: '/mobile/' + path, query: {key: this.$route.query.key}});
			},
			//判断是否登录
			loginInfo(){
				this.$axios.get('/index/getUserInfo').then(res => {
					if(res.data){
						if(this.$route.path != '/mobile/userinfo'){
							this.goTo('userinfo');
						}
					}else{
						this.$router.push({path: '/mobile/login', query: {redirect: this.$route.fullPath}});
					}
				});
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.head-h{
		height: pvh(90);
	}
	header{
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		width: 100%;
		max-width: 35em;
		margin: 0 auto;
		height: pvh(90);
		background: #fff;
		img{
			height: pvh(68);
			margin-left: pvh(24);
		}
		p{
			line-height: pvh(58);
			width: pvh(380);
			margin: 0 pvh(10);
			border: solid 1px #C3C3C3;
			border-radius: fs(29);
			font-size: fs(12);
			text-indent: pvh(31);
			background: #F2F2F2;
			color: #989898;
		}
		i{
			margin-right: pvh(24);
			font-size: fs(25);
			color: #C3C3C3;
		}
	}
</style>
