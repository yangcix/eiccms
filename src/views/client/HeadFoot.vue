<template>
  <div style="min-height:937px;position:relative;min-width: none;">
    <!-- 当前为3.5.1.1版本 -->
    <div class="nav-virtual"></div>
    <header>
      <nav>
        <div class="logo-name">
          <img :src="logoImg" alt="" :onerror="defaultImg">
          <span class="line">|</span>
          <p class="system-name" @click="goHome" :title="systemName">{{ systemName }}</p>
        </div>
        <div class="account">
          <div class="login-out" v-if="!userInfo"
               @click="remember = false;account = '';password = '';loginShow = true;">
            <!-- <i class="iconfont iconsignin login-out"></i> -->
            <img src="@/assets/imgs/login.png" alt="" class="login-out">
            <p>登录</p>
          </div>
          <div class="login" v-else>
            <div>
              <p class="name" :title='userInfo.nickName'>{{ userInfo.nickName }}</p>
              <p class="type"
                 v-if="(userInfo.account !== 'super' && userInfo.account !== 'admin') && userInfo.roleType == 2 ">
                其他</p>
              <p class="type" v-else>{{ userInfo.roleType | roleType }}</p>
            </div>
            <i class="el-icon-caret-bottom" style="font-size:20px;color:#305BFF"></i>
            <transition name="fade">
              <ul class="down-list">
                <li @click="enterSystem" v-if="mainInfo.systemPermission">
                  <i class="el-icon-monitor"></i>
                  <span>进入后台</span>
                </li>
                <li @click="goUserHome">
                  <i class="el-icon-discount"></i>
                  <span>个人中心</span>
                </li>
                <li @click="openShow">
                  <i class="el-icon-lock"></i>
                  <span>修改密码</span>
                </li>
                <li @click="goHelpHome">
                  <i class="el-icon-sunny"></i>
                  <span>帮助中心</span>
                </li>
                <li @click="tologOut">
                  <i class="el-icon-switch-button"></i>
                  <span>退出登录</span>
                </li>
              </ul>
            </transition>
          </div>
        </div>
        <ul class="nav-list">
          <li v-for="(val, index) in navList"
              :key="index"
              :class="{'nav-active': val.route == currentActive  }"
              @click="navTo(val, index)">{{ val.name }}
          </li>
          <li class="search">
            <input type="text" autocomplete="new-password" placeholder="请输入搜索内容" v-model="searchKey"
                   @keyup.enter="search">
            <p class="search-btn"><i class="iconfont icon-search" @click="search"></i></p>
          </li>
        </ul>
      </nav>
    </header>

    <div class="router-wrap">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>

    <el-backtop></el-backtop>

    <footer>
      <div class="wrap">
        <div class="company-technology">
          <p>主办单位：{{ systemInfo.sponsor }}</p>
          <p>运维单位：{{ systemInfo.company }}</p>
          <p><span><a :href="systemInfo.icpRecordUrl !== null ? systemInfo.icpRecordUrl : 'javascript:void(0)'"
                      :target="systemInfo.icpRecordUrl == null ? '' : '_blank'">{{ systemInfo.icpRecord }}</a></span>
            <span style="margin-left: 10px"><a
                :href="systemInfo.recordUrl !== null ? systemInfo.recordUrl : 'javascript:void(0)'"
                :target="systemInfo.recordUrl == null ? '' :'_blank'">{{ systemInfo.record }}</a></span></p>
        </div>
      </div>
    </footer>

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
        title="用户登录"
        :close-on-click-modal="false"
        :visible.sync="loginShow"
        width="420px">
      <div class="login-content">
        <p>账号：
          <el-input class="input" @keyup.native.enter="login" v-model.trim="account"></el-input>
        </p>
        <p>密码：
          <el-input class="input" type="password" @keyup.native.enter="login" v-model="password"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </p>
        <p>
          <el-checkbox v-model="remember">自动登录</el-checkbox>
        </p>
        <el-button type="primary" class="login-btn" @click="login">登 录</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="修改密码"
        :close-on-click-modal="false"
        :close-on-press-escape="mainInfo.needModifiedPassword == true ? false : true"
        :visible.sync="pwdShow"
        :show-close="mainInfo.needModifiedPassword == true ? false : true"
        :before-close="closeChangePwd"
        width="420px">
      <div class="dialog-wrap">
        <p class="err-title" v-if="errorInfo">{{ errorInfo }}</p>
        <!-- <div class="hiddenInput">
          <el-input></el-input>
          <el-input></el-input>
        </div> -->
        <div class="dialog-item">
          <p>原密码</p>
          <p><em>*</em>：</p>
          <el-input class="width-2" type="password" v-model="pwdInfo.old"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </div>
        <div class="dialog-item">
          <p>新密码</p>
          <p><em>*</em>：</p>
          <el-input class="width-2" type="password" v-model="pwdInfo.new"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </div>
        <div class="dialog-item">
          <p>确认密码</p>
          <p><em>*</em>：</p>
          <el-input class="width-2" type="password" v-model="pwdInfo.again"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </div>
        <div class="dialog-btn">
          <el-button type="primary" @click="updatePwd">确 定</el-button>
          <el-button @click="closeChangePwd">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="changeShow"
        :close-on-press-escape="false"
        :show-close="false"
        width="420px">
      <div class="dialog-wrap">
        <p style="margin: 20px 0 40px 0;font-size: 15px;">您的密码安全等级低，请修改密码！</p>
        <div class="dialog-btn">
          <el-button type="primary" @click="pwdShow = true;changeShow = false" style="margin: 0 auto;">立即修改
          </el-button>
          <!-- <el-button v-if="mainInfo.needModifiedPassword == false" @click="closeChangePwd">取 消</el-button> -->
        </div>
      </div>
    </el-dialog>
    <el-dialog
        title="分析次数预警"
        :close-on-click-modal="false"
        :visible.sync="aiEarlyWarningShow"
        style="margin-top: 16vh"
        width="560px"
        @close="closeEarlyWarningDialog"
    >
      <div class="dialog-wrap">
        <p style="font-size: 17px">
          分析次数剩余<span style="color: red;font-weight: bold;font-size: 20px"> {{ remainingAnalysis }} </span>次，请及时联系商务人员进行充值！
        </p>
        <div class="dialog-btn">
          <el-button type="primary" @click="closeEarlyWarningDialog()"
                     style="margin: 40px 0 0 320px;"
          >关 闭
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        title="到期提醒"
        :close-on-click-modal="false"
        :visible.sync="tryoutShow"
        style="margin-top: 16vh"
        width="600px"
        @close="closeTryoutDialog"
    >
      <div class="dialog-wrap" v-if="expirationDate">
        <p style="font-size: 17px">
          系统将于<span style="color: red;font-weight: bold;font-size: 20px"> {{ expirationDate }} </span>到期，请及时联系商务人员！
        </p>
        <div class="dialog-btn">
          <el-button type="primary" @click="closeTryoutDialog()"
                     style="margin: 40px 0 0 320px;"
          >关 闭
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MD5 from 'js-md5';
import {Message} from 'element-ui';
import {session, judgeMobile, storage, kickUrl} from '@/assets/js/utils';
import wsMixin from "@/components/wsMixin.vue";
import {mapState, mapMutations} from 'vuex';

export default {
  mixins: [wsMixin],
  name: 'headFoot',
  data() {
    return {
      navList: [{
        name: '首页',
        route: '/home'
      }, {
        name: '课程录制',
        route: '/live',
        url: 'hplay'
      },
        {
          name: '视频上传',
          route: '/video',
          url: 'vplay'
        },
        /*{
          name: '互动课堂',
          route: '/interaction',
          url: 'interact'
        },*/
        {
          name: '智能研修',
          route: '/training',
          url: 'training'
        },
        // {
        // 	name: '音美教学',
        // 	route: 'https://imusic.ixzds.com/myjypt/myjypt/pages/login/login.html?&TOP_ORGCODE=scsmysjyj',
        // 	url: 'https://imusic.ixzds.com/myjypt/myjypt/pages/login/login.html?&TOP_ORGCODE=scsmysjyj'
        // }
      ],
      currentActive: '/home',
      searchKey: '',
      userInfo: '',
      logOutShow: false,
      loginShow: false,
      account: '',
      password: '',
      mainInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
      changeShow: false,
      pwdShow: false,
      remember: false,
      pwdInfo: {},
      systemInfo: {},
      errorInfo: '',
      systemName: '',
      logoImg: '',
      websock: null,
      loginType: "web",
      defaultImg: 'this.src="' + require('@/assets/imgs/logo.png') + '"', // 默认图片
      // AI次数预警dialog
      aiEarlyWarningShow: false,
      // 努比AI剩余次数
      remainingAnalysis: 0,
      tryoutShow: false,
      expirationDate: '',
    }
  },
  components: {},
  provide() {
    return {
      openPassword: this.openPassword,
      openLoginShow: this.showMsg
    }
  },
  beforeCreate() {
    let needJudgeList = ['/home', '/live', '/back', '/video'];
    if (judgeMobile() && needJudgeList.includes(this.$route.path)) {
      this.$router.replace('/mobile' + this.$route.path);
    }
  },
  computed: {
    // isLogin() {
    // 	return this.userInfo !== null;
    // }
    ...mapState({
      storeSearchKey: 'searchKey',
      isLoginReflash: 'loginRefalsh'
    })
  },
  mounted() {
    this.$store.dispatch('commitChatLogin', localStorage.getItem('chatLogin'))
    if (!storage.get("time")) storage.set("time", new Date().getTime())
    this.setNavActive();
    this.getUserInfo();
    this.getLogo();
    this.getSystemInfo();
    if (this.mainInfo.needModifiedPassword == true && localStorage.getItem('chatLogin') !== 'null') {
      this.changeShow = true;
    } else {
      this.changeShow = false;
    }
    // this.searchKey = this.$route.query.key ? this.$route.query.key : '';
  },
  methods: {
    openPassword() {
      this.pwdShow = true;
    },
    goHome() {
      this.$router.replace('/home')
    },
    showMsg() {
      this.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
      this.loginShow = true;
    },
    toLogin() {
      this.$router.push("/home");
    },
    ...mapMutations(['setSearchKey', 'setloginRefalsh']),
    //获取基本信息
    getSystemInfo() {
      this.$axios.get('index/info').then(res => {
        this.systemInfo = res.data.resData;
        if (this.systemInfo.icpRecordUrl && this.systemInfo.icpRecordUrl.slice(0, 7) !== 'http://' && this.systemInfo.icpRecordUrl.slice(0, 8) !== 'https://') {
          this.systemInfo.icpRecordUrl = 'http://' + this.systemInfo.icpRecordUrl;
        }
        if (this.systemInfo.recordUrl && this.systemInfo.recordUrl.slice(0, 7) !== 'http://' && this.systemInfo.recordUrl.slice(0, 8) !== 'https://') {
          this.systemInfo.recordUrl = 'http://' + this.systemInfo.recordUrl;
        }
        window.localStorage.setItem('uiType', res.data.resData.uiType);
      });
    },
    //获取平台logo和名字
    getLogo() {
      this.$axios.get('/index/systemInfo').then(res => {
        // let img = new Image()
        // img.src = res.data.pcLogo
        // img.onload = ()=>{
        // 		this.logoImg = res.data.pcLogo;
        // }
        // img.onerror = ()=>{
        // 	this.logoImg = this.defaultImg.split('=')[1]
        // }
        // if (res.code == 200 && res.status == 0) {
        //   console.log("获取平台是否可以进入试用页面：", res.data?.status === 0 );
        //   this.$nextTick(() => {
        //     this.$router.replace('/expire');
        //   })
        // }
        this.logoImg = res.data.pcLogo;
        this.systemName = res.data.name;
        if (res.data.nationalPlatformUrl) {
          this.navList.push({
            name: '国家平台',
            route: '/nationalPlatformUrl',
            url: res.data.nationalPlatformUrl
          })
        }
        document.title = res.data.name ? res.data.name : '劢联科技';
        session.set('userInfo', res.data);
        localStorage.setItem('version', res.data.version)
        localStorage.setItem('uiType', res.data.uiType);
      });
    },
    //路由跳转
    navTo(val, index) {
      // console.log(val.route.indexOf('https://'))
      if (val.route == '/nationalPlatformUrl') {
        if (val.url && val.url.slice(0, 7) !== 'http://' && val.url.slice(0, 8) !== 'https://') {
          val.url = 'http://' + val.url
        }
        window.open(val.url, '_target')
        return;
      }
      if (val.route.indexOf('https://') == 0) {
        window.open(val.route, '_blank')
        return
      }
      this.currentActive = val.route;
      this.$router.replace(val.route);
    },
    //设置导航选中
    setNavActive() {
      this.currentActive = this.$route.path;
    },
    //进入后台
    enterSystem() {
      let routeUrl = this.$router.resolve({
        path: `/traininghome?time=${storage.get('time')}`
      });
      this.$axios.get('/auth/menu').then(res => {
        if (res.data) {
          window.open(routeUrl.href, '_blank');
        }
      })
    },
    //搜索
    search() {
      this.setSearchKey(this.searchKey)
      this.$router.push({path: '/search'});
    },
    // 退出提醒
    tologOut(row) {
      this.logOutShow = true;
      // this.$confirm('确认退出登录?', '退出提示', {
      // 	confirmButtonText: '确定',
      // 	cancelButtonText: '取消',
      // 	type: 'warning'
      // }).then(() => {
      // 	this.logOut();
      // }).catch(() => {});
    },
    //退出登录
    logOut() {
      this.$axios.get('/auth/signOutBackStage').then(res => {
        if (res.code == 200) {
          this.setloginRefalsh(false)
          session.set('systemMenuList', '');
          this.logOutShow = false;
          this.$message(res.message, 'success');
          localStorage.setItem('chatLogin', false)
          this.$store.dispatch('commitChatLogin', localStorage.getItem('chatLogin'))
          // this.getUserInfo();
          // this.websock.close();
          const params = {
            type: "logout",
            account: this.userInfo.account,
            loginType: "web",
          };
          this.$store.commit('delete');
          setTimeout(() => {
            location.reload()
            this.websocketsend(JSON.stringify(params));
          }, 500);
        }
      })
    },
    //获取用户信息
    getUserInfo() {
      this.$axios.get('/index/getUserInfo').then(res => {
        this.userInfo = res.data;
        localStorage.setItem('chatLogin', JSON.stringify(this.userInfo))
        this.$store.dispatch('commitChatLogin', localStorage.getItem('chatLogin'))
        if (this.userInfo) {
          if (this.websock) this.websock.close(); // 关闭在建立
          this.handleGetWebsocket(); // 需要登录建立长连接
          // console.log('需要登录建立长连接' + process.env.NODE_ENV);
        }
      });
    },
    async login() {
      console.log(this.isLoginReflash)
      Message.closeAll();
      if (this.$verify.isEmpty(this.account)) {
        this.$message('账号不能为空', 'error');
      } else if (this.$verify.isEmpty(this.password)) {
        this.$message('密码不能为空', 'error');
      } else {
        this.$axios.post('/auth/login', {
          account: this.account,
          password: MD5(this.password),
          remember: this.remember,
          loginType: "web",
          type: 0
        }).then(async res => {
          if (res.code == 200) {
            if (this.websock) this.websock.close();
            // this.userInfo = res.data;
            this.getUserInfo();
            window.localStorage.setItem('isAdmin', res.data.adminOrSuper)
            res.data.password = MD5(this.password);
            window.localStorage.setItem('userInfo', JSON.stringify(res.data));
            this.$store.commit('setAccount', this.account);
            this.setloginRefalsh(true)
            console.log(this.isLoginReflash)
            // this.account = '';
            // this.password = '';
            this.$message('登录成功', 'success');
            this.loginShow = false;
            console.log(this)
            console.log("登录啦登录啦 Client");

            // this.handleGetWebsocket();
            const earlyWarning = await this.$axios.get("/aiEarlyWarning/getRemind", {});
            if (earlyWarning.code === 200) {
              this.aiEarlyWarningShow = earlyWarning.data;
            }
            const totalRemaining = await this.$axios.get("/Api/getTotalRemaining", {});
            if (totalRemaining.code === 200) {
              this.remainingAnalysis = totalRemaining.data;
            }
            const tryoutConfig = await this.$axios.get("/tryout/getConfig", {});
            if (tryoutConfig.code === 200) {
              this.expirationDate = tryoutConfig.data?.expirationDate;
            }
            const tryoutRemind = await this.$axios.get("/tryout/getRemind", {});
            if (tryoutRemind.code === 200) {
              this.tryoutShow = tryoutRemind.data;
            }

            // this.getAiEarlyWarningCount();
            // this.getAiEarlyWarningRemind();
            // this.getTryoutConfig();
            // this.getTryoutRemind();

            console.log("分析次数告警是否弹窗：", this.aiEarlyWarningShow);
            console.log("系统试用告警是否弹窗：", this.tryoutShow);
            if (!this.aiEarlyWarningShow && !this.tryoutShow) {
              this.reload();
            }
          }
        })
      }
    },
    reload() {
      console.log("刷新页面咯！")
      location.reload()
    },
    openShow() {
      this.errorInfo = ''
      this.pwdInfo = {}
      this.pwdShow = true;
    },
    goHelpHome() {
      window.open('/helpHome', '_blank')
    },
    goUserHome() {
      window.open('/userHome', '_blank')
    },
    //修改密码
    updatePwd() {
      if (this.$verify.isEmpty(this.pwdInfo.old)) {
        return this.errorInfo = '请填写原密码';
      }
      if (this.$verify.isEmpty(this.pwdInfo.new)) {
        return this.errorInfo = '请填写新密码';
      }
      if (this.pwdInfo.old == this.pwdInfo.new) {
        return this.errorInfo = '原密码与新密码不能一致';
      }
      if (!this.$verify.checkPW(this.pwdInfo.new)) {
        return this.errorInfo = '新密码必须由6-20位数字、大小写字母组成，至少含2种！';
      }
      if (this.$verify.isEmpty(this.pwdInfo.again)) {
        return this.errorInfo = '请填写确认密码';
      }
      if (this.pwdInfo.new != this.pwdInfo.again) {
        return this.errorInfo = '新密码和确认密码不一致';
      }
      this.$axios.post('/sys/user/updatePwdBackStage', {
        newPwd: MD5(this.pwdInfo.new),
        oldPwd: MD5(this.pwdInfo.old),
      }).then(res => {
        this.errorInfo = ''
        if (res.code == 200) {
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
    // 获取分析次数预警
    async getAiEarlyWarningRemind() {
      await this.$axios.get("/aiEarlyWarning/getRemind").then((res) => {
        if (res.code == 200) {
          this.aiEarlyWarningShow = res.data
        }
      });
    },
    // 获取努比AI剩余次数
    async getAiEarlyWarningCount() {
      await this.$axios.get("/Api/getTotalRemaining").then((res) => {
        if (res.code == 200) {
          this.remainingAnalysis = res.data
        }
      });
    },
    // 获取试用配置
    async getTryoutConfig() {
      await this.$axios.get("/tryout/getConfig").then((res) => {
        if (res.code == 200) {
          this.expirationDate = res.data.expirationDate;
        }
      });
    },
    // 获取试用到期提醒
    async getTryoutRemind() {
      await this.$axios.get("/tryout/getRemind").then((res) => {
        if (res.code == 200) {
          this.tryoutShow = res.data
        }
      });
    },
    closeEarlyWarningDialog() {
      // 让后台知道用户已经确认这个问题了
      this.$axios.post("/aiEarlyWarning/updateRemindUser").then((res) => {
        if (res.code == 200) {
          this.aiEarlyWarningShow = false;
          this.reload();
        }
      });
    },
    closeTryoutDialog() {
      // 让后台知道用户已经确认这个问题了
      this.$axios.post("/tryout/updateRemindUser").then((res) => {
        if (res.code == 200) {
          this.tryoutShow = false;
          this.reload();
        }
      });
    }
  },
  beforeDestroy() {
    if (this.websock) this.websock.close();
  },
  watch: {
    $route(to, from) {
      if (to.path == '/home' || to.path == '/live' || to.path == '/video') {
        this.currentActive = this.$route.path;
      }
    }
  },
  filters: {
    roleType(index) {
      //0学生 1老师 2管理员
      let arr = ['学生', '教师', '管理员'];
      return arr[index];
    }
  }
}
</script>

<style lang="scss">
.hiddenInput {
  width: 0;
  height: 0;

  .el-input__inner {
    border: none;
    padding: 0;
    width: 0;
    height: 0;
  }
}
</style>
<style lang="scss" type="text/scss" scoped>
.dialog-item {
  p:first-child {
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
  }
}

.nav-virtual {
  height: 68px;
}

header {
  position: fixed;
  top: 0;
  // z-index: 99;
  z-index: 1998;
  width: 100%;
  height: 68px;
  font-size: 18px;
  background: #fff;
  color: #111;
}

nav {
  max-width: 1200px;
  min-width: 900px;
  height: 40px;
  padding: 12px;
  margin: 0 auto;
  background: #fff;

  .logo-name {
    display: flex;
    align-items: center;
    float: left;
    height: 100%;
    color: #0049a7;

    img {
      width: 160px;
      max-height: 60px;
      vertical-align: middle;
    }

    .system-name {
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

    .line {
      position: relative;
      top: -1px;
      font-weight: bold;
      margin-left: 10px;
    }
  }

  .nav-list {
    // float: right;
    display: flex;
    margin-right: 22px;
    align-items: center;
    line-height: 40px;
    cursor: pointer;

    li {
      // margin-left: 80px;
      flex: 1;
      text-align: center;
      font-size: 16px;
      -webkit-touch-callout: none;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
      transition: all .2s;
    }

    li:hover {
      color: #035AFF;
      font-weight: 400;
      transform: scale(1.1);
    }

    .search {
      position: relative;
      overflow: hidden;
      min-width: 140px;
      height: 35px;
      border: 1px solid #E7E7E7;
      border-radius: 2px;
      background: #fff;

      input {
        position: relative;
        top: -4px;
        left: -2px;
        width: 150px;
        height: 39px;
        text-indent: 14px;
        font-size: 12px;
        color: #999999;
        background: #fff;
      }

      .search-btn {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 34px;
        background: #fff;

        i {
          position: relative;
          top: -2px;
          left: 6px;
          font-size: 16px;
          color: #E7E7E7;
        }
      }
    }
  }

  .nav-active {
    color: #035AFF;
    position: relative;
    transition: width 2s;
  }

  .nav-active::after {
    content: '';
    width: 32px;
    height: 4px;
    // border-radius: 2px;
    border-radius: 40%;
    background: -webkit-linear-gradient(#2770f7, #035AFF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#2770f7, #035AFF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#2770f7, #035AFF); /* Firefox 3.6 - 15 */
    background: linear-gradient(#2770f7, #035AFF); /* 标准的语法 */
    position: absolute;
    bottom: 1px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .account {
    float: right;
    cursor: pointer;
    padding-left: 40px;

    .login-out {
      text-align: center;
      width: 24px;
      height: 24px;
      color: #035AFF;
      transition: all .3s;
      margin-top: 1px;

      p {
        font-size: 12px;
        position: relative;
        left: 1px;
      }
    }

    .login-out:hover {
      transform: scale(1.1);
    }

    .login {
      position: relative;
      display: flex;
      align-items: center;
      text-align: center;
      line-height: 19px;
      top: 2px;

      .name {
        max-width: 74px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-size: 16px;
        font-weight: 600;
        color: #222;
      }

      .type {
        font-size: 12px;
        color: #999999;
      }

      i {
        font-size: 8px;
        color: #222;
      }

      .down-list {
        display: none;
        position: absolute;
        z-index: 100;
        top: 30px;
        right: -26px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
        transition: all 4s;

        border-top: solid 2px rgba(0, 0, 0, 0);

        li {
          width: 122px;
          line-height: 40px;
          text-align: center;
          font-size: 12px;
          color: #111;
          background: #fff;

          i {
            margin-right: 12px;
            font-size: 20px;
            vertical-align: middle;
            transition: transform 0.5s;
          }
        }

        li:first-child {
          border-radius: 8px 8px 0 0;
        }

        li:last-child {
          border-radius: 0 0 8px 8px;
        }

        li:hover {
          background: #035AFF;
          color: #fff;

        }

        li:hover i {
          color: #fff;
          display: inline-block;
          transform: rotate(20deg);
        }
      }
    }

    .login:hover .down-list {
      display: block;
      top: 38px;
    }

    .el-icon-caret-bottom {
      transition: transform 0.4s;
    }

    .login:hover .el-icon-caret-bottom {
      transform: translateY(10px);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

.router-wrap {
  min-height: 724px;
  overflow: auto;
}

footer {
  width: 100%;
  height: 95px;
  margin-top: 50px;
  background: #2F3742;

  .wrap {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    color: #585858;
    opacity: 0.8;
    // background: #2F3742;
    a {
      text-decoration: none;
      color: #585858;
    }

    .company-technology {
      color: #FFFFFF;
      text-align: center;

      a {
        color: #FFFFFF;
      }
    }
  }
}

.login-content {
  font-size: 14px;

  p {
    width: 334px;
    height: 40px;
    margin: 0 0 25px 24px;
    line-height: 40px;
    color: #303133;
  }

  .login-btn {
    background: #305BFF;
    border-color: #035AFF;
    width: 334px;
    height: 40px;
    margin: 10px 0 0 24px;
  }

  .input {
    width: 285px;
  }
}

.juzhong {
  margin-left: 92px;
}
</style>
