<!-- recordLesson -->
<template>
	<div class="content-main-wrap">
		<p class="content-title">课表管理</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input class="width-2" clearable v-model="keyword" placeholder="请输入班级名称关键字" v-search="handleSearch"></el-input>
					<el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
				</div>
				
				<div>
					<el-button class="width-6" icon="el-icon-download" @click="downloadTemp()" v-if="permission.downloadTemplate">下载课表模板</el-button>
				</div>
			</div>
			<div class="data-table table-border">
				<el-table
					:row-style="{ height: '10px' }"
					:cell-style="{ padding: '4px 0' }"
					v-loading="tableLoading"
					:data="tableData"
					style="width: 100%;margin-bottom: 20px;">
					<el-table-column
						v-if="isTrue == 1"
						align="center"
						prop="orgName"
						label="所属学校">
					</el-table-column>
					<el-table-column
						align="center"
						prop="gradeName"
						label="年级">
					</el-table-column>
					<el-table-column
						align="center"
						prop="name"
						label="班级名称">
					</el-table-column>
					<el-table-column
						align="center"
						prop="templateUpdateTime"
						label="更新时间">
						<template slot-scope="scope">
							  <span>{{scope.row.templateUpdateTime ? scope.row.templateUpdateTime : '————' }}</span> 
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="edit(scope.row)" v-if="permission.update">编辑</el-button>
              <el-upload 
		           class="upload-demo upload-btn"
						   :action="uploadUrl"
		           accept=".xls,.xlsx"
		           :before-upload="selectFile"
		           :show-file-list="false"
		           :http-request="httpRequest">
							<el-button type="text"  @click="importLesson(scope.row)" v-if="permission.importCurriculum">导入课表</el-button>
						</el-upload>
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
	</div>
</template>

<script>
	import {baseUrl} from "../../../assets/js/utils";
	import axios from 'axios'
	export default {
		name: '',
		data() {
			return {
				pageNum: 1, //请求当前页数
				pages: 0, // 总页数
				keyword: '', // 关键字
				loading: false, // 表格加载
				tableData: [], // 表格data
				totalS: '',
				uploadUrl: baseUrl + '/sm/curriculum/importCurriculum',
				currentImportId:'', // 当前导入id
				tableLoading:false,
				permission:'', // 权限
				isTrue: 0,
			}
		},
		components: {},
		mounted() {
			this.handleGetData();
		},
		watch: {
			$route(to, from) {
				if(from.path !== '/sm/curriculum'){
					if(from.path == '/recordlessonedit'){
						if(from.query && from.query.id) {
							this.handleGetData();
						}else{
							this.pageNum = 1;
							this.handleGetData();
						}
					}else{
						this.keyword = '';
						this.pageNum = 1;
						this.handleGetData();
					}
				}
			},
		},
		methods: {
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
				// if (this.keyword === '') {
				// 	this.$message('请输入分类名称关键字', 'error');
				// 	return;
				// }
				this.scrollTo0();
				this.pageNum = 1;
				this.handleGetData();
			},
			// 获取列表数据
			handleGetData() {
				this.$axios.get('/index/getSchool').then(res => {
          if(res.data.length > 1) {
              this.isTrue = 1;
            }else{
              this.isTrue = 0;
            }
        })
				this.loading = true;
				this.$axios.get('/sm/curriculum/list',{
					keyWord: this.keyword,
					pageNum: this.pageNum,
					pageSize: 10,
				}).then(res => {
					this.loading = false;
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				})
			},

			// 下载课表模板
			downloadTemp() {
				this.$axios.get('/sm/curriculum/downloadTemplate',{}, 'blob').then(res => {
					
					console.log(res)
					let url = window.URL.createObjectURL(new Blob([res]));
					console.log(url)
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					link.setAttribute('download', decodeURIComponent('课表模板.xlsx'));
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}).catch(err => {
					console.log(err)
				});
				// this.$axios.get('/sm/curriculum/downloadTemplate').then(res => {
				// 	if(res.code == 200) {
				// 		this.$message(res.message,'success')
				// 	}
				// })
			},
      // 编辑
      edit(row) {
        this.$router.push(`/recordlessonedit?id=${row.id}&name=${row.name}`)
      },

			//选择上传文件
			selectFile(file){
				let isJpg;
				if (
					file.type == "application/vnd.ms-excel" ||
					file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				) {
					isJpg = true;
				} else {
					isJpg = false;
				}
				if(!isJpg){
					return this.$message('导入失败，文件格式错误', 'error');
				}
				this.loading = this.$loading({
					lock: true,
					text: '上传中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
			},
			importLesson(row) {
				this.currentImportId = row.id
			},
			//覆盖默认上传，手动上传
			httpRequest(param) {
					let fileObj = param.file;
					let formData = new FormData();
					formData.append('file', param.file);
					// formData.append('userType', this.activeIndex);
					axios({
						method: 'post',
						url: `/sm/curriculum/importCurriculum?classId=${this.currentImportId}`,
						data: formData,
						responseType: 'blob'
					}).then(res => {
						this.loading.close();
						let reader = new FileReader();
						let that = this;
						console.log(res)
						reader.readAsText(res);
						reader.onload = function(event){
							console.log(reader.result,event)
							//内容就在这里
							if(JSON.parse(reader.result).code == 200){
									that.handleGetData();
									that.$message('导入成功！','success')
							}else {
								that.handleGetData(); // 取巧刷新token
								that.$message(JSON.parse(reader.result).message,'error')
							}
						};
						
						
					}, err => {
						this.loading.close();
						console.log(err)
						reject(err)
					})
				},
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
</style>
