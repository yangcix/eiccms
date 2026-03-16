<template>
	<div class="">
		<div class="video-content-wrap">
			<div class="video-wrap">
				<div v-if="detailInfo.themeStatus == 0" style="min-height:647px">
					<div class="video-error">直播未开始！</div>
				</div>
				<div v-else>
					<div class="video-content" id="videoWrap"></div>
				</div>
				<div class="video-tag-info">
					<div class="video-tag-left">
						<ul v-if="detailInfo.labels">
							<li v-for="val in detailInfo.labels">{{val}}</li>
						</ul>
						<div class="detailInfoTitle">{{detailInfo.name}}</div>
					</div>
					
					<div class="video-tag-right">
						<i class="iconfont icon-yonghu"></i>
						<span>{{detailInfo.founder}}</span>
						<i class="iconfont icon-watch"></i>
						<span>{{detailInfo.viewed}}</span>
					</div>
				</div>
			</div>
			
			<div class="video-info">
				<div class="evaluation notselect" v-if="detailInfo.evaluation && isLogin && detailInfo.isBindEvaluation || true" @click="toEvaluation">
					<img src="@/assets/imgs/evaluation.png" alt="">
				</div>
				<p class="title">{{detailInfo.name}}</p>
				<p class="time">
					<span>开始时间：</span>
					<span>{{detailInfo.startTime}}</span>
				</p>
				<p class="time">
					<span>结束时间：</span>
					<span>{{detailInfo.endTime}}</span>
				</p>
				<p class="intro">
					<span>简介：</span>
					<span>{{detailInfo.description}}</span>
				</p>
				<!-- <p class="select-title">机位选择</p>
				<ul class="camera-list">
					<li :class="index == activeIndex ? 'active' : ''" @click="changeTeminal(index)"
					    v-for="(val, index) in detailInfo.themeTeminalList">{{val.terminalName}}</li>
				</ul> -->
			</div>
		</div>
		<div class="other-video" v-if="recommendList.length">
			<p class="other-title">相关推荐</p>
			<VideoList :videoList="recommendList" type="0"></VideoList>
		</div>
		
		<transition name="bounce">
			<div class="evaluation-wrap" v-if="evaluationShow">
				<div class="evaluation-wrap-top"><i class="el-icon-close" @click="colseEvaluation"></i></div>
				<div class="evaluation-title">在线评课</div>
				<div class="evaluation-content">
					<div class="evaluation-partone">
						<h3 class="part-title">一、评分项目怒(每项评分范围0-10分)</h3>
						<ul class="part-one-itemwrap">
							<li class="one-item" v-for="(item, index) in evaluationList" :key="item.id">
								<p class="one-item-title"><span>{{index+1}}、</span>{{item.titleName}}</p>
								<el-rate 
								v-model="item.score" 
								show-score 
								allow-half 
								:max=10 
								:score-template="item.score+'分'" 
								:colors="colors"
								class="score"
								></el-rate>
							</li>
						</ul>
					</div>
					<div class="evaluation-parttwo">
						<h3 class="part-title">二、评课总结</h3>
						<textarea class="evaluation-text" v-model="summary"></textarea>
					</div>
					<div class="evaluation-bottom">
						<el-button @click="submitEvaluation" class="evaluation-btn">提交评课</el-button>
						<el-button class="evaluation-btn">保存草稿</el-button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import videojs from 'video.js'
	import 'video.js/dist/video-js.css'
	import 'videojs-flash'
	import VideoList from '@/components/VideoList'
	import {IEVersion, judgeMobile} from "@/assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				recommendList: [],
				detailInfo: {},
				activeIndex: 0,
				teminalList: [],
				myVideo: null,
				playUrl: null,
				startTime: '',
				themeId: '',
				recordInterval: '',
				evaluationShow: false, // 评课显示
				evaluationList:[
					{
						id:'1',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'2',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'3',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'4',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'5',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'6',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'7',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'8',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'9',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
					{
						id:'10',
						titleName:'教师上课过程中与学生互动效果',
						score:0
					},
				],// 评课数组
				summary:'', // 评价总结
				colors: ['#FA8C47', '#FA8C47', '#FA8C47'],
				settime: null,
			}
		},
		components: {VideoList},
		beforeCreate(){
			if(judgeMobile()){
				this.$router.replace({path: '/mobile' + this.$route.path, query: this.$route.query});
			};
		},
		mounted() {
			window.addEventListener("beforeunload", this.recordViewInfo);
			videojs.options.flash.swf = '/video-js.swf';
			this.getDetailInfo();
			this.visity();
		},
		methods: {
			visity() {
				if(this.settime){
					clearTimeout(this.settime);
				}
				this.settime = setTimeout(() => {
					this.$axios.post('/buried/point/record', { pageName: this.$router.history.current.path, contentType: 1 }).then(res => {
						console.log('记录一次',res)
					});
				}, 300000);
			},
			// 提交评课
			submitEvaluation() {
				console.log(this.evaluationList)
			},
			//关闭评课窗
			colseEvaluation(){
				this.evaluationShow = false;
			},
			// 评课拖拽窗
			toEvaluation(){
				this.evaluationShow = true;
				this.$nextTick(() => {
						//获取元素
						var dv = document.querySelector('.evaluation-wrap');
						// console.log(dv.onresize)
						var x = 0;
						var y = 0;
						var l = 0;
						var t = 0;
						var isDown = false;
						//鼠标按下事件
						dv.onmousedown = function(e) {
								//获取x坐标和y坐标
								x = e.clientX;
								y = e.clientY;

								//获取左部和顶部的偏移量
								l = dv.offsetLeft;
								t = dv.offsetTop;
								//开关打开
								isDown = true;
								//设置样式  
								dv.style.cursor = 'move';
								// console.log(document.body)
								document.body.classList.add("notselect")
						}
						//鼠标移动
						window.onmousemove = function(e) {
								if (isDown == false) {
										return;
								}
								//获取x和y
								var nx = e.clientX;
								var ny = e.clientY;
								//计算移动后的左偏移量和顶部的偏移量
								var nl = nx - (x - l);
								var nt = ny - (y - t);

								dv.style.left = nl + 'px';
								dv.style.top = nt + 'px';
						}
						//鼠标抬起事件
						dv.onmouseup = function() {
								//开关关闭
								isDown = false;
								dv.style.cursor = 'default';
								document.body.classList.remove("notselect")
						}
				})
			},
			//初始化视频
			initVideo(){
				this.destroyVideo();
				const status = this.detailInfo.themeStatus;
				let videoEl = '';
				if (status === 2 && this.$route.query.type === '0') { // ===2已结束
					videoEl = `<div class="videoEnd"><p>直播主题已结束</p></div>`
				} else {
					// const url = 'rtmp://192.168.2.57:1935/live/1';
					videoEl = '<video v-if="playUrl" id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered"' +
						'controls preload="auto" autoplay="autoplay" width="927px" height="647px">' +
						// '<source src="'+ this.detailInfo.themeTeminalList[0].rtmpUrl +'" type="rtmp/flv"/></video>';
						'<source src="'+ this.playUrl +'" type="rtmp/flv"/></video>';
				}
				// let videoEl = '<video v-if="playUrl" id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered"' +
				// 		'controls preload="auto" autoplay="autoplay" width="927px" height="647px">' +
				// 		'<source src="'+ this.detailInfo.themeTeminalList[0].rtmpUrl +'" type="rtmp/flv"/></video>';
				document.querySelector('#videoWrap').innerHTML = videoEl;
				if (this.detailInfo.themeStatus !== 2) {
					this.myVideo = videojs('myVideo');
					this.myVideo.on('error', () => {
						this.myVideo.errorDisplay.contentEl_.innerText = '视频源未找到';
					});
				}
				if(this.detailInfo.themeStatus == 1){
					this.myVideo.play();
				}
			},
			//销毁视频
			destroyVideo(){
				if(this.myVideo!=null){
					this.myVideo.dispose();
					this.myVideo=null;
				}
			},
			//获取详情
			getDetailInfo(){
				let query = this.$route.query;
				this.themeId = query.themeid;
				this.$axios.get('/index/getVideoInfo', {id: query.themeid, type: query.type}).then(res => {
					this.setInit(res.data);
					//记录观看开始时间
					this.startTime = (new Date().getTime()) / 1000;
					this.recordInterval = setInterval(() => {
						this.startTime = (new Date().getTime()) / 1000;
						this.$axios.get('/index/recordViewInfo', {
							themeId: this.themeId,
							time: 300
						}).then(res => {
						
						})
					}, 300000)
				});
			},
			setInit(val){
				this.detailInfo = val;
				this.addViewed(val.id);
				this.teminalList = val.themeTeminalList;
				// let playUrl = this.themeTeminalList[0].rtmpUrl;
				let playUrl = this.detailInfo.themeTeminalList[0].rtmpUrl;
				if (playUrl) {
					playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
				}
				this.playUrl = playUrl;
				this.getRecommendList();
				if(this.detailInfo.themeStatus == 0){
					return
				}
				if(!judgeMobile() && this.detailInfo.themeStatus == 1){
					this.judgeFlash();
				};
				this.initVideo();
			},
			// //切换机位-直播
			// changeTeminal(index){
			// 	this.activeIndex = index;
			// 	// let playUrl = this.themeTeminalList[index].rtmpUrl;
			// 	let playUrl = this.detailInfo.themeTeminalList[index].rtmpUrl;
			// 	if (playUrl) {
			// 		playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
			// 	}
			// 	this.playUrl = playUrl;
			// 	this.initVideo();
			// },
			//获取推荐视频列表
			getRecommendList(){
				this.$axios.post('/index/relevantRecommend',{
					id: this.detailInfo.id,
					labelIds: this.detailInfo.labelIds,
					// type: this.$route.query.type
				}).then(res => {
					this.recommendList = res.data;
				});
			},
			//更新视频观看数
			addViewed(id){
				this.$axios.get('/index/updateThemeViewed', {themeId: id}).then(res => {
				
				});
			},
			//判断浏览器并检测flash
			judgeFlash(){
				if(IEVersion() == -1){
					var swf = navigator.plugins['Shockwave Flash'];
					if(swf == undefined){
						if(confirm('检测到您未启用或安装flash，点击确定下载flash并手动安装')){
							location.href = '/download/Flash_chrome.exe';
						}
					}
				}else{
					try{var swf1 = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');}
					catch(e){
						if(confirm('检测到您未启用或安装flash，点击确定下载flash并手动安装')){
							location.href = '/download/Flash_IE.exe';
						}
					}
				}
			},
			//上报数据
			recordViewInfo(e){
				let endTime = (new Date().getTime()) / 1000;
				if((endTime - this.startTime) > 60 && this.detailInfo.recode == 1){
					this.$axios.get('/index/recordViewInfo', {
						themeId: this.themeId,
						time: parseInt(endTime - this.startTime)
					}).then(res => {
					
					})
				}
			}
		},
		watch: {
			$route(to,from){
				if(to.path === from.path){
					this.getDetailInfo();
				}
				this.myVideo.destroy()
			}
		},
		beforeDestroy() {
			clearTimeout(this.settime);
			clearInterval(this.recordInterval);
			this.destroyVideo();
			this.recordViewInfo();
			if(this.myVideo && this.myVideo.destroy) {
				this.myVideo.destroy();
			}
			this.$refs.myVideo.innerHTML = "";
			window.removeEventListener('beforeunload', this.recordViewInfo)
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.detailInfoName {
		padding-bottom:20px;
		padding-left:10px
	}
	.video-content-wrap{
		margin-top: 30px;
		display: flex;
		width: 1200px;
		min-height: 700px;
		margin: 0 auto;
		background: #fff;
		.video-wrap{
			position: relative;
			width: 927px;
			.video-error{
				position: absolute;
				height: 647px;
				width: 927px;
				z-index: 10;
				background: #000;
				top: 0;
				left: 0;
				color: #fff;
				text-align: center;
				line-height: 580px;
			}
		}
		.video-content{
			position: relative;
			height: 647px;
			width: 100%;
			background: #000;
			video{
				width: 927px;
				height: 647px;
			}
		}
		.video-tag-info {
			background:#fff;
			width: 100%;
			min-height: 66px;
			display: flex;
			justify-content: space-between;
			padding: 20px 0;
			box-sizing: border-box;
			.video-tag-left {
				padding: 0 10px;
				ul {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: 16px;
					li {
						margin:2px 0;
						padding: 5px 12px 4px 12px;
						margin-right: 8px;
						background: #FF9727;
						box-shadow: 0px 2px 3px 0px rgba(255,151,39,0.5);
						border-radius: 16px;
						color: #fff;
						font-size: 12px;
						}
				}

				.detailInfoTitle {
					max-width: 700px;
					margin-left:2px;
					padding: 2px 0 0 0;
					box-sizing: border-box;
				}
			}
			.video-tag-right {
				padding: 2px 10px 0 0;
				box-sizing: border-box;
				font-size: 12px;
				color: #999;
				i{
					margin: 0 5px 0 14px;
					font-size: 13px;
				}
			}
		}
		.video-info{
			width: 273px;
			box-sizing: border-box;
			padding: 23px 25px 0 32px;
			position:relative;
			.evaluation {
				width: 154px;
				height: 145px;
				position: absolute;
				right: -160px;
				top: 430px;
				// z-index: 1;
				cursor: pointer;
			}
			.title{
				font-size: 18px;
				color: #222;
				word-break:break-all;
				// -webkit-line-clamp:1;
					line-clamp:1;
			}
			.time{
				margin-top: 10px;
				color: #999;
				font-size: 12px;
				i{
					margin-right: 7px;
					font-size: 15px;
				}
			}
			.intro{
				word-break:break-all;
				margin-top: 22px;
				line-height: 18px;
				font-size: 12px;
				color: #999;
				span:first-child{
					color: #111;
				}
			}
			.select-title{
				margin-top: 25px;
				font-size: 12px;
				color: #111;
			}
			.camera-list{
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				li{
					line-height: 28px;
					width: 150px;
					padding: 0 2px;
					margin-top: 15px;
					text-align: center;
					-webkit-line-clamp:1;
					line-clamp:1;
					background: #EEE;
					color: #999;
					font-size: 12px;
					&.active{
						background: #C7EDFF;
						color: #035AFF;
					}
				}
			}
		}
	}
	.other-video{
		width: 1200px;
		margin: 52px auto 0 auto;
		.other-title{
			font-size: 24px;
			color: #035AFF;
		}
	}
</style>
<style lang="scss">
.vjs-play-control {
	display: none !important;
}
.videoEnd {
	width: 927px;
	height: 647px;
	background: #000;

	p {
		color: white;
		text-align: center;
		line-height: 647px;
	}
}
</style>
<style lang="scss" scoped>
.el-rate__text {
	color: #FA8C47 !important;
}
.fade-enter-active, .fade-leave-active {
	transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.bounce-enter-active {
	animation: bounce-in .8s;
}
.bounce-leave-active {
	animation: bounce-in .8s reverse;
}
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.05);
	}
	100% {
		transform: scale(1);
	}
}
.evaluation-wrap {
		min-width: 500px;
		min-height: 600px;
		width: 1000px;
		height: 826px;
		background:#fff;
		border-radius: 10px;
		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		resize:both; 
		// overflow:auto;
		position: absolute;
		top:100px;
		left: 500px;
		z-index: 999;

		.evaluation-wrap-top {
			width: 100%;
			height: 30px;
			padding: 16px 20px;
			box-sizing: border-box;
			i {
				float: right;
				cursor: pointer;
			}
		}

		.evaluation-title {
			width: 100%;
			height: 30px;
			text-align: center;
			font-size: 18px;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #333333;
		}

		.evaluation-content {
			width: 100%;
			height: auto;
			padding: 0 132px 30px 132px;
			box-sizing: border-box;
			
			.part-title {
				margin: 0 0 10px 0;
				font-size: 18px;
				color: #333333;
			}

			.part-one-itemwrap {
				height: 448px;
				box-sizing: border-box;
				overflow: auto;
				.one-item {
					margin-top:15px;
					.one-item-title {
						font-size: 15px;
						font-weight: bold;
						line-height: 22px;
						color: #333333;
					}
					.score{
						margin:10px 0 0 24px;
					}
				}
			}

			.evaluation-parttwo {
				.part-title {
					margin: 10px 0 0 0;
				}
				.evaluation-text{
					width: 736px;
					height: 118px;
					background: #FFFFFF;
					border: 1px solid #DBE2E7;
					opacity: 1;
					border-radius: 6px;
					margin:18px 0 30px 0;
					padding: 10px;
    			box-sizing: border-box;
				}
			}

			.evaluation-bottom {
				padding: 0 146px;
				box-sizing: border-box;
				.evaluation-btn {
					width: 169px;
					height: 55px;
					border:1px solid#305BFF;
					opacity: 1;
					border-radius: 28px;
					margin:0 26px;
					color: #305BFF;
				}
				.evaluation-btn:first-child {
					color:#fff;
					background: #305BFF;
				}
			}
		}
	}
</style>
