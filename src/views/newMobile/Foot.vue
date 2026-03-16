<template>
	<div class="foot-wrap">
		<van-tabs v-model="active" @click="goTo">
			<van-tab
				v-for="(item, index) in navList"
				:key="index"
				:name="item.name"
				:title="item.title"
			>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
	export default {
		name: '',
		props: {
			'index': {
				type: Number, // 这里你接收的值是什么类型就写什么类型
      	default: 0
			}
		},
		data() {
			return {
				nationalPlatformUrl: localStorage.getItem('NPU') ? localStorage.getItem('NPU') : '',
				active: 0,
				navList: [
					{
						name: 0,
						title: '首页'
					},
					{
						name: 1,
						title: '名师课堂'
					},
					// {
					// 	name: 2,
					// 	title: '实时研修'
					// },
					// {
					// 	name: 3,
					// 	title: '专递课堂'
					// },
					{
						name: 4,
						title: '优质资源'
					},
					{
						name: 5,
						title: '课后服务'
					},
					{
						name: 6,
						title: '停课不停学'
					},
				]
			}
		},
		components: {},
		mounted() {
			if(localStorage.getItem('isNPU') === 'true') {
				this.navList = [
					{
						name: 0,
						title: '首页'
					},
					{
						name: 1,
						title: '名师课堂'
					},
					// {
					// 	name: 2,
					// 	title: '实时研修'
					// },
					{
						name: 4,
						title: '优质资源'
					},
					{
						name: 5,
						title: '课后服务'
					},
					{
						name: 6,
						title: '停课不停学'
					},
					{
						name: 7,
						title: '国家平台',
					}
				]
			}
			this.getSysInfo();
			this.active = this.index;
		},
		methods: {
			getSysInfo() {
				this.$axios.get('/index/systemInfo').then(res => {
					if(res.data.nationalPlatformUrl) {
						this.nationalPlatformUrl = res.data.nationalPlatformUrl;
					}
				})
			},
			goTo(name, title){
				this.active = name;
				console.log('name',name)
				if(name == 0) {
					this.$router.push('/mobile/home');
				}else if(name == 1) {
					this.$router.push('/mobile/teacherclass');
				}else if(name == 2) {
					this.$router.push('/mobile/training');
				}else if(name == 3) {
					this.$router.push('/mobile/courierClass');
				}else if(name == 4) {
					this.$router.push('/mobile/resources');
				}else if(name == 5) {
					this.$router.push('/mobile/afterClass');
				}else if(name == 6) {
					this.$router.push('/mobile/noSuspension');
				}else if(name == 7){
					if(this.nationalPlatformUrl && this.nationalPlatformUrl.slice(0, 7) !== 'http://' && this.nationalPlatformUrl.slice(0, 8) !== 'https://') {
						this.nationalPlatformUrl = 'http://' + this.nationalPlatformUrl;
					}
					window.location.href = this.nationalPlatformUrl
					return;
				}
			}
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
	 ::v-deep .van-tabs__wrap{
		// overflow: visible;
	}
	.foot-wrap{
		width: 100%;
		height: pvh(80);
		ul{
			display: flex;
			align-items: center;
			justify-content: space-around;
			position: fixed;
			top: pvh(90);
			left: 0;
			right: 0;
			z-index: 4;
			width: 100%;
			max-width: 35em;
			margin: 0 auto;
			height: pvh(80);
			background: #fff;
			li{
				text-align: center;
				font-size: fs(15);
				color: #565656;
				.active{
					font-weight: bold;
					font-size: fs(16);
					color: #409EFF;
				}
			}
		}
	}
</style>
