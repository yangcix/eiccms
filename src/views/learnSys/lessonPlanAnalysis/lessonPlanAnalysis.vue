<template>
  <div class="content-main-wrap">
    <p class="content-title">教案分析</p>

    <div class="main-wrap">
      <div class="search-operat" style="min-width: 1100px;">
        <div>
          <el-input class="width-2" clearable v-model="searchKey" placeholder="请输入名称关键字"
                    v-search="handleSearch"></el-input>
          <span class="search-desc">科目：</span>
          <!-- <span class="search-desc">直播：</span> -->
          <el-select v-model="subjectId" placeholder="选择科目" style="margin-left: 10px;width: 112px;">
            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <span class="search-desc">状态：</span>
          <el-select v-model="status" placeholder="选择状态" class="width-3"
                     style="margin-left: 10px;width: 112px;">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span class="search-desc">课堂类型：</span>
          <el-select v-model="classType" placeholder="选择课堂类型" style="margin-left: 10px;width: 132px;">
            <el-option v-for="item in classTypeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" class="search-btn" @click="handleSearch">查询</el-button>
        </div>
        <div>
          <el-button icon="el-icon-plus" v-if="permission.save" @click="add()">新增</el-button>
        </div>
      </div>
      <div class="data-table table-border" style="min-width: 1150px;">
        <el-table :row-style="{ height: '10px' }" :cell-style="{ padding: '12px 0' }" v-loading="loading"
                  :data="tableData" style="width: 100%;">
<!--          <el-table-column align="center" label="课题">
            <template slot-scope="scope">
              <div class="tableName" @click="detail(scope.row)">{{ scope.row.name }}</div>
            </template>
          </el-table-column>-->
          <el-table-column prop="name" align="center" label="课题">
          </el-table-column>
          <el-table-column prop="subjectName" align="center" label="科目">
          </el-table-column>
          <el-table-column prop="classTypeName" align="center" label="课堂类型">
          </el-table-column>
          <el-table-column prop="gradeName" align="center" label="年级">
          </el-table-column>
          <el-table-column prop="teacherName" align="center" label="教师">
          </el-table-column>
          <el-table-column align="center" label="状态">

            <template slot-scope="scope">
              <ul>
                <li v-if="scope.row.status === 0">分析中</li>
                <li v-if="scope.row.status === 1">分析完成</li>
                <li v-if="scope.row.status === 2">分析失败</li>
                <li v-if="scope.row.status === 3">文件解析中</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" min-width="110" label="创建时间">
          </el-table-column>
          <el-table-column align="center" min-width="160px" label="操作">

            <template slot-scope="scope">
              <div class="btnList" v-if="scope.row.type == 1 && scope.row.resources == 3">
              </div>
              <div class="btnList" v-else>
                <el-button type="text" @click="add(0, scope.row)"
                           v-if="permission.update && scope.row.status == 2">编辑</el-button>
                <el-button type="text" @click="openReport(scope.row)"
                           v-if="permission.report && scope.row.status == 1">查看报告</el-button>
                <el-button type="text" @click="openReport(scope.row)"
                           v-if="permission.report && scope.row.status == 0" disabled>查看报告</el-button>
                <el-button type="text" v-if="permission.report && scope.row.status == 2 && scope.row.isResetting == 0" @click="resetting(scope.row)">重置分析</el-button>
                <el-button style="color: #b3b6ba;" type="text" v-if="permission.report && scope.row.status == 2  && scope.row.isResetting == 1" disabled>重置分析</el-button>
                <el-button type="text" style="color:#f56c6c" @click="deleteData(scope.row)"
                           v-if="permission.delete && scope.row.status == 2">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-count="pages"
                       :current-page="pageNum">
        </el-pagination>
      </div>
      <el-dialog :title="patchData.name + (patchData.type == 1 ? '(磨课中)' : '(已结束)')" :close-on-click-modal="false"
                 :visible.sync="alertVideo" width="600px" class="videoBox" :before-close="handleClose">
        <div id="videoAlert" ref="videoAlert"></div>
      </el-dialog>

      <el-dialog title="导出视频" :close-on-click-modal="false" :visible.sync="exportVideo" width="460px"
                 :before-close="handleCloseExport">
        <div>
          <div class="dialog-item">
            <p>名称</p>
            <p><em>*</em>：</p>
            <el-input v-model.trim="exportName" clearable class="width-5"></el-input>
          </div>
          <div class="dialog-item">
            <p>视频分类</p>
            <p><em>*</em>：</p>
            <el-select class="width-5" style="margin-left: 2px;" @change="handleTheme" v-model="themeValue"
                       placeholder="请选择">
              <el-option v-for="item in themeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="sublevel" v-if="themeTypeList.length > 0">
            <div v-for="(nape, index) in themeTypeList" :key="index"
                 style="float:left;margin-left:18px;margin-bottom:20px">
              <el-select class="width-9" clearable v-model="nape.value" :placeholder="`请选择${nape.name}`"
                         v-if="nape.children">
                <el-option v-for="item in nape.children" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="dialog-item">
            <p>观看权限</p>
            <p><em>*</em>：</p>
            <el-select class="width-5" v-model="userWatch" clearable placeholder="请选择" filterable>
              <el-option v-for="item in userData" :key="item.id" :label="item.groupName" :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class="dialog-item">
            <p>封面</p>
            <p><em style="opacity: 0;">*</em>：</p>
            <el-upload class="upload-democlip" accept=".png,.jpg" :limit="1" :on-exceed="handleOnExceed"
                       :file-list="fileList" :action="uploadUrl" :on-change="handleSelectFile" :before-remove="beforeRemov1e"
                       list-type="picture" :auto-upload="false" drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>

          <div class="dialog-item">
            <p>公网点播</p>
            <p><em>*</em>：</p>
            <el-switch :active-value=1 :inactive-value=0 v-model="publicVod">
            </el-switch>
            <!-- <p class="err-notice">注：公网直播需保证艾课云账号中有足够的流量，否则可能影响直播</p> -->
          </div>

          <div class="dialog-item" v-if="publicVod === 1">
            <p class="notselect">公网观看权限</p>
            <p class="notselect"><em>*</em>：</p>
            <el-radio v-model="watchType" :label=0>所有人可看</el-radio>
            <el-radio v-model="watchType" :label=1>授权码观看</el-radio>
          </div>

          <div class="dialog-item" v-if="publicVod === 1 && watchType === 1">
            <p>公网观看密码</p>
            <p><em>*</em>：</p>
            <el-input class="width-2" placeholder="4-20数字字母组成" v-model.trim="watchPassword" clearable
                      show-password></el-input>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEnsure">确 定</el-button>
          <el-button @click="handleCloseExport">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="删除磨课" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
        <div class="dialog-wrap">
          <p class="err-delete">确认删除该磨课？</p>
          <div class="dialog-btn">
            <el-button type="primary" @click="handleDelete()">确 定</el-button>
            <el-button @click="deleteShow = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="再次提交" :close-on-click-modal="false" :visible.sync="againShow" width="420px">
        <div class="dialog-wrap">
          <p class="err-delete">是否发起再次提交？</p>
          <div class="dialog-btn">
            <el-button type="primary" @click="handleAgain()">确 定</el-button>
            <el-button @click="againShow = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog class="resetting" title="重置分析" :close-on-click-modal="false" :visible.sync="resettingShow"
                 width="500px">
        <span class="popUp">确认要重新提交视频文件进行AI分析吗?</span>
        <span class="prompt">(注：报告生成失败，请联系管理员或尝试重置分析)</span>
        <div style="margin-top: 40px; display: flex; justify-content: right;">
          <el-button @click="resettingShow = false" style="margin-right: 10px;">取 消</el-button>
          <el-button type="primary" @click="resetAnalysis()" style="margin-right: 10px;">确 定</el-button>
        </div>
      </el-dialog>
      <!--  查看AI报告   -->
      <el-dialog
          title="提示"
          :visible.sync="openAiReportDialog"
          width="30%"
          :before-close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {baseUrl, session} from '@/assets/js/utils';
import Player from 'xgplayer';
import FlvJsPlayer from 'xgplayer-flv.js';
import { creatTree } from "../../../assets/js/utils";
import {mapActions} from "vuex";
export default {
  name: '',
  data() {
    return {
      aiNum: 0,
      searchResourcesStatus: '',
      statusList: [
            { value: '', label: '选择状态' },
            { value: 0, label: '分析中' },
            { value: 1, label: '分析完成' },
            { value: 2, label: '分析失败' },
            { value: 3, label: '文件解析中' },
      ],
      subjectId: '',
      status: '',
      classType: '',
      deleteVal: {},
      themeTypeList: [],
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
      themeValue: '',
      deleteShow: false,
      resettingShow: false,
      resettingVal: {},
      againVal: {},
      againShow: false,
      fileList: [],
      uploadUrl: baseUrl + '/sm/category/save',
      exportVideo: false,
      searchKey: '',
      pages: 1,
      pageNum: 1,
      tableData: [],
      alertVideo: false,
      myVideo: null,
      patchData: {},
      permission: '',
      loading: false,
      userData: [],
      userWatch: '',
      addEditInfo: { name: '' },
      exportName: '',
      deriveData: [],
      totalS: '',
      subjectList: [],
      classTypeList: [],
      publicVod: '', //是否公网点播
      watchType: 0, // 是否需要授权码
      watchPassword: '', // 观看密码
      checkItem: null,
      aiType: JSON.parse(localStorage.getItem("sysInfo")).aiConfigId,
      openAiReportDialog: false,
    }
  },
  watch: {
    $route(to, from) {
      if (from.path == '/lessonPlanAnalysis/detail') {
        this.handleGetData();
      } else if (from.path !== '/aiGrinding') {
        this.searchKey = '';
        this.subjectId = '';
        this.status = '';
        this.classType = ''
        if (from.path == '/sm/aiclassAddEdit') {
          if (from.query && from.query.themeid) {
            this.handleGetData();
          } else {
            this.pageNum = 1;
            this.handleGetData();
          }
        }
      }
    },
  },
  mounted() {
    this.getSubjectList();
    this.getClassTypeList();
    this.pageNum = 1;
    this.handleGetData();
    this.$bus.off('getAiList', this.handleGetData);
    this.$bus.on('getAiList', this.handleGetData);
    // this.$bus.emit('getAiList');
  },
  methods: {
    handleOnExceed(files, fileList) {
      this.$message('只能上传一个图片', 'error')
    },
    detail(val) {
      if (this.permission.save || this.permission.update) {
        this.$router.push({ path: '/lessonPlanAnalysis/edit', query: { id: val.id, permission: JSON.stringify(this.permission) } });
      } else {
        this.$message("您没有当前操作的权限，请联系管理员", "error");
      }
    },
    openReport(val) {
      if(val.resources==3 && (val.url == null || val.url == "")) {
        this.$message("视频未上传，无法生成报告", "error");
        return;
      }
      if (val.aiStatus == 0 || val.aiStatus == 1) {
        this.$message("报告生成中，请稍后再试！", "error");
        return;
      }
      if (val.aiStatus == 3) {
        this.$message("报告生成失败，请联系管理员！", "error");
        return;
      }

      if (this.aiType == 2) {
        window.open('/aiReport?id=' + val.id, '_blank')
      } else {
        window.open(val.aiReport, '_blank')
      }
    },
    getSubjectList() {
      this.$axios.get('/aiGrinding/getSubject').then(res => {
        this.subjectList = res.data;
        this.subjectList.unshift({
          id: '',
          name: '选择科目'
        })
      })
    },
    getClassTypeList() {
      this.$axios.get("/aiGrinding/getClassType").then((res) => {
        this.classTypeList = res.data;
      });
    },
    againData(row) {
      this.againVal = row
      this.againShow = true
    },
    //重置分析弹窗
    resetting(row) {
      if (row.isResetting != 0) {
        return;
      }
      this.resettingVal = row
      this.resettingShow = true
    },
    deleteData(row) {
      this.deleteVal = row
      this.deleteShow = true
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
    handleGetData() {
      console.log('重新获取教案分析')
      this.loading = true;
      this.$axios.get('/lessonPlanAnalysis/list', {
        subjectId: this.subjectId,
        status: this.status,
        classType: this.classType,
        keyWord: this.searchKey,
        pageNum: this.pageNum, // 页数
        pageSize: 10 // 请求显示条数
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.pageList;
          this.pages = res.data.pages;
          this.permission = this.creatPermit(res.data.permit);
          this.loading = false;
          this.totalS = res.data.total;
        }
      })
    },
    // 视频分类change
    handleTheme() {
      this.getTypeList();
    },
    //获取类型
    getTypeList() {
      this.$axios.get('/sm/label/listByCategory', {
        categoryId: this.themeValue,
        type: 0,
        // id: this.$route.query.themeid
        // id: this.currentData.id
      }).then(res => {
        let treeList = creatTree(res.data);
        let data = [];
        treeList.forEach(val => {
          if (val.children) {
            data.push(val);
          }
          // val.value = this.valData.find((v) => v.id === 12) ? this.valData.find((v) => v.id === 12).id : 0;
        })
        this.themeTypeList = data;

      });
    },
    // 合并
    add(type, val) {
      if (type == 0) {
        this.$router.push({ path: '/lessonPlanAnalysis/edit', query: { id: val ? val.id : '' } });
      } else {
        this.$router.push('/lessonPlanAnalysis/edit');
      }
    },
    // 导出视频确定btn
    handleEnsure() {
      if (!this.exportName) {
        this.$message('名称不能为空！', 'error');
        return true;
      }
      if (this.exportName.length > 20) {
        this.$message('名称限制20个字符！', 'error');
        return true;
      }
      if (this.$verify.isEmpty(this.themeValue)) {
        this.$message('请选择类型', 'error');
        return true;
      }
      let ifResult = false;
      if (this.themeTypeList.length !== 0) {
        let ifType = this.themeTypeList.some((v, i) => {
          if (v.value === null || v.value === '') {
            this.$message(`${v.name}未选`, 'error');
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
      if (this.userWatch === '') {
        this.$message('请选择观看权限！', 'error');
        return true;
      }
      if (this.watchType === 1) {
        if (!this.watchPassword) {
          this.$message('请设置公网观看密码', 'error');
          return;
        }
        if (this.$verify.checkNumEn(this.watchPassword, 4, 20)) {
          this.$message('公网观看密码须4-20位数字或字母或二者组成', 'error');
          return;
        }
      }
      let typeIdList = [];
      this.themeTypeList.forEach(v => {
        if (v.value !== null || v.value !== '') {
          typeIdList.push(v.value);
        }
      });
      let formData = new FormData();
      formData.append('categoryId', this.themeValue);
      formData.append('labelIdList', typeIdList);
      formData.append('file', this.addEditInfo.file);
      formData.append('name', this.exportName);
      formData.append('id', this.deriveData.id);
      formData.append('groupId', this.userWatch);
      formData.append('publicVod', this.publicVod);
      formData.append('watchType', this.watchType);
      formData.append('watchPassword', this.watchPassword);
      this.$axios.post('/sm/clip/exportVideo', formData).then(res => {
        if (res.code === 200) {
          this.exportVideo = false;
          this.exportName = '';
          this.userWatch = '';
          this.publicVod = 0;
          this.watchType = 0;
          this.addEditInfo = { name: '' };
          this.fileList = [];
          this.themeTypeList = [];
          this.themeValue = '';
          this.watchPassword = '';
          this.$message(res.message, 'success');
          this.pageNum = 1;
          this.handleGetData();

        }
      })
    },
    handleCloseExport() {
      this.exportVideo = false;
      this.exportName = '';
      this.userWatch = '';
      this.publicVod = 0;
      this.watchType = 0;
      this.addEditInfo = { name: '' };
      this.fileList = [];
      this.themeTypeList = [];
      this.themeValue = '';
      this.watchPassword = '';
    },
    beforeRemov1e() { this.addEditInfo.file = null },
    handleSelectFile(file) {
      if ((file.raw.size / 1024) > 500) {
        this.fileList = [];
        return this.$message('封面只能上传jpg/png文件，且不超过500kb', 'error');
      } else {
        this.addEditInfo.file = file.raw;
      }
    },
    // 观看权限数据拉去
    handleGetUserData() {
      this.$axios.get('/sm/theme/getSysGroup').then(res => {
        this.userData = res.data;
      });
    },
    // 下载
    handleDownload(row) {
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = row.url;
      link.setAttribute("download", row.name); // 下载的文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 再次编辑
    handleAgain() {
      this.$axios.post('/sm/clip/resubmit', { id: this.againVal.id }).then(res => {
        if (res.code === 200) {
          this.againShow = false;
          this.$message(res.message, 'success');
          // this.pageNum = 1;
          this.handleGetData();
        }
      })
    },
    // 导出视频
    handleExportVideo(row) {
      this.deriveData = row;
      this.handleGetUserData();
      this.exportVideo = true;
    },
    // 删除
    handleDelete() {
      let data = new FormData();
      data.append('id', this.deleteVal.id)
      this.$axios.post('/aiGrinding/delete', data).then(res => {
        if (res.code === 200) {
          this.deleteShow = false;
          this.$message(res.data, 'success');
          // this.pageNum = 1;
          this.totalS = this.totalS - 1;
          if (this.pageNum * 10 - this.totalS === 10) {
            this.pageNum = this.pageNum - 1 || 1
          }
          this.handleGetData();
        }
      })
    },
    // 搜索
    handleSearch() {
      this.scrollTo0();
      this.pageNum = 1;
      this.handleGetData();
    },
    handleClose() {
      // 销毁播放
      clearInterval(this.checkItem)
      if (this.myVideo && this.myVideo.destroy) {
        this.myVideo.destroy();
      } else {
        this.$refs.videoAlert.innerHTML = '';
      }
      this.alertVideo = false;
    },
    scrollTo0() {
      let bodyWrapper = document.getElementsByClassName(
          "el-table__body-wrapper"
      );
      if (bodyWrapper && bodyWrapper.length > 0) {
        for (let item of bodyWrapper) {
          item.scrollTo(0, 0);
        }
      }
      document.getElementsByClassName("main-wrap")[0].scrollTo(0, 0);
    },
    //分页点击
    pageChange(val) {
      this.scrollTo0();
      this.pageNum = val;
      this.handleGetData();
    },
    checkTime() {
      this.loading = true;
      this.$axios.post('/aiGrinding/list', {
        resources: this.searchResourcesStatus,
        subjectId: this.searchLiveStatus,
        grindingType: this.searchThemeStatus,
        keyWord: this.searchKey,
        pageNum: this.pageNum, // 页数
        pageSize: 10 // 请求显示条数
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.pageList;
          this.pages = res.data.pages;
          this.permission = this.creatPermit(res.data.permit);
          this.loading = false;
          this.totalS = res.data.total;
          let val = this.tableData.find(el => el.id == this.patchData.id);
          this.patchData = val;
          this.handelGetVideo(val);
        }
      })
    },
    handelGetVideo(val) {
      if (this.myVideo) {
        this.myVideo = null;
      }
      if (this.checkItem !== null) {
        clearInterval(this.checkItem);
      }
      if (val.type === 1) {
        this.checkItem = setInterval(() => {
          if (this.myVideo !== null && this.myVideo.mediainfo) {
            console.log(this.myVideo.mediainfo)
            if (this.myVideo.mediainfo.hasAudio === true) {
              console.log('有音频', this.myVideo.mediainfo.hasAudio)
            } else {
              console.log('无音频', this.myVideo.mediainfo.hasAudio);
              this.myVideo.destroy();
              this.handelGetVideo(_this.patchData);
            }
          }
        }, 1000);
        this.myVideo = new FlvJsPlayer({
          id: 'videoAlert',
          url: val.url,
          // hasVideo: true,
          // hasAudio: true,
          volume: 0.6,
          autoplay: true,
          videoInit: true,
          closeVideoClick: true,
          closeVideoTouch: true,
          errorTips: '网络异常！',
          ignores: ['progress'],
          isLive: true,
          playsinline: true,
          lang: 'zh-cn',
          flvOptionalConfig: {
            enableStashBuffer: true,
            type: 'flv',
          },
        });
        const _this = this;
        let video = document.getElementsByTagName('video')[0];
        video.addEventListener('loadedmetadata', function () {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            console.log('HTTP FLV流有画面');
          } else {
            console.log('HTTP FLV流没有画面');
            _this.myVideo.destroy();
            _this.handelGetVideo(_this.patchData);
          }
        });
        _this.myVideo.on('error', function () {
          _this.myVideo.destroy();
          clearInterval(_this.checkItem)
          _this.checkTime();
        })

      } else if (val.type == 2) {
        if (val.url.substring(val.url.length - 3) == 'mp4') {
          this.myVideo = new Player({
            id: 'videoAlert',
            url: val.url,
            autoplay: true,
            videoInit: true,
            closeVideoClick: true,
            closeVideoTouch: true,
            errorTips: '暂无视频源',
            lang: 'zh-cn'
          })
        } else {
          let videoEl = `<div class="videoEnd" -webkit><p>回放视频生成中</p></div>`
          document.querySelector('#videoAlert').innerHTML = videoEl;
        }
      }
    },
    //重置分析
    resetAnalysis() {
      this.$axios.get("/aiRecharge/count").then((res) => {
        this.aiNum = res.data.aiClass;
        if (this.aiNum === 0) {
          this.$message('AI分析剩余次数不足！', 'error')
          return;
        }
        let data = new FormData();
        data.append('id', this.resettingVal.id)
        this.$axios.post('/aiGrinding/resetAnalysis', data).then(res => {
          if (res.code === 200) {
            this.resettingShow = false;
            this.$message(res.data, 'success');
            this.handleGetData();
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" type="text/scss" scoped>
.sublevel {
  padding-left: 84px;
  overflow: hidden;

  .el-input__inner {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.tableName {
  color: #409EFF;
  cursor: pointer;
}

#videoAlert {
  width: 100% !important;
}

.btnList {
  a {
    padding-right: 10px;
  }

  li {
    text-decoration: none;
  }
}

.dialog-item {
  display: flex;
  align-items: center;

  // margin-top: 25px;
  em {
    color: #F64646;
  }

  p:first-child {
    width: 84px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
    color: #303133;
    font-size: 14px;
  }

  p:first-child:after {
    content: '';
    display: inline-block;
    width: 100%;
  }
}

::v-deep .el-upload-dragger {
  width: 320px;
  height: 133px;
}

::v-deep .upload-democlip .el-upload-list {
  margin: -145px 0 0 15px;
  width: 290px;
}

.upload-democlip .el-upload-list__item-status-label {
  display: block;
}

.upload-democlip {
  height: 140px;
}

.el-upload-dragger .el-icon-upload {
  margin: 30px 0 16px;
}

.videoBox {
  ::v-deep .el-dialog__body {
    padding: 0 20px 30px 20px;
  }
}

::v-deep .videoEnd {
  width: 560px;
  height: 337.5px;
  background: #000;

  p {
    color: white;
    text-align: center;
    line-height: 337.5px;
  }
}

.popUp {
  margin-left: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: white;
}

.prompt {
  color: gray;
  display: flex;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.resetting {
  ::v-deep .el-dialog__title {
    padding-left: 20px;
  }
}
</style>
