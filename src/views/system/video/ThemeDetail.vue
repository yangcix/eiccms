<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" content="主题详情"></el-page-header></p>
		
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			<el-menu-item index="0" class="menu-item">基础信息</el-menu-item>
			<el-menu-item index="1" v-if="detailInfo.publicLive == 1">公网直播</el-menu-item>
			<el-menu-item index="2" v-if="detailInfo.liveStatus == 2">直播数据</el-menu-item>
		</el-menu>
		<div v-if="activeIndex == 0" style="height: 100%">
			<div class="content-wrap scroll-wrap">
				<ul class="detail-list">
					<li class="li">
						<p class="title">主题名称：</p>
						<p class="value" style="max-width: 420px;word-break: break-all;">{{detailInfo.name}}</p>
						<p v-if="detailInfo.status == 4 && !$route.query.val" style="cursor: pointer;font-size: 14px;color: #5B8CFF;" @click="openChangeName">修改</p>
					</li>
					<li class="li" v-if="!$route.query.val">
						<p class="title">主题分类：</p>
						<!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
						<p class="value" style="margin-right: 8px;">{{ detailInfo.categoryName }}</p>
						<p class="value" v-show="detailInfo.labelNameList.length>0" v-for="(val, index) in detailInfo.labelNameList" :key="index"><span style="margin-right: 8px;">—</span>{{val}}</p>
					</li>
					<li class="li">
						<p class="title">开始时间：</p>
						<p class="value">{{detailInfo.startTime}}</p>
					</li>
					<li class="li">
						<p class="title">结束时间：</p>
						<p class="value">{{detailInfo.endTime}}</p>
					</li>
					<li class="li">
						<p class="title">授课教师：</p>
						<p class="value">{{detailInfo.teacherName}}</p>
					</li>
					<li class="li">
						<p class="title">观看授权：</p>
						<p class="value">{{detailInfo.groupName}}</p>
						<el-button v-if="!$route.query.val" type="primary" class="detail-btn" @click="openChange">修改</el-button>
					</li>
					<li class="li" v-if="detailInfo.groupId == 1 && detailInfo.password !== ''">
						<p class="title">观看密码：</p>
						<p class="value">{{detailInfo.password}}</p>
					</li>
					<li class="li">
						<p class="title">直播录制：</p>
						<p class="value">{{detailInfo.recode | recode}}</p>
						<!-- <p class="value" v-for="val in detailInfo.terminalList" v-show="val.recode">{{val.terminalName}}</p> -->
					</li>
					<!-- <li class="li" v-if="detailInfo.recode === 1">
						<p class="title">录制机位：</p>
						<p class="value" v-for="(val, index) in detailInfo.terminalList" :key="index"><span v-if="val.recode === 1">{{val.terminalName}}</span></p>
					</li> -->
					<li class="li" v-if="!$route.query.val">
						<p class="title">直播模式：</p>
						<p class="value">{{detailInfo.liveMode | liveMode}}</p>
					</li>
					<li class="li">
						<p class="title">直播加密：</p>
						<p class="value">开启</p>
					</li>
					<li class="li" v-if="detailInfo.liveMode == 1 && detailInfo.terminalList.length > 0">
						<p class="title">直播位置：</p>
						<p class="value">{{detailInfo.terminalList[0].schoolName}}—{{detailInfo.terminalList[0].buildName}}—{{detailInfo.terminalList[0].className}}</p>
					</li>
					<li class="li" v-if="detailInfo.liveMode == 1 && detailInfo.terminalList.length > 0">
						<p class="title">直播设备：</p>
						<p class="value">{{detailInfo.terminalList[0].terminalName}}</p>
					</li>
					<li class="li">
						<p class="title">最大在线人数：</p>
						<p class="value">{{detailInfo.maxOnline}}</p>
					</li>
					<li class="li" v-if="detailInfo.liveMode === 1">
						<p class="title">互动讨论：</p>
						<p class="value">
							<el-switch
								:active-value=1
								:inactive-value=0
								v-model="detailInfo.interactiveStatus"
								@change="chatSwitchFun"
								>
							</el-switch>
						</p>
					</li>
					<li class="li" v-if="!$route.query.val">
						<p class="title">主题状态：</p>
						<p class="value">{{detailInfo.status | theme}} <span v-show="detailInfo.status == 3">(驳回理由：{{detailInfo.rejectReason ? detailInfo.rejectReason : '无理由'}})</span></p>
					</li>
					<li v-if="(detailInfo.recode == 0 && detailInfo.liveStatus == 2) || detailInfo.status !== 4 "></li>
					<li v-else class="li">
						<p class="title">观看地址：</p>
						<p class="value">{{playUrl}}</p>
						<p @click="copyShaneUrl(playUrl)" class="copy-url">复制链接</p>
					</li>
					<div v-if="detailInfo.liveMode === 1 && detailInfo.streamMode == 0 && detailInfo.terminalList.length > 0">
						<li v-if="detailInfo.liveStatus == 2" class="li">
							<p class="title">机位地址：</p>
							<div class="select">
								<p v-for="(val,index) in detailInfo.terminalList" :key="index" class="copy-url" v-if="val.playbackUrl && val.recode === 1">{{val.terminalName}}： {{val.playbackUrl}}<span @click="copyShaneUrl(val.playbackUrl)">复制链接</span></p>
							</div>
						</li>
						<div v-else>
							<li class="li">
								<p class="title">机位地址：</p>
								<div class="select">
									<p v-for="(val,index) in detailInfo.terminalList" :key="index" class="copy-url">{{val.terminalName}}： {{val.rtmp}}<span @click="copyShaneUrl(val.rtmp)">复制链接</span></p>
								</div>
							</li>
						</div>
					</div>
					<li class="li" v-if="!$route.query.val">
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
					</li>
				</ul>
				
				<div class="video-wrap" v-if="detailInfo.status == 4">
					<div class="content">
						<img :src="detailInfo.imgUrl" alt="">
						<p class="video-status" v-if="detailInfo.liveStatus == 0">预告中</p>
						<p class="video-status" v-if="detailInfo.liveStatus == 1"><i class="iconfont icon-livebroadcast"></i>授课中</p>
						<div v-if="detailInfo.recode == 0 && detailInfo.liveStatus == 2">
							
						</div>
						<div v-else class="live-hover" @click="toPlay(playUrl)">
							<i class="el-icon-video-play"></i>
						</div>
						
					</div>
					<div class="btn-wrap">
						<div v-if="detailInfo.recode == 0 && detailInfo.liveStatus == 2">

						</div>
						<el-button v-else type="primary" @click="qrcodeShow = true">分享海报</el-button>
						<el-button type="primary" class="last-btn" v-if="detailInfo.liveStatus == 0 && detailInfo.liveMode === 1 && !$route.query.val" @click="startLiveShow = true">开始直播</el-button>
						<el-button type="primary" class="last-btn" v-if="detailInfo.liveStatus == 1 && detailInfo.liveMode === 1 && !$route.query.val" @click="endLiveShow = true">结束直播</el-button>
						<!-- <el-button type="primary" class="last-btn" v-if="detailInfo.liveStatus == 0 && detailInfo.liveMode === 1 && !$route.query.val && permission.start" @click="startLiveShow = true">开始直播</el-button>
						<el-button type="primary" class="last-btn" v-if="detailInfo.liveStatus == 1 && detailInfo.liveMode === 1 && !$route.query.val && permission.stop" @click="endLiveShow = true">结束直播</el-button> -->
					</div>
				</div>
				<!-- <el-button size="small" type="primary" class="subBtn" @click="eduOptionSub" v-if="teachingFileId">提交</el-button> -->
			</div>
		</div>
		
		<div v-if="activeIndex == 1">
			<div class="content-wrap scroll-wrap">
				
				<ul class="detail-list">
					<li class="li">
						<p class="title">公网数据统计：</p>
					</li>
					<li class="li">
						<ul class="statistics">
							<li>
								<p><span>{{ cloudInfo.consumeTraffic ? cloudInfo.consumeTraffic : 0 }}</span>G</p>
								<p>消耗总流量</p>
							</li>
							<li>
								<p><span>{{ cloudInfo.watchCount ? cloudInfo.watchCount : 0 }}</span>次</p>
								<p>观看次数</p>
							</li>
							<li>
								<p><span>{{ cloudInfo.uniqueVisitor ? cloudInfo.uniqueVisitor : 0 }}</span>人</p>
								<p>观看总人数</p>
							</li>
						</ul>
					</li>
					<li class="li">
						<p class="title">主题名称：</p>
						<p class="value">{{cloudInfo.themeName}}</p>
					</li>
					<li class="li">
						<p class="title">开始时间：</p>
						<p class="value">{{cloudInfo.startTime}}</p>
					</li>
					<li class="li">
						<p class="title">结束时间：</p>
						<p class="value">{{ cloudInfo.endTime ? cloudInfo.endTime : "待定" }}</p>
					</li>
					<li class="li">
						<p class="title">观看授权：</p>
						<p class="value">{{cloudInfo.watchType === 0 ? "匿名" : "密码观看"}}</p>
						<el-button type="primary" class="detail-btn" @click="openChanges">修改</el-button>
					</li>
					<li class="li" v-if="cloudInfo.watchType !== 0">
						<p class="title">观看密码：</p>
						<p class="value">{{cloudInfo.watchPassword}}</p>
					</li>
					<li v-if="cloudInfo.watchId" class="li">
						<p class="title">观看地址：</p>
						<p class="value">{{ pcUrl }}</p>
						<p @click="copyShaneUrl(pcUrl)" class="copy-url">复制链接</p>
					</li>
				</ul>

				<div class="video-wrap" v-if="cloudInfo.liveStatus == 0 || cloudInfo.liveStatus == 1|| cloudInfo.liveStatus == 2">
					<div class="content">
						<img :src="cloudInfo.imgUrl" alt="">
						<p class="video-status" v-if="cloudInfo.liveStatus == 0">预告中</p>
						<p class="video-status" v-if="cloudInfo.liveStatus == 1"><i class="iconfont icon-livebroadcast"></i>授课中</p>
						<div class="live-hover" @click="toPlay(pcUrl)">
							<i class="el-icon-video-play"></i>
						</div>
					</div>
					<div class="btn-wrap">
						<el-button type="primary" @click="cloudqrcodeShow = true">分享海报</el-button>
						<el-button type="primary" class="last-btn" v-if="cloudInfo.liveStatus == 0 && cloudInfo.status == 1" @click="cloudStartLiveShow = true">继续公网直播</el-button>
						<el-button type="primary" class="last-btn" v-if="cloudInfo.liveStatus == 1" @click="cloudEndLiveShow = true">结束公网直播</el-button>
						<!-- <el-button type="primary" class="last-btn" v-if="cloudInfo.liveStatus == 0 && cloudInfo.status == 1 && permission.start" @click="cloudStartLiveShow = true">继续公网直播</el-button>
						<el-button type="primary" class="last-btn" v-if="cloudInfo.liveStatus == 1 && permission.stop" @click="cloudEndLiveShow = true">结束公网直播</el-button> -->
					</div>
				</div>

			</div>
		</div>
		<template v-if="activeIndex == 2">
			<ThemeStatistics></ThemeStatistics>
		</template>
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
		<el-dialog
			title="观看授权"
			:close-on-click-modal="false"
			:visible.sync="auditDetailShow"
			:before-close="clearAuditDetail"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>观看授权</p>
					<p><em>*</em>：</p>
					<el-select v-model="groupId" placeholder="请选择用户组" class="width-2" style="margin-right: 2px">
						<el-option
							v-for="item in groupList"
							:key="item.id"
							:label="item.groupName"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div v-show="groupId == 1" class="dialog-item">
					<p>观看密码</p>
					<p><em style="opacity: 0;">*</em>：</p>
					<el-input v-model="password" placeholder="请填写密码" class="width-2" style="margin-right: 2px">
					</el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="auditUpdate">确 定</el-button>
					<el-button @click="auditDetailShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 公网观看权限 -->
		<el-dialog
			title="观看权限修改"
			:close-on-click-modal="false"
			:visible.sync="cloudInfoShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>观看权限</p>
					<p><em>*</em>：</p>
					<el-select v-model="cloudGroupId" placeholder="请选择用户组" class="width-2" style="margin-right: 2px">
						<el-option label="匿名（用户可自由访问直播间）" value="0"></el-option>
						<el-option label="密码观看" value="1"></el-option>
					</el-select>
				</div>

				<div class="dialog-item" v-if="cloudGroupId === '1'">
					<p>观看密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" placeholder="请输入观看密码" v-model="cloudPassword" show-password></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleAuditUpdate">确 定</el-button>
					<el-button @click="handlqCancel">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="startLiveShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认提前开始直播？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="startEndLive(0)">确 定</el-button>
					<el-button @click="startLiveShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="endLiveShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认结束直播？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="startEndLive(1)">确 定</el-button>
					<el-button @click="endLiveShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>

		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="cloudStartLiveShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认继续公网直播？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleStartEndLive(0)">确 定</el-button>
					<el-button @click="cloudStartLiveShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="cloudEndLiveShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认结束公网直播？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleStartEndLive(1)">确 定</el-button>
					<el-button @click="cloudEndLiveShow = false">取 消</el-button>
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
					<img :src="detailInfo.imgUrl" alt="">
					<div class="content">
						<div class="text-wrap">
							<p>{{detailInfo.name}}</p>
							<p class="sec-p">授课老师名称:{{detailInfo.teacherName}}</p>
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
		
		<!-- 公网模块后续优化跟基础信息合并组件 -->
		<el-dialog
			title="二维码分享"
			:close-on-click-modal="false"
			:visible.sync="cloudqrcodeShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="qrcode-wrap" ref="publicShare">
					<img :src="cloudInfo.imgUrl" alt="">
					<div class="content">
						<div class="text-wrap">
							<p>{{cloudInfo.themeName}}<span>({{ (cloudInfo.liveStatus + 1) | liveStatus }})</span></p>
							<p class="sec-p">{{cloudInfo.orgName}} 授课老师名称: {{detailInfo.teacherName}}</p>
							<!-- <p class="sec-p">{{cloudInfo.founder}}</p> -->
							<p class="sec-p">扫码进入课堂学习</p>
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
	import { Message } from 'element-ui';
	import vueQr from 'vue-qr'
	import ThemeStatistics from './ThemeStatistics'
	import html2canvas from "html2canvas";
	import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				changeNameShow: false,
				detailName: '',
				permission: [],
				groupId: '',
				password: '',
				pcUrl: "",
				Hur: "",
				cloudStartLiveShow: false,
				cloudEndLiveShow: false,
				cloudqrcodeShow: false,
				cloudGroupId: "0", // 公网权限
				cloudPassword: "", // 观看密码
				cloudInfo: {}, // 公网直播信息
				detailInfo: {
					interactiveStatus:1 // 默认开启聊天
				},
				groupList: [],
				auditDetailShow: false,
				startLiveShow: false,
				endLiveShow: false,
				qrcodeShow: false,
				cloudInfoShow: false,
				playUrl: '',
				mobilePlayUrl: '',
				activeIndex: '0',
				eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
				edufileList:[], // 上传文件数组
				teachingFileId:'' // 文件提交id
			}
		},
		components: {vueQr, ThemeStatistics},
		mounted() {
			this.getDetailInfo();
			this.getgroupList();
		},
		methods: {
			closeChangeName(){
				this.detailName = ''
				this.changeNameShow = false
				this.getDetailInfo()
			},
			setName(){
				if (!this.detailName) {
					this.$message('请输入主题名称', 'error');
					return
				}
				if (this.detailName.length > 100) {
					this.$message('主题名称不能超过100字', 'error');
					return
				}
				let data = new FormData()
				data.append('id', this.detailInfo.id)
				data.append('name', this.detailName)
				this.$axios.post('/sm/theme/edit', data).then(res => {
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
			clearAuditDetail() {
				this.auditDetailShow = false;
			},
			openChange() {
				this.groupId = this.detailInfo.groupId;
				this.password = this.detailInfo.password;
				this.auditDetailShow = true;
			},
			openChanges() {
				if(this.cloudInfo.watchPassword) {
					this.cloudPassword = this.cloudInfo.watchPassword;
				}
				this.cloudGroupId = this.cloudInfo.watchType.toString();
				this.cloudInfoShow = true;
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
				console.log(file)
				const max = 1024*1024   // 1M
				if((file.size/max)>50){
					return true
				}else if(this.teachingFileId){ // 限制未提交再上传文件
					let currentLength = []
					Object.assign(currentLength,fileList.filter(item => {
						if(item.percentage == 0 || item.percentage){
							return item
						}
					}))
					if(currentLength.length == 1){ // 如果提交的数量大于1，自动移除文件后，就不隐藏提交按钮
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
							console.log(file)
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
				this.$axios.post('/sm/theme/commitTeachingFile', data).then(res => {
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
			// 聊天互动讨论开关
			chatSwitchFun () {
				this.$axios.post('/sm/theme/updateInteractiveStatus', {
					id: this.$route.query.themeid,
					interactiveStatus: this.detailInfo.interactiveStatus,
				}).then(res => {
					if(this.detailInfo.interactiveStatus == 1) {
						this.$message('开启成功','success')
					}else{
						this.$message('关闭成功','success')
					}
				})
				
			},
			//编辑获取主体信息
			getDetailInfo(){
				this.$axios.get('/sm/theme/list', {
					pageNum: 1,
					pageSize: 10,
				}).then(res => {
					this.permission = this.creatPermit(res.data.permit);
				});
				this.$axios.get('/sm/theme/info', {id: this.$route.query.themeid}).then(res => {
					let data = res.data;
					if ((data.liveStatus !== 0 || data.liveStatus !== 1) && data.terminalList.length > 0) {
						data.terminalList.forEach(v => {
							v.playbackUrl = `http://${location.hostname}${v.playbackUrl}`
						})
					}
					this.detailInfo = res.data;
					this.edufileList = res.data.teachingFileList;
					this.creatPlayUrl();
				});
			},
			//播放地址
			creatPlayUrl(){
				if(this.detailInfo.liveStatus == 0 || this.detailInfo.liveStatus == 1){
					if(this.detailInfo.mode == 0){ //h5
						this.playUrl = this.$route.query.val ? location.origin + '/hplay' + location.search + '&type=0&etype=1' : location.origin + '/hplay' + location.search + '&type=0';
						this.mobilePlayUrl = location.origin + '/mobile/hplay' + location.search + '&type=0';
					}else{ //rtmp
						this.playUrl = location.origin + '/rplay' + location.search + '&type=0';
						this.mobilePlayUrl = location.origin + '/mobile/rplay' + location.search + '&type=0';
					}
				}else{
					this.playUrl = this.$route.query.val ? location.origin + '/pplay' + location.search + '&type=0&etype=1' : location.origin + '/pplay' + location.search + '&type=0';
					this.mobilePlayUrl = location.origin + '/mobile/pplay' + location.search + '&type=0';
				}
			},
			//获取用户组列表
			getgroupList(){
				this.$axios.get('/sm/theme/getSysGroup').then(res => {
					this.groupList = res.data;
				});
			},
			//修改授权
			auditUpdate(){
				let data = {};
				data.id = this.$route.query.themeid;
				data.groupId = this.groupId;
				if(this.groupId == 1) {
					if (this.password !== '' && this.password !== null) {
						if (this.$verify.checkNumEn(this.password,6,6)) {
							this.$message('观看密码须6位数字或字母或二者组成', 'error');
							return true;
						}
					}
					data.password = this.password ? this.password : '';
				}
				this.$axios.post('/sm/theme/updateGroup', data).then(res => {
					if(res.code == 200){
						this.getDetailInfo();
						this.auditDetailShow = false;
						this.$message('修改成功', 'success');
					}
				});
			},
			// 公网修改权限
			handleAuditUpdate() {
				Message.closeAll();
				if (this.cloudGroupId === "1") {
					if (!this.cloudPassword) {
						this.$message('请输入观看密码', 'error');
						return;
					}
					if (this.$verify.checkNumEn(this.cloudPassword,6,20)) {
						this.$message('公网观看密码须6-20位数字字母组成', 'error');
						return;
					}
				}
				this.$axios.post("/sm/cloud/changeWatchType", {
					themeId: this.$route.query.themeid,
					watchType: this.cloudGroupId,
					watchPassword: this.cloudPassword
				}).then(res => {
					if (res.code === 200) {
						this.handlecloudInfo();
						this.$message('修改成功', 'success');
						this.cloudInfoShow = false;
						// this.cloudGroupId = "0";
						// this.cloudPassword = "";
					}
				});
			},
			handlqCancel() {
				this.cloudInfoShow = false;
				// this.cloudGroupId = "0";
				// this.cloudPassword = "";
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
			//直播直接跳转播放页
			toPlay(url){
				console.log('url',url)
				window.open(url, '_blank');
			},
			//开始直播0 结束直播1
			startEndLive(type){
				let url = ['/sm/theme/start', '/sm/theme/stop'];
				this.$axios.post(url[type], {id: this.$route.query.themeid}).then(res => {
					if(res.code == 200){
						setTimeout(() => {
							this.getDetailInfo();
							this.startLiveShow = false;
							this.endLiveShow = false;
						}, 500)
						this.$message('操作成功', 'success');
					}
				});
			},
			// 开始公网直播0 结束直播1
			handleStartEndLive(type) {
				let url = ['/sm/cloud/restartCloudLive', '/sm/cloud/stop'];
				this.$axios.post(url[type], { themeId: this.$route.query.themeid }).then(res => {
					if (res.code === 200) {
						this.cloudStartLiveShow = false;
						this.cloudEndLiveShow = false;
						this.handlecloudInfo();
						this.$message('操作成功', 'success');
					}
				});
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
			},
			handlecloudInfo() {
				this.$axios.get(`/sm/cloud/cloudInfo?id=${this.$route.query.themeid}`).then(res => {
					if (res.code === 200) {
						const data = res.data;
						this.cloudInfo = data;
						this.pcUrl = `${data.watchUrl}/pcplay?id=${data.watchId}`;
						this.Hur = `${data.watchUrl}/hplay?id=${data.watchId}`;
					}
				})
			},
			//切换信息
			handleSelect(index){
				this.activeIndex = index;
				if (index == 1) {
					this.handlecloudInfo();
				}
			}
		},
		filters: {
			recode(val){
				return val == 1 ? '开启' : '未开启';
			},
			theme(val){
				let arr = ['待提交','待审核', '待发布','驳回','已发布'];
				return arr[val];
			},
			liveStatus(val) {
				let arr = ['未发布', '预告中', '授课中', '已结束'];
				return arr[val];
			},
			liveMode(val){
				let arr = ['录播直播', '远程教学'];
				return arr[val - 1];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.content-wrap{
		height: 80%;
		display: flex;
	}
	.detail-list{
		position: relative;
		margin-left: 60px;
		.li{
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
				// max-width: 300px;
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
		.subBtn {
			position: absolute;
			bottom: -2px;
    	left: 426px;
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
			align-items: center;
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
	.select{
		// padding-bottom: 30px;
		p{
			// margin-bottom: 25px;
		}
		span{
			margin-left: 35px;
			color: #409EFF;
		}
	}
	.menu-item{
		margin-left: 70px;
	}

	.statistics {
		display: flex;
		width: 100%;
		padding-left: 20px;
		text-align: center;
		color: #606266;

		li {
			flex: 1;
			margin-top: 0;

			span {
				font-size: 30px;
				padding-right: 4px;
			}
		}
	}
</style>
<style>
.upload-edufile .el-upload-list__item-name {
		overflow: hidden;
    width: 280px;
    text-overflow: ellipsis;
}
.upload-edufile .el-icon-close-tip {
		right: -110px;
		display: none !important;;
	}
</style>
