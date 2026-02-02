<template>
  <div class="room-wrap">
    <div class="room-head">
      <!-- <span style="position:absolute;left:80px;top:16px">估算网络延时：{{currentNetRtt}}ms - 估算有效下载速度：{{currentDownLink}}MB/s - 当前网络状态：{{effectiveType}}</span> -->
      <p class="class-name">{{ detail.name }}</p>
      <ul class="opera-wrap">
        <li
          @click="connectApply"
          v-if="
            $route.query.isBystanderIn != 1 &&
            detail.playStatus == 0 &&
            client !== null
          "
        >
          <i class="iconfont icon-lianmai"></i>请求连麦
        </li>
        <li
          v-if="$route.query.isBystanderIn != 1"
          @click="openDialog"
          style="width: 110px; margin-right: 5px; padding: 0 5px"
        >
          <i class="el-icon-setting"></i>信号源设置
        </li>
        <li @click="leaveRoom"><i class="iconfont icon-tuichu"></i></li>
      </ul>
    </div>

    <div class="room-content">
      <div class="control">
        <ul>
          <li @mouseenter="sliderIs = true" @mouseleave="sliderIs = false">
            <i class="iconfont icon-laba"></i>
            音量
            <div class="slider" v-if="sliderIs">
              <el-slider
                v-model="sliderValue"
                @input="handleChange()"
              ></el-slider>
            </div>
          </li>
          <li @click="handleFullscreen">
            <i
              class="iconfont"
              :class="[
                fullscreen ? 'icontuichuquanping' : 'icon-shipinquanping',
              ]"
            ></i>
            全屏
          </li>
        </ul>
      </div>

      <div class="room-main" id="mainVideoWrap">
        <div id="mainContent" class="content-wrap">
          <!-- <p v-if="me.isLive == 2" class="wait" style="z-index: 99">
            网络异常，正在加载中
          </p>
          <p
            v-if="me.isLive !== 1 && me.isLive !== 2"
            class="wait"
            style="z-index: 99"
          >
            {{ detail.playStatus | videoMsg }}
          </p> -->
          <p class="room-name">
            主讲教室：<span style="margin-left: 5px"
              >{{ me.org_name }} — {{ me.user_name }}</span
            >
          </p>
          <div
            class="video-wrap"
            :id="'wrap' + me.user_id"
            @click="changePosition('mainContent', 'main')"
          >
            <main-peer-view
              :status='detail.playStatus'
              :info="me"
              :mutedFlag="me.mutedFlag"
              :isMe="0"
              :isLive="me.isLive"
              :url="me.url"
              @openValue="openValue"
            ></main-peer-view>
          </div>
          <p class="operate-wrap">
            <span>
              <!-- <i class="iconfont icon-mic-on-full"></i> -->
              <i
                v-if="detail.playStatus == 0"
                class="iconfont"
                :class="me.mutedFlag == 2 ? 'icon-mic-on-full' : 'icon-mic-off-full'"
              ></i>
              <!-- <i class="iconfont icon-laba" @click.stop="videoMuted($event, mainInfo.classroomId)"></i> -->
            </span>
            <i
              class="iconfont icon-shipinquanping"
              style="cursor: pointer"
              @click.stop="videoFull(me.user_id, me.isLive)"
            ></i>
          </p>
        </div>
      </div>

      <div class="room-connect">
        <ul v-if="others.length > 0">
          <li v-for="(val, index) in others" :key="index">
            <div :id="'videobox' + val.user_id" class="content-wrap">
              <!-- <p v-if="me.isLive == 2" class="wait" style="z-index: 99">
                网络异常，正在加载中
              </p>
              <p
                v-if="val.isLive !== 1 && val.isLive !== 2"
                class="wait"
                style="z-index: 99"
              >
                {{ detail.playStatus | videoMsg }}
              </p> -->
              <p class="room-name">
                听讲教室：<span style="margin-left: 5px"
                  >{{ val.org_name }} — {{ val.user_name }}</span
                >
              </p>
              <div
                class="video-wrap"
                :id="'wrap' + val.user_id"
                @click="changePosition('videobox' + val.user_id, val, $event)"
              >
                <main-peer-view
                  :status='detail.playStatus'
                  :info="val"
                  :mutedFlag="val.mutedFlag"
                  :isLive="val.isLive"
                  :isMe="val.user_id == userId ? 1 : 0"
                  :url="val.url"
                  @openValue="openValue"
                ></main-peer-view>
                <!-- <peer-view :info="val" :audioTrack="(val.mutedFlag && userId != val.user_id.split('_')[0] )? val.audioTrack : null" :videoTrack="val.videoTrack" @click="changePosition('videobox' + val.user_id,val,$event)"></peer-view> -->
              </div>
              <p class="operate-wrap">
                <span>
                  <i
                    v-show="val.isLive == 1"
                    class="iconfont"
                    :class="
                      val.mutedFlag == 2 ? 'icon-mic-on-full' : 'icon-mic-off-full'
                    "
                    @click.stop="videoMicrophone(val.user_id)"
                  ></i>
                </span>
                <i
                  class="iconfont icon-shipinquanping"
                  style="cursor: pointer"
                  @click.stop="videoFull(val.user_id, val.isLive)"
                ></i>
              </p>
            </div>
          </li>
        </ul>
        <div class="not" v-else>暂无在线房间！</div>
      </div>
    </div>
    <div class="bottom-line"></div>
    <el-dialog
      title="信号源设置"
      :close-on-click-modal="false"
      :show-close="true"
      :visible.sync="signShow"
      width="550px"
      :before-close="clearDialog"
    >
      <div>
        <el-tabs tab-position="left" style="height: 300px">
          <el-tab-pane label="视频设置">
            <div
              style="
                display: flex;
                justify-content: start;
                align-items: center;
                margin-left: 20px;
              "
            >
              <div style="width: 80px">来源</div>
              <el-select
                v-model="signalSource"
                style="width: 248px"
                @change="changeSingal"
              >
                <el-option
                  v-for="item in signalList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div
              v-if="signalSource == 1"
              style="
                display: flex;
                justify-content: start;
                align-items: center;
                margin-left: 20px;
                margin-top: 15px;
              "
            >
              <div style="width: 80px">教室位置</div>
              <el-select
                v-model="teachingBuildingId"
                @change="buildingChange"
                placeholder="选择教学楼"
                style="margin-right: 8px; width: 120px"
                filterable
              >
                <el-option
                  v-for="item in teachBuildlList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="classroomId"
                placeholder="选择教室"
                @change="handleFacility"
                style="margin-right: 8px; width: 120px"
                filterable
              >
                <el-option
                  v-for="item in classroomList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div
              v-if="signalSource == 1"
              style="
                display: flex;
                justify-content: start;
                align-items: center;
                margin-left: 20px;
                margin-top: 15px;
              "
            >
              <div style="width: 80px">信号设备</div>
              <el-select
                v-model="facilityId"
                placeholder="选择设备"
                style="width: 248px"
                filterable
              >
                <el-option
                  v-for="item in facilityIdList"
                  :key="item.id"
                  :label="item.terminalName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div
              v-if="signalSource == 2"
              style="
                display: flex;
                justify-content: start;
                align-items: center;
                margin-left: 20px;
                margin-top: 15px;
              "
            >
              <div style="width: 80px">摄像头</div>
              <el-select
                v-model="localVideoId"
                :placeholder="
                  localVideoList.length > 0 ? '请选择设备' : '未检测到信号源'
                "
                style="width: 248px"
                clearable
                filterable
              >
                <el-option
                  v-for="item in localVideoList"
                  :key="item.deviceId"
                  :label="item.label"
                  :value="item.deviceId"
                >
                </el-option>
              </el-select>
            </div>
            <div
              v-if="signalSource == 2"
              style="
                text-align: right;
                margin-right: 56px;
                margin-top: 15px;
              "
            ><span style="color: #409EFF;font-size:12px;cursor: pointer;" @click="startVisible = true">查看指引</span>
          </div>
          </el-tab-pane>
          <el-tab-pane v-if="signalSource == 2" label="音频设置">
            <div
              v-if="signalSource == 2"
              style="
                display: flex;
                justify-content: start;
                align-items: center;
                margin-left: 20px;
              "
            >
              <div style="width: 80px">麦克风</div>
              <el-select
                v-model="localAudioId"
                :placeholder="
                  localAudioList.length > 0 ? '请选择设备' : '未检测到信号源'
                "
                style="width: 248px"
                clearable
                filterable
              >
                <el-option
                  v-for="item in localAudioList"
                  :key="item.deviceId"
                  :label="item.label"
                  :value="item.deviceId"
                >
                </el-option>
              </el-select>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="dialog-btn">
          <el-button style="width: 100px" type="primary" @click="setSign"
            >确 定</el-button
          >
          <el-button style="width: 100px" @click="openView">预 览</el-button>
          <el-button style="width: 100px" @click="clearDialog">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewShow"
      title="画面预览"
      @close="distoryMyvideo"
      width="690px"
    >
      <div class="dialog-wrap">
        <div v-if="signalSource == 1" class="video-content" id="videoWrap">
          <div id="myVideo" ref="myVideo"></div>
        </div>
        <video v-else id="localVideo" autoplay="autoplay" width="600"></video>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="openValueShow"
      :close-on-press-escape="false"
      :show-close="false"
      width="420px"
    >
      <div class="dialog-wrap">
        <p style="margin: 20px 0 40px 0; font-size: 15px">
          当前互动为静音状态，请点击以下按钮确认开启！
        </p>
        <div class="dialog-btn">
          <el-button type="primary" @click="openValues" style="margin: 0 auto"
            >立即开启</el-button
          >
          <!-- <el-button v-if="mainInfo.needModifiedPassword == false" @click="closeChangePwd">取 消</el-button> -->
        </div>
      </div>
    </el-dialog>
    <el-dialog
        title="提示"
        :close-on-click-modal="false"
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
import Srs from "@/assets/js/srs.js";
import FlvJsPlayer from "xgplayer-flv.js";
import { MyEvent } from "../../../assets/js/RoomClient";
import RoomClient from "../../../assets/js/RoomClient";
import { IEVersion, session, dateFormat, getNowDate } from "@/assets/js/utils";
import wsMixin from "@/components/wsMixin.vue";
import MainPeerView from "./mainPeer.vue";
export default {
  mixins: [wsMixin],
  name: "",
  components: { MainPeerView },
  data() {
    return {
      startVisible: false,
      uiType: JSON.parse(localStorage.getItem("sysInfo")).uiType,
      myUrl: "", // 我的推流地址
      userId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).userId : '',
      playUrl: "", // 互动设备地址
      viewShow: false,
      myVideo: null,
      localVideoId: "",
      localAudioId: "",
      localVideoList: [],
      localAudioList: [],
      facilityId: "",
      facilityIdList: [],
      classroomList: [],
      teachBuildlList: [],
      teachingBuildingId: "",
      classroomId: "",
      signalSource: 1,
      signalList: [
        {
          value: 1,
          label: "教室信号",
        },
        {
          value: 2,
          label: "本地信号",
        },
      ],
      signShow: false,
      detail: {},
      showMsg: true,
      // videoMsg: "等待老师进入中...",
      currentEl: "mainContent",
      currentRoom: {},
      themeName: this.$route.query.name,
      connectApplyFlag: false,
      userInfo: {},
      websock: null,
      fullscreen: false, // 是否全屏
      sliderValue:
        session.get("sliderValue") !== null
          ? parseInt(session.get("sliderValue") * 100)
          : 100, // 音量调节
      sliderIs: false, // 音量if
      isBystanderIn: this.$route.query.isBystanderIn, // 是否校内旁观者
      mainIsRight: "", // 主讲是否与副讲交换位置 存储用
      currentElId: "", // 当前主画面的id
      netTestTimer: null, // 网络测试定时器
      currentNetRtt: 100, // 当前网络延迟
      currentDownLink: 0, // 当前下载速度
      effectiveType: "4g", // 当前网络状态
      client: null,
      loginType: "web",
      me: {
        isLive: 0,
        userName: "",
        user_id: "",
        mutedFlag: 2,
        className: "",
        url: "",
      },
      others: [],
      userName: "",
      settime: null,
      openValueShow: false,
      settimePush: null,
    };
  },
  computed: {},
  beforeRouteLeave(to, from, next) {
    Srs.stopPublish();
    if (this.client !== null) {
      this.client.leaveRoom();
    }
    // sessionStorage.removeItem("interactData");
    console.log("浏览器返回");
    if (this.websock) this.websock.close();
    // this.changePosition('mainContent','main');
    next();
  },
  watch: {},
  mounted() {
    this.getDetail();
    this.getUserInfo();
    window.addEventListener("beforeunload", () => {
      console.log("页面刷新");
      Srs.stopPublish();
      if (this.client !== null) {
        this.client.leaveRoom();
      }
    });
    if (IEVersion() != -1) {
      this.$message(
        "暂不支持IE浏览器或者兼容模式，请使用chrom浏览器或者极速模式",
        "error"
      );
      this.$router.go(-1);
    }
    this.initStyle();
    this.visity();
  },
  methods: {
    toLogin() {},
    clearDialog() {
      this.localVideoId = "";
      this.localAudioId = "";
      this.signalSource = 1;
      this.teachingBuildingId = "";
      this.classroomId = "";
      this.facilityId = "";
      this.signShow = false;
    },
    openDialog() {
      if (sessionStorage.getItem("interactData")) {
        let data = JSON.parse(sessionStorage.getItem("interactData"));
        if (data.signalSource == 1) {
          this.signalSource = data.signalSource;
          this.teachingBuildingId = data.teachingBuildingId;
          this.classroomId = data.classroomId;
          this.facilityId = data.terminalId;
          this.$axios
            .get("/sm/theme/getSelectTerminal", {
              themeId: this.detail.id,
              type: 3,
              userId: JSON.parse(localStorage.getItem("userInfo")).userId,
              classroomId: this.classroomId,
              startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
              endTime: this.detail.endTime,
            })
            .then((res) => {
              this.facilityIdList = res.data;
            });
        } else {
          this.getCameraList();
          this.signalSource = 2;
          this.localVideoId = data.localVideoId;
          this.localAudioId = data.localAudioId;
        }
      }
      this.signShow = true;
    },
    // 检测本地信号
    checkLocal(val) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: this.localVideoId
              ? { exact: this.localVideoId }
              : undefined,
          },
        })
        .then((stream) => {
          console.log(stream, "本地有视频信号");
        })
        .catch((err) => {
          console.log(err, "本地视频信号异常");
          this.localVideoId = "";
          this.$message(
            val
              ? "没有可用的视频信号，无法开启授课，请检查设备"
              : "本地视频信号异常，请检查本地视频设备",
            "error"
          );
          return true;
        });
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: this.localAudioId
              ? { exact: this.localAudioId }
              : undefined,
          },
        })
        .then((stream) => {
          console.log(stream, "本地有音频信号");
        })
        .catch((err) => {
          this.localAudioId = "";
          console.log(err, "本地音频信号异常");
          this.$message(
            val
              ? "没有可用的音频信号，无法开启授课，请检查设备"
              : "本地音频信号异常，请检查本地音频设备",
            "error"
          );
          return true;
        });
    },
    // 检测信号源
    checkSign() {
      let config = this.facilityIdList.filter(
        (item) => item.id == this.facilityId
      )[0];
      data = {
        classroomId: this.classroomId,
        role: 0,
        orgId: this.detail.orgId,
        code: config.terminalName,
        interactiveId: this.detail.id,
        terminalId: this.facilityId,
        startTime: this.detail.startTime,
        endTime: this.detail.endTime,
      };
      this.$axios
        .get("/sm/interactive/checkUrl", { url: this.playUrl })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$axios.post("/sm/interactive/setRoom", data).then(() => {
              sessionStorage.setItem(
                "interactData",
                JSON.stringify({
                  id: this.$route.query.id,
                  signalSource: this.signalSource,
                  teachingBuildingId: this.teachingBuildingId,
                  classroomId: this.classroomId,
                  terminalId: this.facilityId,
                })
              );
            });
          }
        })
        .catch((err) => {
          return true;
        });
    },
    checkUser() {
      let data = new FormData();
      data.append("id", parseInt(this.$route.query.id));
      this.$axios.post(`/sm/interactive/checkUser`, data).then((res) => {
        this.getTeachBuildList(this.detail.orgId);
        if(sessionStorage.getItem('interactData') && JSON.parse(sessionStorage.getItem('interactData')).id !== this.$route.query.id){
          sessionStorage.removeItem('interactData')
        }
        if (sessionStorage.getItem("interactData")) {
          let old = JSON.parse(sessionStorage.getItem("interactData"));
          console.log(old, "上一个设备");
          this.signalSource = old.signalSource;
          // if(this.detail.playStatus == 0){
          if (old.signalSource == 1) {
            this.getClassroomList(old.teachingBuildingId);
            this.$axios
              .get("/sm/theme/getSelectTerminal", {
                themeId: this.detail.id,
                type: 3,
                userId: JSON.parse(localStorage.getItem("userInfo")).userId,
                classroomId: old.classroomId,
                startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
                endTime: this.detail.endTime,
              })
              .then((res) => {
                this.facilityIdList = res.data;
                this.$nextTick(() => {
                  this.teachingBuildingId = old.teachingBuildingId;
                  this.classroomId = old.classroomId;
                  this.facilityId = old.terminalId;
                  this.playUrl = old.url;
                  let config = this.facilityIdList.filter(
                    (item) => item.id == this.facilityId
                  )[0];
                  console.log(config, "config");
                  let data = {
                    classroomId: this.classroomId,
                    role: 0,
                    orgId: this.detail.orgId,
                    code: config.terminalName,
                    interactiveId: this.detail.id,
                    terminalId: this.facilityId,
                    startTime: this.detail.startTime,
                    endTime: this.detail.endTime,
                  };
                  this.$axios
                    .get("/sm/interactive/checkUrl", { url: this.playUrl })
                    .then((res) => {
                      if (res.code == 200 && res.data) {
                        this.$axios
                          .post("/sm/interactive/setRoom", data)
                          .then((ress) => {
                            if (ress.code == 200) {
                              this.setInit();
                            } else {
                              this.signShow = true;
                            }
                          });
                      }else{
                        this.signShow = true
                      }
                    });
                });
              });
          } else {
            if (!this.checkLocal()) {
              this.getCameraList();
              this.localVideoId = old.localVideoId;
              this.localAudioId = old.localAudioId;
              this.setInit();
            }
          }
          // }
        } else {
          this.signShow = true;
        }
      });
    },
    // 预览
    openView() {
      if (!this.verify()) {
        if (this.signalSource == 1) {
          this.$axios
            .get(`/sm/recordOverview/tourInfo?classroomId=${this.classroomId}`)
            .then((res) => {
              if (res.code == 200 && res.data) {
                this.viewShow = true;
                this.$nextTick(() => {
                  this.initVideo(1, res.data.ruleDetailList[0].lableJSon.http);
                });
              }
            });
        } else {
          this.viewShow = true;
          this.$nextTick(() => {
            this.initVideo(2);
          });
        }
      }
    },
    // 销毁播放器
    distoryMyvideo() {
      if (this.signalSource == 1) {
        this.myVideo.destroy();
        this.myVideo = null;
      } else {
        if (window.stream) {
          // 如果流存在,那就先清除/停止
          window.stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
        document.getElementById("localVideo").srcObject = "";
      }
    },
    // 预览初始化视频
    initVideo(type, val) {
      if (type == 1) {
        if (this.myVideo !== null) {
          this.myVideo.destroy();
          this.myVideo = null;
          this.myVideo = new FlvJsPlayer({
            id: "myVideo",
            url: val,
            volume: 0.6,
            width: 600,
            // height: 336,
            autoplay: true,
            videoInit: true,
            closeVideoClick: true,
            closeVideoTouch: true,
            errorTips: "暂无视频源",
            ignores: ["play", "progress"],
            isLive: true,
            lang: "zh-cn",
            flvOptionalConfig: {
              enableStashBuffer: true,
              type: "flv",
            },
          });
          const _this = this;
          if (
            document.getElementById("videoWrap").getElementsByTagName("video")
              .length > 1
          ) {
            for (
              var i = 0;
              i <
              document.getElementById("videoWrap").getElementsByTagName("video")
                .length;
              i++
            ) {
              if (i != 0) {
                document
                  .getElementById("videoWrap")
                  .getElementsByTagName("video")
                  [i].remove();
              }
            }
          }
          let video = document
            .getElementById("videoWrap")
            .getElementsByTagName("video")[0];
          video.addEventListener("loadedmetadata", function () {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log("HTTP FLV流有画面");
            } else {
              console.log("HTTP FLV流没有画面");
              _this.initVideo(1, val);
            }
          });
          this.myVideo.on("error", function (e) {
            //断流重接，结束不续播
            console.log("断流了", e);
            //断流重接，结束不续播
            _this.initVideo(1, val);
          });
        } else {
          console.log("dddddddddddd", document.getElementById("videoWrap"));
          this.myVideo = new FlvJsPlayer({
            id: "myVideo",
            url: val,
            volume: 0.6,
            width: 600,
            // height: 336,
            autoplay: true,
            videoInit: true,
            closeVideoClick: true,
            closeVideoTouch: true,
            errorTips: "暂无视频源",
            ignores: ["play", "progress"],
            isLive: true,
            lang: "zh-cn",
            flvOptionalConfig: {
              enableStashBuffer: true,
              type: "flv",
            },
          });
          const _this = this;
          if (
            document.getElementById("videoWrap").getElementsByTagName("video")
              .length > 1
          ) {
            for (
              var i = 0;
              i <
              document.getElementById("videoWrap").getElementsByTagName("video")
                .length;
              i++
            ) {
              if (i != 0) {
                document
                  .getElementById("videoWrap")
                  .getElementsByTagName("video")
                  [i].remove();
              }
            }
          }
          let video = document
            .getElementById("videoWrap")
            .getElementsByTagName("video")[0];
          video.addEventListener("loadedmetadata", function () {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log("HTTP FLV流有画面");
            } else {
              console.log("HTTP FLV流没有画面");
              _this.initVideo(1, val);
            }
          });
          this.myVideo.on("error", function (e) {
            //断流重接，结束不续播
            console.log("断流了", e);
            //断流重接，结束不续播
            _this.initVideo(1, val);
          });
        }
      } else {
        if (window.stream) {
          // 如果流存在,那就先清除/停止
          window.stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
        try {
          window.AudioContext =
            window.AudioContext || window.webkitAudioContext;
          window.audioContext = new AudioContext();
        } catch (e) {
          alert("Web Audio API not supported.");
        }
        const constraints = {
          audio: {
            deviceId: this.localAudioId
              ? { exact: this.localAudioId }
              : undefined,
          },
          video: {
            deviceId: this.localVideoId
              ? { exact: this.localVideoId }
              : undefined,
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            console.log(stream, "stream");
            window.stream = stream; // make stream available to console  保存全局流信息
            document.getElementById("localVideo").srcObject = stream;
          })
          .catch((err) => {
            console.log(err, "音频");
          });
      }
    },
    // 开始初始化页面播放互动
    setInit() {
      if (this.client) {
        Srs.stopPublish();
        MyEvent.off("message", this.handleopenMicrophone);
        this.client.leaveRoom();
      }
      const that = this;
      MyEvent.on("message", this.handleopenMicrophone);
      // MyEvent.on('messages', this.handleopenMicrophones);
      window.addEventListener("resize", () => {
        this.initStyle();
        if (!that.handleCheckFull()) {
          that.fullscreen = false;
        }
      });
      if (!JSON.parse(window.localStorage.getItem("userInfo"))) {
        this.$router.go(-1);
      }
      const { account, password } = JSON.parse(
        window.localStorage.getItem("userInfo")
      );
      let client = new RoomClient({
        account,
        password,
        url: this.playUrl,
        id: this.$route.query.id,
        isLocal: this.signalSource == 2 ? 1 : 0,
        localAudioId: this.localAudioId,
        localVideoId: this.localVideoId,
      });
      // client.on("close",(data)=>{
      //   console.log(data)
      // })
      client.joinRoom();
      window["changeStatus"] = () => {
        this.me.isLive = 2;
        this.others.forEach((el) => {
          el.isLive = 2;
        });
        this.$forceUpdate();
      };
      window["joinRoom"] = () => {
        if(this.client !== null){
          this.client.closeSocket()
          console.log('关')
        }
        client.joinRoom();
      };
      this.client = client;
    },
    // 切换信号
    changeSingal() {
      if (this.signalSource == 2) {
        this.localVideoId = "";
        this.localAudioId = "";
        this.getCameraList();
      } else {
        this.getTeachBuildList();
        this.facilityIdList = [];
        this.classroomList = [];
        this.teachingBuildingId = "";
        this.classroomId = "";
        this.facilityId = "";
      }
    },
    getCameraList() {
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        //调用用户媒体设备, 访问摄像头
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((res) => {
            if (
              !navigator.mediaDevices ||
              !navigator.mediaDevices.enumerateDevices
            ) {
              console.log("menumerateDevices is not supported!");
            } else {
              navigator.mediaDevices.enumerateDevices().then((res) => {
                console.log("本地", res);
                let countV = 1;
                let countAIn = 1;
                this.localVideoList = res
                  .filter((el) => {
                    if (el.kind === "videoinput") {
                      return el;
                    }
                  })
                  .map((device) => {
                    return {
                      deviceId: device.deviceId,
                      label: device.label || `相机 ${countV++}`,
                    };
                  });
                this.localAudioList = res
                  .filter((el) => {
                    if (el.kind === "audioinput") {
                      return el;
                    }
                  })
                  .map((device) => {
                    return {
                      deviceId: device.deviceId,
                      label: device.label || `麦克风 ${countAIn++}`,
                    };
                  });
              });
            }
          })
          .catch((error) => {
            this.localVideoId = "";
            this.localAudioId = "";
            this.localVideoList = [];
            this.localAudioList = [];
            this.$message("暂无可用本地设备", "error");
          });
      } else {
        this.localVideoId = "";
        this.localAudioId = "";
        this.localVideoList = [];
        this.localAudioList = [];
        return this.$message("请允许浏览器访问本地设备", "error");
      }
    },
    //获取教学楼列表
    getTeachBuildList(orgId) {
      this.teachBuildlList = [];
      this.$axios
        .get("/sys/classroom/getTeachBuildList", { orgId: orgId })
        .then((res) => {
          this.teachBuildlList = res.data;
        });
    },
    //选择教学楼后 教室修改
    buildingChange(id) {
      this.classroomId = "";
      this.facilityId = "";
      this.getClassroomList(id);
    },
    //根据教学楼id获取教室列表
    getClassroomList(buildingId) {
      this.classroomId = "";
      this.facilityId = "";
      this.$axios
        .get("/sys/classroom/getClassroomList", { buildingId: buildingId })
        .then((res) => {
          this.classroomList = res.data;
        });
    },
    // 根据教室id获取设备列表
    handleFacility(facilityId) {
      this.facilityId = "";
      this.$axios
        .get("/sm/theme/getSelectTerminal", {
          themeId: this.detail.id,
          type: 3,
          classroomId: facilityId,
          userId: this.userId,
          startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
          endTime: this.detail.endTime,
        })
        .then((res) => {
          this.facilityIdList = res.data;
        });
    },
    setSign() {
      if (new Date(this.detail.endTime) < new Date(getNowDate())) {
        this.$message("该主题已结束", "error");
        setTimeout(() => {
          this.$router.push({
            path: "/interactlogin",
            query: { id: this.$route.query.id },
          });
        }, 1000);
        return;
      }
      if (!this.verify()) {
        let data = {};
        if (this.signalSource == 1) {
          let config = this.facilityIdList.filter(
            (item) => item.id == this.facilityId
          )[0];
          data = {
            classroomId: this.classroomId,
            role: 0,
            orgId: this.detail.orgId,
            code: config.terminalName,
            interactiveId: this.detail.id,
            terminalId: this.facilityId,
            startTime: this.detail.startTime,
            endTime: this.detail.endTime,
          };
          this.playUrl = config.url;
          this.$axios
            .get("/sm/interactive/checkUrl", { url: this.playUrl })
            .then((res) => {
              if (res.code == 200 && res.data) {
                this.$axios
                  .post("/sm/interactive/setRoom", data)
                  .then((ress) => {
                    if (ress.code == 200) {
                      sessionStorage.setItem(
                        "interactData",
                        JSON.stringify({
                          id: this.$route.query.id,
                          signalSource: this.signalSource,
                          teachingBuildingId: this.teachingBuildingId,
                          classroomId: this.classroomId,
                          terminalId: this.facilityId,
                          url: this.playUrl,
                        })
                      );
                      this.signShow = false;
                      if (this.client !== null) {
                        if (this.detail.playStatus == 0) {
                          Srs.stopPublish();
                          this.client.requestExitForward()
                          // this.client.changeSign(
                          //     this.playUrl,
                          //     this.terminalId
                          //   );
                          setTimeout(() => {
                            this.client.streamRefresh()
                          }, 1000);
                          // setTimeout(() => {
                          //   this.client.changeSign(
                          //     this.playUrl,
                          //     this.facilityId
                          //   );
                          // }, 1000);
                        }
                      } else {
                        this.setInit();
                      }
                    }
                  });
              }
            });
        } else {
          sessionStorage.setItem(
            "interactData",
            JSON.stringify({
              id: this.$route.query.id,
              signalSource: this.signalSource,
              localAudioId: this.localAudioId,
              localVideoId: this.localVideoId,
            })
          );
          this.signShow = false;
          if (this.client !== null) {
            this.client.requestExitForward(1);
            // Srs.startPublish(this.myUrl, this.localVideoId, this.localAudioId);
          } else {
            this.setInit();
          }
        }
      }
    },
    verify() {
      if (this.signalSource == 1) {
        if (this.$verify.isEmpty(this.teachingBuildingId)) {
          this.$message("请选择教学楼", "error");
          return true;
        }
        if (this.$verify.isEmpty(this.classroomId)) {
          this.$message("请选择教室", "error");
          return true;
        }
        if (this.$verify.isEmpty(this.facilityId)) {
          this.$message("请选择设备", "error");
          return true;
        }
      } else {
        if (this.$verify.isEmpty(this.localVideoId)) {
          this.$message("请选择摄像头设备", "error");
          return true;
        }
        if (this.$verify.isEmpty(this.localAudioId)) {
          this.$message("请选择麦克风设备", "error");
          return true;
        }
      }
    },
    getDetail() {
      this.$axios
        .get("/sm/interactive/info", { id: this.$route.query.id })
        .then((res) => {
          if (res.data.playStatus == 1) {
            this.$message("该主题已结束", "error");
            setTimeout(() => {
              this.$router.push({
                path: "/interactlogin",
                query: { id: this.$route.query.id },
              });
            }, 1000);
            return;
          }
          this.detail = res.data;
          this.me.org_name = res.data.masterLists[0].orgName;
          this.me.user_name = res.data.masterLists[0].userName;
          this.me.user_id = res.data.masterLists[0].userId;
          let arr = [];
          res.data.assistantLists.forEach((el) => {
            let item = {};
            item.user_name = el.userName;
            item.org_name = el.orgName;
            item.user_id = el.userId;
            arr.push(item);
          });
          this.others = arr;
          if (this.$route.query.isBystanderIn) {
            this.setInit();
          } else {
            this.checkUser();
          }
        });
    },
    openValue() {
      if (this.openValueShow == true) {
        return;
      }
      this.openValueShow = true;
    },
    openValues() {
      let video = document.getElementsByTagName("audio");
      video = Array.prototype.slice.call(video);
      video.forEach((v) => {
        v.play();
      });
      this.openValueShow = false;
    },
    visity() {
      // this.$axios.post('/buried/point/record', { pageName: '实时研修', contentType: 1 }).then(res => {
      // 	console.log('记录一次',res)
      // });
      if (this.settime) {
        clearTimeout(this.settime);
      }
      this.settime = setTimeout(() => {
        this.$axios
          .post("/buried/point/record", {
            pageName: "专递课堂",
            contentType: 1,
          })
          .then((res) => {
            console.log("记录一次", res);
          });
      }, 300000);
    },
    // 测试当前网络
    testNet() {
      this.netTestTimer = setInterval(() => {
        this.currentNetRtt = navigator.connection.rtt;
        this.currentDownLink = navigator.connection.downlink;
        this.effectiveType = navigator.connection.effectiveType;
      }, 1500);
    },
    handleFullscreen() {
      // 右侧全屏
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    handleChange() {
      let video = document.getElementsByTagName("audio");
      video = Array.prototype.slice.call(video);
      video.forEach((v) => {
        if(v.id.split("audio")[1] !== this.userId){
          v.volume = this.sliderValue / 100;
        }
      });
      session.set("sliderValue", this.sliderValue / 100);
    },
    // handleFormatTooltip(val) { // 音量格式化
    // 	return val / 1;
    // },
    handleCheckFull() {
      // 判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      // 火狐浏览器
      let isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    getUserInfo() {
      this.$axios.get("/index/getUserInfo").then((res) => {
        if (!res.data) {
          this.$router.go(-1);
        } else {
          this.userInfo = res.data;
          if (this.userInfo) {
            if (this.websock) this.websock.close();
            this.handleGetWebsocket();
          }
        }
      });
    },
    //初始化一些样式
    initStyle() {
      let height = document.getElementsByTagName("body")[0].offsetHeight - 70;
      document.getElementsByClassName("room-connect")[0].style.height =
        height + "px";
      document.getElementsByClassName("room-main")[0].style.height =
        height + "px";
    },
    //改变位置
    changePosition(val, valItem, e) {
      console.log("切回主讲");
      if (valItem && val !== "mainContent" && valItem.isLive !== 1) {
        return;
      }
      if (val !== "mainContent" && this.me.isLive !== 1) {
        return;
      }
      // if(window.document.fullscreenElement) {
      // 	return; // 判断是否有全屏
      // }
      // let oldMainEl = document.querySelector('#mainVideoWrap').querySelector('video');
      // if(oldMainEl.id.split('_')[0].split('-')[1] !== this.me.user_id.split('_')[0] && val != 'mainContent') {
      // 	return this.$message('请先换回主讲位置再进行交换','error');
      // }
      // if(this.mainIsRight && e){
      // 	// this.$message('请先换回主讲位置再进行交换','error')
      // 	// return
      // 	// // 要移动的父节点
      // 		let mainWrap = document.getElementById('mainVideoWrap');   // 主框外壳
      // 		let clickWrap = document.getElementById('mainContent').parentNode;   // 主讲外壳
      // 		//要移动的元素
      // 		let clickEl = document.querySelector('#mainContent');
      // 		let mainEl = document.querySelector('#' + this.currentEl);
      // 		clickWrap.appendChild(mainEl);
      // 		mainWrap.appendChild(clickEl);
      // 		this.currentEl = 'mainContent';
      // 		this.currentElId = ''
      // 		this.mainIsRight = ""
      // }

      // if(val != 'mainContent' && valItem.role == 0){
      // 	this.mainIsRight = true;
      // }else if (val == 'mainContent') {
      // 	this.mainIsRight = '';
      // }
      let mainWrap = document.getElementById("mainVideoWrap");
      let clickWrap = document.getElementById(val).parentNode;
      console.log("mainWrap", mainWrap);
      console.log(val, "clickWrap", clickWrap);
      let clickEl = document.querySelector("#" + val);
      let mainEl = document.querySelector("#" + this.currentEl);
      clickWrap.appendChild(mainEl);
      mainWrap.appendChild(clickEl);
      this.currentEl = val;
      this.currentElId = valItem ? valItem.classroomId : "";
      console.log("切换成功");
      // console.log(this.currentEl,this.currentElId)
    },
    //设置静音
    videoMuted(e, id) {
      let video = document.getElementById("video-" + id);
      if (!video) {
        return;
      }
      video.muted = !video.muted;
      if (video.muted) {
        e.target.className = "iconfont icon-labaguanbi";
      } else {
        e.target.className = "iconfont icon-laba";
      }
    },
    //全屏
    videoFull(id, type) {
      let video = document.getElementById("wrap" + id);
      if (!video) {
        return;
      }
      if (type !== 1) {
        return;
      }
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullScreen) {
        video.webkitRequestFullScreen();
      }
    },
    //请求连麦
    connectApply() {
      if (this.$route.query.type == 2) return;
      if (!this.connectApplyFlag) {
        this.client.connectApply();
        this.$message("请求成功！", "success");
        this.connectApplyFlag = true;
        setTimeout(() => {
          this.connectApplyFlag = false;
        }, 60000);
      } else {
        this.$message("您刚请求过连麦，请稍后再试！", "warning");
      }
    },
    // 关闭副讲自身麦
    videoMicrophone(val) {
      // this.client.changeApply(val)
    },
    handleopenMicrophone(data) {
      if (data.method == "connectServer") {
        if (data.code == 1) {
          this.$message(data.reason, "error");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
      } else if (data.method == "getRoomInfos") {
        if (data.code == 0) {
          let obj = {};
          data.room_list.forEach((el) => {
            if (el.id == this.$route.query.id) {
              obj = el;
            }
          });
          let arr = [];
          let item = {};
          obj.assistant_lists.forEach((el) => {
            item = el;
            item.url = "";
            arr.push(item);
          });
          this.others = arr;
          this.me = {
            mutedFlag: 2,
            org_name: obj.affiliated_unit,
            user_id: obj.master_user_id,
            user_name: obj.master_user_name,
            url: "",
          };
        }
      } else if (data.method == "getConferenceCurrentState") {
        if(data.type == 'liveing'){
          this.detail.playStatus = 0
        }
      }else if (data.method == "loginRoom") {
        if (data.code == 0) {
          data.player_list.forEach((el) => {
            if (this.userId == el.user_id) {
              this.myUrl = el.play_url;
            }
            if (el.user_id == this.me.user_id && !el.play_url.includes("_b")) {
              this.me.url = el.play_url;
            } else {
              this.others.forEach((els) => {
                if (els.user_id == el.user_id) {
                  els.url = el.play_url;
                }
              });
            }
            data.now_user_list.forEach((ele) => {
              if (el.user_id == ele.user_id) {
                if (
                  ele.user_id == this.me.user_id &&
                  !el.play_url.includes("_b")
                ) {
                  this.me.mutedFlag = ele.audio_state;
                  this.me.isLive = data.type == "liveing" ? 1 : 0;
                } else {
                  this.others.forEach((els) => {
                    if (els.user_id == ele.user_id) {
                      els.mutedFlag = ele.audio_state;
                      els.isLive = data.type == "liveing" ? 1 : 0;
                    }
                  });
                }
              }
            });
          });
          if (this.$route.query.isBystanderIn || data.type !== "liveing") {
            return;
          }
          if (this.signalSource == 2) {
            // 本地摄像头推流
            Srs.startPublish(this.myUrl, this.localVideoId, this.localAudioId);
          } else {
            // java代理推流
            this.client.requestForward(this.playUrl, this.facilityId);
          }
          this.others.forEach((el) => {
            if (this.userId == el.user_id) {
              el.isLive = 1;
            }
          });
        } else {
          this.$message(data.reason, "error");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
        this.$forceUpdate();
      } else if (data.method == "broadcastUserState") {
        // if (this.detail.playStatus !== 0) {
        //   return;
        // }
        if (data.type == "join") {
          if (this.me.user_id == data.user_list[0].user_id) {
            this.me.mutedFlag = data.user_list[0].audio_state;
            this.me.isLive = this.detail.playStatus == 0 ? 1 : 0;
          } else {
            this.others.forEach((el) => {
              if (el.user_id == data.user_list[0].user_id) {
                el.mutedFlag = data.user_list[0].audio_state;
                el.isLive = this.detail.playStatus == 0 ? 1 : 0;
              }
            });
          }
          this.$forceUpdate();
        } else if (data.type == "leave") {
          if (data.user_list[0].user_id == this.me.user_id) {
            this.me.mutedFlag = 2;
            this.me.isLive = null;
          } else {
            this.others.forEach((el) => {
              if (el.user_id == data.user_list[0].user_id) {
                el.mutedFlag = 1;
                el.isLive = null;
              }
            });
          }
          this.$forceUpdate();
        }
      } else if (data.method_type == "forceOnMicrophone") {
        this.others.forEach((el) => {
          if (el.user_id == data.user_id) {
            el.mutedFlag = 2;
          }
        });
        this.$forceUpdate();
        this.client.assisChangeMicPhone(data, 1);
      } else if (data.method_type == "forceOffMicrophone") {
        this.others.forEach((el) => {
          if (el.user_id == data.user_id) {
            el.mutedFlag = 0;
          }
        });
        this.$forceUpdate();
        this.client.assisChangeMicPhone(data, 0);
      } else if (data.method_type == "broadcastMicroPhoneStatus") {
        if (data.list_status[0].user_id == this.me.user_id) {
          this.me.mutedFlag = data.list_status[0].audio_state;
        } else {
          this.others.forEach((el) => {
            if (el.user_id == data.list_status[0].user_id) {
              el.mutedFlag = data.list_status[0].audio_state;
            }
          });
        }
        this.$forceUpdate();
      } else if (
        data.method == "requestConnectMicrophone" ||
        data.method == "responseConnectMicrophone"
      ) {
        for (let i = 0; i < this.others.length; i++) {
          if (data.user_id == this.others[i].user_id) {
            this.others[i].mutedFlag = 2;
          }
        }
        this.$forceUpdate();
      } else if (data.method == "getUsersInfoFormRoom") {
        if (this.others.length == 0) {
          data.user_list.forEach((el) => {
            if (el.is_master == 1) {
              this.me.userName = el.user_nick_name;
              this.me.userId = el.user_id;
              this.me.mutedFlag = el.audio_state;
              this.me.className = el.class_name;
            } else if (el.is_master == 0) {
              this.others.push({
                userName: el.user_nick_name,
                user_id: el.user_id,
                className: el.class_name,
                mutedFlag: el.audio_state,
                audioTrack: null,
                videoTrack: null,
                audioConsumer: null,
                videoConsumer: null,
              });
            }
          });
        }
        for (let i = 0; i < data.user_list.length; i++) {
          if (data.user_list[i].is_master == 1) {
            this.me.mutedFlag = data.user_list[i].audio_state;
          } else {
            for (let j = 0; j < this.others.length; j++) {
              if (
                data.user_list[i].user_id ==
                this.others[j].user_id.split("_")[0]
              ) {
                this.others[j].mutedFlag = data.user_list[i].audio_state;
              }
            }
          }
        }
      } else if (data.method_type == "broadcastRoomInfos") {
        if (data.type == "liveing") {
          this.detail.playStatus = 0;
          if (this.signalSource == 2) {
            // 本地摄像头推流
            Srs.startPublish(this.myUrl, this.localVideoId, this.localAudioId);
          } else {
            // java代理推流
            this.client.requestForward(this.playUrl, this.facilityId);
          }
          setTimeout(() => {
            this.me.isLive = 1;
            this.others.forEach((el) => {
              if (el.isLive == 0) {
                el.isLive = 1;
              }
            });
            this.$forceUpdate();
          }, 1000);
        } else if (data.type == "stop") {
          sessionStorage.removeItem("interactData");
          this.$message("主题已结束！", "success");
          setTimeout(() => {
            this.$router.push({
              path: "/interactlogin",
              query: { id: this.$route.query.id },
            });
          }, 1000);
        }
      } else if (data.method == "broadStreamsInfo") {
        data.player_list.forEach((el) => {
          if (el.user_id == this.me.user_id) {
            this.me.isLive = el.is_vaild == 1 ? 1 : 0;
          } else {
            this.others.forEach((ele) => {
              if (ele.user_id == Number(el.user_id)) {
                ele.isLive = el.is_vaild == 1 ? 1 : 0;
              }
            });
            if (el.user_id == this.userId) {
              if (el.is_vaild == 0) {
                  if (this.signalSource == 2) {
                    // 本地摄像头推流
                    Srs.startPublish(this.myUrl, this.localVideoId, this.localAudioId);
                  } else {
                    // java代理推流
                    this.settimePush = setInterval(() => {
                      this.client.requestForward(this.playUrl, this.facilityId);
                    }, 5000);
                    
                  }
              }
            }
          }
        });
        this.$forceUpdate();
      } else if (data.method == "proxyPushStream") {
        if (data.code == 0) {
          clearInterval(this.settimePush);
          this.settimePush = null;
        }
      }
    },
    //退出房间
    leaveRoom() {
      this.$router.go(-1);
    },
  },
  beforeDestroy() {
    if (this.websock) this.websock.close();
    session.remove("sliderValue");
    // sessionStorage.removeItem("interactData");
    clearTimeout(this.settime);
    this.netTestTimer = null;
  },
  filters: {
    videoMsg(val) {
      let arr = ["等待老师进入中...", "", "等待老师授课中..."];
      return arr[val];
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.room-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #323232;
  color: #fffefe;
}
.room-head {
  position: relative;
  height: 50px;
  width: 100%;
  background: #323232;
  .class-name {
    text-align: center;
    font-size: 16px;
    line-height: 50px;
  }
  .opera-wrap {
    display: flex;
    position: absolute;
    right: 50px;
    top: 10px;
    cursor: pointer;

    .not-allowed {
      cursor: not-allowed;
    }
    li {
      width: 100px;
      margin-left: 20px;
      border-radius: 15px;
      line-height: 30px;
      background: #484848;
      font-size: 14px;
      text-align: center;

      &:last-child {
        background: none;
        width: 40px;
      }

      i {
        margin-right: 7px;
        vertical-align: middle;
        font-size: 22px;
      }
    }
  }
}
.room-content {
  display: flex;
  flex: 1;

  .control {
    width: 47px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: #3c3c3c;
    z-index: 12;
    display: flex;
    flex-direction: column-reverse;

    ul {
      padding-bottom: 16px;
      text-align: center;

      li {
        margin-bottom: 36px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        position: relative;

        .slider {
          position: absolute;
          left: 46px;
          top: -4px;
          width: 100px;
        }

        i {
          padding-bottom: 8px;
          font-size: 24px;
        }
      }
    }
  }
  .room-main {
    position: relative;
    width: 70%;
    height: 100%;
    margin-right: 10px;
    background: #000;
    padding-left: 40px;
    box-sizing: border-box;
  }
  .room-connect {
    overflow-y: scroll;
    width: 27%;
    &::-webkit-scrollbar {
      width: 10px;
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #767676;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #3c3c3c;
    }
    li {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      // height: 282px;
      margin-bottom: 10px;
      box-sizing: border-box;
      font-size: 14px;
    }

    .not {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .wait {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 90%;
    text-align: center;
  }
  .content-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 30px 0 30px;
    .room-name {
      line-height: 30px;
      font-size: 14px;
    }
    .video-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    i {
      font-size: 22px;
    }
  }
  .operate-wrap {
    z-index: 999;
    display: flex;
    justify-content: space-between;
  }
}
.bottom-line {
  width: 100%;
  height: 20px;
}
.register-wrap {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .bg-wrap {
    position: relative;
    height: 388px;
    width: 720px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
    }
    .register-btn {
      position: absolute;
      bottom: 23px;
      left: 260px;
      width: 200px;
    }
  }
}
::v-deep .el-tabs--left .el-tabs__nav-wrap.is-left::after {
  display: none;
}
::v-deep .el-tabs--left .el-tabs__active-bar.is-left {
  display: none;
}
::v-deep .el-tabs__item.is-active {
  background: #f2f2f2;
}
.dialog-btn {
  justify-content: center;
}
::v-deep
  .xgplayer-skin-default.xgplayer-is-live
  .xgplayer-controls
  .xgplayer-live {
  display: none;
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
</style>
