<template>
  <div class="content-main-wrap">
    <p class="content-title">剪辑管理</p>

    <div class="main-wrap">
      <div class="search-operat">
				<div>
					<el-input class="width-2" clearable v-model="searchKey" placeholder="请输入视频名称关键字" v-search="handleSearch"></el-input>
					<el-button type="primary" class="search-btn" @click="handleSearch">查询</el-button>
				</div>
				<div>
          <el-button icon="el-icon-copy-document" v-if="permission.addMerge" @click="handleMerge">视频合并</el-button>
				</div>
			</div>
      <div class="data-table table-border">
        <el-table
          :row-style="{ height: '10px' }"
					:cell-style="{ padding: '12px 0' }"
          v-loading="loading"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            align="center"
            label="视频名称">
            <template slot-scope="scope">
              <div class="tableName" @click="handleAleat(scope.row)">{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="分类">
            <template slot-scope="scope">
								<div v-if="scope.row.labelNameList && scope.row.labelNameList.length > 0" class="videoSort">{{scope.row.categoryName}} - {{labelString(scope.row.labelNameList)}}</div>
                <div v-else class="videoSort">{{scope.row.categoryName}}</div>
						</template>
          </el-table-column>
          <el-table-column
            prop="time"
            align="center"
            label="时长">
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
              <ul>
                <li v-if="scope.row.status === 0">处理中</li>
                <li v-if="scope.row.status === 1">处理中</li>
                <li v-if="scope.row.status === 2">处理成功</li>
                <li v-if="scope.row.status === 3">处理失败</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="来源">
            <template slot-scope="scope">
              <ul>
                <li v-if="scope.row.source === 0">剪辑</li>
                <li v-if="scope.row.source === 1">合并</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            prop="createDate"
            align="center"
            min-width="110"
            label="添加时间">
          </el-table-column>
          <el-table-column
						align="center"
						min-width="160px"
						label="操作">
						<template slot-scope="scope">
              <div class="btnList">
                <el-link @click="handleDownload(scope.row)" :underline="false" type="primary" v-if="permission.checkDownload" :disabled="scope.row.status !== 2">下载</el-link>
                <el-link @click="againData(scope.row)" :underline="false" type="success" v-if="permission.resubmit" :disabled="scope.row.status !== 3">再次提交</el-link>
                <el-link @click="handleExportVideo(scope.row)" :underline="false" type="warning" v-if="permission.exportVideo" :disabled="scope.row.status !== 2 || scope.row.export === 1">导出视频</el-link>
                <el-link @click="deleteData(scope.row)" :underline="false" type="danger" v-if="permission.delete" :disabled="scope.row.status === 1">删除</el-link>
              </div>
						</template>
					</el-table-column>
        </el-table>
      </div>
      <div class="table-page">
				<el-pagination
					layout="prev, pager, next"
					@current-change="pageChange"
					:page-count="pages"
					:current-page="pageNum">
				</el-pagination>
			</div>
      <el-dialog
        :title="patchData.name"
        :close-on-click-modal="false"
        :visible.sync="alertVideo"
        width="40%"
        :before-close="handleClose">
        <div id="videoAlert" ref="videoAlert"></div>
      </el-dialog>

      <el-dialog
        title="导出视频"
        :close-on-click-modal="false"
        :visible.sync="exportVideo"
        width="460px"
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
            <el-select class="width-5" style="margin-left: 2px;" @change="handleTheme" v-model="themeValue" placeholder="请选择">
              <el-option
              v-for="item in themeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="sublevel" v-if="themeTypeList.length > 0">
						<div v-for="(nape,index) in themeTypeList" :key="index" style="float:left;margin-left:18px;margin-bottom:20px">
							<el-select class="width-9" clearable v-model="nape.value" :placeholder="`请选择${nape.name}`" v-if="nape.children">
								<el-option
								v-for="item in nape.children"
								:key="item.id"
								:label="item.name"
								:value="item.id">
								</el-option>
							</el-select>
						</div>
					</div>
          <div class="dialog-item">
						<p>观看权限</p>
						<p><em>*</em>：</p>
						<el-select class="width-5" v-model="userWatch" clearable placeholder="请选择" filterable>
              <el-option
                v-for="item in userData"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              >
              </el-option>
            </el-select>
					</div>

          <div class="dialog-item">
            <p>封面</p>
						<p><em style="opacity: 0;">*</em>：</p>
            <el-upload
            :limit="1"
            :on-exceed="handleOnExceed"
							class="upload-democlip"
							accept=".png,.jpg"
							:file-list="fileList"
							:action="uploadUrl"
							:on-change="handleSelectFile"
              :before-remove="beforeRemov1e"
							list-type="picture"
							:auto-upload="false"
							drag>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
          </div>

          <div class="dialog-item">
						<p>公网点播</p>
						<p><em>*</em>：</p>
						<el-switch
							:active-value=1
							:inactive-value=0
							v-model="publicVod">
						</el-switch>
						<!-- <p class="err-notice">注：公网直播需保证智教慧学灵枢云账号中有足够的流量，否则可能影响直播</p> -->
					</div>

					<div class="dialog-item" v-if="publicVod === 1">
						<p class="notselect">公网观看权限</p>
						<p class="notselect"><em >*</em>：</p>
						<el-radio v-model="watchType" :label=0>所有人可看</el-radio>
						<el-radio v-model="watchType" :label=1>授权码观看</el-radio>
					</div>

					<div class="dialog-item" v-if="publicVod === 1 && watchType === 1">
						<p>公网观看密码</p>
						<p><em>*</em>：</p>
						<el-input class="width-2" placeholder="4-20数字字母组成" v-model.trim="watchPassword" clearable show-password></el-input>
					</div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEnsure">确 定</el-button>
          <el-button @click="handleCloseExport">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
			title="删除视频"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该视频？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleDelete()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
      <el-dialog
			title="再次提交"
			:close-on-click-modal="false"
			:visible.sync="againShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">是否发起再次提交？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleAgain()">确 定</el-button>
					<el-button @click="againShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
    </div>
  </div>
</template>

<script>
import {baseUrl} from '@/assets/js/utils';
import Player from 'xgplayer';
import { creatTree } from "../../../assets/js/utils";
export default {
  name: '',
  data() {
    return {
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

      publicVod:'', //是否公网点播
      watchType:0, // 是否需要授权码
      watchPassword:'' // 观看密码

    }
  },
  mounted() {
    if(localStorage.getItem('uiType') == 2) {
      this.handleGetType();
    }
    this.handleGetData();
  },
  methods: {
    handleOnExceed(files,fileList) {
				this.$message('只能上传一个图片', 'error')
			},
    againData(row) {
      this.againVal = row
      this.againShow = true
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
      this.loading = true;
      this.$axios.get('/sm/clip/list',{
        keyWord: this.searchKey,
        pageNum: this.pageNum, // 页数
        pageSize: 10 // 请求显示条数
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.pageList;
          this.pages = res.data.pages;
          this.permission = this.creatPermit(res.data.permit);
          this.loading = false;
          this.totalS = res.data.total;
        }
      })
    },
    // 视频分类change
			handleTheme() {
				this.getTypeList();
			},
			//获取类型
			getTypeList(){
				this.$axios.get('/sm/label/listByCategory', {
					categoryId: this.themeValue,
					type: 0,
					// id: this.$route.query.themeid
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
    // 合并
    handleMerge() {
      let arr = []
      let arrs = []
      arrs = JSON.parse(sessionStorage.getItem('systemMenuList')).filter(el => {
        return el.id == 4080
      })
      if(arrs.length > 0){
        arr = arrs[0].children.filter(el => {
          return el.id == 4083
        })
      }
      if(arr.length > 0){
        this.$router.push('/sm/merge');
      }else{
        this.$message('您没有当前操作的权限，请联系管理员', 'error')
      }
    },
    // 导出视频确定btn
    handleEnsure() {
      if(!this.exportName){
        this.$message('名称不能为空！', 'error');
        return true;
      }
      if (this.exportName.length > 20) {
        this.$message('名称限制20个字符！', 'error');
        return true;
      }
      if(this.$verify.isEmpty(this.themeValue)){
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
        if (this.$verify.checkNumEn(this.watchPassword,4,20)) {
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
    beforeRemov1e(){ this.addEditInfo.file = null },
    handleSelectFile(file) {
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
        this.$axios.post('/sm/clip/delete', { id: this.deleteVal.id }).then(res => {
          if (res.code === 200) {
             this.deleteShow = false;
            this.$message(res.message, 'success');
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
    // 视频预览
    handleAleat(row) {
      if(this.permission.play){
        this.patchData = row;
        this.alertVideo = true;
        setTimeout(() => {
          this.handelGetVideo(row.url);
        }, 100);
      }else{
        this.$message("您没有当前操作的权限，请联系管理员", "error"); 
      }
    },
    handleClose() {
      this.alertVideo = false;
        // 销毁播放
				if(this.myVideo && this.myVideo.destroy){
					this.myVideo.src = "";
					this.myVideo.destroy();
				}
      this.$refs.videoAlert.innerHTML = '';
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
    pageChange(val){
      this.scrollTo0();
      this.pageNum = val;
      this.handleGetData();
    },
    handelGetVideo(url) {
      this.myVideo = new Player({
        id: 'videoAlert',
        url: url,
        autoplay: true,
        videoInit: true,
        closeVideoClick: true,
        closeVideoTouch: true,
        errorTips: '暂无视频源',
        lang: 'zh-cn'
      })
    },
    // 分类字符串
			labelString(arr){
				if(arr.length > 0){
					return arr.join(',')
				}else {
					return '暂无下级分类'
				}
			},
  },
}
</script>

<style lang="scss" type="text/scss" scoped>
.sublevel {
	padding-left:84px;
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
}
.dialog-item{
		display: flex;
		align-items: center;
		// margin-top: 25px;
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
  ::v-deep .el-upload-dragger{
	width: 320px;
	height: 133px;
}
::v-deep .upload-democlip .el-upload-list{
	margin: -145px 0 0 15px;
	width: 290px;
}
.upload-democlip .el-upload-list__item-status-label{
	display: block;
}

.upload-democlip {
	height: 140px;
}

.el-upload-dragger .el-icon-upload {
	margin: 30px 0 16px;
}
</style>