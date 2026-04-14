<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" :content="`${$route.query.id ? '课程编辑页' : '课程上传页'}`"></el-page-header></p>
		<video id="ifVideo" style="border:solid 1px red; width:300px;height:300px;display:none"></video>
		<div class="content-wrap">
			<div class="item-scroll">
				<div class="box" v-loading="addloading">
					<div class="item-wrap upload-box videoList">
						<p>课程上传</p>
						<p class="p1"><em>*</em>：</p>
						<div class="upload-wrap">
							<el-upload
								:limit="1"
								:on-exceed="handleOnExceeds"
								:disabled="VideoDisabled"
								class="upload-demo"
								:action="uploadUrl"
								:accept="version === '1' ? '.mp4,.MP4' : '.mp4,.MP4,.flv,.FLV,.wmv,.WMV'"
								:file-list="videoList"
								:on-change="selectVideo"
								:on-remove="remove"
								list-type="picture"
								:auto-upload="false"
								:drag="true">
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">将文件拖到此处，或<em style="color: #409EFF">点击上传</em></div>
								<div class="el-upload__tip" slot="tip"><em>*</em>请上传<span v-show="version === '1'">4G内</span>MP4<span v-show="version != '1'">、FLV、WMV</span>格式且音视频编码格式符合系统要求的视频文件；</div>
								<div class="el-upload__tip" :style="{opacity: version == 1 ? 1 : 0}" slot="tip"><em>*</em>请提前预览视频是否可在系统正常播放；</div>
							</el-upload>
							<div id="vp" ref="vp"></div>
							<div class="preview" @click="handlePre" v-if="preview && version == 1">
								<img src="../../../assets/imgs/preview.png" alt="">
							</div>
						</div>
					</div>
					<div></div>
					<div class="item-wrap" style="margin-top: 50px">
						<p>课程名称</p>
						<p><em>*</em>：</p>
						<el-input class="width-2" v-model="addEditInfo.name"></el-input>
					</div>
					
					<!-- <div class="item-wrap">
						<p>类型</p>
						<p><em>*</em>：</p>
						<el-cascader v-model="addEditInfo.labelIdList"
						:show-all-levels="false"
						style="width: 280px"
						:options="themeTypeList"
						placeholder="请选择类型"
						:props="props"
						@change="typeChange"
						clearable>
						</el-cascader>
					</div> -->
					<div class="item-wrap">
						<div style="display:flex">
							<p style="line-height:32px">课程分类</p>
							<p style="padding-top:6px"><em>*</em>：</p>
						</div>
						<div>
							<div class="itemType width-9" style="padding-left:0">
								<el-select @change="handleTheme" v-model="themeValue" placeholder="请选择">
									<el-option
									v-for="item in themeData"
									:key="item.id"
									:label="item.name"
									:value="item.id">
									</el-option>
								</el-select>
							</div>

							<div class="itemList itemType width-9" v-for="(nape,index) in themeTypeList" :key="index">
								<el-tooltip :disabled="nape.name.length > 12 ? false : true" class="item" effect="dark" :content="`请选择${nape.name}`" placement="top-start">
									<el-select clearable v-model="nape.value" :placeholder="`请选择${nape.name}`" v-if="nape.children">
										<el-option
										v-for="item in nape.children"
										:key="item.id"
										:label="item.name"
										:value="item.id">
										</el-option>
									</el-select>
								</el-tooltip>
							</div>
						</div>
					</div>

					<!-- <div class="item-wrap" v-for="(nape,index) in themeTypeList" :key="index">
						<p :class="nape.name.length > 5 ? 'nameAct' : ''">{{ nape.name }}</p>
						<div class="px"><em>*</em>：</div>
						<el-tooltip class="item" effect="dark" :content="`请选择${nape.name}`" placement="top-start">
							<el-select class="width-2" clearable v-model="nape.value" :placeholder="`请选择${nape.name}`" v-if="nape.children">
								<el-option
								v-for="item in nape.children"
								:key="item.id"
								:label="item.name"
								:value="item.id">
								</el-option>
							</el-select>
						</el-tooltip>
					</div> -->
					
					<div class="item-wrap">
						<p>观看权限</p>
						<p><em>*</em>：</p>
						<el-select v-model="addEditInfo.groupId" placeholder="请选择用户组" class="width-2" style="margin-right: 2px" filterable>
							<el-option
								v-for="item in groupList"
								:key="item.id"
								:label="item.groupName"
								:value="item.id">
							</el-option>
						</el-select>
						<p class="err-notice">注：选择观看授权前先添加用户组</p>
					</div>
					
					<div class="item-wrap" v-if="permission.addPublicVod && isCloud == true">
						<p>公网点播</p>
						<p><em>*</em>：</p>
						<el-switch
							:active-value=1
							:inactive-value=0
							v-model="addEditInfo.publicVod"
							>
						</el-switch>
						<!-- <p class="err-notice">注：公网直播需保证艾课云账号中有足够的流量，否则可能影响直播</p> -->
					</div>
					<div class="item-wrap notselect" v-if="addEditInfo.publicVod === 1">
						<p>公网观看权限</p>
						<p><em>*</em>：</p>
						<el-radio v-model="addEditInfo.watchType" :label=0>所有人可看</el-radio>
						<el-radio v-model="addEditInfo.watchType" :label=1>授权码观看</el-radio>
					</div>

					<div class="item-wrap" v-if="addEditInfo.publicVod === 1 && addEditInfo.watchType === 1">
						<p>公网观看密码</p>
						<p><em>*</em>：</p>
						<el-input class="width-2" placeholder="4-20数字字母组成" v-model="addEditInfo.watchPassword" clearable show-password></el-input>
					</div>

					<div class="item-wrap edufile">
						<p>教学文件</p>
						<p><em style="opacity: 0;">*</em>：</p>
						<el-upload
						  ref="edufileupload"
							:action="eduFileUrl"
							class="upload-edufile"
							accept=".ppt,.pptx,.pdf,.doc,.docx,.jpg,.png,.zip,.rar,.xls,.xlsx"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							:before-upload="eduBeforeupload"
							 multiple
							:with-credentials="true"
							:limit="5"
							:on-exceed="handleExceed"
							:on-error="handleEduError"
							:on-success="handleEduSuccess"
							:file-list="edufileList"
							>
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传ppt/word/pdf/jpg/png/xls/zip/rar教学相关文件，大小需小于50M</div>
						</el-upload>
					</div>

					<div class="item-wrap upload-box">
						<p>封面</p>
						<p class="p1">：</p>
						<div class="upload-wrap">
							<el-upload
							:limit="1"
							:on-exceed="handleOnExceed"
								class="upload-dem imgUpload"
								:action="uploadUrl"
								accept=".png,.jpg"
								:file-list="fileList"
								:on-change="selectFile"
								:on-remove="removeFile"
								list-type="picture"
								:auto-upload="false"
								drag>
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">将文件拖到此处，或<em style="color: #409EFF">点击上传</em></div>
								<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
							</el-upload>
						</div>
					</div>
					
					<div class="item-wrap upload-box" style="margin-top: 50px">
						<p>简介</p>
						<p class="p1">：</p>
						<div class="upload-wrap">
							<textarea v-model="addEditInfo.description"></textarea>
						</div>
					</div>
		
					<el-button :loading="saveLoading" type="primary" class="edit-btn" @click="httpRequest" v-if="$route.query.id">保存</el-button>
					<el-button :loading="saveLoading" type="primary" class="edit-btn" @click="httpRequest" v-else>保存</el-button>
				</div>
			</div>
		</div>
		
		<el-dialog
			title="系统错误"
			:close-on-click-modal="false"
			:visible.sync="upErrorShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">{{upErrorMsg}}</p>
			</div>
		</el-dialog>

		<el-dialog
			title="预览"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			:visible.sync="previewDialogVisible"
			width="810px"
			:before-close="handleClose">
			<div id="myVideo" ref="myVideo" v-if="playUrl"></div>
			<!-- <video
				id="videoView"
				class="videoPreview"
				controls="controls"
				autoplay
			>
			</video> -->
			<div class="previewTip">
				视频是否可以播放正常？
				<span>（若视频播放异常，请将视频转码为平台支持的音视频编码格式后再上传）</span>
			</div>
			<span slot="footer" class="dialog-footer footer-btn">
				<div>
					<el-button type="primary" @click="handleNormal">正常，继续上传</el-button>
					<el-button @click="handleAbnormal">异常，暂不上传</el-button>
				</div>
			</span>
		</el-dialog>

		<el-dialog
			title="确认提示"
			:close-on-click-modal="false"
			:visible.sync="editShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认修改？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="httpRequest">确 定</el-button>
					<el-button @click="editShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Message} from 'element-ui';
	import Player from 'xgplayer';
	import { mapActions, mapState } from 'vuex'
	import {creatTree, baseUrl, getNowDate, storage} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				isCloud: false,
				addloading: false,
				saveLoading: false,
				VideoDisabled: false,
				uploadUrl: baseUrl + '/sm/label/save',
				fileList: [],
				videoList: [],
				themeTypeList: [],
				props: {multiple: true, label: 'name', value: 'id', emitPath: false},
				addEditInfo: { publicVod:0, watchType: 0 , watchPassword:'' },
				groupList: [],
				version: '',
				id: '',
				loading: '',
				upErrorShow: false,
				upErrorMsg: '',
				themeValue: '',
				themeData: [
					{
						id: 8,
						name: "教师研修"
					},
					{
						id: 4,
						name: "优质资源"
					},
					{
						id: 6,
						name: "课外知识"
					},
				],
				permission: '',
				preview: false, // 上传视频预览
				previewDialogVisible: false,
				fileData: {},
				playUrl:'',
				myVideo: null,
				vp:null, // 视频缩略图生成播放器
				videoSize: '', // 上传显示大小
				editShow: false, // 编辑tips
				eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
				edufileList:[], // 上传文件
				teachingFileIds:[] // 一键发布时上传文件数组
			}
		},
		computed: {
			...mapState({
      uploadTable:'uploadTable'
    })
	
		},

		mounted() {
			this.version = storage.get('version');
			if(localStorage.getItem('uiType') == 2) {
				this.handleGetType();
			}
			// this.getTypeList();
			
			this.getgroupList();
			if(this.$route.query.id){
				this.id = this.$route.query.id;
				this.getThemeInfo();
			}
		},
		methods: {
			...mapActions({
				commitAiUploadBoxVisible: 'commitAiUploadBoxVisible',
				commitAiUploadTable: 'commitAiUploadTable',
				commitAiUploadDataState: 'commitAiUploadDataState',
			}),
			handleOnExceed(files,fileList) {
				this.$message('只能上传一个图片', 'error')
			},
			// 移除文件
			handleRemove(file, fileList) {
				if(fileList.length == 0){
					this.teachingFileIds = []
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
						}else {
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
									if(this.id){  // 存再Id 即为编辑   // 删除不调用删除接口
										this.teachingFileIds.forEach((item,index) => {
											if(item == file.id){
												this.teachingFileIds.splice(index,1)
											}
											if(file.response && item == file.response.data.id){
												this.teachingFileIds.splice(index,1)
											}
										})
										return true;
									}else {
										// 不为编辑，// 删除调用删除接口
										let id = file.response.data.id
										this.deleteEduFile(id);
									}
								}).catch(() => reject());
						}
			},
			// edu上传之前
			eduBeforeupload(file) {
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
				// console.log(response, file, fileList,this.teachingFileIds)
				if(response.code == 200){
					this.teachingFileIds.push(response.data.id)
				}
			},
			// 删除上传的文件
			deleteEduFile(id) {
				this.$axios.post('/upload/deleteTeachingFile', {id:id}).then(res => {
					if(res.code == 200){
						this.teachingFileIds.forEach((item,index) => {
							if(item == id){
								this.teachingFileIds.splice(index,1)
							}
						})
					}
				})
			},
			//初始化视频  点播
			initVideo(){
				this.myVideo = new Player({
					id: 'myVideo',
					// url: this.detailInfo.themeTeminalList[0].playbackUrl,
					url: this.playUrl,
					fluid: true,
					autoplay: true,
					videoInit: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					lang: 'zh-cn',
				});
			},
			// 缩略图生成播放器初始化
			initVP(){
			 	this.vp = new Player({
					id: 'vp',
					url: this.playUrl,
					fluid: true,
					autoplay: true,
					autoplayMuted: true,
					volume: 0,
					defaultMuted:true,
					videoInit: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					lang: 'zh-cn',
				});
				// debugger
				this.$nextTick(() => {
					// let vp = document.querySelector('#vp');
					// vp.style.zIndex = -100;
					let vp = document.querySelector('#vp>video');
					console.log('vpp',vp)
					vp.style.zIndex = -100;
					vp.addEventListener('loadeddata',this.captureImage);
				})
			},
			// 捕获第一帧画面
			captureImage() {
				let vp = document.querySelector('#vp>video');
				let canvas = document.createElement("canvas");
				// canvas.style.display = 'none';
				document.body.appendChild(canvas);
				canvas.width = vp.videoWidth * 0.8;
				canvas.height = vp.videoHeight * 0.8;
				canvas.getContext('2d').drawImage(vp, 0, 0, canvas.width, canvas.height);
				let img = document.querySelector('.el-upload-list__item-thumbnail');
				img.src = canvas.toDataURL("image/png",1);
				this.vp.destroy();
				this.vp = null;
				document.body.removeChild(canvas);
			},
			//编辑获取主体信息
			getThemeInfo(){
				this.$axios.get('/sm/file/info', {id: this.id}).then(res => {
					let recodeIdList = [];
					let terminalIdList = [];
					res.data.terminalIdList = terminalIdList;
					this.edufileList = res.data.teachingFileList; // 教学文件
					this.teachingFileIds = this.edufileList.map( i => i.id);
					if(res.data.imgUrl){
						this.fileList = [{name: '', url: res.data.imgUrl}];
					}else{
						this.fileList = [];
					}
					this.videoList = [{name: '', url: res.data.localFileUrl}];
					this.addEditInfo = res.data;
					this.themeValue = res.data.categoryId; // 获取编辑id赋给一级分类select
					if (this.themeValue !== '') {
						this.getTypeList();
					}
					this.addEditInfo.video = res.data.localFileUrl
					if(this.$route.query.id){
						this.playUrl = res.data.localFileUrl;
						this.initVP();
					}
					
				});
			},
			// 视频分类change
			handleTheme() {
				this.getTypeList();
			},
			//返回
			goBack(){
				// this.$router.push('/sm/file');
				this.$router.go(-1);
			},
			// 获取类型
			handleGetType() {
				this.$axios.get('/sm/category/listAll').then(res => {
					if (res.code === 200) {
						let arr = res.data.filter(el => el.id !== 1);
						this.themeData = arr;
					}
				})
			},
			//获取类型2
			getTypeList(){
				this.$axios.get('/sm/label/listByCategory', {
					categoryId: this.themeValue,
					type: 1,
					id: this.$route.query.id ? this.$route.query.id : '',
					// id: this.currentData.id
				}).then(res => {
					let treeList = creatTree(res.data);
					let data = [];
					treeList.forEach(val => {
						if(val.children){
							data.push(val);
						}
						// val.value = this.valData.find((v) => v.id === 12) ? this.valData.find((v) => v.id === 12).id : 0;
					})
					this.themeTypeList = data;
					
				});
			},
			// getTypeList(){
			// 	this.$axios.get('/sm/label/listAll').then(res => {
			// 		let treeList = creatTree(res.data);
			// 		let data = [];
			// 		treeList.forEach(val => {
			// 			if(val.children){
			// 				data.push(val);
			// 			}
			// 		})
			// 		this.themeTypeList = data;
			// 	});
			// },
			//获取用户组列表
			getgroupList(){
				this.$axios.get('/sm/theme/checkEICC', {type: 1}).then(res => {
					if(res.code == 200){
						this.isCloud = res.data
					}
				})
				this.$axios.get('/sm/theme/getSysGroup').then(res => {
					this.groupList = res.data;
				});
				let data = {
					pageNum: 1,
					pageSize: 10,
				};
				this.$axios.get('/sm/file/list', data).then(res => {
					this.permission = this.creatPermit(res.data.permit);
				});
			},
			//类型最多选择三个
			typeChange(val){
				if(this.addEditInfo.labelIdList.length > 3){
					this.addEditInfo.labelIdList = this.addEditInfo.labelIdList.splice(0, 3);
					this.$message('最多选择三个类型','error');
				}
			},
			handleOnExceeds(files,fileList) {
				this.$message('只能上传一个视频', 'error')
			},
			handlePre() {
				console.log("打开预览");
				this.previewDialogVisible = true;
				const file = this.fileData.raw;
				this.$nextTick(() => {
					const video = document.getElementById('myVideo');
					let binaryData = [];
          binaryData.push(file);
          video.src = window.URL.createObjectURL(new Blob(binaryData));
					this.initVideo();
				});
			},
			handleClose() {
				console.log('handleClose');
			},
			handleNormal() {
				this.previewDialogVisible = false;
				this.myVideo.destroy();
				// document.getElementById('myVideo').src = '';
				// 销毁播放
				// this.playUrl = "";
				// if(this.myVideo && this.myVideo.destroy){
				// 	this.myVideo.src = "";
				// 	this.myVideo.destroy();
				// }
				// this.$refs.myVideo.innerHTML = '';
			},
			handleAbnormal() {
				this.previewDialogVisible = false;
				this.videoList = [];
				this.addEditInfo.video = '';
				this.preview = false;
				// document.getElementById('myVideo').src = '';
				// 销毁播放
				this.playUrl = "";
				if(this.myVideo && this.myVideo.destroy){
					this.myVideo.src = "";
					this.myVideo.destroy();
				}
				this.$refs.myVideo.innerHTML = '';
				// document.getElementById('myVideo').src = '';
			},
			//上传的视频
			selectVideo(file){
				console.log(this.version)
				this.playUrl = URL.createObjectURL(file.raw);
				if (this.version == 1) {
					let reg =/(.mp4|.MP4)$/
					console.log(reg.test(file.raw.name))
					if(!reg.test(file.raw.name)) {
						this.$message('标准版仅支持.pm4格式视频', 'error')
						this.videoList = [];
						this.addEditInfo.video = '';
						return
					}
					const _this = this;
					console.log(file);
					this.fileData = file;
					const video = document.getElementById('ifVideo');
					video.src = URL.createObjectURL(file.raw);
				
					video.onload = function() {
						console.log('success');
					}
					video.onerror = function() {
						_this.videoList = [];
						_this.addEditInfo.video = '';
						_this.$message('上传的视频不支持该浏览器播放,请重新选择', 'error');
						_this.preview = false;
					}
					video.oncanplaythrough = function() {
						console.log('视频格式支持');
					}
				}else {
					let reg =/(.mp4|.MP4|.flv|.FLV|.wmv|.WMV)$/
					console.log(reg.test(file.raw.name))
					if(!reg.test(file.raw.name)) {
						this.$message('仅支持.mp4、.flv、.wmv格式视频', 'error')
						this.videoList = [];
						this.addEditInfo.video = '';
						return
					}
				}
				this.videoSize = file.raw.size/1024/1024/1024 > 1 ? `${(file.raw.size/1024/1024/1024).toFixed(2)}G` :`${(file.raw.size/1024/1024).toFixed(2)}M` //上传列表大小显示
				// if (!this.addEditInfo.video) {
				if(this.version == 1 && (file.raw.size / 1024 / 1024 / 1024) > 4){
					this.videoList = [];
					return this.$message('视频只能上传mp4视频，且不超过4G', 'error');
				}else{
					this.initVP();
					this.addEditInfo.video = file.raw;
					if (this.addEditInfo.video) {
						this.preview = true;
						return;
					}
					this.preview = false;
					// this.VideoDisabled = true;
				}
				// }
				
			},
			remove(){
				this.videoList = [];
				this.addEditInfo.video = '';
				this.preview = false;
			},
			removeFile(){
				this.addEditInfo.file = null;
			},
			//上传的封面
			selectFile(file){
				let isJpg;
				if (
					file.raw.type == "image/jpeg" ||
					file.raw.type == "image/png" ||
					file.raw.type == "image/jpg"
				) {
					isJpg = true;
				} else {
					isJpg = false;
				}
				if(!isJpg){
					this.fileList = [];
					return this.$message('上传失败，文件格式错误', 'error');
				}
				if((file.raw.size / 1024) > 500){
					this.fileList = [];
					return this.$message('封面只能上传jpg/png文件，且不超过500kb', 'error');
				}else{
					this.addEditInfo.file = file.raw;
				}
			},
			// 编辑修改提示
			editSave(){
				this.editShow = true;
			},
			//覆盖默认上传，手动上传
			httpRequest(param) {
				Message.closeAll();
				if(this.verify()){
					return
				};
				// 判断上传名称是否重复
				if(this.uploadTable.findIndex((item,i) => {
						return item.name == this.addEditInfo.name
					}) === -1 ){
						if(this.uploadTable.length >= 5){
							return this.$message('最多可以同时上传5个视频，请稍后再试！','error')
						}
						let typeIdList = [];
						this.themeTypeList.forEach(v => {
							if (v.value !== null || v.value !== '') {
								typeIdList.push(v.value);
							}
						});
						console.log(typeIdList);
						let judgeData = {};
						let formData = new FormData();
						formData.append('name', this.addEditInfo.name);
						// formData.append('labelIdList', this.addEditInfo.labelIdList);
						formData.append('labelIdList', typeIdList);
						formData.append('groupId', this.addEditInfo.groupId);
						formData.append('categoryId', this.themeValue);
						formData.append('description', this.addEditInfo.description ? this.addEditInfo.description : '');
						formData.append('publicVod', this.addEditInfo.publicVod);
						formData.append('watchType', this.addEditInfo.watchType);
						formData.append('watchPassword', this.addEditInfo.watchPassword);
						formData.append('imgDetection', this.addEditInfo.file !==null ? 0 : 1);
						if(this.teachingFileIds.length != 0){
							formData.append('teachingFileIds', this.teachingFileIds);
						}
						let url = '/sm/file/save';
						if(this.id){
							url = '/sm/file/update';
							formData.append('id', this.id);
							judgeData.id = this.id;
							if(this.addEditInfo.video){
								judgeData.isUpload = true;
								formData.append('video', this.addEditInfo.video);
							};
							if(this.addEditInfo.file){
								formData.append('img', this.addEditInfo.file);
							};
						}else{
							formData.append('video', this.addEditInfo.video);
							formData.append('img', this.addEditInfo.file);
						};
						judgeData.name = this.addEditInfo.name;
						//判断是否名称重复 是否在上传 是否在直播等
						this.saveLoading = true;
						this.$axios.post('/sm/file/checkUpload',judgeData).then(res => {
							if (res.code) {
								this.saveLoading = false;
							}
							if(res.code == 200){
								// 判断编辑是否有替换视频
								if(this.addEditInfo.video){
									console.log(typeof(this.addEditInfo.video),'this.addEditInfo.video')
									// 上传列表s
									if(typeof(this.addEditInfo.video) !== 'string'){
										var uploadId = this.uploadTable.length;	
										let uploadTbaleData = {
											type:'push',
											item:{
												uploadId:uploadId,
												name:this.addEditInfo.name,
												status:1, // 0 上传失败 1上传中 //2已取消
												size:this.videoSize,
												id:this.id ? this.id : -1, // 视频id
												detail:formData,
												fileName: this.addEditInfo.video.name.slice(
                                            0,
                                            this.addEditInfo.video.name.length - 4
                                        ),
                                        progress: 0,
											}
										}
										this.commitAiUploadTable(uploadTbaleData);
										this.commitAiUploadBoxVisible(true);
									}
									this.$router.push('/sm/file');
								}
								
								this.$axios.post(url, formData,{
									headers: {
										uploadId: uploadId
									},
									timeout: 600000,
									onUploadProgress: (progressEvent) => {
										// 这就是 真·上传进度
										let percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
										let msg = {};
										msg = {
											fileName: this.addEditInfo.video.name.slice(
												0,
												this.addEditInfo.video.name.length - 4
											),
											progress: percent,
										};
										this.$comjs.updateAiUploadTable(formData, msg);
									},
								}).then(res => {
									if(res.code == 200){
										this.id ? this.$message('编辑成功', 'success') : this.$message('新增成功', 'success');
										// 判断编辑是否有替换视频
										// if(this.addEditInfo.video){
										// 	this.commitAiUploadTable(uploadTbaleData)
										// }
										if (this.$route.path == "/sm/file") {
											setTimeout(() => {
												this.$bus.emit("getFileList");
											}, 200);	
										}
									}else if(res.code == -3000){
										this.upErrorMsg = res.message;
										this.upErrorShow = true;
									}else if(res.code == -10000){
										this.editShow = false
										// 判断编辑是否有替换视频
										if(this.addEditInfo.video){
											this.commitAiUploadDataState({
												uploadId:uploadId,
												status: 0
											})
										}
									}
								}, err => {
									if(err.message === '取消成功'){
										this.$message(err.message,'success',70,3000)
									}else{
										this.$message(err.message,'error',70,3000)
									}
								})
								// this.$axios.postProgress(url, formData, {
								// 	onUploadProgress: progressEvent => {
								// 		let percent = progressEvent.loaded / progressEvent.total * 100 | 0;
								// 		if(percent == 100){
								// 			percent = 99;
								// 		};
								// 		this.loading.text = '上传中' + percent + '%';
								// 	}
								// }).then(res => {
								// 	this.loading.close();
								// 	if(res.code == 200){
								// 		this.goBack();
								// 		this.$message('上传成功', 'success');
								// 	}else if(res.code == 3000){
								// 		this.upErrorMsg = res.message;
								// 		this.upErrorShow = true;
								// 	}
								// }, err => {
								// 	console.log(err)
								// 	reject(err)
								// })
							}
						});

					}else {
						this.$message('课程名称重复，该课程正在上传', 'error');
					}
			},
			//验证
			verify(){
				if(this.$verify.isEmpty(this.addEditInfo.video)){
					this.$message('请上传视频', 'error');
					return true;
				}
				if (this.$verify.isEmpty(this.addEditInfo.name)) {
					this.$message('请输入课程名称', 'error');
					return true;
				}
				if (this.addEditInfo.name.length > 20) {
					this.$message('课程名称不能超过20字', 'error');
					return true;
				}
				// if(this.$verify.chLetterNum(this.addEditInfo.name, 20)){
				// 	this.$message('名称为中文大小写字母和数字组成，最长20位！', 'error');
				// 	return true;
				// }
				if(this.$verify.isEmpty(this.themeValue)){
					this.$message('分类未选择', 'error');
					return true;
				}
				let ifResult = false;
				if (this.themeTypeList.length !== 0) {
					let ifType = this.themeTypeList.some((v, i) => {
						if (v.value === null || v.value === '') {
							this.$message(`${v.name}未选择`, 'error');
							ifResult = false;
							return true
						}
						ifResult = true;
					});
				} else {
					ifResult = true;
				}
				if (!ifResult) {
					return true;
				}
				if(this.$verify.isEmpty(this.addEditInfo.groupId)){
					this.$message('请选择观看权限', 'error');
					return true;
				}
				if (this.addEditInfo.publicVod === 1 && this.addEditInfo.watchType == 1) {
					if (!this.addEditInfo.watchPassword) {
						this.$message('请设置公网观看密码', 'error');
						return true;
					}
					if (this.$verify.checkNumEn(this.addEditInfo.watchPassword,4,20)) {
						this.$message('公网观看密码须4-20位数字或字母或二者组成', 'error');
						return true;
					}
				}
				if(this.addEditInfo.description && this.addEditInfo.description.length > 50){
					this.$message('简介最长50个字', 'error');
					return true;
				}
			}
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.videoPreview {
		width: 736px;
		height: 458px;
		margin: 0 auto;
    display: block;
		margin-top: -40px;
		outline: none;
	}

	.footer-btn {
		text-align: center !important;
	}

	.previewTip {
		font-size: 18px;
		color: #333;
		padding: 23px 20px;
		padding-bottom: 0;

		span {
			color: #999;
			font-size: 14px;
		}
	}

	.itemList {
		padding-left: 10px;
	}
	.nameAct {
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
	}
	.content-wrap{
		overflow: hidden;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 54px 60px;
	}
	.item-scroll{
		/* overflow: hidden; */
		height: 100%;
		width: 100%;
		.box{
			overflow-y: scroll;
			width: 102%;
			height: 100%;
		}
	}
	.item-wrap{
		display: flex;
		align-items: center;
		margin-top: 25px;
		em{
			color: #F64646;
		}
		p:first-child{
			width: 84px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
			color: #303133;
			font-size: 14px;
		}
		p:first-child:after{
			content: '';
			display: inline-block;
			width: 100%;
		}
	}
	.edufile {
		align-items: flex-start;
		p {
    	height: 40px;
			line-height: 40px;
		}
	}
	.upload-wrap{
		height: 160px;
		position: relative;
		// width: 280px; // 新增视频预览模块暂时注释

		.preview {
			// width: 127px;
			// height: 127px;
			width: 153px;
			height: 89px;
			border: solid 1px red;
			position: absolute;
			right: -90px;
			top: 20px;
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;

			&:hover {
				border: 1px dashed #f00;
			}

			img {
				width: 100%;
				height: 100%;
			}
		}
		
		textarea{
			height: 130px;
			width: 280px;
			border: solid #DCDFE6 1px;
			resize: none;
		}

		em {
			padding: 0 4px;
		}

		.el-upload__tip {
			line-height: 17px;
		}
	}
	.upload-box{
		align-items: start;
		.p1{
			margin-right: 5px;
			line-height: 40px;
		}
	}
	.edit-btn{
		width: 160px;
		height: 40px;
		margin: 35px 0 60px 130px;
	}
	.err-notice{
		margin-left: 20px;
		color: #B3B6BA;
		font-size: 12px;
		&.err-color{color: #F64646}
	}

	.itemType {
		float: left;
		padding-left: 10px;
		padding-bottom: 10px;

		.p {
			line-height: 40px;
			text-align: justify;
			color: #303133;
			font-size: 14px;
			float: left;
		}

		.el-select {
			float: left !important;
		}
	}
	::v-deep .el-upload-dragger{
		width: 280px;
		height: 130px;
	}
	::v-deep .el-upload-dragger .el-icon-upload{
		margin-top: 20px;
	}
</style>
<style>

	/* .upload-box .el-upload-list{
		margin: -145px 0 0 15px;
		width: 250px;
	} */
	.videoList .el-upload-list {
		margin: -170px 0 0 15px  !important;
		width: 250px;
	}
	.edufile .el-upload-list{
		margin: 0 !important;
	}

	.imgUpload .el-upload-list {
		margin: -150px 0 0 15px  !important;
		width: 250px;
	}
	
	.upload-demo .el-upload-list__item-status-label{
		display: block;
	}
	.edufile .el-upload-list__item-name {
		overflow: hidden;
    width: 240px;
    text-overflow: ellipsis;
	}
	.edufile .el-icon-close-tip {
		display: none !important;;
		right: -110px;
	}
	#vp{
		display: none;
	}
</style>
