<template>
	<div class="">
		<Swiper location="0"></Swiper>
		<div class="video-catalog">
			<p class="home-title">
				<!-- <i class="iconfont iconjinrituijianicon"></i> -->
				<span>最新课程录制</span>
				<router-link to="/live" class="more" v-if="isMoreList > 8">更多 <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg"><img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg"></router-link>
			</p>
			<div class="null-data" v-if="!hotList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
			
			<VideoList :videoList="hotList" type="0"></VideoList>
		</div>

		<div class="video-catalog ">
			<p class="home-title">
				<!-- <i class="iconfont iconnav-vedio"></i> -->
				<span>最新视频上传</span>
				<router-link to="/video" class="more" v-if="isMoreLists > 8">更多 <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg"><img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg"></router-link>
			</p>
			<div class="null-data" v-if="!newestList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无最新视频，您可以观看其他节目！</p>
			</div>
			<VideoList :videoList="newestList" type="2"></VideoList>
		</div>
	</div>
</template>

<script>
	import { cookie } from '@/assets/js/utils'
	import VideoList from '@/components/VideoList'
	import Swiper from '@/components/SwiperHome'
	export default {
		name: '',
		data() {
			return {
				hotList: '',
				newestList: '',
				isMoreList: false,
				isMoreLists: false,
			}
		},
		components: {VideoList, Swiper},
		mounted() {
			this.getHotVideo();
			this.getNewestVideo();
		},
		methods: {
			//获取热门推荐
			getHotVideo(){
				const params = {
					pageNum: 1,
					pageSize: 8,
				}; 
				this.$axios.post('/index/getLiveOrRecordVideo',params).then(res => {
					this.hotList = res.data.pageList;
					this.isMoreList = res.data.total;
				});
			},
			//获取最新视频
			getNewestVideo(){
				this.$axios.get('/index/getNewest').then(res => {
					this.isMoreLists = res.data.length;
					if(res.data.length > 8) {
						this.newestList = res.data.slice(0,8)
					} else {
						this.newestList = res.data;
					}
				});
			},
		},
		computed: {
			productss () {
				return this.$store.state.ifLogin
			},
		},
		watch: {
			// '$store.state.ifLogin': function (n,v) {
			// 	this.getHotVideo();
			// 	this.getNewestVideo();
			// 	console.log(n,v);
			// }
			productss() {
				this.getHotVideo();
				this.getNewestVideo();
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
.video-catalog .home-title span:after {
    content: "";
    width: 39px;
    height: 39px;
    background: #c9dcff;
    border-radius: 50%;
    position: absolute;
    left: -20px;
    top: -6px;
    z-index: -1;
    -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.13);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.13);
}
	.swiper-wrap{
		height: 480px;
	}
	@keyframes mymove
	{
			0%   {left: 0px;}
			55%  {left: 10px;}
			65%  {left: 5px;}
			100% {left: 0px;}
	}
	.moreImg{
		position: relative;
		width:16px;
		height: 16px;
		vertical-align: text-top;
		transition: all 0.3s;
	}
	.moreImg:nth-child(1){
		left:-5px;
	}
	.moreImg:nth-child(2){
		left:-13px;
	}
	.more:hover .moreImg{
		left:2px;
	}
</style>
