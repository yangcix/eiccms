<template>
	<div class="init-wrap">
		<!-- 新增登录窗口 -->
		<div>
			<el-dialog
				title="管理员登录"
				:close-on-click-modal="false"
				:visible.sync="admin.loginShow"
				:showClose="false"
				width="430px">
				<div class="login-content">
					<p>账号：<el-input class="input" @keyup.native.enter="handleLogin" v-model.trim="admin.account"></el-input></p>
					<p>密码：<el-input class="input" type="password" @keyup.native.enter="handleLogin" v-model.trim="admin.password"></el-input></p>
					<el-button type="primary" class="login-btn" @click="handleLogin">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div  class="content-wrap step1" v-show="stepIndex == 0">
			<div class="content">
				<img src="../../assets/imgs/init-smile.png" alt="">
				<p class="name">艾课校园直播，感谢选择我们！</p>
				<p>艾课，爱在每一课！</p>
			</div>
			<div class="step">
				<p class="text">请进行初始化配置，为您私人订制！</p>
				<el-button type="primary" @click="stepIndex = 1">开始使用</el-button>
			</div>
		</div>
		
		<div  class="content-wrap step2" v-show="stepIndex == 1">
			<p class="set">请设置系统版本</p>
			<div class="content">
				<div class="item bgc1" @click="version = 1" :class="version == 1 ? 'active' : ''">
					<p class="title">标准版</p>
				</div>
				<div class="item bgc2" @click="version = 2" :class="version == 2 ? 'active' : ''">
					<p class="title">专业版</p>
				</div>
				<div class="item bgc6" @click="version = 3" :class="version == 3 ? 'active' : ''">
					<p class="title">旗舰版</p>
				</div>
			</div>
			<div class="step">
				<el-button type="primary" @click="versionSet">下一步</el-button>
			</div>
		</div>
		
		<div  class="content-wrap step3" v-show="stepIndex == 2">
			<p class="set">请设置系统模式</p>
			<div class="content">
				<div class="item bgc3" @click="orgType = 2" :class="orgType == 2 ? 'active' : ''">
					<p class="title">单校版</p>
				</div>
				<div class="item bgc4" @click="orgType = 1" :class="orgType == 1 ? 'active' : ''">
					<p class="title">集团校版</p>
				</div>
				<div class="item bgc5" @click="orgType = 3" :class="orgType == 3 ? 'active' : ''">
					<p class="title">教育局版</p>
				</div>
			</div>
			<div class="step">
				<el-button type="primary" @click="stepIndex = 1">上一步</el-button>
				<el-button type="primary" @click="orgTypeSet">下一步</el-button>
			</div>
		</div>
		
		<div  class="content-wrap step3" v-show="stepIndex == 3 && version == 3">
			<p class="set">请设置运行环境</p>
			<div class="content">
				<div class="item bgc5" @click="netType = 1" :class="netType == 1 ? 'active' : ''">
					<p class="title">教育专网</p>
				</div>
				<div v-show="version == 3" class="item bgc4" @click="netType = 2" :class="netType == 2 ? 'active' : ''">
					<p class="title">公网</p>
				</div>
			</div>
			<div class="step">
				<el-button type="primary" @click="stepIndex = 2">上一步</el-button>
				<el-button type="primary" @click="netTypeSet">下一步</el-button>
			</div>
		</div>

		<div  class="content-wrap step3" v-show="stepIndex == 4 && version == 3">
			<p class="set">请选择前台版本</p>
			<div class="content">
				<div class="item bgc3" @click="uiType = 1" :class="uiType == 1 ? 'active' : ''">
					<p class="title">智慧教育版</p>
				</div>
				<div class="item bgc4" @click="uiType = 2" :class="uiType == 2 ? 'active' : ''">
					<p class="title">通用版</p>
				</div>
			</div>
			<div class="step">
				<el-button type="primary" @click="stepIndex = 3">上一步</el-button>
				<el-button type="primary" @click="uiTypeSet">下一步</el-button>
			</div>
		</div>

		<div  class="content-wrap step3" v-show="stepIndex == 5">
			<p class="set">是否安装智能录播</p>
			<div class="content">
				<div class="item bgc3" @click="recordType = 1" :class="recordType == 1 ? 'active' : ''">
					<p class="title">安装</p>
				</div>
				<div class="item bgc4" @click="recordType = 2" :class="recordType == 2 ? 'active' : ''">
					<p class="title">不安装</p>
				</div>
			</div>
			<div class="step">
				<el-button type="primary" @click="recordTypeGo">上一步</el-button>
				<el-button type="primary" @click="recordTypeSet">下一步</el-button>
			</div>
		</div>

		<div  class="content-wrap" v-show="stepIndex == 6">
			<p class="set">请设置组织架构</p>
			<div class="content">
				<el-input class="width-5" placeholder="请输入平台名称" v-model.trim="name"></el-input>
				<el-input class="width-5" placeholder="请输入组织架构名称" v-model.trim="orgName"></el-input>
				<el-input class="width-5" placeholder="请输入主办单位" v-model.trim="sponsor"></el-input>
				<el-input class="width-5" placeholder="请输入运维单位" v-model.trim="company"></el-input>
			</div>
			<div class="step">
				<!-- <el-button type="primary" @click="orgPre">上一步</el-button> -->
				<el-button type="primary" @click="stepIndex = 5">上一步</el-button>
				<el-button type="primary" @click="orgNameSet">下一步</el-button>
			</div>
		</div>
		<div  class="content-wrap step3" v-show="stepIndex == 7 && version == 3">
			<p class="set">请选择使用区域</p>
			<div class="content">
				<el-select
          v-model="mapValue"
          placeholder="请选择">
          <el-option
            v-for="item in mapOption"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
			</div>
			<div class="step">
				<el-button type="primary" @click="stepIndex = 6">上一步</el-button>
				<el-button type="primary" @click="stepIndex = 8">下一步</el-button>
			</div>
		</div>
		<div  class="content-wrap" v-show="stepIndex == 8">
			<p class="set">请设置管理员密码</p>
			<div class="content">
				<el-input class="width-5" type="password" v-model.trim="password" placeholder="设置管理员密码"></el-input>
				<el-input class="width-5" type="password" v-model.trim="passwordAgain" placeholder="再次确认密码"></el-input>
			</div>
			<div class="step">
				<el-button type="primary" @click="passwordGo">上一步</el-button>
				<el-button type="primary" @click="passwordSet">下一步</el-button>
			</div>
		</div>

		<!-- <div  class="content-wrap step3" v-show="stepIndex == 5">
			<p class="set">请设置系统分类方式</p>
			<div class="content">
				<div class="item bgc1" @click="classify = 1" :class="classify == 1 ? 'active' : ''">
					<p class="title">简单分类</p>
				</div>
				<div class="item bgc2" @click="classify = 2" :class="classify == 2 ? 'active' : ''">
					<p class="title">复杂分类</p>
				</div>
			</div>
			<div class="step">
				<el-button type="primary" @click="stepIndex = 4">上一步</el-button>
				<el-button type="primary" @click="classifySet">下一步</el-button>
			</div>
		</div> -->
		
		<div  class="content-wrap step1" v-show="stepIndex == 9">
			<div class="content">
				<img src="../../assets/imgs/init-success.png" alt="">
				<p class="name">恭喜你，初始化完成！</p>
			</div>
			<div class="step success">
				<el-button type="primary" @click="initSuccess">马上进入艾课校园直播</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import MD5 from 'js-md5';
	export default {
		name: '',
		data() {
			return {
				mapValue: 1,
				mapOption: [
					{
						id: 1,
						label: '厦门',
						lat: '118.094397',
						lng: '24.487317',
					},
					{
						id: 2,
						label: '福州',
						lat: '119.299260',
						lng: '26.091756',
					},
					{
						id: 3,
						label: '三明',
						lat: '117.643791',
						lng: '26.274846',
					},
					{
						id: 4,
						label: '凉山',
						lat: '102.268619',
						lng: '27.896947',
					},
					{
						id: 5,
						label: '绵阳',
						lat: '104.680857',
						lng: '31.483178',
					}
				],
				stepIndex: -1,
				password: '',
				passwordAgain: '',
				name: '劢联科技',
				orgName: '',
				company: '劢联科技',
				sponsor: '劢联科技',
				version: '',
				orgType: '',
				netType: 1,
				uiType: 2,
				recordType: 1,
				classify: '',
				admin: {
					loginShow: true,
					account: '',
					password: ''
				}
			}
		},
		components: {},
		mounted() {
			this.inspectVersion();
		},
		methods: {
			// 管理员登录 this.inspectVersion默认开启
			handleLogin() {
				if (this.$verify.isEmpty(this.admin.account)) {
					this.$message('账号不能为空', 'error');
				} else if (this.$verify.isEmpty(this.admin.password)) {
					this.$message('密码不能为空', 'error');
				} else {
					this.$axios.post('/auth/login', {
						account: this.admin.account,
						password: MD5(this.admin.password),
						loginType: "web",
						remember: false,
						type: 1
					}).then(res => {
						if (res.code === 200) {
							this.admin.account = '';
							this.admin.password = '';
							this.$message('登录成功', 'success');
							this.admin.loginShow = false;
							this.stepIndex = 0;
							window.localStorage.setItem('isAdmin', res.data.adminOrSuper)
						}
					})
				}
			},
			//检查是否初始化完成
			inspectVersion(){
				this.$axios.get('/sys/init/checkInit').then(res => {
					if(res.data){
						this.initSuccess();
					}
				})
			},
			//版本设置
			versionSet(){
				if(this.version == 1){
					this.orgType = 2
					this.stepIndex = 5;
				}else if(this.version == 2){
					this.stepIndex = 2;
				}else if(this.version == 3){
					this.stepIndex = 2;
				}else{
					this.$message('请选择版本', 'error')
				}
			},
			//版本设置
			orgTypeSet(){
				if(this.orgType){
					if(this.version !== 3) {
						this.stepIndex = 5;
					}else{
						this.stepIndex = 3;
					}
				}else{
					this.$message('请选择版本', 'error')
				}
			},
			//网络设置
			netTypeSet(){
				if(this.netType){
					if(this.version !== 3) {
						this.stepIndex = 5;
					}else{
						this.stepIndex = 4;
					}
				}else{
					this.$message('请选择网络环境', 'error')
				}
			},
			//前台设置
			uiTypeSet(){
				if(this.uiType){
					this.stepIndex = 5;
				}else{
					this.$message('请选择前台版本', 'error')
				}
			},
			recordTypeGo(){
				if(this.version == 3) {
					this.stepIndex = 4;
				}else if(this.version == 2){
					this.stepIndex = 2;
				}else if(this.version == 1){
					this.stepIndex = 1;
				}
			},
			//智能录播设置
			recordTypeSet(){
				if(this.recordType){
					this.stepIndex = 6;
				}else{
					this.$message('请选择是否安装', 'error')
				}
			},
			orgPre(){
				if(this.version == 1){
					this.stepIndex = 1;
				}else if(this.version == 2){
					this.stepIndex = 2;
				}
			},
			//系统名称设置
			orgNameSet(){
				if(this.orgName && this.name && this.sponsor && this.company){
					if(this.name.length > 20) {
						return this.$message('平台名称不能超过20字符', 'error')
					}
					if(this.$verify.chLetterNum(this.orgName, 20)) {
						return this.$message('组织名称为中文大小写字母和数字组成，最长20位！', 'error')
					}
					if(this.sponsor.length > 50) {
						return this.$message('主办单位不能超过50字符！', 'error')
					}
					if(this.company.length > 50) {
						return this.$message('运维单位不能超过50字符！', 'error')
					}
					if(this.version == 3) {
						this.stepIndex = 7;
					}else{
						this.stepIndex = 8;
					}
					
				}else{
					if(!this.name){
						this.$message('请输入平台名称', 'error')
					} else if(!this.orgName){
						this.$message('请输入组织架构名称', 'error')
					}	else if(!this.sponsor){
						this.$message('请输入主办单位', 'error')
					}	else if(!this.company){
						this.$message('请输入运维单位', 'error')
					}
				}
			},
			passwordGo() {
				if(this.version == 3) {
					this.stepIndex = 7;
				}else{
					this.stepIndex = 6;
				}
			},
			//密码设置
			passwordSet(){
				if(!this.password){
					this.$message('请输入管理员密码', 'error');
				}else if(this.password.length < 6 || this.$verify.chLetterNum(this.password, 20)){
					this.$message('密码由字母或数字组成，并且长度为6-20字符', 'error');
				}else if(!this.passwordAgain){
					this.$message('请输入确认密码', 'error');
				}else if(this.password != this.passwordAgain){
					this.$message('两次输入的密码不一致', 'error');
				}else{
					// this.stepIndex = 5;
					let data = {
						version: this.version,
						orgType: this.orgType == 2 ? 2 : 1,
						orgName: this.orgName,
						sponsor: this.sponsor,
						company: this.company,
						netType: this.version == 3 ? this.netType : 1,
						uiType: this.version !== 3 ? '2' : this.uiType,
						recordType: this.recordType,
						name: this.name,
						password: MD5(this.password),
					}
					if(this.version == 3) {
						let a;
						this.mapOption.forEach(el => {
							if(el.id == this.mapValue){
								a = el;
							}
						})
						data.longitude = a.lat;
						data.latitude = a.lng;
					}
					// if(this.version == 2) {
					// 	data.orgType = this.orgType == 2 ? 2 : 1;

					// }
					// if(this.version == 3) {
					// 	data.orgType = this.orgType == 2 ? 2 : 1;
					// 	data.netType = this.netType;
					// }
					this.$axios.post('/sys/init/init', data).then(res => {
						if(res.code === 200){
							this.stepIndex = 9;
						}
					})
				}
			},
			// 设置分类
			classifySet() {
				if (!this.classify) {
					this.$message('请选择分类', 'error');
					return
				}
				this.$axios.post('/sys/init/init', {
					version: this.version,
					orgType: this.orgType == 2 ? 2 : 1,
					orgName: this.orgName,
					name: this.name,
					password: MD5(this.password),
					classify: this.classify,
				}).then(res => {
					if(res.code == 200){
						this.stepIndex = 6;
					}
				})
			},
			//初始化完成
			initSuccess(){
				this.$router.replace('/login');
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.login-content{
		font-size: 14px;
		p{
			width: 344px;
			height: 40px;
			margin: 0 0 25px 24px;
			line-height: 40px;
			color: #303133;
		}
		.login-btn{
			width: 344px;
			height: 40px;
			margin: 10px 0 0 24px;
		}
		.input{
			width: 285px;
			float: right;
		}
	}
	.init-wrap{
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: url(../../assets/imgs/init-bg.png) no-repeat;
		background-color: #70b6ff;
	}
	.content-wrap{
		display: flex;
		flex-direction: column;
		width: 62.5%;
		height: 64%;
		background: #fff;
		.set{
			margin: 30px 0 0 35px;
			font-size: 24px;
			color: #303133;
		}
		.content{
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.width-5{
				margin: -40px 0 56px 0;
			}
			.item{
				width: 200px;
				height: 180px;
				margin: 0 25px;
				text-align: center;
				font-size: 16px;
				color: #fff;
				.title{
					margin-top: 63px;
				}
			}
			.active{
				border: solid 1px #f00;
			}
			.bgc1{background: url(../../assets/imgs/init-icon4.png) no-repeat center/100% 100%}
			.bgc2{background: url(../../assets/imgs/init-icon5.png) no-repeat center/100% 100%}
			.bgc3{background: url(../../assets/imgs/init-icon1.png) no-repeat center/100% 100%}
			.bgc4{background: url(../../assets/imgs/init-icon2.png) no-repeat center/100% 100%}
			.bgc5{background: url(../../assets/imgs/init-icon3.png) no-repeat center/100% 100%}
			.bgc6{background: url(../../assets/imgs/init-icon6.png) no-repeat center/100% 100%}
		}
		.step{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80px;
			box-sizing: border-box;
			padding: 0 35px;
			background: #fff;
			.text{
				font-size: 16px;
				color: #303133;
			}
		}
	}
	.step1{
		.content{
			font-size: 16px;
			color: #fff;
			background: #409EFF;
			img{
				width: 265px;
			}
			.name{
				margin: 68px 0 27px 0;
				font-size: 30px;
			}
		}
		.success{
			justify-content: flex-end;
		}
	}
	.step2{
		.content{
			flex-direction: row;
			font-size: 16px;
			color: #fff;
			.name{
				margin: 68px 0 27px 0;
				font-size: 30px;
			}
		}
		.step{
			justify-content: flex-end;
		}
	}
	.step3{
		.content{
			flex-direction: row;
			font-size: 16px;
			color: #fff;
			.name{
				margin: 68px 0 27px 0;
				font-size: 30px;
			}
		}
	}
		.step4{
		.content{
			flex-direction: row;
			font-size: 16px;
			color: #fff;
			.name{
				margin: 68px 0 27px 0;
				font-size: 30px;
			}
		}
	}
</style>
