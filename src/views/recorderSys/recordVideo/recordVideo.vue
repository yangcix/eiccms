<!-- recordVideo -->
<template>
		<div class="content-main-wrap" id="recordVideo">
      <p class="content-title">录制视频</p>
      <div class="main-wrap">
				<div class="search-operat">
					<div class="option-head">
						<el-input class="width-6" clearable v-model="keyWord" placeholder="请输入视频名称关键字" v-search="handleSearch"></el-input>
						<el-input class="width-6 lecturer" clearable v-model="subject" placeholder="请输入课程名称关键字" v-search="handleSearch"></el-input>
						<el-select class="width-6 lecturer" v-model="teacherId" filterable placeholder="选择教师" clearable >
							<el-option
								v-for="item in listTeacher"
								:key="item.id"
								:label="item.nickName"
								:value="item.id"
							>
							</el-option>
						</el-select>
							<span class="add-time">添加时间:</span>
							<el-date-picker
								v-model="valueTime"
								type="datetimerange"
								:picker-options="pickerOptions"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								@change="settime"
								align="right">
							</el-date-picker>
							<!-- <el-date-picker
								v-model="startTime"
								type="datetime"
								class="startTime"
								placeholder="开始时间">
							</el-date-picker>
							<el-date-picker
								v-model="endTime"
								type="datetime"
								class="startTime"
								placeholder="结束时间">
							</el-date-picker> -->
						<el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
					</div>
					
				</div>
				<div class="data-table table-border" style="min-width: 1250px">
					<el-table
						:row-style="{ height: '10px' }"
						:cell-style="{ padding: '4px 0' }"
						v-loading="loading"
						:data="tableData"
						style="width: 100%;margin-bottom: 20px;"
						>
						<el-table-column
							prop="name"
							align="center"
							label="视频名称">
							<template slot-scope="scope">
									<span class="vName" @click="toplay(scope.row.url)"><i class="el-icon-video-play"></i> {{scope.row.name}}</span> 
							</template>
						</el-table-column>
						<el-table-column
						v-if="isTrue == 1"
						prop="orgName"
						align="center"
						label="所属学校">
					</el-table-column>
					<el-table-column
						prop="gradeName"
						align="center"
						label="年级">
					</el-table-column>
						<el-table-column
							prop="className"
							align="center"
							label="班级">
						</el-table-column>
						<el-table-column
							prop="subject"
							label="课程">
							<template slot-scope="scope">
                    			<span>{{ scope.row.subject ? scope.row.subject : "——"}}</span>
                  			</template>
						</el-table-column>
						<el-table-column
							prop="teacherName"
							label="教师">
							<template slot-scope="scope">
                    			<span>{{ scope.row.teacherName ? scope.row.teacherName : "——"}}</span>
                  			</template>
						</el-table-column>
						<el-table-column
							align="center"
							prop="completeDate"
							label="添加时间"
							width="160px">
						</el-table-column>
						<el-table-column
							align="center"
							label="操作"
							width="260px">
							<template slot-scope="scope">
								<!-- <el-button type="text" @click="shortcut(0,scope.row)" v-if="aiType == 2 && permission.save"> -->
								<el-button type="text" v-if="aiType == 2 && aiOpenStatus == 1 && permission.save" @click="shortcut(0,scope.row)">快捷AI磨课</el-button>
								<el-button type="text" @click="handleDownload(scope.row)" v-if="permission.play">下载</el-button>
								<el-button type="text" @click="handleFilm(scope.row)" v-if="permission.clip && version != 1">剪辑</el-button>
								<el-button type="text" style="color:#f56c6c" @click="openDelete(scope.row.id)" v-if="permission.delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table-page">
					<el-pagination
						layout="prev, pager, next"
						@current-change="handlePageChange"
						:current-page="pageNum"
						:page-count="pages">
					</el-pagination>
				</div>

				<el-dialog
					title="播放"
					:close-on-click-modal="false"
					:visible.sync="playVisible"
					:before-close="closePlay"
					width="fit-content"
					center>
					<div id="videoFilm" ref="videoFilm"></div>
				</el-dialog>

				<el-dialog class="shortcut-title" title="快捷AI分析" :close-on-click-modal="false" :visible.sync="shortcutShow" width="450px" @close="shortcut(1)">
					<p style="margin-left: 20px">确认引用该录制视频进行AI分析吗？</p>
					<p style="margin-left: 20px; margin-top: 30px; color: gray">注：需要保证录制视频时长小于等于60分钟！</p>
					<div class="btn-list">
						<el-button @click="shortcut(1)" style="margin-right: 10px;">取 消</el-button>
						<el-button type="primary" @click="shortcut(2)" style="margin-right: 10px;">确 定</el-button>
					</div>
				</el-dialog>

			<el-dialog
				title="视频剪辑"
				:close-on-press-escape="false"
				:close-on-click-modal="false"
				:visible.sync="filmShow"
				:before-close="handleClose"
				width="1200px">
				<div class="film">
					<div class="left">
						<div id="videoFilmCut" ref="videoFilmCut"></div>
						<div class="editing">
							<div class="slider">
								<el-slider
									class="elSlider"
									v-model="videoList.cutRange"
									range
									:format-tooltip="formatTime"
									@change="changeRange"
									:max="videoList.duration">
								</el-slider>
								<div class="time">
									{{ totalTime }}
								</div>
							</div>
						</div>
					</div>
					<div class="right">
						<div class="title">剪辑时间</div>
						<div class="dialog-item">
							<p>开始时间</p>
							<p><em>*</em>：</p>
							<el-input disabled clearable :value="cutRange[0]" class="width-5"></el-input>
						</div>
						<div class="dialog-item">
							<p>结束时间</p>
							<p><em>*</em>：</p>
							<el-input disabled clearable :value="cutRange[1]" class="width-5"></el-input>
						</div>
						<div class="dialog-item">
							<p>视频分类</p>
							<p><em>*</em>：</p>
							<el-select class="width-5" @change="handleTheme" v-model="themeValue" placeholder="请选择">
								<el-option
								v-for="item in themeData"
								:key="item.id"
								:label="item.name"
								:value="item.id">
								</el-option>
							</el-select>
						</div>

					<div class="sublevel" v-if="themeTypeList.length > 0">
						<div v-for="(nape,index) in themeTypeList" :key="index" style="float:left;margin-left:20px;margin-bottom:20px">
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
						<p>视频名称</p>
						<p><em>*</em>：</p>
						<el-input clearable v-model.trim="film.name" class="width-5"></el-input>
					</div>
					<div class="dialog-item">
						<p>简介</p>
						<p><em style="opacity: 0">*</em>：</p>
						<el-input
							v-model="film.description"
							class="width-5"
							type="textarea"
							resize="none"
							:autosize="{ minRows: 2, maxRows: 4}"
							placeholder="请输入内容">
						</el-input>
					</div>
					<el-button type="primary" class="put" @click="handleSubmit">提交任务</el-button>
				</div>
			</div>
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
				title="提交任务"
				:close-on-press-escape="false"
				top="40vh"
				:visible.sync="centerDialogVisible"
				width="30%"
				center>
				<span>剪辑任务提交成功！</span>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleAgain">再次剪辑</el-button>
					<el-button type="primary" @click="handleExamine">查看进度</el-button>
				</span>
			</el-dialog>
			</div>
		</div>
</template>

<script>
  import Player from 'xgplayer';
	import { formatDate } from '@/assets/js/utils.js';
	import { creatTree } from "../../../assets/js/utils";
	import {  mapActions } from 'vuex';
	export default {
		name: '',
		data() {
			return {
				aiType: JSON.parse(localStorage.getItem("sysInfo")).aiConfigId,
        aiOpenStatus: JSON.parse(localStorage.getItem("sysInfo")) ? JSON.parse(localStorage.getItem("sysInfo")).aiOpenStatus : 0,
				shortcutShow: false, // 快捷分析弹窗
				shortcutRow: {}, 
				detailData: {},
				valueTime: '',
				id: '',
				deleteShow: false,
				version: window.localStorage.getItem('version'),
        keyWord:'',
        startTime:'',
        endTime:'',
        tableData:[],
        pages:0,
        pageNum:1,
        totalS:'',
        loading:false,
				playVisible:false,
        myVideo:null,
				listTeacher:[], // 教师
				teacherId:'', // 选择的教师
				subject:'', // 课程关键字
				permission:'', // 权限
				aiGrindingPermission: '', // AI磨课页面权限
				currentData: [], // 选中当前的data
				videoList: {
					cutRange: [0, 0],
					currentTime: 0, // 当前时间 秒
					duration: 0, // 总时间 秒
				},
        aiGrindingMenuAuth: {
          menuId: '',
          menuAuth: false,
        },
				cutRange: [],
				filmShow: false, // 剪辑弹窗
				totalTime: '',
				film: { // 剪辑参数
					labelIdList: [],
					name: '',
					startTime: '',
					endTime: '',
					url: '',
					description: '',
					categoryId: ''
				},
				limitTime: '', // 限制最小时常5秒
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
				themeTypeList: [],
				centerDialogVisible: false, // 提交任务cpm
				myVideoCut: null,
				isTrue: 0,
				pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
			}
		},
		components: {},
		// computed: {
		// 	_cutRange() {
		// 		return Array.from(this.videoList.cutRange, this.formatTime)
		// 	}
		// },
		mounted() {
			this.handleGetData();
			this.handleListTeacher();
			if(localStorage.getItem('uiType') == 2){
				this.handleGetType();
			}
			if(this.aiType == 2){
				// this.getAiPermission();
        this.getAiGrindingMenuAddAuth();
			}
      console.log("aiType --------------------",this.aiType);
      console.log("aiOpenStatus --------------------",this.aiOpenStatus);
		},
		methods: {
			...mapActions({
        commitSysModule:'commitSysModule',
      }),
			settime(){
				if(this.valueTime){
					this.startTime = formatDate(this.valueTime[0])
					this.endTime = formatDate(this.valueTime[1])
				}else{
					this.startTime = ''
					this.endTime = ''
				}
			},
			// 获取主讲教师列表
			handleListTeacher() {
				this.$axios.get('/sys/user/listTeacher').then(res => {
					console.log(res);
					this.listTeacher = res.data;
				});
			},
      // 播放
			toplay(url){
				if(this.permission.info){
					this.playVisible = true;
					this.$nextTick(() => {
						this.handelGetVideo(url)
					})
				}else{
					this.$message("您没有当前操作的权限，请联系管理员", "error"); 
				}
      },
	  // 获取AI磨课页面数据权限
	  getAiPermission() {
      this.$axios.post('/aiGrinding/list',{
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if(res.code === 200 ){
          this.aiGrindingPermission = this.creatPermit(res.data.permit);
        }
      })
	  },
    // 获取AI磨课新增按钮权限
    getAiGrindingMenuAddAuth() {
      this.$axios.get('/sys/role/roleMenuAuth',{
        menuId: 12621
      }).then(res => {
        if(res.code === 200 ){
          this.aiGrindingMenuAuth = res.data;
        }
      })
    },
	  // 快捷AI磨课
	  shortcut(type,row) {
      if(type == 0){
        console.log(row,11111);
        this.shortcutShow = true;
        this.shortcutRow = row;
      }else if(type == 1){
        this.shortcutShow = false;
        this.shortcutRow = {};
      }else {
        if(!this.permission.save || !this.aiGrindingMenuAuth.menuAuth){
          console.log("this.permission.save: ", this.permission.save);
          console.log("this.aiGrindingMenuAuth.menuAuth: ", this.aiGrindingMenuAuth.menuAuth);
          this.$message("您没有当前操作的权限，请联系管理员", "error");
          return;
        }
        let timeParts = this.shortcutRow.time.split(':');
        let hours = parseInt(timeParts[0], 10) || 0;
        let minutes = parseInt(timeParts[1], 10) || 0;
        let seconds = parseInt(timeParts[2], 10) || 0;

        let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        console.log(totalSeconds, 'total time in seconds');

        if (totalSeconds > 3600) {
          this.$message("视频时长不能超过60分钟", "error");
          return;
        }
        // 保存当前路由信息
        const currentRoute = this.$route.fullPath;
        this.$router.push({path: '/sm/aiclassAddEdit',
        query: {
          videoId: this.shortcutRow ? this.shortcutRow.id : '',
          name: this.shortcutRow ? this.shortcutRow.name: '',
          teacherId: this.shortcutRow ? this.shortcutRow.teacherId: '',
          teacherName: this.shortcutRow ? this.shortcutRow.teacherName: '',
        }});
      }
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

      // 视频初始化
      handelGetVideo(params) {
				if(this.myVideo !== null) {
          this.myVideo.destroy()
						this.myVideo = new Player({
						id: 'videoFilm',
						url: params,
						autoplay: true,
						videoInit: true,
						width:460,
						height:270,
            fitVideoSize:'auto',
						closeVideoClick: true,
						closeVideoTouch: true,
						errorTips: '暂无视频源',
						lang: 'zh-cn'
					})
					// console.log(this.myVideo)
				}else {
					this.myVideo = new Player({
						id: 'videoFilm',
						url: params,
						autoplay: true,
						videoInit: true,
						width:460,
						height:270,
            fitVideoSize:'auto',
						closeVideoClick: true,
						closeVideoTouch: true,
						errorTips: '暂无视频源',
						lang: 'zh-cn'
					})
				}
			},
      // 关闭播放
      closePlay() {
        this.myVideo.src = null;
        // this.myVideo.pause();
        this.playVisible = false;
      },

			// 剪辑btn
			handleFilm(row) {
				this.detailData = row
				this.currentData = JSON.parse(JSON.stringify(row));
				let time = this.currentData.time;
				const [h,m,s]=time.split(':');
				const second = h*60*60+m*60+s*1
				this.videoList.duration = second; // 视频总时长 通过接口返回
				this.$set(this.videoList, 'cutRange', [0, second])
				// this.videoList.cutRange[0] = 0
				// this.videoList.cutRange[1] = second;
				// this.ceshi = this.ceshi += 1; // 默认删掉
				this.totalTime = this.currentData.time;
				this.cutRange = Array.from(this.videoList.cutRange, this.formatTime);
				this.film.name = '';
				this.themeValue = '';
				this.film.description = '';
				this.filmShow = true;
				this.themeTypeList = [];
				this.$nextTick(() => {
					this.handelGetVideoCut();
				})
			},
			
			handelGetVideoCut(params) {
				// params.localFileUrl  视频地址
				// let arr = ['https://www.w3school.com.cn/i/movie.ogg','https://st.wssqxt.com/pcImg-20191125195819.mp4'];
				this.$nextTick(() => {
					this.myVideoCut = new Player({
						id: 'videoFilmCut',
						url: this.currentData.url,
						// url: `//sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4`,
						autoplay: true,
						videoInit: true,
						closeVideoClick: true,
						closeVideoTouch: true,
						errorTips: '暂无视频源',
						lang: 'zh-cn'
					});
				});
			},

			// 改变断点判断时长是否小于5s,
			changeRange(v) {
				this.limitTime = Math.abs(v[0]-v[1]);
				if(this.limitTime<15){
					this.$message('视频时长不能少于15秒','error')
				} else {
					this.cutRange = Array.from(this.videoList.cutRange, this.formatTime)
				}
			},

			// 视频分类change
			handleTheme() {
				this.getTypeList();
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

			handleClose() { // 剪辑clone
				console.log('clone');
				this.filmShow = false;
				// 销毁播放
				this.currentData.url = "";
				if(this.myVideoCut && this.myVideoCut.destroy){
					this.myVideoCut.src = "";
					this.myVideoCut.destroy();
				}
				this.$refs.videoFilmCut.innerHTML = '';
				// this.videoList.cutRange = ['', ''];
				this.themeValue = '';
				this.film.name = '';
				this.film.description = '';
				this.themeTypeList = [];
			},
			
			// 提交任务
			handleSubmit() {
				// if (this.videoList.cutRange[0] > this.videoList.cutRange[1] ) {
				// 	his.$message('开始时间不能大于结束时间', 'error');
				// }
				if(this.limitTime !== '' && this.limitTime<15){
					this.$message('视频时长不能少于15秒','error')
					return
				}
				if(this.$verify.isEmpty(this.themeValue)){
					this.$message('请选择分类', 'error');
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
				if(!this.film.name){
					this.$message('名称不能为空！', 'error');
					return true;
				}
				if(this.film.name && this.film.name.length > 20){
					this.$message('名称最长20位！', 'error');
					return true;
				}

				if(this.film.description && this.film.description.length > 50){
					this.$message('简介最长50个字', 'error');
					return true;
				}

				let typeIdList = [];
				this.themeTypeList.forEach(v => {
					if (v.value !== null || v.value !== '') {
						typeIdList.push(v.value);
					}
				});
				this.$axios.post('/sm/clip/addClip', {
					labelIdList: typeIdList,
					name: this.film.name,
					startTime: this.cutRange[0],
					endTime: this.cutRange[1],
					url: this.currentData.url,
					// url: 'http://192.168.164.211/vdisk1/video/file/ML_20200608110524_17af5c0d-cfef-4864-93b4-5db253966034.mp4',
					description: this.film.description,
					categoryId: this.themeValue
				}).then(res => {
					// 销毁播放
					if (res.code === 200) {
						this.themeValue = '';
						this.themeTypeList = [];
						this.$message(res.message, 'success');
						this.filmShow = false;
						this.centerDialogVisible = true;
						this.currentData.url = "";
					}
					if(res.code === -10000){
						return
					}
					if(this.myVideoCut && this.myVideoCut.destroy){
						this.myVideoCut.src = "";
						this.myVideoCut.destroy();
					}
					this.$refs.videoFilmCut.innerHTML = ''; // 销毁播放器
				});
			},

			formatTime(sec) {
				const s = sec % 60;
				const _m = parseInt(sec / 60);
				const m = _m % 60;
				const h = parseInt(_m / 60);
				const times = [h, m, s];
				const ret = Array.from(times, item => String(item).padStart(2, 0)).join(':');
				return ret;
			},

			// 再次剪辑
			handleAgain() {
				this.centerDialogVisible = false;
				// this.getManageList();
				this.handleGetData();
				this.handleFilm(this.detailData)
			},

			// 查看剪辑进度
			handleExamine() {
				this.$axios.get('auth/menu').then(res => {
					let istrue = res.data.filter(el => el.id == 4082)
					console.log(istrue,'fff')
					if(istrue.length > 0){
						this.centerDialogVisible = false;
						// this.commitSysModule(1)
						this.$router.push('/sm/clip');
					}else{
						this.$message("您没有当前操作的权限，请联系管理员", "error"); 
					}
				})
			},
			openDelete(id) {
				this.id = id;
				this.deleteShow = true;
			},
			// 删除
			handleDelete(id) {
				this.$axios.post('/sm/record/delete', {id: this.id}).then(res => {
					if (res.code === 200) {
						this.totalS = this.totalS - 1;
						if (this.pageNum * 10 - this.totalS === 10) {
							this.pageNum = this.pageNum - 1 || 1
						}
						this.deleteShow = false;
						this.$message('删除成功', 'success');
						this.handleGetData();
					}
				})
			},
			// 分页点击
			handlePageChange(val) {
				this.scrollTo0();
				this.pageNum = val;
				this.handleGetData();
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
			// 搜索
			handleSearch() {
				if(this.startTime && !this.endTime) {
					return this.$message('请选择结束时间', 'error');
				}
				if(!this.startTime && this.endTime) {
					return this.$message('请选择开始时间', 'error');
				}
				if(this.startTime && this.endTime && (this.startTime >= this.endTime)) {
					return this.$message('结束时间必须大于开始时间', 'error');
				}
				this.scrollTo0();
				this.pageNum = 1;
				this.handleGetData();
			},
			handleGetData() {
				this.$axios.get('/index/getSchool').then(res => {
          if(res.data.length > 1) {
              this.isTrue = 1;
            }else{
              this.isTrue = 0;
            }
        })
				this.loading = true;
				this.$axios.get('/sm/record/list',{
					keyWord: this.keyWord,
					teacherId: this.teacherId,
					subject:this.subject,
					isAI: true,
					pageNum: this.pageNum,
          			startTime: this.startTime,
          			endTime: this.endTime,
					pageSize: 10,
				}).then(res => {
					this.loading = false;
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
					this.pageNum = res.data.pageNum;
				})
			},

		},
	}
</script>
<style lang="scss" type="text/scss" scoped>
#recordVideo {
	.main-wrap {
		height: 620px;
	}
  .option-head{
    display: flex;
    margin: 14px 0 0px 0;

    .add-time {
      font-size: 14px;
			width: 80px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 20px;
      color: #333333;
    }
    .startTime {
      width: 200px;
      margin-right: 10px;
    }

		.lecturer {
			margin-left: 10px;
		}
			
  }

  .vName {
    cursor: pointer;
    color: #409EFF;
  }

		.film {
		display: flex;
		justify-content:space-between;

		.left {
			flex: 4;

			.editing {
				padding-top: 20px;
			}
		}

		.right {
			flex: 3;
	
			.title {
				font-size: 14px;
				padding-bottom: 20px;
			}

			.put {
				width: 84%;
				display: block;
				margin: 0 auto;
			}
		}
	}

	.slider {
		display:flex;
		justify-content:space-between;

		.elSlider {
			width: 84%;
		}

		.time {
			line-height: 37px;
			margin-right: 20px;
		}
	}

	.shortcut-title {
		::v-deep .el-dialog__title{
    		padding-left: 20px;
    	}
	}
	
	.btn-list {
    	margin-top: 40px;
		text-align: right;
  	}
}

</style>
<style lang="scss">
.sublevel {
	padding-left:60px;
	overflow: hidden;

	.el-input__inner {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>