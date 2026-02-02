<template>
	<div class="content-main-wrap">
		<p class="content-title">广告设置</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input v-model="searchKey" class="width-2" placeholder="请输入广告名称关键字进行查询" v-search="search" clearable></el-input>
					<el-button type="primary" class="search-btn" @click="search">查询</el-button>
				</div>
				
				<div>
					<el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save">新增</el-button>
				</div>
			</div>
			
			<div class="data-table table-border">
				<el-table
					v-loading="loading"
					:data="tableData"
					style="width: 100%">
					<el-table-column
						prop="name"
						align="center"
						label="广告名称">
					</el-table-column>
					<el-table-column
						prop="location"
						align="center"
						label="广告位置">
						<template slot-scope="scope">
							{{scope.row.location | location}}
						</template>
					</el-table-column>
					<el-table-column
						prop="url"
						align="center"
						label="url">
					</el-table-column>
					<el-table-column
						prop="sort"
						align="center"
						label="排序">
					</el-table-column>
					<el-table-column
						align="center"
						label="图片"
						width="200">
						<template slot-scope="scope">
							<img :src="scope.row.imgUrl" alt="" class="adv-img">
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="状态">
						<template slot-scope="scope">
							{{scope.row.status | status}}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						width="100px"
						label="操作">
						<template slot-scope="scope">
							<ul class="operat-list">
								<li @click="add(0, scope.row)" v-if="permission.update">编辑</li>
								<li @click="deleteData(scope.row)" style="color:#f56c6c" v-if="permission.delete">删除</li>
							</ul>
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
		</div>
		
		<el-dialog
			:title="addEditType == 0 ? '编辑广告' : '新增广告'"
			:close-on-click-modal="false"
			:visible.sync="addEditShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-title" v-if="errorInfo">提示：{{errorInfo}}</p>
				<div class="dialog-item">
					<p>名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" v-model="addEditInfo.name"></el-input>
				</div>
				<div class="dialog-item">
					<p>位置</p>
					<p><em>*</em>：</p>
					<el-select v-model="addEditInfo.location" placeholder="请选择" class="width-2">
						<el-option
							v-for="item in locationList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-item">
					<p>URL</p>
					<p style="margin-right: 5px">：</p>
					<el-input class="width-2" v-model="addEditInfo.url"></el-input>
				</div>
				<div class="dialog-item">
					<p>排序</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" v-model.number="addEditInfo.sort"></el-input>
				</div>
				<div class="dialog-item">
					<p>图片</p>
					<p><em>*</em>：</p>
					<el-upload
						:limit="1"
						:on-exceed="handleOnExceed"
						class="upload-demoad upload-wrap"
						:action="uploadUrl"
						accept=".png,.jpg"
						:file-list="fileList"
						:on-change="selectFile"
						:before-remove="beforeRemov1e"
						list-type="picture"
						:auto-upload="false"
						drag>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过{{this.addEditInfo.location | limit}}kb</div> -->
						<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M</div>
						<div class=" tip_color" slot="tip">
						<div  v-show="addEditInfo.location !== ''">
							建议上传
							<span v-if="addEditInfo.location === 1">750*188</span>
							<span v-else-if="addEditInfo.location === 0">1920*380</span>
							<span v-else-if="addEditInfo.location === 10">1200*138</span>
							<span v-else-if="addEditInfo.location === 2 || addEditInfo.location === 3 ||addEditInfo.location === 11">1920*120</span>
							<span v-else>1920*160</span>
							规格的图片效果最佳
						</div>
						</div>
					</el-upload>
				</div>
				<div class="dialog-item" style="margin-top: 50px">
					<p>状态</p>
					<p><em>*</em>：</p>
					<el-select v-model="addEditInfo.status" placeholder="请选择" class="width-2">
						<el-option
							v-for="item in statusList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="httpRequest">确 定</el-button>
					<el-button @click="addEditShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">您确定删除该广告？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="deleteData()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { connectWs, sendMessage } from "../../../assets/js/conferenceroom";
	import {baseUrl} from "../../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				totalS: '',
				uploadUrl: baseUrl + '/sm/label/save',
				searchKey: '',
				tableData: [],
				tableDatas: [],
				pageNum: 1,
				permission: '',
				pages: 0,
				addEditShow: false,
				deleteShow: false,
				deleteRow: '',
				errorInfo: '',
				addEditInfo: '',
				addEditType: '',
				fileList: [],
				statusList: [{value: 0, label: '禁用'},{value: 1, label: '启用'}],
				locationList: window.localStorage.getItem('uiType') == 1 ? [
					{id: 0, name: '首页轮播图'},
					{id: 10, name: '首页中部轮播图'},
					{id: 1, name: '移动端轮播图'},
					{id: 4, name: '名师课堂顶部图'},
					{id: 5, name: '智能研修轮播图'},
					{id: 6, name: '专递课堂顶部图'},
					{id: 7, name: '优质资源顶部图'},
					{id: 8, name: '课后服务顶部图'},
					{id: 9, name: '停课不停学顶部图'},
					{id: 12, name: '教师研修顶部图'},
					{id: 13, name: '听评课活动顶部图'},
				] : [
					{id: 0, name: '首页轮播图'},
					{id: 1, name: '移动端轮播图'},
					{id: 2, name: '直播顶部图'},
					{id: 3, name: '视频顶部图'},
					{id: 5, name: '智能研修轮播图'},
					{id: 11, name: '互动课堂顶部图'},
					{id: 12, name: '教师研修顶部图'},
					{id: 13, name: '听评课活动顶部图'},
				],
				loading: false, // 表格加载
			}
		},
		components: {},
		mounted() {
			this.getAdvList();
			//建立ws连接
			// connectWs();
			// setInterval(() => {
			// 	sendMessage({
			// 		type: 'heartbeat',
			// 	});
			// }, 60000)
		},
		methods: {
			handleOnExceed(files,fileList) {
				this.$message('只能上传一个图片', 'error')
			},
			//获取教室列表
			getAdvList(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					keyWord: this.searchKey,
				};
				this.$axios.get('/sys/ad/list', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
				this.$axios.get('/sys/ad/list', {
					pageNum: 1,
					pageSize: 1000000,
				}).then(res => {
					this.tableDatas = res.data.pageList;
				});
			},
			//新增1 编辑0
			add(type, val){
				this.errorInfo = '';
				this.addEditType = type;
				if(type == 0){
					this.addEditInfo = {
						id: val.id,
						name: val.name,
						location: val.location,
						url: val.url,
						sort: val.sort,
						status: val.status,
						file: val.imgUrl
					}
					this.fileList = [{name: '', url: val.imgUrl}];
				}else{
					this.addEditInfo = {
						name: '',
						location: '',
						url: '',
						sort: '',
						status: 1,
					}
				}
				this.addEditShow = true;
			},
			//新增编辑确定
			httpRequest(param){
				this.errorInfo = '';
				if(this.verify()){
					return
				};
				let formData = new FormData();
				if(this.addEditInfo.file){
					formData.append('file', this.addEditInfo.file);
				}
				console.log(formData,'this.addEditInfo.file',this.addEditInfo.file)
				formData.append('name', this.addEditInfo.name);
				formData.append('location', this.addEditInfo.location);
				formData.append('url', this.addEditInfo.url);
				formData.append('sort', this.addEditInfo.sort);
				formData.append('status', this.addEditInfo.status);
				let url = '/sys/ad/save';
				if(this.addEditType == 0){
					url = '/sys/ad/update';
					formData.append('id', this.addEditInfo.id);
				}
				this.$axios.post(url, formData).then(res => {
					if(res.code == 200){
						this.addEditShow = false;
						this.$message(this.addEditType == 0 ? '修改成功' : '添加成功', 'success');
						this.getAdvList();
					}
				}, err => {
					console.log(err)
					reject(err)
				})
			},
			//上传的图片
			beforeRemov1e(){this.addEditInfo.file = null;},
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
      if (file.raw.size / 1024 > 1024) {
        this.fileList = [];
        return this.$message("图片大小必须在1M内", "error");
      } else {
        this.addEditInfo.file = file.raw;
      }
			},
			//删除
			deleteData(val){
				if(val){
					this.deleteShow = true;
					this.deleteRow = val;
				}else{
					this.$axios.post('/sys/ad/delete', [this.deleteRow.id]).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message('删除成功', 'success');
							this.totalS = this.totalS - 1;
							if (this.pageNum * 10 - this.totalS === 10) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.getAdvList();
						}
					})
				}
			},
			//搜索
			search(){
				this.scrollTo0();
				this.pageNum = 1;
				this.getAdvList();
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
				this.getAdvList();
			},
			//验证
			verify(){
				console.log(this.addEditInfo,this.addEditType)
				if(this.addEditInfo.location == 10) {
					let arr = [];
					let isTrue = false;
					this.tableDatas.forEach(el => {
						if(el.location == 10) {
							arr.push(el)
						}
					})
					if(this.addEditType == 0) {
						isTrue = arr.some(el => el.id == this.addEditInfo.id)
					}
					if(arr.length >= 2 && isTrue == false) {
						this.errorInfo = '首页中部轮播图最多上传2张！';
						return true;
					}
				}
				if(!this.addEditInfo.name){
					this.errorInfo = '名称不能为空！';
					return true;
				}
				if(this.addEditInfo.name.length > 20){
					this.errorInfo = '广告名称限制20字符内！';
					return true;
				}
				if(this.$verify.isEmpty(this.addEditInfo.location)){
					this.errorInfo = '请选择位置！';
					return true;
				}
				if(!this.$verify.checkUrl(this.addEditInfo.url) && this.addEditInfo.url){
					this.errorInfo = 'url地址格式异常！(必须包含https://)';
					return true;
				}
				if(this.addEditInfo.url.length > 1024 && this.addEditInfo.url){
					this.errorInfo = 'url地址长度不能超过1024个字符！';
					return true;
				}
				if(!this.addEditInfo.sort && this.addEditInfo.sort !== 0){
					this.errorInfo = '排序不能为空！';
					return true;
				}
				if(this.$verify.num(this.addEditInfo.sort, -1, 101)){
					this.errorInfo = '排序必须为0-100之间的数字！';
					return true;
				}
				if(this.addEditType == 0){
					if(this.addEditInfo.file){
						if((this.addEditInfo.file.size / 1024) > 1024){
							this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过1M';
							return  true;
						}
						// if(this.addEditInfo.location != 1){
						// 	if((this.addEditInfo.file.size / 1024) > 500){
						// 		this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过500kb';
						// 		return  true;
						// 	}
						// }else{
						// 	if((this.addEditInfo.file.size / 1024) > 100){
						// 		this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过100kb';
						// 		return  true;
						// 	}
						// }
					} else {
						this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过1M';
						return  true;
					}
				}else{
					if(!(this.addEditInfo.file && (this.addEditInfo.file.size / 1024) < 1024)){
						this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过1M';
						return  true;
					}
					// if(this.addEditInfo.location != 1){
					// 	if(!(this.addEditInfo.file && (this.addEditInfo.file.size / 1024) < 500)){
					// 		this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过500kb';
					// 		return  true;
					// 	}
					// }else{
					// 	if(!(this.addEditInfo.file && (this.addEditInfo.file.size / 1024) < 100)){
					// 		this.errorInfo = '请上传图片， 只能上传jpg/png文件，且不超过100kb';
					// 		return  true;
					// 	}
					// }
				}
				return false
			},
		},
		filters: {
			status(val){
				return val == 0 ? '禁用' : '启用';
			},
			location(val){
				let list = ['首页轮播图', '移动端轮播图', '直播顶部图', '视频顶部图', '名师课堂顶部图', '智能研修轮播图', '专递课堂顶部图', '优质资源顶部图', '课后服务顶部图', '停课不停学顶部图', '首页中部轮播图', '互动课堂顶部图','教师研修顶部图','听评课活动顶部图']
				return list[val];
			},
			limit(val){
				return val == 1 ? 100 : 500;
			}
		},
		watch: {
			addEditShow(val){
				if(!val){
					this.fileList = []
				}
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.upload-wrap{
		border: 1px dashed #d9d9d9;
		height: 130px;
	}
	.adv-img{
		width: 143px;
		height: 35px;
	}
	.dialog-item{
		p:first-child{
			width: 40px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
		}
	}

	.tip_color {
		font-size: 12px;
		display: inline-block;
		color: #e6a23c;
	}
		::v-deep .el-upload-dragger{
		width: 270px;
		height: 130px;
		padding-bottom: 28px;
	}
	::v-deep .el-upload-dragger .el-icon-upload{
		margin-top: 20px;
	}
	::v-deep .upload-demoad .el-upload-list{
		margin: -162px 0 0 25px;
		width: 222px;
	}
	::v-deep .upload-demoad .el-upload-list__item-status-label{
		display: block;
	}
</style>
