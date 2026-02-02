<template>
	<div class="">
		<Head></Head>
		<Foot index="0"></Foot>
		<div class="swiper-wrap" v-if="swiperList.length">
			<el-carousel arrow="never" :interval="5000">
				<el-carousel-item v-for="item in swiperList" :key="item.id">
					<a :href="item.url ? item.url : 'javascript:void(0)'" style="display: block;">
						<img :src="item.imgUrl" alt="">
					</a>
				</el-carousel-item>
			</el-carousel>
		</div>
		<div class="mobile-wrap">
			<p class="modle-title"><span>最新直播</span><span class="more" @click="goTo('live')" v-if="isMoreLists > 8">更多>></span></p>
			<VideoList :videoList="hotList" type="0"></VideoList>
			<div class="null-data" v-if="!hotList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
		</div>
		
		<div class="mobile-wrap">
			<p class="modle-title"><span>最新视频</span><span class="more" @click="goTo('video')" v-if="isMoreList > 8">更多>></span></p>
			<VideoList :videoList="newestList" type="2"></VideoList>
			<div class="null-data" v-if="!newestList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
		</div>
		<div class="footer-box">
      <div class="company-technology">
        <p>运维单位：{{ systemInfo.company }}</p>
        <p style="margin-top: 5px">
          <span><a :href="systemInfo.icpRecordUrl !== null ? systemInfo.icpRecordUrl : 'javascript:void(0)'">{{systemInfo.icpRecord}}</a></span>
          <span style="margin-left: 10px"><a :href="systemInfo.recordUrl !== null ? systemInfo.recordUrl : 'javascript:void(0)'">{{systemInfo.record}}</a></span>
        </p>
      </div>
    </div>
	</div>
</template>

<script>
	import Foot from './Foot'
	import Head from './Head'
	import VideoList from './VideoList'
	export default {
		name: '',
		data() {
			return {
				swiperList: [],
				systemInfo: {},
				newestList: [],
				hotList: [],
				isMoreList: 0,
				isMoreLists: false
			}
		},
		components: {Foot, Head, VideoList},
		mounted() {
			this.getSwiperList();
			this.getHotVideo();
			this.getNewestVideo();
			this.getSystemInfo();
		},
		methods: {
			goTo(path){
				this.$router.push('/mobile/' + path);
			},
			//获取轮播图
			getSwiperList(){
				this.$axios.get('/index/getAdByLocation', {location: 1}).then(res => {
					let arr = res.data
					arr.forEach(ele => {
							if(ele.url && ele.url.slice(0, 7) !== 'http://' && ele.url.slice(0, 8) !== 'https://') {
								ele.url = 'http://' + ele.url
							}
						});
					this.swiperList = arr;
				});
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
			//获取热门推荐
			getHotVideo(){
				const params = {
					pageNum: 1,
					pageSize: 8,
				};
				this.$axios.post('/index/getLiveOrRecordVideo',params).then(res => {
					this.hotList = res.data.pageList;
					this.isMoreLists = res.data.total;
				});
			},
			//获取最新视频
			getNewestVideo(){
				this.$axios.get('/index/getNewest',{
					pageNum: 1,
					pageSize: 9,
				}).then(res => {
					if(res.data.length > 8) {
						this.newestList = res.data.slice(0,8);
					}else{
						this.newestList = res.data;
					}
					this.isMoreList = res.data.length;
				});
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.mobile-wrap{
		width: 94%;
		margin: pvh(30) 0 0 3%;
		.modle-title{
			display: flex;
			justify-content: space-between;
			font-size: fs(18);
			color: #282828;
			.more{
				font-size: fs(12);
				color: #656565;
			}
		}
	}
	.swiper-wrap{
		overflow: hidden;
		height: pvh(188);
		a {
			width: 100%;
			height: pvh(188);

			img{
				width: 100%;
				height: 100%;
			}
		}
	}
	.mobile-banner{
		width: 100%;
	}
	.null-data{
		margin-top: pvh(50);
		text-align: center;
		font-size: fs(7);
		color: #999;
		img{
			width: 75%;
			margin-bottom: pvh(17);
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
