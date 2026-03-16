<template>
	<div class="content-main-wrap second-parent-wrap">
		<p class="content-title">服务器管理</p>
		
		<div class="main-wrap">
			<div class="search-operat">
				<div></div>
				<div>
					<el-button class="width-1" icon="el-icon-plus" @click="add" v-if="permission.save">新增</el-button>
				</div>
			</div>
			
			<div class="data-table table-border">
				<el-table
					v-loading="loading"
					:data="tableData"
					style="width: 100%">
					<el-table-column
						align="center"
						label="名称">
						<template slot-scope="scope">
							<ul class="operat-list">
								<li @click="edit(scope.row)" class="active" :class="permission.getServiceInfo ? '' : 'disable'">{{scope.row.name}}</li>
							</ul>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="服务器角色">
						<template slot-scope="scope">
							{{scope.row.role | role}}
						</template>
					</el-table-column>
					<el-table-column
						prop="status"
						align="center"
						label="状态">
						<template slot-scope="scope">
							{{scope.row.status == 1 ? '开机' : '关机'}}
						</template>
					</el-table-column>
					<el-table-column
						prop="model"
						align="center"
						label="型号">
					</el-table-column>
					<el-table-column
						prop="ipAddress"
						align="center"
						label="IP地址">
					</el-table-column>
					<el-table-column
						prop="apiport"
						align="center"
						label="端口">
					</el-table-column>
					<el-table-column
						align="center"
						width="100px"
						label="操作">
						<template slot-scope="scope">
							<ul class="operat-list">
								<li @click="operate(0, scope.row)" v-if="permission.shutdown" :class="scope.row.status == 1 ? 'active' : ''">关机</li>
								<li @click="operate(1, scope.row)" v-if="permission.restart" :class="scope.row.status == 1 ? 'active' : ''">重启</li>
								<!-- <li @click="operate(2, scope.row)" style="color:#f56c6c" v-if="permission.delete" class="active">删除</li> -->
							</ul>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		
		<el-dialog
			title="新增服务器"
			:close-on-click-modal="false"
			:visible.sync="addShow"
			:before-close="handleCancel"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-title" v-if="errorInfo">提示：{{errorInfo}}</p>
				<div class="dialog-item">
					<p>名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model="addInfo.name"></el-input>
				</div>
				<div class="dialog-item">
					<p>IP地址</p>
					<p><em>*</em>：</p>
					<el-input class="width-3 w-number" v-model="addInfo.ipAddress"></el-input>
				</div>
				<div class="dialog-item">
					<p>端口</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.number="addInfo.apiport"></el-input>
				</div>
				<div class="dialog-item">
					<p>型号</p>
					<p style="margin-right: 5px"><em> </em>：</p>
					<el-input class="width-3" v-model="addInfo.model"></el-input>
				</div>
				<div class="dialog-item">
					<p>服务器角色</p>
					<p><em>*</em>：</p>
					<el-select v-model="addInfo.role" placeholder="请选择服务器角色" class="width-3">
						<el-option
							v-for="item in serverType"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" :loading="fullscreenLoading" @click="addConfirm">确 定</el-button>
					<el-button @click="handleCancel">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			:title="operateTitle"
			:close-on-click-modal="false"
			:visible.sync="operateShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
				<div class="dialog-item">
					<p>登录密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model="loginPwd" type="password" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="operate(10)">确 定</el-button>
					<el-button @click="operateShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<ServerEdit v-if="serverEditShow" :editInfo="editInfo"></ServerEdit>
	</div>
</template>

<script>
	import ServerEdit from './ServerEdit'
	import MD5 from 'js-md5';
	export default {
		name: '',
		data() {
			return {
				fullscreenLoading: false,
				permission: {},
				tableData: [{status: '获取中'}],
				errorInfo: '',
				// serverType: [{id: 1, name: '主'}, {id: 2, name: '客'}, {id:0, name: '从'}],
				serverType: [{id: 1, name: '主'}],
				addShow: false,
				addInfo: {},
				operateShow: false,
				operateTitle: '',
				operateRow: '',
				loginPwd: '',
				serverEditShow: false,
				editInfo: '',
				loading: false, // 表格加载
			}
		},
		components: {ServerEdit},
		mounted() {
			this.getServerList();
		},
		methods: {
			handleCancel() {
				this.addShow = false;
				this.fullscreenLoading = false;
				this.errorInfo = '';
			},
			//新增
			add(){
				this.addShow = true;
				this.addInfo = {};
			},
			//获取服务器列表
			getServerList(){
				this.loading = true; // 表格加载
				this.$axios.get('/sys/serverConfig/list').then(res => {
				this.loading = false; // 表格加载
					this.tableData = res.data.resData;
					this.permission = this.creatPermit(res.data.permit);
					// this.getServerStatus();
				}).catch(err => {
						this.fullscreenLoading = false;
						this.$message('网络出错', 'error');
					});
			},
			//获取服务器状态
			getServerStatus(){
				this.tableData.forEach((val, index) => {
					val.status = '获取中';
					this.$set(this.tableData, index, val);
					this.$axios.get('/sys/serverConfig/getServeOnLinerState', {
						ip: val.ipAddress,
						apiport: val.apiport,
					}).then(res => {
						if(res.code == 200){
							val.status = res.data.status == 1 ? '运行中' : '关机';
							val.class = res.data.status;
							this.$set(this.tableData, index, val);
						}
					}).catch(err => {
						this.fullscreenLoading = false;
						this.$message('网络出错', 'error');
					})
				})
			},
			//新增服务器确定
			addConfirm(){
				this.errorInfo = '';
				if(this.verify()){
					return
				};
				let haveMain = false;
				this.tableData.forEach(val => {
					if(val.role == 1){
						haveMain = true;//有主服务器
					}
				});
				if(haveMain){
					this.fullscreenLoading = true;
					this.$axios.get('/sys/terminal/getTerminalStatus', {
						ip: this.addInfo.ipAddress,
						port: 0,
						password: 'test',
						name: 'test',
						user: 'test',
					}).then(res => {
						if(res.code == 200){
							this.fullscreenLoading = false;
							if(res.data.status == 1){
								this.addServer();
							}else{
								this.$message('该IP不在线，无法新增', 'error');
							}
						}
					}).catch(err => {
						this.fullscreenLoading = false;
						this.$message('网络出错', 'error');
					})
				}else{
					this.addServer();
				}
			},
			//新增服务器
			addServer(){
				this.$axios.post('/sys/serverConfig/save', this.addInfo).then(res => {
					if(res.code == 200){
						this.addShow = false;
						this.$message(res.message, 'success');
						this.getServerList();
					}
				}).catch(err => {
						this.fullscreenLoading = false;
						this.$message('网络出错', 'error');
					});
			},
			//0关机 1重启 2删除 10确认操作
			operate(type, val){
				if((type == 0 || type == 1) && val.status != 1){
					return
				}
				if(type == 10){ //确认操作
					if(!this.loginPwd){
						return this.$message('请输入密码', 'error');
					}
					let urls = ['/sys/serverConfig/shutdown', '/sys/serverConfig/restart', '/sys/serverConfig/delete'];
					let data = {
						apiport: this.operateRow.row.apiport,
						ip: this.operateRow.row.ipAddress,
						id: this.operateRow.row.id,
						vodport: this.operateRow.row.vodport,
						liveport: this.operateRow.row.liveport,
						password: MD5(this.loginPwd),
						role: this.operateRow.row.role
					};
					this.$axios.post(urls[this.operateRow.type], data).then(res => {
						if(res.code == 200){
							this.$message(res.message, 'success');
							this.operateShow = false;
							setTimeout(() => {
								this.getServerList();
							}, 1000);
						}
					});
				}else{
					if(type == 2 && val.role == 1 && this.tableData.length > 1){//删除
						return this.$message('请先删除客/从服务器', 'error');
					};
					let typeList = ['关机', '重启', '删除'];
					this.operateTitle = typeList[type] + '确认';
					this.loginPwd = '';
					this.operateShow = true;
					this.operateRow = {
						row: val,
						type: type
					}
				}
			},
			//验证
			verify(){
				if(!this.addInfo.name){
					this.errorInfo = '服务器名称不能为空！';
					return true;
				}
				if(this.$verify.chLetterNum(this.addInfo.name, 20)){
					this.errorInfo = '服务器名称由中文大小写字母数字组成，最长20位！';
					return true;
				}
				// let reg = /^[0-9]*$/;
				// let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				// let reg = /^[\d\.]{0,15}$/;
				// if (!reg.test(this.addInfo.ipAddress)) {
				// 	this.errorInfo = '请输入数字';
				// 	return true;
				// }
				if(!this.addInfo.ipAddress){
					this.errorInfo = 'IP不能为空！';
					return true;
				}
				if(this.$verify.ip(this.addInfo.ipAddress)){
					this.errorInfo = 'IP格式不正确！';
					return true;
				}
				if(!this.addInfo.apiport && this.addInfo.apiport !== 0){
					this.errorInfo = '端口不能为空！';
					return true;
				}
				if(this.$verify.ports(this.addInfo.apiport) || Number.isInteger(Number(this.addInfo.apiport)) == false){
					this.errorInfo = '端口必须为整数！';
					return true;
				}
				if(this.addInfo.apiport >= 100000){
					this.errorInfo = '端口有误';
					return true;
				}
				if(this.addInfo.model && this.addInfo.model.length > 60){
					this.errorInfo = '型号长度不能超过60字符！';
					return true;
				}
				if(this.$verify.isEmpty(this.addInfo.role)){
					this.errorInfo = '请选择服务器角色！';
					return true;
				}
				return false
			},
			//编辑
			edit(val){
				if(this.permission.getServiceInfo){
					this.serverEditShow = true;
					this.editInfo = val;
				}else{
					this.$message("您没有当前操作的权限，请联系管理员", "error"); 
				}
			},
		},
		filters: {
			role(val){
				let arr =['从', '主', '客'];
				return arr[val];
			}
		}
	}
</script>
<style>
.w-number input::-webkit-outer-spin-button,
.w-number input::-webkit-inner-spin-button {
	-webkit-appearance: none !important;
	margin: 0;
}
</style>
<style lang="scss" type="text/scss" scoped>
	
	.operat-list{
		display: flex;
		justify-content: space-around;
		color: #B3B6BA;
		font-size: 14px;
		cursor: pointer;
		.active{
			color: #409EFF;
		}
	}
	.dialog-item{
		p:first-child{
			width: 75px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
		}
	}
</style>
