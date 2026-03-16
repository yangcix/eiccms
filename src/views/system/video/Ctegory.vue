<template>
	<div class="content-main-wrap">
		<p class="content-title">类型管理</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input class="width-2" clearable v-model="keyword" placeholder="请输入类型名称关键字" v-search="handleSearch"></el-input>
					<el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
				</div>
				
				<div>
					<el-button v-if="uiType == 2 && permission.save" class="width-1" icon="el-icon-upload2" @click="handleAdd()">新增</el-button>
				</div>
			</div>
			<div class="data-table table-border">
				<el-table
					:row-style="{ height: '10px' }"
					:cell-style="{ padding: '4px 0' }"
					v-loading="loading"
					:data="tableData"
					style="width: 100%;margin-bottom: 20px;">
					<el-table-column
            			align="center"
						prop="name"
						label="类型名称">
					</el-table-column>
					<el-table-column
						align="center"
						prop=""
						:label="uiType == 1 ? '更新时间' : '创建时间'">
						<template slot-scope="scope">
							{{ uiType == 1 ? scope.row.modifyDate : scope.row.createDate }}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="操作">
						<template slot-scope="scope">
							<el-button v-if="permission.update" type="text" @click="handleEdit(scope.row)">编辑</el-button>
							<el-button v-if="uiType == 2 && permission.delete" type="text" style="color:#f56c6c" @click="deleteData(scope.row)">{{(scope.row.id !== 1 && scope.row.id !== 8) ?'删除' : ''}}</el-button>
							<!-- <el-button v-if="permission.update && uiType == 2 && scope.row.id !== 1 && scope.row.id !== 8" type="text" @click="handleEdit(scope.row)">编辑</el-button>
							<el-button v-if="uiType == 2 && permission.delete" type="text" style="color:#f56c6c" @click="deleteData(scope.row)">{{(scope.row.id !== 1 && scope.row.id !== 8) ?'删除' : ''}}</el-button> -->
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog
				:title="addClass ? '新增类型' : '编辑类型'"
				:before-close="handleClose"
				:visible.sync="classifyCpm"
				:close-on-click-modal="false"
				width="500px">
				<div class="dialog-wrap">
					<div class="dialog-item">
						<p>类型名称</p>
						<p><em>*</em>：</p>
						<el-input clearable v-model="addEditInfo.name" class="width-5" :disabled="uiType == 2 ? false : true"></el-input>
					</div>

					<div class="dialog-item">
						<p>默认图片</p>
						<p><em>*</em>：</p>
						<el-upload
							:limit="1"
							:on-exceed="handleOnExceed"
							class="upload-democate"
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

				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleConfirms">确 定</el-button>
					<el-button @click="handleClose" style="margin-left: 10px;">取 消</el-button>
				</span>
			</el-dialog>
			<div class="table-page">
				<el-pagination
					layout="prev, pager, next"
					@current-change="handlePageChange"
					:page-count="pages"
					:current-page="pageNum">
				</el-pagination>
			</div>
			<el-dialog
			title="删除类型"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该类型？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleDelete()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		</div>
	</div>
</template>

<script>
	import { creatTree, baseUrl, throttle } from "../../../assets/js/utils";
	export default {
		name: '',
		data() {
			this.handleConfirms = throttle(this.handleConfirm, 500)
			return {
				uiType: window.localStorage.getItem('uiType'),
				deleteShow: false,
				deleteVal: {},
				uploadUrl: baseUrl + '/sm/category/save',
				editData: {},
				addEditInfo: { name: '' },
				fileList: [],
				editId: 0, // 编辑save id
				addClass: false, // true===新增 !=编辑
				pageNum: 1, //请求当前页数
				pages: 0, // 总页数
				keyword: '', // 关键字
				loading: false, // 表格加载
				classifyCpm: false, // 新增分类
				tableData: [], // 表格data
				totalS: '',
				permission: '',
			}
		},
		components: {},
		mounted() {
			this.handleGetData();
		},
		methods: {
			deleteData(val){
				this.deleteVal = val
				this.deleteShow = true
			},
			handleOnExceed(files,fileList) {
				this.$message('只能上传一个图片', 'error')
			},
			beforeRemov1e(){
				this.addEditInfo.file = null;
				this.fileList = [];
			},
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
					return this.$message('默认图片只能上传jpg/png文件，且不超过500kb', 'error');
				} else {
					this.addEditInfo.file = file.raw;
				}
			},
			// 编辑
			handleEdit(edit) {
				this.editData = edit;
				this.addClass = false;
				this.classifyCpm = true;
				this.addEditInfo.name = edit.name;
				if(edit.imgUrl !== '' && edit.imgUrl !== null) {
					this.fileList = [{name: '', url: edit.imgUrl}];
				}
				// this.fileList = [{ name: '', url: `http://192.168.164.58${edit.imgUrl}` }]
			},
			// 删除
			handleDelete() {
				const row = this.deleteVal
					this.$axios.post('/sm/category/delete', {
						id: row.id,
						imgUrl: row.imgUrl
					}).then(res => {
						if (res.code === 200) {
							this.$message('删除成功', 'success');
							this.totalS = this.totalS - 1;
							if (this.pageNum * 10 - this.totalS === 10) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.deleteShow = false
							this.handleGetData();
						}
					})
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
			// 分页点击
			handlePageChange(val) {
				this.scrollTo0();
				this.pageNum = val;
				this.handleGetData();
			},
			// 搜索
			handleSearch() {
				this.scrollTo0();
				// if (this.keyword === '') {
				// 	this.$message('请输入类型名称关键字', 'error');
				// 	return;
				// }
				this.pageNum = 1;
				this.handleGetData();
			},
			handleGetData() {
				this.loading = true;
				this.$axios.get('/sm/category/list',{
					keyWord: this.keyword,
					pageNum: this.pageNum,
					pageSize: 10,
				}).then(res => {
					this.loading = false;
					this.permission = this.creatPermit(res.data.permit);
					this.tableData = res.data.pageList;
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				})
			},
			// 新增
			handleAdd() {
				this.classifyCpm = true;
				this.addClass = true;
			},
			// cpm取消
			handleClose() {
				this.classifyCpm = false;
				this.addEditInfo.file = null;
				this.addEditInfo.name = '';
				this.fileList = [];
				this.editData = {};
			},
			// 确定
			handleConfirm() {
				if (!this.addEditInfo.name) {
					this.$message('名称不能为空！', 'error');
					return true;
				};
				if (this.$verify.chLetterNum(this.addEditInfo.name, 10)) {
					this.$message('名称由中文大小写字母数字组成，最长10位！', 'error');
					return true;
				};
				if (this.addClass) { // 新增
					if (!this.addEditInfo.file) {
						this.$message('默认图片必填', 'error');
						return true;
					}
				} else { // 编辑
					if (this.fileList.length === 0 && !this.addEditInfo.file) {
						this.$message('默认图片必填', 'error');
						return true;
					}
				}
				let formData = new FormData();
				formData.append('file', this.addEditInfo.file);
				formData.append('name', this.addEditInfo.name);
				if (this.editData.id) {
					formData.append('id', this.editData.id);
				}
				let url = '';
				if (this.addClass) {
					url = '/sm/category/save';
				} else {
					url = '/sm/category/update';
				}
				this.$axios.post(url,formData).then(res => {
					if (res.code === 200) {
						this.$message(`${ this.addClass ? '新增' : '编辑' }成功`, 'success');
						this.classifyCpm = false;
						this.addEditInfo.file = null;
						this.addEditInfo.name = '';
						this.fileList = [];
						this.handleGetData();
					}
				}, err => {
					console.log(err);
				})
			},
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
</style>
<style>
.el-upload-dragger{
	width: 332px;
	height: 133px;
}
.upload-democate .el-upload-list{
	margin: -145px 0 0 15px;
	width: 300px;
}
.upload-democate .el-upload-list__item-status-label{
	display: block;
}

.upload-democate {
	height: 140px;
}

.el-upload-dragger .el-icon-upload {
	margin: 30px 0 16px;
}
</style>