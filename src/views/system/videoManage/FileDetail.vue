<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" content="课程详情"></el-page-header></p>
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			<el-menu-item index="0" class="menu-item">基础信息</el-menu-item>
			<el-menu-item index="1" v-if="detailInfo.publicVod == 1">公网点播</el-menu-item>
		</el-menu>
		<div class="content-wrap scroll-wrap" v-if='activeIndex == 0'>
				<ul class="detail-list">
					<li>
						<p class="title">课程名称：</p>
						<p class="value">{{detailInfo.name}}</p>
						<p v-if="detailInfo.status == 3" style="cursor: pointer;font-size: 14px;color: #5B8CFF;" @click="openChangeName">修改</p>
					</li>
					<li>
						<p class="title">课程分类：</p>
						<p v-if="detailInfo.labelNameList && detailInfo.labelNameList.length > 0" class="value">{{ detailInfo.categoryName }} -- {{labelString}}</p>
						<p v-else class="value">{{ detailInfo.categoryName }}</p>
						<!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
					</li>
					<li>
						<p class="title">创建者：</p>
						<p class="value">{{detailInfo.createUserName}}</p>
					</li>
					<li>
						<p class="title">上传时间：</p>
						<p class="value">{{detailInfo.createDate}}</p>
					</li>
					<li>
						<p class="title">观看授权：</p>
						<p class="value">{{detailInfo.groupName}}</p>
						<el-button v-if="!$route.query.val" type="primary" class="detail-btn" @click="auditDetailShow = true">修改</el-button>
					</li>
					<li>
						<p class="title">课程状态：</p>
						<p class="value">{{videoState}}</p>
					</li>
					<li v-if="detailInfo.status === 3">
						<p class="title">观看地址：</p>
						<p class="value">{{playUrl}}</p>
						<p @click="copyShaneUrl(playUrl)" class="copy-url">复制链接</p>
					</li>
					<li class="li eduLi" v-if="!$route.query.val">
						<p class="title">教学文件：</p>
						<el-upload
							ref="edufileupload"
							:action="eduFileUrl"
							class="upload-edufile"
							accept=".ppt,.pptx,.pdf,.doc,.docx,.jpg,.png,.zip,.rar,.xls,.xlsx"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							:before-upload="eduBeforeupload"
							:multiple="false"
							:with-credentials="true"
							:limit="5"
							:on-exceed="handleExceed"
							:on-error="handleEduError"
							:on-success="handleEduSuccess"
							:file-list="edufileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传ppt/word/pdf/jpg/png/xls/zip/rar教学相关文件，大小需小于50M</div>
						</el-upload>
						<!-- <el-button size="small" type="primary" class="subBtn" @click="eduOptionSub" v-show="teachingFileId">提交</el-button> -->
					</li>
				</ul>
		
			<div class="video-wrap" v-if="detailInfo.status == 3">
				<div class="content">
					<img :src="imgUrl" alt="">
					<div class="live-hover" v-show="detailInfo.status == 3" @click="toPlay">
						<i class="el-icon-video-play" style="cursor: pointer;"></i>
					</div>
				</div>
				<div class="btn-wrap">
					<el-button type="primary" @click="qrcodeShow = true">分享海报</el-button>
				</div>
			</div>
		</div>
		
		<div class="content-wrap scroll-wrap" v-if='activeIndex == 1'>
			<ul class="detail-list">
					<li>
						<p class="title">课程名称：</p>
						<p class="value">{{publicDetail.name}}</p>
					</li>
					<li>
						<p class="title">观看授权：</p>
						<p class="value">{{publicDetail.watchType === 0 ? "所有人可观看" : "密码观看"}}</p>
						<el-button type="primary" class="detail-btn" @click="auditPublicShow = true">修改</el-button>
					</li>
					<li>
						<p class="title">授权码：</p>
						<p class="value">{{publicDetail.watchType === 1 && publicDetail.watchPassword ? publicDetail.watchPassword : '无'}}</p>
					</li>
					<li>
						<p class="title">观看地址：</p>
						<p class="value">{{pcUrl}}</p>
						<p @click="copyShaneUrl(pcUrl)" class="copy-url" v-if="pcUrl != '暂无'">复制链接</p>
					</li>
					<li>
						<p class="title">二维码观看：</p>
						<vueQr :text="Hur" :size="60" :margin="0" v-if="pcUrl != '暂无'"></vueQr>
						<p class="value" v-if="pcUrl == '暂无'">{{pcUrl}}</p>
					</li>
				</ul>

				<div class="video-wrap" v-if="publicDetail.status == 1">
					<div class="content">
						<img :src="imgUrl" alt="">
						<p class="video-status" v-if="publicDetail.status == 1"><i class="iconfont icon-livebroadcast" style="cursor: pointer;"></i>公网点播</p>
						<div class="live-hover" @click="toCloudPlay(pcUrl)">
							<i class="el-icon-video-play"></i>
						</div>
					</div>
					<div class="btn-wrap">
						<el-button type="primary" @click="cloudqrcodeShow = true">分享海报</el-button>
					</div>
				</div>
		</div>
		<el-dialog
			title="观看授权"
			:close-on-click-modal="false"
			:visible.sync="auditDetailShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>观看授权</p>
					<p><em>*</em>：</p>
					<el-select v-model="detailInfo.groupId" placeholder="请选择用户组" class="width-2" style="margin-right: 2px">
						<el-option
							v-for="item in groupList"
							:key="item.id"
							:label="item.groupName"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="auditUpdate">确 定</el-button>
					<el-button @click="auditDetailShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog
			title="修改课程名称"
			:close-on-click-modal="false"
			:visible.sync="changeNameShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>课程名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" placeholder="请输入课程名称" v-model="detailName"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="setName">确 定</el-button>
					<el-button @click="closeChangeName">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog
			title="二维码分享"
			:close-on-click-modal="false"
			:visible.sync="qrcodeShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="qrcode-wrap" ref="downloadShare">
					<img :src="imgUrl" alt="">
					<div class="content">
						<div class="text-wrap">
							<p>{{detailInfo.name}}</p>
							<p class="sec-p">{{detailInfo.createUserName}}</p>
							<p class="sec-p">扫码进入课堂学习</p>
						</div>
						<div class="qrcode-img">
							<vueQr :text="mobilePlayUrl" :size="60" :margin="0"></vueQr>
							<!-- <vueQr :text="mobilePlayUrl" v-show="false" ref="Qrcode"  :size="320"></vueQr> -->
						</div>
					</div>
				</div>
				
				<div class="dialog-btn">
					<el-button type="primary" @click="downLoadCode">下载海报</el-button>
					<el-button @click="qrcodeShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>

    <!-- 公网点播观看权限修改 -->
		<el-dialog
			title="观看权限修改"
			:close-on-click-modal="false"
			:visible.sync="auditPublicShow"
			:before-close="closePublicVod"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>观看权限</p>
					<p><em>*</em>：</p>
					<el-select v-model="watchType" placeholder="请选择用户组" class="width-2" style="margin-right: 2px" filterable>
						<el-option v-for="item in auditList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>

				<div class="dialog-item" v-if="watchType === 1">
					<p>观看密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" placeholder="请输入观看密码" v-model="watchPassword" show-password></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleAuditUpdate">确 定</el-button>
					<el-button @click="handlqCancel">取 消</el-button>
				</div>
			</div>
		</el-dialog>

		<!-- 公网点播二维码 -->
		<el-dialog
			title="二维码分享"
			:close-on-click-modal="false"
			:visible.sync="cloudqrcodeShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="qrcode-wrap" ref="publicShare">
					<img :src="imgUrl" alt="">
					<div class="content">
						<div class="text-wrap">
							<p>{{publicDetail.name}}</p>
							<p class="sec-p">{{detailInfo.createUserName}}</p>
							<p class="sec-p">扫码进入公网点播</p>
						</div>
						<div class="qrcode-img">
							<vueQr :text="Hur" :size="60" :margin="0"></vueQr>
							<!-- <vueQr :text="Hur" v-show="false" ref="QrcodeCloud"  :size="320"></vueQr> -->
						</div>
					</div>
				</div>

				<div class="dialog-btn">
					<el-button type="primary" @click="downLoadCodeCloud">下载海报</el-button>
					<el-button @click="cloudqrcodeShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import vueQr from 'vue-qr';
	import html2canvas from "html2canvas";
	import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				changeNameShow: false,
				detailName: '',
				detailInfo: {},
				publicDetail: {}, // 公网点播详情
				groupList: [],
				auditDetailShow: false, // 基础信息权限
				qrcodeShow: false,
				playUrl: '',
				mobilePlayUrl: '',

				activeIndex: '0',
				pcUrl:'', // AI 课堂培枢云播放
				Hur:'', // AI 课堂培枢云h5播放
				auditPublicShow:false,  // 公网点播权限
				watchType:'', // 公网点播权限类型
				watchPassword:'', // 公网点播密码
				cloudqrcodeShow:false, // 海报分享

				auditList:[
					{
						id:0,
						name:'所有人'
					},
					{
						id:1,
						name:'授权码观看'
					}
				],
				eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
				edufileList:[], // 已上传文件数组
				delBtn:[], // 控制按钮
				teachingFileId:'', // 文件提交id
			}
		},
		components: {vueQr},
		mounted() {
			this.getDetailInfo(); // 获取基础信息
			this.getgroupList();
		},
		methods: {
			closeChangeName(){
				this.detailName = ''
				this.changeNameShow = false
				this.getDetailInfo();
			},
			setName(){
				if (this.$verify.isEmpty(this.detailName)) {
					this.$message('请输入课程名称', 'error');
					return
				}
				if (this.detailName.length > 20) {
					this.$message('课程名称不能超过20字', 'error');
					return
				}
				let data = new FormData()
				data.append('id', this.detailInfo.id)
				data.append('name', this.detailName)
				this.$axios.post('/sm/file/edit', data).then(res => {
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
			// 移除文件
			handleRemove(file, fileList) {
				if(fileList.length == 0){
					this.teachingFileId = ''
				}
      },
			// 文件数量限制
      handleExceed(files, fileList) {
        this.$message(`当前限制选择 5 个文件`,'error');
      },
			// 移除文件之前
      beforeRemove(file, fileList) {
				const max = 1024*1024   // 1M
				if((file.size/max)>50){
					return true
				}else if(this.teachingFileId){
					let currentLength = []
					Object.assign(currentLength,fileList.filter(item => {
						if(item.percentage == 0 || item.percentage){
							return item
						}
					}))
					if(currentLength.length == 1){
						this.teachingFileId = ''
					}
					return true
				}else{
					let id = ''
					if(file.response){
					 id = file.response.data.id;
					}else {
						id = file.id;
					}	
					return this.$confirm(`确定移除 ${ file.name }？`, '删除提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(file.percentage && file.percentage !== 100){
								// 未上传成功取消请求
								this.$refs.edufileupload.abort();
								return true;
							}
							this.deleteEduFile(id);
						}).catch(() => reject());
				}
      },
			// edu上传之前
			eduBeforeupload(file) {
				if(this.teachingFileId){
					this.$message('请先提交当前文件','error')
					return false
				}
				const max = 1024*1024   // 1M
				if((file.size/max)>50){
					this.$message('单个文件不得超过50M','error')
					return false
				}
			},
			// 上传文件的错误回调
			handleEduError(error, file, fileList) {
				let errorM = JSON.parse(error.message)
				this.$message(errorM.message,'error')
			},
			// 上传文件的成功回调
			handleEduSuccess(response, file, fileList) {
				if(response.code == 200){
					this.teachingFileId = response.data.id;
					this.eduOptionSub();
				}
			},
			// 提交当前文件
			eduOptionSub() {
				let data = {
					id:this.$route.query.themeid,
					teachingFileId:this.teachingFileId
				}
				this.$axios.post('/sm/file/commitTeachingFile', data).then(res => {
					if(res.code == 200){
						this.teachingFileId = '';
						this.$message('上传成功','success')
					}
				})
				// this.$confirm(`确定提交文件？`, '提示', {
				// 			confirmButtonText: '确定',
				// 			cancelButtonText: '取消',
				// 			type: 'warning'
				// 		}).then(() => {
							
				// 		}).catch((err) => console.log(err));
			},
			// 删除上传的文件
			deleteEduFile(id) {
				this.$axios.post('/upload/deleteTeachingFile', {id:id}).then(res => {
					if(res.code == 200){
						// 如果删除当前，不显示提交
						if(id === this.teachingFileId){
							this.teachingFileId = ''; 
						}
					}
				})
			},
			// 关闭公网点播清空密码
			closePublicVod() {
				this.watchPassword = '';
				this.auditPublicShow = false;
			},
			//切换信息
			handleSelect(index){
				this.activeIndex = index;
			},
			//直接跳转播放页
			toPlay(){
				window.open(this.playUrl, '_blank');
			},
			//公网直接跳转播放页
			toCloudPlay(url){
				window.open(url, '_blank');
			},
			// 公网点播修改权限
			handleAuditUpdate() {
				if (this.watchType === 1) {
					if (!this.watchPassword) {
						this.$message('请设置公网观看密码', 'error');
						return;
					}
					if (this.$verify.checkNumEn(this.watchPassword,4,20)) {
						this.$message('公网观看密码须4-20位数字或字母或二者组成', 'error');
						return;
					}
				}
				this.$axios.post("/sm/file/changeWatchType", {
					fileId: this.$route.query.themeid,
					watchType: this.watchType,
					watchPassword: this.watchPassword
				}).then(res => {
					if (res.code === 200) {
						// this.getPulicPodInfo();
						this.$message('修改成功', 'success');
						this.auditPublicShow = false;
						this.getPulicPodInfo();
					} 
				});
			},
			handlqCancel() {
				this.auditPublicShow = false;
				this.watchType = 0;
				this.watchPassword = "";
			},
			//获取详情-基础信息
			getDetailInfo(){
				this.$axios.get('/sm/file/info', {id: this.$route.query.themeid}).then(res => {
					this.detailInfo = res.data;
					if(this.edufileList.length == 0) {
						this.edufileList = res.data.teachingFileList; // 教学文件
					}
					if(res.data.publicVod == 1){
						this.getPulicPodInfo(); // 获取公网信息
					}
					this.creatPlayUrl();
				});
			},
			// 获取详情-公网点播
			getPulicPodInfo() {
				this.$axios.get('/sm/file/cloudInfo', {fileId: this.$route.query.themeid}).then(res => {
					if (res.code === 200 && res.data) {
						const data = res.data;
						this.publicDetail = data;
						this.watchType = data.watchType;
						this.watchPassword = data.watchPassword;
						this.pcUrl = data.watchId ? `${data.watchUrl}/vodplay?id=${data.watchId}` : '暂无';
						this.Hur = `${data.watchUrl}/vodmobile?id=${data.watchId}`;
					}
				});
			},
			//播放地址
			creatPlayUrl(){
				this.playUrl = location.origin + '/vplay' + location.search + '&type=2';
				this.mobilePlayUrl = location.origin + '/mobile/vplay' + location.search + '&type=2';
			},
			//获取用户组列表
			getgroupList(){
				this.$axios.get('/sm/theme/getSysGroup').then(res => {
					this.groupList = res.data;
				});
			},
			//修改授权
			auditUpdate(){
				this.$axios.post('/sm/file/updateGroup', {
					id: this.$route.query.themeid,
					groupId: this.detailInfo.groupId,
				}).then(res => {
					if(res.code == 200){
						this.getDetailInfo();
						this.auditDetailShow = false;
						this.$message('修改成功', 'success');
					}
				});
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
			//下载海报
			downLoadCode(){
				html2canvas(this.$refs.downloadShare).then(canvas => {
          let dataURL = canvas.toDataURL("image/png");
         	let a = document.createElement('a');
					let event = new MouseEvent('click');
					a.download = this.detailInfo.name;
					a.href = dataURL
					a.dispatchEvent(event);
        });
			},
			//下载公网海报
			downLoadCodeCloud() {
				// const iconUrl = this.$refs.QrcodeCloud.$el.src;
				html2canvas(this.$refs.publicShare,{
					allowTaint:false, useCORS:true
				}).then(canvas => {
          let dataURL = canvas.toDataURL("image/png");
         	let a = document.createElement('a');
					let event = new MouseEvent('click');
					a.download = this.detailInfo.name;
					a.href = dataURL
					a.dispatchEvent(event);
        });
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
		computed: {
			// 分类字符串
			labelString(){
				if(this.detailInfo.labelNameList && this.detailInfo.labelNameList.length > 0){
					return this.detailInfo.labelNameList.join(',')
				}else {
					return '暂无细分'
				}
			},
			videoState() {
				switch (this.detailInfo.status) {
					case 0:
						return '待提交';
					case 1:
						return '待审核';
					case 2:
						return `驳回 (驳回理由：${this.detailInfo.rejectReason ? this.detailInfo.rejectReason : '无理由'})`;
					case 3:
						return '已发布';
					case -1:
						return '处理中';
					case -2:
						return '处理失败';
					default:
						return '-';
				}
			},

			imgUrl() {
				return this.detailInfo.imgUrl; // 均用基本详情图片
			},

		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.content-wrap{
		height: 80%;
		display: flex;
	}
	.menu-item{
		margin-left: 70px;
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
		flex-direction: column;
		margin: 18% 0 0 9%;
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
		.btn-wrap{
			display: flex;
			justify-content: center;
			button{
				width: 116px;
			}
			.last-btn{
				margin-left: 18px;
			}
		}
	}
	.qrcode-wrap{
		margin-bottom: 30px;
		text-align: center;
		img{
			width: 328px;
			height: 185px;
		}
		.content{
			display: flex;
			width: 330px;
			margin-top: -2px;
			box-sizing: border-box;
			padding: 16px 20px 14px 20px;
			font-size: 18px;
			background: #85C1FF;
			color: #fff;
			.text-wrap{
				flex: 1;
				text-align: left;
				line-height: 25px;
				p:first-child{
					// -webkit-line-clamp:1;
					line-clamp:1;
					width: 193px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space:nowrap
				}
				.sec-p{
					font-size: 14px;
				}
			}
			.qrcode-img{
				width: 72px;
				height: 72px;
				margin-left: 25px;
				background: #fff;
				img{
					width: 60px;
					height: 60px;
					margin: 6px;
				}
			}
		}
	}
</style>

<style lang="scss">
.eduLi {
	position: relative;
}
.el-upload__tip {
	height: 13px;
	line-height: 13px;
}
.eduLi .subBtn {
		position: absolute;
		bottom: 0px !important;
		left: 426px;
	}
.upload-edufile .el-upload-list__item-name {
		overflow: hidden;
    width: 280px;
    text-overflow: ellipsis;
	}
.upload-edufile .el-icon-close-tip {
	display: none !important;;
	right: -110px;
}
</style>