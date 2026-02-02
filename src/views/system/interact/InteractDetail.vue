<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" content="主题详情"></el-page-header></p>
		
		<div class="content-wrap scroll-wrap">
			<ul class="detail-list">
				<li>
					<p class="title">主题名称：</p>
					<p class="value" style="max-width: 420px;">{{detailInfo.name}}</p>
					<p v-if="detailInfo.status == 4" style="cursor: pointer;font-size: 14px;color: #5B8CFF;" @click="openChangeName">修改</p>
				</li>
				<li class="li">
					<p class="title">主题分类：</p>
					<!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
					<p class="value" style="margin-right: 8px;">{{ detailInfo.categoryName }}</p>
					<p class="value" v-show="detailInfo.labelNameList.length>0" v-for="(val, index) in detailInfo.labelNameList" :key="index"><span style="margin-right: 8px;">—</span>{{val}}</p>
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
					<p class="title">创建者：</p>
					<p class="value">{{detailInfo.founder}}</p>
				</li>
				<li>
					<p class="title">主讲教师：</p>
					<p class="value">{{detailInfo.masterLists[0].orgName}}-{{detailInfo.masterLists[0].userName}}</p>
				</li>
				<li>
					<p class="title">听讲教师：</p>
					<p v-for="item in detailInfo.assistantLists" :key="item.userId" class="value">{{item.orgName}}-{{item.userName}}</p>
				</li>
				<!-- <li>
					<p class="title">直播加密：</p>
					<p class="value">开启</p>
				</li> -->
				<li>
					<p class="title">主题状态：</p>
					<p class="value">{{detailInfo.status | theme}} <span v-show="detailInfo.status == 3">(驳回理由：{{detailInfo.rejectReason ? detailInfo.rejectReason : '无理由'}})</span></p>
				</li>
				<li>
					<p class="title">课堂状态：</p>
					<p class="value">{{detailInfo.playStatus | live}}</p>
				</li>
				<li v-if="detailInfo.playStatus !== 1 && detailInfo.status == 4">
					<p class="title">旁听教室验证码：</p>
					<p class="value">{{detailInfo.auditPassword}}</p>
				</li>

				<li v-if="detailInfo.playStatus !== 1 && detailInfo.status == 4">
					<p class="title">旁听地址：</p>
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
					<p class="video-status"><i class="iconfont icon-livebroadcast"></i>正在上课</p>
					<div class="live-hover" @click="toPlay">
						<i class="el-icon-video-play"></i>
					</div>
				</div>
				<div class="btn-wrap" style="text-align: center;">
					<el-button type="primary" class="last-btn" @click="getSigna">互动信号详情</el-button>
				</div>
			</div>
			<div v-else-if="detailInfo.playStatus == 2" class="video-wrap">
				<div class="content" @click="toPlay">
					<img :src="detailInfo.imgUrl" alt="">
					<p class="video-status"><i class="iconfont icon-yugao"></i>预告中</p>
				</div>
			</div>
			<el-dialog
			title="互动信号详情"
			:close-on-click-modal="false"
			:visible.sync="signalShow"
			width="420px">
			<div class="dialog-wrap">
				<p>主讲教室:</p>
				<div style="margin: 10px">{{ mainsign && mainsign.url ? (mainsign.orgName + mainsign.buildingName + (mainsign.classroomName ? mainsign.classroomName : '') + ' — ' + mainsign.url) : '暂无信号数据' }}</div>
				<p>听讲教室：</p>
				<div v-if="signList.length > 0">
					<div v-for="(item, index) in signList" :key="index" style="margin: 10px">{{(item.orgName + item.buildingName + (item.classroomName ? item.classroomName : '') + ' — ' + item.url)}}</div>
				</div>
				<p v-else style="margin: 10px">暂无信号数据</p>
			</div>
		</el-dialog>
		<el-dialog
			title="修改主题名称"
			:close-on-click-modal="false"
			:visible.sync="changeNameShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>主题名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" placeholder="请输入主题名称" v-model="detailName"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="setName">确 定</el-button>
					<el-button @click="closeChangeName">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: '',
		data() {
			return {
				detailName: '',
				changeNameShow: false,
				detailInfo: {},
				playUrl: '',
				signalShow: false,
				mainsign: {},
				signList: []
			}
		},
		components: {},
		mounted() {
			this.getDetailInfo();
		},
		methods: {
			closeChangeName(){
				this.detailName = ''
				this.changeNameShow = false
				this.getDetailInfo();
			},
			setName(){
				if (!this.detailName) {
					this.$message('请输入主题名称', 'error');
					return
				}
				if (this.detailName.length > 50) {
					this.$message('主题名称不能超过50字', 'error');
					return
				}
				let data = new FormData()
				data.append('id', this.detailInfo.id)
				data.append('name', this.detailName)
				this.$axios.post('/sm/interactive/edit', data).then(res => {
					if(res.code == 200){
						this.closeChangeName()
						this.$message('修改成功','success')
					}
				})
			},
			openChangeName(){
				this.detailName = this.detailInfo.name;
				this.changeNameShow = true;
			},
			getSigna() {
				this.$axios.get('/sm/interactive/participateInfo', {id: this.detailInfo.id}).then(res => {
					if(res.code == 200){
						if(res.data.terminalList.length > 0) {
							let arr = [];
							res.data.terminalList.forEach(el => {
								if(el.role == 1) {
									this.mainsign = el;
								}else {
									arr.push(el);
								}
							});
							this.signList = arr;
						}
					}
				});
				this.signalShow = true;
			},
			//编辑获取主体信息
			getDetailInfo(){
				this.$axios.get('/sm/interactive/info', {id: this.$route.query.themeid}).then(res => {
					this.detailInfo = res.data;
					this.playUrl = window.origin + '/interactlogin?id=' + this.$route.query.themeid + '&isBystanderIn=1';
				});
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
			//直播直接跳转播放页
			toPlay(){
				let isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
				if (isChrome) {
					let playUrl
				let user = JSON.parse(localStorage.getItem('userInfo'));
				let type // 0主讲 1副讲 2旁听
				let isassis = this.detailInfo.assistantLists.find(el => {
					return el.userId == user.userId
				})
				if(this.detailInfo.masterLists[0].userId == user.userId){
					type = 0
				}else if(isassis){
					type = 1
				}else{
					type = 2
				}
				if(type == 0){
					playUrl = window.origin + `/mainroom?id=${this.detailInfo.id}`
					this.$router.push({path:'/mainroom', query: {id: this.detailInfo.id}})
					// window.open(playUrl,'target');
				}else if(type == 1){
					playUrl = window.origin + `/assistantroom?id=${this.detailInfo.id}`
					this.$router.push({path:'/assistantroom', query: {id: this.detailInfo.id}})
					// window.open(playUrl,'target');
				}else{
					// playUrl = window.origin + `/assistantroom?id=${this.detailInfo.id}&isBystanderIn=1`
					this.$router.push({path:'/interactlogin', query: {id: this.detailInfo.id, isBystanderIn: 1}})
					// window.open(playUrl,'target');
				}
				} else {
					this.$alert("当前不是Chrome内核浏览器,请更换为chrome浏览器",'警告！',{type:'warning'})
					return
				}
				
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
				let arr = ['待提交','待审核', '待发布','驳回','已发布'];
				return arr[val];
			},
			live(val){
				let arr = ['授课中', '已结束', '预告中'];
				if(val == -1){
					return '——';
				}
				return arr[val];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.content-wrap{
		height: 94%;
		display: flex;
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
