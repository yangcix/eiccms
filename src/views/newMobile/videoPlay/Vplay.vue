<template>
	<div class="phone-play">
		<Head></Head>
		<div class="video-play" id="videoWrap">
			<div id="myVideo"></div>
		</div>
		<div class="video-info">
			<p class="title">{{detailInfo.name}}</p>
			<p class="time-view">
				<span><i class="iconfont icon-yonghu"></i>{{detailInfo.founder}}</span>
				<span><i class="iconfont icon-watch"></i>{{detailInfo.viewed}}</span>
			</p>
		</div>
		<div class="mobile-wrap">
			<p class="modle-title"><span>相关推荐</span></p>
			<VideoList :videoList="recommendList" type="2"></VideoList>
			<div class="null-data" v-if="!recommendList.length">
				<img src="../../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
		</div>
	</div>
</template>

<script>
	//视频播放页
	import Player from 'xgplayer';
	import Head from '@/views/mobile/Head'
	import VideoList from '@/views/mobile/VideoList'
	import {storage} from "../../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				detailInfo: {},
				recommendList: [],
				videoList: [],
				myVideo: null,
				currentType: 0,
			}
		},
		components: {Head, VideoList},
		mounted() {
			this.getDetailInfo();
			setTimeout(() => {
				this.addViewed(this.$route.query.themeid);
			}, 300);
		},
		methods: {
			// 添加全屏监听事件
			addListens() {
				let v = document.getElementById('myVideo')
				let _that = this
				v.addEventListener("webkitfullscreenchange", function(e) {
						if (!document.webkitIsFullScreen) {
							//退出全屏播放视频
							_that.myVideo.play();
						};
				});
				v.addEventListener("fullscreenchange", function(e) {
						if (!document.fullscreen) {
							console.log('bbb')
							//退出全屏播放视频
							_that.myVideo.play();
						};
				});
				v.addEventListener("mozfullscreenchange", function(e) {
						if (!document.mozFullScreen) {
							//退出全屏播放视频
							_that.myVideo.play();
						};
				});
				v.addEventListener("msfullscreenchange", function(e) {
						if (!document.msFullscreenElement) {
							//退出全屏播放视频
							_that.myVideo.play();
						};
				});
				// // ios监听进入全屏的事件
				// v.addEventListener('webkitbeginfullscreen', function() {  
				// 		plus.screen.lockOrientation('landscape'); //锁死屏幕方向为横屏  
				// });  
				// ios监听推出全屏的事件
				v.addEventListener('webkitendfullscreen', function() {  
						//退出全屏播放视频
						_that.myVideo.play();
				});
				v.addEventListener("x5videoexitfullscreen", function(e){
							//退出全屏播放视频
							_that.myVideo.play();
				});
				// 西瓜视频监听退出全屏
				this.myVideo.on("exitFullscreen", function(e){
							//退出全屏播放视频
							_that.myVideo.play();
				});
			},
			//获取详情
			getDetailInfo(){
				this.$axios.get('/index/getVideoInfo', {id: this.$route.query.themeid, type: 2}).then(res => {
					if(!res.data){
						// this.$message('您暂无观看权限','error')
						return
					}
					this.detailInfo = res.data;
					this.videoList = res.data.videoInfo;
					this.$nextTick(() => {
						this.initVideo();
					})
					this.getRecommendList();
				});
			},
			//初始化视频
			initVideo(){
				let options = {
					id: 'myVideo',
					url: `${location.protocol}//${location.hostname}${this.videoList[2].url}`,
					// url: `http://192.168.164.59${this.videoList[2].url}`,
					autoplay: true,
					videoInit: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					lang: 'zh-cn',
					fluid: true,
				};
				if(localStorage.getItem('version') == 3){ //ops
					options.playsinline = true;
				}else{
					options['x5-video-player-type'] = 'h5';
				}
				this.myVideo = new Player(options);
				let arr = ['普通', '标清', '高清'];
				let videoList = [];
				for(let i = 0; i < this.videoList.length; i++){
					videoList.push({name: arr[this.videoList[i].type], url: this.videoList[i].url});
				};
				console.log('this',this.myVideo)
				this.myVideo.emit('resourceReady', videoList);
				this.addListens(); // 添加全屏监听事件
			},
			//更新视频观看数
			addViewed(id){
				this.$axios.get('/index/updateVideoViewed', {videoId: id}).then(res => {});
			},
			//获取推荐视频列表
			getRecommendList(){
				this.$axios.post('/index/relevantRecommend',{
					id: this.detailInfo.id,
					labelIds: this.detailInfo.labelIds,
					type: 2
				}).then(res => {
					this.recommendList = res.data;
				});
			},
		},
		watch: {
			$route(to,from){
				if(to.path === from.path){
					this.getDetailInfo();
				}
				if(this.myVideo && this.myVideo.destroy){
					this.myVideo.destroy();
				}
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.phone-play{
		height: 100vh;
	}
	.video-play{
		position: relative;
		width: 100%;
	}
	.video-info{
		box-sizing: border-box;
		padding: pvh(30) pvh(24) pvh(35) pvh(24);
		border-bottom: solid pvh(24) #F6F5F8;
		.title{
			line-height: 1.4em;
			font-size: fs(18);
			color: #222;
		}
		.descript{
			margin-top: pvh(20);
			line-height: pvh(35);
			font-size: fs(13);
			color: #888;
		}
	}
	.time-view{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: pvh(26);
		font-size: fs(10);
		color: #999;
		i{
			margin: 0 pvh(13);
			font-size: fs(10);
		}
		span:last-child{
			margin-right: pvh(8);
		}
	}
	.mobile-wrap{
		width: 94%;
		margin: pvh(30) 0 0 3%;
		.modle-title{
			display: flex;
			justify-content: space-between;
			font-size: fs(18);
			color: #282828;
			.more{
				font-size: fs(12);
				color: #656565;
			}
		}
	}
	.null-data{
		margin-top: pvh(50);
		text-align: center;
		font-size: fs(7);
		color: #999;
		img{
			width: 75%;
			margin-bottom: pvh(17);
		}
	}
</style>
