<template>
  <div class="home">
    <Head></Head>
    <Foot :index="0"></Foot>
    <!-- <div class="nav-wrap">
			<ul class="nav-list">
				<li :class="activeIndex == 1000 ? 'active' : ''" @click="changeType(1000)">全部</li>
				<li v-for="(val, index) in labelList" @click="changeType(index)"
				    :class="activeIndex == index ? 'active' : ''">{{val.name}}</li>
			</ul>
		</div> -->
    <!-- <van-search
      v-model="searchValue"
      shape="round"
      @focus="goSearch"
      placeholder="请输入搜索关键词"
    /> -->
    <van-swipe class="my-swiper" :autoplay="5000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in bannerList" :key="index" @click="goDetail(item)">
        <a :href="item.url ? item.url : 'javascript:void(0)'" style="display: block;">
					<img :src="item.imgUrl" alt="">
				</a></van-swipe-item>
    </van-swipe>
    <div class="my-title">
      <span>名师资源</span>
      <!-- <div v-if="teacherList.length > 0" class="my-title-right" @click="goTeacherclass">
        <span>查看全部</span>
        <van-icon name="play" color="#3060F6" size="0.3125em" />
      </div> -->
    </div>
    <van-swipe class="my-swipers" :autoplay="5000" :show-indicators="false">
      <van-swipe-item v-for="(item, index) in teacherList" :key="index">
        <ul class="video-box">
          <li
            v-for="items in item"
            :key="items.id"
            class="video-item"
            @click="goTeacherclass(items)"
          >
            <img
              :src="items.avatar == null ? img : items.avatar"
              alt=""
              class="one-img"
            />
            <p class="video-school" :title="items.deptName">
              {{ items.deptName }}
            </p>
            <div class="video-name">
              <span>{{ items.subjectName }}</span>
              <span>{{ items.nickName }}</span>
            </div>
          </li>
        </ul>
      </van-swipe-item>
    </van-swipe>
    <!-- <div class="my-title">
      <span
        >实时研修
        <span style="margin-left: 5px; color: #ff457e"
          >/Live</span>
        </span
      >
      <div class="my-title-right" v-show="liveList.length == 4" @click="goTraining">
        <span>查看全部</span>
        <van-icon name="play" color="#3060F6" size="0.3125em" />
      </div>
    </div> -->
    <!-- <div v-if="liveList.length > 0" class="live-list">
      <div
        v-for="(item, index) in liveList"
        :key="index"
        class="live-list-item"
        @click="goLiveDetail(item)"
      >
        <div class="item-left">
          <p>{{ item.name }}</p>
          <div class="left-footer">
            <span>{{ item.nickName }}</span>
            <div class="left-right">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.49983 12C4.60846 12 2.15685 10.1118 1.31322 7.5001C2.15679 4.88834 4.60845 3 7.49989 3C10.3913 3 12.8429 4.88824 13.6865 7.4999C12.8429 10.1117 10.3913 12 7.49983 12ZM7.49989 2C4.10159 2 1.23239 4.25976 0.310511 7.35749L0.268066 7.50011L0.310516 7.64274C1.23246 10.7404 4.10161 13 7.49983 13C10.8981 13 13.7673 10.7402 14.6892 7.64251L14.7317 7.49989L14.6892 7.35726C13.7673 4.25965 10.8981 2 7.49989 2ZM7.49977 4.5C5.84292 4.5 4.49977 5.84315 4.49977 7.5C4.49977 9.15685 5.84292 10.5 7.49977 10.5C9.15663 10.5 10.4998 9.15685 10.4998 7.5C10.4998 5.84315 9.15663 4.5 7.49977 4.5ZM5.49977 7.5C5.49977 6.39543 6.3952 5.5 7.49977 5.5C8.60434 5.5 9.49977 6.39543 9.49977 7.5C9.49977 8.60457 8.60434 9.5 7.49977 9.5C6.3952 9.5 5.49977 8.60457 5.49977 7.5Z"
                  fill="#687583"
                />
              </svg>
              <span>{{ item.viewed }}</span>
            </div>
          </div>
        </div>
        <div class="item-right">
          <p class="video-status" v-if="item.themeStatus == 1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1.5" width="2" height="11" rx="1" fill="white" />
              <rect x="6" y="4.5" width="2" height="5" rx="1" fill="white" />
              <rect x="11" y="2.5" width="2" height="9" rx="1" fill="white" />
            </svg>
            <span style="margin-left: 4px">授课中</span>
          </p>
          <p class="video-status status1" v-if="item.themeStatus == 2">
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_106_57274)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.7135 3.66901C12.9335 5.88898 12.9272 9.49223 10.7015 11.718C8.47604 13.9435 4.87246 13.95 2.65249 11.73C0.432553 9.51009 0.439092 5.9065 2.66454 3.68106C4.8903 1.45529 8.49358 1.44908 10.7135 3.66901ZM9.69154 10.7081C11.3593 9.04029 11.3629 6.34208 9.70166 4.68086C8.04047 3.01967 5.34223 3.02323 3.67447 4.69099C2.00734 6.35812 2.00348 9.05666 3.66467 10.7178C5.32589 12.3791 8.02441 12.3752 9.69154 10.7081ZM9.10445 5.59549C9.38374 5.87477 9.38215 6.32745 9.10319 6.60641L6.91523 8.79437C6.63613 9.07347 6.18376 9.07443 5.90464 8.7953L4.32951 7.22017C4.05041 6.94107 4.05138 6.48872 4.33048 6.20962C4.60942 5.93068 5.0621 5.92907 5.34136 6.20832L6.41136 7.27833L8.09324 5.59646C8.37227 5.31742 8.82495 5.31599 9.10445 5.59549Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_106_57274">
                  <rect
                    width="14"
                    height="14"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <span style="margin-left: 4px">已经结束</span>
          </p>
          <p class="video-status status2" v-if="item.themeStatus == 0">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.683 0.5C2.54349 0.5 1.13845e-05 3.05229 0 6.2C0 9.34725 2.54349 11.9 5.683 11.9C8.82247 11.9 11.366 9.34725 11.366 6.2C11.366 3.05229 8.82246 0.5 5.683 0.5ZM1.42829 6.2C1.42829 3.84142 3.33368 1.93097 5.683 1.93097C8.03228 1.93097 9.9377 3.84143 9.9377 6.2C9.9377 8.55768 8.03228 10.4686 5.683 10.4686C3.33368 10.4686 1.42829 8.55768 1.42829 6.2ZM5.45855 3C5.06358 3 4.74461 3.32121 4.74461 3.71572V6.80996C4.74461 7.20468 5.06381 7.52522 5.45855 7.52522H7.68612C8.08083 7.52522 8.4 7.20467 8.4 6.80996C8.4 6.41549 8.08105 6.09425 7.68612 6.09425H6.1729V3.71572C6.1729 3.3211 5.85383 3 5.45855 3Z"
                fill="white"
              />
            </svg>
            <span style="margin-left: 4px">即将开始</span>
          </p>
          <img :src="item.imgUrl" alt="" :onerror="img"/>
        </div>
      </div>
    </div>
    <div class="null-data" v-else>
      <img src="../../assets/imgs/home-null.png" alt="" />
      <p>暂无实时研修内容，您可以观看其他节目！</p>
    </div> -->
    <!-- <div v-if="version !== 1" class="my-title">
      <span
        >专递课堂<span style="margin-left: 5px; color: #ff457e"
          >/Live</span
        ></span
      >
      <div class="my-title-right" v-show="classList.length == 4" @click="goClass">
        <span>查看全部</span>
        <van-icon name="play" color="#3060F6" size="0.3125em" />
      </div>
    </div> -->
    
    <!-- <div class="null-data" v-else>
      <img src="../../assets/imgs/home-null.png" alt="" />
      <p>暂无内容，您可以观看其他节目！</p>
    </div> -->
    <div class="my-title">
      <span>优质资源</span>
      <div class="my-title-right" v-show="videoList.length == 4" @click="goResources">
        <span>查看全部</span>
        <van-icon name="play" color="#3060F6" size="0.3125em" />
      </div>
    </div>
    <div v-if="version !== 1"><div v-if="videoList.length > 0" class="live-list">
      <div
        v-for="(item, index) in videoList"
        :key="index"
        class="live-list-item"
        @click="goResourcesDetail(item)"
      >
        <div class="item-left">
          <p>{{ item.name }}</p>
          <div class="left-footer">
            <span>{{ item.founder }}</span>
            <div class="left-right">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.49983 12C4.60846 12 2.15685 10.1118 1.31322 7.5001C2.15679 4.88834 4.60845 3 7.49989 3C10.3913 3 12.8429 4.88824 13.6865 7.4999C12.8429 10.1117 10.3913 12 7.49983 12ZM7.49989 2C4.10159 2 1.23239 4.25976 0.310511 7.35749L0.268066 7.50011L0.310516 7.64274C1.23246 10.7404 4.10161 13 7.49983 13C10.8981 13 13.7673 10.7402 14.6892 7.64251L14.7317 7.49989L14.6892 7.35726C13.7673 4.25965 10.8981 2 7.49989 2ZM7.49977 4.5C5.84292 4.5 4.49977 5.84315 4.49977 7.5C4.49977 9.15685 5.84292 10.5 7.49977 10.5C9.15663 10.5 10.4998 9.15685 10.4998 7.5C10.4998 5.84315 9.15663 4.5 7.49977 4.5ZM5.49977 7.5C5.49977 6.39543 6.3952 5.5 7.49977 5.5C8.60434 5.5 9.49977 6.39543 9.49977 7.5C9.49977 8.60457 8.60434 9.5 7.49977 9.5C6.3952 9.5 5.49977 8.60457 5.49977 7.5Z"
                  fill="#687583"
                />
              </svg>
              <span>{{ item.viewed }}</span>
            </div>
          </div>
        </div>
        <div class="item-right">
          <img :src="item.imgUrl" alt="" :onerror="img"/>
        </div>
      </div>
    </div>
    <div class="null-data" v-else>
      <img src="../../assets/imgs/home-null.png" alt="" />
      <p>暂无内容，您可以观看其他节目！</p>
    </div></div>
    
    <div class="my-title">
      <span>课后服务</span>
    </div>
    <div class="footer-banner">
      <img @click="goAfterClass(1)" :src="banner1" alt="" />
      <img @click="goAfterClass(2)" :src="banner2" alt="" />
    </div>
    <div class="my-title">
      <span>停课不停学</span>
      <!-- <div v-if="schoolList.length > 0" class="my-title-right" @click="goNoSuspension">
        <span>查看全部</span>
        <van-icon name="play" color="#3060F6" size="0.3125em" />
      </div> -->
    </div>
    <van-swipe class="my-swipers" :autoplay="5000" :show-indicators="false">
      <van-swipe-item v-for="(item, index) in schoolList" :key="index">
        <ul class="video-box">
          <li
            v-for="items in item"
            :key="items.id"
            class="video-item"
            @click="goNoSuspension(items)"
          >
            <img
              :src="items.avatar == null ? imgs : items.avatar"
              alt=""
              class="one-img"
            />
            <p class="video-school" :title="items.name">
              {{ items.name }}
            </p>
          </li>
        </ul>
      </van-swipe-item>
    </van-swipe>
    <div class="footer-box">
      <div class="company-technology">
        <p>运维单位：{{ systemInfo.company }}</p>
        <p style="margin-top: 5px">
          <span><a :href="systemInfo.icpRecordUrl !== null ? systemInfo.icpRecordUrl : 'javascript:void(0)'">{{systemInfo.icpRecord}}</a></span>
          <span style="margin-left: 10px"><a :href="systemInfo.recordUrl !== null ? systemInfo.recordUrl : 'javascript:void(0)'">{{systemInfo.record}}</a></span>
        </p>
      </div>
    </div>
    <!-- <div class="mobile-pad">
			<ScrollDownUp @loadMore="loadMore">
				<VideoList :videoList="videoList" type="0"></VideoList>
				<div class="null-data" v-if="!videoList.length">
					<img src="../../assets/imgs/home-null.png" alt="">
					<p>暂无内容，您可以观看其他节目！</p>
				</div>
				<p class="last" v-if="pageNum == pages && videoList.length">已经到底了~</p>
			</ScrollDownUp>
		</div> -->
  </div>
</template>

<script>
import imgs from "@/assets/imgs/school.png";
import img from "@/assets/imgs/teacher.png";
import banner from "@/assets/imgs/bannerh5.png";
import banner1 from "@/assets/imgs/bannerh51.png";
import banner2 from "@/assets/imgs/bannerh52.png";
import Foot from "./Foot";
import Head from "./Head";
import VideoList from "./VideoList";
import ScrollDownUp from "@/components/ScrollDownUp";
export default {
  name: "",
  data() {
    return {
      banner1: banner1,
      banner2: banner2,
      img: img,
      imgs: imgs,
      schoolList: [],
      teacherList: [],
      liveList: [],
      classList: [],
      videoList: [],
			systemInfo: {},
      searchValue: "",
      bannerList: [],
      labelList: [],
      activeIndex: 1000, //初始值1000，分类列表
      labelId: [],
      pageNum: 1,
      pages: 0,
      version: localStorage.getItem('version')
    };
  },
  components: { Foot, Head, VideoList, ScrollDownUp },
  mounted() {
    this.getSwiperList();
    this.getLabelList();
    this.getLiveList();
    this.getClassList();
    this.getVideoList();
    this.getTeachersList();
    this.getSchoolList();
    this.getSystemInfo();
  },
  methods: {
    getSwiperList(){
				this.$axios.get('/index/getAdByLocation', {location: 1}).then(res => {
					if(res.data.length > 0){
						let arr = res.data
						arr.forEach(ele => {
							if(ele.url && ele.url.slice(0, 7) !== 'http://' && ele.url.slice(0, 8) !== 'https://') {
								ele.url = 'http://' + ele.url
							}
						});
						this.bannerList = arr;
					}else{
            this.bannerList = [{
              imgUrl: banner,
            }]
          }
				});
			},
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    goSearch() {
      this.$router.push('/mobile/search');
    },
    goTeacherclass(val) {
      if(val){
        this.$router.push({path: '/mobile/Teacherclass', query: { id: val.id }});
      }else{
        this.$router.push('/mobile/Teacherclass');
      }
    },
    goTraining() {
      this.$router.push('/mobile/training');
    },
    goResources() {
      this.$router.push('/mobile/resources');
    },
    goClass() {
      this.$router.push('/mobile/courierClass');
    },
    goLiveDetail(val) {
      if(val.themeStatus == 2){
        this.$router.push({path: 'pplay', query: {themeid: val.id, type: 0}});
      }else{
        this.$router.push({path: 'hplay', query: {themeid: val.id, type: 0}});
      }
    },
    goResourcesDetail(val) {
      this.$router.push({path: 'vplay', query: {themeid: val.id, type: 2}});
    },
    goClassDetail(val) {
      if(val.playStatus == 0) {
        this.$message('请使用电脑或客户端观看！','warning')
      }
    },
    goAfterClass(val) {
      this.$router.push({path: '/mobile/afterClass', query: { type: val }});
    },
    goNoSuspension(val) {
      if(val){
        this.$router.push({path: '/mobile/noSuspension', query: { id: val.orgId }});
      }else{
        this.$router.push('/mobile/noSuspension');
      }
    },
    goDetail(val) {
      
    },
    //获取基本信息
    getSystemInfo() {
      this.$axios.get("index/info").then((res) => {
        this.systemInfo = res.data.resData;
        if(this.systemInfo.icpRecordUrl && this.systemInfo.icpRecordUrl.slice(0, 7) !== 'http://' && this.systemInfo.icpRecordUrl.slice(0, 8) !== 'https://') {
          this.systemInfo.icpRecordUrl = 'http://' + this.systemInfo.icpRecordUrl;
        }
        if(this.systemInfo.recordUrl && this.systemInfo.recordUrl.slice(0, 7) !== 'http://' && this.systemInfo.recordUrl.slice(0, 8) !== 'https://') {
          this.systemInfo.recordUrl = 'http://' + this.systemInfo.recordUrl;
        }
        window.localStorage.setItem("uiType", res.data.resData.uiType);
      });
    },
    //获取名师资源
    getTeachersList() {
      this.$axios.get("/index/getFamousTeacher").then((res) => {
        this.teacherList = this.group(res.data, 2);
      });
    },
    //获取实时研修
    getLiveList() {
      this.$axios
        .post("/index/getLiveOrRecordVideo", {
          pageNum: 1,
          pageSize: 4,
          categoryId: 1,
        })
        .then((res) => {
          this.liveList = res.data.pageList;
        });
    },
    //获取专递课堂
    getClassList() {
      this.$axios
        .get("/index/list", {
          habitusStatus: 1,
          pageNum: 1,
          pageSize: 4,
          // categoryId: 1
        })
        .then((res) => {
          this.classList = res.data.pageList;
        });
    },
    //获取优质资源
    getVideoList() {
      this.$axios
        .post("/index/getVideo", {
          pageNum: 1,
          pageSize: 4,
          categoryId: 4,
        })
        .then((res) => {
          this.videoList = res.data.pageList;
        });
    },
    //获取学校列表
    getSchoolList() {
      this.$axios.get("/index/getSchool").then((res) => {
        this.schoolList = this.group(res.data, 2);
      });
    },
    //获取标签
    getLabelList() {
      // this.$axios.get('/index/getLabelInfo').then(res => {
      // 	this.labelList = creatTree(res.data);
      // });
      this.$axios.get("/index/getAllCategory").then((res) => {
        this.labelList = res.data.categoryList;
      });
    },
    changeType(index) {
      this.videoList = [];
      this.activeIndex = index;
      let labelIds = [];
      if (index != 1000) {
        labelIds.push(this.labelList[index].id);
      }
      this.labelId = labelIds;
      this.pageNum = 1;
    },
    //加载更多
    loadMore() {
      if (this.pages == this.pageNum) {
        return;
      }
      this.pageNum++;
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
  .home{
    background: #ffffff;
  }
.mobile-pad {
  width: 100%;
  box-sizing: border-box;
  padding: 0 pvh(24);
}
.nav-wrap {
  overflow: hidden;
  height: pvw(80);
  background: #fff;
}
.nav-list {
  overflow-y: scroll;
  width: 100%;
  height: pvw(100);
  white-space: nowrap;
  li {
    display: inline-block;
    margin-left: pvw(70);
    line-height: pvw(80);
    font-size: fs(13);
    color: #656565;
    &.active {
      font-weight: bold;
      color: #409eff;
    }
  }
}
.last {
  text-align: center;
  margin-top: pvh(20);
  font-size: fs(9);
  color: #656565;
}
.null-data {
  // margin-top: pvh(300);
  text-align: center;
  font-size: fs(7);
  color: #999;
  img {
    width: 75%;
    margin-bottom: pvh(17);
  }
}
.my-swiper {
  margin: 10px 0;
  text-align: center;
  img {
    width: 22.1875em;
    height: 8.125em;
    border-radius: 0.3125em;
  }
}
.my-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin: 20px 0;
  font-weight: 600;
  font-size: 20px;
}
.my-title-right {
  display: flex;
  align-items: center;
  span {
    font-weight: 400;
    font-size: 14px;
    color: #3060f6;
  }
}
.video-box {
  // padding: 0 1px;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 0 12px;
}
.video-box .video-item:first-child {
  margin-left: 0px !important;
}
.video-item {
  margin-left: 20px;
  padding-bottom: 10px;
  overflow: hidden;
  position: relative;
  width: 47%;
  // height: 180px;
  // padding: 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #fff;
  color: #999;
  border-radius: 8px;
  -webkit-transition: all 0.1s;
  transition: all 0.2s;
  cursor: pointer;
  img {
    border-radius: 8px;
    width: 100%;
    height: 100px;
  }
  .video-school {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 10px;
    padding: 0 10px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #2f3742;
  }
  .video-name {
    margin-top: 10px;
    span {
      width: 32px;
      height: 20px;
      padding: 5px;
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .video-name span:first-child {
    background: #474d5b;
    color: #fff;
    border-radius: 0px 6px 6px 6px;
  }
}
.numCount{
  margin-right: 5px;
  font-size: 12px;
  padding: 3px 5px;
  background: #474d5b;
  color: #fff;
  border-radius: 0px 6px 6px 6px;
}
.live-list {
  padding: 0 12px;
  .live-list-item {
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    .item-left {
      width: 12em;
      height: 5.1875em;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .left-right {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .left-footer {
        font-weight: 400;
        font-size: 13px;
        color: #687583;
        padding-bottom: 10px;
        line-height: 19px;
        display: flex;
        justify-content: space-between;
        svg {
          margin-right: 5px;
        }
      }
    }
    p{
      line-height: 20px;
    }
    .item-left p:first-child {
      overflow: hidden;
      /*  超出的文本隐藏 */

      display: -webkit-box;
      /* 将对象作为弹性伸缩盒子模型显示。 */

      -webkit-line-clamp: 2;
      /* 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。 */

      -webkit-box-orient: vertical;
      /* 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式） */
    }
    .item-right {
      position: relative;
      img {
        width: 9.5em;
        height: 5.3125em;
        border-radius: 8px;
      }
    }
  }
}
.video-status {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 20px;
  font-size: 12px;
  color: #fff;
  background: #3060f6;
  border-radius: 8px 0 0 0;
  &.advance {
    background: rgba(0, 0, 0, 0.2);
  }
  i {
    font-size: fs(11);
    margin-right: pvh(2);
  }
}
.video-type{
  background: #474D5B;
  text-align: center;
  font-size: 12px;
  height: 20px;
  padding: 0 2px;
  position: absolute;
  top: 0;
  left: 74px;
  line-height: 19px;
  font-style: normal;
  font-weight: 400;
  border-radius: 0 0 8px 0;
  color: #FFFFFF;
}
.status1 {
  background: #687583;
}
.status2 {
  background: #ff3271;
}
.footer-banner {
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  img {
    width: 48.4%;
    // height: 80px;
    border-radius: 8px;
  }
}
.footer-box {
  height: 69px;
  background: #2f3742;
  font-weight: 400;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  text-align: center;
  a {
    text-decoration: none;
    color: #ffffff;
  }
}
</style>
