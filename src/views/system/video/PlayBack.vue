<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" content="主题详情"></el-page-header></p>
		
		<div class="data-table table-border">
			<el-table
				v-loading="loading"
				:data="tableData"
				style="width: 100%">
				<el-table-column
					prop="id"
					align="center"
					:show-overflow-tooltip="true"
					label="ID">
				</el-table-column>
				<el-table-column
					prop="name"
					align="center"
					:show-overflow-tooltip="true"
					label="录制名称">
				</el-table-column>
				<el-table-column
					prop="terminalName"
					align="center"
					label="机位">
				</el-table-column>
				<el-table-column
					prop="time"
					align="center"
					label="时长">
				</el-table-column>
				<el-table-column
					prop="size"
					align="center"
					label="大小">
				</el-table-column>
				<el-table-column
					align="center"
					width="210px"
					label="操作">
					<template slot-scope="scope">
						<ul class="operat-list">
							<li class="active" @click="handleFilm(scope.row)">剪辑</li>
							<li @click="exportVideo(0, scope.row)" :class="scope.row.export == 0 ? 'active' : ''">导出视频</li>
							<li class="active" @click="handleDownload(scope.row)">下载</li>
							<li @click="deleteData(0, scope.row)" style="color:#f56c6c" class="active">删除</li>
							<!-- <li v-if="userPermit.addClip" class="active" @click="handleFilm(scope.row)">剪辑</li>
							<li v-if="userPermit.exportVideo" @click="exportVideo(0, scope.row)" :class="scope.row.export == 0 ? 'active' : ''">导出视频</li>
							<li v-if="userPermit.checkDownload" class="active" @click="handleDownload(scope.row)">下载</li>
							<li v-if="userPermit.deleteVideo" @click="deleteData(0, scope.row)" style="color:#f56c6c" class="active">删除</li> -->
						</ul>
					</template>
				</el-table-column>
			</el-table>
		</div>
		
		<el-dialog
			title="导出视频"
			:close-on-click-modal="false"
			:visible.sync="exportShow"
			:before-close="exportClose"
			width="480px">
			<div class="dialog-wrap">
				<p class="err-title" v-if="errorInfo">提示：{{errorInfo}}</p>
				<div class="dialog-item">
					<p>名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-5" style="margin-left: 2px;" v-model.trim="exportRow.name"></el-input>
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
					<p>简介</p>
					<p><em style="opacity: 0;">*</em>：</p>
					<textarea v-model="exportRow.description"></textarea>
				</div>
				
				<div class="dialog-btn">
					<el-button type="primary" @click="exportVideo(1)">确 定</el-button>
					<el-button @click="exportClose()">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="删除机位"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该机位视频？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="deleteData(1)">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
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
					<div id="videoFilm" ref="videoFilm"></div>
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

					<!-- <div class="dialog-item" v-for="(nape,index) in themeTypeList" :key="index">
						<p>{{ nape.name }}</p>
						<div class="px"><em>*</em>：</div>
						<el-select class="width-5" clearable v-model="nape.value" placeholder="请选择" v-if="nape.children">
							<el-option
							v-for="item in nape.children"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div> -->

					<div class="dialog-item">
						<p>视频名称</p>
						<p><em>*</em>：</p>
						<el-input clearable v-model.trim="film.name" class="width-5"></el-input>
					</div>
					<div class="dialog-item">
						<p>简介</p>
						<p><em style="opacity:0">*</em>：</p>
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
</template>

<script>
	import { Message } from 'element-ui';
	import Player from 'xgplayer';
	import { creatTree } from "../../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				detailData: {},
				centerDialogVisible: false, // 提交任务cpm
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
				tableData: [],
				permission: '',
				exportShow: false,
				exportRow: {},
				deleteShow: false,
				deleteRow: {},
				errorInfo: '',
				userPermit: [],
				ifDownload: false, // 是否可下载
				downloadMessage: "",
				currentData: [], // 选中当前的data
				videoList: {
					cutRange: [0, 0],
					currentTime: 0, // 当前时间 秒
					duration: 0, // 总时间 秒
				},
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
				myVideo: null,
				loading: false, // 表格加载
				cutRange: []
			}
		},
		// computed: {
		// 	_cutRange() {
		// 		return Array.from(this.videoList.cutRange, this.formatTime)
		// 	}
		// },
		components: {},
		mounted() {
			this.getList();
			this.handleGetDownload();
			if(localStorage.getItem('uiType') == 2){
				this.handleGetType();
			}
		},
		methods: {
			// 查看剪辑进度
			handleExamine() {
				this.$axios.get('auth/menu').then(res => {
					let istrue = res.data.filter(el => el.id == 4082)
					console.log(istrue,'fff')
					if(istrue.length > 0){
						this.$router.push('/sm/clip');
					}else{
						this.$message("您没有当前操作的权限，请联系管理员", "error"); 
					}
				})
			},
			// 再次剪辑
			handleAgain() {
				this.centerDialogVisible = false;
				// this.getManageList();
				this.getList();
				this.handleFilm(this.detailData)
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
					if (res.code === 200) {
						// 销毁播放
					this.themeValue = '';
					this.themeTypeList = [];
					this.currentData.url = "";
					if(this.myVideo && this.myVideo.destroy){
						this.myVideo.src = "";
						this.myVideo.destroy();
					}
					this.$refs.videoFilm.innerHTML = ''; // 销毁播放器
						this.$message(res.message, 'success');
						this.filmShow = false;
						this.centerDialogVisible = true;
					}
				});
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
				this.$nextTick(() => {
					this.handelGetVideo();
				})
			},
			exportClose() {
				this.themeValue = '';
				this.themeTypeList = [];
				this.exportShow = false;
			},
			handleClose() { // 剪辑clone
				this.filmShow = false;
				// 销毁播放
				this.currentData.url = "";
				if(this.myVideo && this.myVideo.destroy){
					this.myVideo.src = "";
					this.myVideo.destroy();
				}
				this.$refs.videoFilm.innerHTML = '';
				// this.videoList.cutRange = ['', ''];
				this.themeValue = '';
				this.film.name = '';
				this.film.description = '';
				this.themeTypeList = [];
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
			handelGetVideo(params) {
				// params.localFileUrl  视频地址
				// let arr = ['https://www.w3school.com.cn/i/movie.ogg','https://st.wssqxt.com/pcImg-20191125195819.mp4'];
				this.$nextTick(() => {
					this.myVideo = new Player({
						id: 'videoFilm',
						url: `http://${location.host}${this.currentData.url}`,
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

			formatTime(sec) {
				const s = sec % 60;
				const _m = parseInt(sec / 60);
				const m = _m % 60;
				const h = parseInt(_m / 60);
				const times = [h, m, s];
				const ret = Array.from(times, item => String(item).padStart(2, 0)).join(':');
				return ret;
			},
			// 下载
			handleDownload(row) {
				// const link = document.createElement('a');
				// link.setAttribute("download", row.name); // 下载的文件名
				// link.href = row.url; 
				// link.click();
				// if(!this.ifDownload) {
				// 	return;
				// }
				if (this.ifDownload) {
					const link = document.createElement('a');
					link.style.display = 'none';
					link.href = row.url;
					link.setAttribute("download", row.name); // 下载的文件名
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					return;
				}
				Message.closeAll();
				this.$message(this.downloadMessage, 'error');
			},
			// 检测是否能下载
			handleGetDownload() {
				this.$axios.get('/sm/themeTerminal/checkDownload').then(res => {
					if (res.code === 200) {
						this.ifDownload = true;
						return;
					}
					this.downloadMessage = res.message;
					Message.closeAll();
				});
			},
			//获取列表
			getList(){
				this.loading = true; // 表格加载
				this.$axios.get('/sm/theme/recordList', {themeId: this.$route.query.themeid}).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.resData;
					this.userPermit = this.creatPermit(res.data.permit);
				});
			},
			//导出视频 0导出 1导出确认
			exportVideo(type, val){
				this.errorInfo = '';
				if(type == 0){
					if(val.export == 0){
						this.exportRow = {
							name: val.name,
							description: val.description,
							id: val.id
						};
						this.exportShow = true;
					}
				}else{
					if(!this.exportRow.name){
						this.$message('名称不能为空！', 'error');
						return
					}
          if (this.exportRow.name.length > 20) {
						this.$message('名称限制20个字符！', 'error');
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
					if (this.exportRow.description && this.exportRow.description.length > 50) {
						this.$message('简介限制50个字符！', 'error');
						return
					}
					let data = this.exportRow;
					let typeIdList = [];
					this.themeTypeList.forEach(v => {
						if (v.value !== null || v.value !== '') {
							typeIdList.push(v.value);
						}
					});
					data.labelIdList = typeIdList;
					data.categoryId = this.themeValue;
					this.$axios.post('/sm/themeTerminal/exportVideo', data).then(res => {
						if(res.code == 200){
							this.exportShow = false;
							this.themeValue = '';
							this.themeTypeList = [];
							this.$message('导出成功', 'success');
							this.getList();
						}
					});
				}
			},
			//删除 0删除 1删除确定
			deleteData(type, val){
				if(type == 0){
					this.deleteRow = val;
					this.deleteShow = true;
				}else{
					this.$axios.post('/sm/themeTerminal/deleteVideo', {id: this.deleteRow.id}).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message('删除成功', 'success');
							this.getList();
						}
					});
				}
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.content-wrap{
		display: flex;
	}
	.operat-list{
		display: flex;
		justify-content: space-around;
		color: #B3B6BA;
		font-size: 14px;
		cursor: pointer;
		.active{
			color: #409EFF;
		}
	}
	textarea{
		height: 130px;
		width: 280px;
		border: solid #DCDFE6 1px;
		border-radius: 4px;
		text-indent: 10px;
		resize: none;
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
