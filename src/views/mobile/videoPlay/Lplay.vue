<template>
	<div class="phone-play">
		<Head></Head>
		<div class="video-status" v-if="detailInfo.themeStatus === 0">直播未开始！</div>
		<div v-else>
			<div class="video-play" id="videoWrap">
				<div id="myVideo" ref="myVideo"></div>
			</div>
		</div>
		<div class="video-info">
			<div class="tabs">
				<div class="tabItem" v-for="item in tabList" :key='item.typeId' @click="chooseType(item.typeId)">
					<span :class="{'tabItemActive':isActive === item.typeId}">{{item.type}}</span>
				</div>
    	</div>

			<div class="chat-box" ref="chatBox" id="chatBox" v-show="isActive == 1">
				<div v-for="( item , index) in inList" :key="index" class="message">
					<img src="@/assets/imgs/teacherIcon.png" alt="" v-if="item.account == detailInfo.createAccount" class="avatar">
					<img src="@/assets/imgs/studentIcon.png" alt="" v-else class="avatar">
					<div class="message-author">
						<span>{{item.userName}}</span> <span class="teacherMark" v-if="item.account == detailInfo.createAccount">教师</span>
						<p v-html="item.message" class="a-message" :class="item.account == detailInfo.createAccount ? '' : 'studentMsg'"></p>
					</div>
				</div>
			</div>
				
			<div class="item-info" v-show="isActive == 2">
				<p class="title">{{detailInfo.name}}</p>
				<p class="descript">课程简介：{{detailInfo.description}}</p>
				<p class="time-view last">
					<span>开始时间：{{detailInfo.startTime}}</span>
				</p>
				<p class="time-view">
					<span>结束时间：{{detailInfo.endTime}}</span>
					<span><i class="iconfont icon-watch"></i>{{detailInfo.viewed ? detailInfo.viewed : 0}}</span>
				</p>
			</div>

			<transition name="fade">
				<div class="newTips" v-if="toNew" @click="clickNew"><i class="el-icon-caret-bottom"></i> 有{{num}}条新消息</div>
			</transition>
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
		<!-- <div class="teminal-wrap">
			<p class="title">机位选择</p>
			<ul class="teminal-list">
				<li :class="index == activeIndex ? 'active' : ''" @click="changeTeminal(index)"
				    v-for="(val, index) in themeTeminalList">{{val.terminalName}}</li>
			</ul>
		</div> -->
	</div>
</template>

<script>
	//直播播放页
	import videojs from 'video.js'
	import HlsPlayer  from 'xgplayer-hls.js';
	import Head from '@/views/mobile/Head'
	import liveWs from  '@/components/liveWs.vue'
	import { connects, sendMessage, MyEvents, closeWs } from '@/assets/js/liveWs'
	// import {session, storage, kickUrl} from '@/assets/js/utils';
	export default {
		name: '',
		mixins:[liveWs],
		data() {
			return {
				password: '',
				detailInfo: {},
				activeIndex: 0,
				themeTeminalList: [],
				myVideo: null,
				playUrl: null,
				startTime: '',
				themeId: '',
				wsInterval: '',
				recordInterval: '',
				dialogVisible: false,
				isActive:1,
				tabList:[
						{
								typeId: 1,
								type:'互动讨论'
						},
						{
								typeId: 2,
								type:'主题详情'
						}
				],
				userInfo:{},
				inList:[], // 消息数组
				// studentMsg: false, // 学生消息
				scrollIsBottom:true, // 是否滚动置底
				toNew:false, // 是否新消息
				num:'', //新消息数
				interactiveStatus: '', // 互动开启关闭
				createAccount:'' // 客户端登记人数
			}
		},
		components: {Head},
		computed: {
		},
		watch: {
			inList(val) {
				if(val && this.scrollIsBottom){
					this.autoBottom()
				}
			},
			$route(to,from){
				if(to.path === from.path){
					this.getDetailInfo();
				}
			}
		},
		mounted() {
			this.userInfo = JSON.parse(this.$store.state.chatLogin)
			this.getDetailInfo();
			this.autoBottom();
			this.newMessage();
			window.addEventListener("pagehide", this.recordViewInfo);
			// this.checkFull()
			setTimeout(() => {
				this.addViewed(this.$route.query.themeid);
			}, 300);
			if(this.$refs.chatBox.scrollHeight - this.$refs.chatBox.scrollTop - this.$refs.chatBox.clientHeight <= 100){
				this.scrollIsBottom = true
			}else {
				this.scrollIsBottom = false
			}
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
      this.wsConnect();
      this.startVideo();
    },
			// tab切换
			chooseType(index) {
          this.isActive = index
			},
			// 新消息滚动置底
			autoBottom() {
					this.$nextTick(() => {
						this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
					});
			},
			// 消息滚动后新消息提示
			newMessage () {
				this.$refs.chatBox.addEventListener('scroll', () => {
					if(this.$refs.chatBox.scrollHeight - this.$refs.chatBox.scrollTop - this.$refs.chatBox.clientHeight <= 100){
						this.scrollIsBottom = true
						this.num = 0;
						this.toNew = false
					}else {
						this.scrollIsBottom = false
					}
				})
			},
			clickNew () {
				this.$nextTick(() => {
						this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
					});
					this.toNew = false;
					this.num = 0;
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
				let query = this.$route.query;
				this.themeId = query.themeid;
				this.$axios.get('/index/getVideoInfo', {id: query.themeid, type: query.type}).then(res => {
					if(!res.data){
						// this.$message('您暂无观看权限','error')
						return
					}
					this.detailInfo = res.data;
					this.interactiveStatus = res.data.interactiveStatus;
					this.createAccount = res.data.createAccount;
					this.addViewed(res.data.id);
					this.themeTeminalList = res.data.themeTeminalList;
					this.$nextTick(() => {
						// this.startVideo();
						let videoEl = '';
						if (this.detailInfo.themeStatus === 2 && this.$route.query.type === '0') {
							videoEl = `<div class="videoEnd"><p>直播主题已结束</p></div>`
							document.querySelector('#videoWrap').innerHTML = videoEl;
							// console.log('直播主题结束');
						} else {
							let playUrl = this.themeTeminalList[0].mobileUrl;
							if (playUrl) {
								playUrl = process.env.NODE_ENV === "production" ? (playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1]) :( playUrl.split('://')[0] + '://' + '192.168.164.59' + ':' + playUrl.split('//')[1].split(':')[1]);
							}
							this.playUrl = playUrl;
							// console.log('可播放');
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
								this.wsConnect();
								this.startVideo();
							}
						}
					})
					//记录观看开始时间
					this.startTime = (new Date().getTime()) / 1000;
					this.recordInterval = setInterval(() => {
						this.startTime = (new Date().getTime()) / 1000;
						this.$axios.get('/index/recordViewInfo', {
							themeId: this.themeId,
							time: 300,
							type: 0
						}).then(res => {
						
						})
					}, 300000)
					this.chatWebsocket()
				});
	
				
			},
			wsConnect() {
				connects(this.$route.query.themeid).then(res => {
					if(res == 200) {
						this.wsInterval = setInterval(() => {
							sendMessage({
								"sequenceId":0,
								"messageType":1
							});
						}, 10000)
						sendMessage({
							"sequenceId":0,
							"messageType":5
						})
					}
				})
			},
			startVideo(){
				this.myVideo = new HlsPlayer({
					id: 'myVideo',
					url: this.playUrl,
					hasVideo: true,
					hasAudio: true,
					fluid: true,
					autoplay: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					ignores: ['play', 'progress'],
					videoInit: true,
					isLive: true,
					playsinline: true,
					lang: 'zh-cn',
					useHls: true
				});
				this.myVideo.on('error', (error) => {
					closeWs();
					clearInterval(this.wsInterval);
					clearInterval(this.recordInterval);
					if(this.myVideo && this.myVideo.destroy){
						this.myVideo.destroy();
					}
					this.recordViewInfo();
					window.removeEventListener('pagehide', this.recordViewInfo)
					this.websock.close();
					this.getDetailInfo();
      	});
				// this.myVideo.on('waiting', () => {
        // //断流重接，结束不续播
				// 	closeWs();
				// 	clearInterval(this.wsInterval);
				// 	clearInterval(this.recordInterval);
				// 	if(this.myVideo && this.myVideo.destroy){
				// 		this.myVideo.destroy();
				// 	}
				// 	this.recordViewInfo();
				// 	window.removeEventListener('pagehide', this.recordViewInfo)
				// 	this.websock.close();
				// 	this.getDetailInfo();
      	// });
				this.addListens();
			},
			//切换机位
			changeTeminal(index){
				this.activeIndex = index;
				let playUrl = this.themeTeminalList[index].mobileUrl;
				playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
				this.playUrl = playUrl;
				// this.myVideo.src = this.playUrl;
				if (playUrl) {
					this.$refs.myVideo.innerHTML = '';
					this.startVideo();
				} else {
					this.$refs.myVideo.innerHTML = '';
				}
			},
			//更新视频观看数
			addViewed(id){
				this.$axios.get('/index/updateThemeViewed', {themeId: id}).then(res => {});
			},
			//上报数据
			recordViewInfo(e){
				let endTime = (new Date().getTime()) / 1000;
				if((endTime - this.startTime) > 5 && this.detailInfo.recode == 1){
					this.$axios.get('/index/recordViewInfo', {
						themeId: this.themeId,
						time: parseInt(endTime - this.startTime),
						type: 0
					}).then(res => {
					
					})
				}
			}
		},
		beforeDestroy(){
			closeWs();
			clearInterval(this.wsInterval);
			clearInterval(this.recordInterval);
			if(this.myVideo && this.myVideo.destroy){
				this.myVideo.destroy();
			}
			this.recordViewInfo();
			window.removeEventListener('pagehide', this.recordViewInfo)
			this.websock.close()
		}
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
	.video-status{
		width: 100%;
		height: pvh(420);
		background: #000;
		color: #fff;
		text-align: center;
		line-height: pvh(400);
	}
	.video-info{
		position: relative;
		box-sizing: border-box;
		padding: pvh(10) pvh(0) pvh(0) pvh(0);

		.tabs {
				display: flex;
				justify-content: space-around;
				width:  100%;
				height: pvh(84);
				line-height: pvh(84);
				// border-bottom: 1px solid #EEEEEE;
				background: #fff;
				box-sizing: border-box;
    		padding: 0 pvw(60);
				.tabItem {
						// width: 168px;
						height: pvh(84);
						color: #333333;
						cursor: pointer;
						span {
								font-size: fs(16);
								color:#999999;
						}
						.tabItemActive {
								height: pvh(82);
								font-size: fs(16);
								display: inline-block;
								color:#2CBCF0;
								border-bottom: 2px solid #2CBCF0;
						}
				}
				
		}

		.chat-box {
				// position: relative;
				height: pvh(718);
				padding: pvw(20) pvw(60) pvw(30) pvw(60);
				overflow-y: auto;
				color: #333333;
				font-family: Microsoft YaHei;
				// border:1px solid #c9d8db;
				box-sizing: border-box;
				
				.message {
					margin: pvw(48) 0;
					.avatar {
							width: 40px;
							height: 40px;
							margin-right: 9px;
							display:inline-block;
							// border: 1px #000 dashed;
							vertical-align: top;
						}

					.message-author {
						display: inline-block;
						line-height: 1;
						color:#999999;
						font-size: 12px;
					}

					.teacherMark {
						display: inline-block;
						border: 1px #409EFF solid;
						border-radius: 4px;
						color: #409EFF;
						font-size: 12px;
						position: relative;
						top:-1px
					}
					
					.a-message {
						max-width: pvw(510);
						// background: #ebeef5;
						box-sizing: border-box;
						margin: 5px;
						background-color: #409EFF;
						border-bottom-color:#409EFF;/*为了给after伪元素自动继承*/
						color: #fff;
						line-height: 18px;
						padding: 10px 12px;
						box-sizing: border-box;
						border-radius: 12px;
						font-size: fs(12);
						position: relative;
						word-break: break-all;
					}
					.studentMsg {
						background-color: #e4e7ed;
						border-bottom-color:#e4e7ed;
						color: #222;
					}
					.a-message::after {
						content: '';
						position: absolute;
						top: 0;
						left: -9px;
						width: 5px;
						height: 10px;
						border-width: 0 0 10px 10px;
						border-style: solid;
						border-bottom-color: inherit;   /*自动继承父元素的border-bottom-color*/
						border-left-color: transparent;
						border-radius: 0 0 60px 0;
						transform: rotateY(180deg);
					}
				}
		}

		.item-info {
			padding: pvw(60);
			.title{
				// -webkit-line-clamp:1;
					line-clamp:1;
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

		.newTips {
				min-width:100px;
				height: 22px;
				line-height: 22px;
				text-align: center;
				background: rgba(44, 188, 240, 0.8);
				border-radius: 10px 0 0 10px;
				font-size: 12px;
				color: #fff;
				position: absolute;
				right: 0;
				top:200px;
				cursor: pointer;
			}
			.fade-enter-active, .fade-leave-active {
				transition: opacity .5s;
			}
			.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
				opacity: 0;
			}
	}
	
</style>
<style lang="scss" type="text/scss">
	.video-js{
		width: 100%;
		height: 100%;
	}

	.videoEnd {
		height: 15em;
		background: #000;

		p {
			line-height: 15em;
			color: #fff;
			text-align: center;
		}
	}
</style>
<style>
.eleImg {
	vertical-align: bottom ;
}
</style>