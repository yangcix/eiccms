<template>
	<div class="second-box">
		<p class="content-title"><el-page-header @back="goBack" content="服务器详情页"></el-page-header></p>
		
		<div class="scroll-wrap">
			<div class="menu-wrap">
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
					<el-menu-item index="0" class="menu-item">基础信息</el-menu-item>
					<el-menu-item index="1">网络信息</el-menu-item>
					<el-menu-item index="2">本地存储</el-menu-item>
					<el-menu-item index="3">网络存储</el-menu-item>
					<el-menu-item index="4">存储配置</el-menu-item>
				</el-menu>
				<div class="line"></div>
			</div>
			
			<div class="server-item" v-if="activeIndex == 0">
				<div class="dialog-item">
					<p>名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-2 " :class="errIndex == 0 ? 'err-border' : ''" v-model="detailInfo.name"></el-input>
					<p class="err-info" v-show="errIndex == 0">名称由中文大小写字母数字组成，最长20位！</p>
				</div>
				<div class="dialog-item">
					<p>域名</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :disabled="true"  v-model="detailInfo.ip"></el-input>
				</div>
				<div class="dialog-item">
					<p>直播端口</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :disabled="true" v-model="detailInfo.liveport"></el-input>
				</div>
				<div class="dialog-item">
					<p>点播端口</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :disabled="true" v-model="detailInfo.vodport"></el-input>
				</div>
				<div class="dialog-item">
					<p>API端口</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :disabled="true" v-model="detailInfo.apiport"></el-input>
				</div>
				<!-- <div class="dialog-item">
					<p>日志级别</p>
					<p><em>*</em>：</p>
					<el-select  v-model="detailInfo.loglevel" placeholder="请选择" class="width-2">
						<el-option
							v-for="item in logLevel"
							:key="item"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-item">
					<p>日志方式</p>
					<p><em>*</em>：</p>
					<el-select  v-model="detailInfo.logtype" placeholder="请选择" class="width-2">
						<el-option
							v-for="item in logModel"
							:key="item"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-item">
					<p>服务器权值</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :class="errIndex == 1 ? 'err-border' : ''"  v-model="detailInfo.money"></el-input>
					<p class="err-info" v-show="errIndex == 1">权值为1-100！</p>
				</div> -->
				<div class="dialog-item">
					<p>服务器版本号</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :disabled="true" v-model="detailInfo.mod_version"></el-input>
				</div>
				
				<el-button type="primary" class="server-btn" @click="baseEdit">修改</el-button>
			</div>
			
			<div class="server-item" v-if="activeIndex == 1">
				<p class="type-title">TCP/IP信息</p>
				<div class="dialog-item">
					<p>网卡</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" :disabled="true" v-model="netConfig.dev"></el-input>
				</div>
				<div class="dialog-item">
					<p>IP地址</p>
					<p><em>*</em>：</p>
					<el-input class="width-2 " :class="errIndex == 2 ? 'err-border' : ''" v-model="netConfig.changeIp"></el-input>
					<p class="err-info" v-show="errIndex == 2">格式不正确！</p>
				</div>
				<div class="dialog-item">
					<p>子网掩码</p>
					<p><em>*</em>：</p>
					<el-input class="width-2 " :class="errIndex == 3 ? 'err-border' : ''" v-model="netConfig.mask"></el-input>
					<p class="err-info" v-show="errIndex == 3">格式不正确！</p>
				</div>
				<div class="dialog-item">
					<p>网关</p>
					<p><em>*</em>： </p>
					<el-input class="width-2 " :class="errIndex == 5 ? 'err-border' : ''" v-model="netConfig.gw"></el-input>
					<p class="err-info" v-show="errIndex == 5">格式不正确！</p>
				</div>
				
				<p class="type-title">DNS信息</p>
				<div class="dialog-item">
					<p>D&nbsp;N&nbsp;S&nbsp;1</p>
					<p><em>*</em>：</p>
					<el-input class="width-2 " :class="errIndex == 4 ? 'err-border' : ''" v-model="netConfig.dns1"></el-input>
					<p class="err-info" v-show="errIndex == 4">格式不正确！</p>
				</div>
				<!-- <div class="dialog-item">
					<p>D&nbsp;N&nbsp;S&nbsp;2</p>
					<p style="margin-right: 5px">： </p>
					<el-input class="width-2 " v-model="netConfig.dns2"></el-input>
					<p class="err-info" v-show="errIndex == 6">格式不正确！</p>
				</div> -->
				<el-button type="primary" class="server-btn" @click="netConfigEdit">修改</el-button>
			</div>
			
			<div class="main-wrap" v-show="activeIndex == 2">
				<div class="data-table table-border">
					<el-table
						:data="disk"
						style="width: 100%">
						<el-table-column
							prop="name"
							align="center"
							label="硬盘名称">
						</el-table-column>
						<el-table-column
							prop="capacity"
							align="center"
							label="容量(G)">
						</el-table-column>
						<el-table-column
							prop="free"
							align="center"
							label="剩余容量(G)">
						</el-table-column>
						<el-table-column
							prop="status"
							align="center"
							label="存储状态">
						</el-table-column>
						<!-- <el-table-column
							align="center"
							label="是否为主盘">
							<template slot-scope="scope">
								{{scope.row.choose == 0 ? '是' : '否'}}
							</template>
						</el-table-column> -->
						<!-- <el-table-column
							align="center"
							width="140px"
							label="操作">
							<template slot-scope="scope">
								<ul class="operat-list">
									<li @click="localOperate(scope.row, 0)" :style="{color: scope.row.choose == 0 ? '#B3B6BA' : ''}">设为主盘</li>
									<li @click="localOperate(scope.row, 1)">格式化</li>
								</ul>
							</template>
						</el-table-column> -->
					</el-table>
				</div>
			</div>
			
			<div class="main-wrap" v-show="activeIndex == 3">
				<div class="search-operat">
					<div></div>
					<div>
						<el-button class="width-1" icon="el-icon-plus" @click="mount(0)">挂载</el-button>
					</div>
				</div>
				
				<div class="data-table table-border">
					<el-table
						:data="netDisk"
						style="width: 100%">
						<el-table-column
							prop="name"
							align="center"
							label="硬盘名称">
						</el-table-column>
						<el-table-column
							prop="ip"
							align="center"
							label="地址">
						</el-table-column>
						<el-table-column
							prop="capacity"
							align="center"
							label="容量(G)">
						</el-table-column>
						<el-table-column
							prop="free"
							align="center"
							label="剩余容量(G)">
						</el-table-column>
						<el-table-column
							prop="serial"
							align="center"
							label="存储序列号">
						</el-table-column>
						<el-table-column
							align="center"
							label="类型">
							<template slot-scope="scope">
								{{ scope.row.type | mountType}}
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							label="状态">
							<template slot-scope="scope">
								{{ scope.row.statusLive == true ? scope.row.status : '离线' }}
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							label="优先级">
							<template slot-scope="scope">
								{{ scope.row.priority | priority }}
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							min-width="60px"
							label="操作">
							<template slot-scope="scope">
								<ul class="operat-list">
									<!-- <li @click="mountOperate(0, scope.row)" :style="{color: scope.row.choose == 0 ? '#B3B6BA' : ''}">设为主盘</li> -->
									<!-- <li v-if="scope.row.statusLive" @click="mountOperate(1, scope.row)">格式化</li> -->
									<li v-if="scope.row.statusLive" @click="mountOperate(2, scope.row)">卸载</li>
									<li v-else @click="mountOperate(3, scope.row)">强制删除</li>
								</ul>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="server-item" v-if="activeIndex == 4">
				<div class="dialog-item">
					<p style="margin-right: 50px;width: 120px;">优先网络存储：</p>
					<el-radio-group v-model="radioss">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="2">否</el-radio>
					</el-radio-group>
				</div>
				<div class="dialog-item">
					<p style="margin-right: 50px;width: 120px;">文件覆盖：</p>
					<el-radio-group v-model="radio">
						<el-radio :label="1">自动覆盖</el-radio>
						<el-radio :label="2">不自动覆盖，仅提示</el-radio>
					</el-radio-group>
					<span style="margin-left: 30px;cursor: pointer;color: #409EFF;font-size: 10px;" @click="openRule">? 覆盖规则</span>
				</div>
				<div class="dialog-item" v-show="radio == 1">
					<p style="margin-right: 50px;width: 120px;">覆盖区域：</p>
					<el-checkbox-group v-model="radios">
						<el-checkbox :label="1">直播相关文件</el-checkbox>
						<el-checkbox :label="2">视频相关文件</el-checkbox>
						<el-checkbox :label="3">智能录播相关文件</el-checkbox>
					</el-checkbox-group>
				</div>
				<div class="dialog-item">
					<p style="margin-right: 50px;width: 120px;">预留存储值：</p>
					<el-input class="width-2" v-model="radioInput"></el-input>
					<p style="margin-left: 30px;font-size: 12px;color: #B3B6BA;">系统内各盘预留存储值，单位G</p>
				</div>
				<div>
					<el-button type="primary" style="margin-left: 170px;" @click="setRule()">提交</el-button>
				</div>
			</div>
		</div>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:modal-append-to-body='false'
			:visible.sync="localOperateShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
				<div class="dialog-item">
					<p>登录密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.trim="loginPwd" type="password"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="localOperate()">确 定</el-button>
					<el-button @click="localOperateShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:modal-append-to-body='false'
			:visible.sync="netConfigShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">请确认网络信息配置，错误配置会导致系统崩溃，敏感操作前须先验证身份！</p>
				<div class="dialog-item">
					<p>登录密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.trim="loginPwd" type="password"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="netConfigOperate()">确 定</el-button>
					<el-button @click="cancelNetConfig()">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="存储异常提示"
			:close-on-click-modal="false"
			:modal-append-to-body='false'
			:visible.sync="showDialog"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete" style="text-align: center;">存储空间不足，请进行处理！</p>
			</div>
		</el-dialog>

		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:modal-append-to-body='false'
			:visible.sync="mountPwdShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
				<div class="dialog-item">
					<p>登录密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.trim="loginPwd" type="password" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="mountOperate()">确 定</el-button>
					<el-button @click="mountPwdShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="挂载存储"
			:close-on-click-modal="false"
			:modal-append-to-body='false'
			:visible.sync="mountShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-title" v-if="errorInfo">提示：{{errorInfo}}</p>
				<div class="dialog-item">
					<p>名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.trim="mountInfo.name"></el-input>
				</div>
				<div class="dialog-item">
					<p>IP地址</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.trim="mountInfo.ip"></el-input>
				</div>
				<div class="dialog-item">
					<p>端口</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model.trim="mountInfo.port"></el-input>
				</div>
				<div class="dialog-item">
					<p>类型</p>
					<p><em>*</em>：</p>
					<el-select v-model="mountInfo.type" class="width-3">
						<el-option
							v-for="item in mountType"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-item">
					<p>优先级</p>
					<p><em>*</em>：</p>
					<el-select v-model="mountInfo.priority" class="width-3">
						<el-option
							v-for="item in priorityType"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="dialog-item">
					<p>存储序列号</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model="mountInfo.serial"></el-input>
				</div>
				<div class="dialog-item">
					<p>用户名</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model="mountInfo.user"></el-input>
				</div>
				<div class="dialog-item">
					<p>密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-3" v-model="mountInfo.password" type="password"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="mount(1)">确 定</el-button>
					<el-button @click="mountShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import MD5 from 'js-md5';
	export default {
		name: '',
		props: ['editInfo'],
		data() {
			return {
				showDialog: false,
				radio: 1,
				radios: [3],
				radioss: 2,
				radioInput: 100,
				activeIndex: '0',
				errIndex: 100,
				list: [],
				netDisk: [],
				detailInfo: {},
				oldDetailInfo: {},
				disk: [],
				netConfig: {},
				logLevel: ['all', 'trace', 'debug', 'info', 'warn', 'error', 'fatal', 'off'],
				logModel: ['console', 'file'],
				netConfigShow: false,
				localOperateShow: false,
				localOperateInfo: '',
				loginPwd: '',
				mountShow: false,
				mountPwdShow: false,
				mountInfo: {type: 0,priority: 1,},
				mountType: [{name: '虚拟存储', id: 0}, {name: 'nas', id: 1}, {name: 'san', id: 2}],
				priorityType: [
					{
						name: 'P1',
						id: 1
					},
					{
						name: 'P2',
						id: 2
					},
					{
						name: 'P3',
						id: 3
					},
					{
						name: 'P4',
						id: 4
					},
					{
						name: 'P5',
						id: 5
					},
				],
				errorInfo: '',
				type: ''
			}
		},
		components: {},
		mounted() {
			this.getRule();
			this.getDetailInfo();
		},
		methods: {
			openRule() {
				this.$alert('系统每天0点会进行存储检测，若检测到某个盘存储剩余量小于预留存储值，则将该盘内最早N天存储数据中全部覆盖区域内的数据进行删除，直至该盘存储剩余量大于预留存储值。', '文件自动覆盖规则', {
          confirmButtonText: '确定',
				})
			},
			getRule() {
				this.$axios.get('/sys/system/coverInfo ').then(res => {
					if (res.code === 200) {
						this.radio = res.data.coverType;
						this.radios = res.data.coverArea;
						this.radioss = res.data.priorityNet;
						this.radioInput = res.data.reserveArea;
					}
				});
			},
			setRule() {
				if (this.radio == 1) {
					if (this.radios.length == 0) {
						this.$message('请选择覆盖区域！', 'error');
						return;
					}
				}
				if(this.radioInput == '') {
					this.$message('预留存储值必填', 'error');
					return;
				}
				if(this.radioInput < 100 || this.radioInput > 1024 || Number.isInteger(Number(this.radioInput)) == false) {
					this.$message('预留存储值为100-1024内的正整数', 'error');
					return;
				}
				let data = new FormData();
				data.append('coverType', this.radio);
				data.append('coverArea', this.radios);
				data.append('priorityNet', this.radioss);
				data.append('reserveArea', parseInt(this.radioInput));
				this.$axios.post('/sys/system/updateCoverInfo', data).then(res => {
					if (res.code === 200) {
						this.$message('提交成功', 'success');
						this.getRule();
					}
				});
			},
			//返回
			goBack(){
				this.$parent.getServerList();
				this.$parent.serverEditShow = false;
			},
			//菜单切换
			handleSelect(index){
				this.activeIndex = index;
				if(this.activeIndex == 3){
					this.getnetDisk()
				}
			},
			getnetDisk(){
				this.$axios.get('/sys/serverConfig/getNetDiskServiceInfo').then(res => {
					this.netDisk = res.data;
				})
			},
			//获取详情
			getDetailInfo(){
				this.$axios.get('/sys/serverConfig/getServiceInfo', {
					ip: this.editInfo.ipAddress,
					apiport: this.editInfo.apiport
				}).then(res => {
					//后台无法携带这些信息，并且需前端保存之前信息
					res.data.serviceConfig.name = this.editInfo.name;
					this.detailInfo = res.data.serviceConfig;
					this.oldDetailInfo = {
						money: this.detailInfo.money,
						logtype: this.detailInfo.logtype,
						loglevel: this.detailInfo.loglevel,
					};
					res.data.netConfig.changeIp = res.data.netConfig.ip;
					res.data.netConfig.apiport = res.data.serviceConfig.apiport;
					this.netConfig = res.data.netConfig;
					this.disk = res.data.disk;
					// this.netDisk = res.data.netDisk;
					this.getnetDisk()
					for(let i in this.disk){
						if(this.disk[i].free < this.radioInput){
							// this.showDialog = true;
							return;
						};
					};
				});
			},
			//基础信息修改
			baseEdit(){
				this.errIndex = 100;
				if(this.$verify.chLetterNum(this.detailInfo.name, 20)){
					this.errIndex = 0;//名称
					return;
				}
				if(this.$verify.numStr(this.detailInfo.money, 0, 101)){
					this.errIndex = 1;//权值
					return;
				}
				this.detailInfo.id = this.editInfo.id;
				let haveUpdate = false;
				for(let key in this.oldDetailInfo){
					if(this.oldDetailInfo[key] != this.detailInfo[key]){
						haveUpdate = true;
					};
				};
				this.$axios.post('/sys/serverConfig/updateBaseSetting', this.detailInfo).then(res => {
					if(res.code == 200){
						let str = haveUpdate ? '修改成功，重启后生效' : '修改成功';
						this.$message(str, 'success');
					}else {
						this.getDetailInfo(); //修改失败恢复原值
					}
				});
			},
			//网络信息修改
			netConfigEdit(){
				this.errIndex = 100;
				if(this.$verify.ip(this.netConfig.changeIp)){
					this.errIndex = 2;//ip
					return;
				}
				if(this.$verify.ip(this.netConfig.mask) || this.netConfig.mask.split('.')[3] == 255){
					this.errIndex = 3;//子掩网码
					return;
				}
				if(this.$verify.ip(this.netConfig.gw)){
					this.errIndex = 5;//网关
					return;
				}
				if(this.$verify.ip(this.netConfig.dns1)){
					this.errIndex = 4;//dns1
					return;
				};
				if(this.netConfig.dns2 && this.$verify.ip(this.netConfig.dns2)){
					this.errIndex = 6;//dns2
					return;
				};
				this.netConfig.id = this.editInfo.id;
				this.netConfigShow = true;
				this.loginPwd = '';
			},
			//网络信息修改确定
			netConfigOperate(){
				if(this.$verify.isEmpty(this.loginPwd)){
					return this.$message('请输入登录密码', 'error');
				}
				this.netConfig.password = MD5(this.loginPwd);
				this.netConfig.id = this.editInfo.id;
				this.$axios.post('/sys/serverConfig/setNetWork', this.netConfig).then(res => {
					if(res.code == 200){
						this.netConfigShow = false;
						this.$message('修改成功，即将重启，请访问配置的新地址', 'success', 70, 10000);
					}else {
						this.getDetailInfo(); //修改失败恢复原值
					}
				});
			},
			cancelNetConfig(){
				this.getDetailInfo(); //取消恢复原值
				this.netConfigShow = false;
			},
			//设为主盘 格式化
			localOperate(val, type){
				if(type == 0 && val.choose == 0){
					return
				}
				if(val){
					this.loginPwd = '';
					this.localOperateShow = true;
					this.localOperateInfo = val;
					this.localOperateInfo.type = type;
				}else{
					if(!this.loginPwd){
						return this.$message('请输入密码', 'error');
					}
					//0设为主盘  1格式化
					let urlArr = ['/sys/serverConfig/enable', '/sys/serverConfig/format']
					this.$axios.post(urlArr[this.localOperateInfo.type], {
						apiport: this.detailInfo.apiport,
						choose: this.localOperateInfo.mount,
						mount: this.localOperateInfo.mount,
						name: this.localOperateInfo.name,
						ip: this.detailInfo.ip,
						ipAddress: this.detailInfo.ip,
						password: MD5(this.loginPwd)
					}).then(res => {
						if(res.code == 200){
							this.$message(res.message, 'success');
							this.localOperateShow = false;
							if(this.localOperateInfo.type == 0){
								this.getDetailInfo();
							};
						}
					})
				};
			},
			//网络存储挂载
			mount(type){
				this.errorInfo = '';
				if(type == 1){ //1挂载确定
					if (this.$verify.isEmpty(this.mountInfo.name)) {
						this.errorInfo = '请输入名称！';
						return true;
					}
					if(this.mountInfo.name.length > 20){
						this.errorInfo = '名称长度限制20字符内！';
						return;
					}
					if (this.$verify.isEmpty(this.mountInfo.ip)) {
						this.errorInfo = '请输入ip地址！';
						return true;
					}
					if(this.$verify.ip(this.mountInfo.ip)){
						this.errorInfo = 'IP格式不正确！';
						return;
					}
					if(this.mountInfo.port == ''){
						this.errorInfo = '请输入端口！';
						return true;
					}
					console.log('this.$verify.isPositiveInteger(this.mountInfo.port)',this.$verify.isPositiveInteger(this.mountInfo.port))
					if(this.$verify.port(this.mountInfo.port) || this.$verify.isPositiveInteger(this.mountInfo.port) == false){
						this.errorInfo = '端口范围为1-65535整数';
						return true;
					}
					if (this.$verify.isEmpty(this.mountInfo.serial)) {
						this.errorInfo = '请输入存储序列号！';
						return true;
					}
					if(this.$verify.letterNum(this.mountInfo.serial, 5) || this.mountInfo.serial.length != 5){
						this.errorInfo = '存储序列号须为5位大小写字母或数字组成！';
						return;
					}
					if(this.$verify.isEmpty(this.mountInfo.user)){
						this.errorInfo = '请输入用户名！';
						return true;
					}
					if(this.$verify.isEmpty(this.mountInfo.password)){
						this.errorInfo = '请输入密码！';
						return true;
					}
					this.mountInfo.password = MD5(this.mountInfo.password);
					this.$axios.post('/sys/serverConfig/addNetDisk', this.mountInfo).then(res => {
						if(res.code == 200){
							this.$message('挂载成功', 'success');
							this.mountShow = false;
							this.getDetailInfo();
						}
					});
				}else{ //0挂载
					this.mountInfo = {
						name: '',
						apiport: this.editInfo.apiport,
						ipAddress: this.editInfo.ipAddress,
						type: 0,
						user: '',
						password: '',
						port: '',
						priority: 1,
						serial: this.editInfo.serial
					}
					this.mountShow = true;
				}
			},
			//网络存储格式化 卸载
			mountOperate(type, val){
				if(type == 0 && val.choose == 0){
					return
				}
				if(val){
					const data = JSON.parse(JSON.stringify(val))
					this.loginPwd = '';
					this.mountInfo = data;
					this.mountInfo.apiport = this.editInfo.apiport;
					this.mountInfo.ipAddress = this.editInfo.ipAddress;
					this.type = type;
					this.mountPwdShow = true;
				}else{
					if(this.$verify.isEmpty(this.loginPwd)){
						return this.$message('请输入密码', 'error');
					}
					this.mountInfo.type = this.type;
					this.mountInfo.port = 1300;
					if(this.mountInfo.type == 0){ //设为主盘
						this.mountInfo.password = MD5(this.loginPwd);
						this.mountInfo.choose = this.mountInfo.mount;
						this.$axios.post('/sys/serverConfig/enable', this.mountInfo).then(res => {
							if(res.code == 200){
								this.$message('设置成功', 'success');
								this.mountPwdShow = false;
								this.getDetailInfo();
							}
						});
					}else if(this.mountInfo.type == 1){ //格式化
						this.mountInfo.loginUserPassword = MD5(this.loginPwd);
						this.$axios.post('/sys/serverConfig/formatNatDisk', this.mountInfo).then(res => {
							if(res.code == 200){
								this.$message('格式化成功', 'success');
								this.mountPwdShow = false;
								this.getDetailInfo();
							}
						});
					}else if(this.mountInfo.type == 2){ //卸载
						this.mountInfo.loginUserPassword = MD5(this.loginPwd);
						this.$axios.post('/sys/serverConfig/deleteNetDisk', this.mountInfo).then(res => {
							if(res.code == 200){
								this.$message('卸载成功', 'success');
								this.mountPwdShow = false;
								this.getDetailInfo();
							}
						});
					}else if(this.mountInfo.type == 3){ //强制删除
						this.mountInfo.loginUserPassword = MD5(this.loginPwd);
						let data = new FormData();
						data.append('id', this.mountInfo.id);
						data.append('lUP', this.mountInfo.loginUserPassword);
						this.$axios.post('/sys/serverConfig/forceDeleteNetDisk', data).then(res => {
							if(res.code == 200){
								this.$message('删除成功', 'success');
								this.mountPwdShow = false;
								this.getDetailInfo();
							}
						});
					}
				};
			}
		},
		filters: {
			priority(val){
				let arr = ['0','P1','P2', 'P3','P4','P5'];
				return arr[val];
			},
			mountType(val){
				let arr = ['虚拟存储','nas','san'];
				return arr[val];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.second-box{
		position: absolute;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #fff;
	}
	.dialog-item{
		margin-top: 23px;
		margin-bottom: 20px;
		p:first-child{
			width: 90px;
			height: 40px;
			font-size: 14px;
			line-height: 40px;
			text-align: justify;
		}
	}
	.menu-wrap{
		margin-top: 30px;
		.menu-item{
			margin-left: 55px;
		}
	}
	.server-item{
		margin-left: 60px;
		padding-bottom: 70px;
		.type-title{
			margin-top: 48px;
			color: #303133;
			font-size: 14px;
			font-weight: bold;
		}
	}
	.server-btn{
		width: 160px;
		height: 40px;
		margin-left: 112px;
	}
	.err-info{
		margin-left: 15px;
		font-size: 12px;
		color: #F64646;
	}
</style>
<style>
	.err-border .el-input__inner{
		border-color: #F64646!important;
	}
</style>
