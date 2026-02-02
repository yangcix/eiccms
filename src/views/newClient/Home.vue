<template>
  <div style="margin-top: 40px">
    <div class="result-box">
      <p class="item-title">
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.0001 21.5V20H11.5001V21.5H7.0001ZM17.5001 8.75003C17.5001 10 17.2384 11.1758 16.7149 12.2773C16.1914 13.3788 15.4531 14.3203 14.5001 15.1018C14.0471 15.4768 13.6839 15.9183 13.4104 16.4263C13.1369 16.9343 13.0001 17.485 13.0001 18.0785V18.5008H5.5001V18.1723C5.5001 17.5943 5.38685 17.0473 5.16035 16.5313C4.93385 16.0153 4.60185 15.5855 4.16435 15.242C2.92985 14.2575 2.0471 13.0505 1.5161 11.621C0.985103 10.1915 0.860103 8.70328 1.1411 7.15628C1.4691 5.53128 2.1996 4.13678 3.3326 2.97278C4.4656 1.80878 5.8446 1.04703 7.4696 0.687526C8.7041 0.422026 9.92285 0.429776 11.1259 0.710776C12.3289 0.991776 13.4226 1.53078 14.4071 2.32778C15.3916 3.12478 16.1534 4.07803 16.6924 5.18753C17.2314 6.29703 17.5009 7.48453 17.5009 8.75003H17.5001ZM4.7501 9.50003C4.7656 7.92203 5.17585 6.66028 5.98085 5.71478C6.78585 4.76928 7.8756 4.28103 9.2501 4.25003V2.75003C7.4221 2.79703 5.97285 3.44153 4.90235 4.68353C3.83185 5.92553 3.2811 7.53103 3.2501 9.50003H4.7501Z"
            fill="#FF3271"
          />
        </svg>
        <span style="margin-left: 7px">成果展示</span>
      </p>
      <p class="item-content">
        <span class="item-content-title">开课总数</span>
        <span class="item-content-total">{{allData.platform && allData.platform.countnum ? allData.platform.countnum : 0}}<em>课</em></span>
      </p>
      <p class="item-content">
        <span class="item-content-title">平台视频资源</span>
        <span class="item-content-total">{{allData.platform && allData.platform.videos ? allData.platform.videos : '0'}}<em>个</em></span>
      </p>
      <p class="item-content">
        <span class="item-content-title">覆盖教师</span>
        <span class="item-content-total">{{allData.platform && allData.platform.teachernum ? allData.platform.teachernum : '0'}}<em>人</em></span>
      </p>
      <p class="item-content">
        <span class="item-content-title">覆盖学生</span>
        <span class="item-content-total">{{allData.platform && allData.platform.studentnum ? allData.platform.studentnum : '0'}}<em>人</em></span>
      </p>
      <p class="item-content">
        <span class="item-content-title">学习次数</span>
        <span class="item-content-total">{{allData.platform && allData.platform.videonum ? allData.platform.videonum : '0'}}<em>次</em></span>
      </p>
      <p class="item-content">
        <span class="item-content-title">浏览次数</span>
        <span class="item-content-total">{{allData.platform && allData.platform.pagenum ? allData.platform.pagenum : '0'}}<em>次</em></span>
      </p>
    </div>
    <Swiper location="0"></Swiper>
    <div class="video-catalog special">
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 5px">名师资源</span></span
        >
      </p>
      <div class="null-data" v-if="teacherList.length == 0">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无名师！</p>
			</div>
      <ul v-else-if="teacherList.length == 1" class="video-box">
        <li v-for="items in teacherList[0]" :key="items.id" class="video-item" @click="goDetail(items)">
          <img :src="items.avatar == null ? img : items.avatar" alt="" class="one-img" />
          <p class="video-school" :title="items.deptName">
            {{ items.deptName }}
          </p>
          <div class="video-name">
            <span>{{ items.subjectName }}</span>
            <span>{{ items.nickName }}</span>
          </div>
        </li>
      </ul>
      <el-carousel v-else height="250px" :interval="5000" arrow="never">
        <el-carousel-item v-for="item in teacherList" :key="item.id">
          <ul class="video-box">
            <li v-for="items in item" :key="items.id" class="video-item" @click="goDetail(items)">
              <img :src="items.avatar == null ? img : items.avatar" alt="" class="one-img" />
              <p class="video-school" :title="items.deptName">
                {{ items.deptName }}
              </p>
              <div class="video-name">
                <span>{{ items.subjectName }}</span>
                <span>{{ items.nickName }}</span>
              </div>
            </li>
          </ul>
        </el-carousel-item>
      </el-carousel>
      <!-- <div class="null-data" v-if="!hotList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
			 --></div>
    <div class="video-catalog special">
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 7px">智能研修</span></span
        >
        <!-- v-if="isTrainList" -->
        <router-link v-if="isTrainList > 4" to="/training" class="more mores"
          >查看全部
          <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
            src="@/assets/imgs/arrow-r.png"
            alt=""
            class="moreImg"
        /></router-link>
      </p>
      <div class="null-data" v-if="isTrainList == 0">
        <img src="../../assets/imgs/home-null.png" alt="" />
        <p>暂无内容，您可以观看其他节目！</p>
      </div>
      <div class="classList">
				<div class="item" v-for="(val, index) in trainList" :key="index" @click="goTrainDetail(val)">
					<div class="img-wrap">
          <img :src="val.coverUrl ? val.coverUrl : defaultImg" alt="" :onerror="defaultImg">
				</div>
				<div class="right">
					<p class="title" :title="val.name">{{ val.name }}</p>
					<div class="content">
						<span :title="val.teacherName" style="width: 42%;font-size: 14px;text-overflow: ellipsis;line-clamp: 1;overflow: hidden;white-space: nowrap;">授课老师：{{ val.teacherName }}</span>
						<span style="width: 58%;font-size: 14px;text-overflow: ellipsis;line-clamp: 1;overflow: hidden;white-space: nowrap;">科目：{{ val.subjectName }}</span>
						<span :title="val.evaluationOrgName" style="width: 42%;margin-bottom: 10px;font-size: 14px;text-overflow: ellipsis;line-clamp: 1;overflow: hidden;white-space: nowrap;">所属学校：{{ val.evaluationOrgName }}</span>
						<span style="width: 58%;margin-bottom: 10px;font-size: 14px;text-overflow: ellipsis;line-clamp: 1;overflow: hidden;white-space: nowrap;">开始时间：{{ val.startTime }}</span>
					</div>
				</div>
				<p class="video-status status1" v-if="val.status == 4">
					<span class="playAnimation">
						<span class="animationli"></span>
						<span class="animationli"></span>
						<span class="animationli"></span>
						<span class="animationli"></span>
					</span>正在评课
				</p>
				<p class="video-status status0" v-if="val.status == 3"><i class="el-icon-alarm-clock"></i>即将开始</p>
				<p class="video-status status2" v-if="val.status == 5"><i class="el-icon-refresh-left"></i>已经结束</p>
				</div>
			</div>
      <!-- <VideoList :videoList="trainList" type="0"></VideoList> -->
    </div>
    <div v-if="version !== 1" class="video-catalog special">
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 7px">专递课堂</span></span
        >
        <!-- v-if="trainList.length > 8 " -->
        <router-link v-if="isThemeList > 8" to="/courierClass" class="more mores"
          >查看全部
          <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
            src="@/assets/imgs/arrow-r.png"
            alt=""
            class="moreImg"
        /></router-link>
      </p>
      <div class="null-data" v-if="isThemeList == 0">
        <img src="../../assets/imgs/home-null.png" alt="" />
        <p>暂无内容，您可以观看其他节目！</p>
      </div>
      <VideoLists :videoList="themeList" type="0"></VideoLists>
<!-- 
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 7px">文艺课堂</span></span
        >
      </p> -->
      <div v-if="(bannerList.length == 1)" class="center-banner">
        <div @click="goAfterClassa(1)">
					<img class="oneImg" :src="bannerList[0] && bannerList[0].imgUrl ? bannerList[0].imgUrl : ''" alt="" />
        </div>
      </div>
      <div v-else-if="bannerList.length == 2" class="center-banner">
        <div @click="goAfterClassa(1)">
					<img :src="bannerList[0] && bannerList[0].imgUrl ? bannerList[0].imgUrl : ''" alt="" />
        </div>
        <div @click="goAfterClassa(2)">
       		<img :src="bannerList[1] && bannerList[1].imgUrl ? bannerList[1].imgUrl : ''" alt="" />
        </div>
      </div>
     
        <!-- <el-carousel v-if="bannerList.length > 0" height="200px" arrow="never">
        <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <div class="center-banner">
          <div v-for="(items, indexs) in item" :key="indexs" class="banner-item">
            <a :href="items.url" target="_blank" rel="noopener noreferrer"><img :src="items.imgUrl" alt="" /></a>
          </div></div>
        </el-carousel-item>
      </el-carousel> -->
    </div>
    <div class="video-catalog special">
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 7px">优质资源</span></span
        >
        <router-link v-if="isResources > 8 " to="/resources" class="more mores"
          >查看全部
          <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
            src="@/assets/imgs/arrow-r.png"
            alt=""
            class="moreImg"
        /></router-link>
      </p>
      <div class="null-data" v-if="isResources == 0">
        <img src="../../assets/imgs/home-null.png" alt="" />
        <p>暂无内容，您可以观看其他节目！</p>
      </div>
      <VideoListss :videoList="resourcesList" type="2"></VideoListss>
    </div>
    <div class="video-catalog special">
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 7px">课后服务</span></span
        >
      </p>
      <div class="center-banner">
        <div @click="goAfterClass(1)">
					<img :src="afterClass" alt="" />
        </div>
        <div @click="goAfterClass(2)">
       		<img :src="afterClass1" alt="" />
        </div>
      </div>
    </div>

    <div class="video-catalog special">
      <p class="home-title">
        <span class="home-title-item">
          <svg
            width="6"
            height="24"
            viewBox="0 0 6 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="24" rx="3" fill="#0186FF" />
          </svg>
          <span style="margin-left: 7px">停课不停学</span>
        </span>
        <router-link v-if="isSchool > 5" to="/noSuspension" class="more mores"
          >查看全部
          <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
            src="@/assets/imgs/arrow-r.png"
            alt=""
            class="moreImg"
        /></router-link>
      </p>
      <div class="null-data" v-if="isSchool == 0">
        <img src="../../assets/imgs/home-null.png" alt="" />
        <p>暂无内容，您可以观看其他节目！</p>
      </div>
      <div v-else>
        <ul class="foot-video-box">
          <li
            v-for="items in schoolList"
            :key="items.orgId"
            class="foot-video-item"
            @click="goSchool(items)"
          >
            <img :src="items.avatar !== null ? items.avatar : img3" alt="" class="one-img" />
            <p class="video-school" :title="items.name">{{ items.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
        title="分析次数预警"
        :close-on-click-modal="false"
        :visible.sync="aiEarlyWarningShow"
        width="50%"
    >
      <div class="dialog-wrap">
        <p class="err-delete">
          分析次数剩余<span style="color: red">{{ remainingAnalysis }}</span>次，请及时联系商务人员进行充值！
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import img from "@/assets/imgs/teacher.png";
import img1 from "@/assets/imgs/banner11.png";
import img2 from "@/assets/imgs/banner2.png";
import img3 from "@/assets/imgs/school.png";
import afterClass from "@/assets/imgs/afterClass1.png";
import afterClass1 from "@/assets/imgs/afterClass2.png";
import { cookie } from "@/assets/js/utils";
import VideoList from "./components/VideoList.vue";
import VideoLists from "./components/VideoList1.vue";
import VideoListss from "./components/VideoLists.vue";
import Swiper from "./components/SwiperHome";
export default {
  name: "",
  data() {
    return {
      img3: img3,
			img: img,
			afterClass1: afterClass1,
			afterClass: afterClass,
      img2: img2,
      hotList: "",
      newestList: "",
      isThemeList: 0,
      isTrainList: 0,
      isResources: 0,
      isSchool: 0,
      isMoreList: false,
      isMoreLists: false,
      version: localStorage.getItem('version'),
      schoolList: [],
      trainList: [],
      resourcesList: [],
      teacherList: [],
      bannerList: [],
      themeList: [],
      allData: {},
      allVideo: 0,
      defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
      // AI次数预警dialog
      aiEarlyWarningShow: false,
      // 努比AI剩余次数
      remainingAnalysis: 0,
      userId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).userId : "",
    };
  },
  components: { VideoList, VideoLists, VideoListss, Swiper },
  mounted() {
    if(localStorage.getItem('uiType') == 2) {
      this.$router.push('/home')
    }
    this.getSwiperList();
    this.getTeachersList();
    this.getLiveVideo();
    this.getRresources();
    this.getSchoolList();
    if(localStorage.getItem('version') !== 1){
      this.getThemeList();
    }
    this.getAllData();
  },
  methods: {
    goTrainDetail(val){
      if(val.type == 0){
        if(val.status !== 3 && val.status !== 4 && val.status !== 5){
          return
        }
        if(val.liveStatus == 1 || val.liveStatus == 0){
          this.$router.push('/hplay?themeid='+ val.objectId +'&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''))
        }
        if(val.liveStatus == 2){
          this.$router.push('/pplay?themeid='+ val.objectId +'&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''))
        }
      }else{
        if(val.resources == 3 || val.resources == 4){
          this.$router.push({path: '/Hplays', query: {themeid: val.id}});
        }else{
          this.$router.push({path: 'vplay', query: {themeid: val.objectId, type: 2,vtype: 1}});
        }
      }
    },
    getAllData() {
      this.$axios.get('/sys/screen/allData').then(res => {
        this.allData = res.data;
        this.visity();
      })
    },
    visity() {
      this.$axios.post('/buried/point/record', { pageName: this.$router.history.current.path, contentType: 0 }).then(res => {
				console.log('记录一次',res)
      });
    },
    // 跳转停课不停学
		goAfterClass(id) {
			this.$router.push({path: 'afterClass', query: {id: id}});
		},
    goAfterClassa(type) {
      if(type == 1 && this.bannerList[0].url) {
        window.open(this.bannerList[0].url, '_blank');
      }else if(type == 2 && this.bannerList[1].url){
        window.open(this.bannerList[1].url, '_blank');
      }
    },
    // 跳转停课不停学
		goSchool(data) {
			this.$router.push({path: 'noSuspension', query: {id: data.orgId}});
		},
		// 跳转名师课堂
		goDetail(data) {
			this.$router.push({path: 'teacherClass', query: {deptId: data.orgId, id: data.id}});
		},
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    //获取名师资源
    getTeachersList() {
      this.$axios.get('/index/getFamousTeacher').then(res => {
				this.teacherList = this.group(res.data, 5);
      });
    },
    //获取智能研修
    getLiveVideo() {
      const params = {
        pageNum: 1,
				pageSize: 8,
      };
      this.$axios.post('/index/comment/list', params).then(res => {
        this.isTrainList = res.data.pageList.length;
        if (res.data.pageList.length > 4) {
          this.trainList = res.data.pageList.slice(0, 4);
        } else {
          this.trainList = res.data.pageList;
        }
      });
    },
    //获取专递课堂
    getThemeList(){
      let data = {
        pageNum: 1,
        pageSize: 10,
        habitusStatus: 1,
        // categoryId: 1
      };
      this.$axios.get('/index/list', data).then(res => {
        this.isThemeList = res.data.pageList.length;
        if (res.data.pageList.length > 8) {
          this.themeList = res.data.pageList.slice(0, 8);
        } else {
          this.themeList = res.data.pageList;
        }
      });
    },
    // 获取首页中部轮播
    getSwiperList(){
				this.$axios.get('/index/getAdByLocation', {location: 10}).then(res => {
					// this.bannerList = this.group(res.data, 2);
          this.bannerList = res.data;
          console.log('this.bannerList',this.bannerList.length)
				});
			},
    //获取优质资源
    getRresources() {
      const params = {
        pageNum: 1,
        pageSize: 10,
        categoryId: 4
      };
      this.$axios.post('/index/getVideo', params).then(res => {
        this.isResources = res.data.pageList.length;
        if (res.data.pageList.length > 8) {
          this.resourcesList = res.data.pageList.slice(0, 8);
        } else {
          this.resourcesList = res.data.pageList;
        }
      });
    },
    //获取所有学校
    getSchoolList(){
      this.$axios.get('/index/getSchool').then(res => {
        this.isSchool = res.data.length;
        if (res.data.length > 5) {
          this.schoolList = res.data.slice(0, 5);
        } else {
          this.schoolList = res.data;
        }
      });
    },
    getRemind() {
      this.$axios.get("/aiEarlyWarning/getRemind").then((res) => {
        if (res.code == 200) {
          this.aiEarlyWarningShow = res.data
          if (this.aiEarlyWarningShow) {
            this.$nextTick(() => {
              this.getCount()
            })
          }
        }
      });
    },
    getCount() {
      this.$axios.get("/Api/getTotalRemaining").then((res) => {
        if (res.code == 200) {
          this.remainingAnalysis = res.data
        }
      });
    },
  },
  computed: {
    productss() {
      return this.$store.state.ifLogin;
    },
  },
  watch: {
    // '$store.state.ifLogin': function (n,v) {
    // 	this.getHotVideo();
    // 	this.getNewestVideo();
    // 	console.log(n,v);
    // }
    productss() {
      this.getLiveVideo();
      this.getRresources();
      this.getSchoolList();
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.swiper-wrap {
  height: 480px;
}
@keyframes mymove {
  0% {
    left: 0px;
  }
  55% {
    left: 10px;
  }
  65% {
    left: 5px;
  }
  100% {
    left: 0px;
  }
}
.moreImg {
  position: relative;
  width: 16px;
  height: 16px;
  vertical-align: text-top;
  transition: all 0.3s;
}
.moreImg:nth-child(1) {
  left: -5px;
}
.moreImg:nth-child(2) {
  left: -13px;
}
.mores {
  border-radius: 18px;
  margin-top: 0;
  width: 100px;
  background: #ccd6f3;
  padding: 10px 0px 10px 15px;
  border: 1px solid #eef2fe;
}
.more:hover .moreImg {
  left: 2px;
}
.video-box {
	// padding: 0 1px;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
::v-deep .el-carousel__indicator.is-active button {
   	background: #3060F6;
}
::v-deep .el-carousel__indicator button {
  background: #ECEDF2;
}
.video-box .video-item:first-child {
  margin-left: 0px !important;

}
.video-item {
  overflow: hidden;
  position: relative;
  width: 220px;
  height: 200px;
  margin: 20px 0 0 25px;
  border: 1px solid rgba(0, 0, 0, 0.13);
	// padding: 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #fff;
  color: #999;
  border-radius: 8px;
  -webkit-transition: all 0.1s;
  transition: all .2s;
  cursor: pointer;
  img {
    transform: scale(0.9);
    width: 100%;
    height: 120px;
    border-radius: 8px;
  }
  .video-school {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 10px;
    padding: 0 10px;
    font-size: 16px;
    font-weight: 600;
    color: #000;
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
// .video-item:hover{
// 	transition: transform 0.3s;
// 	box-shadow: 0px 4px 16px rgba(197, 197, 197, 0.32);
// }
.special {
  background: #ffffff;
  padding: 30px 30px;
  width: 1200px;
  margin: 28px auto 0 auto;
}
.special .home-title span::after {
  background: #fff6cb;
}
.center-banner {
  width: 1200px;
  margin: 28px auto 0 auto;
  display: flex;
  justify-content: space-between;
  .oneImg{
    width: 1200px;
		height: 138px;
		border-radius: 7px;
		cursor: pointer;
  }
	img{
		width: 588px;
		height: 138px;
		border-radius: 7px;
		cursor: pointer;
	}
}
.foot-video-box {
  width: 1200px;
  margin: 48px auto 0 auto;
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
}
.foot-video-box .foot-video-item:first-child {
  margin-left: 0;
}
.foot-video-item {
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.13);
  cursor: pointer;
  img {
    border-radius: 6px;
    width: 221px;
    height: 110px;
    transform: scale(0.9);
  }
  width: 222px;
  margin-left: 20px;
  p {
    padding: 5px;
    color: #2f3742;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }
}
.result-box {
	z-index: 120;
  position: absolute;
  width: 250px;
  height: 320px;
  right: 30px;
  top: 120px;
  background: #ffffff;
  border-radius: 6px;
  padding: 20px 25px;
	box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
  .item-title {
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    color: #2f3742;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .item-content {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-content-title {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      color: #687583;
    }
    .item-content-total {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      color: #2f3742;
      em {
        margin-left: 5px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: #687583;
      }
    }
  }
}
.home-title-item {
  display: flex;
  align-items: center;
}
.classList{
  .video-status {
	position: absolute;
	top: 0;
	left: 0;
	width: 84px;
	line-height: 23px;
	text-align: center;
	font-size: 12px;
	color: #fff;
	border-radius: 5px 0 5px 0;
	i{
		margin-right: 2px;
		font-size: 16px;
		vertical-align: middle;
	}
}
  .status0{
	background: rgb( 255, 65, 123);
}
.status1{
	background: rgb( 48, 96, 246);
}
.status2{
	background: rgb( 110, 123, 136);
    }
.playAnimation {
	display: inline-block;
	width:24px;
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
	.animationli:first-child{
		animation:mymove 0.9s infinite;
    -webkit-animation:mymove 0.9s infinite; 
	}
	.animationli:nth-child(2){
		animation:mymove 1.6s infinite;
    -webkit-animation:mymove 1.6s infinite; 
	}
	.animationli:nth-child(3){
		animation:mymove 1.3s infinite;
    -webkit-animation:mymove 1.3s infinite; 
	}
	.animationli:nth-child(4){
		animation:mymove 0.8s infinite;
    -webkit-animation:mymove 0.8s infinite; 
	}
	@keyframes mymove
	{
			0%   {height: 6px;}
			35%  {height: 13px;}
			45%  {height: 14px;}
			55%  {height: 15px;}
			65%  {height: 11px;}
			75%  {height: 10px;}
			85%  {height: 8px;}
			100% {height: 4px;}
	}

	@-webkit-keyframes mymove /* Safari and Chrome */
	{
			0%   {height: 6px;}
			35%  {height: 13px;}
			45%  {height: 14px;}
			55%  {height: 15px;}
			65%  {height: 11px;}
			75%  {height: 10px;}
			85%  {height: 8px;}
			100% {height: 4px;}
	}
}
	width: 100%;
	display: inline-block;
	.item:nth-child(2n){
		margin-left: 20px;
	}
	.item:hover{
		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		transform: translateY(-5px) scale(1.02);
	}
	.item:hover img{
		transform: scale(1.10);
	}
	.item:hover .img-wrap {
		transform: scale(0.95);
		// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
	}
	.item{
		border-radius: 8px;
		float: left;
		cursor: pointer;
		position: relative;
		margin: 20px 0;
		padding: 10px;
		width: 49%;
		display: flex;
    box-sizing: border-box;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.13);
    background: #fff;
		transition: all 0.2s;
		img{
			width: 200px;
			height: 125px;
			transition: all 0.4s;
			border-radius: 8px;
		}
		.right{
			margin-left: 10px;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title{
				line-height: 26px;
				text-align: left;
				overflow:hidden;
				text-overflow:-o-ellipsis-lastline;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-line-clamp:2;
				line-clamp:2;
				-webkit-box-orient:vertical;
			}
			.content{
				margin-bottom: 0;
				// display: flex;
				// flex-direction: column;
				span{
					display: inline-block;
					color: #999;
				}
			}
		}
	}
}
</style>
