<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" content="公网点播进度"></el-page-header></p>
		<video id="ifVideo" style="border:solid 1px red; width:300px;height:300px;display:none"></video>
		<div class="content-wrap">

			<div class="search-operat">
				<div>
					<span style="display: inline-block;margin-right: 35px;font-size: 14px;">状态:</span>
					<el-select v-model="status" placeholder="请选择状态" @change="getManageList(true)">
						<el-option
							v-for="item in stateOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							>
						</el-option>
					</el-select>
					<!-- <el-input v-model="searchKey" class="width-2" placeholder="请输入名称关键字进行查询"></el-input>
					<el-button type="primary" class="search-btn" @click="search">查询</el-button> -->
				</div>
			</div>
			<div class="data-table table-border">
				<el-table
					:row-style="{ height: '48px' }"
					:cell-style="{ padding: '4px 0' }"
					v-loading="loading"
					:data="tableData"
					style="width: 100%">
					<el-table-column
						prop="name"
						align="center"
						:show-overflow-tooltip="true"
						label="视频名称">
					</el-table-column>
					<el-table-column
						prop="operTime"
						align="center"
						min-width="110"
						label="操作时间">
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
						min-width="160px"
						label="操作">
						<template slot-scope="scope">
							<el-button type="text" :disabled="scope.row.status != 0" @click="openCancelUpload(scope.row)">取消</el-button>
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
			<el-dialog
			title="取消上传"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认取消上传该视频？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="cancelUpload()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		</div>
	</div>
</template>

<script>
	import { Message} from 'element-ui';
	import {creatTree, baseUrl, getNowDate, storage} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				deleteShow: false,
				row: '',
				cancelPublicShow:false, 
				searchKey: '',
				tableData: [],
				pageNum: 1,
				pages: 0,
				totalS: '',
				permission:'',
				id:'', // 视频id
				stateOptions: [
					{
          value: '',
          label: '全部'
        },{
          value: 0,
          label: '进行中'
        }, {
          value: 1,
          label: '已完成',
          disabled: true
        }, {
          value: 2,
          label: '已取消'
        }],
				status: '', // 过滤状态
				loading: false, // 表格加载
			}
		},
		components: {},
		mounted() {
			this.getManageList()
		},
		methods: {
			//获取列表
			getManageList(changeState){
				this.loading = true; // 表格加载
				let data = {
					pageNum: changeState ? 1 : this.pageNum,
					pageSize: 9,
					status: this.status
					// keyWord: this.searchKey,
				};
				this.$axios.get('/sm/file/publicVodList', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					// this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
			},
			openCancelUpload(row) {
				this.row = row;
				this.deleteShow = true;
			},
			// 取消上传
			cancelUpload() {
				this.$axios.post('/sm/file/cancelPublicVod', { fileId: this.row.fileId }).then(res => {
					if (res.code === 200) {
						this.deleteShow = false;
						this.$message('取消成功', 'success');
						this.getManageList();
					}
				})
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
			//搜索
			search(){
				this.scrollTo0();
				this.pageNum = 1;
				this.getManageList();
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
				this.getManageList();
			},
		},
		filters: {
			status(val){
				let arr = ['进行中','已完成', '已取消'];
				return arr[val];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
.content-wrap{
	height: 640px;
	overflow: auto;
	padding: 50px 50px 36px 50px;
}
</style>
<style>
</style>
