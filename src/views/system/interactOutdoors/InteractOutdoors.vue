<template>
	<div class="content-main-wrap second-parent-wrap">
		<p class="content-title">专递课堂管理</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div style="min-width: 730px">
					<el-input v-model="searchKey" class="width-2" placeholder="请输入主题名称关键字进行查询" v-search="search"></el-input>
					<span class="search-desc">主题状态：</span>
					<el-select v-model="searchThemeStatus" placeholder="请选择" class="width-4">
						<el-option
							v-for="item in searchThemeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<el-button type="primary" class="search-btn" @click="search">查询</el-button>
				</div>
				
				<div>
					<el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save && (version ==='1' || version ==='2')">新增</el-button>
				</div>
			</div>
			
			<div class="data-table table-border">
				<el-table
					v-loading="loading"
					:data="tableData"
					style="width: 100%">
					<el-table-column
						align="center"
						:show-overflow-tooltip="true"
						label="主题名称">
						<template slot-scope="scope">
							<ul class="operat-list">
								<li class="active" @click="detail(scope.row)">{{scope.row.name}}</li>
							</ul>
						</template>
					</el-table-column>
					<el-table-column
						prop="startTime"
						align="center"
						min-width="110"
						label="开始时间">
					</el-table-column>
					<el-table-column
						prop="endTime"
						align="center"
						min-width="110"
						label="结束时间">
					</el-table-column>

					<el-table-column
						prop="mainSchool"
						align="center"
						min-width="120"
						label="主讲学校">
					</el-table-column>
					<el-table-column
						prop="lecturer"
						align="center"
						label="主讲教师">
					</el-table-column>
					<el-table-column
						prop="interactionSchool"
						align="center"
						min-width="120"
						label="互动学校">
					</el-table-column>
					<el-table-column
						prop="createDate"
						align="center"
						width="110"
						:show-overflow-tooltip="true"
						label="创建时间">
					</el-table-column>


					<!-- <el-table-column
						prop="founder"
						align="center"
						label="创建者">
					</el-table-column> -->
					<el-table-column
						align="center"
						label="主题状态">
						<template slot-scope="scope">
							<p>{{scope.row.status | theme}}</p>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="直播状态">
						<template slot-scope="scope">
							<p>{{scope.row.playStatus | live}}</p>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						width="120px"
						label="操作">
						<template slot-scope="scope">
							<!-- (0待提交；1待审核；2待确认；3驳回；4已通过； 5未通过； 6已发布) 暂不使用 --> 
							<!-- (0待提交；1待审核；2已发布；3驳回；) 正在使用 --> 
							<div class="operat-box">
								<ul class="operat-list" v-if="scope.row.role === 1 && (version ==='1' || version ==='2')">
									<li @click="add(0, scope.row)" v-if="permission.save"  :class="scope.row.status == 0 || scope.row.status == 3 || scope.row.status == 5 ? 'active' : ''">编辑</li>
									<li @click="submit(0, scope.row)" v-if="permission.submit" :class="scope.row.status == 0 || scope.row.status == 3 ? 'active' : ''">送审</li>
									<li @click="deleteData(0, scope.row)" style="color:#f56c6c" v-if="permission.delete" class="active">删除</li>
								</ul>
								<ul class="operat-list" v-else-if="scope.row.role === 0 && (version ==='1' || version ==='2')">
									<li  v-if="permission.audit" :class="scope.row.status == 2 ? '' : ''">确认</li>
									<li @click="deleteData(0, scope.row)" style="color:#f56c6c" v-if="permission.delete" class="active">删除</li>
								</ul>
								<ul class="operat-list" v-else-if="version === '3'">
									<li @click="audit(0, scope.row)" v-if="permission.audit" :class="scope.row.status == 1 ? 'active' : ''">审核</li>
									<li @click="deleteData(0, scope.row)" style="color:#f56c6c" v-if="permission.delete" class="active">删除</li>
								</ul>
							</div>
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
			:visible.sync="submitShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">送审后无法修改该主题，确认送审？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="submit(1)">确 定</el-button>
					<el-button @click="submitShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<!-- <el-dialog
			title="发布主题"
			:close-on-click-modal="false"
			:visible.sync="releaseShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认发布该主题？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="release(1)">确 定</el-button>
					<el-button @click="releaseShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog> -->
		
		<el-dialog
			title="删除主题"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该主题？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="deleteData(1)">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="主题审核"
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
				<div class="dialog-item" v-if="auditStatus == 3">
					<p>驳回理由</p>
					<p style="margin-right: 5px"><em></em>：</p>
					<el-input type="textarea" :rows="3" class="width-5" v-model="rejectReason" maxlength="20"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="audit(1)">确 定</el-button>
					<el-button @click="auditShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {getNowDate} from "../../../assets/js/utils";
	// import {createWebSocket} from "../../../assets/js/interactWebsock";
	// import interactWs from "@/components/interactWs.vue";
	export default {
		// mixins: [interactWs],
		name: '',
		data() {
			return {
				vtype:1,
				searchKey: '',
				tableData: [],
				pageNum: 1,
				permission: '', // 许可操作
				pages: 0,
				submitShow: false,
				submitRow: '',
				auditList: [{id: 2, value: '通过'}, {id: 3, value: '不通过'}],
				auditStatus: 2,
				rejectReason: '', // 审核 驳回理由
				auditShow: false,
				auditRow: '',
				releaseShow: false,
				releaseRow: '',
				deleteShow: false,
				deleteRow: '',
				totalS: '',

				// confirmShow: false, // 确认 互播弹窗key 
				// confirmStatus: 2,  // 确认 状态 2：通过，3：不通过
				// confirmRejectReason: '', // 确认 驳回理由
				searchThemeList: [{value: '', label: '全部'}, {value: 0, label: '待提交'},{value: 1, label: '待审核'},
					{value: 2, label: '已发布'},{value: 3, label: '驳回'}], // 查询主题状态数组
				searchThemeStatus: '', // 查询主题状态
				loading: false, // 表格加载
			}
		},
		components: {},
		watch: {
			$route(to, from) {
				if(from.path == '/sys/crossSchoolInteractionDetail') {
					this.getThemeList();
				}else if(from.path !== '/sys/crossSchoolInteraction'){
					this.pageNum = 1;
					this.getThemeList();
				}
			},
		},
		mounted() {
			this.getThemeList();
			// this.createWebSocket(); // 建立websoket链接
		},
		computed:{
			version () {
				return localStorage.getItem('version') // 当前版本 1:标准版，2:专业版，3：旗舰版
			}
		},
		methods: {
			//获取主题列表
			getThemeList(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					status: this.searchThemeStatus,
					keyWord: this.searchKey,
				};
				this.$axios.get('/sys/crossSchoolInteraction/list', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
			},
			//搜索
			search(){
				this.scrollTo0();
				this.pageNum = 1;
				this.getThemeList();
			},
			//送审 0送审 1送审确定
			submit(type, val){
				if(type == 0){
					if(val.status != 0 && val.status != 3){
						return;
					}
					if(this.judgeEndTime(val.endTime)){
						return
					};
					this.submitRow = val;
					this.submitShow = true;
				}else{
					this.$axios.post(`/sys/crossSchoolInteraction/submit?id=${this.submitRow.id}`).then(res => {
						if(res.code == 200){
							this.submitShow = false;
							this.$message('送审成功', 'success');
							this.getThemeList();
						}
					});
				}
			},
			// //发布 0发布 1发布确定
			// release(type, val){
			// 	if(type == 0){
			// 		if(val.status != 2){
			// 			return;
			// 		}
			// 		if(this.judgeEndTime(val.endTime)){
			// 			return
			// 		};
			// 		this.releaseRow = val;
			// 		this.releaseShow = true;
			// 	}else{
			// 		this.$axios.post('/sm/interactive/release', {id: this.releaseRow.id, endTime: this.releaseRow.endTime}).then(res => {
			// 			if(res.code == 200){
			// 				this.releaseShow = false;
			// 				this.$message('发布成功', 'success');
			// 				this.getThemeList();
			// 			}
			// 		});
			// 	}
			// },
			//删除 0删除 1删除确定
			deleteData(type, val){
				if(type == 0){
					this.deleteRow = val;
					this.deleteShow = true;
				}else{
					this.$axios.post('/sys/crossSchoolInteraction/delete', [this.deleteRow.id]).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message('删除成功', 'success');
							this.totalS = this.totalS - 1;
							if (this.pageNum * 10 - this.totalS === 10) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.getThemeList();
						}
					});
				}
			},
			// //确认 0弹窗 1确定确认
			// confirm(type, val){
			// 	if(type == 0){
			// 		// if(val.status != 1){
			// 		// 	return;
			// 		// }
			// 		if(this.judgeEndTime(val.endTime)){
			// 			return
			// 		};
			// 		this.confirmRow = val;
			// 		this.confirmShow = true;
			// 	}else{
			// 		let data = {
			// 			status: this.confirmStatus,
			// 			id: this.confirmRow.id,
			// 			confirmRejectReason: this.confirmRejectReason,
			// 		}
			// 		this.$axios.post('/sm/interactive/audit', data).then(res => {
			// 			if(res.code == 200){
			// 				this.confirmShow = false;
			// 				this.$message(this.confirmStatus == 2 ? '审核成功' : '驳回成功', 'success');
			// 				this.getThemeList();
			// 			}
			// 		});
			// 	}
			// },
			//审核 0审核 1审核确定
			audit(type, val){
				if(type == 0){
					if(val.status != 1){
						return;
					}
					if(this.judgeEndTime(val.endTime)){
						return
					};
					this.auditStatus = 2
					this.rejectReason = ''
					this.auditRow = val;
					this.auditShow = true;
				}else{
					if(this.rejectReason && this.$verify.chLetterNum(this.rejectReason,20)){
						this.$message('驳回理由【只限中文、数字、大小写字母输入】','error')
						return
					}
					let data = {
						status: this.auditStatus,
						id: this.auditRow.id,
						rejectReason: this.rejectReason,
					}
					this.$axios.post('/sys/crossSchoolInteraction/audit', data).then(res => {
						if(res.code == 200){
							this.auditShow = false;
							this.$message(this.auditStatus == 2 ? '审核成功' : '驳回成功', 'success');
							this.getThemeList();
						}
					});
				}
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
				this.getThemeList();
			},
			//新增编辑 0编辑 1新增
			add(type, val){
				if(type == 0){
					if(val.status == 0 || val.status == 3 || val.status == 5){
						this.$router.push({path: '/sys/crossSchoolInteractionAddEdit', query: {themeid: val.id}});
					}
				}else{
					this.$router.push('/sys/crossSchoolInteractionAddEdit');
				}
			},
			//详情
			detail(val){
				this.$router.push({path: '/sys/crossSchoolInteractionDetail', query: {themeid: val.id}});
			},
			//送审 审核 发布判断过期时间
			judgeEndTime(time){
				if(getNowDate() > time){
					this.$message('该主题已过结束时间，无法操作', 'error');
					return true;
				}
				return false;
			}
		},
		filters: {
			theme(val){
				// (0待提交；1待审核；2待确认；3驳回；4已通过； 5未通过； 6已发布)  暂不使用
				// (0待提交；1待审核；2已发布；3驳回；) 正在使用
				let arr = ['待提交','待审核', '已发布','驳回'];
				return arr[val];
			},
			live(val){
				let arr = ['授课中', '已结束', '预告中'];
				if(val == -1){
					return '-';
				}
				return arr[val];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.operat-list{
		display: flex;
		justify-content: space-around;
		color: #B3B6BA;
		font-size: 14px;
		cursor: pointer;
		.active{
			color: #409EFF;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis
		}
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
