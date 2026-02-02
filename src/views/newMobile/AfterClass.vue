<template>
	<div class="">
		<Head></Head>
		<Foot :index="5"></Foot>
		<div class="nav-wrap">
			<ul class="nav-list">
				<li v-for="(val, index) in labelList" @click="changeType(val.id)" :key="index"
				    :class="activeIndex == val.id ? 'active' : ''">{{val.name}}</li>
			</ul>
		</div>
		<div class="mobile-pad">
			<ScrollDownUp @loadMore="loadMore">
				<VideoList :videoList="videoList" :type="type"></VideoList>
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
				type: this.$route.query.type ? (this.$route.query.type == 1 ? 0 : 2) : 0,
				labelList: [
          {
            id: 1,
            name: '课堂回顾'
          },
          {
            id: 2,
            name: '课外知识'
          }
        ],
				activeIndex: this.$route.query.type ? this.$route.query.type : 1,
				videoList: [],
				labelId: [],
				pageNum: 1,
				pages: 0,
			}
		},
		components: {Foot, Head, VideoList, ScrollDownUp},
		mounted() {
			this.getLivelist();
		},
		methods: {
			changeType(index){
				if(index == 1) {
					this.type = 0;
				}else{
					this.type = 2;
				}
				this.videoList = [];
				this.activeIndex = index;
				let labelIds = [];
				if(index != 1000){
					labelIds.push(index);
				};
				this.labelId = labelIds;
				this.pageNum = 1;
				this.getLivelist();
			},
			//获取视频
			getLivelist(){
        if(this.activeIndex == 1) {
          this.$axios.post('/index/getLiveOrRecordVideo', {
            categoryId: 2,
            pageNum: this.pageNum,
            pageSize: 8
          }).then(res => {
            this.videoList = this.videoList.concat(res.data.pageList);
            this.pages = res.data.pages;
          });
        }else{
          this.$axios.post('/index/getVideo', {
            categoryId: 6,
            pageNum: this.pageNum,
            pageSize: 8
          }).then(res => {
            this.videoList = this.videoList.concat(res.data.pageList);
            this.pages = res.data.pages;
          });
        }
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
