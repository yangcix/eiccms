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
				<li>
					<p class="title">主题分类：</p>
					<!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
					<p class="value" style="margin-right: 8px;">{{ detailInfo.categoryName }}</p>
					<p class="value" v-show="detailInfo.labelNameList.length>0" v-for="(val, index) in detailInfo.labelNameList" :key="index"><span style="margin-right: 8px;">—</span>{{val}}</p>
				</li>
				<li>
					<p class="title">课堂时间：</p>
					<div style="display: flex;flex-direction: column">
						<p class="value" v-for="(item, index) in detailInfo.timeLists" :key="index"><span>{{item.week | week}}   </span><span>{{ item.startTime + ' — ' + item.endTime }}</span></p>
					</div>
				</li>
				<li>
					<p class="title">课程进度：</p>
					<div style="display: flex;">
						<!-- <p class="value" v-if="detailInfo.numCount == 0">未开始</p> -->
						<!-- <p class="value" v-else>第{{ detailInfo.numCount }}课</p> -->
						<p class="value" v-if="detailInfo.numCount">第{{ detailInfo.numCount }}课</p>
						<p v-else> —— </p>
						<p class="value detail" v-if="detailInfo.numCount" @click="classDetailShow = true">查看详情</p>
					</div>
				</li>
				<li>
					<p class="title">开课时间：</p>
					<p v-if="detailInfo.status == 4" class="value">{{detailInfo.startTime ? detailInfo.startTime : '课程已结束'}}</p>
					<p v-else>——</p>
				</li>
				<li>
					<p class="title">课程结束时间：</p>
					<!-- <p v-if="detailInfo.playStatus == null" class="value">{{detailInfo.modifyDate}}</p> -->
					<p v-if="detailInfo.status == 4" class="value">{{detailInfo.playStatus === null ? detailInfo.modifyDate : '待定'}}</p>
					<p v-else>——</p>
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
					<p v-if="detailInfo.themeStatus == 0" class="value">{{detailInfo.status | theme}} <span v-show="detailInfo.status == 3" >(驳回理由：{{detailInfo.rejectReason? detailInfo.rejectReason : '无理由'}})</span></p>
					<p v-else class="value">已发布</p>
				</li>
				<li>
					<p class="title">课堂状态：</p>
					<p v-if="detailInfo.playStatus !== null" class="value">{{detailInfo.playStatus | live}}</p>
					<p v-else>{{detailInfo.themeStatus == 0 ? '——' : '已结束'}}</p>
				</li>
				<li v-if="detailInfo.playStatus == 0 || detailInfo.playStatus == 2">
					<p class="title">旁听教室验证码：</p>
					<p class="value">{{detailInfo.auditPassword}}</p>
				</li>

				<li v-if="detailInfo.playStatus == 0 || detailInfo.playStatus == 2">
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
			
			<div class="video-wrap" v-if="detailInfo.themeStatus == 0 && (detailInfo.playStatus == 0 || detailInfo.playStatus == 2)">
				<div v-if="detailInfo.playStatus == 0" class="content">
					<img :src="detailInfo.imgUrl" alt="">
					<p class="video-status"><i class="iconfont icon-livebroadcast"></i>授课中</p>
					<div class="live-hover" @click="toPlay">
						<i class="el-icon-video-play"></i>
					</div>
				</div>
				<div v-else class="content" @click="toPlay">
					<img :src="detailInfo.imgUrl" alt="">
					<p class="video-status"><i class="iconfont icon-yugao"></i>预告中</p>
				</div>
				<div class="btn-wrap" style="text-align: center;">
					<el-button type="primary" v-if="detailInfo.playStatus == 0" class="last-btn" @click="getSigna">互动信号详情</el-button>
					<el-button type="primary" class="last-btn" @click="endLiveShow = true">结束课程</el-button>
					<!-- <el-button type="primary" v-if="permission.finishAll" class="last-btn" @click="endLiveShow = true">结束课程</el-button> -->
				</div>
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
			title="课程详情"
			:close-on-click-modal="false"
			:visible.sync="classDetailShow"
			class="classDetail"
			width="420px">
			<div class="dialog-wrap">
				<el-divider></el-divider>
				<p class="title-size" style="font-weight: 600;font-size: 20px;margin-bottom: 20px;">{{detailInfo.name}}</p>
				<div class="class-detail-title">
					<div style="text-align: center;">
						<span class="title-size" style="font-size: 17px;">{{detailInfo.masterLists[0].orgName}}</span>
						<br>
						<span>{{detailInfo.masterLists[0].userName}}</span>
					</div>
					<span style="font-weight: 700;">——————</span>
					<div>
						<div class="title-box" v-for="(item, index) in detailInfo.assistantLists" :key="index" style="margin-bottom: 10px;"><span class="title-size" style="font-size: 17px;">{{item.orgName}}</span><span style="margin-left: 5px">{{item.userName}}</span></div>
					</div>
				</div>
				<p v-if="detailInfo.infoLists.length == 0" style="text-align: center">暂无课程</p>
				<div v-else class="class-content">
					<div v-for="(item, index) in detailInfo.infoLists" :key="index" class="class-content-item"><span>第{{index + 1}}课</span><span>{{item.playStatus | live}}</span><span>{{item.startTime}}</span></div>
					<p v-if="detailInfo.playStatus == 0" style="text-align: center">未完待续...</p>					
				</div>
			</div>
		</el-dialog>
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="endLiveShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认结束课程？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="endSubmit">确 定</el-button>
					<el-button @click="endLiveShow = false">取 消</el-button>
				</div>
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
</template>

<script>
	export default {
		name: '',
		data() {
			return {
				detailName: '',
				changeNameShow: false,
				signalShow: false,
				classDetailShow: false,
				endLiveShow: false,
				detailInfo: {},
				playUrl: '',
				mainsign: {},
				signList: [],
				permission: []
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
				this.$axios.post('/sm/habitus/edit', data).then(res => {
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
				if(!this.detailInfo.interactiveHabitId){
					this.signalShow = true;
					return;
				}
				this.$axios.get('/sm/interactive/participateInfo', {id: this.detailInfo.interactiveHabitId}).then(res => {
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
			endSubmit() {
				this.$axios.post('/sm/habitus/finishAll', {id: parseInt(this.$route.query.themeid)}).then(res => {
					if(res.code == 200){
						this.endLiveShow = false;
						this.$message('操作成功', 'success');
						this.getDetailInfo();
					}
				});
			},
			//编辑获取主体信息
			getDetailInfo(){
				let data = {
					pageNum: 1,
					pageSize: 10,
					habitusStatus: 0
				};
				this.$axios.get('/sm/habitus/list', data).then(res => {
					this.permission = this.creatPermit(res.data.permit);
				})
				this.$axios.get('/sm/habitus/info', {id: this.$route.query.themeid}).then(res => {
					this.detailInfo = res.data;
					this.playUrl = window.origin + '/normalInteractlogin?themeid='+ this.detailInfo.id +'&id=' + this.detailInfo.interactiveHabitId + '&isBystanderIn=1';
					// if((this.detailInfo.playStatus !== 1 && this.detailInfo.themeStatus !== 1) || this.detailInfo.numCount == 0) {
					// 	this.detailInfo.numCount = this.detailInfo.numCount + 1
					// }
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
				console.log(type,'111')
				if(type == 0){
					// this.$router.push({path:'/normalmainroom', query: {id: this.detailInfo.interactiveHabitId}})
					this.$router.push({path:'/normalmainroom', query: {themeid: this.detailInfo.id, id: this.detailInfo.interactiveHabitId}})
					// window.open(playUrl,'target');
				}else if(type == 1){
					// this.$router.push({path:'/normalassistantroom', query: {id: this.detailInfo.interactiveHabitId}})
					this.$router.push({path:'/normalassistantroom', query: {themeid: this.detailInfo.id, id: this.detailInfo.interactiveHabitId}})
					// window.open(playUrl,'target');
				}else{
					// playUrl = window.origin + `/normalInteractlogin?id=${this.detailInfo.id}&isBystanderIn=1`
					this.$router.push({path:'/normalInteractlogin', query: {themeid: this.detailInfo.id, id: this.detailInfo.interactiveHabitId, isBystanderIn: 1}})
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
				let arr = ['授课中', '已结束','预告中', ];
				if(val == -1){
					return '——';
				}
				return arr[val];
			},
			week(val){
				let arr = [ '每周日', '每周一', '每周二', '每周三', '每周四', '每周五', '每周六'];
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
			min-width: 600px;
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
	.last-btn{
		width: 120px;
	}
	.detail{
		cursor: pointer;
		color: #469AD7 !important;
	}
	.class-detail-title{
		padding: 10px 0;
		display: flex;
		justify-content: space-between;
		.title-box{
			display: flex;
			flex-direction:column;
		}
	}
	.title-size{
		font-size: 18px;
	}
	.class-content{
		height: 365px;
		overflow: auto;
	}
	.class-content-item{
		padding: 10px 20px;
		display: flex;
		justify-content: space-between;
	}
	.classDetail{
		::v-deep .el-dialog__body {
			padding:0px 20px 30px 20px;
		}
	}
</style>
