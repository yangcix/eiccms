<template>
	<div class="phone-play">
		<Head></Head>
		<div class="video-play" id="videoWrap">
			<div id="myVideo"></div>
		</div>
		<div class="video-info">
			<p class="title">{{detailInfo.name}}</p>
			<p class="descript">课程简介：{{detailInfo.description}}</p>
			<p class="time-view last">
				<span>开始时间：{{detailInfo.startTime}}</span>
			</p>
			<p class="time-view">
				<span>结束时间：{{detailInfo.endTime}}</span>
				<span><i class="iconfont icon-watch"></i>{{detailInfo.viewed}}</span>
			</p>
		</div>
		<el-dialog
        class="dialogPassword"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="dialogVisible"
				width="80%"
        :close-on-click-modal="false"
      >
        <div class="admin">
          <div class="name">观看密码<label>*</label>：</div>
          <el-input
            placeholder="请输入观看密码"
            show-password
            clearable
            v-model="password"
          >
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn" type="primary" @click="handleEnsure">
            确定
          </el-button>
        </span>
      </el-dialog>
		<div class="teminal-wrap">
			<p class="title">机位选择</p>
			<ul class="teminal-list">
				<li :class="index == activeIndex ? 'active' : ''" @click="changeTeminal(index)"
				    v-for="(val, index) in detailInfo.themeTeminalList">{{val.terminalName}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	//直播播放页
	import Player from 'xgplayer';
	import Head from '@/views/mobile/Head'
	export default {
		name: '',
		data() {
			return {
				password: '',
				dialogVisible: false,
				detailInfo: {},
				activeIndex: 0,
				themeTeminalList: [],
				myVideo: null,
				playUrl: null,
				videoType: ''
			}
		},
		components: {Head},
		mounted() {
			this.videoType = this.$route.query.type;
			this.getDetailInfo();
			setTimeout(() => {
				this.addViewed(this.$route.query.themeid);
			}, 300);
		},
		methods: {
			handleEnsure() {
				if (this.password == '') {
					this.$message('请输入观看密码', 'error');
					return;
				}
				if (this.password !== this.detailInfo.password) {
					this.$message('密码错误，请重新输入密码', 'error');
					return;
				}
				let list = window.sessionStorage.getItem('liveList') ? JSON.parse(window.sessionStorage.getItem('liveList')) : []
				if(list){
					let isTrue = false;
					list.forEach(el => {
						if(el.id === this.detailInfo.id){
							isTrue = true;
							el.password = this.password;
						}
					});
					if(isTrue == false){
						list.push({
							id: this.detailInfo.id,
							password: this.password
						})
					}
				}else{
					list = [{
						id: this.detailInfo.id,
						password: this.password
					}]
				}
				window.sessionStorage.setItem('liveList',JSON.stringify(list))
				this.dialogVisible = false;
				this.initVideo();
			},
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
				this.$axios.get('/index/getVideoInfo', {id: this.$route.query.themeid, type: this.videoType}).then(res => {
					if(!res.data){
						// this.$message('您暂无观看权限','error')
						return
					}
					this.detailInfo = res.data;
					this.themeTeminalList = res.data.themeTeminalList;
					let playUrl = this.themeTeminalList[0].playbackUrl;
					// playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
					this.playUrl = `${location.protocol}//${location.host}${playUrl}`;
					this.$nextTick(() => {
						let list = JSON.parse(window.sessionStorage.getItem('liveList'));
							let isTrue = false;
							if(list) {
								list.forEach(el => {
									if(el.id == this.detailInfo.id && el.password == this.detailInfo.password) {
										isTrue = true;
									}
								})
							}
							if(this.detailInfo.groupId == 1 && this.detailInfo.password !== '' && res.data.password !== null && isTrue == false) {
								this.dialogVisible = true;
							}else{
								this.initVideo();
							}
					})
				});
			},
			//初始化视频
			initVideo(){
				this.myVideo = new Player({
					id: 'myVideo',
					url: this.playUrl,
					autoplay: true,
					videoInit: true,
					lang: 'zh-cn',
					playsinline: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					fluid: true
				});
				this.addListens()
			},
			//切换机位
			changeTeminal(index){
				this.activeIndex = index;
				let playUrl = this.themeTeminalList[index].playbackUrl;
				// playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
				this.playUrl = `http://${location.hostname}${playUrl}`;
				this.myVideo.src = this.playUrl;
			},
			//更新视频观看数
			addViewed(id){
				this.$axios.get('/index/updateThemeViewed', {themeId: id}).then(res => {});
			}
		},
		watch: {
			$route(to,from){
				if(to.path === from.path){
					this.getDetailInfo();
				}
			}
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.phone-play{
		height: 100vh;
		background: #fff;
	}
	.video-play{
		position: relative;
		width: 100%;
		video{
			width: 100%;
			height: 100%;
		}
	}
	.video-info{
		box-sizing: border-box;
		padding: pvh(30) pvh(24) pvh(35) pvh(24);
		border-bottom: solid pvh(24) #F6F5F8;
		.title{
			font-size: fs(18);
			color: #222;
			line-height: 1.4em;
		}
		.descript{
			margin-top: pvh(20);
			line-height: pvh(35);
			font-size: fs(13);
			color: #888;
		}
		.time-view{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: pvh(11);
			font-size: fs(10);
			color: #999;
			i{
				margin: 0 pvh(13);
				font-size: fs(10);
			}
			span:last-child{
				margin-right: pvh(8);
			}
			&.last{
				margin-top: pvh(26);
			}
		}
	}
	.teminal-wrap{
		box-sizing: border-box;
		padding: pvh(36);
		.title{
			font-size: fs(18);
			color: #222222;
		}
	}
	.teminal-list{
		display: flex;
		flex-wrap: wrap;
		li{
			width: 31%;
			margin-top: pvh(31);
			margin-left: 3.5%;
			box-sizing: border-box;
			border: solid 1px #409EFF;
			border-radius: pvh(8);
			line-height: pvh(58);
			font-size: fs(12);
			text-align: center;
			-webkit-line-clamp:1;
					line-clamp:1;
			color: #409EFF;
			cursor: pointer;
			&.active{
				color: #fff;
				background: #409EFF;
			}
			&:nth-child(3n - 2){
				margin-left: 0;
			}
		}
	}
</style>
<style>
	.video-js{
		width: 100%;
		height: 100%;
	}
</style>
