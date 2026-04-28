<template>
    <div class="content-wrap">
        <el-container class="content-wrap">
            <uploadBox></uploadBox>
            <aiUploadBox></aiUploadBox>
            <el-container>
                <div v-show="showMenu">
                    <el-menu
                        ref="elMenu"
                        :unique-opened="true"
                        :default-active="$route.path"
                        :router="true"
                        @open="handleOpen"
                        :default-openeds="KeyIndex"
                        class="el-menu-vertical-demo"
                        :collapse="isCollapse"
                    >
                        <div class="menu-head">
                            <img src="../../assets/imgs/system-logo.png" alt="" v-if="!isCollapse" @click="goHome" />
                            <p v-else></p>
                            <i class="iconfont icon-gengduo" @click="isCollapse = !isCollapse"></i>
                        </div>

                        <!-- <el-menu-item :index="homeMenu.url" @click="selectMenu(homeMenu)" :class="{ 'is-active': homeMenu.url === currentIndex }"> -->
                        <el-menu-item
                            v-if="
                                (seeHome == 1 && sysModule == 1) ||
                                (rightHome == 1 && sysModule == 2) ||
                                (threeHome == 1 && sysModule == 3)
                            "
                            :index="homeMenu.url"
                            @click="selectMenu(homeMenu)"
                            :class="{'is-active': $route.path.indexOf(homeMenu.url) === 0}"
                        >
                            <i class="iconfont icon-gailan"></i>
                            <span style="margin-left: 9px" slot="title">概览</span>
                        </el-menu-item>

                        <el-submenu :index="index.toString()" v-for="(val, index) in menuList" :key="index">
                            <template slot="title">
                                <i class="iconfont m-menu-icon" :class="val.icon"></i>
                                <span slot="title">{{ val.name }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item
                                    :index="item.url"
                                    style="margin-left: 30px"
                                    v-for="(item, itemIndex) in val.children"
                                    :class="$route.path == item.url ? 'is-active' : ''"
                                    :key="itemIndex"
                                    @click="selectMenu(item)"
                                    >{{ item.name }}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </div>

                <el-container>
                    <el-header class="content-header" height="50px" v-show="showMenu">
                        <div class="moduleChange" v-show="showMenu">
                            <span class="moduleTitle" @click="changeModule(3)" :class="sysModule == 3 ? 'mActive' : ''"
                                >智能研修</span
                            >
                            <span class="moduleTitle" :class="sysModule == 1 ? 'mActive' : ''" @click="changeModule(1)"
                                >智慧教育</span
                            >
                            <span class="moduleTitle" :class="sysModule == 2 ? 'mActive' : ''" @click="changeModule(2)"
                                >微集控录播</span
                            >
                            <span
                                v-if="isShowProjectManage"
                                class="moduleTitle"
                                :class="sysModule == 5 ? 'mActive' : ''"
                                @click="changeModule(5)"
                                >项目次数管理</span
                            >
                            <span
                                v-if="isShowSetting"
                                class="moduleTitle"
                                :class="sysModule == 6 ? 'mActive' : ''"
                                @click="changeModule(6)"
                                >系统管理</span
                            >
                            <span
                                v-if="isShowDataBoard"
                                class="moduleTitle data_board_title"
                                @click="selectMenu({url: '/dataBoard', name: '大数据看板'})"
                                >大数据看板</span
                            >
                        </div>

                        <div class="user-info" v-show="showMenu">
                            <el-dropdown @command="handleCommand">
                                <div class="set-user">
                                    <img src="../../assets/imgs/user-head.png" alt="" />
                                    <span
                                        style="
                                            color: #fff;
                                            width: 60px;
                                            margin-left: 10px;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            display: inline-block;
                                        "
                                        :title="nickName"
                                        >{{ nickName }}</span
                                    >
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-lock" command="changePassword"
                                        >修改密码
                                    </el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-sunny" command="help">帮助中心 </el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-switch-button" command="loginOut"
                                        >退出登录
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-header>

                    <div class="content-main">
                        <keep-alive>
                            <router-view v-if="$route.meta.keepAlive"></router-view>
                        </keep-alive>
                        <router-view v-if="!$route.meta.keepAlive"></router-view>
                        <!-- <router-view/> -->
                    </div>

                    <el-footer v-if="(uiType = 1)" class="content-footer" height="30px" v-show="showMenu">
                        <div class="company">
                            <p>软件版本号：{{ verNum }}</p>
                            <p>运维单位：{{ systemInfo.company }}</p>
                        </div>
                    </el-footer>
                    <el-footer v-else class="content-footer" height="30px" v-show="showMenu">
                        <div class="company">
                            <p>Copyright © 2018 劢联科技 All Rights Reserved</p>
                            <p>软件版本号：{{ verNum }}</p>
                        </div>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="logOutShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">确定退出登录？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="logOut">确 定</el-button>
                    <el-button @click="logOutShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="修改密码"
            :close-on-press-escape="mainInfo.needModifiedPassword == true ? false : true"
            :show-close="mainInfo.needModifiedPassword == true ? false : true"
            :close-on-click-modal="false"
            :visible.sync="pwdShow"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-title" v-if="errorInfo">{{ errorInfo }}</p>
                <div class="dialog-item">
                    <p>原密码</p>
                    <p><em>*</em>：</p>
                    <el-input
                        class="width-2"
                        type="password"
                        v-model="pwdInfo.old"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    ></el-input>
                </div>
                <div class="dialog-item">
                    <p>新密码</p>
                    <p><em>*</em>：</p>
                    <el-input
                        class="width-2"
                        type="password"
                        v-model="pwdInfo.new"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    ></el-input>
                </div>
                <div class="dialog-item">
                    <p>确认密码</p>
                    <p><em>*</em>：</p>
                    <el-input
                        class="width-2"
                        type="password"
                        v-model="pwdInfo.again"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    ></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="updatePwd">确 定</el-button>
                    <el-button @click="pwdShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="changeShow"
            :show-close="false"
            :close-on-press-escape="false"
            width="420px"
        >
            <div class="dialog-wrap">
                <p style="margin: 20px 0 40px 0; font-size: 15px">您的密码安全等级低，请修改密码！</p>
                <div class="dialog-btn">
                    <el-button
                        type="primary"
                        @click="
                            pwdShow = true;
                            changeShow = false;
                        "
                        style="margin: 0 auto"
                        >立即修改
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
                    分析次数剩余<span style="color: red; font-weight: bold; font-size: 20px">
                        {{ remainingAnalysis }} </span
                    >次，请及时联系商务人员进行充值！
                </p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="closeEarlyWarningDialog()" style="margin: 40px 0 0 320px"
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
            <div class="dialog-wrap">
                <p style="font-size: 17px">
                    系统将于<span style="color: red; font-weight: bold; font-size: 20px"> {{ expirationDate }} </span
                    >到期，请及时联系商务人员！
                </p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="closeTryoutDialog()" style="margin: 40px 0 0 320px"
                        >关 闭
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import uploadBox from '@/components/uploadBox.vue';
import aiUploadBox from '@/components/aiUploadBox.vue';
import MD5 from 'js-md5';
import {Message} from 'element-ui';
import {session, creatTree, storage, kickUrl} from '@/assets/js/utils';
import wsMixin from '@/components/wsMixin.vue';
import {mapState, mapActions} from 'vuex';

export default {
    mixins: [wsMixin],
    name: '',
    data() {
        return {
            aiStatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
            eiccAiStatus: JSON.parse(localStorage.getItem('sysInfo')).eiccAiStatus,
            aiConfigId: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            aiConfigType: JSON.parse(localStorage.getItem('sysInfo')).type,
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId
                ? JSON.parse(localStorage.getItem('sysInfo')).aiConfigId
                : 1,
            feeModel: JSON.parse(localStorage.getItem('sysInfo'))
                ? JSON.parse(localStorage.getItem('sysInfo')).feeModel
                : 1,
            mainInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
            changeShow: false,
            uiType: window.localStorage.getItem('uiType') ? window.localStorage.getItem('uiType') : 1,
            systemInfo: {},
            logOutShow: false,
            isCollapse: false,
            menuList: [],
            pageName: '概览',
            // currentIndex: this.$route.path,
            homeMenu: {url: '/sys/home', name: '概览'},
            pwdShow: false,
            pwdInfo: {},
            errorInfo: '',
            systemName: '',
            verNum: '',
            websock: null,
            nickName: JSON.parse(localStorage.getItem('userInfo'))
                ? JSON.parse(localStorage.getItem('userInfo')).nickName
                : '',
            userInfo: {},
            loginType: 'web',
            menuUrl: '',
            KeyIndex: [],
            isTrue: 0,
            rightTrue: 0,
            threeTrue: 0,
            showOpen: false,
            showMenu: true,
            // AI次数预警dialog
            aiEarlyWarningShow: false,
            // 努比AI剩余次数
            remainingAnalysis: 0,
            tryoutShow: false,
            expirationDate: null,
            teachingSuggestionEnabled: 0,
            isShowDataBoard: true,
            isShowProjectManage: true,
            isShowSetting: true,
        };
    },
    components: {
        uploadBox,
        aiUploadBox,
    },
    mounted() {
        this.setNavShow();
        this.setProjectShow();
        this.setSettingShow();
        if (!localStorage.getItem('userInfo')) {
            this.$router.push('/login');
        }
        if (this.$route.path.includes('/ai/teacherReport')) {
            this.showMenu = false;
            return;
        } else if (this.$route.path.includes('/sys/home')) {
            // console.log('修改系统类型')
            this.commitSysModule(1); //修改系统类型
            this.menuUrl = `/auth/menu?type=-7`;
            this.homeMenu.url = '/sys/home';
            this.changeMenu();
        } else if (this.$route.path.includes('/recordhome')) {
            this.commitSysModule(2); //修改系统类型
            this.menuUrl = `/auth/menu?type=-1`;
            this.homeMenu.url = '/recordhome';
            this.changeMenu();
        } else if (this.$route.path.includes('/traininghome')) {
            this.commitSysModule(3); //修改系统类型
            this.menuUrl = `/auth/menu?type=-2`;
            this.homeMenu.url = '/traininghome';
            this.changeMenu();
        } else if (this.$route.path.includes('/aiConfig')) {
            this.commitSysModule(6); //修改系统类型
            this.menuUrl = `/auth/menu?type=-6`;
            this.homeMenu.url = '/aiConfig';
            this.changeMenu();
            return;
        } else if (
            this.$route.path.includes('/sys/terminal') ||
            this.$route.path.includes('/sm/clip') ||
            this.$route.path.includes('/sys/terminalRule')
        ) {
            if (this.sysModule == 2) {
                this.menuUrl = `/auth/menu?type=-1`;
                this.homeMenu.url = '/recordhome';
                this.commitSysModule(2); //修改系统类型
                this.$refs.elMenu.close(this.KeyIndex);
            } else {
                this.menuUrl = `/auth/menu?type=-7`;
                this.homeMenu.url = '/sys/home';
                this.commitSysModule(1); //修改系统类型
            }
            this.changeMenu();
        } else {
            this.getMenuList();
        }
        if (this.sysModule == 1) {
            this.homeMenu.url = '/sys/home';
        } else if (this.sysModule == 2) {
            this.homeMenu.url = '/recordhome';
        } else if (this.sysModule == 3) {
            this.homeMenu.url = '/traininghome';
        } else if (this.sysModule == 5) {
            this.homeMenu.url = '/aiAnalysisRecharge';
        } else if (this.sysModule == 6) {
            this.homeMenu.url = '/sys/serverConfig';
        }
        this.getSystemName();
        this.getSystemInfo();
        if (this.mainInfo.needModifiedPassword == true) {
            this.changeShow = true;
        } else {
            this.changeShow = false;
        }
        if (
            (this.$route.path.includes('/sm/commentaddedit') ||
                this.$route.path.includes('/sm/aiclassAddEdit') ||
                this.$route.path.includes('/sm/largeUnitAddEdit')) &&
            this.$route.query.mode
        ) {
            this.commitSysModule(3);
            this.menuUrl = `/auth/menu?type=-2`;
            this.homeMenu.url = '/traininghome';
            this.changeMenu();
        }
        if (
            (this.$route.path.includes('/sm/interactiveaddedit') || this.$route.path.includes('/sm/themeaddedit')) &&
            this.$route.query.mode
        ) {
            this.commitSysModule(1);
            this.menuUrl = `/auth/menu?type=-7`;
            this.homeMenu.url = '/sys/home';
            this.changeMenu();
        }
        let previousPath = this.$route.meta.previousRoute ? this.$route.meta.previousRoute.path : '';
        console.log('上一个路径:', previousPath);
        if (previousPath === '/login') {
            this.getAiEarlyWarningCount();
            this.getAiEarlyWarningRemind();
            this.getTryoutConfig();
            this.getTryoutRemind();
        }
    },
    watch: {
        $route(to, from) {
            console.log(to.path, '2131');
            console.log('to.path', to.path);
            console.log('from.path', from.path);
            if (to.path.includes('/sys/home')) {
                this.commitSysModule(1); //修改系统类型
            } else if (to.path.includes('/recordhome')) {
                if (to.path !== '/recordhomedetail') {
                    this.commitSysModule(2); //修改系统类型
                    this.menuUrl = `/auth/menu?type=-1`;
                    this.homeMenu.url = '/recordhome'; // 保障刷新后点击
                    console.log('aaaaaa');
                    this.changeMenu();
                }
            } else if (to.path.includes('/traininghome')) {
                if (to.path !== '/recordhomedetail') {
                    this.commitSysModule(3); //修改系统类型
                    this.menuUrl = `/auth/menu?type=-2`;
                    this.homeMenu.url = '/traininghome'; // 保障刷新后点击
                    this.changeMenu();
                    console.log('aaaa2222aa');
                }
            } else if (to.path.includes('/sm/file')) {
                if (this.homeMenu.url !== '/sys/home' && to.path !== '/sm/filedetail') {
                    this.KeyIndex = [];
                    this.commitSysModule(1); //修改系统类型
                    this.menuUrl = `/auth/menu?type=-7`;
                    this.homeMenu.url = '/sys/home'; // 保障刷新后点击
                    this.changeMenu();
                    console.log('44444', to.path);
                }
            } else if (to.path.includes('/sm/clip')) {
                if (from.path == '/sm/record') {
                    this.KeyIndex = [];
                    this.commitSysModule(1); //修改系统类型
                    this.menuUrl = `/auth/menu?type=-7`;
                    this.homeMenu.url = '/sys/home'; // 保障刷新后点击
                    this.changeMenu();
                    console.log('aaa44aaa');
                }
            } else if (to.path.includes('/ai/teacherReport')) {
                this.showMenu = false;
                window.open('/ai/teacherReport', '_blank');
            }
        },
        isSysModule(newVal, oldVal) {
            if (newVal == 1) {
                this.homeMenu.url = '/sys/home';
                this.menuUrl = `/auth/menu`;
                // this.changeMenu();
            }
        },
        sysInfo(newVal, oldVal) {
            if (newVal) {
                this.userInfo = newVal;
            }
        },
    },
    computed: {
        routeReg() {
            return new RegExp('^' + this.currentIndex.replace('/', '\\/'));
        },
        isSysModule() {
            return this.$store.state.sysModule;
        },
        ...mapState({
            sysModule: 'sysModule',
            seeHome: 'seeHome',
            rightHome: 'rightHome',
            threeHome: 'threeHome',
        }),
        sysInfo() {
            return this.$store.state.sysInfo;
        },
    },
    methods: {
        ...mapActions({
            commitSysModule: 'commitSysModule',
            commitSeeHome: 'commitSeeHome',
            commitRightHome: 'commitRightHome',
            commitThreeHome: 'commitThreeHome',
            commitFiveHome: 'commitFiveHome',
            commitSixHome: 'commitSixHome',
        }),
        toLogin() {
            this.$router.push('/login');
        },
        setNavShow() {
            this.$axios.get('/auth/menu?type=-4').then((res) => {
                this.isShowDataBoard = res.data.length != 0;
            });
        },
        setProjectShow() {
            this.$axios.get('/auth/menu?type=-5').then((res) => {
                this.isShowProjectManage = res.data.length != 0;
            });
        },
        setSettingShow() {
            this.$axios.get('/auth/menu?type=-6').then((res) => {
                this.isShowSetting = res.data.length != 0;
            });
        },
        goHelpHome() {
            window.open('/helpHome', '_blank');
        },
        handleOpen(key) {
            this.KeyIndex = [key];
        },
        getModelConfig() {
            this.$axios.get('/aiModelConfig/get').then((res) => {
                if (res.data) {
                    this.eiccAiStatus = res.data?.enabled;
                }
            });
        },
        // 改变平台
        changeModule(index) {
            this.KeyIndex = [];
            this.commitSysModule(index); //修改系统类型
            // 智慧教育 -7
            if (this.sysModule == 1) {
                this.homeMenu = {url: '/sys/home', name: '概览'};
                this.menuUrl = `/auth/menu?type=-7`;
            } else if (this.sysModule == 2) {
                // 微集控录播：-2
                this.homeMenu = {url: '/recordhome', name: '概览'};
                this.menuUrl = `/auth/menu?type=-1`;
            } else if (this.sysModule == 3) {
                // 智能研修：-2
                this.homeMenu = {url: '/traininghome', name: '概览'};
                this.menuUrl = `/auth/menu?type=-2`;
            } else if (this.sysModule == 5) {
                // 项目次数管理：-5
                this.homeMenu = {url: '/aiAnalysisRecharge', name: '概览'};
                this.menuUrl = `/auth/menu?type=-5`;
            } else if (this.sysModule == 6) {
                // 系统管理：-6
                this.homeMenu = {url: '/sys/serverConfig', name: '概览'};
                this.menuUrl = `/auth/menu?type=-6`;
            }
            this.changeMenu();
        },
        // 改变菜单
        changeMenu() {
            console.log('变了');
            this.menuList = [];
            session.remove('systemMenuList');
            let arr = [];
            let arrs = [];
            let isTrue = 0;
            let rightTrue = 0;
            let threeTrue = 0;
            let fiveTrue = 0;
            let sixTrue = 0;
            console.log('this.menuUrl: ', this.menuUrl);
            this.$axios.get(this.menuUrl).then((res) => {
                if (res.data.length == 0) {
                    return;
                }
                this.selectMenu(this.homeMenu);
                res.data.forEach((ele) => {
                    if (ele.id != '207' && ele.id != '205' && ele.id != '204') {
                        if (ele.id == 1 && this.sysModule == 1) {
                            isTrue = 1;
                        }
                        if (ele.id == 12240 && this.sysModule == 2) {
                            rightTrue = 1;
                        }
                        if (ele.id == 12600 && this.sysModule == 3) {
                            threeTrue = 1;
                        }
                        if (this.aiStatus == 1) {
                            if (ele.id !== 1 && ele.id !== 12240 && ele.id !== 12600 && ele.id !== 9181) {
                                if (this.aiConfigId == 1) {
                                    console.log('this.aiConfigId: ' + this.aiConfigId + ' , id: ' + ele.id);
                                    return;
                                }
                                if (this.aiConfigId == 2 && this.aiConfigType == 2) {
                                    return;
                                }
                                console.log('this.eiccAiStatus: ', this.eiccAiStatus);
                                arr.push(ele);
                            }
                        } else {
                            if (
                                ele.id !== 1 &&
                                ele.id !== 12240 &&
                                ele.id !== 12600 &&
                                ele.id !== 9181 &&
                                ele.id !== 13910 &&
                                ele.id !== 13911 &&
                                ele.id !== 13912
                            ) {
                                arr.push(ele);
                            }
                        }
                    }
                });
                if (isTrue == 1) {
                    this.commitSeeHome(1);
                } else {
                    this.commitSeeHome(0);
                }
                if (rightTrue == 1) {
                    this.commitRightHome(1);
                } else {
                    this.commitRightHome(0);
                }
                if (threeTrue == 1) {
                    this.commitThreeHome(1);
                } else {
                    this.commitThreeHome(0);
                }
                if (fiveTrue == 1) {
                    this.commitFiveHome(1);
                } else {
                    this.commitFiveHome(0);
                }
                if (sixTrue == 1) {
                    this.commitSixHome(1);
                } else {
                    this.commitSixHome(0);
                }
                if (this.mainInfo.userId == 1) {
                    arrs = arr;
                } else {
                    arrs = arr.filter((el) => {
                        if (el.id !== 10205) {
                            return el;
                        }
                    });
                }
                if (this.mainInfo.userId == 1 || this.mainInfo.userId == 2) {
                    if (this.feeModel == 2) {
                        arrs = arrs.filter((el) => {
                            if (el.id !== 13201) {
                                return el;
                            }
                        });
                    }
                } else {
                    arrs = arrs.filter((el) => {
                        if (el.id !== 13201) {
                            return el;
                        }
                    });
                }
                session.set('systemMenuList', creatTree(arrs));
                this.menuList = session.get('systemMenuList');
                this.setDefaultMenu(this.menuList);
                if (
                    ((isTrue == 0 && this.sysModule == 1) ||
                        (rightTrue == 0 && this.sysModule == 2) ||
                        (threeTrue == 0 && this.sysModule == 3) ||
                        (fiveTrue == 0 && this.sysModule == 5) ||
                        (sixTrue == 0 && this.sysModule == 6)) &&
                    this.$route.path !== '/aiConfig/Recharge' &&
                    this.$route.path !== '/sm/aiclassAddEdit' &&
                    this.$route.path !== '/sm/commentaddedit' &&
                    this.$route.path !== '/sm/largeUnitAddEdit' &&
                    this.$route.path !== '/sm/interactiveaddedit' &&
                    this.$route.path !== '/sm/themeaddedit' &&
                    this.$route.path !== '/sm/clip' &&
                    this.$route.path !== '/sys/terminal' &&
                    this.$route.path !== '/sys/system/trial' &&
                    this.$route.path !== '/aiConfig'
                ) {
                    this.$router.push(this.menuList[0].children[0].url);
                }
            });
        },
        //获取平台信息
        getSystemName() {
            this.$axios.get('/index/systemInfo').then((res) => {
                this.systemName = res.data.name;
                this.verNum = res.data.verNum;
                document.title = res.data.name ? res.data.name : '劢联科技';
                //version 1 标准版ops 2专业版x86
                storage.set('version', res.data.version);
                this.userInfo = res.data;
                if (this.websock) this.websock.close();
                if (!storage.get('time')) storage.set('time', new Date().getTime());
                this.handleGetWebsocket();
            });
        },
        //获取基本信息
        getSystemInfo() {
            this.$axios.get('index/info').then((res) => {
                this.systemInfo = res.data.resData;
                if (
                    this.systemInfo.icpRecordUrl &&
                    this.systemInfo.icpRecordUrl.slice(0, 7) !== 'http://' &&
                    this.systemInfo.icpRecordUrl.slice(0, 8) !== 'https://'
                ) {
                    this.systemInfo.icpRecordUrl = 'http://' + this.systemInfo.icpRecordUrl;
                }
                if (
                    this.systemInfo.recordUrl &&
                    this.systemInfo.recordUrl.slice(0, 7) !== 'http://' &&
                    this.systemInfo.recordUrl.slice(0, 8) !== 'https://'
                ) {
                    this.systemInfo.recordUrl = 'http://' + this.systemInfo.recordUrl;
                }
            });
        },
        //获取菜单列表
        getMenuList() {
            console.log('后台动态加载菜单按钮...');
            if (session.get('systemMenuList')) {
                this.menuList = session.get('systemMenuList');
                this.setDefaultMenu(this.menuList);
            } else {
                this.$axios.get('/auth/menu').then((res) => {
                    let arr = [];
                    let arrs = [];
                    let isTrue = 0;
                    let rightTrue = 0;
                    let threeTrue = 0;
                    res.data.forEach((ele) => {
                        if (ele.id != '207' && ele.id != '205' && ele.id != '204') {
                            if (ele.id == 1 && this.sysModule == 1) {
                                isTrue = 1;
                            }
                            if (ele.id == 12240 && this.sysModule == 2) {
                                rightTrue = 1;
                            }
                            if (ele.id == 12600 && this.sysModule == 3) {
                                threeTrue = 1;
                            }
                            if (this.aiStatus == 1) {
                                if (ele.id !== 1 && ele.id !== 12240 && ele.id !== 12600 && ele.id !== 9181) {
                                    if (this.aiConfigId == 1) {
                                        console.log('this.aiConfigId: ' + this.aiConfigId + ' , id: ' + ele.id);
                                        return;
                                    }
                                    if (this.aiConfigId == 2 && this.aiConfigType == 2) {
                                        return;
                                    }
                                    arr.push(ele);
                                }
                            } else {
                                if (ele.id !== 1 && ele.id !== 12240 && ele.id !== 12600 && ele.id !== 9181) {
                                    arr.push(ele);
                                }
                            }
                        }
                    });
                    if (isTrue == 1) {
                        this.commitSeeHome(1);
                    } else {
                        this.commitSeeHome(0);
                    }
                    if (rightTrue == 1) {
                        this.commitRightHome(1);
                    } else {
                        this.commitRightHome(0);
                    }
                    if (threeTrue == 1) {
                        this.commitThreeHome(1);
                    } else {
                        this.commitThreeHome(0);
                    }
                    if (this.mainInfo.userId == 1) {
                        arrs = arr;
                    } else {
                        arrs = arr.filter((el) => {
                            if (el.id !== 10205) {
                                return el;
                            }
                        });
                    }
                    if (this.mainInfo.userId == 1 || this.mainInfo.userId == 2) {
                        if (this.feeModel == 2) {
                            arrs = arrs.filter((el) => {
                                if (el.id !== 13201) {
                                    return el;
                                }
                            });
                        }
                    } else {
                        arrs = arrs.filter((el) => {
                            if (el.id !== 13201) {
                                return el;
                            }
                        });
                    }
                    session.set('systemMenuList', creatTree(arrs));
                    this.menuList = session.get('systemMenuList');
                    this.setDefaultMenu(this.menuList);
                    if (
                        ((isTrue == 0 && this.sysModule == 1) ||
                            (rightTrue == 0 && this.sysModule == 2) ||
                            (threeTrue == 0 && this.sysModule == 3) ||
                            (fiveTrue == 0 && this.sysModule == 5) ||
                            (sixTrue == 0 && this.sysModule == 6)) &&
                        this.$route.path !== '/aiConfig/Recharge' &&
                        this.$route.path !== '/sm/aiclassAddEdit' &&
                        this.$route.path !== '/sm/commentaddedit' &&
                        this.$route.push !== '/sm/largeUnitAddEdit' &&
                        this.$route.path !== '/sm/interactiveaddedit' &&
                        this.$route.path !== '/sm/themeaddedit' &&
                        this.$route.path !== '/sm/clip' &&
                        this.$route.path !== '/sys/system/trial'
                    ) {
                        this.$router.push(this.menuList[0].children[0].url);
                    }
                });
            }
        },
        setDefaultMenu(menuList) {
            // console.log(menuList,'menuList')
            for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].children) {
                    for (let j = 0; j < menuList[i].children.length; j++) {
                        if (menuList[i].children[j].url == this.$route.path) {
                            this.pageName = menuList[i].children[j].name;
                            // this.currentIndex = menuList[i].children[j].url ;
                        }
                    }
                }
            }
        },
        //logo跳转首页
        goHome() {
            // 部分用户不予点击跳转主页
            // const dontOpenCount = ['admin'];
            const dontOpenCount = ['xmlazx002'];
            console.log('openShow---', this.mainInfo.account);
            if (this.mainInfo && dontOpenCount.includes(this.mainInfo.account)) {
                console.log('account---', this.mainInfo.account);
                console.log("showOpen---don't open");
                return;
            }

            let routeUrl = this.$router.resolve({
                path: `/home?time=${this.$route.query.time ? this.$route.query.time : storage.get('time')}`,
            });
            window.open(routeUrl.href, '_blank');
        },
        //菜单点击
        selectMenu(val) {
            // 大数据看板新开页面跳转 无需做后续操作，不然新开页面跳转之后，原有的页面也会变成大数据看板页面
            if (val.url == '/dataBoard') {
                window.open(val.url, '_blank');
                return;
            }
            if (val.url == '/recordhome' || val.url == '/sys/home' || val.url == '/traininghome') {
                this.KeyIndex = [];
            }
            this.$router.push(val.url);
            this.pageName = val.name;
        },
        //退出登录
        logOut() {
            this.$axios.get('/auth/signOut').then((res) => {
                if (res.code == 200) {
                    session.set('systemMenuList', '');
                    this.$message(res.message, 'success');
                    this.$router.replace('/login');
                    // this.websock.close();
                    const params = {
                        type: 'logout',
                        account: this.userInfo.account,
                        loginType: 'web',
                    };
                    // const params = { "type": "logout", "account": this.userInfo.account, "loginType": "web" };
                    this.websocketsend(JSON.stringify(params));
                }
            });
        },
        handleCommand(event) {
            if (event == 'changePassword') {
                this.errorInfo = '';
                this.pwdInfo = {};
                this.pwdShow = true;
            } else if (event == 'help') {
                this.goHelpHome();
            } else {
                this.logOutShow = true;
            }
        },
        //修改密码
        updatePwd() {
            if (this.$verify.isEmpty(this.pwdInfo.old)) {
                return (this.errorInfo = '请填写原密码');
            }
            if (this.$verify.isEmpty(this.pwdInfo.new)) {
                return (this.errorInfo = '请填写新密码');
            }
            if (this.pwdInfo.old == this.pwdInfo.new) {
                return (this.errorInfo = '原密码与新密码不能一致');
            }
            if (!this.$verify.checkPW(this.pwdInfo.new)) {
                return (this.errorInfo = '新密码必须由6-20位数字、大小写字母组成，至少含2种！');
            }
            if (this.$verify.isEmpty(this.pwdInfo.again)) {
                return (this.errorInfo = '请填写确认密码');
            }
            if (this.pwdInfo.new != this.pwdInfo.again) {
                return (this.errorInfo = '新密码和确认密码不一致');
            }
            this.$axios
                .post('/sys/user/updatePwd', {
                    newPwd: MD5(this.pwdInfo.new),
                    oldPwd: MD5(this.pwdInfo.old),
                })
                .then((res) => {
                    this.errorInfo = '';
                    if (res.code == 200) {
                        this.pwdShow = false;
                        this.$message(res.message + '请重新登录', 'success');
                        this.pwdInfo = {};
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                    }
                });
        },
        // 获取分析次数预警
        async getAiEarlyWarningRemind() {
            console.log('async getRemind');
            this.$axios.get('/aiEarlyWarning/getRemind').then((res) => {
                if (res.code == 200) {
                    this.aiEarlyWarningShow = res.data;
                    console.log('this.aiEarlyWarningShow: ', this.aiEarlyWarningShow);
                }
            });
        },
        // 获取努比AI剩余次数
        async getAiEarlyWarningCount() {
            console.log('async getCount');
            this.$axios.get('/Api/getTotalRemaining').then((res) => {
                if (res.code == 200) {
                    this.remainingAnalysis = res.data;
                    console.log('this.remainingAnalysis: ', this.remainingAnalysis);
                }
            });
        },
        // 获取试用配置
        async getTryoutConfig() {
            console.log('async getTryoutConfig');
            this.$axios.get('/tryout/getConfig').then((res) => {
                if (res.code == 200) {
                    this.expirationDate = res.data.expirationDate;
                    console.log('this.expirationDate: ', this.expirationDate);
                }
            });
        },
        // 获取试用到期提醒
        async getTryoutRemind() {
            console.log('async getTryoutRemind');
            this.$axios.get('/tryout/getRemind').then((res) => {
                if (res.code == 200) {
                    this.tryoutShow = res.data;
                    console.log('this.aiEarlyWarningShow: ', this.tryoutShow);
                }
            });
        },
        closeEarlyWarningDialog() {
            // 让后台知道用户已经确认这个问题了
            this.$axios.post('/aiEarlyWarning/updateRemindUser').then((res) => {
                if (res.code == 200) {
                    this.aiEarlyWarningShow = false;
                }
            });
        },
        closeTryoutDialog() {
            // 让后台知道用户已经确认这个问题了
            this.$axios.post('/tryout/updateRemindUser').then((res) => {
                if (res.code == 200) {
                    this.tryoutShow = false;
                }
            });
        },
    },
    beforeDestroy() {
        if (this.websock) this.websock.close();
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-wrap {
    height: 100%;
    width: 100%;
    min-width: 1200px;

    .m-menu-icon {
        margin-right: 18px;
        font-size: 20px;
    }
}

.menu-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background: #4877e8;

    i {
        margin-right: 23px;
        font-size: 19px;
        color: #fff;
    }

    img {
        height: 26px;
        margin-left: 15px;
    }
}

.content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 40px;
    background: #5b8cff;
    z-index: 0;

    .title {
        font-size: 20px;
        color: #fffefe;
        font-family: SimHei;
    }

    .moduleChange {
        .moduleTitle {
            display: inline-block;
            color: #fffefe;
            margin-right: 16px;
            cursor: pointer;
            width: 100px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
        }
        // .data_board_title {
        //     width: 200px;
        // }

        .mActive {
            position: relative;
        }

        .mActive::before {
            position: absolute;
            left: 38%;
            bottom: -2px;
            z-index: 2;
            width: 25px;
            height: 2px;
            background: #fff;
            content: '';
        }
    }

    .user-info {
        display: flex;
        align-items: center;

        i {
            font-size: 30px;
            color: #fffefe;
        }

        img {
            width: 40px;
            height: 40px;
            margin-left: 20px;
            vertical-align: middle;
        }

        .set-user {
            width: 150px;
            text-align: center;
            cursor: pointer;
        }
    }
}

.content-footer {
    display: flex;
    align-items: center;
    margin: 0px 20px;
    font-size: 14px;
    background: #fff;
    color: #303133;

    .company {
        display: flex;
        text-align: center;
        margin: 0 auto;

        & p:nth-child(2) {
            margin-left: 60px;
        }
    }

    a {
        color: #303133;
        text-decoration: none;
    }
}

.content-main {
    flex: 1;
    overflow: hidden;
    margin: 18px 20px 0px;
}

.icon-mar {
    margin-right: 9px;
    font-size: 21px;
}

.dialog-item {
    p:first-child {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}
</style>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 225px;
    height: 100%;
    overflow: auto;
}

.el-menu {
    border-right: 0;
}

.el-popover {
    min-width: 123px !important;
}

.el-submenu .el-menu-item {
    margin-left: 7px;
    padding: 0;
    min-width: 195px;
}

.juzhong {
    margin-left: 92px;
}
</style>
