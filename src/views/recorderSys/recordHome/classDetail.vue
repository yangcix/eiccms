<!-- classDetail -->
<template>
  	<div class="content-main-wrap">
      <!-- <p class="content-title"> <span class="comeBack" @click="comeBack"> <i class="el-icon-back"></i> 返回</span>| 教室详情</p> -->
      <p class="content-title"><el-page-header @back="comeBack" content="教室详情"></el-page-header></p>
        <div class="main-wrap" id="main-wrap" >
          <div id="classDetail">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="巡课" name="first" style="min-width: 1400px">
                <div id="view-lesson">
                  <div class="content">
                    <div class="content-build">
                      <div class="building-list">
                        <el-collapse v-model="activeNames" @change="handleChange">
                          <el-collapse-item :name="buildingItem.id" v-for="(buildingItem,bIndex) in buildingList" :key="buildingItem.id">
                            <template slot="title">
                              <span class="building-name">{{buildingItem.name}}</span>
                            </template>
                            <div class="room-name" 
                            :class="currentBuildingId == buildingItem.id && currentRoomId == roomItem.id ? 'active-room':''"
                            v-for="(roomItem, rIndex) in buildingItem.roomList" 
                            :key="roomItem.id" 
                            @click="changeRoom(buildingItem.id,roomItem.id,bIndex,rIndex,roomItem)">{{roomItem.name}}</div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </div>
                    
                    <div class="view-window">
                      <div class="view-content">
                        <div v-show="enterStatus == 1">
                          <div class="room-title">{{currentSubject ? currentSubject : "无"}} - <span class="recorde-state">{{reordeStatus == 1 ? '录制中' : '未录制'}}</span> </div>
                          <div class="room-view">
                            <!-- <streamer :currentSingleUrl="currentSingleUrl"/> -->
                            <!-- <div v-if="detailInfo.themeStatus == 0" style="min-height:647px">
                              <div class="video-error">直播未开始！</div>
                            </div>
                            <div v-else>
                              <div class="video-content" id="videoWrap">
                                <div id="myVideo" ref="myVideo"></div>
                              </div>
                              <div class="video-error" v-show="videoErrorShow">视频源未找到！</div>
                            </div> -->
                            <!-- <video
                                id="mmiid"
                                class="video-js vjs-big-play-centered vjs-fluid video-content"
                                controls
                                preload="auto"
                                width="100%"
                                height="100%"
                                >
                            </video> -->
                            <div class="video-content" id="videoWrap">
                          </div>
                              <!-- <div class="video-error" v-show="videoErrorShow">视频源未找到！</div> -->
                          </div>
                        </div>
                        
                        <div class="singleErr" v-if="enterStatus == 0">
                          <img src="../../../assets/imgs/home-null.png" alt="">

                          <div>
                            <h3>请尝试以下方法：</h3>
                            <p>检查录播设备连接线是否正常</p>
                            <p>检查录播设备网络与流媒体平台网络是否相通</p>
                            <p>通过播放器检查录播设备输出信号是否正常</p>
                          </div>
                          
                        </div>

                        <div class="singleErr" v-else-if="enterStatus == -1">
                          <img src="../../../assets/imgs/home-null.png" alt="">
                          
                          <div>
                            <el-button class="add-dev" icon="el-icon-plus" @click="addDev">添加设备</el-button>
                          </div>
                          
                        </div>

                        <p class="view-tips" v-if="enterStatus == 1">巡课画面</p>
                        <div class="room-button">
                          <el-button type="text" @click="prev"><i class="el-icon-arrow-left el-icon--left"></i>上一间</el-button>
                          <div v-if="enterStatus == 1">
                            <el-button class="record-btn" icon="el-icon-video-camera-solid" v-if="reordeStatus != 1" @click="startRecord">开始录制</el-button>
                            <el-button class="record-btn" icon="el-icon-video-camera-solid" v-else>录制中...</el-button>
                          </div>
                          <el-button class="record-btn" icon="el-icon-edit-outline" @click="openShow">巡课笔记</el-button>
                          <el-button style="margin-left: 0;" type="text" @click="next">下一间<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                        </div>
                      </div>
                    </div>

                    <div class="change-single" v-if="enterStatus == 1 && singleList">
                      <p>切换信号</p>
                      <div class="source-single">
                        <el-button type="primary" class="btn" 
                        v-for="(singleItem) in singleList" 
                        :key="singleItem.type"
                        :plain="currentSingle !== singleItem.type" 
                        :disabled="!singleItem.url" 
                        @click="changeSingle(singleItem)">{{singleItem.type | singleName}}</el-button>
                      </div>
                    </div>
                  </div>

                  <el-dialog width="380px" title="选择录制时间" :visible.sync="recordVisible" center>
                    <el-form :inline="true" :model="form" class="demo-form-inline">
                      <el-form-item label="开始时间">
                        <el-time-picker
                            v-model="form.startTime"
                            @change="autoTime"
                            type="datetime"
                            style="width: 196px"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间">
                          </el-time-picker>
                          
                        <!-- <el-input v-model="form.startTime" placeholder="开始时间" @change = da></el-input> -->
                      </el-form-item>
                      <el-form-item label="结束时间">
                        <el-time-picker
                            v-model="form.endTime"
                            @change="verifyTime"
                            type="datetime"
                            style="width: 196px"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间">
                          </el-time-picker>
                        <!-- <el-input v-model="form.endTime" placeholder="结束时间"></el-input> -->
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="onSubmit">确 定</el-button>
                      </el-form-item>
                    </el-form>
                  </el-dialog>
                  <el-dialog
                    title="巡课笔记"
                    :close-on-click-modal="false"
                    :visible.sync="openShowDiaolg"
                    :before-close="openShowClose"
                    width="490px">
                    <div class="dialog-wrap">
                      <div class="auditItem">
                        <p>记录内容<em style="color: #F64646;">*</em>：</p>
                        <div class="dialog-item" style="margin-top: 5px;">
                          <el-input type="textarea" :rows="7" v-model="content"></el-input>
                        </div>
                        <div class="dialog-btn">
                          <el-button type="primary" style="width: 100px;"  @click="addText">提 交</el-button>
                        </div>
                      </div>
                    </div>
                  </el-dialog>
                </div>
              </el-tab-pane>

              <el-tab-pane label="课表" name="second" v-if="version != 1">
                <lesson-table :activeName="activeName" :enterClassId="enterClassId"></lesson-table>
              </el-tab-pane>

              <el-tab-pane label="录制视频" name="third">
                <record-list :activeName="activeName" :enterClassId="enterClassId"></record-list>
              </el-tab-pane>
              <el-tab-pane label="巡课笔记" name="fourth">
                <node-list :activeName="activeName" :enterClassId="currentRoomId"></node-list>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
    </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import "videojs-flvjs-es6";
import Videojs from 'video.js'
import FlvJsPlayer from 'xgplayer-flv.js';
import { dateFormat } from '../../../assets/js/utils'
import nodeList from '../../../components/nodeList.vue'
import lessonTable from '../../../components/lessonTable.vue'
import recordList from '../../../components/recordList.vue'
import streamer from '../../../components/webrtcStreamer/streamer.vue'
import {  mapActions, mapState } from 'vuex';
export default {
  components: {
    nodeList,
    lessonTable,
    recordList,
    streamer
  },

  data () {
    return {
      detailInfo: {},
      content: '',
      openShowDiaolg: false,
      liveIdTemp: '',
      activeName: 'first',  // tab
      myVideo: null,
      activeNames: [1],  // collapse 折叠版
      buildingList:[],
      currentRoomId: '', //当前房间
      currentBuildingId: '', //当前楼
      currentRoomIndex: '', //当前房间索引
      currenttBuildingIndex: '', //当前楼房索引
      currentSubject:'', // 当前课程名称
      singleList:[], // 信号源数据
      currentSingle:'director', // 当前信号源类型
      currentSingleUrl:'', // 当前信号源url
      enterStatus: 1, // 1 正常 0 异常 -1 无设备
      recordVisible:false,
      reordeStatus:'', // 录制状态  1录制中，0未录制
      currentEndTime:'', // 当前课程结束时间
      form:{
        startTime:'',
        endTime:''
      },
      enterBindex:'',  // 当前房间楼索引
      enterClassId:'',  // 当前房间classId
      enterClassroomId:'',  //当前房间classroomId
    };
  },
  filters: {
    singleName(type) {
      switch(type){
        case 'director':
          return '导播';
        case 'blackboard':
          return '板书';
        case 'teacherPanoramic':
          return '教师全景';
        case 'teacherFeature':
          return '教师特写';
        case 'studentPanoramic':
          return '学生全景';
        case 'studentFeature':
          return '学生特写';
      }
    }
  },

  computed: {
    version () {
				return localStorage.getItem('version') // 当前版本 1:标准版，2:专业版，3：旗舰版
		},
    ...mapState({
      classInfo:'classInfo'
    })
  },

  mounted() {
    this.enterBindex = this.classInfo.bindex;
    this.enterClassId = this.classInfo.classId == null ? "" : this.classInfo.classId;
    this.enterClassroomId = this.classInfo.id;
    this.getBuildingList();
    // window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e));
  },
  // beforeRouteLeave(to, form, next) {
  //   this.$axios.post('/sm/theme/stopLiveTemp', {liveIdTemp: this.liveIdTemp}).then(res => {});
  //   next()
  // },
  methods: {
    ...mapActions({
        commitSysModule:'commitSysModule',
        commitClassInfo:'commitClassInfo'
      }),
    beforeunloadHandler(e) {
        e = e || window.event;
        if (e) {
          this.$axios.post('/sm/theme/stopLiveTemp', {liveIdTemp: this.liveIdTemp}).then(res => {});
            e.returnValue = '关闭提示';
          }
        return '关闭提示';
    },
    openShow() {
      this.openShowDiaolg = true;
    },
    openShowClose(){
      this.content = '';
      this.openShowDiaolg = false;
    },
    addText() {
      if(this.content == '') {
        this.$message(' 记录内容必填！','error')
        return;
      }
      if(this.content.length > 100) {
        this.$message(' 记录内容需100字符内！','error')
        return;
      }
      this.$axios.post('/sys/note/save', {   
        classroomId: this.currentRoomId,
        context: this.content,
        teacherName: this.detailInfo.teacherName,
        subject: this.detailInfo.subject
      }).then(res => {
        if(res.code == 200) {
          this.$message('记录成功！','success')
        }
      })
      this.content = '';
      this.openShowDiaolg = false;
    },
    // 返回
    comeBack() {
      this.$router.push('/recordhome')
    },
    startFlv() {
      console.log(flvjs,'66666666666')
      if (flvjs.isSupported()) {
        var videoDom = document.getElementById('myVideo')
        let player = flvjs.createPlayer({
          type: 'flv', // 媒体类型，默认是 flv,
          isLive: true, // 是否是直播流
          hasAudio: true, // 是否有音频
          hanVideo: true, // 是否有视频
          url: this.playUrl, // 流地址
          volume: 0.6,
          ignores: ['play', 'progress'],
        },{
          autoCleanupMinBackwardDuration: true, // 清除缓存 对 SourceBuffer 进行自动清理
        });
        player.attachMediaElement(videoDom)
        player.load();
        player.play();
        this.myVideo = player;
      }
    },
			startVideo(){
        // this.myVideo = Videojs(document.getElementById('mmiid'),{
        //   autoplay: 'muted',//自动播放
        //   controls: true,//用户可以与之交互的控件
        //   loop:true,//视频一结束就重新开始
        //   muted:false,//默认情况下将使所有音频静音
        //   aspectRatio:"16:9",//显示比率
        //   fullscreen:{
        //     options: {navigationUI: 'hide'}
        //   },
        //   techOrder: ["html5", "flvjs"],// 兼容顺序
        //   flvjs: {
        //     mediaDataSource: {
        //         isLive: false,
        //         cors: true,
        //         withCredentials: false
        //     }
        //   },
        //   sources: [{ src: this.playUrl, 
        //   type: "video/x-flv" }]
        // })
        console.log(this.myVideo,'2222222222')
        if(this.myVideo !== null) {
        //  that.myVideo.config.url = this.playUrl;
          this.myVideo.destroy();
          this.myVideo = null;
          console.log(this.myVideo,'333333')
          this.myVideo = new FlvJsPlayer({
					id: 'myVideo',
					url: this.playUrl,
					// hasVideo: true,
					// hasAudio: true,
          volume: 0.6,
					width: 860,
					height: 560,
					autoplay: true,
					videoInit: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					ignores: ['play', 'progress'],
					isLive: true,
					lang: 'zh-cn',
					flvOptionalConfig: {
						enableStashBuffer: true,
						type: 'flv',
					},
				});
				const _this = this;
				if(document.getElementsByTagName('video').length>1){
					for(var i=0;i<document.getElementsByTagName('video').length;i++){
						if(i!=0){
							document.getElementsByTagName('video')[i].remove()
						}
					}
				}
        let video = document.getElementsByTagName('video')[0];
          video.addEventListener('loadedmetadata', function() {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('HTTP FLV流有画面');
            } else {
              console.log('HTTP FLV流没有画面');
              _this.startVideo();
            }
          });
				this.myVideo.on('error', function(e){
          //断流重接，结束不续播
          console.log('断流了',e)
          //断流重接，结束不续播
            _this.getSingleList();
				})
        }else{
          console.log(this.myVideo,'44444')
          this.myVideo = new FlvJsPlayer({
					id: 'myVideo',
					url: this.playUrl,
					// hasVideo: true,
					// hasAudio: true,
          volume: 0.6,
					width: 860,
					height: 560,
					autoplay: true,
					videoInit: true,
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					ignores: ['play', 'progress'],
					isLive: true,
					lang: 'zh-cn',
					flvOptionalConfig: {
						enableStashBuffer: true,
						type: 'flv',
					},
				});
				const _this = this;
				if(document.getElementsByTagName('video').length>1){
					for(var i=0;i<document.getElementsByTagName('video').length;i++){
						if(i!=0){
							document.getElementsByTagName('video')[i].remove()
						}
					}
				}
        let video = document.getElementsByTagName('video')[0];
          video.addEventListener('loadedmetadata', function() {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('HTTP FLV流有画面');
            } else {
              console.log('HTTP FLV流没有画面');
              _this.startVideo();
            }
          });
				this.myVideo.on('error', function(e){
          //断流重接，结束不续播
          console.log('断流了',e)
          //断流重接，结束不续播
            _this.getSingleList();
				})
        }
			},
    // 获取教学楼数据
    getBuildingList() {
      this.$axios.get('/sm/recordOverview/list').then(res => {
        let building = [] //临时教学楼数据
        res.data.forEach((buildingItem,bIndex) => {
          let item = Object.assign({},buildingItem)
          item.classroom = {};
          building[bIndex]=item;  // 拷贝教学楼数据
      
          building[bIndex].roomList = [];  // 创建房间数组字段

          if(buildingItem.floors && buildingItem.classrooms){

            for(let i=1;i<=buildingItem.floors;i++){  // 楼层循环
              for(let j=1;j<=buildingItem.classrooms;j++){ // 房间循环

                if(buildingItem.classroom[`${i}_${j}`]){  // 查找已有房间数据

                  building[bIndex].roomList.push(buildingItem.classroom[`${i}_${j}`])  //填入数据
                }else {
                  // // 空数据填入空数据
                  // building[bIndex].roomList.push({
                  //   name: "",
                  //   code:"",
                  //   className:"",
                  //   floorNumber:i,
                  //   classroomNumber: j,
                  //   teachingBuildingId:building[bIndex].id
                  // } )
                }
              }
            }
          }
        })

        this.buildingList = Object.assign([],building) // 拷贝数据 建立响应式数据

        this.currentBuildingId = this.buildingList[this.enterBindex].id; // 赋值当前房间 楼id
        this.currenttBuildingIndex = this.enterBindex; // // 赋值当前房间 楼索引
        
        this.activeNames = this.buildingList[this.enterBindex].id; // 折叠版展开
        this.buildingList[this.enterBindex].roomList.forEach((roomitem,index) => {
          if(roomitem.id == this.enterClassroomId){

            this.currentRoomId = roomitem.id; //当前房间
            this.currentRoomIndex = index; //当前房间索引
            
            if(this.enterStatus == 1){
              this.getSingleList();
            }
          }
        })
      })
    },

    // 获取信号源结束时间等信息
    getSingleList() {
      let div = document.getElementById("myVideo");
      if(div) {
        div.remove();
      }
      let videoEl = '';
      videoEl = `<div id="myVideo" ref="myVideo"></div>`
      let divs = document.querySelector('#videoWrap');
      if(divs) {
        document.querySelector('#videoWrap').innerHTML = videoEl;
      }
      this.$axios.get(`/sm/recordOverview/tourInfo?classroomId=${this.currentRoomId}&classId=${this.enterClassId}`).then(res => {
        this.detailInfo = res.data;
        this.currentSubject = res.data.subject;
        this.currentSingle = res.data.ruleDetailList[0] && res.data.ruleDetailList[0].type ? res.data.ruleDetailList[0].type : '';
        this.reordeStatus = res.data.status;
        this.singleList = res.data.ruleDetailList;
        this.currentEndTime = res.data.endTime;
        this.enterStatus = res.data.terminalStatus == null ? -1 : res.data.terminalStatus;
        // this.currentEndTime = '2021-01-01 11:11:11';
        console.log(res.data)
        this.singleList.forEach((single,index) => {
          if(single.type == this.currentSingle){
            this.currentSingleUrl = single.url
            let playUrl = single.lableJSon.http;
            this.liveIdTemp = single.liveIdTemp
						playUrl = process.env.NODE_ENV !== "production" ? playUrl : playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
						this.playUrl = playUrl;
            // this.startFlv();
            if(this.enterStatus == 1){
              this.startVideo();
            }
          }
        })
      })
    },
    handleClick(tab, event) {
      if(this.activeName == 'first') {
        if(this.myVideo == null) {
          this.getBuildingList();
        }
      } else{
        if(this.myVideo !== null) {
          this.myVideo.destroy();
          this.myVideo = null;
        }
      }
    },
    handleChange(val) {
      console.log(val);
    },
    
    // 添加设备
    addDev() {
      this.$axios.get('auth/menu').then(res => {
        let istrue = res.data.filter(el => el.id == 1022)
        if(istrue.length > 0){
          this.$router.push('/sys/terminal')
        }else{
          this.$message("您没有当前操作的权限，请联系管理员", "error"); 
        }
      })
    },

    // 改变房间
    changeRoom(building,room,bIndex,rIndex,roomItem) {
      this.currentRoomIndex = rIndex; //当前房间索引
      this.currenttBuildingIndex = bIndex; //当前楼房索引
      this.enterBindex = bIndex;
      this.enterClassroomId = room;
      this.currentRoomId = room ;//当前房间id
      this.currentBuildingId = building; //当前楼id
      this.enterClassId = this.buildingList[bIndex].roomList[rIndex].classId ? this.buildingList[bIndex].roomList[rIndex].classId : '';
      this.currentSingle = 'director';

      // 保存当前教室信息到vuex
      let data = JSON.parse(JSON.stringify(roomItem));
      data.bindex = bIndex;
      this.commitClassInfo(data);
      this.getSingleList(); // 重新获取信息
      this.$router.push({
        path: this.$route.path,
        query: {
          classId:this.enterClassId,
          classroomId: room,
          bindex: bIndex,
        }
      })
    },

    // 改变信号源
    changeSingle(single) {
      let div = document.getElementById("myVideo");
      if(div) {
        div.remove();
      }
      let videoEl = '';
      videoEl = `<div id="myVideo" ref="myVideo"></div>`
      let divs = document.querySelector('#videoWrap');
      if(divs) {
        document.querySelector('#videoWrap').innerHTML = videoEl;
      }
      this.currentSingle = single.type;
      this.currentSingleUrl = single.url;
      this.singleList.forEach((single,index) => {
        if(single.type == this.currentSingle){
          let playUrl = single.lableJSon.http;
          this.liveIdTemp = single.liveIdTemp 
          playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
          this.playUrl = playUrl;
          // this.startFlv();
          this.startVideo();
        }
      })
    },

    // 上一间
    prev() {
      let prevIndex = this.currentRoomIndex - 1;
      if(prevIndex<0){
        this.$message('无上一间教室','warning')
        return
      }else {
          this.currentRoomId =  this.buildingList[this.currenttBuildingIndex].roomList[prevIndex].id; // 赋值roomId
          this.currentRoomIndex =  prevIndex; // 赋值currentRoomIndex
          this.enterClassId = this.buildingList[this.currenttBuildingIndex].roomList[prevIndex].classId ? this.buildingList[this.currenttBuildingIndex].roomList[prevIndex].classId : '';
          this.currentSingle = 'director';
          // 保存当前教室信息到vuex
          let data = JSON.parse(JSON.stringify(this.buildingList[this.currenttBuildingIndex].roomList[prevIndex]));
          data.bindex = this.currenttBuildingIndex;
          this.commitClassInfo(data);
          this.getSingleList(); // 重新获取信息
          this.$router.push({
            path: this.$route.path,
            query: {
              classId:this.enterClassId,
              classroomId: this.currentRoomId,
              bindex: data.bindex,
            }
          })
          
      }
    },

    // 下一间
    next() {
      let nextIndex = this.currentRoomIndex + 1;

      let roomLength = this.buildingList[this.currenttBuildingIndex].roomList.length;
      if(nextIndex > roomLength-1){
        this.$message('无下一间教室','warning')
        return
      }else {
        this.currentRoomId =  this.buildingList[this.currenttBuildingIndex].roomList[nextIndex].id; // 赋值roomId
        this.currentRoomIndex =  nextIndex; // 赋值currentRoomIndex
        this.enterClassId = this.buildingList[this.currenttBuildingIndex].roomList[nextIndex].classId ? this.buildingList[this.currenttBuildingIndex].roomList[nextIndex].classId : '';
        this.currentSingle = 'director';
        // 保存当前教室信息到vuex
        let data = JSON.parse(JSON.stringify(this.buildingList[this.currenttBuildingIndex].roomList[nextIndex]));
        data.bindex = this.currenttBuildingIndex;
        this.commitClassInfo(data);
        this.getSingleList(); // 重新获取信息
        this.$router.push({
          path: this.$route.path,
          query: {
            classId:this.enterClassId,
            classroomId: this.currentRoomId,
            bindex: data.bindex,
          }
        })
      }
    },

    // 开始录制
    startRecord() {
      if(this.classInfo.classId) {
        this.form = {
          startTime:'',
          endTime:''
        }
        this.recordVisible = true;
      }else {
        this.$message('请先绑定班级再进行录制','error')
      }
    },

    // 自动结束时间加45分
    autoTime () {
      if(this.form.startTime){
        if((new Date(this.form.startTime).getTime()) < (new Date().getTime())) {
          this.form.startTime = '';
          return this.$message('开始时间不能小于当前时间', 'error')
        }
        let endTime = this.form.startTime.getTime() + 2700000 // 需改为本节课开始时间
        this.form.endTime = new Date(endTime)
        // this.form.endTime = this.currentEndTime;
      }
    },
    // 时间校验
    verifyTime() {
      if(this.form.endTime && this.form.startTime >= this.form.endTime){
        this.$message('结束时间不得早于或等于开始时间','warning')
        this.form.endTime = ''
        return
      }
    },

    // 确定时间
    onSubmit() {
      if(this.form.startTime && this.form.endTime){
        let date = {
          classroomId: this.currentRoomId,
          startTime: dateFormat("YYYY-mm-dd HH:MM:SS",this.form.startTime),
          endTime: dateFormat("YYYY-mm-dd HH:MM:SS",this.form.endTime),
        }
        
        this.$axios.post('/sm/recordOverview/addRecord',date).then(res => {
          if(res.code == 200){
            console.log(res)
            this.recordVisible = false;
            if((new Date(this.form.startTime).getTime()) < (new Date().getTime())){
              this.reordeStatus = 1;
            }
            this.$message('开启录制成功','success')
          }else{
            this.recordVisible = false;
            // this.$message('开启录制失败','error')
          }
        })
        
      }else {
        this.$message('请输入开始时间和结束时间','error')
      }
    },
  },
  beforeDestroy() {
    if (this.myVideo && this.myVideo.destroy) {
			this.myVideo.destroy();
		}
  }
  // destroyed() {
  //   window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
  //   window.removeEventListener('unload', this.updateHandler);
  // }
}

</script>
<style lang='scss' scoped>
  .comeBack {
    margin-right: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }
  #view-lesson {
  .content {
    display: flex;
    .content-build {
      width: 156px;
      height: 550px;
      overflow: hidden;
      background: #FFFFFF;
      box-shadow: 3px 3px 12px rgba(171, 171, 171, 0.16);
      margin-top: 52px;
      .building-list {
        width: 122px;
        height: 550px;
        padding: 0 22px 0 20px;
        overflow: hidden;
        overflow-y:scroll;
        
        .el-collapse {
          border-top:0;
           ::v-deep .el-collapse-item__header{
            min-height: 48px;
            height: 100%;
          }
        }

        .building-name{
          word-break: break-all;
          line-height: 18px;
          font-size: 18px;
          font-weight: bold;
          color: #333333;
          padding: 10px 0;
        }

        .room-name {
          margin: 10px 0;
          width: 114px;
          // height: 30px;
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          color: #303133;
          cursor: pointer;
        }
        .active-room {
          font-size: 14px;
          font-weight: bold;
          line-height: 14px;
          color: #409EFF;
        }
      }

    }

    .view-window {
      width: 979px;
      height: 718px;

      .view-content {
        width: 860px;
        height: 700px;
        margin:auto;

        .room-title {
          padding: 16px 0;

          .recorde-state {
            color: #00B779;
          }
        }

        .room-view {
          height: 560px;
          background:black;
        }

        .singleErr {
          text-align: center;
          height: 520px;

          img {
            width: 50%;
            margin:130px 0 80px 0;
          }

          .add-dev {
            background: #00B779;
            color: #fff;
            border: none;
            border-radius: 7px;
            margin: 0;
          }
        }

        .view-tips {
          text-align: center;
          margin:10px 0;
        }

        .room-button {
          display: flex;
          justify-content: space-between;
          margin: 20px 240px;
          align-items: center;
          .record-btn {
            background: #00B779;
            color: #fff;
            border: none;
            border-radius: 7px;
            margin: 0;
          }
        }
        
      }
    }

    .change-single {
      width: 300px;
      margin-top: 66px;
      
      p {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        margin:10px 0;
      }
      
      .source-single {
        display: flex;
        flex-wrap: wrap;

        .btn{
          margin:20px 20px 20px 0;
          border-radius: 7px;
          font-size: 16px;
          width: 120px;
        }
      }
    }
  }

  .demo-form-inline {
    text-align: center; 
  }
 }
 .video-content{
  width: 860px;
  height: 560px;
 }
 .dialog-btn{
  display: flex;
  justify-content: center;
 }
  ::v-deep .el-tabs__header{
    margin: 0;
  }
 ::v-deep .el-tabs__content{
  overflow: auto;
}
</style>