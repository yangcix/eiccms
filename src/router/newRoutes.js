import axios from '../assets/js/axios';
export async function newRoute(){
  console.log(localStorage.getItem('uiType','tyyyy'))
  let newRoutes = []
  await axios.get('/index/systemInfo').then(res => {
      if(res.data.uiType == 1) {
        newRoutes.push( {//移动端
          path: '/mobile',
          name: 'mobile',
          component: () => import(/* webpackChunkName: "index" */ '@/views/newMobile/Index.vue'),
          children:[
            { //首页
              path: 'home',
              name: 'mhome',
              component: () => import(/* webpackChunkName: "mhome" */ '@/views/newMobile/Home.vue')
            },{ //直播
              path: 'live',
              name: 'mlive',
              component: () => import(/* webpackChunkName: "mlive" */ '@/views/newMobile/Live.vue')
            },{ //名师课堂
              path: 'teacherclass',
              name: 'mteacherclass',
              component: () => import(/* webpackChunkName: "mlive" */ '@/views/newMobile/TeacherClass.vue')
            },{ //实时研修
              path: 'training',
              name: 'mtraining',
              component: () => import(/* webpackChunkName: "mtraining" */ '@/views/newMobile/Training.vue')
            },{ //专递课堂
              path: 'courierClass',
              name: 'mcourierClass',
              component: () => import(/* webpackChunkName: "mcourierClass" */ '@/views/newMobile/CourierClass.vue')
            },{ //优质资源
              path: 'resources',
              name: 'mresources',
              component: () => import(/* webpackChunkName: "mresources" */ '@/views/newMobile/Resources.vue')
            },{ //课后服务
              path: 'afterClass',
              name: 'mafterClass',
              component: () => import(/* webpackChunkName: "mafterClass" */ '@/views/newMobile/AfterClass.vue')
            },{ //停课不停学
              path: 'noSuspension',
              name: 'mnoSuspension',
              component: () => import(/* webpackChunkName: "mnoSuspension" */ '@/views/newMobile/NoSuspension.vue')
            },{ //搜索
              path: 'search',
              name: 'msearh',
              component: () => import(/* webpackChunkName: "msearh" */ '@/views/newMobile/Search.vue')
            },{ //搜索结果
              path: 'searchres',
              name: 'msearhres',
              component: () => import(/* webpackChunkName: "msearhres" */ '@/views/newMobile/SearchRes.vue')
            },{ //个人信息 退出登录
              path: 'userinfo',
              name: 'muserinfo',
              component: () => import(/* webpackChunkName: "muserinfo" */ '@/views/newMobile/UserInfo.vue')
            },{ //点播
              path: 'back',
              name: 'mback',
              component: () => import(/* webpackChunkName: "mback" */ '@/views/newMobile/Back.vue')
            },{ //视频
              path: 'video',
              name: 'mvideo',
              component: () => import(/* webpackChunkName: "mvideo" */ '@/views/newMobile/Video.vue')
            },{ //点播播放
              path: 'pplay',
              name: 'mpplay',
              component: () => import(/* webpackChunkName: "mpplay" */ '@/views/newMobile/videoPlay/Pplay.vue')
            },{ //直播播放 http
              path: 'hplay',
              name: 'mhplay',
              component: () => import(/* webpackChunkName: "mhplay" */ '@/views/newMobile/videoPlay/Lplay.vue')
            },{ //直播播放 rtmp
              path: 'rplay',
              name: 'mrplay',
              component: () => import(/* webpackChunkName: "mrplay" */ '@/views/newMobile/videoPlay/Lplay.vue')
            },{ //视频播放
              path: 'vplay',
              name: 'mvplay',
              component: () => import(/* webpackChunkName: "mvplay" */ '@/views/newMobile/videoPlay/Vplay.vue')
            },
            { //登录
              path: 'login',
              name: 'mlogin',
              component: () => import(/* webpackChunkName: "mlogin" */ '@/views/newMobile/Login.vue')
            },
          ]
        },)
        newRoutes.push({ //前台新版客户端
          path: '/',
          redirect: '/home',
          name: 'newHeadFoot',
          component: () => import(/* webpackChunkName: "headFoot" */ '@/views/newClient/HeadFoot.vue'),
          children:[
            { //首页
              path: 'home',
              name: 'home',
              component: () => import(/* webpackChunkName: "home" */ '@/views/newClient/Home.vue')
            },{ //名师课堂
              path: 'teacherClass',
              name: 'teacherClass',
              component: () => import(/* webpackChunkName: "teacherClass" */ '@/views/newClient/TeacherClass.vue')
            },{ //实时研修
              path: 'training',
              name: 'training',
              component: () => import(/* webpackChunkName: "training" */ '@/views/newClient/Training.vue')
            },{ //专递课堂
              path: 'courierClass',
              name: 'courierClass',
              component: () => import(/* webpackChunkName: "courierClass" */ '@/views/newClient/CourierClass.vue')
            },{ //优质资源
              path: 'resources',
              name: 'resources',
              component: () => import(/* webpackChunkName: "mresources" */ '@/views/newClient/Resources.vue')
            },{ //课后服务
              path: 'afterClass',
              name: 'afterClass',
              component: () => import(/* webpackChunkName: "afterClass" */ '@/views/newClient/AfterClass.vue')
            },{ //停课不停学
              path: 'noSuspension',
              name: 'noSuspension',
              component: () => import(/* webpackChunkName: "noSuspension" */ '@/views/newClient/NoSuspension.vue')
            },{ //搜索页
              path: 'search',
              name: 'search',
              component: () => import(/* webpackChunkName: "search" */ '@/views/newClient/Search.vue')
            },{ //视频
              path: 'video',
              name: 'video',
              component: () => import(/* webpackChunkName: "video" */ '@/views/client/Video.vue')
            },{ //点播播放
              path: 'pplay',
              name: 'pplay',
              component: () => import(/* webpackChunkName: "pplay" */ '@/views/newClient/videoPlay/Pplay.vue')
            },{ //直播播放 http
              path: 'hplay',
              name: 'hplay',
              component: () => import(/* webpackChunkName: "hplay" */ '@/views/newClient/videoPlay/Hplay.vue')
            },{ //评课新页面 http
              path: 'newplay',
              name: 'newplay',
              component: () => import(/* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Newplay.vue')
            },{ //直播播放 rtmp
              path: 'rplay',
              name: 'rplay',
              component: () => import(/* webpackChunkName: "rplay" */ '@/views/newClient/videoPlay/Rplay.vue')
            },{ //视频播放
              path: 'vplay',
              name: 'vplay',
              component: () => import(/* webpackChunkName: "vplay" */ '@/views/newClient/videoPlay/Vplay.vue')
            },      
            { //互动课堂
              path: 'interaction',
              name: 'interaction',
              component: () => import(/* webpackChunkName: "mvplay" */ '@/views/newClient/videoPlay/interaction.vue')
            }
          ],
        })
      }else {
        newRoutes.push( {//移动端
          path: '/mobile',
          name: 'mobile',
          component: () => import(/* webpackChunkName: "index" */ '@/views/mobile/Index.vue'),
          children:[
            { //首页
              path: 'home',
              name: 'mhome',
              component: () => import(/* webpackChunkName: "mhome" */ '@/views/mobile/Home.vue')
            },{ //直播
              path: 'live',
              name: 'mlive',
              component: () => import(/* webpackChunkName: "mlive" */ '@/views/mobile/Live.vue')
            },{ //搜索
              path: 'search',
              name: 'msearh',
              component: () => import(/* webpackChunkName: "msearh" */ '@/views/mobile/Search.vue')
            },{ //搜索结果
              path: 'searchres',
              name: 'msearhres',
              component: () => import(/* webpackChunkName: "msearhres" */ '@/views/mobile/SearchRes.vue')
            },{ //个人信息 退出登录
              path: 'userinfo',
              name: 'muserinfo',
              component: () => import(/* webpackChunkName: "muserinfo" */ '@/views/mobile/UserInfo.vue')
            },{ //点播
              path: 'back',
              name: 'mback',
              component: () => import(/* webpackChunkName: "mback" */ '@/views/mobile/Back.vue')
            },{ //视频
              path: 'video',
              name: 'mvideo',
              component: () => import(/* webpackChunkName: "mvideo" */ '@/views/mobile/Video.vue')
            },{ //点播播放
              path: 'pplay',
              name: 'mpplay',
              component: () => import(/* webpackChunkName: "mpplay" */ '@/views/mobile/videoPlay/Pplay.vue')
            },{ //直播播放 http
              path: 'hplay',
              name: 'mhplay',
              component: () => import(/* webpackChunkName: "mhplay" */ '@/views/mobile/videoPlay/Lplay.vue')
            },{ //直播播放 rtmp
              path: 'rplay',
              name: 'mrplay',
              component: () => import(/* webpackChunkName: "mrplay" */ '@/views/mobile/videoPlay/Lplay.vue')
            },{ //视频播放
              path: 'vplay',
              name: 'mvplay',
              component: () => import(/* webpackChunkName: "mvplay" */ '@/views/mobile/videoPlay/Vplay.vue')
            },
            { //登录
              path: 'login',
              name: 'mlogin',
              component: () => import(/* webpackChunkName: "mlogin" */ '@/views/mobile/Login.vue')
            },
          ]
        },)
        newRoutes.push({ //前台客户端
          path: '/',
          redirect: '/home',
          name: 'headFoot',
          component: () => import(/* webpackChunkName: "headFoot" */ '@/views/client/HeadFoot.vue'),
          children:[
            { //首页
              path: 'home',
              name: 'home',
              component: () => import(/* webpackChunkName: "home" */ '@/views/client/Home.vue')
            },{ //直播
              path: 'live',
              name: 'live',
              component: () => import(/* webpackChunkName: "live" */ '@/views/client/Live.vue')
            },{ //点播
              path: 'back',
              name: 'back',
              component: () => import(/* webpackChunkName: "back" */ '@/views/client/Back.vue')
            },{ //搜索页
              path: 'search',
              name: 'search',
              component: () => import(/* webpackChunkName: "search" */ '@/views/client/Search.vue')
            },{ //视频
              path: 'video',
              name: 'video',
              component: () => import(/* webpackChunkName: "video" */ '@/views/client/Video.vue')
            },{ //点播播放
              path: 'pplay',
              name: 'pplay',
              component: () => import(/* webpackChunkName: "pplay" */ '@/views/client/videoPlay/Pplay.vue')
            },{ //直播播放 http
              path: 'hplay',
              name: 'hplay',
              component: () => import(/* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Hplay.vue')
            },{ //直播播放 rtmp
              path: 'rplay',
              name: 'rplay',
              component: () => import(/* webpackChunkName: "rplay" */ '@/views/client/videoPlay/Rplay.vue')
            },{ //评课新页面 http
              path: 'newplay',
              name: 'newplay',
              component: () => import(/* webpackChunkName: "hplay" */ '@/views/client/videoPlay/Newplay.vue')
            },,{ //视频播放
              path: 'vplay',
              name: 'vplay',
              component: () => import(/* webpackChunkName: "vplay" */ '@/views/client/videoPlay/Vplay.vue')
            },      
            { //互动课堂
              path: 'interaction',
              name: 'interaction',
              component: () => import(/* webpackChunkName: "mvplay" */ '@/views/client/videoPlay/interaction.vue')
            },
          ],
        })
      }
  });
  return newRoutes;
}
export async function routeType(){
  let type
  await axios.get('/index/systemInfo').then(res => {
      type = res.data.uiType;
  });
  return type;
}