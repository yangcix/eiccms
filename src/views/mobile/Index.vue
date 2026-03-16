<template>
	<div class="mobile-wrap">
		<router-view/>
	</div>
</template>

<script>
	import { Message } from 'element-ui';
	import {session, storage, kickUrl} from '@/assets/js/utils';
	import wsMixin from "@/components/wsMixin.vue";
	export default {
		mixins: [wsMixin],
		name: '',
		data() {
			return {
				websock: null,
				userInfo: {},
				loginType: "webMobile"
			}
		},
		components: {},
		mounted() {
			if (!storage.get("time")) storage.set("time", new Date().getTime())
			this.setMeta();
			this.$axios.get("/index/getUserInfo").then(res => {
				if (res.data) {
					this.userInfo = res.data;
					if (this.websock) this.websock.close(); // 关闭在建立 
					console.log("登录建立长连接");
					this.handleGetWebsocket(); // 需要登录建立长连接
				}
			});
		},
		methods: {
			toLogin() {
				this.$router.push("/mobile/login");
			},
			setMeta(){
				var meta = document.createElement('meta');
				meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0, user-scalable=0';
				meta.name = 'viewport';
				document.getElementsByTagName('head')[0].appendChild(meta);
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.mobile-wrap{
		width: 100%;
		max-width: 35em;
		height: 100%;
		margin: 0 auto;
	}
</style>
<style>
	.el-message{
		min-width: 0;
	}
</style>
