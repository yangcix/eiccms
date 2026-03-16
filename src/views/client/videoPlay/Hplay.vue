<template>
  <div class="liveInteract">
    <div class="video-content-wrap">
      <div class="video-wrap">
        <div v-if="detailInfo.themeStatus == 0" style="min-height: 647px">
          <div class="video-error">直播未开始！</div>
        </div>
        <div v-else>
          <div class="video-content" id="videoWrap"></div>
          <div class="video-error" v-show="videoErrorShow">视频源未找到！</div>
        </div>
        <div class="video-tag-info">
          <div class="video-tag-left">
            <ul v-if="detailInfo.labels">
              <li v-for="(val, index) in detailInfo.labels" :key="index">
                {{ val }}
              </li>
            </ul>
            <div class="detailInfoTitle">{{ detailInfo.name }}</div>
          </div>

          <div class="video-tag-right">
            <span v-show="detailInfo.themeStatus == 1">在线人数: {{activeUser}}</span>
            <i class="iconfont icon-yonghu"></i>
            <span>{{ detailInfo.nickName }}</span>
            <i class="iconfont icon-watch"></i>
            <span>{{ detailInfo.viewed && detailInfo.themeStatus == 1 ? detailInfo.viewed : 0 }}</span>
          </div>
        </div>
        <el-dialog
          class="dialogPassword"
          :modal="false"
          :show-close="false"
          :visible.sync="dialogVisible"
          width="450px"
          :close-on-click-modal="false"
          style="position: absolute;"
          :z-index="1997"
        >
        <p style="text-align: center;width: 100%;;font-size: 14px;color: red;position: absolute;top: 20px;left: 0;">{{ passwordMsg }}</p>
        <div class="admin">
          <div class="name">观看密码<label>*</label>：</div>
          <el-input
            class="width-5"
            placeholder="请输入观看密码"
            show-password
            clearable
            v-model="password"
          >
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn" type="primary" @click="handleEnsure">
            确定
          </el-button>
        </span>
      </el-dialog>
      </div>
      
      <div class="video-info">
        <div
          class="evaluation notselect"
          v-if="isLogin && isBindEvaluation"
          @click="toEvaluation"
        >
          <img src="@/assets/imgs/evaluation.png" alt="" />
        </div>
        <div class="tabs notselect">
          <div
            class="tabItem"
            v-for="item in tabList"
            :key="item.typeId"
            @click="chooseType(item.typeId)"
          >
            <span :class="{ tabItemActive: isActive === item.typeId }">{{
              item.type
            }}</span>
          </div>
        </div>
        <div class="chat-window" v-show="isActive == 1">
          <div class="chat-box" ref="chatBox" id="chatBox">
            <div v-for="(item, index) in inList" :key="index" class="message">
              <div class="message-author">
                <img
                  src="@/assets/imgs/teacherIcon.png"
                  alt=""
                  v-if="item.userName == detailInfo.nickName"
                  class="avatar"
                />
                <img
                  src="@/assets/imgs/studentIcon.png"
                  alt=""
                  v-else
                  class="avatar"
                />
                <span>{{ item.userName }}</span>
                <span
                  class="teacherMark"
                  v-if="item.userName == detailInfo.nickName"
                  >教师</span
                >
              </div>
              <p
                v-html="item.message"
                class="a-message"
                @click="imgB(index)"
              ></p>
            </div>
          </div>
          <div id="editor"></div>
          <el-button
            type="primary"
            @click="send"
            class="send-btn"
            :disabled="!isLogin || forbidden"
            >发送</el-button
          >
          <div class="forbidden" v-if="forbidden">全员禁言</div>
          <div class="unLogin notselect" v-if="!isLogin">
            <span style="color: #196ef6; cursor: pointer" @click="toLogin"
              >登录</span
            >后，可参与互动讨论
          </div>
          <transition name="fade">
            <div class="newTips" v-if="toNew" @click="clickNew">
              有{{ num }}条新消息
            </div>
          </transition>
        </div>
        <div class="item-info" v-show="isActive == 2">
          <p class="title">{{ detailInfo.name }}</p>
          <p class="time">
            <span>开始时间：</span>
            <span>{{ detailInfo.startTime }}</span>
          </p>
          <p class="time">
            <span>结束时间：</span>
            <span>{{ detailInfo.endTime }}</span>
          </p>
          <ul class="fileList" v-if="fileList.length != 0">
            <li v-for="(item, index) in fileList" :key="index">
              <i :class="fileTypeIcon(item.name)"></i>
              <span @click="download(item)">{{ item.name }}</span>
            </li>
          </ul>
          <p class="downTips" v-if="fileList.length != 0">
            以上为课堂相关文档，点击文件名称下载
          </p>
          <p class="intro">
            <span class="cleintIntroduce">简介：</span>
            <span>{{
              detailInfo.description ? detailInfo.description : "暂无"
            }}</span>
          </p>
          <!-- <p class="select-title">机位选择</p>
					<ul class="camera-list">
						<li :class="index == activeIndex ? 'active' : ''" @click="changeTeminal(index)"
								v-for="(val, index) in themeTeminalList">{{val.terminalName}}</li>
					</ul> -->
        </div>
      </div>
    </div>
    <div class="other-video" v-if="recommendList.length">
      <p class="other-title">相关推荐</p>
      <VideoList :videoList="recommendList" type="0"></VideoList>
    </div>
    <div
      class="imgViewBox"
      v-if="centerDialogVisible"
      @click="centerDialogVisible = false"
    >
      <div class="block" ref="block">
        <img :src="bigImgView" class="imgView" ref="imgView" />
      </div>
    </div>

    <transition name="bounce">
      <div class="evaluation-wrap" v-if="evaluationShow">
        <div class="evaluation-wrap-top">
          <i class="el-icon-close" @click="colseEvaluation"></i>
        </div>
        <div class="evaluation-title">{{evaluationList[0].name}}在线评课<span style="text-align: right;" @click="openNew">新页面访问</span></div>
        <div class="totalNum">
          <span v-if="evaluationList[activeName].type == 1">得分：{{totalNum}}</span>
					<span v-else style="opacity: 0;">得分</span>
        </div>
        <el-tabs v-model="activeName" style="pointer-events: none;">
          <el-tab-pane v-for="(item, index) in evaluationList" style="pointer-events: auto;" :key="index" :label="item.templateName" :name="index.toString()">
          <div class="evaluation-content">
            <div style="max-height: 503px;overflow: auto;">
            <el-table v-if="item.strategy == 1 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border default-expand-all>
            <el-table-column width="320" align="left" prop="levelOne" label="评课要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0) ? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" clearable :min="0" @blur="blurNumber" @change="changeNum" :max="scope.row.score"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)" align="center" label="评语" style="min-width: 350px;">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.isOpenRemarks == 1" align="center" :label="item.remarksName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-table  v-if="item.strategy == 2 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border default-expand-all :span-method="(param)=>objectSpanMethod(param,item.wordDataDtos)">
            <el-table-column width="150" prop="levelOne" align="center" label="评课项目"> </el-table-column>
            <el-table-column width="320" prop="levelTwo" align="left" label="评课要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0) ? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" clearable :min="0" @blur="blurNumber" @change="changeNum" :max="scope.row.score"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)" align="center" label="评语" style="min-width: 350px;">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.isOpenRemarks == 1" align="center" :label="item.remarksName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-table  v-if="item.strategy == 3 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" :header-cell-style="handerMethod" style="width: 100%;" border default-expand-all :span-method="(param)=>objectSpanMethod(param,item.wordDataDtos)">
            <el-table-column width="100" prop="levelOne" label="一级名称"> </el-table-column>
            <el-table-column width="100" prop="levelTwo" align="center" label="评课项目"> </el-table-column>
            <el-table-column width="320" prop="levelThree" align="left" label="评课要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0) ? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" clearable :min="0" @blur="blurNumber" @change="changeNum" :max="scope.row.score"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)" align="center" label="评语" style="min-width: 350px;">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.isOpenRemarks == 1" align="center" :label="item.remarksName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
            </div>
          
          <div class="evaluation-parttwo" v-if="item.isOpenSummary == 1">
            <h3 class="part-title">{{item.summaryName}}</h3>
            <textarea
              class="evaluation-text"
              v-model.trim="item.summary"
              style="resize: none"
              type="textarea"
              :disabled="isSubmit"
            ></textarea>
          </div>
          <!-- <div class="evaluation-partone">
            <h3 class="part-title">一、评分项目(每项评分范围0-10分)</h3>
            <ul class="part-one-itemwrap">
              <li
                class="one-item"
                v-for="(item, index) in evaluationList"
                :key="item.id"
              >
                <p class="one-item-title">
                  <span>{{ index + 1 }}.</span><span>{{ item.item }}</span>
                </p>
                <ul style="padding-left: 20px;" v-if="item.children && item.children.length > 0">
                  <li
                  class="one-item"
                  v-for="(items) in item.children"
                  :key="items.id">
                  <p class="one-item-title">
                  <span>{{ items.item }}</span>
                </p>
                  <ul style="padding-left: 20px;" v-if="items.children && items.children.length > 0">
                    <li
                    class="one-item"
                    v-for="(itemss) in items.children"
                    :key="itemss.id">
                    <p class="one-item-title">
                    <span>{{ itemss.item }}</span>
                  </p>
                  <el-rate
                    v-model="itemss.userScore"
                    show-score
                    allow-half
                    :max="itemss.score"
                    :score-template="itemss.userScore == null ? 0 + '分' : itemss.userScore + '分'"
                    :colors="colors"
                    :disabled="isSubmit"
                    class="score"
                  ></el-rate>
                    </li>
                  </ul>
                  <el-rate
                    v-else
                    v-model="items.userScore"
                    show-score
                    allow-half
                    :max="items.score"
                    :score-template="items.userScore == null ? 0 + '分' : items.userScore + '分'"
                    :colors="colors"
                    :disabled="isSubmit"
                    class="score"
                  ></el-rate>
                  </li>
                </ul>
                <el-rate
                  v-else
                  v-model="item.userScore"
                  show-score
                  allow-half
                  :max="item.score"
                  :score-template="item.userScore == null ? 0 + '分' : item.userScore + '分'"
                  :colors="colors"
                  :disabled="isSubmit"
                  class="score"
                ></el-rate>
              </li>
            </ul>
          </div> -->
          <div class="evaluation-bottom">
            <el-button v-show="activeName != 0" @click="goPre" class="evaluation-btn"
              >上一个任务</el-button
            >
            <el-button v-show="(Number(activeName) + 1) < evaluationList.length" @click="goNext" class="evaluation-btn"
              >下一个任务</el-button
            >
            <el-button  v-if="!isSubmit" v-show="(Number(activeName) + 1) == evaluationList.length" @click="submitEvaluation" class="evaluation-btn"
              >完成</el-button
            >
            <el-button  v-if="!isSubmit" class="evaluation-btn" @click="saveEvaluation"
              >保存草稿</el-button
            >
          </div>
        </div>
          </el-tab-pane>
        </el-tabs>
        
      </div>
    </transition>
    <el-dialog
      title="提交评课"
      :close-on-click-modal="false"
      :visible.sync="checkShow"
      width="420px"
    >
      <div class="dialog-wrap">
        <p class="err-delete">提交评课后无法再次编辑，确认提交？</p>
        <div class="dialog-btn">
          <el-button type="primary" @click="submitData">确 定</el-button>
          <el-button @click="checkShow = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import videojs from "video.js";
import FlvJsPlayer from "xgplayer-flv.js";
import VideoList from "@/components/VideoList";
import { judgeMobile } from "@/assets/js/utils";
import emojiList from "@/assets/Emotions/emoji";
import E from "wangeditor";
import { mapState } from "vuex";
import liveWs from "@/components/liveWs.vue";
// import wsMixin from "@/components/wsMixin.vue";
import { session, storage, kickUrl, getNowDate } from "@/assets/js/utils";
import { connects, sendMessage, MyEvents, closeWs } from '@/assets/js/liveWs'
export default {
  name: "",
  mixins: [liveWs],
  data() {
    return {
      connectTime: null,
      passwordMsg: '',
      activeName: 0,
      dialogVisible: false,
      password: '',
      volume: 0.6,
      recommendList: [],
      detailInfo: {},
      activeIndex: 0,
      activeUser: 0,
      themeTeminalList: [],
      myVideo: null,
      playUrl: null,
      errorUrl: null,
      videoErrorShow: false,
      startTime: "",
      themeId: "",
      wsInterval: '',
      recordInterval: "",
      checkShow: false,
      isActive: 1,
      tabList: [
        {
          typeId: 1,
          type: "互动讨论",
        },
        {
          typeId: 2,
          type: "主题详情",
        },
      ],
      emojiList: emojiList, // 表情包数组
      inList: [], // 消息数组
      scrollIsBottom: true, // 是否滚动置底
      selfSend: false, // 是否是自己发送
      toNew: false, // 是否新消息
      num: "", //新消息数
      forbidden: false, //是否禁言
      userInfo: {},
      interactiveStatus: "", // 互动开启关闭
      createAccount: "", // 登记直播人数
      centerDialogVisible: false,
      bigImgView: "", // 大图预览
      evaluationShow: false, // 评课显示
      evaluationList: [], // 评课数组
      summary: "", // 评课总结
      colors: ["#FA8C47", "#FA8C47", "#FA8C47"],
      isBindEvaluation: false,
      isSubmit: false, //是否已提交评测
      fileList: [], // 教学文件数组
      totalNum: 0,
      liveIsEnd: "", // 监听直播是否结束
      liveGetNowDate: "", //  当前时间器
      setInter: "", // 计时器
      endLivetime: "", //结束时间
      settime: null,
      commentData: {}, // 评课数据
      userId:  window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).userId : ''
    };
  },
  components: { VideoList },
  beforeCreate() {
    if (judgeMobile()) {
      this.$router.replace({
        path: "/mobile" + this.$route.path,
        query: this.$route.query,
      });
    }
  },
  created() {
    MyEvents.on('message', this.getMessage);
  },
  destroyed() {
    if (this.settime) {
      clearTimeout(this.settime);
    }
  },
  mounted() {
    this.userInfo = JSON.parse(this.$store.state.chatLogin);
    this.getDetailInfo();
    this.wsConnect();
    window.addEventListener("beforeunload", this.recordViewInfo);
    this.editorInit(); // 初始化富文本
    this.autoBottom(); // 自动置地
    this.newMessage(); // 新消息滚动监听
    if (
      this.$refs.chatBox.scrollHeight -
        this.$refs.chatBox.scrollTop -
        this.$refs.chatBox.clientHeight <=
      100
    ) {
      this.scrollIsBottom = true;
    } else {
      this.scrollIsBottom = false;
    }
    setTimeout(() => {
			if(this.detailInfo.id){
				this.addViewed(this.detailInfo.id);
			}
		}, 300);
    this.checkIsComment(); // 检测评课
    // this.setInter = setInterval(() => {
    //   this.liveGetNowDate = getNowDate();
    // }, 3000);
  },
  computed: {
    isLogin() {
      return this.$parent.userInfo ? true : false;
    },
    ...mapState({
      chatLogin: "chatLogin",
    }),
  },
  methods: {
    // 文件类型icon判断
    fileTypeIcon(name) {
      if (name.match("ppt") || name.match("pptx")) {
        return "iconfont icon-ppt ppt";
      } else if (name.match("pdf")) {
        return "iconfont icon-pdf pdf";
      } else if (name.match("doc") || name.match("docx")) {
        return "iconfont icon-word word";
      } else if (name.match("jpg")) {
        return "iconfont icon-jpg jpg";
      } else if (name.match("png")) {
        return "iconfont icon-png png";
      } else if (name.match("xls") || name.match("xlsx")) {
        return "iconfont icon-excel xls";
      } else if (name.match("rar") || name.match("zip")) {
        return "iconfont icon-RAR zip";
      }
    },
    // 下载文件
    download(item) {
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = item.url;
      link.setAttribute("download", decodeURIComponent(item.name));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    wsConnect() {
      connects(this.$route.query.themeid).then(res => {
        if(res == 200) {
          // this.wsInterval = setInterval(() => {
          //   sendMessage({
          //     "sequenceId":0,
          //     "messageType":1
          //   });
          // }, 10000)
          sendMessage({
            "sequenceId":0,
            "messageType":5
          })
        }
      })
    },
    getMessage(data) {
      if(data.messageType == 3 && data.success == true) {
        this.activeUser = data.count;
      }
    },
    openNew() {
      if(!this.isSubmit){
        let evaluationData = {
        type: 0,
        objectId: this.themeId,
        status: 0,
        itemList: this.evaluationList,
        summary: this.summary,
      };
      this.$axios.post("/index/commentOnline", evaluationData).then(
        (res) => {
          if (res.code == 200) {
            this.evaluationShow = false;
            let routeUrl = this.$router.resolve({
              path: "/newplay",
              query:{
                  id: this.themeId,
                  type: 0,
                }
            });
            window.open(routeUrl.href, '_blank');
          }else{
						this.$message(res.message, 'error')
					}
        },
        (err) => {}
      );
      }else{
        this.evaluationShow = false;
        let routeUrl = this.$router.resolve({
          path: "/newplay",
          query:{
              id: this.themeId,
              type: 0,
            }
        });
        window.open(routeUrl.href, '_blank');
      }
    },
    blurNumber(e) {
      if (!e.target.value) {
        e.target.value = 0;
      }
    },
    changeNum() {
      let num = 0;
      let data = this.evaluationList;
      if(data[this.activeName].wordDataDtos.length > 0) {
        for(let j in data[this.activeName].wordDataDtos) {
          if(data[this.activeName].wordDataDtos[j].type == 0 || data[this.activeName].wordDataDtos[j].type == 2) {
            if(!data[this.activeName].wordDataDtos[j].userScore) {
              data[this.activeName].wordDataDtos[j].userScore = 0;
            }
            num = num + data[this.activeName].wordDataDtos[j].userScore;
          }
        }
      }
      this.totalNum = num;
    },
    // 检测是否有权评课
    checkIsComment() {
      if(!this.userId) {
        return;
      }
      this.$axios
        .post("/index/checkCommentAuth", { type: 0, objectId: this.themeId, userId: this.userId })
        .then((res) => {
          if (res.code === 200) {
            this.isBindEvaluation = true;
            this.commentData = res.data;
            this.$axios
              .post("/index/getUserCommentDetail", {
                type: 0,
                objectId: this.themeId,
              })
              .then((res) => {
                this.evaluationList = res.data;
                this.changeNum();
                if (res.data[0].status == 1) {
                  this.isSubmit = true;
                }
              });
          } else {
            this.isBindEvaluation = false;
          }
        });
    },
    goNext() {
      if(this.checkData(this.activeName) == false) {
        this.activeName = (Number(this.activeName) + 1).toString();
        this.changeNum();
      }
    },
    goPre() {
      this.activeName = (Number(this.activeName) - 1).toString();
      this.changeNum();
    },
    // 保存评课草稿
    saveEvaluation() {
      if (this.summary.length > 300) {
        this.$message("评课字数限制300字内！", "error");
        return;
      }
      let evaluationData = {
        type: 0,
        objectId: this.themeId,
        status: 0,
        itemList: this.evaluationList,
        summary: this.summary,
      };
      this.$axios.post("/index/commentOnline", evaluationData).then(
        (res) => {
          if (res.code == 200) {
            this.$message("保存草稿成功", "success");
            this.evaluationShow = false;
          }else{
						this.$message(res.message, 'error')
					}
        },
        (err) => {}
      );
    },
    // 提交评课
    submitEvaluation() {
      if(this.checkData(this.evaluationList.length - 1) == false) {
        this.evaluationData = {
          type: 0,
          objectId: this.themeId,
          status: 1,
          itemList: this.evaluationList,
          summary: this.summary,
        };
        this.checkShow = true;
      }
    },
    checkData(i) {
      if(this.evaluationList[i].wordDataDtos.length > 0) {
        for(let j in this.evaluationList[i].wordDataDtos){
          if(this.evaluationList[i].wordDataDtos[j].type == 0) {
            if(!this.evaluationList[i].wordDataDtos[j].userScore){
              this.evaluationList[i].wordDataDtos[j].userScore = 0;
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`评分评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          }if(this.evaluationList[i].wordDataDtos[j].type == 1){
            if(this.evaluationList[i].wordDataDtos[j].content == '' || this.evaluationList[i].wordDataDtos[j].content == null) {
              return this.$message(`评语必填！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content.length > 100) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `评语为100字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          } else if(this.evaluationList[i].wordDataDtos[j].type == 2){
            if(!this.evaluationList[i].wordDataDtos[j].userScore){
              this.evaluationList[i].wordDataDtos[j].userScore = 0;
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`评分评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content == '' || this.evaluationList[i].wordDataDtos[j].content == null) {
              return this.$message(`评语必填！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content.length > 100) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `评语为100字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          }
        }
      }
      if(this.evaluationList[i].isOpenSummary == 1){
        // if(this.evaluationList[i].summary === null || this.evaluationList[i].summary == '') {
        //   return this.$message(`中总结性内容不能为空！`, 'error');
        // }
        if(this.evaluationList[i].summary && this.evaluationList[i].summary.length > 200) {
          return this.$message(`总结性内容为200字符内！`, 'error');
        }
      }
      return false;
    },
    submitData() {
      this.$axios.post("/index/commentOnline", this.evaluationData).then(
        (res) => {
          if (res.code == 200) {
            this.$message("评课成功", "success");
            this.checkShow = false;
            this.evaluationShow = false;
          }else{
						this.$message(res.message, 'error')
					}
        },
        (err) => {}
      );
    },
    handerMethod ({ row, column, rowIndex, columnIndex }) {
      //这里有个非常坑的bug 必须是row[0]=0 row[1]=2才会生效
      row[1].colSpan = 2
      row[2].colSpan = 0
      if (columnIndex === 0) {
        return { display: 'none' }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }, data) {
      if (columnIndex === 0) {
        // 表格数据修改
        const _row = this.flitterData(data).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
      }
      if (columnIndex === 1) {
        // 表格数据修改
        const _row = this.flitterData(data).two[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
      }
    },
    flitterData(arr) {
      let spanOneArr = [];
      let spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
        } else {
          if (item.levelOne == arr[index - 1].levelOne) {
            //第一列需合并相同内容的判断条件（data_）
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
          if (item.levelTwo == arr[index - 1].levelTwo) {
            //第二列需合并相同内容的判断条件（data_）
            spanTwoArr[concatTwo] += 1;
            spanTwoArr.push(0);
          } else {
            spanTwoArr.push(1);
            concatTwo = index;
          }
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr,
      };
    },
    //关闭评课窗
    colseEvaluation() {
      // if(!this.isSubmit) {
      //   this.saveEvaluation();
      // }
      this.evaluationShow = false;
    },
    // 评课拖拽窗
		toEvaluation() {
			if (this.commentData.status !== 1) {
				this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId,userId: this.userId }).then(res => {
					if (res.code === 200) {
						this.isBindEvaluation = true;
						this.commentData = res.data;
						this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
              if(res.code == 200){
                this.evaluationList = res.data;
                this.changeNum();
                if (res.data[0].status == 1) {
                  this.isSubmit = true;
                }
              }else{
                this.$message(res.message,'error')
              }
						})
						if (this.commentData.status !== 1) {
							this.$message('评课时间' + this.commentData.startTime, 'warning')
							return;
						} else {
							this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId,userId: this.userId }).then(ress => {
								if (ress.code == 200) {
                  this.activeName = '0';
									this.evaluationShow = true;
									this.$nextTick(() => {
										//获取元素
										var dv = document.querySelector('.evaluation-wrap');
										var x = 0;
										var y = 0;
										var l = 0;
										var t = 0;
										var isDown = false;
										//鼠标按下事件
										// dv.onmousedown = function (e) {
										// 	//获取x坐标和y坐标
										// 	x = e.clientX;
										// 	y = e.clientY;

										// 	//获取左部和顶部的偏移量
										// 	l = dv.offsetLeft;
										// 	t = dv.offsetTop;
										// 	//开关打开
										// 	isDown = true;
										// 	//设置样式  
										// 	dv.style.cursor = 'move';
										// 	// console.log(document.body)
										// 	document.body.classList.add("notselect")
										// }
										//鼠标移动
										// window.onmousemove = function (e) {
										// 	if (isDown == false) {
										// 		return;
										// 	}
										// 	//获取x和y
										// 	var nx = e.clientX;
										// 	var ny = e.clientY;
										// 	//计算移动后的左偏移量和顶部的偏移量
										// 	var nl = nx - (x - l);
										// 	var nt = ny - (y - t);

										// 	dv.style.left = nl + 'px';
										// 	dv.style.top = nt + 'px';
										// }
										//鼠标抬起事件
										dv.onmouseup = function () {
											//开关关闭
											isDown = false;
											dv.style.cursor = 'default';
											document.body.classList.remove("notselect")
										}
										this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
											this.evaluationList = res.data;
                      this.changeNum();
											if (res.data[0].status == 1) {
												this.isSubmit = true;
											}
										})
										let text = document.querySelector(".evaluation-text");
										text.addEventListener('mousemove', (e) => {
											let event = e || window.event;
											if (event) {
												e.cancelBubble = true;
												e.stopPropagation()
												return false;
											}
										})
									})
								} else {
									this.$message(ress.message, 'warning');
									this.evaluationShow = false;
									this.isBindEvaluation = false;
									return;
								}
							})
						}
					} else {
						this.isBindEvaluation = false;
					}
				})
			} else {
				this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId,userId: this.userId }).then(ress => {
					if (ress.code == 200) {
            this.activeName = '0';
						this.evaluationShow = true;
						this.$nextTick(() => {
							//获取元素
							var dv = document.querySelector('.evaluation-wrap');
							var x = 0;
							var y = 0;
							var l = 0;
							var t = 0;
							var isDown = false;
							//鼠标按下事件
							// dv.onmousedown = function (e) {
							// 	//获取x坐标和y坐标
							// 	x = e.clientX;
							// 	y = e.clientY;

							// 	//获取左部和顶部的偏移量
							// 	l = dv.offsetLeft;
							// 	t = dv.offsetTop;
							// 	//开关打开
							// 	isDown = true;
							// 	//设置样式  
							// 	dv.style.cursor = 'move';
							// 	// console.log(document.body)
							// 	document.body.classList.add("notselect")
							// }
							//鼠标移动
							// window.onmousemove = function (e) {
							// 	if (isDown == false) {
							// 		return;
							// 	}
							// 	//获取x和y
							// 	var nx = e.clientX;
							// 	var ny = e.clientY;
							// 	//计算移动后的左偏移量和顶部的偏移量
							// 	var nl = nx - (x - l);
							// 	var nt = ny - (y - t);

							// 	dv.style.left = nl + 'px';
							// 	dv.style.top = nt + 'px';
							// }
							//鼠标抬起事件
							dv.onmouseup = function () {
								//开关关闭
								isDown = false;
								dv.style.cursor = 'default';
								document.body.classList.remove("notselect")
							}
							this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
								this.evaluationList = res.data;
                this.evaluationList.forEach(el => {
                  /*let isTrue = el.itemList.every(ele => ele.type === 0);
                  if(isTrue == false){
                    el.type = 0
                  }else{
                    el.type = 1
                  }*/
                  let allZero = el.itemList.every(ele => ele.type === 0);
                  let hasTwo = el.itemList.some(ele => ele.type === 2);

                  if (hasTwo) {
                    el.type = 2;
                  } else if (allZero) {
                    el.type = 1;
                  } else {
                    el.type = 0;
                  }
								})
                this.changeNum();
								if (res.data[0].status == 1) {
									this.isSubmit = true;
								}
							})
							let text = document.querySelector(".evaluation-text");
							text.addEventListener('mousemove', (e) => {
								let event = e || window.event;
								if (event) {
									e.cancelBubble = true;
									e.stopPropagation()
									return false;
								}
							})
						})
					} else {
						this.$message(ress.message, 'warning');
						this.evaluationShow = false;
						this.isBindEvaluation = false;
						return;
					}
				})
			}
		},
    // 聊天大图
    imgB(index) {
      let p = document.querySelectorAll(".a-message")[index];
      let p1 = p.querySelector("p");
      let img = p1.querySelector(".sendImg");
      if (img) {
        this.centerDialogVisible = true;
      } else {
        return;
      }
      this.bigImgView = img.currentSrc;
      // console.log(imgList)
      this.$nextTick(() => {
        // this.$refs.imgView.forEach((item) => {
        // 	function onMouseWheel(ev) {/*当鼠标滚轮事件发生时，执行一些操作*/
        // 				console.log('滚')
        // 						var ev = ev || window.event;
        // 						var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
        // 								down = ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
        // 						if(down){
        // 								item.style.height = item.offsetHeight+100+'px';
        // 								item.style.width = item.offsetWidth+100+'px';
        // 						}else{
        // 								item.style.width = item.offsetWidth-100+'px';
        // 								item.style.height = item.offsetHeight-100+'px';
        // 						}
        // 						if(ev.preventDefault){/*FF 和 Chrome*/
        // 								ev.preventDefault();// 阻止默认事件
        // 						}
        // 						return false;
        // 				}
        // 				this.addEvent(item,'mousewheel',onMouseWheel);
        // 				this.addEvent(item,'DOMMouseScroll',onMouseWheel);
        // })
        if (img.clientWidth > img.clientHeight) {
          let h =
            (img.clientHeight * this.$refs.block.clientWidth) / img.clientWidth;
          if (h > this.$refs.block.clientHeight) {
            this.$refs.imgView.style.height =
              this.$refs.block.clientHeight + "px";
            let w =
              (this.$refs.block.clientHeight * img.clientWidth) /
              img.clientHeight;
            this.$refs.imgView.style.width = w + "px";
          } else {
            this.$refs.imgView.style.width =
              this.$refs.block.clientWidth + "px";
            this.$refs.imgView.style.height = h + "px";
          }
        } else if (img.clientWidth < img.clientHeight) {
          let w =
            (this.$refs.block.clientHeight * img.clientWidth) /
            img.clientHeight;
          if (w > this.$refs.block.clientWidth) {
            let h =
              (img.clientHeight * this.$refs.block.clientWidth) /
              img.clientWidth;
            this.$refs.imgView.style.width =
              this.$refs.block.clientWidth + "px";
            this.$refs.imgView.style.height = h + "px";
          } else {
            this.$refs.imgView.style.height =
              this.$refs.block.clientHeight + "px";
            this.$refs.imgView.style.width = w + "px";
          }
        } else {
          this.$refs.imgView.style.width = this.$refs.block.clientHeight + "px";
          this.$refs.imgView.style.height =
            this.$refs.block.clientHeight + "px";
        }
      });
    },
    //字符串转base64
    encode(str) {
      // 对字符串进行编码
      var encode = encodeURI(str);
      // 对编码的字符串转化base64
      var base64 = btoa(encode);
      return base64;
    },
    // tab切换
    chooseType(index) {
      this.isActive = index;
    },

    //富文本初始化
    editorInit() {
      this.editor = new E("#editor");
      this.editor.config.showLinkImg = false;
      this.editor.config.showFullScreen = false;
      this.editor.config.uploadImgShowBase64 = true; //图片以base64形式保存
      this.editor.config.uploadImgMaxLength = 2; // 一张
      this.editor.config.uploadImgMaxSize = 1 * 1024 * 1024; // 1M
      // 配置菜单栏，删减菜单，调整顺序
      this.editor.config.menus = [
        "emoticon",
        // 'image',
        // 'undo',
        // 'redo',
      ];
      this.editor.config.emotions = [
        {
          title: "表情", // tab 的标题
          type: "image", // 'emoji' 或 'image' ，即 emoji 形式或者图片形式
          content: this.emojiList,
        },
      ];
      // 获取必要的变量，这些在下文中都会用到
      const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } =
        E;
      // 第一，菜单 class ，Button 菜单继承 BtnMenu class
      var _that = this;
      class AlertMenu extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="图片">
												<i class="w-e-icon-image"></i>
												<label for="myupload" style="opacity:0;width:30px;height:30px;position:absolute;">
													<input type="file" style="display:none" id="myupload" accept="image/png, image/jpeg, image/jpg"></input>
												</label>
										</div>`
          );
          super($elem, editor);
        }
        // 菜单点击事件
        clickHandler() {
          // 做任何你想做的事情
          // 可参考【常用 API】文档，来操作编辑器
          // console.log(_that)
          _that.$nextTick(() => {
            let id = document.querySelector("#myupload");
            console.log('id',id)
            id.onchange = function (e) {
              let file = e.target.files[0];
              // 判断图片类型
              var isJpg;
              if (
                file.type == "image/jpeg" ||
                file.type == "image/png" ||
                file.type == "image/jpg"
              ) {
                isJpg = true;
              } else {
                isJpg = false;
              }
              console.log('上传了',file)
              // 判断图片大小
              const isLt2M = file.size / 1024 / 1024 < 1;
              if (!isJpg) {
                id.value = "";
                _that.$message("上传图片只能是jpg/png/jepg格式", "error");
                return;
              }
              if (!isLt2M) {
                id.value = "";
                _that.$message("上传图片大小不能超过1M", "error");
                return;
              }
              console.log(file);
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function (ev) {
                var imgBase64Data = ev.target.result;
                _that.editor.cmd.do(
                  "insertHTML",
                  `<img src=${imgBase64Data} style="width:200px" class="sendImg">`
                );
              };
              id.value = "";
            };
          });
        }
        // 菜单是否被激活（如果不需要，这个函数可以空着）
        // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
        // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
        tryChangeActive() {
          // 激活菜单
          // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
          // 2. this.this.isActive === true
          this.active();

          // // 取消激活菜单
          // // 1. 菜单 DOM 节点会删掉 .w-e-active
          // // 2. this.this.isActive === false
          this.unActive();
        }
      }

      // 注册菜单
      const menuKey = "alertMenuKey"; // 菜单 key ，各个菜单不能重复
      this.editor.menus.extend("alertMenuKey", AlertMenu);

      // 将菜单加入到 editor.config.menus 中
      // 也可以通过配置 menus 调整菜单的顺序，参考【配置菜单】部分的文档
      this.editor.config.menus = this.editor.config.menus.concat(menuKey);
      this.editor.config.placeholder = "请输入正文（限制50字符）";
      this.editor.create();

      let textContainer = document.querySelector(".w-e-text");
      textContainer.addEventListener("paste", function (event) {
        if (event.clipboardData.files[0]) {
          let file = event.clipboardData.files[0];
          // 判断图片类型
          var isJpg;
          if (
            file.type == "image/jpeg" ||
            file.type == "image/png" ||
            file.type == "image/jpg"
          ) {
            isJpg = true;
          } else {
            isJpg = false;
          }

          // 判断图片大小
          const isLt2M = file.size / 1024 / 1024 < 1;
          if (!isJpg) {
            _that.$message("上传图片只能是jpg/png格式", "error");
            return;
          }
          if (!isLt2M) {
            _that.$message("上传图片大小不能超过1M", "error");
            return;
          }
          var reader = new FileReader();
          reader.readAsDataURL(event.clipboardData.files[0]);
          reader.onload = function (ev) {
            var imgBase64Data = ev.target.result;
            _that.editor.cmd.do(
              "insertHTML",
              `<img src=${imgBase64Data} style="width:200px" class="sendImg">`
            );
          };
        }
      });
      // console.log(this.editor.config)
      this.$nextTick(() => {
        let editerInput = document.querySelector(".w-e-text");
        editerInput.onkeydown = (e) => {
          // 回车提交表单
          let event = e || window.event;
          if (!event.shiftKey && event.keyCode == 13) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();
            // console.log(this.editor.selection.getSelectionText())
            if (this.isLogin && !this.forbidden) {
              this.send();
            }
          }
        };
      });
    },
    // 空消息发送限制
    isNullMessage() {
      console.log(this.editor.txt.html());
      let str = this.editor.txt.html().replace(/&nbsp;/g, "");
      str = str.replace(/<br>/g, "");
      str = str.replace(/\s/g, "");
      if (str === "<p></p>") {
        this.$message("不能发送空消息", "error");
        this.editor.txt.clear();
        return true;
      }
    },
    // 发送消息
    send() {
      // 空消息判断
      if (this.isNullMessage()) {
        return;
      }
      let wetext = document.querySelector(".w-e-text");
      let sendImgNum = wetext.querySelectorAll(".sendImg").length;
      if (sendImgNum > 1) {
        this.$message("每次仅限发送一张图片", "error");
        return;
      }
      let str = this.editor.txt.text().replace(/&nbsp;/g, "");
      str = str.replace(/<br>/g, "");
      let messageNUm =
        (this.editor.txt.html().match(/<img[^>]+>/g)
          ? this.editor.txt.html().match(/<img[^>]+>/g).length
          : 0) + str.length;
      if (0 < messageNUm && messageNUm < 51) {
        let optionData = {
          type: "liveChat",
          themeInfo: {
            type: 2, // 1 进入直播  2 发送消息 3 禁言 4 取消禁言
            speaker: 0, // 1是  0否 主讲
            themeId: this.$route.query.themeid, //主题id
            roleType: this.userInfo.roleType == 1 ? 1 : 0, //角色类型 1 教师 0 学生
            userName: this.userInfo.nickName, //名字
            interactiveStatus: this.interactiveStatus, // 互动讨论是否开启 1开启 0关闭
            message: this.encode(this.editor.txt.html()),
            account: this.userInfo.account, // 用户账户
          },
        };
        // console.log(optionData)

        this.selfSend = true;
        this.toNew = false;
        console.log(this.websock,'22')
        if (this.websock) {
          this.websock.send(JSON.stringify(optionData));
        }
        // this.websocketonmessage()
        this.editor.txt.clear();
      } else {
        this.$message("限制50字符,不能发送空消息", "error");
      }
    },
    // 新消息滚动置底
    autoBottom() {
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
    },
    // 消息滚动后新消息提示
    newMessage() {
      this.$refs.chatBox.addEventListener("scroll", () => {
        if (
          this.$refs.chatBox.scrollHeight -
            this.$refs.chatBox.scrollTop -
            this.$refs.chatBox.clientHeight <=
          100
        ) {
          this.scrollIsBottom = true;
          this.num = 0;
          this.toNew = false;
          console.log(this.scrollIsBottom);
        } else {
          this.scrollIsBottom = false;
          console.log(this.scrollIsBottom);
        }
      });
    },
    clickNew() {
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
      this.toNew = false;
      this.num = 0;
    },
    // 登录后参与互动
    toLogin() {
      this.$parent.loginShow = true;
    },
    handleEnsure() {
      if (this.password == '') {
        this.passwordMsg = '请输入观看密码';
        return;
      }
      if (this.password !== this.detailInfo.password) {
        this.passwordMsg = '密码错误，请重新输入密码';
        return;
      }
      let list = window.sessionStorage.getItem('liveList') ? JSON.parse(window.sessionStorage.getItem('liveList')) : []
      if(list){
        let isTrue = false;
        list.forEach(el => {
          if(el.id === this.detailInfo.id){
            isTrue = true;
            el.password = this.password;
          }
        });
        if(isTrue == false){
          list.push({
            id: this.detailInfo.id,
            password: this.password
          })
        }
      }else{
        list = [{
          id: this.detailInfo.id,
          password: this.password
        }]
      }
      window.sessionStorage.setItem('liveList',JSON.stringify(list))
      this.dialogVisible = false;
      this.setInit();
    },
    //获取详情
    getDetailInfo() {
      let query = this.$route.query;
      this.themeId = query.themeid;
      let data = {
        id: query.themeid,
        type: query.type
      };
      if(query.etype){
        data.evaluationType = query.etype;
      };
      this.$axios
        .get("/index/getVideoInfo", data)
        .then((res) => {
          if (res.data === null) {
            setTimeout(() => {
              if(window.history.length > 1){
                this.$router.go(-1)
              }else{
                this.$router.push({ name: 'home' });
              }
            }, 1000);
            return;
          }
          this.endLivetime = res.data.endTime;
          this.detailInfo = res.data;
          this.getRecommendList();
          this.interactiveStatus = res.data.liveMode == 1 ? res.data.interactiveStatus : null;
          this.createAccount = res.data.createAccount;
          this.fileList = res.data.teachingFileList;
          //记录观看开始时间
          clearInterval(this.recordInterval);
          this.startTime = new Date().getTime() / 1000;
          if(res.data.themeStatus == 1) {
            this.recordInterval = setInterval(() => {
              this.$axios
                .get("/index/recordViewInfo", {
                  themeId: this.themeId,
                  time: 300,
                  type: 0,
                  num: this.activeUser
                })
                .then((res) => {});
            }, 300000);
          }
          this.chatWebsocket();
          let list = JSON.parse(window.sessionStorage.getItem('liveList'));
          let isTrue = false;
          if(list) {
            list.forEach(el => {
              if(el.id == res.data.id && el.password == res.data.password) {
                isTrue = true;
              }
            })
          }
          if(res.data.groupId == 1 && res.data.password !== '' && res.data.password !== null && isTrue == false) {
            this.dialogVisible = true;
          }else{
            this.dialogVisible = false
            this.setInit();
          }
          
        });
    },
    setInit() {
      this.passwordMsg = '';
      let val = this.detailInfo;
      this.themeTeminalList = val.themeTeminalList;
      if (this.detailInfo.themeStatus == 0) {
        return;
      }
      // this.liveIsEnd = this.detailInfo.themeStatus;
      this.$nextTick(() => {
        let videoEl = "";
        if (this.detailInfo.themeStatus == 2 &&this.$route.query.type == "0") {
          clearInterval(this.recordInterval);
          console.log('aaa')
          videoEl = `<div class="videoEnd" -webkit><p>直播主题已结束</p></div>`
					document.querySelector('#videoWrap').innerHTML = videoEl;
          if(this.detailInfo.recode == 1){
            if(this.$route.query.etype == 1){
              this.$router.push({path: '/pplay', query: {
                themeid:this.$route.query.themeid,
                type: 0,
                etype: this.$route.query.etype
              }})
            }else{
              this.$router.push({path: '/pplay', query: {
                themeid:this.$route.query.themeid,
                type: 0,
              }})
            }
          }
          console.log("直播主题结束");
        } else {
          let div = document.getElementById("myVideo");
          if (div) {
            div.remove();
          }
          videoEl = `<div id="myVideo" ref="myVideo"></div>`;
          let divs = document.querySelector("#videoWrap");
          if (divs) {
            document.querySelector("#videoWrap").innerHTML = videoEl;
          }
          // if(this.settime) {
          // 	console.log('清除了')
          // 	window.clearTimeout(this.settime);
          // }
          // var dateBegin = new Date(this.endLivetime.replace(/-/g, "/"));//将-转化为/，使用new Date
          // var dateEnd = new Date();//获取当前时间
          // var dateDiff = dateBegin.getTime() - dateEnd.getTime();//时间差的毫秒数
          // this.settime = window.setTimeout(() => {
          // 	console.log('执行了')
          // 	this.getDetailInfo();
          // }, dateDiff);
          let playUrl = this.themeTeminalList[0].httpUrl;
          playUrl = process.env.NODE_ENV !== "production" ? playUrl : playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
          // playUrl = `${playUrl.split('://')[0]}://${playUrl.split('//')[1].replace('8085','8084')}`;   // https
          this.playUrl = playUrl;
          this.errorUrl = playUrl;
          this.startVideo();
          console.log("可播放");
        }
      });
    },
    startVideo() {
      if(this.myVideo){
        this.myVideo = null;
      }
      this.myVideo = new FlvJsPlayer({
        id: "myVideo",
        url: this.playUrl,
        // hasVideo: true,
        // hasAudio: true,
        width: 927,
        height: 647,
        autoplay: true,
        videoInit: true,
        volume: this.volume,
        closeVideoClick: true,
        closeVideoTouch: true,
        errorTips: "暂无视频源",
        isLive: true,
        lang: "zh-cn",
        flvOptionalConfig: {
          enableStashBuffer: true,
          type: "flv",
        },
      });
      const _this = this;
      if (document.getElementsByTagName('video').length > 1) {
				for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
					if (i != 0) {
						document.getElementsByTagName('video')[i].remove()
					}
				}
			}
      // _this.myVideo.on('pause', function () {
			// 	_this.myVideo.once('play', function () {
			// 		_this.myVideo.replay();
			// 		// _this.setInit();
			// 	});
			// });
      let video = document.getElementsByTagName('video')[0];
			video.addEventListener('loadedmetadata', function() {
				if (video.videoWidth > 0 && video.videoHeight > 0) {
					console.log('HTTP FLV流有画面');
				} else {
					console.log('HTTP FLV流没有画面');
					_this.myVideo.destroy();
					_this.startVideo();
				}
			});
      _this.myVideo.on("volumechange", function (e) {
        _this.volume = e.volume;
      });
      if(_this.connectTime){
        clearTimeout(_this.connectTime)
        _this.connectTime = null
      }
      _this.myVideo.on("error", function () {
        // closeWs();
        clearInterval(_this.wsInterval);
        //断流重接，结束不续播
        _this.myVideo.destroy();
        //断流重接，结束不续播
        _this.connectTime = setTimeout(() => {
          _this.getDetailInfo();
          console.log("重连中");
        }, 2000);
      });
      // this.$nextTick(() => {
      // 	if (process.env.NODE_ENV !== "development" && this.myVideo) {
      // 		this.myVideo.on('error', function(){
      // 			//断流重接，结束不续播
      // 			console.log('222')
      // 			setTimeout(connectLive,3000);
      // 			function connectLive () {
      // 					_this.$axios.get('/index/getVideoInfo', {id: _this.$route.query.themeid, type: _this.$route.query.type}).then(res => {
      // 					_this.endLivetime = res.data.endTime;
      // 					_this.liveIsEnd = res.data.themeStatus;
      // 					if(_this.endLivetime>getNowDate()){
      // 						// 监听销毁完成才能初始化
      // 						// _this.myVideo.once('destroy',() => {
      // 							_this.myVideo.destroy();
      // 							_this.startVideo();
      // 							_this.myVideo.src = _this.errorUrl;
      // 						// })

      // 						// debugger
      // 					}else{
      // 						let videoEl = '';
      // 						videoEl = `<div class="videoEnd" -webkit><p>直播主题已结束</p></div>`
      // 						document.querySelector('#myVideo').innerHTML = videoEl;
      // 					}
      // 				})
      // 			}
      // 		})
      // 	}
      // })
    },
    // //切换机位
    // changeTeminal(index){
    // 	this.videoErrorShow = false;
    // 	this.activeIndex = index;
    // 	let playUrl = this.themeTeminalList[index].httpUrl;
    // 	playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
    // 	this.playUrl = playUrl;
    // 	this.myVideo.src = this.playUrl;
    // },
    //获取推荐视频列表
    getRecommendList() {
      this.$axios
        .post("/index/relevantRecommend", {
          id: this.detailInfo.id,
          labelIds: this.detailInfo.labelIds,
          // categoryId: this.detailInfo.categoryId
          // type: this.$route.query.type
        })
        .then((res) => {
          this.recommendList = res.data;
        });
    },
    //更新视频观看数
    addViewed(id) {
      this.$axios
        .get("/index/updateThemeViewed", { themeId: id })
        .then((res) => {});
    },
    //上报数据
    recordViewInfo(e) {
      return
    },
    // // 直播结束推荐切换销毁
    // desmyVideo() {
    // 	this.$refs.myVideo.innerHTML = "";
    // }
  },
  watch: {
    // 监听直播状态
    liveIsEnd(val) {
      if (val == 2) {
        let videoEl = "";
        console.log('dddd')
        videoEl = `<div class="videoEnd" -webkit><p>直播主题已结束</p></div>`;
        document.querySelector("#videoWrap").innerHTML = videoEl;
      }
    }, // 监听直播时间结束
    liveGetNowDate(val) {
      if (val && val > this.endLivetime) {
        let videoEl = "";
        console.log('sss')
        videoEl = `<div class="videoEnd" -webkit><p>直播主题已结束</p></div>`;
        document.querySelector("#videoWrap").innerHTML = videoEl;
      }
    },
    $route(to, from) {
      console.log(to.path,'11111',from.path )
      if (to.path === from.path) {
        this.websocketclose();
				this.websock.close();
				this.websock = null;
				closeWs();
				clearInterval(this.wsInterval);
				this.inList = [];
        this.evaluationShow = false;
        this.getDetailInfo();
        this.checkIsComment();
      }else{
        closeWs();
      }
      if (this.myVideo && this.myVideo.destroy) {
        this.myVideo.destroy();
      } else {
        this.$refs.myVideo.innerHTML = "";
      }
    },
    inList(val) {
      console.log(val,'2222111')
      if (val && this.selfSend) {
        this.autoBottom();
      } else if (val && this.scrollIsBottom) {
        this.autoBottom();
      }
    },
    chatLogin(val) {
      if (val) {
        this.userInfo = JSON.parse(this.$store.state.chatLogin);
        if (this.userInfo) {
          let accountData = {
            type: "login",
            account: this.userInfo.account,
            loginType: "web",
            mark: storage.get("time"),
          };
          if (this.websock) {
            this.websock.send(JSON.stringify(accountData));
          }
        }
      }
    },
  },
  beforeDestroy() {
    clearTimeout(this.connectTime)
    closeWs();
    clearInterval(this.wsInterval);
    this.setInter = null;
    clearInterval(this.recordInterval);
    if (this.myVideo && this.myVideo.destroy) {
      this.myVideo.destroy();
    }
    if (this.$refs.myVideo) {
      this.$refs.myVideo.innerHTML = "";
    }
    this.recordViewInfo();
    window.removeEventListener("beforeunload", this.recordViewInfo);
    if (this.websock) {
      this.websock.close();
    }
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.dialogPassword{
   ::v-deep .el-dialog__wrapper{
    z-index: 999;
  }
}
 ::v-deep .el-tabs__header{
  margin: 0 30px 30px 30px;
}
.admin{
  display: flex;
  justify-content: center;
  align-items: center;
}
.detailInfoName {
  padding-bottom: 20px;
  padding-left: 10px;
  background: #fff;
}

.video-content-wrap {
  margin-top: 30px;
  display: flex;
  width: 1200px;
  min-height: 700px;
  // height: 700px;
  margin: 0 auto;
  background: #f1f2f4;

  .video-wrap {
    position: relative;
    width: 927px;

    .video-error {
      position: absolute;
      height: 647px;
      width: 927px;
      z-index: 10;
      background: #000;
      top: 0;
      left: 0;
      color: #fff;
      text-align: center;
      line-height: 580px;
    }
  }

  .video-content {
    position: relative;
    height: 647px;
    width: 100%;
    background: #000;
  }

  .video-tag-info {
    background: #fff;
    width: 100%;
    min-height: 66px;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    box-sizing: border-box;

    .video-tag-left {
      padding: 0 10px;

      ul {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16px;

        li {
          margin: 2px 0;
          padding: 5px 12px 4px 12px;
          margin-right: 8px;
          background: #ff9727;
          box-shadow: 0px 2px 3px 0px rgba(255, 151, 39, 0.5);
          border-radius: 16px;
          color: #fff;
          font-size: 12px;
        }
      }

      .detailInfoTitle {
        max-width: 700px;
        margin-left: 2px;
        padding: 2px 0 0 0;
        box-sizing: border-box;
      }
    }

    .video-tag-right {
      padding: 2px 10px 0 0;
      box-sizing: border-box;
      font-size: 12px;
      color: #999;

      i {
        margin: 0 5px 0 14px;
        font-size: 13px;
      }
    }
  }

  .video-info {
    width: 273px;
    box-sizing: border-box;
    margin-left: 6px;
    background: #fff;
    position: relative;

    // padding: 23px 25px 0 32px;
    .evaluation {
      width: 154px;
      height: 145px;
      position: absolute;
      right: -160px;
      top: 430px;
      // z-index: 1;
      cursor: pointer;
    }

    .tabs {
      display: flex;
      justify-content: space-around;
      width: 273px;
      height: 42px;
      line-height: 42px;
      border-bottom: 1px solid #eeeeee;
      background: #fff;
      position: absolute;
      z-index: 100;

      .tabItem {
        // width: 168px;
        height: 42px;
        font-size: 22px;
        color: #333333;
        cursor: pointer;

        span {
          font-size: 16px;
        }

        .tabItemActive {
          height: 40px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          display: inline-block;
          color: #035aff;
          border-bottom: 2px solid #035aff;
        }
      }
    }

    .item-info {
      width: 273px;
      height: 100%;
      box-sizing: border-box;
      padding: 60px 25px 0 32px;

      .title {
        font-size: 18px;
        color: #222;
        font-weight: bold;
        word-break: break-all;
        // -webkit-line-clamp:1;
					line-clamp:1;
      }

      .time {
        margin-top: 10px;
        color: #999;
        font-size: 12px;

        i {
          margin-right: 7px;
          font-size: 15px;
        }
      }

      .fileList {
        margin: 22px 0;

        li {
          transition: all 0.3s;
          margin: 3px 0;
          cursor: pointer;

          .ppt {
            color: rgb(235, 115, 76);
          }

          .pdf {
            color: rgb(255, 85, 98);
          }

          .word {
            color: rgb(47, 151, 254);
          }

          .jpg {
            color: rgb(209, 102, 61);
          }

          .png {
            color: rgb(60, 211, 199);
          }

          .xls {
            color: rgb(0, 182, 50);
          }

          .zip {
            color: rgb(249, 189, 15);
          }

          span {
            display: inline-block;
            color: #035aff;
            font-size: 12px;
            overflow: hidden;
            width: 188px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        li:hover {
          transform: translate(0px, -3px);

          span {
            color: #232325;
            font-size: 14px;
            font-weight: 600;
          }
        }
      }

      .downTips {
        font-size: 12px;
        color: #999;
      }

      .intro {
        word-break: break-all;
        margin-top: 22px;
        line-height: 18px;
        font-size: 12px;
        color: #999;

        span:first-child {
          color: #111;
        }
      }
    }

    .chat-window {
      position: relative;
      width: 273px;
      height: 100%;
      background: #fff;
      overflow: hidden;

      .chat-box {
        position: relative;
        width: 280px;
        height: 515px;
        padding: 40px 30px 15px 30px;
        overflow-y: auto;
        color: #333333;
        font-family: Microsoft YaHei;
        // border:1px solid #c9d8db;
        box-sizing: border-box;

        .message {
          margin: 24px 0;

          .message-author {
            line-height: 1;
            color: #999999;

            .avatar {
              width: 20px;
              height: 20px;
              margin-right: 9px;
              display: inline-block;
              // border: 1px #000 dashed;
              vertical-align: text-bottom;
            }

            .teacherMark {
              display: inline-block;
              border: 1px #409eff solid;
              border-radius: 4px;
              color: #409eff;
              font-size: 12px;
              position: relative;
              top: -1px;
            }
          }

          .a-message {
            min-width: 100px;
            // background: #ebeef5;
            padding: 1px;
            box-sizing: border-box;
            border-radius: 6px;
            margin: 5px;
            padding-left: 27px;
            word-wrap: break-word;
            vertical-align: text-bottom;
          }
        }
      }

      .send-btn {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 101;
        padding: 5px 10px;
      }

      .forbidden,
      .unLogin {
        width: 100%;
        height: 212px;
        text-align: center;
        position: absolute;
        bottom: 0;
        font-family: Microsoft YaHei;
        font-size: 14px;
        color: #999999;
      }

      .forbidden {
        z-index: 200;
        line-height: 248px;
        cursor: not-allowed;
      }

      .unLogin {
        z-index: 201;
        line-height: 288px;
      }

      .newTips {
        min-width: 130px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: rgba(44, 188, 240, 0.8);
        border-radius: 10px;
        font-size: 12px;
        color: #fff;
        position: absolute;
        left: 50%;
        top: 500px;
        transform: translate3d(-50%, -50%, 0);
        cursor: pointer;
      }

      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.5s;
      }

      .fade-enter,
			.fade-leave-to

			/* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
      }
    }
  }
}

.imgViewBox {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;

  .block {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: 900px;

    .imgView {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.other-video {
  width: 1200px;
  margin: 52px auto 0 auto;

  .other-title {
    font-size: 24px;
    color: #333333;
    font-family: Microsoft YaHei;
    font-weight: bold;
    position: relative;
    z-index: 1;
    margin-left: 20px;
  }

  .other-title::after {
    content: "";
    width: 39px;
    height: 39px;
    background: #c9dcff;
    border-radius: 50%;
    position: absolute;
    left: -20px;
    top: -6px;
    z-index: -1;
  }
}

</style>

<style lang="scss" type="text/scss" scoped>
.videoEnd {
  width: 927px;
  height: 647px;
  background: #000;

  p {
    color: white;
    text-align: center;
    line-height: 647px;
  }
}
</style>
<style lang="scss" type="text/scss" scoped>
.liveInteract {
  margin-top: 24px;

  // .el-dialog {
  //   background: #4f4f4fe8 !important;
  // }

  .el-carousel__container {
    height: 780px !important;
  }

  .el-carousel__item {
    display: flex !important;
  }

  .el-dialog--center {
    margin-top: 2vh !important;
  }

  .el-rate__text {
    color: #fa8c47 !important;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .bounce-enter-active {
    animation: bounce-in 0.8s;
  }

  .bounce-leave-active {
    animation: bounce-in 0.8s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.05);
    }

    100% {
      transform: scale(1);
    }
  }

  .evaluation-wrap {
    min-width: 500px;
    min-height: 600px;
    width: 70%;
    height: auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
    resize: both;
    // overflow:auto;
    position: absolute;
    top: 123px;
    left: 500px;
    z-index: 2000;

    .evaluation-wrap-top {
      width: 100%;
      height: 30px;
      padding: 16px 20px;
      box-sizing: border-box;

      i {
        float: right;
        cursor: pointer;
      }
    }

    .evaluation-title {
      width: 100%;
      height: 30px;
      text-align: center;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      span{
        position: absolute;
        cursor: pointer;
        // top: 35px;
        right: 60px;
        font-size: 16px;
        color: blueviolet;
      }
    }

    .evaluation-content {
      // table{
      //   border-collapse: collapse;
      //   tr{   
      //     height: 50px;
      //     line-height: 50px;
      //   }
      //   th{

      //   }
      //   td{
      //     // border: 1px solid;
      //   }
      // }
      // height: 700px;
      width: 100%;
      padding: 0 30px 30px 30px;
      box-sizing: border-box;

      .part-title {
        word-wrap: break-word;
        margin: 0 0 10px 0;
        font-size: 18px;
        color: #333333;
      }

      .part-one-itemwrap {
        height: 448px;
        box-sizing: border-box;
        overflow: auto;

        .one-item {
          margin-top: 15px;

          .one-item-title {
            display: flex;
            font-size: 15px;
            font-weight: bold;
            line-height: 22px;
            color: #333333;

            span:last-child {
              max-width: 690px;
            }
          }

          .score {
            margin: 10px 0 0 24px;
          }
        }
      }

      .evaluation-parttwo {
        .part-title {
          margin: 10px 0 0 0;
        }

        .evaluation-text {
          width: 100%;
          height: 86px;
          background: #FFFFFF;
          border: 1px solid #DBE2E7;
          opacity: 1;
          border-radius: 6px;
          margin: 10px 0 0 0;
          padding: 10px;
          box-sizing: border-box;
        }
      }

      .evaluation-bottom {
        padding: 10px 0px 0 0px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        .evaluation-btn {
          width: 169px;
          height: 55px;
          border: 1px solid#305BFF;
          opacity: 1;
          border-radius: 28px;
          margin: 0 26px;
          color: #305bff;
        }

        // .evaluation-btn:first-child {
        //   color: #fff;
        //   background: #305bff;
        // }
      }
    }
  }
}

 ::v-deep .w-e-text-container {
  border: none !important;
  width: 280px;
  height: 120px !important;
  z-index: 100 !important;
}

 ::v-deep .w-e-toolbar {
  border: none !important;
  width: 280px;
  background: #fbfbfb !important;
  border: 1px solid #f1f1f1 !important;
  z-index: 100 !important;
}

 ::v-deep .w-e-text {
  text-align: left;
  font-family: Microsoft YaHei;
  font-size: 14px;
  z-index: 100 !important;
  word-break: break-all;
  padding-bottom: 20px;
}

 ::v-deep .w-e-panel-container {
  width: 262px !important;
  top: -170px !important;
  left: 35% !important;
}

 ::v-deep .w-e-panel-tab-content {
  height: 100px !important;
}

.eleImg {
  vertical-align: text-bottom;
}
.totalNum{
  text-align: right;
  margin-right: 60px;
}

</style>
