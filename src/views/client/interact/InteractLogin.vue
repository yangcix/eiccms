<template>
	<div class="interact-wrap">
		<header>
			<nav>
				<div class="logo-name">
					<img :src="logoImg" alt="">
					<span class="line">|</span>
					<p class="system-name" @click="goHome()">{{systemName}}</p>
				</div>
				<div class="account">
					<div class="login-out" v-if="!userInfo" @click="loginShow = true">
						<i class="iconfont iconsignin login-out"></i>
						<p>请登录</p>
					</div>
					<div class="login" v-else>
						<div>
							<p class="name" :title="userInfo.nickName">{{userInfo.nickName}}</p>
							<p class="type" v-if="(userInfo.account !== 'super' && userInfo.account !== 'admin') && userInfo.roleType == 2 ">其他</p>
							<p class="type" v-else>{{userInfo.roleType | roleType}}</p>
						</div>
						<i class="iconfont icon-xiangxia"></i>
						<ul class="down-list">
							<li @click="enterSystem" v-if="userInfo.systemPermission">
								<i class="iconfont iconbackstage"></i>
								<span>进入后台</span>
							</li>
							<li @click="goUserHome">
								<i class="el-icon-discount"></i>
								<span>个人中心</span>
							</li>
							<li @click="pwdShow = true">
								<i class="el-icon-edit-outline"></i>
								<span>修改密码</span>
							</li>
							<li @click="goHelpHome">
								<i class="el-icon-sunny"></i>
								<span>帮助中心</span>
							</li>
							<li @click="logOutShow = true">
								<i class="iconfont icon-tuichu"></i>
								<span>退出登录</span>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
		<div class="content-wrap" v-show="verity == 0" :class="isOut ? 'special' : ''">
			<div class="content">
				<p class="title">{{ isOut ? '课堂登录验证' : '课堂登录验证' }}</p>
				<div class="content-info">
					<div class="class-info">
						<img :src="themeInfo.imgUrl ? themeInfo.imgUrl : defaultImg" alt="" :onerror="defaultImg">
						<p class="class-name">{{themeInfo.name}}</p>
					</div>


					<div class="login-wrap" v-if="!isOut">
						<div v-if="themeInfo.playStatus !== 1" style="height: 100%;display: flex;justify-content: space-between;flex-direction: column;">
								<div class="dialog-item">
							<p>验证码：</p>
							<el-input class="width-3" v-model="code" @keyup.native.enter="inclass"></el-input>
						</div>
						<div style="text-align: center;margin-bottom: 100px;">
							<button class="sourceBtns"  @click="inclass">进入课堂</button>
						</div>
						</div>
						<div v-else  class="finish-title">
							{{ loginShow == false ? (themeInfo ? ( themeInfo.playStatus == 1 ? '该主题已结束！' : '该主题暂未开始！') : '') : ''}}
						</div>
						<!-- <div v-if="thisIdentity === null" class="parcel">
							<p>请选择进入课堂身份？</p>
							<el-button class="buttonPrimary" type="primary" v-for="item in identityList" :key="item.id" @click="handleIdentityIn(item)">
								{{ item.name }}
							</el-button>
						</div>

						<div class="mainCode" v-else-if="thisIdentity == 1 && isLocal != 3">
							<div class="dialog-item">
								<p>验证码：</p>
								<el-input class="width-3" v-model="code" @keyup.native.enter="inclass"></el-input>
							</div>
							<button class="miansourceBtn"  @click="inclass">进入教室</button>
							<button class="backBtn"  @click="backId">返回</button>
							<div class="sourceTipsMain">
								温馨提示：互动信号默认教室录播信号，可点击
								<span style="color:#F55C54;text-decoration: underline;cursor: pointer;" @click="toSource">切换信号</span>
							</div>
						</div>

						<div class="mainCode" v-else-if="thisIdentity == 0 && isLocal != 3">
							<div class="dialog-item">
								<p>互动教室：</p>
								<el-select v-model="classroomId" placeholder="选择教室" class="width-3" filterable>
									<el-option
										v-for="item in collectivelyList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>  
								</el-select>
							</div>
							<div class="dialog-item">
								<p>验证码：</p>
								<el-input class="width-3" v-model="code" @keyup.native.enter="inclass"></el-input>
							</div>
							<button class="sourceBtn"  @click="inclass">进入教室</button>
							<button class="backBtn"  @click="backId">返回</button>
							<div class="sourceTips">
								温馨提示：互动信号默认教室录播信号，可点击
								<span style="color:#F55C54;text-decoration: underline;cursor: pointer;" @click="toSource">切换信号</span>
							</div>
						</div>

						<div class="chooseSource" v-else-if="thisIdentity != null && thisIdentity != 2 && isLocal == 3">
							<div class="sourceAsk">请选择课堂信号来源？</div>
							<div class="sourceTips">温馨提示：请正确选择，开始互动后无法修改！</div>
							<button class="sourceBtn" v-for="item in sourceList" :key="item.id" @click="handleSourceIn(item)">
								{{ item.name }}
							</button>
						</div> -->
						
					</div>
					<!-- 校外 -->
					<div v-else class="selectBtn">
						<div v-if="thisIdentity === null" class="parcel">
							<p>请选择进入课堂身份？</p>
							<el-button class="buttonPrimary" type="primary" v-for="item in identityList" :key="item.id" @click="handleIdentity(item)">
								{{ item.name }}
							</el-button>
						</div>

						<div class="chooseSource" v-else-if="thisIdentity != null && thisIdentity != 2 && isLocal == 3">
							<div class="sourceAsk">请选择课堂信号来源？</div>
							<div class="sourceTips">温馨提示：请正确选择，开始互动后无法修改！</div>
							<button class="sourceBtn" v-for="item in sourceList" :key="item.id" @click="handleSourceIn(item)">
								{{ item.name }}
							</button>
						</div>
						
						<div v-if="thisIdentity !== null && isLocal !=3">
							<div class="dialog-item">
								<p>互动教室：</p>
								<el-select v-model="teachingBuildingId" @change="buildingChange" placeholder="选择教学楼" class="width-3" style="margin-right: 8px" filterable>
									<el-option
										v-for="item in teachBuildlList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</div>

							<div class="dialog-item">
								<p></p>
								<el-select v-model="classroomId" placeholder="选择教室" @change="handleFacility" style="margin-right: 8px" class="width-8" filterable>
									<el-option
										v-for="item in classroomList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>

								<el-select v-model="facilityId" @change="changeFacility" placeholder="选择设备" class="width-4" filterable>
									<el-option
										v-for="item in facilityIdList"
										:key="item.id"
										:label="item.terminalName"
										:value="item.id">
									</el-option>
								</el-select>
							</div>

							<div class="dialog-item">
								<p>验证码：</p>
								<el-input class="width-3" v-model="code" @keyup.native.enter="inclass"></el-input>
							</div>
							<div class="dialog-btn">
								<el-button type="primary" style="width: 335px" @click="inclass">登 录</el-button>
							</div>
							<div class="sourceTips">
								温馨提示：互动信号默认教室录播信号，可点击
								<span style="color:#F55C54;text-decoration: underline;cursor: pointer;" @click="toSource">切换信号</span>
							</div>
              <div class="backtrack">
                <span @click="toRole">返回选择角色</span>
              </div>
						</div>
					</div>
				</div>
			</div>

			<testHardware v-if="isLocal == 'local' && thisIdentity !== null" @localJoinInRoom="localJoinInRoom" @startTips="startTips" @closeDialog="closeDialog" />
			<div class="mask" v-if="isLocal == 'local' && thisIdentity !== null"></div>
		</div>
		<el-dialog
			title="修改密码"
			:close-on-click-modal="false"
			:close-on-press-escape="mainInfo.needModifiedPassword == true ? false : true"
			:show-close="mainInfo.needModifiedPassword == true ? false : true"
			:visible.sync="pwdShow"
			:before-close="closeChangePwd"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-title" v-if="errorInfo">{{errorInfo}}</p>
        <!-- <div class="hiddenInput">
          <el-input></el-input>
          <el-input></el-input>
        </div> -->
				<div class="dialog-item">
					<p>原密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" type="password" v-model="pwdInfo.old" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
				</div>
				<div class="dialog-item">
					<p>新密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" type="password" v-model="pwdInfo.new" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
				</div>
				<div class="dialog-item">
					<p>确认密码</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" type="password" v-model="pwdInfo.again" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
				</div>
				<div class="dialog-btn">
					<el-button type="primary" @click="updatePwd">确 定</el-button>
					<el-button @click="closeChangePwd">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		
		<el-dialog
			title="系统提示"
			:close-on-click-modal="false"
			:visible.sync="logOutShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确定退出登录？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="logOut">确 定</el-button>
					<el-button @click="logOutShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog
			:close-on-click-modal="false"
			:visible.sync="changeShow"
			:show-close="false"
			:close-on-press-escape="false"
			width="420px">
			<div class="dialog-wrap">
				<p style="margin: 20px 0 40px 0;font-size: 15px;">您的密码安全等级低，请修改密码！</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="pwdShow = true;changeShow = false" style="margin: 0 auto;">立即修改</el-button>
					<!-- <el-button v-if="mainInfo.needModifiedPassword == false" @click="closeChangePwd">取 消</el-button> -->
				</div>
			</div>
		</el-dialog>
		<el-dialog
			title="账号登录"
			:close-on-click-modal="false"
			:visible.sync="loginShow"
			:showClose="false"
			width="420px">
			<div class="login-content">
				<p>账号：<el-input class="input" @keyup.native.enter="login" v-model.trim="account"></el-input></p>
				<p>密码：<el-input class="input" type="password" @keyup.native.enter="login" v-model="password" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input></p>
				<p><el-checkbox v-model="remember">自动登录</el-checkbox></p>
				<el-button type="primary" class="login-btn" @click="login">登 录</el-button>
			</div>
		</el-dialog>
		
		<div class="content-wrap" v-show="verity == 1" :class="isOut ? 'special' : ''">
			<div class="content verity-step">
				<img src="../../../assets/imgs/interact-step.png" alt="">
				<p class="step-name">检测网络...</p>
			</div>
		</div>
		
		<div class="content-wrap" v-show="verity == 2" :class="isOut ? 'special' : ''">
			<div class="content verity-step">
				<img src="../../../assets/imgs/interact-step.png" alt="">
				<p class="step-name">检测流媒体信号...</p>
			</div>
		</div>

		<el-dialog
        title="提示"
        :visible.sync="startVisible"
        :modal="false"
        width="716px"
        :center="true"
        >
          <h3 class="starth3">启动 Chrome Insecure origins treated as secure flag流程指引</h3>
          <div class="startStep">
            <p>第一步：打开 chrome浏览器，并访问：chrome://flags/#unsafely-treat-insecure-origin-as-secure；</p>
            <p>第二步：将“Insecure origins treated as secure"flag状态设置为”Enabled“；</p>
            <p>第三步：底部输入框中填写需要开启的域名，即您系统的IP，配置完如下：</p>
            <img src="@/assets/imgs/startTips.png" alt="">
            <p>第四步：重启浏览器后生效；</p>
          </div>
          <slot slot="footer" class="dialog-footer">
            <el-button type="primary" @click="startVisible = false">已设置过</el-button>
          </slot>
    </el-dialog>
		
	</div>
</template>

<script>
	import { dateFormat, getNowDate } from '../../../assets/js/utils'
	import MD5 from 'js-md5';
	import { Message } from 'element-ui';
	import { session, storage, kickUrl } from '@/assets/js/utils';
	import wsMixin from "@/components/wsMixin.vue";
	import testHardware from '@/components/testHardware'
	export default {
		mixins: [wsMixin],
		name: 'headFoot',
		data() {
			return {
				defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
				showBefore: false,
				terminalName: '',
				userInfo: '',
				logOutShow: false,
				loginShow: false,
				account: '',
				password: '',
				remember: false,
				pwdInfo: {},
				errorInfo: '',
				pwdShow:false,
				changeShow: false,
				mainInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
				systemName: '',
				logoImg: '',
				schoolList: [],
				teachBuildlList: [],
				classroomList: [],
				orgId: '',
				teachingBuildingId: '',
				classroomId: '',
				code: '',
				verity: 0,  // 控制主流程以及背景界面
				themeInfo: '',
				role: localStorage.getItem('role') ? localStorage.getItem('role') : '',
				judgeSignalUrl: '',
				websock: null,
				loginType: "web",
				identityList: [
					{ name: "主讲教室", id: 1 },
					{ name: "互动教室", id: 0 },
					{ name: "旁听教室", id: 2 },
				],
				isOut: this.$route.query.type, // 是否校外 携带type
				thisIdentity: null, // 当前身份

				facilityId: "", // 校外设备id
				facilityIdList: [], // 校外设备id列表
				mainId: '', // 校外主题id
				sourceList: [
					{ name: "教室录播信号", id: 'recoder' },  // 录播流信号
					{ name: "电脑音视频信号", id: "local" },  // 本机信号
					{ name: "返回", id: 'back' } // 返回选择角色
				],
				isLocal:'recoder', // 是否是本机信号   3->初始值  'recoder' -> 录播流信号 'local' -> 本机信号
				startVisible:false, //启动提示
				collectivelyList: [], //校内学校列表统称
				signalBack:'', //选择信号返回标记
				dvConfig:{}, //设备码率帧率配置
				userType: '',
				playStatus: '',
				oldTermianlist: {},
				showNew: true,
			}
		},
		components: {
			testHardware
		},
		beforeRouteLeave(to, from, next) {
			if (this.websock) this.websock.close();
			console.log('关闭ws')
			next();
		},
		watch: {
			$route:{
				handler(to,from){
					console.log('from',to,from)
					// if(newVal.path == '/mainroom' || newVal.path == '/assistantroom') {
					// 	location.reload()
					// }
				},
				// deep: true,
				immediate: true
			}
		},
		mounted() {
			if(this.mainInfo.needModifiedPassword == true) {
				this.changeShow = true;
			}
			this.testChrome();
			this.getUserInfo();
			this.getLogo();
		},
		methods: {
			goHome() {
				this.$router.push('/home')
			},
			goHelpHome() {
				window.open('/helpHome', '_blank')
			},
			goUserHome() {
				window.open('/userHome', '_blank')
			},
			//修改密码
			updatePwd(){
				if(this.$verify.isEmpty(this.pwdInfo.old)){
					return this.errorInfo = '请填写原密码';
				};
				if(this.$verify.isEmpty(this.pwdInfo.new)){
					return this.errorInfo = '请填写新密码';
				};
				if(this.pwdInfo.old == this.pwdInfo.new){
					return this.errorInfo = '原密码与新密码不能一致';
				};
				if(!this.$verify.checkPW(this.pwdInfo.new)){
					return this.errorInfo = '新密码必须由6-20位数字、大小写字母组成，至少含2种！';
				};
				if(this.$verify.isEmpty(this.pwdInfo.again)){
					return this.errorInfo = '请填写确认密码';
				};
				if(this.pwdInfo.new != this.pwdInfo.again){
					return this.errorInfo = '新密码和确认密码不一致';
				};
				this.$axios.post('/sys/user/updatePwdBackStage', {
					newPwd: MD5(this.pwdInfo.new),
					oldPwd: MD5(this.pwdInfo.old),
				}).then(res => {
					this.errorInfo = ''
					if(res.code == 200){
						this.pwdShow = false;
						this.$message(res.message + '请重新登录', 'success');
						// this.getUserInfo();
						this.pwdInfo = {};
						setTimeout(() => {
							location.reload()
						}, 500);
					}
				});
			},

			// 关闭修改密码框
			closeChangePwd() {
				this.pwdShow = false;
				this.pwdInfo = {};
				this.errorInfo = ''
			},
			checkUser() {
				let data = new FormData();
				data.append('id', parseInt(this.$route.query.id))
				this.$axios.post(`/sm/interactive/checkUser`, data).then(res => {
					this.userType = res.data.code;
					window.localStorage.setItem('role', res.data.code)
					this.orgId = res.data.orgId;
					if(res.data.termianlist) {
						// this.classroomId = res.data.termianlist.classroomId;
						this.themeInfo.terminalList.forEach(el => {
							if(el.terminalId == res.data.termianlist.terminalId) {
								this.oldTermianlist = el
							}
						});
						this.showBefore = true;
						this.showNew = false;
						this.role = res.data.termianlist.role;  // 主讲 副讲
						this.judgeSignalUrl = res.data.termianlist.url;   // 互动地址
						this.dvConfig = {
							cacheTime: res.data.termianlist.cacheTime,
							maxBandwidth: res.data.termianlist.maxBandwidth,
							minBandwidth: res.data.termianlist.minBandwidth,
							maxFrameRate: res.data.termianlist.maxFrameRate,
							minFrameRate: res.data.termianlist.minFrameRate,
						}
					}
					if(this.userType != 2) {
						this.getTeachBuildList(res.data.orgId);
					}
				});
			},
			// chrome浏览器检测
			testChrome() {
				let isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
				if (isChrome) {
				} else {
					this.$alert("当前不是Chrome内核浏览器,请更换为chrome浏览器",'警告！',{type:'warning'})
					return
				}
			},
			// 切换本地信号界面
			toSources(){
				this.$axios.get('/sm/interactive/participateInfo', {id: this.$route.query.id || 0}).then(res => {
					if(res.data.playStatus == 0){
						this.isLocal = 'local';
						this.thisIdentity = 1;
						// this.verity = 1;
						// setTimeout(() => {
						// 	this.verity = 2;
						// 	this.checkSign();
						// }, 1500);
					}else{
						this.$message('该互动已结束', 'error');
						this.getThemeInfo();
					}
				})
			},
			checkSign(){
				this.getAudioVideo({audio:true,video:true}).then(res=>{
						this.verity = 0;
						if(this.userType == 1){ //主讲
							this.$router.push(`/mainroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&isLocal=1&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
						}else{
							this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&isLocal=1&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
						}
          }).catch(err=>{
            if(err.code && err.code==404){
							this.$message('浏览器不支持，请更换浏览器', 'error')
              this.verity = 0;
            }else{
							this.$message('请检查是否存在摄像头或麦克风', 'error')
              this.verity = 0;
            }
        })
			},
			getAudioVideo(constraintsData){
				if (navigator.mediaDevices === undefined) {
					navigator.mediaDevices = {};
				}
				if (navigator.mediaDevices.getUserMedia === undefined) {
						navigator.mediaDevices.getUserMedia = function(constraints) {
						// 首先，如果有getUserMedia的话，就获得它
						var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia ||navigator.msGetUserMedia;
						// 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
						if (!getUserMedia) {
							return Promise.reject({code:404});
						}
						// 否则，为老的navigator.getUserMedia方法包裹一个Promise
						return new Promise(function(resolve, reject) {
							getUserMedia.call(navigator, constraints, resolve, reject);
						});
					}
				}
				return navigator.mediaDevices.getUserMedia(constraintsData)
			},
			// 到信号界面
			toSource(){
				this.isLocal = 3;
			},
			//校内返回身份选择
			backId() {
				this.isLocal = 'recoder';
				this.thisIdentity = null;
				this.classroomId = '';
				this.code = '';
			},

			// 获取校内互动学校班级信息统称
			getCollectivelyList(){
				this.$axios.get(`/sm/interactive/classroomList?id=${this.$route.query.id}`).then(res => {
					this.collectivelyList = res.data;
				});
			},

			//校外返回选角
			toRole(){
				this.thisIdentity = null;
				this.isLocal = 'recoder';
				this.teachingBuildingId = '';
				this.classroomId = '';
				this.facilityId = '';
				this.code = '';
			},

			// 校内旁观者身份处理
			handleIdentityIn(item) {
				window.localStorage.setItem('role', item.id)
				if (item.id === 2) { // 观看身份
					this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&isBystanderIn=1`);
					return;
				}
				if(item.id === 0){
					this.getCollectivelyList();
				}
				if(item.id === 1){
					this.classroomId = this.themeInfo.classroomId;
				}
				this.thisIdentity = item.id;
			},
			// 校内信号源选择
			handleSourceIn(item) {
				if(item.id === 'local'){
					// 选择本机信号
					this.isLocal = 'local';
				}else if(item.id === 'recoder') {
					// 选择录播信号
					this.isLocal = 'recoder';
					this.signalBack = 'recoder'; // 暂存信号
				}else {
					// 返回选择角色
					this.isLocal = this.signalBack;
				}
			},
			// 本机信息流进入选择房间
			localJoinInRoom (data) {
				for(let i = 0;i<= data.length;i++){
					if(data[i] == false){
						this.$message('检测结果异常,请重新检测', 'error')
						return;
					}
				}
				this.signalBack = 'localRoom'; // 暂存信号
				this.isLocal = 'localRoom';
				if(this.userType == 1){ //主讲
					this.$router.push(`/mainroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&isLocal=1&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
				}else{
					this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&isLocal=1&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
				}
			},
			closeDialog(){
				this.isLocal = '';
				this.thisIdentity = '';
			},
			handleIdentity(item) { // 校外
				if (item.id === 2) { // 观看身份
					this.$axios.get("/sys/crossSchoolInteraction/getInteractionInfo", { id: this.$route.query.id }).then(res => {
						// const { data: {} } = res;
						if (res.code === 200) {
							session.set("websockUrl", res.data.ip || location.hostname);
							session.set("classroom", res.data.name);
							session.set("schoolId", res.data.schoolId);
							session.set("themeName", res.data.name);
							this.$router.push("/assistantroom?id=" + this.$route.query.id + '&type=2&isOut=' + this.isOut + '&mainId=' + res.data.mainId);
						}
					});
					// this.$router.push('/assistantroom?id=' + this.$route.query.id + '&room=' + this.classroomId + '&type=' + this.thisIdentity + '&mainId=' + this.mainId);
					return;
				}
				this.thisIdentity = item.id;
			},
			toLogin() {
        if (this.$route.query.type) {
          this.$router.push({ path: "/interactlogin", query: { id: this.$route.query.id, type: 1,status: this.$route.query.status } });
        } else {
          this.$router.push({ path: "/interactlogin", query: { id: this.$route.query.id, status: this.$route.query.status } });
        }
			},
			//获取平台logo和名字
			getLogo(){
				this.$axios.get('/index/systemInfo').then(res => {
					this.logoImg = res.data.pcLogo;
					this.systemName = res.data.name;
					document.title = res.data.name ? res.data.name : '劢联科技';
					session.set('userInfo', res.data);
					localStorage.setItem('version',res.data.version)
				});
			},
			//进入后台
			enterSystem(){
				let routeUrl = this.$router.resolve({
					path: "/sys"
				});
        window.open(routeUrl.href, '_blank');
			},
			//退出登录
			logOut(){
				this.$axios.get('/auth/signOut').then(res => {
					if(res.code == 200){
						session.set('systemMenuList', '');
						this.logOutShow = false;
						this.$message(res.message, 'success');
						// this.getUserInfo();
						const params = {
							type: "logout",
							account: this.userInfo.account,
							loginType: "web",
						};
						this.websocketsend(JSON.stringify(params));
					}
				})
			},
			//获取用户信息
			getUserInfo(){
				this.$axios.get('/index/getUserInfo').then(res => {
					if(res.data){
						this.userInfo = res.data;
						if (this.websock) this.websock.close(); // 关闭在建立 
						this.handleGetWebsocket(); // 需要登录建立长连接
						if (!this.isOut) this.getSchoolList();
						this.getThemeInfo();
						if (this.isOut && this.userInfo) {
							this.shcoolChange();
						}
					}else{
						this.loginShow = true;
					}
				});
			},
			login(){
				if(this.$verify.isEmpty(this.account)){
					this.$message('账号不能为空', 'error');
				}else if(this.$verify.isEmpty(this.password)){
					this.$message('密码不能为空', 'error');
				}else{
					this.$axios.post('/auth/login', {
						account: this.account,
						password: MD5(this.password),
						remember: this.remember,
						loginType: "web",
						type: 0
					}).then(res => {
						if(res.code == 200){
							this.$message('登录成功', 'success');
							this.userInfo = res.data;
							this.mainInfo = res.data;
							this.loginShow = false;
							this.getThemeInfo();
							if(res.data.needModifiedPassword == true) {
								this.changeShow = true;
							}else{
								this.changeShow = false;
							}
							window.localStorage.setItem('isAdmin', res.data.adminOrSuper)
							res.data.password = MD5(this.password);
							// this.account = '';
							// this.password = '';
							window.localStorage.setItem('userInfo', JSON.stringify(res.data));
							if (this.isOut && this.userInfo) {
								this.shcoolChange();
							}
							// this.getSchoolList();
							if (!this.isOut)  this.getSchoolList();
							this.handleGetWebsocket();
							window.location.reload();
						}
					});
				};
			},
			//获取学校列表
			getSchoolList(){
				this.$axios.get('/sys/org/listSchool').then(res => {
					this.schoolList = res.data;
				})
			},
			//选择学校后 教学楼修改
			shcoolChange(id){
				this.teachBuildlList = []; // 清空教学楼数据
				this.classroomList = []; // 清空教室数据
				this.teachingBuildingId = '';
				this.classroomId = '';
				this.getTeachBuildList(id);
			},
			//获取教学楼列表
			getTeachBuildList(orgId){
				this.teachBuildlList = [];
				this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then(res => {
					this.teachBuildlList = res.data;
				})
			},
			//选择教学楼后 教室修改
			buildingChange(id){
				this.classroomId = '';
				this.facilityId = '';
				this.getClassroomList(id);
			},
			//根据教学楼id获取教室列表
			getClassroomList(buildingId){
				this.classroomId = '';
				this.$axios.get('/sys/classroom/getClassroomList', {buildingId: buildingId}).then(res => {
					this.classroomList = res.data;
				})
			},
			// 根据教室id获取设备列表
			handleFacility(facilityId) {
				this.facilityId = '';
				this.$axios.get("/sm/theme/getSelectTerminal", { classroomId: facilityId,startTime: dateFormat("YYYY-mm-dd HH:MM:SS",new Date()),
					endTime: this.themeInfo.endTime}).then(res => {
					this.facilityIdList = res.data;
				});
			},
			//进入课堂
		 	 inclasss(){
				this.$axios.get('/sm/interactive/participateInfo', {id: this.$route.query.id || 0}).then(res => {
					if(res.data.playStatus == 0){
						if(this.role == 1){ //主讲
							this.$router.push(`/mainroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
						}else{
							this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
						}
					}else{
						this.$message('该互动已结束', 'error');
						this.getThemeInfo();
					}
				})
			},
			//进入课堂
			inclass(){
				this.$axios.get('/sm/interactive/info',{ id: this.$route.query.id }).then(res => {
					let type // 0主讲 1副讲 2旁听
					let isassis = res.data.assistantLists.find(el => {
						return el.userId == this.mainInfo.userId
					})
					if(res.data.masterLists[0].userId == this.mainInfo.userId){
						type = 0
					}else if(isassis){
						type = 1
					}else{
						type = 2
					}
					if(type == 0){
						this.$router.push({path:'/mainroom', query: {id: this.$route.query.id}})
					}else if(type == 1){
						this.$router.push({path:'/assistantroom', query: {id: this.$route.query.id}})
					}else{
						if(this.code == ''){
							return this.$message('请输入验证码', 'error')
						}
						this.$axios.get('/sm/interactive/auditPassWord', { id: this.$route.query.id, auditPassWord: this.code}).then(res => {
							if(res.data == true) {
								this.$router.push({path:'/assistantroom', query: {id: this.$route.query.id, isBystanderIn: 1}})
							}else {
								this.$message('验证码错误', 'error')
							}
						})
					}
				})
				
				return
			},
			// 选择设备赋值配置
			changeFacility(){
				let config	= this.facilityIdList.filter(item => item.id == this.facilityId)[0];
				this.dvConfig = {
						cacheTime: config.cacheTime,
						maxBandwidth: config.maxBandwidth,
						minBandwidth: config.minBandwidth,
						maxFrameRate: config.maxFrameRate,
						minFrameRate: config.minFrameRate,
					}
				this.terminalName = config.terminalName
			},
			// 跨校判断验证码
			handleJudgeVerity() {
				let data = new FormData();
				data.append('classroomId', parseInt(this.$route.query.id));
				data.append('password', parseInt(this.$route.query.id));
				data.append('id', parseInt(this.$route.query.id));
				this.$axios.post("/sys/crossSchoolInteraction/checkLogin", {
					classroomId: this.classroomId,
					password: this.code,
					id: this.$route.query.id,
					type: this.thisIdentity
				}).then(res => {
					if (res.code === 200) {
						const url = this.facilityIdList.find(v => v.id === this.facilityId).url;
						session.set("websockUrl", res.data.ip || location.hostname);
						session.set("rtspUrl", url);
						session.set("classroom", this.classroomList.find(v => v.id === this.classroomId).name); // 班级名称
						session.set("tIp", res.data.tIp);
						this.verity = 1;
						this.role = res.data.role;
						this.mainId = res.data.mainId;
						this.judgeSignalUrl = url; //对应设备url
						setTimeout(() => {
							this.verity = 2;
							if(this.isLocal == 'localRoom'){
								// 本机已硬件检测流媒体信号
								this.localOutPush();
							}else {
								this.judgeSignal();
							}
						}, 2000);
					}
				});
			},
			//判断验证码
			judgeVerity(){
				let data = new FormData();
				data.append('classroomId', this.classroomId);
				data.append('role', this.userType);
				data.append('orgId', this.orgId);
				data.append('interactiveId', this.$route.query.id);
				data.append('terminalId', this.facilityId);
				if(this.userType !== 2) {
					this.$axios.post('/sm/interactive/setRoom', {
					classroomId: this.classroomId,
					role: this.userType,
					orgId: this.orgId,
					code: this.terminalName,
					interactiveId: this.$route.query.id,
					terminalId: this.facilityId,
					startTime: this.themeInfo.startTime,
					endTime: this.themeInfo.endTime
				}).then(res => {
					if(res.code == 200){
						this.verity = 1;
						this.role = res.data.role;  // 主讲 副讲
						this.judgeSignalUrl = res.data.url;   // 互动地址
						this.dvConfig = {
							cacheTime: res.data.cacheTime,
							maxBandwidth: res.data.maxBandwidth,
							minBandwidth: res.data.minBandwidth,
							maxFrameRate: res.data.maxFrameRate,
							minFrameRate: res.data.minFrameRate,
						}
						setTimeout(() => {
							this.verity = 2;
							if(this.isLocal == 'localRoom'){
								// 本机已硬件检测流媒体信号
								this.localInPush();
							}else {
								this.judgeSignal(res.data.id);
							}
						}, 2000)
					}
				})
				}else {
					this.$axios.get('/sm/interactive/auditPassWord', { id: this.$route.query.id, auditPassWord: this.code}).then(res => {
						if(res.data == true) {
							this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&isBystanderIn=1`);
						}else {
							this.$message('验证码错误', 'error')
						}
					})
				}
			},
			// 校内本机跳转
			localInPush(){
				if(this.role == 1){ //主讲
					// this.$router.push(`/mainroom?id=${this.$route.query.id}&room=${this.classroomId}&isLocalSign=1&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
					this.$router.push('newRoom')
				}else{
					this.$router.push(`/assistantroom?id=${this.$route.query.id}&room=${this.classroomId}&isLocalSign=1&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
				}
			},
			// 校外本机跳转
			localOutPush() {
				if(this.thisIdentity == 1){ //主讲
					this.$router.push(`/mainroom?id=${this.$route.query.id}&room=${this.classroomId}&type=${this.thisIdentity}&mainId=${this.mainId}&isLocalSign=1&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
				}else{
					this.$router.push(`/assistantroom?id=${this.$route.query.id}&room=${this.classroomId}&type=${this.thisIdentity}&mainId=${this.mainId}&isLocalSign=1&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
				}
			},
			//检测流媒体信号
			judgeSignal(){
				const url = this.isOut ? "/sys/crossSchoolInteraction/checkUrl" : "/sm/interactive/checkUrl";
				this.$axios.get(url, {url: this.judgeSignalUrl}).then(res => {
					if(res.code == 200 && res.data){
						setTimeout(() => {
							if (this.isOut) { // 校外
								if(this.thisIdentity == 1){ //主讲
									this.$router.push(`/mainroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&type=${this.thisIdentity}&mainId=${this.mainId}&isOut=${this.isOut}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
								}else{
									this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&type=${this.thisIdentity}&mainId=${this.mainId}&isOut=${this.isOut}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
								}
							} else { // 校内
								if(this.userType == 1){ //主讲
									this.$router.push(`/mainroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
								}else{
									this.$router.push(`/assistantroom?id=${this.$route.query.id}&name=${this.themeInfo.name}&room=${this.classroomId}&url=${this.judgeSignalUrl}&cacheTime=${this.dvConfig.cacheTime}&maxBandwidth=${this.dvConfig.maxBandwidth}&minBandwidth=${this.dvConfig.minBandwidth}&maxFrameRate=${this.dvConfig.maxFrameRate}&minFrameRate=${this.dvConfig.minFrameRate}`);
								}
							}
						}, 2000)
					}else{
						this.$axios.get('/sm/interactive/deleteTerminal', {id: this.themeInfo.id}).then(res => {})
						this.verity = 0;
					}
				});
			},
			//更新互动观看数
			addViewed(id,type){
				return
			},
			//获取主题名字
			getThemeInfo(){
				const url = this.isOut ? '/sys/crossSchoolInteraction/info' : '/sm/interactive/participateInfo' // sys校外
				this.$axios.get(url, {id: this.$route.query.id || 0}).then(res => {
					if(res.code == 200){
						if(res.data){
							this.themeInfo = res.data;
							this.checkUser();
							this.addViewed(res.data.id,this.isOut ? 2 : 1);
						}else{
							// this.$message('您访问的地址有误，请核对互动课堂地址', 'error');
							// this.$router.replace('/home');
						}
					}
				});
			},

			startTips(){
				this.startVisible = true;
			}
		},
		filters: {
			roleType(index){
				//0学生 1老师 2管理员
				let arr = ['学生', '教师', '管理员'];
				return arr[index];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
.sourceTips {
	text-align: center;
	font-size: 12px;
	color: #999;
}
	.mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba($color: #000000, $alpha: 0.7);
			z-index: 1;
		}
  .backtrack {
    color: #999;
    font-size: 13px;
    text-align: center;
    padding-top: 20px;

    span {
			cursor: pointer;
			position: relative;
			top: -355px;
			left: 153px;
    }
  }

	.interact-wrap{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.dialog-item{
		margin-bottom: 23px;
		p:first-child{
			width: 85px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
		}
	}

	.width-4{
		width: 108px;
	}
	header{
		width: 100%;
		height: 68px;
		font-size: 18px;
		background: #fff;
		color: #111;
		nav{
			width: 1200px;
			height: 40px;
			padding: 12px;
			margin: 0 auto;
			background: #fff;
			.logo-name{
				display: flex;
				align-items: center;
				float: left;
				height: 100%;
				img{
					width: 160px;
					max-height: 60px;
					vertical-align: middle;
				}
				.system-name{
					cursor: pointer;
					max-width: 220px;
					margin-left: 10px;
					font-weight: 700;
					font-size: 16px;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					/*! autoprefixer: off */
					-webkit-box-orient: vertical
				}
				.line{
					position: relative;
					top: -1px;
					font-weight: bold;
					margin-left: 10px;
				}
			}
			.account{
				float: right;
				cursor: pointer;
				.login-out{
					text-align: center;
					font-size: 30px;
					color: #232323;
					p{
						font-size: 12px;
					}
				}
				.login-out:hover{
					color: #2CBCF0;
				}
				.login-out:hover i{
					color: #2CBCF0;
				}
				.login{
					position: relative;
					display: flex;
					align-items: center;
					text-align: right;
					line-height: 16px;
					.name{
						max-width: 74px;
						white-space: nowrap;
    				display: inline-block;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						font-size: 16px;
						font-weight: 600;
						color: #222;
					}
					.type{
						font-size: 12px;
						color: #999999;
					}
					i{
						font-size: 8px;
						color: #222;
					}
					.down-list{
						display: none;
						position: absolute;
						z-index: 100;
						top: 30px;
						right: 0px;
						border-top: solid 15px rgba(0, 0, 0, 0);
						li{
							width: 122px;
							line-height: 40px;
							text-align: center;
							font-size: 12px;
							color: #111;
							background: #fff;
							i{
								margin-right: 12px;
								font-size: 20px;
								vertical-align: middle;
							}
						}
						li:hover{
							background: #035AFF;
							color: #fff;
						}
						li:hover i{
							color: #fff;
						}
					}
				}
				.login:hover .down-list{
					display: block;
				}
			}
		}
	}
	.login-content{
		font-size: 14px;
		p{
			width: 334px;
			height: 40px;
			margin: 0 0 25px 24px;
			line-height: 40px;
			color: #303133;
		}
		.login-btn{
			width: 334px;
			height: 40px;
			margin: 10px 0 0 24px;
		}
		.input{
			width: 285px;
		}
	}
	.special {
		background-image: url("../../../assets/imgs/special-bg.png") !important;
	}
	.content-wrap{
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		background-image: url("../../../assets/imgs/interact-bg.png");
		.content{
			width:833px;
			height:380px;
			margin-top: -100px;
			border-radius:4px;
			background: #fff;
			.title{
				font-size: 24px;
				text-align: center;
				line-height: 102px;
				font-weight:bold;
				color: #303133;
			}
			.content-info{
				display: flex;
				justify-content: space-between;
				width: 723px;
				margin: 0 auto;
			}
			.class-info{
				position: relative;
				min-width: 345px;
				width: 345px;
				height: 231px;
				img{
					width: 100%;
					border-radius: 10px;
					height: 100%;
				}
				.class-name{
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					line-height: 30px;
					text-align: center;
					font-size: 18px;
					color: #fff;
					background: rgba(0, 0, 0, .6);
				}
			}

			.selectBtn {
				width: 340px;
				display: flex;
				justify-content:center;
				align-items:center;
				flex-direction: column;

				.parcel {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;
				}

				.buttonPrimary {
					width: 100px;
					margin-top: 25px;
					margin-left: 0;
				}
				
				.sourceTips {
					font-size: 12px;
					color: #999;
					margin: 10px 0;
				}
				.chooseSource {
					display: flex;
					flex-direction: column;
					align-items: center;


					.sourceBtn {
						height: 40px;
						width: 150px;
						margin-top: 18px;
						margin-left: 0;
						background: #409EFF ;
						border:none;
						border-radius: 5px;
						color: #fff;
						cursor: pointer;
					}
					.sourceBtn:last-child{
						width: 100px;
						height: 26px;
						line-height: 26px;
						font-size: 12px; 
						margin-top: 25px;
						background: #86b6e7;
					}
					.sourceBtn:hover {
						background: #6fbeff ;
					}
				}
			}

			.login-wrap{
				.parcel {
					margin-right: 136px;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;

					.buttonPrimary {
						width: 100px;
						margin-top: 25px;
						margin-left: 0;
					}
				}
				.item{
					width: 60px;
					height: 40px;
					line-height: 40px;
					text-align: justify;
				}
				.item:after{
					content: '';
					display: inline-block;
					width: 100%;
				}
				.mainCode {
					display: flex;
					flex-direction: column;
					align-items: center;
					.sourceTipsMain,.sourceTips {
						font-size: 12px;
						color: #999;
						margin: 40px 0;
					}

					.sourceTips {
						margin: 30px 0;
					}

					.miansourceBtn,.sourceBtn {
						height: 40px;
						width: 150px;
						margin-top: 26px;
						margin-left: 65px;
						background: #409EFF ;
						border:none;
						border-radius: 5px;
						color: #fff;
						cursor: pointer;
					}

					.backBtn{
						width: 100px;
						height: 26px;
						line-height: 26px;
						font-size: 12px;
						margin-top: 25px;
						margin-left: 62px;
						border:none;
						border-radius: 5px;
						color: #fff;
						background: #86b6e7;
						cursor: pointer;
					}
					.sourceBtn {
						margin-top: 8px;
					}
					.backBtn:hover,.miansourceBtn:hover,.sourceBtn:hover {
						background: #6fbeff ;
					}
				}
				.chooseSource {
					display: flex;
					flex-direction: column;
					align-items: center;

					.sourceTips {
						font-size: 12px;
						color: #999;
						margin: 10px 0;
					}

					.sourceBtn {
						height: 40px;
						width: 150px;
						margin-top: 18px;
						margin-left: 0;
						background: #409EFF ;
						border:none;
						border-radius: 5px;
						color: #fff;
						cursor: pointer;
					}
					.sourceBtn:last-child{
						width: 100px;
						height: 26px;
						line-height: 26px;
						font-size: 12px;
						margin-top: 25px;
						background: #86b6e7;
					}
					.sourceBtn:hover {
						background: #6fbeff ;
					}
				}
			}
		}

	}

	.sourceBtns-box{
		display: flex;
	}
	.sourceBtns {
		height: 40px;
		width: 150px;
		margin: 0 auto;
		background: #409EFF ;
		border:none;
		border-radius: 5px;
		color: #fff;
		cursor: pointer;
	}
	.sourceBtns:hover {
		background: #6fbeff ;
	}
	
	.verity-step{
		text-align: center;
		img{
			width: 245px;
			margin-top: 55px;
		}
		.step-name{
			margin-top: 26px;
			font-size: 16px;
			color: #555;
		}
	}
	.starth3 {
    text-align: center;
    margin: 0;
  }
  .startStep {
    padding: 20px 0 20px 20px;
    p {
      margin-top:30px;
    }
    img {
			margin-top:30px;
      width:630px;
    }
  }
	.finish-title{
		width: 300px;
		text-align: center;
		font-size: 16px;
		margin-top: 30%;
	}
	.hiddenInput {
    width: 0;
    height: 0;
		display: none;
}
.juzhong{
		margin-left: 92px;
	}
</style>