<!-- lessonTemp -->
<template>
	<div class="content-main-wrap">
		<p class="content-title">课表模板</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input class="width-2" clearable v-model="keyword" placeholder="请输入模板名称关键字" v-search="handleSearch"></el-input>
					<el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
				</div>
				
				<div>
					<el-button class="width-1" icon="el-icon-upload2" @click="handleAdd()" v-if="permission.save">新增</el-button>
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
						label="模板名称">
					</el-table-column>
					<el-table-column
						align="center"
						label="状态">
						<template slot-scope="scope">
							{{ scope.row.status == 1 ? '使用中' : '未使用' }}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="应用年级">
						<template slot-scope="scope">
							{{ scope.row.gradeList | dealGrade }}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="createDate"
						label="添加时间">
					</el-table-column>
					<el-table-column
						align="center"
						label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="edit(scope.row)" v-if="permission.detailInfo">编辑</el-button>
              				<el-button type="text" @click="applyTemp(scope.row,'select')" v-if="permission.apply">应用</el-button>
							<el-button type="text" style="color:#f56c6c" @click="openDelete(scope.row.id)" v-if="permission.delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="table-page">
				<el-pagination
					layout="prev, pager, next"
					@current-change="handlePageChange"
					:page-count="pages"
					:current-page="pageNum">
				</el-pagination>
			</div>
		</div>
		<el-dialog
			title="删除模板"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该模板？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleDelete()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog
			title="模板应用"
			:visible.sync="applyVisible"
			:before-close="closeApply"
			:close-on-click-modal='false'
			width="372px"
			left>
			<el-select v-model="gradeIds" multiple placeholder="选择应用年级" class="width-5" v-if="!isApply">
				<el-option
				v-for="item in applyList"
				:key="item.id"
				:label="(item.orgName + ' — ' + item.name)"
				:value="item.id">
				</el-option>
			</el-select>
			<span v-if="isApply">改模板应用后，原来模板将失效，确认应用？</span>
			<span slot="footer" class="dialog-footer" v-if="!isApply">
				<el-button @click="this.closeApply">取 消</el-button>
				<el-button type="primary" @click="toApply">应用</el-button>
			</span>
			<span slot="footer" class="dialog-footer" v-if="isApply">
				<el-button @click="isApply = false">取 消</el-button>
				<el-button type="primary" @click="applyTemp(null,'apply')">应用</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	let currentRow = null;
	export default {
		name: '',
		data() {
			return {
				deleteShow: false,
				id: '',
				pageNum: 1, //请求当前页数
				pages: 0, // 总页数
				keyword: '', // 关键字
				loading: false, // 表格加载
				tableData: [], // 表格data
				totalS: '',
				permission:'', // 权限
				applyVisible:false, // 应用
				gradeIds:[], // 应用年级id
				applyList:[], // 应用年级可选项
				isApply:false, // 是否是应用
			}
		},
		components: {},
		mounted() {
			this.handleGetData();
		},
		watch: {
			$route(to, from) {
				if(from.path == '/sm/lessonTemplateEdit') {
					this.handleGetData();
				}else if(from.path !== '/sm/lessonTemplate'){
					this.keyword = '';
					if(from.path == '/sm/lessonTemplateEdit'){
						if(from.query && from.query.id) {
							this.handleGetData();
						}else{
							this.pageNum = 1;
							this.handleGetData();
						}
					}else{
						this.pageNum = 1;
						this.handleGetData();
					}
					
				}
			},
		},
		methods: {
			getGradeList(id){
				// 获取年级列表
				this.$axios.get(`/sm/lessonTemplate/listGrades?id=${id}`,).then(res => {
					if(res.code == 200){
						this.applyList = res.data;
					}
				})
			},
			closeApply(){
				this.gradeIds = [];
				this.isApply = false;
				this.applyVisible = false;
				currentRow = null;
			},
			
			toApply() {
				if(this.gradeIds.length == 0){
					this.$message('请选择应用年级','error');
					return
				}
				this.isApply = true;
			},
			// 应该模板
			applyTemp(row,type){
				if(type === 'select'){
					currentRow = row;
					console.log(currentRow)
					this.applyVisible = true;
					if(currentRow.gradeList && currentRow.gradeList.length > 0) {
						currentRow.gradeList.forEach(el => {
							this.gradeIds.push(el.id)
						});
					}
					this.getGradeList(currentRow.id)
				}if(type === 'apply'){
					console.log(currentRow)
					this.$axios.post('/sm/lessonTemplate/apply',{ id: currentRow.id, gradeIds:this.gradeIds}).then(res => {
						if(res.code == 200){
							this.$message('应用成功','success');
							this.closeApply();
							this.handleGetData();
						}
					})
				}
				
			},
			openDelete(id) {
				this.id = id;
				this.deleteShow = true;
			},
			// 删除
			handleDelete(id) {
					this.$axios.post('/sm/lessonTemplate/delete', {id:this.id}).then(res => {
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
				this.$axios.get('/sm/lessonTemplate/list',{
					keyWord: this.keyword,
					pageNum: this.pageNum,
					pageSize: 10,
				}).then(res => {
					this.loading = false;
					this.tableData = res.data.pageList;
					this.pages = res.data.pages;
					this.totalS = res.data.total;
					this.permission = this.creatPermit(res.data.permit);
				})
			},
			// 新增
			handleAdd() {
        this.$router.push('/sm/lessonTemplateEdit')
			},

      // 编辑
      edit(row) {
        this.$router.push({
					path: '/sm/lessonTemplateEdit',
					query: {
					data:	JSON.stringify({
						id: row.id,
						name: row.name,
						gradeList:  row.gradeList ? row.gradeList : []
					})}
				})
      }


		},
		filters:{
			dealGrade(list){
				let arr = list.map((grade) => {
					return grade.orgName + '-' + grade.name;
				})
				return arr.join(',');
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
</style>
