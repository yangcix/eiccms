<template>
	<div class="video-wrap">
		<div class="item" v-for="val in filtersData" @click="play(val)">
			<div class="img-wrap">
				<img :src="val.imgUrl" alt="">
				<ul class="label-list">
					<li v-for="item in val.labels">{{item}}</li>
				</ul>
				<p class="time" v-if="val.time">{{val.time}}</p>
				<p class="video-status" v-if="val.themeStatus == 1">
					<i class="iconfont icon-livebroadcast"></i>
					<span>授课中</span>
				</p>
				<p class="video-status" v-if="val.themeStatus == 2">
					<i class="iconfont icon-livebroadcast"></i>
					<span>已结束</span>
				</p>
				<p class="video-status" style="background: rgba(0, 0, 0, .2)" v-if="val.themeStatus == 0">
					<i class="iconfont icon-yugao"></i>
					<span>预告中</span>
				</p>
			</div>
			<p class="class-name">{{val.name}}</p>
			<div class="member-wrap">
				<p>
					<i class="iconfont icon-yonghu"></i>
					<span>{{val.founder}}</span>
				</p>
				<p>
					<i class="iconfont icon-watch"></i>
					<span>{{val.viewed}}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: '',
		props: ['videoList', 'type'],
		data() {
			return {
			}
		},
		components: {},
		mounted() {
		
		},
		computed: {
			filtersData() {
				return (this.videoList || []).map(v => {
					return {
						...v,
						labels: (v.labels || []),
					}
				})
			},
		},
		methods: {
			// //播放
			// play(val){
			// 	window.scrollTo(0, 0);
			// 	console.log(val,'000000')
			// 	if(this.type == 0){ //直播
			// 		this.$router.push({path: 'hplay', query: {themeid: val.id, type: this.type}});
			// 	}else if(this.type == 1){ //点播
			// 		this.$router.push({path: 'pplay', query: {themeid: val.id, type: this.type}});
			// 	}else if(this.type == 2){ //视频
			// 		this.$router.push({path: 'vplay', query: {themeid: val.id, type: this.type}});
			// 	}
			// },
				play(val){
				window.scrollTo(0, 0);
				// debugger
				if(this.type == 0 && (val.themeStatus == 1 || val.themeStatus == 0)){ //直播
					if(val.mode == 0){ //http
						this.$router.push({path: 'hplay', query: {themeid: val.id, type: this.type}});
					}
				}else if(this.type == 0 && val.themeStatus == 2){ //点播
					this.$router.push({path: 'pplay', query: {themeid: val.id, type: 0}});
				}else if(this.type == 2){ //视频
					this.$router.push({path: 'vplay', query: {themeid: val.id, type: this.type}});
				}
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.video-wrap{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-bottom: pvh(20);
	}
	.item{
		overflow: hidden;
		width: 48.4%;
		margin-top: pvh(22);
		box-sizing: border-box;
		padding-top: pvh(15);
		background: #fff;
		.img-wrap{
			position: relative;
			width: 100%;
			height: 27vw;
			max-height: pvh(240);
			img{
				width: 100%;
				height: 100%;
			}
			.time{
				position: absolute;
				bottom: pvh(10);
				right: pvh(10);
				padding: pvh(5) pvh(6) pvh(2) pvh(6);
				border-radius: pvh(26);
				background: rgba(0, 0, 0, .6);
				font-size: fs(8);
				color: #fff;
			}
			.label-list{
				position: absolute;
				top: 0;
				left: pvh(15);
				display: flex;
				flex-wrap: wrap;
				li{
					margin-bottom: 5px;
					margin-right: pvh(10);
					padding: pvh(4) pvh(9) pvh(0) pvh(9);
					border-radius: 0px 0px pvh(16) 0px;
					box-shadow: 0px pvh(2) pvh(3) 0px rgba(255,151,39,0.5);
					text-align: center;
					font-size: fs(9);
					background: rgba(255,151,39,1);
					color: #fff;
				}
			}
			.video-status{
				position: absolute;
				bottom: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: pvh(48);
				font-size: pvh(12);
				color: #fff;
				background: rgba(0, 0, 0, .6);
				&.advance{
					background: rgba(0, 0, 0, .2);
				}
				i{
					font-size: fs(11);
					margin-right: pvh(2);
				}
			}
		}
		.class-name{
			margin-top: pvh(4);
			padding: 0 pvh(15);
			-webkit-line-clamp:1;
					line-clamp:1;
			font-size: fs(13);
			line-height: pvh(54);
			color: #222;
		}
		.member-wrap{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 pvh(15);
			line-height: pvh(46);
			border-top: solid 1px #F1F2F4;
			font-size: fs(10);
			color: #999;
			i{
				margin-right: 1px;
				font-size: fs(10);
			}
		}
	}
</style>
