<template>
	<div class="content-main-wrap">
		<p class="content-title">用户登录日志</p>
		<div class="main-wrap">
			<div class="search-operat">
				<div>
          <!-- <span class="search-desc">用户名称：</span> -->
					<el-input v-model="searchKey" class="width-2" placeholder="请输入用户名称关键字" v-search="search" clearable></el-input>
					<el-button type="primary" class="search-btn" @click="search">查询</el-button>
				</div>
			</div>
			<div class="data-table table-border">
				<el-table
					v-loading="loading"
					:data="tableData"
					style="width: 100%">
					<el-table-column
						prop="userName"
						align="center"
						label="用户名称">
					</el-table-column>
          <el-table-column
						prop="ipAddress"
						align="center"
						label="IP地址">
					</el-table-column>
          <el-table-column
						prop="loginTime"
						align="center"
						label="登录时间">
					</el-table-column>
          <el-table-column
						prop="loginPlatform"
						align="center"
						label="登录平台">
					</el-table-column>
          <el-table-column
						prop="browser"
						align="center"
						label="浏览器">
					</el-table-column>
					<el-table-column
						prop="operatingSystem"
						align="center"
						label="操作系统">
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
	</div>
</template>

<script>
	export default {
		name: '',
		data() {
			return {
				totalS: '',
				searchKey: '',
				tableData: [],
				pageNum: 1,
				pages: 0,
				loading: false, // 表格加载
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			//获取列表
			getList(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					keyWord: this.searchKey,
				};
				this.$axios.get('/sys/user/login/log/list', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
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
