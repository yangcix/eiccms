<template>
	<div class="content-main-wrap">
		<p class="content-title">帮助中心</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input v-model="searchKey" class="width-2" placeholder="请输入标题关键字进行查询" v-search="search" clearable></el-input>
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
						label="标题">
					</el-table-column>
          <el-table-column
						prop="createUserName"
						align="center"
						label="作者">
					</el-table-column>
          <el-table-column
						prop="createDate"
						align="center"
						label="创建时间">
					</el-table-column>
					<el-table-column
						align="center"
						width="120px"
						label="操作">
						<template slot-scope="scope">
							<ul class="operat-list">
								<li @click="add(0, scope.row)" v-if="permission.update">编辑</li>
								<li @click="openDeleteShow(scope.row)" style="color:#f56c6c" v-if="permission.delete">删除</li>
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
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">您确定删除该文章？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="deleteData()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { json } from 'body-parser';

	export default {
		name: '',
		data() {
			return {
				id: '',
				totalS: '',
				searchKey: '',
				tableData: [],
				pageNum: 1,
				permission: '',
				pages: 0,
				deleteShow: false,
				deleteRow: '',
				loading: false, // 表格加载
			}
		},
		components: {},
		watch: {
			$route(to, from) {
				console.log(from.path)
				if(from.path !== '/sys/help'){
					if(from.path == '/sys/helpaddedit'){
						if(from.query && from.query.data) {
							this.getList();
						}else{
							this.searchKey = '';
							this.pageNum = 1;
							this.getList();
						}
					}else{
						this.searchKey = '';
						this.pageNum = 1;
						this.getList();
					}
				}
			},
		},
		mounted() {
			this.getList();
		},
		methods: {
			openDeleteShow(data) {
				this.id = data.id;
				this.deleteShow = true;
			},
			//获取文章列表
			getList(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					keyWord: this.searchKey,
				};
				this.$axios.get('/sys/help/list', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
			},
			//新增1 编辑0
			add(type, val){
				if(type == 0){
					this.$router.push({path: '/sys/helpaddedit', query: {data: JSON.stringify(val) }});
				}else{
					this.$router.push('/sys/helpaddedit');
				}
			},
			//删除
			deleteData(){
					this.$axios.post('/sys/help/delete', [this.id]).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message(res.message, 'success');
							this.totalS = this.totalS - 1;
							if (this.pageNum * 10 - this.totalS === 10) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.getList();
						}
					})
			},
			//搜索
			search(){
				this.pageNum = 1;
				this.getList();
			},
			//分页点击
			pageChange(val){
				this.pageNum = val;
				this.getList();
			},
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.el-upload-dragger{
		width: 270px;
		height: 130px;
		padding-bottom: 28px;
	}
	.el-upload-dragger .el-icon-upload{
		margin-top: 20px;
	}
	.upload-demoad .el-upload-list{
		margin: -162px 0 0 25px;
		width: 222px;
	}
	.upload-demoad .el-upload-list__item-status-label{
		display: block;
	}
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
</style>
