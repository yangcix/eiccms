<!-- /sm/school -->
<template>
	<div class="content-main-wrap">
		<p class="content-title">学校管理</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div>
					<el-input v-model="searchKey" class="width-2" placeholder="请输入学校名称关键字进行查询" v-search="search" clearable></el-input>
					<el-button type="primary" class="search-btn" @click="search">查询</el-button>
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
						label="学校名称">
					</el-table-column>
					<el-table-column
						prop="schoolPlatform"
						align="center"
						label="学校平台名称">
					</el-table-column>
					<el-table-column
						prop="ip"
						align="center"
						label="平台IP">
					</el-table-column>
					<el-table-column
						prop="port"
						align="center"
						label="平台端口">
					</el-table-column>
					<!-- <el-table-column
						align="center"
						:show-overflow-tooltip="true"
						label="负责人">
						<template slot-scope="scope">
							<ul class="principal-list">
								<li>{{ scope.row.principalNames.join(',') }}</li>
							</ul>
						</template>
					</el-table-column> -->
          <!-- <el-table-column
						prop="phone"
						align="center"
						label="联系方式">
					</el-table-column> -->
					<el-table-column
						align="center"
						label="状态">
						<template slot-scope="scope">
							{{scope.row.status | useStatus}}
						</template>
					</el-table-column>
          <el-table-column
						prop="linkStatus"
						align="center"
					  :show-overflow-tooltip="true"
						label="连接状态">
						<template slot-scope="scope">
							{{scope.row.linkStatus | linkStatusFilter}}
						</template>
					</el-table-column>
					<el-table-column
						prop="createTime"
						align="center"
						min-width="110"
						label="添加时间">
					</el-table-column>
					<el-table-column
						align="center"
						width="100px"
						label="操作">
						<template slot-scope="scope">
							<ul class="operat-list">
								<li @click="audit(0, scope.row)" v-if="permission.audit" :class="scope.row.status != 0 ? 'disabled': ''">审核</li>
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
			title="互动审核"
			:close-on-click-modal="false"
			:visible.sync="auditShow"
			width="420px">
			<div class="dialog-wrap">
				<div class="dialog-item">
					<p>审核结果</p>
					<p><em>*</em>：</p>
					<el-select v-model="auditStatus" placeholder="请选择" class="width-5">
						<el-option
							v-for="item in auditList"
							:key="item.id"
							:label="item.value"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-item" v-if="auditStatus == 2">
					<p>驳回理由</p>
					<p style="margin-right: 5px"><em></em>：</p>
					<el-input  type="textarea" :rows="3" class="width-5" v-model="rejectReason" maxlength="20"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="audit(1)">确 定</el-button>
					<el-button @click="auditShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">您确定删除该学校的申请？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="deleteData()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		name: 'school',
		data() {
			return {
				searchKey: '',
				tableData: [],
				pageNum: 1,
				permission: '',
				pages: 0,
        originStatus: 1,
        auditList: [{id: 1, value: '通过'}, {id: 2, value: '不通过'}],
        rejectReason:'',
        auditStatus: 1,
        

				auditShow: false,
				deleteShow: false,
				deleteRow: '',

				totalS: '',
				loading: false, // 表格加载
			}
		},
		components: {},
		filters: {
			useStatus(val){
				let arr = ['待审核','通过', '拒绝'];
				return arr[val];
			},
			linkStatusFilter(val) {
				let arr = ['在线','离线'];
				return arr[val];
			}
		},
		mounted() {
			this.getSchoolList();
		},
		methods: {
			//获取申请学校列表
			getSchoolList(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					keyWord: this.searchKey,
				};
				this.$axios.get('/sys/SysSchool/list', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
			},
			//审核 0审核 1审核确定
			audit(type, val){
				if(type == 0){
					if(val.status != 0){
						return;
					}
					this.auditStatus = 1
					this.rejectReason = ''
					this.auditRow = val;
					this.auditShow = true;
				}else{
					if(this.rejectReason && this.$verify.chLetterNum(this.rejectReason,20)){
						this.$message('驳回理由只限中文、数字、大小写字母输入','error')
						return
					}
					
					let data = {
						status: this.auditStatus,
						id: this.auditRow.id,
						rejectReason: this.rejectReason,
						charge: this.auditRow.charge,
						createTime: this.auditRow.createTime,
						ip: this.auditRow.ip,
						linkStatus: this.auditRow.linkStatus,
						mark: this.auditRow.mark,
						name: this.auditRow.name,
						phone: this.auditRow.phone,
						port: this.auditRow.port,
						schoolPlatform: this.auditRow.schoolPlatform,
						pageNum: this.auditRow.pageNum,
						pageSize: this.auditRow.pageSize,
						pages: this.auditRow.pages
					}
					this.$axios.post('/sys/SysSchool/audit', data).then(res => {
						if(res.code == 200){
							this.auditShow = false;
							this.$message(this.auditStatus == 1 ? '审核成功' : '驳回成功', 'success');
							this.getSchoolList();
						}
					});
				}
			},
			//删除
			deleteData(val){
				if(val){
					this.deleteShow = true;
					this.deleteRow = val;
				}else{
					this.$axios.post('/sys/SysSchool/delete', [this.deleteRow.id]).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message(res.message, 'success');
							this.totalS = this.totalS - 1;
							if (this.pageNum * 10 - this.totalS === 10) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.getSchoolList();
						}
					})
				}
			},
			//搜索
			search(){
				this.scrollTo0();
				this.pageNum = 1;
				this.getSchoolList();
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
				this.getSchoolList();
			}
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
// .operat-list{
// 	display: flex;
// 	justify-content: space-around;
// 	color: #B3B6BA;
// 	font-size: 14px;
// 	cursor: pointer;
// 	.active{
// 		color: #409EFF;
// 		overflow: hidden;
// 		white-space: nowrap;
// 		text-overflow: ellipsis
// 	}
// }
.disabled {
	color: #B3B6BA;
}
.dialog-item{
		p:first-child{
			width: 80px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
		}
	}
</style>
