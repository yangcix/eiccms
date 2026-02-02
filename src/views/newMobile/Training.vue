<template>
	<div class="">
		<Head></Head>
		<Foot :index="2"></Foot>
		<!-- <div class="nav-wrap">
			<ul class="nav-list">
				<li :class="activeIndex == 1000 ? 'active' : ''" @click="changeType(1000)">全部</li>
				<li v-for="(val, index) in labelList" @click="changeType(index)"
				    :class="activeIndex == index ? 'active' : ''">{{val.name}}</li>
			</ul>
		</div> -->
		<div class="mobile-pad">
			<ScrollDownUp @loadMore="loadMore">
				<VideoList :videoList="videoList" type="0"></VideoList>
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
				labelList: [],
				activeIndex: 1000,//初始值1000，分类列表
				videoList: [],
				labelId: [],
				pageNum: 1,
				pages: 0,
			}
		},
		components: {Foot, Head, VideoList, ScrollDownUp},
		mounted() {
			this.getLabelList();
			this.getLivelist();
		},
		methods: {
			//获取标签
			getLabelList(){
				// this.$axios.get('/index/getLabelInfo').then(res => {
				// 	this.labelList = creatTree(res.data);
				// });
				this.$axios.get('/index/getAllCategory').then(res => {
					this.labelList = res.data.categoryList;
				});
			},
			changeType(index){
				this.videoList = [];
				this.activeIndex = index;
				let labelIds = [];
				if(index != 1000){
					labelIds.push(this.labelList[index].id);
				};
				this.labelId = labelIds;
				this.pageNum = 1;
				this.getLivelist();
			},
			//获取视频
			getLivelist(){
				this.$axios.post('/index/getLiveOrRecordVideo', {
					// type: 0,
					// categoryId: this.activeIndex === 1000 ? '' : this.labelList[this.activeIndex].id,
          categoryId: 1,
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
				this.getLivelist();
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
		.nav-wrap{
		overflow: hidden;
		height: pvw(80);
		background: #fff;
	}
	.nav-list{
		overflow-y: scroll;
		width: 100%;
		height: pvw(100);
		white-space: nowrap;
		li{
			display: inline-block;
			margin-left: pvw(70);
			line-height: pvw(80);
			font-size: fs(13);
			color: #656565;
			&.active{
				font-weight:bold;
				color: #409EFF;
			}
		}
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
