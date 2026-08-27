<!-- recordlist -->
<template>
  <div v-if="type == 1" class="box">
    <div class="header">
      <div class="left">
        <div v-if="permission.upload" :class="actives == 1 ? 'active item' : 'item'" @click="changeTab(1)">我的视频</div>
        <div v-if="permission.watchVideo" :class="actives == 3 ? 'active item' : 'item'" style="margin-left: 10px;" @click="changeTab(3)">我观看的</div>
      </div>
      <div class="right">
        <el-button v-if="permission.save" icon="el-icon-plus" size="small" type="primary" @click="add()">上传视频</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="content" v-if="list && list.length && list.length > 0">
      <div class="item" v-for="(val,index) in list" :key="index" @click="goDetail(val)">
        <div class="img-wrap">
          <img :src="val.imgUrl ? val.imgUrl : defaultImg" alt="" :onerror="defaultImg">
					<!-- <img :src="val.imgUrl" alt="" :onerror="defaultImg"> -->
					<!-- <ul class="tag-list">
						<li v-for="item in val.labels" :key="item.id">{{item}}</li>
					</ul> -->
				</div>
				<div class="layout-item">
					<span class="name" :title='val.name'>{{val.name}}</span>
				</div>
				<div class="layout-item" v-if="actives == 1 && (val.status == 0 || val.status == 2) && val.convertStatus !== 0">
					<el-button style="width: 65px;" size="mini" @click="deleteData(0,val)">删除</el-button>
          <el-button style="width: 65px;" size="mini" @click="editData(val)">编辑</el-button>
          <el-button v-if="val.convertStatus != 2 && val.status == 0" style="width: 65px;" type="primary" size="mini" @click="submit(0,val)">送审</el-button>
				</div>
        <div v-else style="padding:0 10px;display: flex;justify-content: space-between;align-items: center;height: 40px;">
          <span v-if="val.convertStatus != 0 && val.status == 3" style="min-width: 50px;font-size: 12px;"><i class="iconfont icon-watch" style="font-size: 12px"></i> {{val.viewed}}</span>
					<span v-else></span>
          <span style="font-size: 12px">{{val.createUserName}}</span>
        </div>
        <div v-if="val.convertStatus == 1">
					<p class="video-status status2" v-if="val.status == 0"><i class="el-icon-refresh-left"></i>待提交</p>
          <p class="video-status status2" v-if="val.status == 1"><i class="el-icon-refresh-left"></i>待审核</p>
          <p class="video-status status2" v-if="val.status == 3"><i class="el-icon-refresh-left"></i>已发布</p>
          <p class="video-status status2" v-if="val.status == 2"><i class="el-icon-refresh-left"></i>驳回<i :title="val.rejectReason ? val.rejectReason : '无理由'" class="el-icon-question" style="margin-left: 5px;"></i></p>
        </div>
				<div v-else>
          <p class="video-status status1" v-if="val.convertStatus == 0"><img :src="icon1" style="margin-right: 5px;" alt="">正在转码</p>
          <p class="video-status status1" v-if="val.convertStatus == 1"><img :src="icon1" style="margin-right: 5px;" alt="">转码完成</p>
          <p class="video-status status0" v-if="val.convertStatus == 2"><i class="el-icon-close"></i>转码失败</p>
        </div>
				<p class="time" v-if="val.time">{{val.time}}</p>
      </div>
      <div class="pagination-wrap">
				<el-pagination
					background
					:page-size="6"
					layout="prev, pager, next"
					:current-page="pageNum"
					@current-change="pageChange"
					:total="total">
				</el-pagination>
			</div>
      <el-dialog
			title="系统提示"
			:close-on-click-modal="false"
      style="margin-top: 16vh;"
     :append-to-body="true"
			:visible.sync="submitShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认送审？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="submit(1)">确 定</el-button>
					<el-button @click="submitShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
    <el-dialog
      title="删除视频"
     :append-to-body="true"
      :visible.sync="deleteShow"
      style="margin-top: 16vh;"
      width="420px">
      <div class="dialog-wrap">
        <p class="err-delete">确认删除该视频？</p>
        <div class="dialog-btn">
          <el-button type="primary" @click="deleteData(1)">确 定</el-button>
          <el-button @click="deleteShow = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    </div>
		<div class="null-data" v-else>
			<img :src="nullimg" alt="" />
      <p>{{!permission.upload && !permission.watchVideo ? '暂无访问权限！' : '暂无内容！'}}</p>
		</div>
  </div>
  <div v-else class="box" style="height: 614px;">
    <div class="">
      <i class="el-icon-arrow-left" style="cursor: pointer;" @click="add(1)"></i>
      {{addEditInfo.id ? '编辑' : '上传'}}视频
    </div>
    <el-divider></el-divider>
    <div class="addBox">
      <div class="item-wrap upload-box videoList">
        <p>视频上传<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        <div class="upload-wrap">
          <el-upload
            :limit="1"
						:on-exceed="handleOnExceed"
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
            <img src="@/assets/imgs/preview.png" alt="">
          </div>
        </div>
      </div>
      <div class="item-wrap">
        <div style="display:flex">
          <p>视频名称<em style="margin-left: 5px;line-height: 14px;">*</em></p>
          <el-input class="width-2" size="small" v-model="addEditInfo.name" clearable></el-input>
        </div>
      </div>
      <div class="item-wrap" style="align-items: start;">
        <div style="display:flex">
          <p style="width: 88px;margin-top: 10px;">视频分类<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        </div>
        <div>
          <div class="itemType width-9" style="padding-left:0;margin-left: 10px;margin-top: 10px;">
            <el-select size="small" :popper-append-to-body="false" @change="handleTheme" v-model="themeValue" placeholder="请选择">
              <el-option
              v-for="item in themeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="itemType width-9" style="margin-left: 10px;margin-top: 10px;" v-for="(nape,index) in themeTypeList" :key="index">
            <el-tooltip :disabled="nape.name.length > 12 ? false : true" class="item" effect="dark" :content="`${nape.name}`" placement="top-start">
              <el-select size="small" :popper-append-to-body="false" clearable v-model="nape.value" :placeholder="`${nape.name}`" v-if="nape.children">
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
      <div class="item-wrap">
          <p>观看权限<em style="margin-left: 5px;line-height: 14px;">*</em></p>
          <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.groupId" placeholder="请选择用户组" class="width-2" style="margin-right: 2px" filterable>
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
            </el-option>
          </el-select>
          <p class="err-notice">注：选择观看授权前先添加用户组</p>
        </div>
        <!-- <div class="item-wrap" v-if="addEditInfo.groupId == 1">
          <p>观看密码<em style="margin-left: 5px;line-height: 14px;opacity: 0;">*</em></p>
          <el-input size="small" class="width-2" v-model="addEditInfo.password" clearable></el-input>
          <p class="err-notice">注：密码须6位数字或字母或二者组成</p>
        </div> -->
					<div class="item-wrap" v-if="isCloud == true">
						<p>公网点播<em style="margin-left: 5px;line-height: 14px;">*</em></p>
						<el-switch
							:active-value=1
							:inactive-value=0
							v-model="addEditInfo.publicVod">
						</el-switch>
						<!-- <p class="err-notice">注：公网直播需保证AI 课堂培枢云账号中有足够的流量，否则可能影响直播</p> -->
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
							<el-button size="mini" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传ppt/word/pdf/jpg/png/xls/zip/rar教学相关文件，大小需小于50M</div>
						</el-upload>
					</div>
          <div class="item-wrap upload-box">
						<p>封面</p>
						<p class="p1"></p>
						<div class="upload-wrap">
							<el-upload
							:limit="1"
							:on-exceed="handleOnExceed"
								class="upload-demo"
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
						<p class="p1"></p>
						<div class="upload-wrap">
							<textarea v-model="addEditInfo.description"></textarea>
						</div>
					</div>
          <div style="text-align: center;margin: 10px 0 20px 0;">
            <el-button :loading="saveLoading" type="primary" size="mini" class="edit-btn" @click="editSave" v-if="$route.query.id">保存</el-button>
					  <el-button :loading="saveLoading" type="primary" size="mini" class="edit-btn" @click="httpRequest" v-else>保存</el-button>
          </div>
    </div>
  </div>
</template>

<script>
import nullimg from '../../../../assets/imgs/home-null.png';
import icon1 from '@/assets/imgs/icon_trans.png'
import { Message } from 'element-ui';
import { mapActions, mapState } from 'vuex'
import {creatTree,storage,baseUrl } from '@/assets/js/utils';
import Player from 'xgplayer';
	export default {
		name: '',
		props:{
      userInfo:{
        type: Object,
        default: null
      },
			userType: {
				type: Number,
			},
    },
		data() {
			return {
				isCloud: false,
				nullimg: nullimg,
        icon1: icon1,
        submitRow: {},
        submitShow: false,
        deleteRow: {},
        deleteShow: false,
        teachingFileIds: [],
        saveLoading: false,
        fileList: [],
        edufileList: [],
        groupList: [],
        preview: false, // 上传视频预览
        version: '',
        VideoDisabled: false,
        videoList: [],
        type: 1,
        actives: this.userType == 0 ? 3 : 1,
        pageNum: 1,
				pages: 0,
				total: 0,
				vp: null,
        uploadUrl: baseUrl + '/sm/label/save',
        eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
        list:[],
        id: '',
				playUrl: '',
        themeValue: '',
				permission: null,
        themeTypeList: [],
        addEditInfo: { publicVod:0, watchType: 0 , watchPassword:'' },
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
        defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"' // 默认图片
			}
		},
    computed: {
			...mapState({
      uploadTable:'uploadTable'
    })},
		mounted() {
      this.version = storage.get('version');
			if(localStorage.getItem('uiType') == 2) {
				this.handleGetType();
			}
      this.getLists();
      this.getgroupList();  //获取用户组列表
		},
		methods: {
      ...mapActions({
				commitUploadBoxVisible:'commitUploadBoxVisible',
				commitUploadTable:'commitUploadTable',
				commitUploadDataState:'commitUploadDataState'
			}),
			handleOnExceed(files,fileList) {
				this.$message('只能上传一个图片', 'error')
			},
			goDetail(val){
				if(val.status == 3){
					window.open('/vplay?themeid='+ val.id +'&type=2', '_blank')
				}
			},
      add(val){
				if(val == 1){
					this.type = 1;
					this.getList()
				}else{
					this.teachingFileIds = []
					this.edufileList = [];
					this.id = '';
					this.fileList = [];
					this.videoList = [];
					this.themeTypeList = [];
					this.addEditInfo = { publicVod:0, watchType: 0 , watchPassword:'' };
					this.themeValue = '';
					this.type = 2;
				}
      },
      submit(type, val){
				if(type == 0){
					if((val.status != 0 && val.status != 2) || val.convertStatus != 1){
						return;
					}
					this.submitRow = val;
					this.submitShow = true;
				}else{
					this.$axios.post('/index/personal/sm/file/submit', {id: this.submitRow.id}).then(res => {
						if(res.code == 200){
							this.submitShow = false;
							this.$message('送审成功', 'success');
							this.getList();
						}
					});
				}
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
      editData(val){
				if(this.uploadTable.findIndex(el => {
					return el.id == val.id
				}) !== -1){
					return this.$message('该视频正在上传,请待上传成功之后再进行编辑', 'error');
				}
        this.$axios.get('/index/personal/sm/file/info', {id: val.id}).then(res => {
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
          this.id = res.data.id;
					this.addEditInfo.video = res.data.localFileUrl
					this.preview = true;
					this.type = 2;
					setTimeout(() => {
						if(this.id){
						this.playUrl = res.data.localFileUrl;
						this.initVP();
					}
					}, 100);
					
				});
      },
      //删除 0删除 1删除确定
			deleteData(type, val){
				if(type == 0){
					if(val.convertStatus == 0){
						return
					}
					this.deleteRow = val;
					this.deleteShow = true;
				}else{
					this.$axios.post('/index/personal/sm/file/delete', [this.deleteRow.id]).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message('删除成功', 'success');
							this.total = this.total - 1;
							if (this.pageNum * 6 - this.total === 6) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.getList();
						}
					});
				}
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
      getgroupList(){
				this.$axios.get('/sm/theme/getSysGroup').then(res => {
					this.groupList = res.data;
				});
				this.$axios.get('/sm/theme/checkEICC', {type: 1}).then(res => {
					if(res.code == 200){
						this.isCloud = res.data
					}
				})
			},
      changeTab(type){
        this.actives = type;
				this.pageNum = 1;
        this.getList();
      },
			getLists(){
				let data = {
					pageNum: this.pageNum,
					pageSize: 6,
					dataSources: this.actives
				};
				this.$axios.get('/index/personal/file/list', data).then(ress => {
          this.permission = this.creatPermit(ress.data.permit);
					if(this.permission.watchVideo){
						this.actives = 3
					}
					if(this.permission.upload){
						this.actives = 1
					}
					if(!this.permission.upload && !this.permission.watchVideo){
            return
          }
					this.$axios.get('/index/personal/file/list', {
						pageNum: this.pageNum,
						pageSize: 6,
						dataSources: this.actives
					}).then(res => {
						this.list = res.data.pageList;
						this.pages = res.data.pages;
						this.total = res.data.total;
					});
				});
      },
      getList(){
        let data = {
					pageNum: this.pageNum,
					pageSize: 6,
					dataSources: this.actives
				};
				this.$axios.get('/index/personal/file/list', data).then(res => {
					this.list = res.data.pageList;
					if(res.data.permit.length > 0){
            this.permission = this.creatPermit(res.data.permit);
          }else{
            this.permission = []
          }
					this.pages = res.data.pages;
					this.total = res.data.total;
				});
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
      pageChange(val){
				this.pageNum = val;
				this.getList();
			},
      handleTheme() {
				this.addEditInfo.teacherId = '';
				this.getTeacherList();
				this.getTypeList();
			},
      getTeacherList() {
				let data = {
					famous: 0
				};
				if(this.themeValue == 7) {
					data.famous = 1;
				}
				this.$axios.get('/sm/interactive/getUser', data).then(res => {
					this.teacherList = res.data
				})
			},
      getTypeList(){
				this.$axios.get('/sm/label/listByCategory', {
					categoryId: this.themeValue,
					type: 1,
					id: this.addEditInfo.id
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
			remove(){
				this.videoList = [];
				this.addEditInfo.video = '';
				this.preview = false;
			},
      //上传的封面
			selectFiles(file){
				console.log(file,'fff')
				let isJpg;
				if (
					file.type == "image/jpeg" ||
					file.type == "image/png" ||
					file.type == "image/jpg"
				) {
					isJpg = true;
				} else {
					isJpg = false;
				}
				if(!isJpg){
					return this.$message('上传失败，文件格式错误', 'error');
				}
				if((file.size / 1024) > 500){
					return this.$message('照片只能上传jpg/png文件，且不超过500kb', 'error');
				}else{
					
				}
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
						let url = '/index/personal/sm/file/save';
						if(this.id){
							url = '/index/personal/sm/file/update';
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
												detail:formData
											}
										}
										this.commitUploadTable(uploadTbaleData)
										this.commitUploadBoxVisible(true)
									}
									this.type = 1;
                  this.getList();
								}
								
								this.$axios.post(url, formData,{
									headers: {
										uploadId: uploadId
									}
								}).then(res => {
									if(res.code == 200){
										this.id ? this.$message('编辑成功', 'success') : this.$message('新增成功', 'success');
										// 判断编辑是否有替换视频
										if(formData.get('video')){
											this.commitUploadTable({
												type:'splice',
												index:uploadId,
											})
										}else{
											this.type = 1
										}
										setTimeout(() => {
											this.getList();
										}, 200);
									}else if(res.code == -3000){
										this.upErrorMsg = res.message;
										this.upErrorShow = true;
									}else if(res.code == -10000){
										this.editShow = false
										// 判断编辑是否有替换视频
										if(this.addEditInfo.video){
											this.commitUploadDataState({
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
						this.$message('视频名称重复，该视频正在上传', 'error');
					}
			},
			//验证
			verify(){
				if(this.$verify.isEmpty(this.addEditInfo.video)){
					this.$message('请上传视频', 'error');
					return true;
				}
				if (this.$verify.isEmpty(this.addEditInfo.name)) {
					this.$message('请输入视频名称', 'error');
					return true;
				}
				if (this.addEditInfo.name.length > 20) {
					this.$message('视频名称不能超过20字', 'error');
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
.pagination-wrap {
  margin-top: 30px;
  text-align: center;
		.el-pagination.is-background .el-pager li:not(.disabled).active {
			background-color: #035AFF;
		}
	}
.box{
	.null-data{
		text-align: center;
		padding: 150px 0;
		img{
			width: 560px;
		}
		p{
			text-align: center;
			font-size: 14px;
			color: #999;
		}
	}
  padding: 15px;
  .header{
    display: flex;
    justify-content: space-between;
    .left{
      display: flex;
      .item{
        cursor: pointer;
        width: 90px;
        height: 30px;
        background: #F2F3F7;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
      }
      .active{
        color: #3867F5;
      }
    }
    .right{

    }
  }
  .addBox{
    overflow: hidden;
    width: 100%;
    .item-wrap{
		display: flex;
		align-items: center;
		margin-top: 15px;
		em{
			color: #F64646;
		}
		p:first-child{
      width: 98px;
			height: 30px;
			line-height: 30px;
			// text-align: justify;
			color: #303133;
			font-size: 14px;
		}
		p:first-child:after{
			content: '';
			display: inline-block;
			width: 100%;
		}
		.class-type{
			cursor: pointer;

			.act {
				border: solid 3px #5B8CFF;
				border-radius: 8px;
			}
			
			img{
				width: 286px;
				height: 159px;
				border: solid 3px #FFF;
			}
			p{
				margin-top: 7px;
				text-align: center;
				font-size: 14px;
				color: #606266;
			}
		}
	}
  }
  .content{
		padding-top: 10px;
    .item{
      display: inline-block;
      overflow: hidden;
		position: relative;
		width: 240px;
		height: 220px;
		margin: 20px 0 0 26px;
		box-sizing: border-box;
		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		background: #fff;
		color: #999;
		border-radius: 8px;
		transition: all 0.1s;
		// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		cursor: pointer;
		.img-wrap{
			// transform: scale(0.95);
			overflow: hidden;
			width: 100%;
			height: 141px;
			border-radius: 8px;
			transition: all 0.2s;
			img{
				width: 100%;
				height: 100%;
				border-radius: 8px;
				transition: all 0.3s;
			}
		}
		.tag-list{
			display: flex;
			position: absolute;
			top: 0;
			left: 0;
			flex-wrap: wrap; // 换行
			li{
				min-width: 36px;
				height: 14px;
				margin-bottom: 5px;
				margin-right: 6px;
				padding: 5px 8px;
				border-radius: 8px 0px 8px 0px;
				box-shadow: 0px 2px 3px 0px rgba(255,151,39,0.5);
				text-align: center;
				font-size: 12px;
				background: linear-gradient(88deg, #F8BE56 0%, #FA8846 100%);
				color: #fff;
			}
		}
		.layout-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			box-sizing: border-box;
			border-bottom: solid 1px #F1F2F4;
			height: 40px;
			font-size: 12px;
			padding:0 10px;
			.name{
				overflow: hidden;
				// max-width: 190px;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 14px;
        font-weight: 600;
				color: #333333;
			}
			i{
				margin-right: 5px;
				font-size: 14px;
				vertical-align: top;
			}
		}
		.video-btn{
			display: none;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			line-height: 40px;
			text-align: center;
			color: #fff;
			background: #035AFF;
		}
		.video-status {
			position: absolute;
			top: 0;
			left: 0;
			width: 84px;
			line-height: 23px;
			text-align: center;
			font-size: 12px;
			color: #fff;
      border-radius: 5px 0 5px 0;
			i{
				margin-right: 2px;
				font-size: 16px;
				vertical-align: text-bottom;
			}
		}
    .status0{
      background: rgb( 255, 65, 123);
    }
    .status1{
      background: rgb( 48, 96, 246);
    }
    .status2{
      background: rgb( 110, 123, 136);
    }
		.time{
			position: absolute;
			right: 8px;
			bottom: 83px;
			padding: 3px 6px;
			border-radius:10px;
			font-size: 12px;
			background:rgba(0,0,0,.4);
			color: #fff;
		}
    }
    .item:nth-child(3n + 1) {
      margin-left: 0;
    }
    .item:nth-child(1) {
      margin-top: 0;
    }
    .item:nth-child(2) {
      margin-top: 0;
    }
    .item:nth-child(3) {
      margin-top: 0;
    }
	.item:hover{
		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		transform: translateY(-5px) scale(1.06);
	}
	.item:hover .video-status{
		// width: 248px;
	}
	.item:hover img{
		transform: scale(1.12);
	}
	.item:hover .img-wrap {
		transform: scale(0.95);
		// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
	}
	.item:hover .video-btn{
		display: block;
	}
  .playAnimation {
	display: inline-block;
	width:24px;
	height: 20px;
	vertical-align: bottom;
	margin-right: 4px;
	.animationli {
		display: inline-block;
		width: 4px;
		height: 0px;
		background: #fff;
		margin-right: 2px;
		vertical-align: text-bottom;
		border-radius: 2px 2px 0 0;
	}
	.animationli:first-child{
		animation:mymove 0.9s infinite;
    -webkit-animation:mymove 0.9s infinite; 
	}
	.animationli:nth-child(2){
		animation:mymove 1.6s infinite;
    -webkit-animation:mymove 1.6s infinite; 
	}
	.animationli:nth-child(3){
		animation:mymove 1.3s infinite;
    -webkit-animation:mymove 1.3s infinite; 
	}
	.animationli:nth-child(4){
		animation:mymove 0.8s infinite;
    -webkit-animation:mymove 0.8s infinite; 
	}
	@keyframes mymove
	{
			0%   {height: 6px;}
			35%  {height: 13px;}
			45%  {height: 14px;}
			55%  {height: 15px;}
			65%  {height: 11px;}
			75%  {height: 10px;}
			85%  {height: 8px;}
			100% {height: 4px;}
	}

	@-webkit-keyframes mymove /* Safari and Chrome */
	{
			0%   {height: 6px;}
			35%  {height: 13px;}
			45%  {height: 14px;}
			55%  {height: 15px;}
			65%  {height: 11px;}
			75%  {height: 10px;}
			85%  {height: 8px;}
			100% {height: 4px;}
	}
}
  }
}
.err-notice{
		margin-left: 20px;
		color: #B3B6BA;
		font-size: 12px;
		&.err-color{color: #F64646}
	}
  ::v-deep .el-upload-dragger{
		width: 280px;
		height: 130px;
	}
	::v-deep .el-upload-dragger .el-icon-upload{
		margin-top: 20px;
	}
   ::v-deep .upload-demo .el-upload-list {
		margin: -145px 0 0 15px  !important;
		width: 250px;
    height: 130px;
	}
   ::v-deep .el-divider--horizontal{
    margin: 24px 0 0 0;
  }
  textarea{
    height: 60px;
    width: 280px;
    border: solid #DCDFE6 1px;
    resize: none;
  }
   ::v-deep .videoList .el-upload-list {
		margin: -170px 0 0 15px  !important;
		width: 250px;
	}
  .upload-demo{
    height: 160px;
  }
  .edufile .el-upload-list{
		margin: 0 !important;
	}
	.edufile .el-upload-list__item-name {
		padding: 0 !important;
		overflow: hidden;
    width: 240px;
    text-overflow: ellipsis;
	}
	.edufile .el-icon-close-tip {
		display: none !important;;
		right: -110px;
	}
  .width-2{
    width: 430px !important;
  }
	#vp{
		display: none;
	}
	.itemType{
		display: inline-block;
	}
	::v-deep .el-upload-list__item-name{
		max-width: 625px;
	}
</style>