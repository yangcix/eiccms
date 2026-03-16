<template>
  <div>
    <ul class="video-list">
      <li
        v-for="val in videoList"
        :key="val.id"
        class="video-item"
        @click="play(val)"
      >
        <div class="img-wrap">
          <img
            :src="val.imgUrl ? val.imgUrl : defaultImg"
            alt=""
            :onerror="defaultImg"
          />
          <!-- <img :src="val.imgUrl" alt="" :onerror="defaultImg"> -->
          <!-- <ul class="tag-list">
						<li v-for="item in val.labels" :key="item.id">{{item}}</li>
					</ul> -->
        </div>

        <div class="layout-items">
          <!-- <span class="classNo" v-if="val.isHabitus == 1">{{(val.themeStatus !== 1 && val.playStatus !== 1) || val.numCount == 0 ? '第'+ (val.numCount + 1) +'课' : '第'+ val.numCount +'课'}}</span> -->
          <span class="classNo" v-if="val.isHabitus == 1">{{
            "第" + val.numCount + "课"
          }}</span>
          <span
            class="name"
            :title="val.isHabitus == 1 ? val.habitusName : val.name"
            >{{ val.isHabitus == 1 ? val.habitusName : val.name }}</span
          >
        </div>

        <div class="layout-item">
          <span>开课时间:{{ val.startTime }}</span>
          <span></span>
          <span>{{ val.teacherName }}</span>
        </div>
        <div v-if="val.isHabitus == 1">
          <p class="video-status status1" v-if="val.playStatus == 0">
            <span class="playAnimation">
              <span class="animationli"></span>
              <span class="animationli"></span>
              <span class="animationli"></span>
              <span class="animationli"></span> </span
            >授课中
          </p>
          <p
            class="video-status status0"
            v-if="
              val.playStatus == 2 ||
              (val.playStatus == null && val.themeStatus == 0)
            "
          >
            <i class="el-icon-alarm-clock"></i>预告中
          </p>
          <p
            class="video-status status2"
            v-if="
              val.playStatus == 1 ||
              (val.playStatus == null && val.themeStatus == 1)
            "
          >
            <i class="el-icon-refresh-left"></i>已结束
          </p>
        </div>
        <div v-else>
          <p class="video-status status1" v-if="val.playStatus == 0">
            <span class="playAnimation">
              <span class="animationli"></span>
              <span class="animationli"></span>
              <span class="animationli"></span>
              <span class="animationli"></span> </span
            >授课中
          </p>
          <p class="video-status status0" v-if="val.playStatus == 2">
            <i class="el-icon-alarm-clock"></i>预告中
          </p>
          <p class="video-status status2" v-if="val.playStatus == 1">
            <i class="el-icon-refresh-left"></i>已结束
          </p>
        </div>
        <p v-if="val.isHabitus == 1" class="video-type">{{ "常态化" }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { timeDown } from "../../../assets/js/utils";
export default {
  props: ["videoList", "type"],
  name: "",
  data() {
    return {
      dataList: [],
      defaultImg: 'this.src="' + require("@/assets/imgs/live.png") + '"', // 默认图片
    };
  },
  computed: {},
  components: {},
  inject: ["openLoginShow"],
  mounted() {
    if (this.videoList.length) {
      this.videoList.forEach((v) => {
        v.labels = v.labels ? v.labels.slice(0, 3) : v.labels;
      });
    }
  },
  methods: {
    play(val) {
      let isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
      if (isChrome) {
        this.$axios.get("/index/getUserInfo").then((res) => {
          if (res.data) {
            let playUrl = "";
            let user = JSON.parse(localStorage.getItem("userInfo"));
            if (!user) {
              return this.openLoginShow();
            }
            if (val.playStatus == 1) {
              this.$router.push({
                path: val.isHabitus == 1 ? "/normalInteractlogin" : '/interactlogin',
                query: val.isHabitus == 1 ? { themeid: val.habitusId, id: val.id } : { id: val.id },
              });
              return;
            }
            // window.scrollTo(0, 0);
            // debugger
            this.$axios
              .get("/sm/interactive/info", { id: val.id })
              .then((res) => {
                let type; // 0主讲 1副讲 2旁听
                let isassis = res.data.assistantLists.find((el) => {
                  return el.userId == user.userId;
                });
                if (res.data.masterLists[0].userId == user.userId) {
                  type = 0;
                } else if (isassis) {
                  type = 1;
                } else {
                  type = 2;
                }
                if (val.isHabitus == 1) {
                  if (type == 0) {
                    playUrl = window.origin + `/mainroom?id=${val.id}`;
                    this.$router.push({
                      path: "/normalmainroom",
                      query: { themeid: val.habitusId, id: val.id },
                    });
                    // window.open(playUrl,'target');
                  } else if (type == 1) {
                    // playUrl = window.origin + `/assistantroom?id=${val.id}`
                    this.$router.push({
                      path: "/normalassistantroom",
                      query: { themeid: val.habitusId, id: val.id },
                    });
                  } else {
                    // playUrl = window.origin + `/assistantroom?id=${val.id}&isBystanderIn=1`
                    this.$router.push({
                      path: "/normalInteractlogin",
                      query: {
                        themeid: val.habitusId,
                        id: val.id,
                        isBystanderIn: 1,
                      },
                    });
                  }
                } else {
                  if (type == 0) {
                    playUrl = window.origin + `/mainroom?id=${val.id}`;
                    this.$router.push({
                      path: "/mainroom",
                      query: { id: val.id },
                    });
                    // window.open(playUrl,'target');
                  } else if (type == 1) {
                    // playUrl = window.origin + `/assistantroom?id=${val.id}`
                    this.$router.push({
                      path: "/assistantroom",
                      query: { id: val.id },
                    });
                  } else {
                    // playUrl = window.origin + `/assistantroom?id=${val.id}&isBystanderIn=1`
                    this.$router.push({
                      path: "/interactlogin",
                      query: { id: val.id, isBystanderIn: 1 },
                    });
                  }
                }
              });
          } else {
            localStorage.removeItem('userInfo')
            this.openLoginShow();
          }
        });
      } else {
        this.$alert("当前不是Chrome内核浏览器,请更换为chrome浏览器", "警告！", {
          type: "warning",
        });
        return;
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.playAnimation {
  display: inline-block;
  width: 24px;
  height: 20px;
  vertical-align: bottom;
  margin-right: 4px;
  .animationli {
    display: inline-block;
    width: 4px;
    height: 0px;
    background: #fff;
    margin-right: 2px;
    vertical-align: baseline;
    border-radius: 2px 2px 0 0;
  }
  .animationli:first-child {
    animation: mymove 0.9s infinite;
    -webkit-animation: mymove 0.9s infinite;
  }
  .animationli:nth-child(2) {
    animation: mymove 1.6s infinite;
    -webkit-animation: mymove 1.6s infinite;
  }
  .animationli:nth-child(3) {
    animation: mymove 1.3s infinite;
    -webkit-animation: mymove 1.3s infinite;
  }
  .animationli:nth-child(4) {
    animation: mymove 0.8s infinite;
    -webkit-animation: mymove 0.8s infinite;
  }
  @keyframes mymove {
    0% {
      height: 6px;
    }
    35% {
      height: 13px;
    }
    45% {
      height: 14px;
    }
    55% {
      height: 15px;
    }
    65% {
      height: 11px;
    }
    75% {
      height: 10px;
    }
    85% {
      height: 8px;
    }
    100% {
      height: 4px;
    }
  }

  @-webkit-keyframes mymove /* Safari and Chrome */ {
    0% {
      height: 6px;
    }
    35% {
      height: 13px;
    }
    45% {
      height: 14px;
    }
    55% {
      height: 15px;
    }
    65% {
      height: 11px;
    }
    75% {
      height: 10px;
    }
    85% {
      height: 8px;
    }
    100% {
      height: 4px;
    }
  }
}
.video-list {
  display: flex;
  flex-wrap: wrap;
  width: 1200px;
  margin: 20px auto;
  .video-item {
    overflow: hidden;
    position: relative;
    width: 280px;
    height: 250px;
    margin: 20px 0 0 26px;
    box-sizing: border-box;
    background: #fff;
    color: #999;
    border-radius: 8px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
    transition: all 0.1s;
    // box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
    cursor: pointer;
    .img-wrap {
      overflow: hidden;
      width: 100%;
      height: 161px;
      border-radius: 8px;
      // transform: scale(0.95);
      transition: all 0.2s;
      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        transition: all 0.3s;
      }
    }
    .tag-list {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      flex-wrap: wrap; // 换行
      li {
        min-width: 36px;
        height: 14px;
        margin-bottom: 5px;
        margin-right: 6px;
        padding: 5px 8px;
        border-radius: 8px 0px 8px 0px;
        box-shadow: 0px 2px 3px 0px rgba(255, 151, 39, 0.5);
        text-align: center;
        font-size: 12px;
        background: linear-gradient(88deg, #f8be56 0%, #fa8846 100%);
        color: #fff;
      }
    }
    .layout-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      border-bottom: solid 1px #f1f2f4;
      height: 45px;
      font-size: 12px;
      padding: 0 10px;
      .name {
        margin-left: 4px;
        overflow: hidden;
        // max-width: 190px;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }
      i {
        margin-right: 5px;
        font-size: 14px;
        vertical-align: top;
      }
    }
    .layout-items {
      display: flex;
      // justify-content: center;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      border-bottom: solid 1px #f1f2f4;
      height: 45px;
      font-size: 12px;
      padding: 0 10px;
      .name {
        margin-left: 4px;
        overflow: hidden;
        // max-width: 190px;
        white-space: nowrap;
        line-height: 18px;
        text-overflow: ellipsis;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }
      i {
        margin-right: 5px;
        font-size: 14px;
        vertical-align: top;
      }
    }
    .video-btn {
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background: #035aff;
    }
    .video-type {
      padding: 2px 4px;
      background: #474d5b;
      text-align: center;
      font-size: 12px;
      position: absolute;
      top: 0;
      left: 84px;
      line-height: 19px;
      font-style: normal;
      font-weight: 400;
      color: #ffffff;
    }
    .video-status {
      position: absolute;
      top: 0;
      left: 0;
      width: 84px;
      line-height: 23px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      border-radius: 5px 0 0 0;
      i {
        margin-right: 2px;
        font-size: 16px;
        vertical-align: middle;
      }
    }
    .status0 {
      background: rgb(255, 65, 123);
    }
    .status1 {
      background: rgb(48, 96, 246);
    }
    .status2 {
      background: rgb(110, 123, 136);
    }
    .time {
      position: absolute;
      right: 8px;
      bottom: 96px;
      padding: 3px 6px;
      border-radius: 10px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
    }
  }
  li:nth-child(4n + 1) {
    margin-left: 0;
  }
  li:hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
    transform: translateY(-5px) scale(1.06);
  }
  li:hover .video-status {
    // width: 248px;
  }
  li:hover img {
    transform: scale(1.12);
  }
  li:hover .img-wrap {
    transform: scale(0.95);
    // box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
  }
  li:hover .video-btn {
    display: block;
  }
}
.classNo {
  display: inline-block;
  padding: 2px 0;
  text-align: center;
  min-width: 42px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  background: #474d5b;
  color: #fff;
  border-radius: 0px 6px 6px 6px;
  word-wrap: break-word;
  white-space: normal;
}
</style>
