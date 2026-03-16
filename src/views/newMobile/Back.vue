<template>
	<div class="">
		<Head></Head>
		<Foot index="2"></Foot>
		<div class="mobile-pad">
			<ScrollDownUp @loadMore="loadMore">
				<VideoList :videoList="videoList" type="1"></VideoList>
				<div class="null-data" v-if="!videoList.length">
					<img src="../../assets/imgs/home-null.png" alt="">
					<p>暂无内容，您可以观看其他节目！</p>
				</div>
				<p class="last" v-if="pageNum == pages && videoList.length">已经到底了~</p>
			</ScrollDownUp>
		</div>
	
	</div>
</template>

<script>
	import Foot from './Foot'
	import Head from './Head'
	import VideoList from './VideoList'
	import ScrollDownUp from '@/components/ScrollDownUp'
	export default {
		name: '',
		data() {
			return {
				videoList: [],
				pageNum: 1,
				pages: 0,
			}
		},
		components: {Foot, Head, VideoList, ScrollDownUp},
		mounted() {
			this.getVideolist();
		},
		methods: {
			//获取视频
			getVideolist(){
				this.$axios.post('/index/getLiveOrRecordVideo', {
					// type: 1,
					pageNum: this.pageNum,
					pageSize: 8
				}).then(res => {
					this.videoList = this.videoList.concat(res.data.pageList);
					this.pages = res.data.pages;
				});
			},
			//加载更多
			loadMore(){
				if(this.pages == this.pageNum){
					return
				};
				this.pageNum++;
				this.getVideolist();
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.mobile-pad{
		width: 100%;
		box-sizing: border-box;
		padding: 0 pvh(24);
	}
	.last{
		text-align: center;
		margin-top: pvh(20);
		font-size: fs(9);
		color: #656565;
	}
	.null-data{
		margin-top: pvh(300);
		text-align: center;
		font-size: fs(7);
		color: #999;
		img{
			width: 75%;
			margin-bottom: pvh(17);
		}
	}
</style>
