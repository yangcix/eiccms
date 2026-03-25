<template>
	<!-- <div id="terminalConfig"> -->
		<div class="content-main-wrap" id="terminalConfig">
			<p class="content-title">设备配置规则</p>
			<div class="main-wrap">
				<div class="search-operat">
					<div>
						<el-input v-model="searchKey" class="width-2" placeholder="请输入产品品牌或名称关键字进行查询" v-search="search" clearable></el-input>
						<el-button type="primary" class="search-btn" @click="search">查询</el-button>
					</div>
					
					<div>
						<el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save">新增</el-button>
					</div>
				</div>
				<div class="data-table table-border">
					<el-table
						:data="tableData"
						v-loading="loading"
						style="width: 100%">
						<el-table-column
							prop="id"
							align="center"
							label="编号">
						</el-table-column>
						<el-table-column
							align="center"
							prop="name"
							label="产品品牌+名称">
						</el-table-column>
						<el-table-column
							prop="model"
							align="center"
							min-width="95px"
							label="设备型号">
						</el-table-column>
						<el-table-column
							align="center"
							width="100px"
							label="操作">
							<template slot-scope="scope">
								<ul class="operat-list">
									<li @click="add(0,scope.row)" v-if="permission.update">编辑</li>
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
				
				<el-dialog
					:title="addEditType == 0 ? '编辑设备规则' : '新增设备规则'"
					:before-close="handleAddEditShow"
					:visible.sync="addEditShow"
					:close-on-click-modal="false"
					width="980px">
					<p class="err-title" v-if="errorInfo">提示：{{errorInfo}}</p>
					<div class="dialog-wrap">
						<div class="item-box">
							<div class="dialog-item">
								<p>设备名称</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="terminalName" placeholder="产品品牌+名称，比如艾课录播主机"></el-input>
							</div>
							
							<div class="dialog-item">
								<p>设备型号</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="model"></el-input>
							</div>

							<div class="dialog-item">
								<p>缓存时间</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="cacheTime" placeholder="互动缓存时间(ms)"></el-input>
							</div>

							<div class="dialog-item">
								<p>最大码率</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="maxBandwidth" placeholder="互动最大码率(kbps)"></el-input>
							</div>

							<div class="dialog-item">
								<p>最小码率</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="minBandwidth" placeholder="互动最小码率(kbps)"></el-input>
							</div>

							<div class="dialog-item">
								<p>最大帧率</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="maxFrameRate" placeholder="互动最大帧率"></el-input>
							</div>

							<div class="dialog-item">
								<p>最小帧率</p>
								<p><em>*</em>：</p>
								<el-input class="width-3" v-model.trim="minFrameRate" placeholder="互动最小帧率"></el-input>
							</div>

						
						</div>
						<div class="item-box">
							<div class="dialog-item">
								<p>导播信号</p>
								<p><em>*</em>：</p>
								<el-input class="width-4" v-model.trim="ruleDetailList[0].url" placeholder="rtsp://[user]:[password]@[ip]+/-n/Streaming/channels/101"></el-input>
							</div>

							<div class="dialog-item">
								<p>板书信号</p>
								<p><em style="opacity: 0;">*</em>：</p>
								<el-input class="width-4" v-model.trim="ruleDetailList[1].url" placeholder="rtsp://[user]:[password]@[ip]+/-n/Streaming/channels/102"></el-input>
							</div>

							<div class="dialog-item">
								<p>教师全景</p>
								<p><em style="opacity: 0;">*</em>：</p>
								<el-input class="width-4" v-model.trim="ruleDetailList[2].url" placeholder="rtsp://[user]:[password]@[ip]+/-n/Streaming/channels/103"></el-input>
							</div>

							<div class="dialog-item">
								<p>教师特写</p>
								<p><em style="opacity: 0;">*</em>：</p>
								<el-input class="width-4" v-model.trim="ruleDetailList[3].url" placeholder="rtsp://[user]:[password]@[ip]+/-n/Streaming/channels/104"></el-input>
							</div>

							<div class="dialog-item">
								<p>学生全景</p>
								<p><em style="opacity: 0;">*</em>：</p>
								<el-input class="width-4" v-model.trim="ruleDetailList[4].url" placeholder="rtsp://[user]:[password]@[ip]+/-n/Streaming/channels/105"></el-input>
							</div>

							<div class="dialog-item">
								<p>学生特写</p>
								<p><em style="opacity: 0;">*</em>：</p>
								<el-input class="width-4" v-model.trim="ruleDetailList[5].url" placeholder="rtsp://[user]:[password]@[ip]+/-n/Streaming/channels/106"></el-input>
							</div>
						</div>
						
						<div class="dialog-item" style="fontSize:12px;color:#a5aab5">
							配置规则：“[ip]”表示设备IP地址，“[user]”表示设备用户名，"[password]"表示设备密码
						</div>
						<div class="dialog-btn sub-btn">
							<el-button type="primary" @click="addEditConfirm">确 定</el-button>
							<el-button @click="handleAddEditShow">取 消</el-button>
						</div>
					</div>
				</el-dialog>
				
				<el-dialog
					title="系统提示"
					:close-on-click-modal="false"
					:visible.sync="deleteShow"
					width="420px">
					<div class="dialog-wrap">
						<p class="err-delete">您确定删除该设备规则？</p>
						<div class="dialog-btn">
							<el-button type="primary" @click="deleteData()">确 定</el-button>
							<el-button @click="deleteShow = false">取 消</el-button>
						</div>
					</div>
				</el-dialog>
			</div>
		</div>
	<!-- </div> -->
	
</template>

<script>
	import {creatTree} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				searchKey: '',
				tableData: [],
				pageNum: 1,
				permission: '',
				pages: 0,
				addEditShow: false,
				addEditType: 0,
				addEditInfo: {},
				terminalName:'',
				model:'',
				cacheTime:300,
				maxBandwidth:4096,
				minBandwidth:2048,
				maxFrameRate:60,
				minFrameRate:30,
				ruleDetailList:[
					{
						type:'director',
						url:''
					},
					{
						type:'blackboard',
						url:''
					},
					{
						type:'teacherPanoramic',
						url:''
					},
					{
						type:'teacherFeature',
						url:''
					},
					{
						type:'studentPanoramic',
						url:''
					},
					{
						type:'studentFeature',
						url:''
					},
				], // 信号
				errorInfo: '',
				// terminalTypeList: [{label: '手机', value: 0}, {label: '编码器', value: 1}, {label: '录播设备', value: 2}],
				deleteShow: false,
				deleteRow: '',
				currentIndex: 0,
				totalS: '',
				loading: false, // 表格加载
				updateId:'' // 编辑id
			}
		},
		components: {},
		mounted() {
			this.getTerminalList();
		},
		methods: {
			//获取规则列表
			getTerminalList(){
				let data = {
					type: 1,
					pageNum: this.pageNum,
					pageSize: 10,
					keyWord: this.searchKey,
				};
				this.loading = true;
				this.$axios.get('/sm/terminalRule/list', data).then(res => {
					this.tableData = res.data.pageList;
					this.loading = false;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
					this.totalS = res.data.total;
				});
			},

			//新增 编辑
			add(type, val){
				// debugger
				this.cacheTime = 300;
				this.maxBandwidth = 4096;
				this.minBandwidth = 2048;
				this.maxFrameRate = 60;
				this.minFrameRate = 30;
				this.addEditType = type;
				this.addEditShow = true;
				
				if(type == 0) {
					this.getRuleInfo(val);
					this.updateId = val.id;
				}
				
			},
			
			// 获取规则详情
			getRuleInfo(val){
				this.$axios.get(`/sm/terminalRule/info?id=${val.id}`).then(res => {
					this.terminalName = res.data.name;
					this.model = res.data.model;
					this.cacheTime = res.data.cacheTime;
					this.maxBandwidth = res.data.maxBandwidth;
					this.minBandwidth = res.data.minBandwidth;

					this.maxFrameRate = res.data.maxFrameRate;
					this.minFrameRate = res.data.minFrameRate;
					this.ruleDetailList = res.data.ruleDetailList
				});
			},

			// 确定提交
			addEditConfirm(){
				this.errorInfo = '';
				if(this.verify()){
					return
				};
				let formData = {
					name: this.terminalName,
					model: this.model,
					cacheTime: this.cacheTime,
					maxBandwidth: this.maxBandwidth,
					minBandwidth: this.minBandwidth,
					maxFrameRate: this.maxFrameRate,
					minFrameRate: this.minFrameRate,
					ruleDetailList: this.ruleDetailList
				}
				let url = '/sm/terminalRule/save';
				if(this.addEditType == 0){ //0编辑
					url = '/sm/terminalRule/update';
					formData.id = this.updateId
				};
				this.$axios.post(url, formData).then(res => {
					if(res.code == 200){
						this.addEditShow = false;
						this.ruleDetailList.forEach(item => {
							item.url = ''
						})
						this.terminalName = '',
						this.model = '',
						this.$message(this.addEditType == 0 ? '编辑成功' : '新增成功', 'success');
						this.getTerminalList();
					}
				})
			},
			
			handleAddEditShow() {
				this.addEditShow = false;
				this.ruleDetailList.forEach(item => {
							item.url = ''
						})
				this.terminalName = '';
				this.model = '';
				this.errorInfo = '';
			},
			//删除
			deleteData(val){
				if(val){
					this.deleteShow = true;
					this.deleteRow = val;
				}else{
					this.$axios.post(`/sm/terminalRule/delete`, {id:this.deleteRow.id}).then(res => {
						if(res.code == 200){
							this.deleteShow = false;
							this.$message('删除成功', 'success');
							this.totalS = this.totalS - 1;
							if (this.pageNum * 10 - this.totalS === 10) {
								this.pageNum = this.pageNum - 1 || 1
							}
							this.getTerminalList();
						}
					})
				}
			},
			//搜索
			search(){
				this.scrollTo0();
				this.pageNum = 1;
				this.getTerminalList();
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
				this.tableData = [];
				this.currentIndex = 0;
				this.pageNum = val;
				this.getTerminalList();
			},
			//验证
			verify(){
        if (this.$verify.isEmpty(this.terminalName)) {
          this.errorInfo = "设备名称不能为空";
          return true;
        }
				if(this.$verify.chLetterNum(this.terminalName, 50)){
					this.errorInfo = '设备名称由中文大小写字母数字组成，最长50位！';
					return true;
				}
				if(!this.model){
					this.errorInfo = '设备型号必填！';
					return true;
				};
				if(this.model && this.model.length > 20){
					this.errorInfo = '设备型号最长20位！';
					return true;
				};
				if(!this.cacheTime){
					this.errorInfo = '互动缓存时间必填！';
					return true;
				};
				if(this.$verify.numStr(this.cacheTime,0,10000001)){
					this.errorInfo = '互动缓存时间为正整数1-10000000！';
					return true;
				}
				if(!this.maxBandwidth){
					this.errorInfo = '最大码率必填！';
					return true;
				};
				if(this.$verify.numStr(this.maxBandwidth,0,5001)){
					this.errorInfo = '最大码率为正整数1-5000！';
					return true;
				}
				if(!this.minBandwidth){
					this.errorInfo = '最小码率必填！';
					return true;
				};
				if(this.$verify.numStr(this.minBandwidth,0,4097)){
					this.errorInfo = '最小码率为正整数1-4096！';
					return true;
				}
				console.log(typeof(this.minBandwidth),typeof(this.maxBandwidth),this.minBandwidth > this.maxBandwidth,'this.minBandwidth',Number(this.minBandwidth) > Number(this.maxBandwidth))
				if(Number(this.minBandwidth) > Number(this.maxBandwidth)){
					this.errorInfo = '最小码率不得大于最大码率！';
					return true;
				}
				if(!this.maxFrameRate){
					this.errorInfo = '最大帧率必填！';
					return true;
				};
				if(this.$verify.numStr(this.maxFrameRate,0,61)){
					this.errorInfo = '最大帧率为正整数，1-60！';
					return true;
				}
				if(!this.minFrameRate){
					this.errorInfo = '最小帧率必填！';
					return true;
				};
				if(this.$verify.numStr(this.minFrameRate,0,61)){
					this.errorInfo = '最小帧率为正整数，1-60！';
					return true;
				}
				if(Number(this.minFrameRate) > Number(this.maxFrameRate)){
					this.errorInfo = '最小帧率不得大于最大帧率！';
					return true;
				}
				if(!this.ruleDetailList[0].url || this.ruleDetailList[0].url.length > 100){
					this.errorInfo = '导播必填，rtsp地址限制100字符';
					return true;
				}
				if(this.ruleDetailList[1].url && this.ruleDetailList[1].url.length > 100){
					this.errorInfo = '选填，板书信号限制100字符';
					return true;
				}
				if(this.ruleDetailList[2].url && this.ruleDetailList[2].url.length > 100){
					this.errorInfo = '选填，教师全景限制100字符';
					return true;
				}
				if(this.ruleDetailList[3].url && this.ruleDetailList[3].url.length > 100){
					this.errorInfo = '选填，教师特写限制100字符';
					return true;
				}
				if(this.ruleDetailList[4].url && this.ruleDetailList[4].url.length > 100){
					this.errorInfo = '选填，学生全景限制100字符';
					return true;
				}
				if(this.ruleDetailList[5].url && this.ruleDetailList[5].url.length > 100){
					this.errorInfo = '选填，学生特写限制100字符';
					return true;
				}
				return false
			},
		},
		filters: {
			terminalType(val){
				let arr = ['手机', '编码器', '录播设备'];
				return arr[val];
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
.err-title {
	margin-bottom: 8px;
	text-align: center;
	color: #F64646;
  font-size: 12px;
}
.width-4{
	width: 380px;
}
#terminalConfig{
	.item-box {
		display: inline-block;
	}
	.item-box:first-child {
		margin-right: 70px;
	}

	.sub-btn {
		padding: 0 180px;
	}
}
</style>
