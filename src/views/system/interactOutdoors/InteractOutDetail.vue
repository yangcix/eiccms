<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" content="主题详情"></el-page-header></p>
		
		<div class="content-wrap scroll-wrap">
			<ul class="detail-list">
				<li>
					<p class="title">主题名称：</p>
					<p class="value">{{detailInfo.name}}</p>
				</li>
				<li>
					<p class="title">主题分类：</p>
					<p class="value">{{ detailInfo.categoryName }}</p>
					<!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
				</li>
				<li>
					<p class="title">开始时间：</p>
					<p class="value">{{detailInfo.startTime}}</p>
				</li>
				<li>
					<p class="title">结束时间：</p>
					<p class="value">{{detailInfo.endTime}}</p>
				</li>
				<li>
					<p class="title">主讲教师：</p>
					<p class="value">{{detailInfo.lecturer}}</p>
				</li>
				<!-- <li>
					<p class="title">主讲学校：</p>
					<p class="value">{{detailInfo.founder}}</p>
					<p class="title" v-if="version === '1' || version === '2'">验证密码：</p>
					<p class="value" v-if="version === '1' || version === '2'">{{111111}}</p>
				</li> -->
				<li v-for="(item,index) in detailInfo.extendList" :key='item.id'>
					<p class="title">{{item.type === 1 ? '主讲学校：' : `互动学校${index}：`}}</p>
					<p class="value">{{item.schoolName}}</p>
					<p class="value" v-if="item.type === 0">{{item.number}}间</p>
					<p class="title" v-if="version === '1' || version === '2'">验证密码：</p>
					<p class="value" v-if="version === '1' || version === '2'">{{item.password}}</p>
				</li>
				<!-- <li>
					<p class="title">直播加密：</p>
					<p class="value">开启</p>
				</li> -->
				<li>
					<p class="title">主题状态：</p>
					<p class="value">{{detailInfo.status | theme}} <span v-show="detailInfo.status == 3">理由：{{detailInfo.rejectReason}}</span></p>
				</li>
				<li>
					<p class="title">直播状态：</p>
					<p class="value">{{detailInfo.playStatus | live}}</p>
				</li>
				<li>
					<p class="title">课堂访问地址：</p>
					<p class="value">{{playUrl}}</p>
					<p @click="copyShaneUrl(playUrl)" class="copy-url">复制链接</p>
				</li>

				<!-- <li>
					<p class="title">房间流地址：</p>
					<div class="select">
						<p v-for="val in detailInfo.terminalList">{{val.classroomName}}： {{val.url}}<span @click="copyShaneUrl(val.url)">复制链接</span></p>
					</div>
				</li> -->
			</ul>
			
			<div class="video-wrap" v-if="detailInfo.playStatus == 0">
				<div class="content">
					<img :src="detailInfo.imgUrl" alt="">
					<p class="video-status"><i class="iconfont icon-livebroadcast"></i>授课中</p>
					<div class="live-hover" @click="toPlay">
						<i class="el-icon-video-play"></i>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: '',
		data() {
			return {
				detailInfo: {},
				playUrl: '',
				version: '' // 版本 1标准，2专业，3旗舰
			}
		},
		components: {},
		mounted() {
			this.version = localStorage.getItem('version')
			this.playUrl = window.origin + '/interactlogin?id=' + this.$route.query.themeid+'&type=1';
			this.getDetailInfo();
		},
		methods: {
			//编辑获取主体信息
			getDetailInfo(){
				this.$axios.get('/sys/crossSchoolInteraction/info', {id: this.$route.query.themeid}).then(res => {
					this.detailInfo = res.data;
				});
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
			//直播直接跳转播放页
			toPlay(){
				window.open(this.playUrl, '_blank');
			},
			//复制
			copyShaneUrl(shareLink){
				var input = document.createElement("input");
				input.value = shareLink;
				document.body.appendChild(input);
				input.select();
				document.execCommand("Copy");
				document.body.removeChild(input);
				this.$message('已复制到剪贴板', 'success');
			}
		},
		filters: {
			theme(val){
				let arr = ['待提交','待审核', '已发布','驳回'];;
				return arr[val];
			},
			live(val){
				let arr = ['授课中', '已结束', '未开始'];
				if(val == -1){
					return '-';
				}
				return arr[val];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.content-wrap{
		display: flex;
	}
	.scroll-wrap {
		height: 90%;
	}
	.detail-list{
		margin-left: 60px;
		li{
			display: flex;
			margin-top: 25px;
			line-height: 40px;
			font-size: 14px;
			.title{
				min-width: 70px;
				margin-right: 20px;
				color: #303133;
			}
			.value{
				margin-right: 15px;
				color: #606266;
			}
			.detail-btn{
				margin-left: 30px;
			}
			.copy-url{
				margin-left: 20px;
				color: #409EFF;
				cursor: pointer;
			}
		}
	}
	.dialog-item{
		p:first-child{
			width: 80px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
		}
	}
	.video-wrap{
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin-left: 9%;
		.content{
			position: relative;
			width: 250px;
			height: 167px;
			margin-bottom: 30px;
			.video-status{
				position: absolute;
				bottom: 0;
				left: 0;
				z-index: 5;
				width: 100%;
				line-height: 40px;
				text-align: center;
				background: rgba(0, 0, 0, .6);
				color: #fff;
				i{
					margin-right: 9px;
				}
			}
			img{
				display: block;
				width: 100%;
				height: 100%;
			}
			.live-hover{
				position: absolute;
				z-index: 3;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				text-align: center;
				line-height: 180px;
				background: rgba(0, 0, 0, .6);
				i{
					font-size: 40px;
					color: #fff;
				}
			}
		}
	}
	.select{
		padding-bottom: 30px;
		p{
			margin-bottom: 25px;
		}
		span{
			margin-left: 35px;
			color: #409EFF;
		}
	}
</style>
