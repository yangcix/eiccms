<template>
  <div class="room-wrap">
    <div class="room-head">
      <!-- <span style="position:absolute;left:80px;top:16px">估算网络延时：{{currentNetRtt}}ms - 估算有效下载速度：{{currentDownLink}}MB/s - 当前网络状态：{{effectiveType}}</span> -->
      <p class="class-name">{{ detail.name }}</p>
      <ul class="opera-wrap">
        <!-- <li @click="allMute"><i class="iconfont" :class="muteFlag ? 'icon-mic-on-full' : 'icon-mic-off-full'"></i>全部静麦</li> -->
        <li
          @click="openDialog"
          style="width: 110px; margin-right: 5px; padding: 0 5px"
        >
          <i class="el-icon-setting"></i>信号源设置
        </li>
        <li
          v-if="detail.playStatus == 2"
          @click="start"
          style="
            margin: 0 15px;
            padding: 0 15px;
            border-radius: 5px;
            background: #5c9cff;
          "
        >
          开始授课
        </li>
        <li
          v-if="detail.playStatus == 0 && client !== null"
          @click="finish"
          style="margin: 0 15px; padding: 0 15px"
        >
          结束授课
        </li>
        <!-- <li @click="leaveRoom"><i class="iconfont icon-tuichu"></i></li> -->
      </ul>
    </div>

    <div class="room-content">
      <div class="control" v-show="!enterShow">
        <ul>
          <li v-if="detail.playStatus == 0 && client !== null" @click="allMute">
            <i
              class="iconfont"
              :class="muteFlag ? 'icon-mic-on-full' : 'icon-mic-off-full'"
            ></i>
            {{ muteFlag ? "听讲禁言" : "听讲发言" }}
          </li>
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
        <!-- <p v-if="me.isLive == 2" class="wait" style="z-index: 99">
          网络异常，正在加载中
        </p>
        <p class="wait" v-if="me.isLive !== 1 && me.isLive !== 2">
          {{ detail.playStatus | videoMsg }}
        </p> -->
        <div id="mainContent" class="content-wrap">
          <p class="room-name">
            主讲教室：<span style="margin-left: 5px"
              >{{ me.org_name }} — {{ me.user_name }}</span
            >
          </p>
          <div
            class="video-wrap"
            :id="'wrap' + me.user_id"
            @click.stop="changePosition('mainContent', 'main')"
          >
            <main-peer-view
              :status="detail.playStatus"
              :info="me"
              :isMe="1"
              :mutedFlag="me.mutedFlag"
              :isLive="me.isLive"
              :url="me.url"
              @openValue="openValue"
            ></main-peer-view>
          </div>
          <p class="operate-wrap">
            <span>
              <i
                v-if="detail.playStatus == 0"
                class="iconfont"
                :class="me.mutedFlag == 2 ? 'icon-mic-on-full' : 'icon-mic-off-full'"
                style="cursor: pointer"
                @click.stop="videoMicrophone(me.user_id, me.mutedFlag, 1)"
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
        <ul v-if="others.length">
          <li v-for="(val, index) in others" :key="index">
            <div :id="'videobox' + val.user_id" class="content-wrap">
              <!-- <p v-if="val.isLive == 2" class="wait" style="z-index: 99">
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
                @click.stop="
                  changePosition('videobox' + val.user_id, val, $event)
                "
              >
                <main-peer-view
                  :status="detail.playStatus"
                  :info="val"
                  :mutedFlag="val.mutedFlag"
                  :isMe="0"
                  :isLive="val.isLive"
                  :url="val.url"
                  @openValue="openValue"
                ></main-peer-view>
                <!-- <peer-view
                  :info="val"
                  @openValue="openValue"
                ></peer-view> -->
              </div>
              <p class="operate-wrap">
                <span>
                  <i
                    v-show="val.isLive == 1"
                    class="iconfont"
                    :class="
                      val.mutedFlag == 2 ? 'icon-mic-on-full' : 'icon-mic-off-full'
                    "
                    style="cursor: pointer"
                    @click="videoMicrophone(val.user_id, val.mutedFlag)"
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

        <!-- <div class="not" v-else-if="!_olderRoomList.lenght && !enterShow">暂无在线房间！</div> -->
      </div>

      <div class="msg-wrap" :class="msgHaveNo ? 'msg-notice' : ''">
        <div class="icon-wrap">
          <img
            src="../../../assets/imgs/msg-l.png"
            alt=""
            v-show="!msgFlag"
            @click="msgShow(true)"
          />
          <img
            src="../../../assets/imgs/msg-r.png"
            alt=""
            v-show="msgFlag"
            @click="msgShow(false)"
          />
        </div>
        <div style="width: 163px; height: 100%">
          <ul class="msg-list" v-show="msgFlag">
            <li
              v-for="(val, index) in applyMsgList"
              :key="index"
              style="text-align: left"
              :style="{ color: val.haved ? '#CCC' : '#fff' }"
              @click="openMicrophone(val, index)"
            >
              <p>{{ val.name }}请求发言！</p>
              <p class="time">{{ val.time }}</p>
            </li>
          </ul>
        </div>
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
                v-model="terminalId"
                placeholder="选择设备"
                style="width: 248px"
                filterable
                clearable
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
                filterable
                clearable
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
import { mapState, mapMutations, mapActions } from "vuex";
import FlvJsPlayer from "xgplayer-flv.js";
import {
  dateFormat,
  getNowDate,
  session,
  IEVersion,
} from "../../../assets/js/utils";
import RoomClient from "../../../assets/js/RoomClient";
import { MyEvent } from "../../../assets/js/RoomClient";
// import {register, sendMessage, leaveRoom, connectWs, MyEvent} from "../../../assets/js/conferenceroom";
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
      myUrl: "", //我的推流地址
      countdown: null,
      playUrl: "", // 互动设备地址
      viewShow: false,
      myVideo: null,
      localVideoId: "",
      localAudioId: "",
      localVideoList: [],
      localAudioList: [],
      terminalId: "",
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
      showMsg: false,
      // videoMsg: "等待老师进入中...",
      msgFlag: false,
      enterShow: false,
      currentEl: "mainContent",
      mainInfo: {
        mutedFlag: true,
      },
      assistenList: [],
      themeName: this.$route.query.name,
      muteFlag: 2,
      applyMsgList: [],
      msgHaveNo: false,
      userInfo: {},
      loginType: "web",
      websock: null,
      fullscreen: false, // 是否全屏
      sliderValue:
        session.get("sliderValue") !== null
          ? parseInt(session.get("sliderValue") * 100)
          : 100, // 音量调节
      sliderIs: false, // 音量if
      olderRoomList: [], // 根据进房顺序渲染
      currentType: this.$route.query.type, // 是否校外 携带type
      outsideData: {}, // 进入课堂数据
      isLocalSign: this.$route.query.isLocalSign, // 是否是本机
      mainIsRight: "", // 主讲是否与副讲交换位置 存储用
      currentElId: "", // 当前主画面的id
      netTestTimer: null, // 网络测试定时器
      currentNetRtt: 100, // 当前网络延迟
      currentDownLink: 0, // 当前下载速度
      effectiveType: "4g", // 当前网络状态
      client: null,
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
      micUserList: [],
      settime: null,
      openValueShow: false,
      // 本地流
      stream: null,
      // 媒体录制
      mediaRecorder: null,
      // 数据块
      chunks: [],
      // 录制结果
      recording: null,
      settimePush: null,
      interactData: {},
    };
  },
  computed: {
    ...mapState({
      interactUploadTable: "interactUploadTable",
    }),
  },
  beforeRouteLeave(to, from, next) {
    Srs.stopPublish();
    if (this.client !== null) {
      this.client.leaveRoom();
    }
    if (this.websock) this.websock.close();
    console.log("浏览器返回");
    next();
  },
  mounted() {
    this.getDetail();
    this.getUserInfo();
    this.$bus.off("startNormalInteract", this.start);
    this.$bus.on("startNormalInteract", this.start);
    window.addEventListener("beforeunload", () => {
      console.log("页面刷新");
      Srs.stopPublish();
      if (this.client !== null) {
        this.client.leaveRoom();
      }
      this.commitInteractUploadTable({ type: "clear" });
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
    ...mapActions({
      commitInteractUploadTable: "commitInteractUploadTable",
      commitInteracUploadBoxVisible: "commitInteracUploadBoxVisible",
    }),
    toLogin() {},
    clearDialog() {
      this.localVideoId = "";
      this.localAudioId = "";
      this.signalSource = 1
      this.teachingBuildingId = "";
      this.classroomId = "";
      this.terminalId = "";
      this.signShow = false;
    },
    openDialog() {
      let data = this.interactData;
      if (data.signalSource == 1) {
        this.signalSource = data.signalSource;
        this.teachingBuildingId = data.teachingBuildingId;
        this.classroomId = data.classroomId;
        this.terminalId = data.terminalId;
        this.$axios
          .get("/sys/classroom/getClassroomList", {
            buildingId: data.teachingBuildingId,
          })
          .then((res) => {
            this.classroomList = res.data;
          });
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
      } else if (data.signalSource == 2) {
        this.getCameraList();
        this.signalSource = 2;
        this.localVideoId = data.localVideoId;
        this.localAudioId = data.localAudioId;
      }
      this.signShow = true;
    },
    // 检测本地信号
    checkLocal(val) {
      if (val) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: this.localVideoId
                ? { exact: this.localVideoId }
                : undefined,
            },
          })
          .then((stream) => {})
          .catch((err) => {
            console.log("meiy rrr");
            this.localVideoId = "";
          });
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              deviceId: this.localAudioId
                ? { exact: this.localAudioId }
                : undefined,
            },
          })
          .then((stream) => {})
          .catch((err) => {
            console.log("meiy ");
            this.localAudioId = "";
          });
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
            navigator.mediaDevices
              .getUserMedia({
                audio: {
                  deviceId: this.localAudioId
                    ? { exact: this.localAudioId }
                    : undefined,
                },
              })
              .then((stream) => {
                this.client.startTheme(2);
                console.log(stream, "本地有音频信号");
              })
              .catch((err) => {
                console.log(err, "本地音频信号异常");
                this.$message(
                  val
                    ? "没有可用的音频信号，无法开启授课，请检查设备"
                    : "本地音频信号异常，请检查本地音频设备",
                  "error"
                );
              });
          })
          .catch((err) => {
            console.log(err, "本地视频信号异常", this.localVideoId);
            this.$message(
              val
                ? "没有可用的视频信号，无法开启授课，请检查设备"
                : "本地视频信号异常，请检查本地视频设备",
              "error"
            );
          });
      }
    },
    // 检测信号源
    checkSign() {
      // let config = this.facilityIdList.filter(
      //   (item) => item.id == this.terminalId
      // )[0];
      // console.log("config", config);
      // let data = {
      //   classroomId: this.classroomId,
      //   role: 1,
      //   orgId: this.detail.orgId,
      //   code: config.terminalName,
      //   interactiveId: this.detail.id,
      //   terminalId: this.terminalId,
      //   startTime: this.detail.startTime,
      //   endTime: this.detail.endTime,
      // };
      this.$axios
        .get("/sm/interactive/checkUrl", { url: this.playUrl })
        .then((res) => {
          if (res.code == 200 && res.data) {
            return true;
            // this.$axios.post("/sm/interactive/setRoom", data).then((ress) => {
            //   if (ress.code == 200) {
            //     this.interactData = {
            //       signalSource: this.signalSource,
            //       teachingBuildingId: this.teachingBuildingId,
            //       classroomId: this.classroomId,
            //       terminalId: this.terminalId,
            //       url: this.playUrl
            //     }
            //   }
            // });
          }
        })
        .catch((err) => {
          return true;
        });
    },
    // 开始授课
    start() {
      if (new Date(this.detail.endTime) < new Date(getNowDate())) {
        this.$message("该主题已结束", "error");
        setTimeout(() => {
          this.$router.push({
            path: "/normalInteractlogin",
            query: {
              themeid: this.$route.query.themeid,
              id: this.$route.query.id,
            },
          });
        }, 1000);
        return;
      }
      let data = this.interactData;
      console.log(data, "da");
      if (data.signalSource && this.client !== null) {
        switch (data.signalSource) {
          case 1:
            if (this.countdown) {
              clearTimeout(this.countdown);
            }
            if (this.countdowns) {
              clearTimeout(this.countdowns);
            }
            // this.client.startTheme();
            this.$axios
              .get("/sm/interactive/checkUrl", { url: this.playUrl })
              .then((res) => {
                if (res.code == 200 && res.data) {
                  this.client.startTheme(2);
                }
              });
            break;
          case 2:
            if (this.countdown) {
              clearTimeout(this.countdown);
            }
            if (this.countdowns) {
              clearTimeout(this.countdowns);
            }
            this.checkLocal(1);
            break;
          default:
            break;
        }
      } else {
        this.$message("请先设置信号源再开始授课", "error");
      }
    },
    checkUser() {
      let data = new FormData();
      data.append("id", parseInt(this.$route.query.id));
      this.$axios.post(`/sm/interactive/checkUser`, data).then((res) => {
        this.getTeachBuildList(this.detail.orgId);
        if(sessionStorage.getItem('interactData') && JSON.parse(sessionStorage.getItem('interactData')).id !== this.$route.query.id){
          sessionStorage.removeItem('interactData')
        }
        if(sessionStorage.getItem('interactData')){
          let sessData = JSON.parse(sessionStorage.getItem('interactData'))
          this.signalSource = sessData.signalSource
          this.interactData = {
            signalSource: sessData.signalSource,
            teachingBuildingId: sessData.teachingBuildingId,
            classroomId: sessData.classroomId,
            terminalId: sessData.terminalId,
            playUrl: sessData.playUrl,
          };
          if (this.signalSource == 1) {
            this.getClassroomList(sessData.teachingBuildingId);
            this.handleFacility(sessData.classroomId);
            this.$nextTick(() => {
              this.teachingBuildingId = sessData.teachingBuildingId;
              this.classroomId = sessData.classroomId;
              this.terminalId = sessData.terminalId;
            });
            this.playUrl = sessData.playUrl;
            this.$axios.get("/sm/interactive/checkUrl", { url: this.playUrl })
              .then((res) => {
                if (res.code == 200 && res.data) {
                  this.$axios.post("/sm/interactive/setRoom",  {
                    classroomId: this.classroomId,
                    role: 1,
                    orgId: this.detail.orgId,
                    interactiveId: this.detail.id,
                    terminalId: this.terminalId,
                    startTime: this.detail.startTime,
                    endTime: this.detail.endTime,
                  }).then((ress) => {
                    if (ress.code == 200) {
                      this.setInit()
                    }else{
                      this.signShow = true;
                    }
                  });
                }else{
                  this.signShow = true;
                }
              })
          } else {
            if (!this.checkLocal()) {
              this.getCameraList();
              this.localVideoId = old.localVideoId;
              this.localAudioId = old.localAudioId;
              this.setInit();
            }
          }
        }else if (res.data.termianlist) {
          let old = res.data.termianlist;
          console.log(old, "上一个设备");
          this.signalSource = 1;
          this.interactData = {
            signalSource: 1,
            teachingBuildingId: old.buildingId,
            classroomId: old.classroomId,
            terminalId: old.terminalId,
            playUrl: old.url,
          };
          sessionStorage.setItem(
            "interactData",
            JSON.stringify({
              signalSource: 1,
              id: this.$route.query.id,
              teachingBuildingId: old.buildingId,
              classroomId: old.classroomId,
              terminalId: old.terminalId,
              playUrl: old.url,
            })
          );
          // if(this.detail.playStatus == 0){
          if (this.signalSource == 1) {
            this.getClassroomList(old.buildingId);
            this.handleFacility(old.classroomId);
            this.$nextTick(() => {
              this.teachingBuildingId = old.buildingId;
              this.classroomId = old.classroomId;
              this.terminalId = old.terminalId;
            });
            this.playUrl = old.url;
            this.signShow = true;
          } else {
            if (!this.checkLocal()) {
              this.getCameraList();
              this.localVideoId = old.localVideoId;
              this.localAudioId = old.localAudioId;
              // this.setInit();
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
    setInit(type) {
      console.log("重新加载++++++");
      // if (this.countdown) {
      //   clearTimeout(this.countdown);
      // }
      if (this.client) {
        Srs.stopPublish();
        MyEvent.off("message", this.handleopenMicrophone);
        this.client.leaveRoom();
      }
      const that = this;
      MyEvent.on("message", this.handleopenMicrophone);
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
          console.log('关')
          this.client.closeSocket()
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
        this.terminalId = "";
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
      this.terminalId = "";
      this.getClassroomList(id);
    },
    //根据教学楼id获取教室列表
    getClassroomList(buildingId) {
      this.classroomId = "";
      this.terminalId = "";
      this.$axios
        .get("/sys/classroom/getClassroomList", { buildingId: buildingId })
        .then((res) => {
          this.classroomList = res.data;
        });
    },
    // 根据教室id获取设备列表
    handleFacility(id) {
      this.terminalId = "";
      this.$axios
        .get("/sm/theme/getSelectTerminal", {
          themeId: this.detail.id,
          type: 3,
          userId: JSON.parse(localStorage.getItem("userInfo")).userId,
          classroomId: id,
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
            path: "/normalInteractlogin",
            query: {
              themeid: this.$route.query.themeid,
              id: this.$route.query.id,
            },
          });
        }, 1000);
        return;
      }
      if (!this.verify()) {
        let data = {};
        if (this.signalSource == 1) {
          let config = this.facilityIdList.filter(
            (item) => item.id == this.terminalId
          )[0];
          data = {
            classroomId: this.classroomId,
            role: 1,
            orgId: this.detail.orgId,
            code: config.terminalName,
            interactiveId: this.detail.id,
            terminalId: this.terminalId,
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
                      this.interactData = {
                        signalSource: this.signalSource,
                        teachingBuildingId: this.teachingBuildingId,
                        classroomId: this.classroomId,
                        terminalId: this.terminalId,
                        url: this.playUrl,
                      };
                      sessionStorage.setItem(
                        "interactData",
                        JSON.stringify({
                          id: this.$route.query.id,
                          signalSource: this.signalSource,
                          teachingBuildingId: this.teachingBuildingId,
                          classroomId: this.classroomId,
                          terminalId: this.terminalId,
                          playUrl: this.playUrl,
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
                        }
                      } else {
                        this.setInit();
                      }
                    }
                  });
              }
            });
        } else {
          this.interactData = {
            signalSource: this.signalSource,
            localAudioId: this.localAudioId,
            localVideoId: this.localVideoId,
          };
          sessionStorage.setItem('interactData', JSON.stringify(this.interactData))
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
        if (this.$verify.isEmpty(this.terminalId)) {
          this.$message("请选择设备", "error");
          return true;
        }
      } else {
        console.log(this.localVideoId, "this.localVideoId", this.localAudioId);
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
      let data;
      this.$axios
        .get("/sm/interactive/info", { id: this.$route.query.id })
        .then((res) => {
          if (res.data.playStatus == 1) {
            this.$message("该主题已结束", "error");
            setTimeout(() => {
              this.$router.push({
                path: "/normalInteractlogin",
                query: {
                  themeid: this.$route.query.themeid,
                  id: this.$route.query.id,
                },
              });
            }, 1000);
            return;
          }
          data = res.data;
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
          this.$axios
            .get("/sm/habitus/info", { id: this.$route.query.themeid })
            .then((ress) => {
              data.name = ress.data.name;
              this.detail = data;
            });
          // if (
          //   this.detail.playStatus == 2 &&
          //   new Date(this.detail.startTime) > new Date(getNowDate())
          // ) {
          //   let time = new Date(this.detail.startTime) - new Date(getNowDate());
          //   let times = new Date(this.detail.endTime) - new Date(getNowDate());
          //   let index = this.interactUploadTable.length;
          //   console.log(time, "倒计时");
          //   if (this.countdown) {
          //     clearTimeout(this.countdown);
          //   }
          //   if (this.countdowns) {
          //     clearTimeout(this.countdowns);
          //   }
          //   this.countdown = setTimeout(() => {
          //     console.log("添加", index);
          //     this.commitInteractUploadTable({
          //       type: "push",
          //       index: index,
          //       item: {
          //         detail: this.detail,
          //         name: this.detail.name,
          //         time: this.detail.startTime,
          //       },
          //     });
          //     this.commitInteracUploadBoxVisible(true);
          //   }, time);
          //   this.countdowns = setTimeout(() => {
          //     this.commitInteractUploadTable({
          //       type: "splice",
          //       index: index + 1,
          //       detail: this.detail,
          //     });
          //   }, times);
          // }
          this.checkUser();
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
    handleChange() {
      console.log("麦变了", this.sliderValue);
      let video = document.getElementsByTagName("audio");
      video = Array.prototype.slice.call(video);
      video.forEach((v) => {
        if(v.id.split("audio")[1] !== this.me.user_id){
          v.volume = this.sliderValue / 100;
        }
      });
      session.set("sliderValue", this.sliderValue / 100);
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
          console.log(obj,'objobjobjob>>>>>>>>>>>>>>>>>>>j',this.$route.query.id)
          obj.assistant_lists.forEach((el) => {
            item = el;
            item.url = "";
            arr.push(item);
          });
          this.others = arr;
          this.me = {
            isLive: 0,
            mutedFlag: 2,
            org_name: obj.affiliated_unit,
            user_id: obj.master_user_id,
            user_name: obj.master_user_name,
            url: "",
          };
        }
      } else if (data.method == "loginRoom") {
        if (data.code == 0) {
          data.player_list.forEach((el) => {
            if (
              JSON.parse(localStorage.getItem("userInfo")).userId ==
                el.user_id &&
              !el.play_url.includes("_b")
            ) {
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
          });
          data.now_user_list.forEach((ele) => {
            this.others.forEach((els) => {
              if (els.user_id == ele.user_id) {
                els.mutedFlag = ele.audio_state;
                els.isLive = data.type == "liveing" ? 1 : 0;
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
            console.log("通知111");
            this.client.requestForward(this.playUrl, this.terminalId);
          }
          this.me.isLive = 1;
        } else {
          this.$message(data.reason, "error");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
      } else if (data.method == "broadcastUserState") {
        if (data.type == "join") {
          this.others.forEach((el) => {
            if (el.user_id == data.user_list[0].user_id) {
              el.mutedFlag = data.user_list[0].audio_state;
              el.isLive = this.detail.playStatus == 0 ? 1 : 0;
            }
          });
        } else if (data.type == "leave") {
          this.others.forEach((el) => {
            if (el.user_id == data.user_list[0].user_id) {
              el.mutedFlag = 1;
              el.isLive = null;
            }
          });
          // let userid = (document.querySelector('#mainVideoWrap').querySelector('video').id).split('video')[1];
          // if(userid == data.user_list[0].user_id){
          //   this.changePosition('mainContent', 'main')
          // }
        }
        this.$forceUpdate();
      } else if (data.method_type == "requestConnectMicrophone") {
        const id = data.user_id;
        const name = this.others.find(
          (item) => item.user_id == data.user_id
        ).user_name;
        this.applyMsgList.unshift({
          haved: false,
          id,
          name,
          time: getNowDate(),
        });
        this.applyMsgList = Array.from(new Set(this.applyMsgList));
        this.msgShow(true);
        this.msgHaveNo = true;
        setTimeout(() => {
          this.msgShow(false);
        }, 5000);
      } else if (data.method == "startInteractionTheme") {
        if (data.code == 0) {
          this.detail.playStatus = 0;
          if (this.signalSource == 2) {
            // 本地摄像头推流
            Srs.startPublish(this.me.url, this.localVideoId, this.localAudioId);
          } else {
            // java代理推流
            this.client.requestForward(this.playUrl, this.terminalId);
          }
          this.me.isLive = 1;
          setTimeout(() => {
            this.others.forEach((el) => {
              if (el.isLive == 0) {
                el.isLive = 1;
              }
            });
            this.$forceUpdate();
          }, 1000);
        }
      } else if (data.method_type == "broadcastRoomInfos") {
        if (data.type == "stop") {
          this.$message("主题已结束！", "success");
          setTimeout(() => {
            this.$router.push({
              path: "/normalInteractlogin",
              query: {
                themeid: this.$route.query.themeid,
                id: this.$route.query.id,
              },
            });
          }, 1000);
        }
      } else if (data.method == "broadStreamsInfo") {
        data.player_list.forEach((el) => {
          if (el.user_id == this.me.user_id) {
            this.me.isLive = el.is_vaild == 1 ? 1 : 0;
            if (el.is_vaild == 0) {
                if (this.signalSource == 2) {
                  // 本地摄像头推流
                  Srs.startPublish(this.myUrl, this.localVideoId, this.localAudioId);
                } else {
                  // java代理推流
                  this.settimePush = setInterval(() => {
                    this.client.requestForward(this.playUrl, this.terminalId);
                  }, 5000);
                }
            }
          } else {
            this.others.forEach((ele) => {
              if (ele.user_id == el.user_id) {
                ele.isLive = el.is_vaild == 1 ? 1 : 0;
              }
            });
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
    handleFullscreen() {
      // 右侧全屏
      let element = document.documentElement;
      console.log('element',element)
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
    //获取用户信息
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
    //消息显示隐藏
    msgShow(flag) {
      this.msgFlag = flag;
      let el = document.getElementsByClassName("msg-wrap")[0];
      if (flag) {
        el.style.right = "0px";
      } else {
        el.style.right = "-163px";
      }
    },
    //改变位置
    changePosition(val, valItem, e) {
      console.log(val, "val,valItem", valItem);
      if (valItem && val !== "mainContent" && valItem.isLive !== 1) {
        return;
      }
      if (val !== "mainContent" && this.me.isLive !== 1) {
        return;
      }
      // if (valItem && val !== "mainContent") {
      //   let userid = (document.querySelector('#mainVideoWrap').querySelector('video').id).split('video')[1];
      //   if(userid == this.me.user_id){
      //     if(this.me.isLive !== 1 && valItem.isLive !== 1){
      //       return;
      //     }
      //   }else{
      //     let data = this.others.filter(el => {
      //       return el.id == userid
      //     })
      //     if(data[0].isLive !== 1 && valItem.isLive !== 1){
      //       return;
      //     }
      //   }
      // }
      // return
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

      // if(val == 'mainContent'){
      // 	this.mainIsRight = true;
      // }else{
      // 	this.mainIsRight = '';
      // }

      //要移动的父节点
      let mainWrap = document.getElementById("mainVideoWrap"); //主视框的外层
      let clickWrap = document.getElementById(val).parentNode; // 点击节点的外层
      //要移动的元素
      console.log("clickWrap", clickWrap);
      let clickEl = document.querySelector("#" + val); //点击的交换节点
      let mainEl = document.querySelector("#" + this.currentEl); // 当前主视框的交换节点
      clickWrap.appendChild(mainEl); // 主视框节点——>副讲视框
      mainWrap.appendChild(clickEl); // 副讲节点——>主视框
      this.currentEl = val; // 当前主视框节点赋值
      this.currentElId = valItem ? valItem.user_id : "";
      // console.log(this.currentElId)
      console.log("this", this.others);
      this.$forceUpdate();
    },
    // changePosition(val){
    // 	//要移动的父节点
    // 	// debugger
    // 	const mainWrap = document.getElementById('mainVideoWrap');
    // 	const clickWrap = document.getElementById(val).parentElement;
    // 	const rightFirstWrap = clickWrap.parentElement.firstElementChild;

    // 	//要移动的元素
    // 	const clickEl = document.querySelector('#' + val);
    // 	const mainEl = document.querySelector('#' + this.currentEl);
    // 	const rightFirstEl = rightFirstWrap.getElementsByClassName('content-wrap')[0]

    // 	console.log(mainEl == rightFirstEl, 111)
    // 	const mainVidelId = `wrap${this.mainInfo.classroomId}`
    // 	if (clickEl.id === mainVidelId || clickWrap === rightFirstWrap) {
    // 		// 点击的是主讲或者点击的是第一个
    // 		clickWrap.appendChild(mainEl);
    // 		mainWrap.appendChild(clickEl);
    // 	} else if (rightFirstWrap.id == mainVidelId){
    // 		// 主视频是主讲，点击的不是第一个
    // 		rightFirstWrap.appendChild(mainEl)
    // 		clickWrap.appendChild(rightFirstEl);
    // 		mainWrap.appendChild(clickEl);
    // 	}

    // 	this.currentEl = val;
    // },
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
    //消息开麦
    openMicrophone(data, index) {
      if (data.haved == false) {
        this.client.mainChangeMicPhone(data.id);
        this.others.forEach((el) => {
          if (el.user_id == data.id) {
            el.mutedFlag = 2;
          }
        });
        this.applyMsgList[index].haved = true;
        // this.applyMsgList = this.applyMsgList.filter(el => el.id != data.id);
        setTimeout(() => {
          this.msgShow(false);
        }, 2000);
        this.msgHaveNo = false;
      }
    },
    //设置静麦开麦
    videoMicrophone(id, val, type) {
      if (type) {
        this.me.mutedFlag = val == 2 ? 0 : 2;
      } else {
        this.others.forEach((el) => {
          if (el.user_id == id) {
            el.mutedFlag = val == 2 ? 0 : 2;
          }
        });
      }
      this.$forceUpdate();
      if (val == 2) {
        this.client.mainChangeApply(id, type);
      } else {
        this.client.mainChangeApplys(id, type);
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
    //全部静麦
    allMute() {
      if (this.muteFlag) {
        //静麦
        for (let i = 0; i < this.others.length; i++) {
          this.others[i].mutedFlag = 2;
          this.videoMicrophone(this.others[i].user_id, 2);
        }
      } else {
        for (let i = 0; i < this.others.length; i++) {
          this.others[i].mutedFlag = 0;
          this.videoMicrophone(this.others[i].user_id, 0);
        }
      }
      this.muteFlag = !this.muteFlag;
    },
    //退出房间
    leaveRoom() {
      // this.stop()
      // this.download();
      this.$router.go(-1);
    },
    //结束互动
    finish() {
      this.$confirm("确定要结束该课堂吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post("/sm/habitus/finish", { id: parseInt(this.$route.query.id) })
          .then((res) => {
            this.$message("结束主题成功！", "success");
            this.client.finishTheme(this.detail.id);
            setTimeout(() => {
              this.$router.push({
                path: "/normalInteractlogin",
                query: {
                  themeid: this.$route.query.themeid,
                  id: this.$route.query.id,
                },
              });
            }, 1000);
          });
      });
    },
  },
  beforeDestroy() {
    session.remove("sliderValue");
    if (this.websock) this.websock.close();
    clearTimeout(this.settime);
    // clearTimeout(this.countdown);
    this.commitInteractUploadTable({ type: "clear" });
    console.log("页面销毁");
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
<style lang="scss">
// .el-slider {
// 	.el-slider__bar {
// 		background-color: red;
// 	}

// 	.el-slider__button {
// 		background-color: yellow;
// 	}
// }
</style>
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
    li {
      width: 70px;
      border-radius: 15px;
      line-height: 30px;
      background: #484848;
      font-size: 14px;
      text-align: center;

      // &:last-child {
      //   background: none;
      // }

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
    // margin-right: 10px;
    font-size: 20px;
    background: #000;
    padding: 10px 0 0 50px;
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
      // overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    i {
      font-size: 22px;
    }
  }
  .msg-wrap {
    overflow: hidden;
    display: flex;
    align-items: center;
    position: fixed;
    right: -163px;
    top: 0;
    z-index: 100;
    width: 195px;
    height: 100%;
    background: #3c3c3c;
    img {
      width: 13px;
    }
    .msg-list {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 210px;
      height: 100%;
      background: #323232;
      color: #c9c9c9;
      text-align: right;
      li {
        width: 163px;
        margin-top: 37px;
        background: #323232;
        cursor: pointer;
        p {
          font-size: 16px;
        }
        .time {
          margin-top: 12px;
          font-size: 14px;
        }
      }
    }
  }
  .msg-notice {
    background: #767676;
    animation: notice 5s infinite;
  }
  @keyframes notice {
    0% {
      background: #767676;
    }
    50% {
      background: #3c3c3c;
    }
    100% {
      background: #767676;
    }
  }
  .operate-wrap {
    z-index: 9;
    margin: 10px 0;
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
