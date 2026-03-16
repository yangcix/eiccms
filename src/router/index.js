import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from '@/assets/js/axios';
Vue.use(VueRouter);
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch((error) => error);
};

const routes = [{
        //互动登录
        path: '/interactlogin',
        name: 'interactlogin',
        component: () =>
            import ( /* webpackChunkName: "interactlogin" */ '@/views/client/interact/InteractLogin.vue'),
    },
    {
        //主讲教室
        path: '/mainroom',
        name: 'mainroom',
        component: () =>
            import ( /* webpackChunkName: "mainroom" */ '@/views/client/interact/MainRoom.vue'),
    },
    {
        //副讲教室
        path: '/assistantroom',
        name: 'assistantroom',
        component: () =>
            import ( /* webpackChunkName: "assistantroom" */ '@/views/client/interact/AssistantRoom.vue'),
    },
    {
        //常态化互动登录
        path: '/normalInteractlogin',
        name: 'normalInteractlogin',
        component: () =>
            import ( /* webpackChunkName: "normalInteractlogin" */ '@/views/client/normalInteract/InteractLogin.vue'),
    },
    {
        //常态化主讲教室
        path: '/normalmainroom',
        name: 'normalmainroom',
        component: () =>
            import ( /* webpackChunkName: "mainroom" */ '@/views/client/normalInteract/MainRoom.vue'),
    },
    {
        //常态化副讲教室
        path: '/normalassistantroom',
        name: 'normalassistantroom',
        component: () =>
            import ( /* webpackChunkName: "normalassistantroom" */ '@/views/client/normalInteract/AssistantRoom.vue'),
    },
    {
        //帮助中心
        path: '/helpHome',
        name: 'helpHome',
        component: () =>
            import ( /* webpackChunkName: "helpHome" */ '@/views/system/helpHome.vue'),
    },
    {
        //努比ai报告页
        path: '/aiReport',
        name: 'aiReport',
        component: () =>
            import ( /* webpackChunkName: "helpHome" */ '@/views/learnSys/aiclass/aiReport.vue'),
    },
    {
        //努比听评课活动ai报告页
        path: '/commentReport',
        name: 'commentReport',
        component: () =>
            import ( /* webpackChunkName: "helpHome" */ '@/views/system/evaluation/commentReport.vue'),
    },
    {
        //后台系统
        path: '/sys',
        name: 'sys',
        redirect: '/sys/home',
        component: () =>
            import ( /* webpackChunkName: "index" */ '@/views/system/Index.vue'),
        children: [{
                //概览
                path: 'home',
                name: 'syshome',
                component: () =>
                    import ( /* webpackChunkName: "syshome" */ '@/views/system/Home.vue'),
            },
            {
                //用户管理
                path: 'user',
                name: 'sysuser',
                component: () =>
                    import ( /* webpackChunkName: "sysuser" */ '@/views/system/member/User.vue'),
            },
            {
                //机构管理
                path: 'org',
                name: 'sysorg',
                component: () =>
                    import ( /* webpackChunkName: "sysorg" */ '@/views/system/member/Organization.vue'),
            },
            {
                //角色管理
                path: 'role',
                name: 'sysrole',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "sysrole" */ '@/views/system/member/Role.vue'),
            },
            {
                //权限授权
                path: '/roleEdit',
                name: 'roleEdit',
                component: () =>
                    import ( /* webpackChunkName: "sysrole" */ '@/views/system/member/RoleEdit.vue'),
            },
            {
                //用户组
                path: 'group',
                name: 'sysgroup',
                component: () =>
                    import ( /* webpackChunkName: "sysgroup" */ '@/views/system/member/Group.vue'),
            },
            {
                //班级管理
                path: '/sm/class',
                name: 'sysclass',
                component: () =>
                    import ( /* webpackChunkName: "sysclass" */ '@/views/system/member/Class.vue'),
            },
            {
                //年级管理
                path: '/sm/grade',
                name: 'smgrade',
                component: () =>
                    import ( /* webpackChunkName: "smgrade" */ '@/views/system/member/Grade.vue'),
            },
            {
                //系统配置
                path: 'system',
                name: 'system',
                component: () =>
                    import ( /* webpackChunkName: "system" */ '@/views/system/base/System.vue'),
            },
            {
                //广告配置
                path: 'ad',
                name: 'ad',
                component: () =>
                    import ( /* webpackChunkName: "ad" */ '@/views/system/base/Adver.vue'),
            },
            {
                //用户登录日志
                path: '/sys/user/login/log',
                name: 'userLoginLogs',
                component: () =>
                    import ( /* webpackChunkName: "help" */ '@/views/system/base/userLoginLogs.vue'),
            },
            {
                //敏感操作日志
                path: '/sys/sensitive',
                name: 'sensitive',
                component: () =>
                    import ( /* webpackChunkName: "help" */ '@/views/system/base/sensitive.vue'),
            },
            {
                //帮助中心
                path: '/sys/help',
                name: 'help',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "help" */ '@/views/system/base/Help.vue'),
            },
            {
                // 帮助中心新增编辑
                path: '/sys/helpaddedit',
                name: 'helpaddedit',
                component: () =>
                    import ( /* webpackChunkName: "helpaddedit" */ '@/views/system/base/HelpAddEdit.vue'),
            },
            {
                //教学楼管理
                path: 'teachBuild',
                name: 'systeachbuild',
                component: () =>
                    import ( /* webpackChunkName: "systeachbuild" */ '@/views/system/base/TeachBuild.vue'),
            },
            {
                //教室管理
                path: 'classroom',
                name: 'sysclassroom',
                component: () =>
                    import ( /* webpackChunkName: "sysclassroom" */ '@/views/system/base/Classroom.vue'),
            },
            {
                //服务器管理
                path: 'serverConfig',
                name: 'sysserver',
                component: () =>
                    import ( /* webpackChunkName: "sysserver" */ '@/views/system/equipment/Server.vue'),
            },
            {
                //终端管理
                path: 'terminal',
                name: 'systerminal',
                component: () =>
                    import ( /* webpackChunkName: "sysserver" */ '@/views/system/equipment/Terminal.vue'),
            },
            {
                //客户端管理
                path: 'clientManagement',
                name: 'clientManagement',
                component: () =>
                    import ('@/views/system/equipment/clientManagement.vue'),
            },
            {
                // 类型管理 new
                path: '/sm/category',
                name: 'smcategory',
                component: () =>
                    import ( /* webpackChunkName: "sysserver" */ '@/views/system/video/Ctegory.vue'),
            },
            {
                //类型管理 分类管理
                path: '/sm/label',
                name: 'smlabel',
                component: () =>
                    import ( /* webpackChunkName: "sysserver" */ '@/views/system/video/Type.vue'),
            },
            {
                //主题管理
                path: '/sm/theme',
                name: 'smtheme',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "smtheme" */ '@/views/system/video/Theme.vue'),
            },
            {
                //主题新增编辑
                path: '/sm/themeaddedit',
                name: 'themeaddedit',
                component: () =>
                    import ( /* webpackChunkName: "themeaddedit" */ '@/views/system/video/ThemeAddEdit.vue'),
            },
            {
                //主题详情
                path: '/sm/themedetail',
                name: 'themedetail',
                component: () =>
                    import ( /* webpackChunkName: "themedetail" */ '@/views/system/video/ThemeDetail.vue'),
            },
            {
                //回放
                path: '/sm/themeplayback', // playback  themeplayback
                name: 'themeplayback',
                component: () =>
                    import ( /* webpackChunkName: "themeplayback" */ '@/views/system/video/PlayBack.vue'),
            },
            {
                //菜单管理
                path: 'menu',
                name: 'sysmenu',
                component: () =>
                    import ( /* webpackChunkName: "sysserver" */ '@/views/system/system/Menu.vue'),
            },
            {
                //日志管理
                path: 'log',
                name: 'syslog',
                component: () =>
                    import ( /* webpackChunkName: "sysserver" */ '@/views/system/system/Log.vue'),
            },
            {
                //视频管理
                path: '/sm/file',
                name: 'smfile',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "smfile" */ '@/views/system/videoManage/File.vue'),
            },
            {
                // 剪辑管理
                path: '/sm/clip',
                name: 'smclip',
                component: () =>
                    import ( /* webpackChunkName: "smclip" */ '@/views/system/videoManage/Clip.vue'),
            },
            {
                // 视频合并
                path: '/sm/merge',
                name: 'smmerge',
                component: () =>
                    import ( /* webpackChunkName: "smclip" */ '@/views/system/videoManage/merge.vue'),
            },
            {
                //公网点播进度
                path: '/sm/publicondemand',
                name: 'FilePublicOnDemand',
                component: () =>
                    import ( /* webpackChunkName: "smfileaddedit" */ '@/views/system/videoManage/FilePublicOnDemand.vue'),
            },
            {
                //视频上传 编辑
                path: '/sm/fileaddedit',
                name: 'smfileaddedit',
                component: () =>
                    import ( /* webpackChunkName: "smfileaddedit" */ '@/views/system/videoManage/FileAddEdit.vue'),
            },
            {
                //视频清晰度
                path: '/sm/transcoding',
                name: 'transcoding',
                component: () =>
                    import ( /* webpackChunkName: "transcoding" */ '@/views/system/videoManage/TransCoding.vue'),
            },
            {
                //视频详情
                path: '/sm/filedetail',
                name: 'filedetail',
                component: () =>
                    import ( /* webpackChunkName: "filedetail" */ '@/views/system/videoManage/FileDetail.vue'),
            },
            {
                //互动主题管理
                path: '/sm/interactive',
                name: 'interact',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "interact" */ '@/views/system/interact/Interact.vue'),
            },
            {
                //互动主题详情
                path: '/sm/interactivedetail', //interactivedetail  // interactdetail  interactive
                name: 'interactivedetail',
                component: () =>
                    import ( /* webpackChunkName: "interactivedetail" */ '@/views/system/interact/InteractDetail.vue'),
            },
            {
                //互动主题新增编辑
                path: '/sm/interactiveaddedit', //interactaddedit
                name: 'interactiveaddedit',
                component: () =>
                    import ( /* webpackChunkName: "interactiveaddedit" */ '@/views/system/interact/InteractAddEdit.vue'),
            }, ,
            {
                //常态化互动主题管理
                path: '/sm/habitus',
                name: 'habitus',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* habitus: "habitus" */ '@/views/system/normalInteract/Interact.vue'),
            },
            {
                //常态化互动主题详情
                path: '/sm/habitusdetail', //habitusdetail  // interactdetail  interactive
                name: 'habitusdetail',
                component: () =>
                    import (
                        /* webpackChunkName: "interactivedetail" */
                        '@/views/system/normalInteract/InteractDetail.vue'
                    ),
            },
            {
                //常态化互动主题新增编辑
                path: '/sm/habitusaddedit', //habitusaddedit
                name: 'habitusaddedit',
                component: () =>
                    import (
                        /* webpackChunkName: "interactiveaddedit" */
                        '@/views/system/normalInteract/InteractAddEdit.vue'
                    ),
            },
            {
                //校外互动主题管理
                path: '/sys/crossSchoolInteraction',
                name: 'interactiondoors',
                meta: { keepAlive: true },
                component: () =>
                    import (
                        /* webpackChunkName: "interactOutdoors" */
                        '@/views/system/interactOutdoors/InteractOutdoors.vue'
                    ),
            },
            {
                //校外互动主题详情
                path: '/sys/crossSchoolInteractionDetail', //interactivedetail  // interactdetail  interactive
                name: 'interactionDetail',
                component: () =>
                    import (
                        /* webpackChunkName: "interactOutDetail" */
                        '@/views/system/interactOutdoors/InteractOutDetail.vue'
                    ),
            },
            {
                //校外互动主题新增编辑
                path: '/sys/crossSchoolInteractionAddEdit', //interactaddedit
                name: 'interactionAddEdit',
                component: () =>
                    import (
                        /* webpackChunkName: "interactOutAddEdit" */
                        '@/views/system/interactOutdoors/InteractOutAddEdit.vue'
                    ),
            },
            {
                //学校管理
                path: '/sys/SysSchool', //school
                name: 'school',
                component: () =>
                    import ( /* webpackChunkName: "school" */ '@/views/system/schoolManage/school.vue'),
            },
            {
                // 评课管理
                path: '/sm/comment',
                name: 'comment',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "interact" */ '@/views/system/evaluation/Comment.vue'),
            },
            {
                // 评课管理新增编辑
                path: '/sm/commentaddedit',
                name: 'commentaddedit',
                component: () =>
                    import ( /* webpackChunkName: "interact" */ '@/views/system/evaluation/EvaluationAddEdit.vue'),
            },
            {
                // 评课管理详情
                path: '/sm/commentdetail',
                name: 'commentdetail',
                component: () =>
                    import ( /* webpackChunkName: "interact" */ '@/views/system/evaluation/EvaluationDetail.vue'),
            },
            {
                // 评课模板管理
                path: '/sm/template',
                name: 'template',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "interact" */ '@/views/system/evaluationTemp/CommentTemplate.vue'),
            },
            {
                // 评课模板管理新增编辑
                path: '/sm/templateaddedit',
                name: 'templateaddedit',
                component: () =>
                    import (
                        /* webpackChunkName: "interact" */
                        '@/views/system/evaluationTemp/EvaluationTempAddEdit.vue'
                    ),
            },
            {
                // 大单元管理
                path: '/aiLargeUnit',
                name: 'smlargeUnit',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "largeUnit" */ '@/views/largeUnitAnalysis/aiLargeUnit.vue'),
            },
            {
                // 大单元新增编辑
                path: '/sm/largeUnitAddEdit',
                name: 'smlargeUnitAddEdit',
                component: () =>
                    import ( /* webpackChunkName: "largeUnit" */ '@/views/largeUnitAnalysis/aiLargeUnitAddEdit.vue'),
            },
            {
                // 智能录播 概览
                path: '/recordhome',
                name: 'sysrecordhome',
                component: () =>
                    import ( /* webpackChunkName: "sysrecordhome" */ '@/views/recorderSys/recordHome/recordHome.vue'),
            },
            {
                // 智能录播 概览  教室详情
                path: '/recordhomedetail',
                name: 'sysclassdetail',
                component: () =>
                    import ( /* webpackChunkName: "sysclassdetail" */ '@/views/recorderSys/recordHome/classDetail.vue'),
            },
            {
                // 智能录播  课表模板
                path: '/sm/lessonTemplate',
                name: 'syslessontemp',
                meta: { keepAlive: true },
                component: () =>
                    import (
                        /* webpackChunkName: "syslessontemp" */
                        '@/views/recorderSys/recordLessonTable/lessonTemp.vue'
                    ),
            },
            {
                // 智能录播  课表模板新增  编辑
                path: '/sm/lessonTemplateEdit',
                name: 'syslessontempedit',
                component: () =>
                    import (
                        /* webpackChunkName: "syslessontempedit" */
                        '@/views/recorderSys/recordLessonTable/lessonTempAdd.vue'
                    ),
            },
            {
                // 智能录播 课表管理
                path: '/sm/curriculum',
                name: 'sysrecordlesson',
                meta: { keepAlive: true },
                component: () =>
                    import (
                        /* webpackChunkName: "sysrecordlesson" */
                        '@/views/recorderSys/recordLesson/recordLesson.vue'
                    ),
            },
            {
                // 智能录播 课表管理  新增  编辑
                path: '/recordlessonedit',
                name: 'sysrecordlessonedit',
                component: () =>
                    import (
                        /* webpackChunkName: "sysrecordlessonedit" */
                        '@/views/recorderSys/recordLesson/recordLessonAdd.vue'
                    ),
            },
            {
                // 智能录播 录播视频列表
                path: '/sm/record',
                name: 'sysrecordvideo',
                component: () =>
                    import ( /* webpackChunkName: "sysrecordvideo" */ '@/views/recorderSys/recordVideo/recordVideo.vue'),
            },
            {
                // 设备配置规则
                path: '/sm/terminalRule',
                name: 'systerminalRule',
                component: () =>
                    import ( /* webpackChunkName: "systerminalRule" */ '@/views/system/equipment/TerminalConfig.vue'),
            },
            {
                // 智能研修 概览
                path: '/traininghome',
                name: 'traininghome',
                component: () =>
                    import ( /* webpackChunkName: "traininghome" */ '@/views/learnSys/traininghome/traininghome.vue'),
            },
            {
                // AI磨课管理
                path: '/aiGrinding',
                name: 'smaiclass',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/aiclass/aiclass.vue'),
            },

            {
                // AI分析次数充值  3.6.5 隐藏
                path: '/aiConfig/Recharge',
                name: 'aiRecharge',
                meta: { keepAlive: true },
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/aiclass/aiclassRecharge.vue'),
            },

            {
                // AI磨课新增编辑
                path: '/sm/aiclassAddEdit',
                name: 'smaiclassAddEdit',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/aiclass/aiclassAddEdit.vue'),
            },
            {
                // AI磨课详情
                path: '/aiGrinding/detail',
                name: 'aiGrindingdetail',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/aiclass/aiclassDetail.vue'),
            },
            {
                // AI磨课基础配置
                path: '/aiConfig',
                name: '/aiConfig',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/index.vue'),
            },
            {
                // AI分析池管理
                path: '/aiDistribution',
                name: 'smdistribution',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/distribution.vue'),
            },
            {
                // AI分析次数管理
                path: '/aiDistributionPersonal',
                name: 'smdistributionPersonal',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/distributionPersonal.vue'),
            },
            {
                // 教案分析
                path: '/lessonPlanAnalysis',
                name: 'lessonPlanAnalysis',
                meta: { keepAlive: true },
                component: () =>
                    import (
                        /* webpackChunkName: "lessonPlanAnalysis" */
                        '@/views/learnSys/lessonPlanAnalysis/lessonPlanAnalysis.vue'
                    ),
            },
            {
                // 教案分析编辑页
                path: '/lessonPlanAnalysis/edit',
                name: 'lessonPlanAnalysisEdit',
                meta: { keepAlive: true },
                component: () =>
                    import (
                        /* webpackChunkName: "lessonPlanAnalysis" */
                        '@/views/learnSys/lessonPlanAnalysis/lessonPlanAnalysisEdit.vue'
                    ),
            },
            {
                // 分析次数预警
                path: '/aiEarlyWarning',
                name: 'aiEarlyWarning',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/aiEarlyWarning.vue'),
            },
            {
                // 试用页面
                path: '/sys/system/trial',
                name: 'tryout',
                component: () =>
                    import ('@/views/system/tryout.vue'),
            },
            {
                // 教学建议配置
                path: '/teachingSuggestionConfig',
                name: 'teachingSuggestionConfig',
                // component: () => import(/* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/distributionTeaching.vue')
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/TeachingSuggestionConfig.vue'),
            },
            {
                // 教学建议配置
                path: '/teachingSuggestionConfig/eidt',
                name: 'teachingSuggestionConfigEdit',
                // component: () => import(/* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/distributionTeaching.vue')
                component: () =>
                    import (
                        /* webpackChunkName: "smaiclass" */
                        '@/views/learnSys/config/TeachingSuggestionConfigEdit.vue'
                    ),
            },
            {
                // 版本管理
                path: '/sys/clientVersionManagement',
                name: 'clientVersionManagement',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/clientVersionManagement.vue'),
            },
            {
                // 课前指导
                path: '/aiPreClassGuidance',
                name: 'aiPreClassGuidance',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/preClassGuide.vue'),
            },
            {
                // 课前指导详情
                path: '/aiPreClassGuidance/detail',
                name: 'aiPreClassGuidanceDetail',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/preClassGuideDetail.vue'),
            },
            {
                // 课前指导新增/编辑
                path: '/sm/preClassGuideAddEdit',
                name: 'preClassGuideAddEdit',
                component: () =>
                    import ( /* webpackChunkName: "smaiclass" */ '@/views/learnSys/config/preClassGuideAddEdit.vue'),
            },
        ],
    },
    {
        // 客户端跳转过渡页
        path: '/transit',
        name: 'transit',
        component: () =>
            import ( /* webpackChunkName: "transit" */ '@/views/system/transit.vue'),
    },
    {
        //后台登录
        path: '/login',
        name: 'login',
        component: () =>
            import ( /* webpackChunkName: "login" */ '@/views/system/Login.vue'),
    },
    {
        //初始化系统
        path: '/initsystem',
        name: 'initsystem',
        component: () =>
            import ( /* webpackChunkName: "initsystem" */ '@/views/system/InitSystem.vue'),
    },
    {
        //数据看板
        path: '/dataBoard',
        name: 'dataBoard',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/client/dataBoard.vue'),
    },
    {
        //大数据分析
        path: '/bigData',
        name: 'bigData',
        component: () =>
            import ( /* webpackChunkName: "bigData" */ '@/views/system/details.vue'),
    },
    {
        // 到期页面
        path: '/expire',
        name: 'expire',
        component: () =>
            import ('@/views/system/expire.vue'),
    },
    {
        // 福龙城URL跳转登录
        path: '/loginRedirect',
        name: 'loginRedirect',
        component: () =>
            import ( /* webpackChunkName: "training" */ '@/views/system/LoginRedirect.vue'),
    },
    {
        // AI教师版报告（新版页面）
        path: '/ai/teacherReport',
        name: 'AiTeacherReport',
        meta: { keepAlive: true },
        component: () =>
            import ( /* webpackChunkName: "lessonPlanAnalysis" */ '@/views/aiReport/AiTeacherReport.vue'),
    },
    {
        // 大数据报告
        path: '/getNuBiAnalysisBctiData',
        name: 'bigDataReport',
        meta: { keepAlive: true },
        component: () =>
            import ( /* webpackChunkName: "lessonPlanAnalysis" */ '@/views/aiReport/bigDataReport.vue'),
    },
    {
        // 甘肃URL跳转登录
        path: '/gansu/loginRedirect',
        name: 'ganSuLoginRedirect',
        component: () =>
            import ( /* webpackChunkName: "training" */ '@/views/system/GanSuLoginRedirect.vue'),
    },
    {
        // 课前指导报告报告
        path: '/preClassGuideReport',
        name: 'preClassGuideReport',
        meta: { keepAlive: true },
        component: () =>
            import ( /* webpackChunkName: "lessonPlanAnalysis" */ '@/views/aiReport/preClassGuideReport.vue'),
    },
];

let router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 期望滚动到哪个位置
        return {
            x: 0,
            y: 0,
        };
    },
});
let isRefresh = false;
router.beforeEach((to, from, next) => {
    to.meta.previousRoute = from;
    // console.log("to: " + to.path + "from: " + from.path)
    /* if (to.path === '/expire' && from.path === '/home') {
    // 阻止重复导航
    next(false);
  } else {
    next();
  }*/
    if (
        (from.name == 'assistantroom' &&
            (to.name == 'interactivedetail' || to.name == 'courierClass' || to.name == 'home')) ||
        (from.name == 'mainroom' &&
            (to.name == 'interactivedetail' || to.name == 'courierClass' || to.name == 'home')) ||
        (from.name == 'normalassistantroom' &&
            (to.name == 'habitusdetail' || to.name == 'courierClass' || to.name == 'home')) ||
        (from.name == 'normalmainroom' &&
            (to.name == 'habitusdetail' || to.name == 'courierClass' || to.name == 'home'))
    ) {
        location.reload();
    }
    if (!localStorage.getItem('uiType') || isRefresh == false) {
        axios.get('/index/systemInfo').then((res) => {
            if (res.data.uiType == 2) {
                router.addRoute({
                    //移动端
                    path: '/mobile',
                    name: 'mobile',
                    component: () =>
                        import ( /* webpackChunkName: "index" */ '@/views/mobile/Index.vue'),
                    children: [{
                            //首页
                            path: 'home',
                            name: 'mhome',
                            component: () =>
                                import ( /* webpackChunkName: "mhome" */ '@/views/mobile/Home.vue'),
                        },
                        {
                            //直播
                            path: 'live',
                            name: 'mlive',
                            component: () =>
                                import ( /* webpackChunkName: "mlive" */ '@/views/mobile/Live.vue'),
                        },
                        {
                            //搜索
                            path: 'search',
                            name: 'msearh',
                            component: () =>
                                import ( /* webpackChunkName: "msearh" */ '@/views/mobile/Search.vue'),
                        },
                        {
                            //搜索结果
                            path: 'searchres',
                            name: 'msearhres',
                            component: () =>
                                import ( /* webpackChunkName: "msearhres" */ '@/views/mobile/SearchRes.vue'),
                        },
                        {
                            //个人信息 退出登录
                            path: 'userinfo',
                            name: 'muserinfo',
                            component: () =>
                                import ( /* webpackChunkName: "muserinfo" */ '@/views/mobile/UserInfo.vue'),
                        },
                        {
                            //点播
                            path: 'back',
                            name: 'mback',
                            component: () =>
                                import ( /* webpackChunkName: "mback" */ '@/views/mobile/Back.vue'),
                        },
                        {
                            //视频
                            path: 'video',
                            name: 'mvideo',
                            component: () =>
                                import ( /* webpackChunkName: "mvideo" */ '@/views/mobile/Video.vue'),
                        },
                        {
                            //点播播放
                            path: 'pplay',
                            name: 'mpplay',
                            component: () =>
                                import ( /* webpackChunkName: "mpplay" */ '@/views/mobile/videoPlay/Pplay.vue'),
                        },
                        {
                            //直播播放 http
                            path: 'hplay',
                            name: 'mhplay',
                            component: () =>
                                import ( /* webpackChunkName: "mhplay" */ '@/views/mobile/videoPlay/Lplay.vue'),
                        },
                        {
                            //直播播放 rtmp
                            path: 'rplay',
                            name: 'mrplay',
                            component: () =>
                                import ( /* webpackChunkName: "mrplay" */ '@/views/mobile/videoPlay/Lplay.vue'),
                        },
                        {
                            //视频播放
                            path: 'vplay',
                            name: 'mvplay',
                            component: () =>
                                import ( /* webpackChunkName: "mvplay" */ '@/views/mobile/videoPlay/Vplay.vue'),
                        },
                        {
                            //登录
                            path: 'login',
                            name: 'mlogin',
                            component: () =>
                                import ( /* webpackChunkName: "mlogin" */ '@/views/mobile/Login.vue'),
                        },
                    ],
                });
                router.addRoute({
                    //前台客户端
                    path: '/',
                    redirect: '/home',
                    name: 'headFoot',
                    component: () =>
                        import ( /* webpackChunkName: "headFoot" */ '@/views/client/HeadFoot.vue'),
                    children: [{
                            //首页
                            path: 'home',
                            name: 'home',
                            component: () =>
                                import ( /* webpackChunkName: "home" */ '@/views/client/Home.vue'),
                        },
                        {
                            //直播
                            path: 'live',
                            name: 'live',
                            component: () =>
                                import ( /* webpackChunkName: "live" */ '@/views/client/Live.vue'),
                        },
                        {
                            //点播
                            path: 'back',
                            name: 'back',
                            component: () =>
                                import ( /* webpackChunkName: "back" */ '@/views/client/Back.vue'),
                        },
                        {
                            //搜索页
                            path: 'search',
                            name: 'search',
                            component: () =>
                                import ( /* webpackChunkName: "search" */ '@/views/client/Search.vue'),
                        },
                        {
                            //视频
                            path: 'video',
                            name: 'video',
                            component: () =>
                                import ( /* webpackChunkName: "video" */ '@/views/client/Video.vue'),
                        },
                        {
                            //点播播放
                            path: 'pplay',
                            name: 'pplay',
                            component: () =>
                                import ( /* webpackChunkName: "pplay" */ '@/views/client/videoPlay/Pplay.vue'),
                        },
                        {
                            //直播播放 http
                            path: 'hplay',
                            name: 'hplay',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Hplay.vue'),
                        },
                        {
                            //直播播放 rtmp
                            path: 'rplay',
                            name: 'rplay',
                            component: () =>
                                import ( /* webpackChunkName: "rplay" */ '@/views/client/videoPlay/Rplay.vue'),
                        },
                        {
                            //评课本地上传播放 http
                            path: 'hplays',
                            name: 'hplays',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Hplays.vue'),
                        },
                        {
                            //评课新页面 http
                            path: 'newplay',
                            name: 'newplay',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Newplay.vue'),
                        },
                        {
                            //本地上传评课新页面 http
                            path: 'newplays',
                            name: 'newplays',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Newplays.vue'),
                        },
                        {
                            //视频播放
                            path: 'vplay',
                            name: 'vplay',
                            component: () =>
                                import ( /* webpackChunkName: "vplay" */ '@/views/client/videoPlay/Vplay.vue'),
                        },
                        {
                            //互动课堂
                            path: 'interaction',
                            name: 'interaction',
                            component: () =>
                                import ( /* webpackChunkName: "mvplay" */ '@/views/client/videoPlay/interaction.vue'),
                        },
                        {
                            //个人中心
                            path: 'userhome',
                            name: 'userhome',
                            component: () =>
                                import ( /* userhome: "userhome" */ '@/views/newClient/Userhome.vue'),
                        },
                        {
                            //实时研修
                            path: 'training',
                            name: 'training',
                            component: () =>
                                import ( /* webpackChunkName: "training" */ '@/views/client/Training.vue'),
                        },
                    ],
                });
            } else {
                router.addRoute({
                    //移动端
                    path: '/mobile',
                    name: 'mobile',
                    component: () =>
                        import ( /* webpackChunkName: "index" */ '@/views/newMobile/Index.vue'),
                    children: [{
                            //首页
                            path: 'home',
                            name: 'mhome',
                            component: () =>
                                import ( /* webpackChunkName: "mhome" */ '@/views/newMobile/Home.vue'),
                        },
                        {
                            //直播
                            path: 'live',
                            name: 'mlive',
                            component: () =>
                                import ( /* webpackChunkName: "mlive" */ '@/views/newMobile/Live.vue'),
                        },
                        {
                            //名师课堂
                            path: 'teacherclass',
                            name: 'mteacherclass',
                            component: () =>
                                import ( /* webpackChunkName: "mlive" */ '@/views/newMobile/TeacherClass.vue'),
                        },
                        {
                            //实时研修
                            path: 'training',
                            name: 'mtraining',
                            component: () =>
                                import ( /* webpackChunkName: "mtraining" */ '@/views/newMobile/Training.vue'),
                        },
                        {
                            //专递课堂
                            path: 'courierClass',
                            name: 'mcourierClass',
                            component: () =>
                                import ( /* webpackChunkName: "mcourierClass" */ '@/views/newMobile/CourierClass.vue'),
                        },
                        {
                            //优质资源
                            path: 'resources',
                            name: 'mresources',
                            component: () =>
                                import ( /* webpackChunkName: "mresources" */ '@/views/newMobile/Resources.vue'),
                        },
                        {
                            //课后服务
                            path: 'afterClass',
                            name: 'mafterClass',
                            component: () =>
                                import ( /* webpackChunkName: "mafterClass" */ '@/views/newMobile/AfterClass.vue'),
                        },
                        {
                            //停课不停学
                            path: 'noSuspension',
                            name: 'mnoSuspension',
                            component: () =>
                                import ( /* webpackChunkName: "mnoSuspension" */ '@/views/newMobile/NoSuspension.vue'),
                        },
                        {
                            //搜索
                            path: 'search',
                            name: 'msearh',
                            component: () =>
                                import ( /* webpackChunkName: "msearh" */ '@/views/newMobile/Search.vue'),
                        },
                        {
                            //搜索结果
                            path: 'searchres',
                            name: 'msearhres',
                            component: () =>
                                import ( /* webpackChunkName: "msearhres" */ '@/views/newMobile/SearchRes.vue'),
                        },
                        {
                            //个人信息 退出登录
                            path: 'userinfo',
                            name: 'muserinfo',
                            component: () =>
                                import ( /* webpackChunkName: "muserinfo" */ '@/views/newMobile/UserInfo.vue'),
                        },
                        {
                            //点播
                            path: 'back',
                            name: 'mback',
                            component: () =>
                                import ( /* webpackChunkName: "mback" */ '@/views/newMobile/Back.vue'),
                        },
                        {
                            //视频
                            path: 'video',
                            name: 'mvideo',
                            component: () =>
                                import ( /* webpackChunkName: "mvideo" */ '@/views/newMobile/Video.vue'),
                        },
                        {
                            //点播播放
                            path: 'pplay',
                            name: 'mpplay',
                            component: () =>
                                import ( /* webpackChunkName: "mpplay" */ '@/views/newMobile/videoPlay/Pplay.vue'),
                        },
                        {
                            //直播播放 http
                            path: 'hplay',
                            name: 'mhplay',
                            component: () =>
                                import ( /* webpackChunkName: "mhplay" */ '@/views/newMobile/videoPlay/Lplay.vue'),
                        },
                        {
                            //直播播放 rtmp
                            path: 'rplay',
                            name: 'mrplay',
                            component: () =>
                                import ( /* webpackChunkName: "mrplay" */ '@/views/newMobile/videoPlay/Lplay.vue'),
                        },
                        {
                            //视频播放
                            path: 'vplay',
                            name: 'mvplay',
                            component: () =>
                                import ( /* webpackChunkName: "mvplay" */ '@/views/newMobile/videoPlay/Vplay.vue'),
                        },
                        {
                            //登录
                            path: 'login',
                            name: 'mlogin',
                            component: () =>
                                import ( /* webpackChunkName: "mlogin" */ '@/views/newMobile/Login.vue'),
                        },
                    ],
                });
                router.addRoute({
                    //前台新版客户端
                    path: '/',
                    redirect: '/home',
                    name: 'newHeadFoot',
                    component: () =>
                        import ( /* webpackChunkName: "headFoot" */ '@/views/newClient/HeadFoot.vue'),
                    children: [{
                            //首页
                            path: 'home',
                            name: 'home',
                            component: () =>
                                import ( /* webpackChunkName: "home" */ '@/views/newClient/Home.vue'),
                        },
                        {
                            //名师课堂
                            path: 'teacherClass',
                            name: 'teacherClass',
                            component: () =>
                                import ( /* webpackChunkName: "teacherClass" */ '@/views/newClient/TeacherClass.vue'),
                        },
                        {
                            //实时研修
                            path: 'training',
                            name: 'training',
                            component: () =>
                                import ( /* webpackChunkName: "training" */ '@/views/newClient/Training.vue'),
                        },
                        {
                            //专递课堂
                            path: 'courierClass',
                            name: 'courierClass',
                            component: () =>
                                import ( /* webpackChunkName: "courierClass" */ '@/views/newClient/CourierClass.vue'),
                        },
                        {
                            //优质资源
                            path: 'resources',
                            name: 'resources',
                            component: () =>
                                import ( /* webpackChunkName: "mresources" */ '@/views/newClient/Resources.vue'),
                        },
                        {
                            //课后服务
                            path: 'afterClass',
                            name: 'afterClass',
                            component: () =>
                                import ( /* webpackChunkName: "afterClass" */ '@/views/newClient/AfterClass.vue'),
                        },
                        {
                            //停课不停学
                            path: 'noSuspension',
                            name: 'noSuspension',
                            component: () =>
                                import ( /* webpackChunkName: "noSuspension" */ '@/views/newClient/NoSuspension.vue'),
                        },
                        {
                            //搜索页
                            path: 'search',
                            name: 'search',
                            component: () =>
                                import ( /* webpackChunkName: "search" */ '@/views/newClient/Search.vue'),
                        },
                        {
                            //视频
                            path: 'video',
                            name: 'video',
                            component: () =>
                                import ( /* webpackChunkName: "video" */ '@/views/client/Video.vue'),
                        },
                        {
                            //点播播放
                            path: 'pplay',
                            name: 'pplay',
                            component: () =>
                                import ( /* webpackChunkName: "pplay" */ '@/views/newClient/videoPlay/Pplay.vue'),
                        },
                        {
                            //直播播放 http
                            path: 'hplay',
                            name: 'hplay',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/newClient/videoPlay/Hplay.vue'),
                        },
                        {
                            //评课本地上传播放 http
                            path: 'hplays',
                            name: 'hplays',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/newClient/videoPlay/Hplays.vue'),
                        },
                        {
                            //评课新页面 http
                            path: 'newplay',
                            name: 'newplay',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Newplay.vue'),
                        },
                        {
                            //本地上传评课新页面 http
                            path: 'newplays',
                            name: 'newplays',
                            component: () =>
                                import ( /* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Newplays.vue'),
                        },
                        {
                            //直播播放 rtmp
                            path: 'rplay',
                            name: 'rplay',
                            component: () =>
                                import ( /* webpackChunkName: "rplay" */ '@/views/newClient/videoPlay/Rplay.vue'),
                        },
                        {
                            //视频播放
                            path: 'vplay',
                            name: 'vplay',
                            component: () =>
                                import ( /* webpackChunkName: "vplay" */ '@/views/newClient/videoPlay/Vplay.vue'),
                        },
                        {
                            //互动课堂
                            path: 'interaction',
                            name: 'interaction',
                            component: () =>
                                import ( /* webpackChunkName: "mvplay" */ '@/views/newClient/videoPlay/interaction.vue'),
                        },
                        {
                            //个人中心
                            path: 'userhome',
                            name: 'userhome',
                            component: () =>
                                import ( /* userhome: "userhome" */ '@/views/newClient/Userhome.vue'),
                        },
                    ],
                });
            }
            localStorage.setItem('uiType', res.data.uiType);
            isRefresh = true;
            next({...to, replace: true });
        });
    } else {
        next();
    }
});
console.log('isRefresh', isRefresh);
export default router;