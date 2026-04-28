<!-- recordlist -->
<template>
  <div v-if="type == 1" class="box">
    <div class="header">
      <div class="left">
        <div v-if="permission.found" :class="actives == 1 ? 'active item' : 'item'" @click="changeTab(1)">我的直播</div>
        <div v-if="permission.watchLive" :class="actives == 3 ? 'active item' : 'item'" style="margin-left: 10px;" @click="changeTab(3)">我观看的</div>
      </div>
      <div class="right">
        <el-button v-if="permission.save" icon="el-icon-plus" size="small" type="primary" @click="addLive">创建直播</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="content" v-if="list.length && list.length > 0">
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
				<div class="layout-item" v-if="val.status !== 0 && val.status !== 3">
					<span v-if="val.liveStatus != 0 && val.status == 4" style="min-width: 50px"><i class="iconfont icon-watch"></i> {{val.viewed}}</span>
					<span v-else></span>
          <span>{{val.teacherName}}</span>
				</div>
        <div v-else style="padding:0 10px;display: flex;justify-content: space-between;align-items: center;height: 40px;">
          <el-button style="width: 65px;" size="mini" @click="deleteData(0,val)">删除</el-button>
          <el-button style="width: 65px;" size="mini" @click="editData(val)">编辑</el-button>
          <el-button  v-if="val.status !== 3" style="width: 65px;" type="primary" size="mini" @click="submit(0,val)">送审</el-button>
        </div>
        <div v-if="val.status == 4">
          <p class="video-status status1" v-if="val.liveStatus == 1">
            <span class="playAnimation">
              <span class="animationli"></span>
              <span class="animationli"></span>
              <span class="animationli"></span>
              <span class="animationli"></span>
            </span>授课中</p>
          <p class="video-status status0" v-if="val.liveStatus == 0"><i class="el-icon-alarm-clock"></i>预告中</p>
          <p class="video-status status2" v-if="val.liveStatus == 2"><i class="el-icon-refresh-left"></i>已结束</p>
        </div>
				<div v-else>
          <p class="video-status status2" v-if="val.status == 0"><i class="el-icon-refresh-left"></i>待提交</p>
          <p class="video-status status2" v-if="val.status == 1"><i class="el-icon-refresh-left"></i>待审核</p>
          <p class="video-status status2" v-if="val.status == 2"><i class="el-icon-refresh-left"></i>待发布</p>
          <p class="video-status status2" v-if="val.status == 3"><i class="el-icon-refresh-left"></i>驳回<i :title="val.rejectReason ? val.rejectReason : '无理由'" class="el-icon-question" style="margin-left: 5px;"></i></p>
        </div>
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
    </div>
		<div class="null-data" v-else>
			<img :src="nullimg" alt="" />
      <p>{{!permission.found && !permission.watchLive ? '暂无访问权限！' : '暂无内容！'}}</p>
		</div>
    <el-dialog
			title="系统提示"
      style="margin-top: 16vh;"
     :append-to-body="true"
			:close-on-click-modal="false"
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
      title="删除直播"
     :append-to-body="true"
      :visible.sync="deleteShow"
      style="margin-top: 16vh;"
      width="420px">
      <div class="dialog-wrap">
        <p class="err-delete">确认删除该直播？</p>
        <div class="dialog-btn">
          <el-button type="primary" @click="deleteData(1)">确 定</el-button>
          <el-button @click="deleteShow = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  <div v-else class="box" style="height: 614px;">
    <div class="">
      <i class="el-icon-arrow-left" style="cursor: pointer;" @click="addLive(1)"></i>
      {{addEditInfo.id ? '编辑' : '创建'}}直播
    </div>
    <el-divider></el-divider>
    <div class="addBox">
      <div class="item-wrap" style="align-items: start;">
        <div style="display:flex">
          <p style="width: 88px;margin-top: 10px;">直播分类<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        </div>
        <div>
          <div class="itemType" style="padding-left:0;margin-left: 10px;margin-top: 10px;">
            <el-select style="width: 136px;" size="small" :popper-append-to-body="false" @change="handleTheme" v-model="themeValue" placeholder="请选择">
              <el-option
              v-for="item in themeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="itemType" style="margin-left: 10px;margin-top: 10px;" v-for="(nape,index) in themeTypeList" :key="index">
            <el-tooltip :disabled="nape.name.length > 12 ? false : true" class="item" effect="dark" :content="`${nape.name}`" placement="top-start">
              <el-select style="width: 136px;" size="small" :popper-append-to-body="false" clearable v-model="nape.value" :placeholder="`${nape.name}`" v-if="nape.children">
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
        <div style="display:flex">
          <p>直播名称<em style="margin-left: 5px;line-height: 14px;">*</em></p>
          <el-input class="width-2" size="small" v-model="addEditInfo.name" clearable></el-input>
        </div>
      </div>
      <div class="item-wrap">
        <p>开始时间<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        <el-date-picker
          size="small" 
          v-model="addEditInfo.startTime"
          type="datetime"
          class="width-2"
          value-format="yyyy-MM-dd HH:mm:ss"
					@change="clearTerminal"
          placeholder="开始时间">
        </el-date-picker>
        <p class="err-notice">注：开始时间需大于当前时间</p>
      </div>
      
      <div class="item-wrap">
        <p>结束时间<em style="margin-left: 5px;line-height: 14px;opacity: 0;">*</em></p>
        <el-date-picker
          size="small" 
          v-model="addEditInfo.endTime"
					@change="clearTerminal"
          type="datetime"
          class="width-2"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="结束时间">
        </el-date-picker>
        <p class="err-notice">注：大于开始时间，未填写则默认需手动结束</p>
      </div>
      <div class="item-wrap">
        <p>授课位置<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.orgId" @change="shcoolChange" placeholder="请选择学校" style="margin-right: 10px;width: 138px" filterable>
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.buildingId" @change="buildChange" placeholder="请选择教学楼" style="margin-right: 10px;width: 130px" filterable>
          <el-option
            v-for="item in buildlList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.classroomId" @change="classroomChange(1)" placeholder="请选择教室" style="width: 120px" filterable>
          <el-option
            v-for="item in classroomList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="item-wrap">
        <p>直播设备<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.terminalIdList"  placeholder="请选择设备" class="width-2" filterable>
          <el-option
            v-for="item in terminalIdList"
            :key="item.id"
            :label="item.terminalName"
            :value="item.id">
          </el-option>
        </el-select>
        <p class="err-notice">注：提前添加设备并绑定至直播教室</p>
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
        <div class="item-wrap" v-if="addEditInfo.groupId == 1">
          <p>观看密码<em style="margin-left: 5px;line-height: 14px;opacity: 0;">*</em></p>
          <el-input size="small" class="width-2" v-model="addEditInfo.password" clearable></el-input>
          <p class="err-notice">注：密码须6位数字或字母或二者组成</p>
        </div>
        <div class="item-wrap">
						<p>录制<em style="margin-left: 5px;line-height: 14px;">*</em></p>
						<el-switch
							v-model="addEditInfo.recode">
						</el-switch>
						<!-- <p class="err-notice">注：同时开启录制和公网直播，视频会自动进行公网点播</p> -->
					</div>

					<div class="item-wrap">
						<p>公网直播<em style="margin-left: 5px;line-height: 14px;">*</em></p>
						<el-switch
							:active-value=1
							:inactive-value=0
							v-model="addEditInfo.publicLive">
						</el-switch>
						<p class="err-notice">注：公网直播需保证智教慧学灵枢云账号中有足够的流量，否则可能影响直播</p>
					</div>
          <div class="item-wrap" v-if="addEditInfo.publicLive === 1">
						<p>公网观看权限<em style="margin-left: 5px;line-height: 14px;">*</em></p>
						<el-radio v-model="addEditInfo.watchType" :label=0>匿名</el-radio>
						<el-radio v-model="addEditInfo.watchType" :label=1>密码观看</el-radio>
					</div>
          <div class="item-wrap" v-if="addEditInfo.watchType === 1 && addEditInfo.publicLive === 1">
						<p>公网观看密码<em style="margin-left: 5px;line-height: 14px;">*</em></p>
						<el-input class="width-2" placeholder="6-20数字字母组成" v-model.trim="addEditInfo.watchPassword" clearable show-password></el-input>
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
            <el-button size="mini" :loading="loadingBtn" class="edit-btn" @click="httpRequest">保存</el-button>
					  <el-button size="mini" :loading="loadingBtnOne" type="primary" class="edit-btn" @click="httpRequest('release')">保存并送审</el-button>
          </div>
    </div>
  </div>
</template>

<script>
import nullimg from '../../../../assets/imgs/home-null.png';
import { Message } from 'element-ui';
import {creatTree, baseUrl, getNowDate } from '@/assets/js/utils';
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
				nullimg: nullimg,
        submitRow: {},
        submitShow: false,
        deleteRow: {},
        deleteShow: false,
        loadingBtn: false,
				loadingBtnOne: false,
        fileList: [],
        eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
        edufileList:[], // 已上传文件
        groupList: [],
        type: 1,
        actives: this.userType == 0 ? 3 : 1,
        pageNum: 1,
				pages: 0,
				total: 0,
        uploadUrl: baseUrl + '/sm/label/save',
        list:[],
        themeValue: '',
        themeTypeList: [],
        addEditInfo: {
					teacherId: JSON.parse(window.localStorage.getItem('userInfo')) ? JSON.parse(window.localStorage.getItem('userInfo')).userId : '',
					orgId: '', //学校id
					classroomId: '', //教室id
					buildingId: '',  //教学楼id
					mode: '0', // 播放方式h5/falsh
					// terminalIdList: [], //选择的 直播设备 数组
					terminalIdList:'',//选择的 直播设备
					recode: false, // 是否录制
					// recodeIdList: [], //选择的 录制设备 数组
					// recodeIdList: '', //选择的 录制设备
					groupId: '', //选择的 观看权限 人员
					publicLive: 0, // 是否开启公网直播
					watchType: 0, // 公网观看权限
					watchPassword: "", // 公网观看密码
					liveMode: 1, // 直播模式
					joiner: 0, //是否连麦
					publicVod:0 // 默认公网点播关闭，同时开启录制和直播打开
				},
        permission: null,
        schoolList: [], // 可选择的学校
				buildlList: [], // 可选的教学楼
				classroomList: [], // 可选的教室
				terminalIdList: [], //可选的 直播设备 数组
        teachingFileIds:[], // 一键发布时上传文件数组
				themeData: JSON.parse(localStorage.getItem('userInfo')).famous == 0 ? [
        {
          id: 8,
          name: "教师研修",
        },
        {
          id: 2,
          name: "课堂回顾",
        },
        {
          id: 3,
          name: "停课不停学",
        },
      ] : [
        {
          id: 8,
          name: "教师研修",
        },
        {
          id: 2,
          name: "课堂回顾",
        },
        {
          id: 3,
          name: "停课不停学",
        },
        {
          id: 7,
          name: "名师课堂",
        },
      ],
        defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"' // 默认图片
			}
		},
		mounted() {
			if(localStorage.getItem('uiType') == 2) {
				this.handleGetType(); // 获取类型主类
				// this.getTypeList();
			}else{
				if(JSON.parse(window.localStorage.getItem('userInfo')).famous == 0){
					this.themeData = [
						{
							id: 8,
							name: "教师研修"
						},
						{
							id: 2,
							name: "课堂回顾"
						},
						{
							id: 3,
							name: "停课不停学"
						}
					]
				}else{
					this.themeData = [
						{
							id: 8,
							name: "教师研修"
						},
						{
							id: 2,
							name: "课堂回顾"
						},
						{
							id: 3,
							name: "停课不停学"
						},
						{
							id: 7,
							name: "名师课堂"
						},
					]
				}
			}
      this.getLists();
      this.getSchoolList(); //获取学校列表
      this.getgroupList();  //获取用户组列表
		},
		methods: {
			handleGetType() {
				this.$axios.get('/sm/category/listAll').then(res => {
					if (res.code === 200) {
						let arr = res.data.filter(el => el.id !== 1);
						this.themeData = arr;
					}
				})
			},
			handleOnExceed(files,fileList) {
				this.$message('只能上传一个图片', 'error')
			},
			goDetail(val){
				console.log('va;',val)
				if(val.status == 4){
					if(val.liveStatus == 1 || val.liveStatus == 0){
						window.open('/hplay?themeid='+ val.id +'&type=0', '_blank')
					}
					if(val.liveStatus == 2){
						window.open('/pplay?themeid='+ val.id +'&type=0', '_blank')
					}
				}
			},
      judgeEndTime(time){
				if(getNowDate() > time){
					this.$message('该主题已过结束时间，无法操作', 'error');
					return true;
				}
				return false;
			},
			clearTerminal(){
				if (this.addEditInfo.classroomId) {
					this.classroomChange(1);
				}
			},
      //送审 0送审 1送审确定
			submit(type, val){
				if(type == 0){
					if(val.status !== 0 && val.status !== 3){
						return;
					}
					if(this.judgeEndTime(val.endTime)){
						return
					};
					this.submitRow = val;
					this.submitShow = true;
				}else{
					this.$axios.post('/index/personal/sm/theme/submit', {id: this.submitRow.id}).then(res => {
						if(res.code == 200){
							this.submitShow = false;
							this.$message('送审成功', 'success');
							this.getList();
						}
					});
				}
			},
      editData(val){
        this.$axios.get('/index/personal/sm/theme/info', {id: val.id}).then(res => {
					this.valData = res.data.labelList;
					res.data.terminalIdList = res.data.terminalList.length > 0 ? res.data.terminalList[0].terminalId : '';
					res.data.recode = res.data.recode == 1 ? true : false;
					if(res.data.imgUrl){
						this.fileList = [{name: '', url: res.data.imgUrl}];
					}else{
						this.fileList = [];
					}
					this.edufileList = res.data.teachingFileList;
					this.teachingFileIds = this.edufileList.map( i => i.id);
					this.addEditInfo = res.data;
					this.addEditInfo.hot = res.data.hot == 1;
					this.addEditInfo.mode = this.addEditInfo.mode + '';
					if(res.data.groupId == 1) {
						this.addEditInfo.password = res.data.password;
					}
					this.addEditInfo.joiner = res.data.joiner == 1 ? true : false;
					this.addEditInfo.teacherId = res.data.teacherId; 
					this.themeValue = res.data.categoryId; // 获取编辑id赋给一级分类select
					if(res.data.liveMode === 1){
						this.getTerminalIdList();
						this.getTeachBuildList(res.data.orgId);
						this.getClassroomList(res.data.buildingId);
					}
					if (this.themeValue !== '') {
						this.getTypeList();
					}
          this.type = 2;
				});
      },
      //删除 0删除 1删除确定
			deleteData(type, val){
				if(type == 0){
					this.deleteRow = val;
					this.deleteShow = true;
				}else{
					this.$axios.post('/index/personal/sm/theme/delete', [this.deleteRow.id]).then(res => {
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
      addLive(val){
				if(val == 1){
					this.type = 1;
					this.getList()
				}else{
					this.themeValue = '';
					this.themeTypeList = [];
					this.teachingFileIds = [];
					this.fileList = [];
					this.edufileList = [];
					this.addEditInfo = {
						teacherId: JSON.parse(window.localStorage.getItem('userInfo')) ? JSON.parse(window.localStorage.getItem('userInfo')).userId : '',
						orgId: '', //学校id
						classroomId: '', //教室id
						buildingId: '',  //教学楼id
						mode: '0', // 播放方式h5/falsh
						// terminalIdList: [], //选择的 直播设备 数组
						terminalIdList:'',//选择的 直播设备
						recode: false, // 是否录制
						// recodeIdList: [], //选择的 录制设备 数组
						// recodeIdList: '', //选择的 录制设备
						groupId: '', //选择的 观看权限 人员
						publicLive: 0, // 是否开启公网直播
						watchType: 0, // 公网观看权限
						watchPassword: "", // 公网观看密码
						liveMode: 1, // 直播模式
						joiner: 0, //是否连麦
						publicVod:0 // 默认公网点播关闭，同时开启录制和直播打开
					},
					this.type = 2;
				}
      },
      changeTab(type){
        this.actives = type;
				this.pageNum = 1;
        this.getList();
      },
			getList(){
        let data = {
					pageNum: this.pageNum,
					pageSize: 6,
					dataSources: this.actives
				};
				this.$axios.get('/index/personal/theme/list', data).then(res => {
					this.list = res.data.pageList;
					this.pages = res.data.pages;
					this.total = res.data.total;
				});
      },
      getLists(){
        let data = {
					pageNum: this.pageNum,
					pageSize: 6,
					dataSources: this.actives
				};
				this.$axios.get('/index/personal/theme/list', data).then(ress => {
          this.permission = this.creatPermit(ress.data.permit);
					if(this.permission.watchLive){
						this.actives = 3
					}
					if(this.permission.found){
						this.actives = 1
					}
          if(!this.permission.found && !this.permission.watchLive){
            return
          }
					this.$axios.get('/index/personal/theme/list', {
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
      removeFile (file) {
				this.addEditInfo.file = null
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
					return this.$confirm(`确定移除该文件吗？`, '删除提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(file.percentage && file.percentage !== 100){
								// 未上传成功取消请求
								this.$refs.edufileupload.abort();
								return true;
							}
							if(this.addEditInfo.id){  // 存再themeId 即为编辑   // 删除不调用删除接口
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
      //获取用户组列表
			getgroupList(){
				this.$axios.get('/sm/theme/getSysGroup').then(res => {
					this.groupList = res.data;
				});
			},
      pageChange(val){
				this.pageNum = val;
				this.getList();
			},
      handleTheme() {
				// this.addEditInfo.teacherId = '';
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
					type: 0,
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
					console.log('themeTypeList',this.themeTypeList)
				});
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
      //获取学校列表
			getSchoolList(){
				this.$axios.get('/sys/org/listSchool').then(res => {
					this.schoolList = res.data;
					// if (this.schoolList.length > 0) {
					// 	this.addEditInfo.orgId = this.schoolList[0].id;
						this.getTeacherList();
					// 	if (this.addEditInfo.orgId) {
					// 		this.getTeachBuildList(this.addEditInfo.orgId);
					// 	}
					// }
				})
			},
			//根据学校id获取教学楼列表
			getTeachBuildList(orgId){
				this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then(res => {
					this.buildlList = res.data;
					// if (this.buildlList.length > 0) {
					// 	this.addEditInfo.buildingId = this.buildlList[0].id;
					// 	if (this.addEditInfo.buildingId) {
					// 		this.getClassroomList(this.addEditInfo.buildingId);
					// 	}
					// }
				})
			},
			//根据教学楼id获取教室列表
			getClassroomList(buildingId){
				this.$axios.get('/sys/classroom/getClassroomList', {buildingId: buildingId}).then(res => {
					this.classroomList = res.data;
					// if (this.classroomList.length > 0) {
					// 	this.addEditInfo.classroomId = this.classroomList[0].id;
					// }
				})
			},
			//选择学校后 教学楼、教室修改
			shcoolChange(id){
				// this.recodeList = [];
				this.buildlList = [];
				this.addEditInfo.buildingId = '';
				this.addEditInfo.classroomId = '';
				this.classroomList = [];
				this.classroomChange();
				this.getTeachBuildList(id);
			},
			//教学楼改变后教室修改
			buildChange(id){
				// this.recodeList = [];
				this.addEditInfo.classroomId = '';
				this.classroomList = [];
				this.classroomChange();
				this.getClassroomList(id);
			},
			//教室改变后直播设备改变 录制机位改变
			classroomChange(type){
				// this.recodeList = [];
				this.terminalIdList = [];
				// this.addEditInfo.terminalIdList = [];
				this.addEditInfo.terminalIdList = ''
				// this.addEditInfo.recodeIdList = '';
				if(type) {
					this.getTerminalIdList('room');
				}
				// this.terminalChange();
			},
      getTerminalIdList(room){
				let data = {
					classroomId: this.addEditInfo.classroomId,
					startTime: this.addEditInfo.startTime,
					endTime: this.addEditInfo.endTime,
				};
				if(this.addEditInfo.id){
					data.themeId = this.addEditInfo.id;
				};
				this.$axios.get('/sm/theme/getSelectTerminal', data).then(res => {
					// debugger
					this.terminalIdList = res.data;
					if (!this.$route.query.themeid || room === 'room') { // 新增
						const id = this.terminalIdList.length > 0 ? this.terminalIdList[0].id : '';
						this.addEditInfo.terminalIdList = id ? id : '';
					}
				});
			},
      //覆盖默认上传，手动上传
			httpRequest(param) {
				if(this.verify()){
					return
				};
				if (param === 'release') {
					this.loadingBtnOne = true;
				} else {
					this.loadingBtn = true;
				}
				let typeIdList = [];
				this.themeTypeList.forEach(v => {
					if (v.value !== null || v.value !== '') {
						typeIdList.push(v.value);
					}
				});
				let idList = [];
				this.themeTypeList.forEach(v => {
					if (v.value) {
						idList.push(v.value);
					}
				});
				if(this.addEditInfo.publicLive && this.addEditInfo.recode){
					this.addEditInfo.publicVod = 1
				}
				let formData = new FormData();
				formData.append('file', this.addEditInfo.file ? this.addEditInfo.file : '');
				formData.append('name', this.addEditInfo.name);
				// formData.append('labelIdList', this.addEditInfo.labelIdList);
				formData.append('labelIdList', idList);
				formData.append('startTime', this.addEditInfo.startTime);
				if(this.addEditInfo.endTime && this.addEditInfo.liveMode === 1){
					formData.append('endTime', this.addEditInfo.endTime);
				}
				if(this.addEditInfo.liveMode === 1){
					formData.append('classroomId', this.addEditInfo.classroomId);
					formData.append('terminalIdList', this.addEditInfo.terminalIdList);
				}
				if(this.teachingFileIds.length != 0){
					formData.append('teachingFileIds', this.teachingFileIds);
				}
				if(this.addEditInfo.groupId == 1){
					formData.append('password', this.addEditInfo.password ? this.addEditInfo.password : '');
				}
				formData.append('fileDetection', this.addEditInfo.file !==null ? 0 : 1);
				formData.append('orgId', this.addEditInfo.orgId);
				formData.append('teacherId', this.addEditInfo.teacherId);
				// if(this.addEditInfo.recode && this.addEditInfo.liveMode === 1){
				// 	formData.append('recodeIdList', this.addEditInfo.recodeIdList);
				// };
				formData.append('groupId', this.addEditInfo.groupId);
				formData.append('recode', this.addEditInfo.recode ? 1 : 0);
				formData.append('hot', this.addEditInfo.hot ? 1 : 0);
				formData.append('mode', this.addEditInfo.mode);
				formData.append('description', this.addEditInfo.description ? this.addEditInfo.description : '');
				formData.append('categoryId', this.themeValue);
				formData.append('publicLive', this.addEditInfo.publicLive);
				formData.append('publicVod', this.addEditInfo.publicVod);
				formData.append('watchType', this.addEditInfo.watchType);
				formData.append('watchPassword', this.addEditInfo.watchPassword);
				formData.append('liveMode', this.addEditInfo.liveMode);
				if(this.addEditInfo.liveMode === 2) {
					formData.append('joiner', this.addEditInfo.joiner ? 1 : 0);
				}
				let url = '/index/personal/sm/theme/save';
				if(this.addEditInfo.id){ // 编辑更新
					url = '/index/personal/sm/theme/update';
					formData.append('id', this.addEditInfo.id);
				};
				if (param === 'release') { // 一键发布
					url = '/index/personal/sm/theme/saveAndAuth';
				}
				// for (var key of formData.keys()) {
				// 	console.log(key); 
				// }
				// return
				this.$axios.post(url, formData).then(res => {
					this.loadingBtn = false;
					this.loadingBtnOne = false;
					if(res.code == 200){
						this.type = 1;
            this.getList();
						this.$message('保存成功', 'success');
					}
					if (res.code === -10001) {
						Message.closeAll();
						this.outerVisible = true;
					}
					if (res.code === -10002) {
						Message.closeAll();
						this.onDemandOuter = true;
					}
				}, err => {
					console.log(err)
					reject(err)
				})
			},
      //验证
			verify(){
				Message.closeAll();
				if(this.$verify.isEmpty(this.themeValue)){
					this.$message('分类未选择', 'error');
					return true;
				}
				var ifResult = false;
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
				if (!this.addEditInfo.name) {
					this.$message('请输入主题名称', 'error');
					return true;
				}
				if (this.addEditInfo.name.length > 100) {
					this.$message('主题名称不能超过100字', 'error');
					return true;
				}
				if (this.addEditInfo.startTime === undefined || this.addEditInfo.startTime === null) {
					this.$message('请选择开始时间', 'error');
					return true;
				}
				if(this.addEditInfo.startTime < getNowDate()){
					this.addEditInfo.startTime = getNowDate();
				}
				if (this.addEditInfo.endTime) {
					if (this.addEditInfo.endTime <= this.addEditInfo.startTime) {
						this.$message('结束时间不能小于等于开始时间', 'error');
						return true;
					}
					if(this.addEditInfo.endTime < getNowDate()){
						this.$message('结束时间不能小于当前时间', 'error');
						return true;
					}
				}
				if(this.addEditInfo.liveMode === 1) {
					if (this.$verify.isEmpty(this.addEditInfo.orgId)) {
						this.$message('请选择学校', 'error');
						return true;
					}
					if (this.$verify.isEmpty(this.addEditInfo.buildingId)) {
						this.$message('请选择教学楼', 'error');
						return true;
					}
					if (this.$verify.isEmpty(this.addEditInfo.classroomId)) {
						this.$message('请选择教室', 'error');
						return true;
					}
					if(this.$verify.isEmpty(this.addEditInfo.terminalIdList)){
						this.$message('请选择直播设备', 'error');
						return true;
					}
					if(this.$verify.isEmpty(this.addEditInfo.teacherId)){
						this.$message('请选择授课教师', 'error');
						return true;
					}
				}
				if(this.$verify.isEmpty(this.addEditInfo.groupId)){
					this.$message('请选择观看权限', 'error');
					return true;
				}
				console.log(this.addEditInfo.password,'this.addEditInfo.password')
				if (this.addEditInfo.groupId == 1 && this.addEditInfo.password && this.addEditInfo.password !== '') {
					if (this.$verify.checkNumEn(this.addEditInfo.password,6,6)) {
						this.$message('观看密码须6位数字或字母或二者组成', 'error');
						return true;
					}
				}
				if (this.addEditInfo.publicLive === 1 && this.addEditInfo.watchType === 1) {
					if (!this.addEditInfo.watchPassword) {
						this.$message('请输入公网观看密码', 'error');
						return true;
					}
					if (this.$verify.checkNumEn(this.addEditInfo.watchPassword,6,20)) {
						this.$message('公网观看密码须6-20位数字或字母或二者组成', 'error');
						return true;
					}
				}
				if(this.addEditInfo.description && this.addEditInfo.description.length > 200){
					this.$message('简介最长200个字', 'error');
					return true;
				}
			},
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
			bottom: 96px;
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
		vertical-align: baseline;
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
    height: 110px;
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
  .width-2{
    width: 408px;
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
  .upload-demo{
    height: 160px;
  }
	.itemType{
		display: inline-block;
	}
	::v-deep .el-upload-list__item-name{
		max-width: 620px;
	}
</style>