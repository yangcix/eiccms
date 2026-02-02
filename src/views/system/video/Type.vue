<template>
	<div class="content-main-wrap">
		<p class="content-title">分类管理</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input class="width-2" clearable v-model="keyword" placeholder="请输入分类名称关键字" v-search="handleSearch"></el-input>
					<el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
				</div>
				
				<div>
					<el-button v-if="permission.save" class="width-1" icon="el-icon-upload2" @click="handleAdd()">新增</el-button>
				</div>
			</div>
			<div class="data-table table-border">
				<el-table
					:row-style="{ height: '10px' }"
					:cell-style="{ padding: '4px 0' }"
					v-loading="loading"
					:data="tableData"
					style="width: 100%;margin-bottom: 20px;"
					row-key="id"
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column
						prop="name"
						label="分类名称">
					</el-table-column>
					<el-table-column
						align="center"
						label="所属类型">
						<template slot-scope="scope">
							{{ handleFilter(scope.row.categoryNameList) }}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="createDate"
						label="创建时间">
					</el-table-column>
					<el-table-column
						align="center"
						label="操作">
						<template slot-scope="scope">
							<el-button v-if="permission.update" type="text" @click="handleEdit(scope.row)">编辑</el-button>
							<el-button v-if="permission.delete" type="text" style="color:#f56c6c" @click="deleteData(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog
				:title="addClass ? '新增分类' : '编辑分类'"
				:before-close="handleClose"
				:visible.sync="classifyCpm"
				:close-on-click-modal="false"
				width="500px">
				<div class="dialog-wrap">
					<!-- <p class="err-title" v-if="errorInfo">提示：{{errorInfo}}</p> -->
					<div class="dialog-item">
						<p>分类名称</p>
						<p><em>*</em>：</p>
						<el-input clearable v-model="menuName" class="width-5"></el-input>
					</div>
					<div class="dialog-item">
						<p>级别</p>
						<p><em>*</em>：</p>
						<el-select class="width-5" :disabled="!addClass" clearable  v-model="rankValue" placeholder="请选择">
							<el-option
							v-for="item in rankList"
							:key="item.id"
							:label="item.value"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="dialog-item" v-if="rankValue === 1">
						<p>上级分类</p>
						<p><em>*</em>：</p>
						<el-select class="width-5" clearable  v-model="superiorValue" placeholder="请选择">
							<el-option
							v-for="item in superiorData"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="dialog-item" v-if="rankValue === 1">
						<p>类型</p>
						<p><em>*</em>：</p>
						<el-select class="width-5" clearable multiple  v-model="typeValue" placeholder="请选择">
							<el-option
							v-for="item in typeData"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleConfirm()">确 定</el-button>
					<el-button @click="handleClose">取 消</el-button>
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
			title="删除分类"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该分类？</p>
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
	import { creatTree } from "../../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				uiType: localStorage.getItem('uiType'),
				deleteShow: false,
				deleteVal: '',
				editId: 0, // 编辑save id
				addClass: false, // true===新增 !=编辑
				pageNum: 1, //请求当前页数
				pages: 0, // 总页数
				keyword: '', // 关键字
				loading: false, // 表格加载
				errorInfo: '',
				menuName: '',
				classifyCpm: false, // 新增分类
				rankList: [  // 级别 parentId为0的话就表示是一级
					{ value: '一级分类', id: 0 },
					{ value: '二级分类', id: 1 }
				],
				rankValue: '', // 级别value
				superiorValue: '', // 上级分类value
				superiorData: [], // 上级分类data
				typeValue: [], // 类型value
				typeData: [], // 类型data
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
			// 编辑
			handleEdit(edit) {
				this.editId = edit.id;
				this.handleAllParentList();
				this.handleListAll();
				this.addClass = false;
				this.classifyCpm = true;
				this.rankValue = edit.parentId === 0 ? 0 : 1;
				this.menuName = edit.name;
				this.superiorValue = edit.parentId;
				this.typeValue = edit.categoryIdList;
			},
			// 删除
			handleDelete() {
					this.$axios.post('/sm/label/delete', [this.deleteVal.id]).then(res => {
						if (res.code === 200) {
							if(this.deleteVal.parentId == 0){
								this.totalS = this.totalS - 1;
								if (this.pageNum * 10 - this.totalS === 10) {
									this.pageNum = this.pageNum - 1 || 1
								}
							}
							this.deleteShow = false
							this.$message('删除成功', 'success');
							this.handleGetData();
						}
					})
			},
			// 数据过滤
			handleFilter(arr) {
				let str = '';
				if (arr === undefined || !arr.length ) {
					str = '';
				} else {
					for (let i = 0; i < arr.length; i++) {
						str+= arr[i] + ','
					}
					str = (str.substring(str.length-1)==',') ? str.substring(0,str.length-1):str;
				}
				return str;
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
				// 	this.$message('请输入分类名称关键字', 'error');
				// 	return;
				// }
				this.pageNum = 1;
				this.handleGetData();
			},
			handleGetData() {
				this.loading = true;
				this.$axios.get('/sm/label/list',{
					keyWord: this.keyword,
					pageNum: this.pageNum,
					pageSize: 10,
				}).then(res => {
					this.loading = false;
					this.permission = this.creatPermit(res.data.permit);
					this.tableData = creatTree(res.data.pageList);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
					this.tableData = this.tableData.filter(el => {
						return el.id !== 33
					})
				})
			},
			// 新增
			handleAdd() {
				this.classifyCpm = true;
				this.handleAllParentList();
				this.handleListAll();
				this.addClass = true;
				this.menuName = '';
				this.rankValue = '';
				this.superiorValue = '';
				this.typeValue = [];
			},
			handleClose() {
				this.classifyCpm = false;
				this.menuName = '';
				this.rankValue = '';
				this.superiorValue = '';
				this.typeValue = [];
			},
			handleConfirm() { //cpm save
				if (!this.menuName) {
					this.$message('提示：名称不能为空！', 'error');
					return;
				}
				if (this.$verify.chLetterNum(this.menuName, 20)) {
					this.$message('提示：名称由中文大小写字母数字组成，最长20位！', 'error');
					return;
				}
				if (this.rankValue === '') {
					this.$message('请选择级别', 'error');
					return;
				}
				if (this.rankValue === 1) {
					if (!this.superiorValue) {
						this.$message('请选择上级分类', 'error');
						return;
					}
					if (this.typeValue.length <= 0) {
						this.$message('请选择类型', 'error');
						return;
					}
					if (this.addClass) {
						this.$axios.post('/sm/label/save', {
							name: this.menuName,
							parentId: this.superiorValue,
							categoryIdList: this.typeValue,
						}).then(res => {
							if (res.code === 200) {
								this.menuName = '';
								this.rankValue = '';
								this.superiorValue = '';
								this.typeValue = [];
								this.$message(res.message, 'success');
								this.classifyCpm = false;
								this.handleGetData();
							}
						})
					} else { // 2
						console.log('this.typeValue',this.typeValue)
						// let ids = this.typeValue.map(value => this.typeData.find(data => data.name === value).id);
						this.$axios.post('/sm/label/update', {
							id: this.editId,
							name: this.menuName,
							parentId: this.superiorValue,
							categoryIdList: this.typeValue,
						}).then(res => {
							if (res.code === 200) {
								this.classifyCpm = false;
								this.$message(res.message, 'success');
								this.handleGetData();
							}
						})
					}
				} else {
					if (this.addClass) {
						this.$axios.post('/sm/label/save', {
							name: this.menuName,
							parentId: '',
						}).then(res => {
							if (res.code === 200) {
								this.menuName = '';
								this.rankValue = '';
								this.superiorValue = '';
								this.typeValue = [];
								this.$message(res.message, 'success');
								this.classifyCpm = false;
								this.handleGetData();
							}
						})
					} else { // 1
						let ids = this.typeValue.map(value => this.typeData.find(data => data.name === value).id);
						this.$axios.post('/sm/label/update', {
							id: this.editId,
							name: this.menuName,
							parentId: '',
							categoryIdList: ids,
						}).then(res => {
							if (res.code === 200) {
								this.classifyCpm = false;
								this.$message(res.message, 'success');
								this.handleGetData();
							}
						})
					}
				}
			},
			// 获取上级分类
			handleAllParentList() {
				this.$axios.get('/sm/label/listAllParent').then(res => {
					this.superiorData = res.data;
				})
			},
			// 获取类型
			handleListAll() {
				this.$axios.get('/sm/category/listAll').then(res => {
					this.typeData = res.data;
				})
			},
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
</style>
