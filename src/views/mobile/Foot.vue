<template>
	<div class="foot-wrap">
		<ul>
			<li @click="goTo('home')">
				<p :class="index == 0 ? 'active' : ''">首页</p>
			</li>
			<li @click="goTo('live')">
				<p :class="index == 1 ? 'active' : ''">直播</p>
			</li>
			<!-- <li @click="goTo('back')">
				<p :class="index == 2 ? 'active' : ''">点播</p>
			</li> -->
			<li @click="goTo('video')">
				<p :class="index == 3 ? 'active' : ''">视频</p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: '',
		props: ['index'],
		data() {
			return {}
		},
		components: {},
		mounted() {
		
		},
		methods: {
			goTo(path){
				this.$router.push('/mobile/' + path);
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
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
