<template>
	<div class="">
		<Head></Head>
		<ul class="type-list">
			<li v-for="(val) in typeList" @click="changeType(val.type)" :key="val.type" :class="activeIndex == val.type ? 'active' : ''">{{val.name}}</li>
		</ul>
		<p class="all">共{{total}}结果</p>
		<div class="mobile-pad">
			<ScrollDownUp @loadMore="loadMore">
				<VideoList :videoList="videoList" :type="activeIndex"></VideoList>
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
				total: 0,
				typeList: [
					{
						name:'直播',
						type:0
					},
					// {
					// 	name:'点播',
					// 	type:1
					// },
					{
						name:'视频',
						type:2
					},
				],
				activeIndex: 0
			}
		},
		components: { Head, VideoList, ScrollDownUp},
		mounted() {
			this.getLivelist();
		},
		methods: {
			//获取视频
			getLivelist(){
				this.$axios.post('/index/queryVideo', {
					keyWord: this.$route.query.key,
					// type: this.activeIndex,
					pageNum: this.pageNum,
					pageSize: 8,
				}).then(res => {
					this.videoList = this.videoList.concat(res.data.pageList);
					this.pages = res.data.pages;
					this.total = res.data.total
				});
			},
			getVideoList(){
				this.$axios.post('/index/getVideo', {
					keyWord: this.$route.query.key,
					// type: this.activeIndex,
					pageNum: this.pageNum,
					pageSize: 8,
				}).then(res => {
					this.videoList = this.videoList.concat(res.data.pageList);
					this.pages = res.data.pages;
					this.total = res.data.total
				});
			},
			//切换分类
			changeType(index){
				this.activeIndex = index;
				this.pageNum = 1;
				this.videoList = [];
				if(index == 0){
					this.getLivelist();
				}else{
					this.getVideoList();
				}
			},
			//加载更多
			loadMore(){
				if(this.pages == this.pageNum){
					return
				};
				this.pageNum++;
				if(this.activeIndex == 0){
					this.getLivelist();
				}else{
					this.getVideoList();
				}
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
	.all{
		margin: pvh(40) 0 pvh(8) pvh(24);
		font-size: fs(12);
		color: #989898;
	}
	.type-list{
		display: flex;
		margin: pvh(20) 0 pvh(8) 0;
		line-height: pvh(68);
		background: #fff;
		li{
			padding: 0 pvh(12);
			margin-left: pvh(24);
			font-size: fs(12);
			color: #565656;
		}
		.active{
			border-bottom: solid 1px #409EFF;
			color: #409EFF;
		}
	}
</style>
