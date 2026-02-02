<template>
	<div class="">
		<!-- <Swiper location="3"></Swiper> -->
		<div class="video-catalog">
			<div class="select-wrap">
				<ul>
					<li v-for="(val) in typeList" :key="val.type" :class="activeIndex == val.type ? 'active' : ''"
					    @click="changeLabel(val.type)"><p class="parent-title">{{val.name}}</p></li>
				</ul>
			</div>
			<p class="search-num">搜索结果：共<span> {{total}} </span>条记录</p>
			<div class="null-data" v-if="!videoList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
				<el-button class="index_btn" @click="goHome()">返回首页</el-button>
			</div>
			<VideoList :videoList="videoList" :type="activeIndex" v-show="activeIndex != 3"></VideoList>
			<InteractList :videoList="videoList" type="0" v-show="activeIndex == 3"></InteractList>
			<div class="pagination-wrap">
				<el-pagination
					background
					:page-size="8"
					:current-page="pageNum"
					layout="prev, pager, next"
					@current-change="pageChange"
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import Swiper from '@/components/Swiper'
	import VideoList from '@/components/VideoList'
	import InteractList from '@/components/interactList.vue'
	import {creatTree} from "../../assets/js/utils";
	import { mapState , mapMutations } from 'vuex';
	export default {
		name: '',
		data() {
			return {
				videoList: [],
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
					{
						name:'互动课堂',
						type:3
					},
				],
				activeIndex: '0',
				pageNum: 1,
				pages: 0,
				total: 0
			}
		},
		components: {VideoList, Swiper, InteractList},
		mounted() {
			this.getVideolist();
		},
		computed: {
			currentKey() {
				return this.$store.state.searchKey
			},
		},
		methods: {
			//切换标签
			changeLabel(index){
				this.activeIndex = index;
				this.pageNum = 1;
				this.getVideolist();
			},
			//获取视频
			getVideolist(){
				console.log(this.currentKey)
				let key = this.currentKey;
				if(this.activeIndex == 3) {
					const params = {
					habitusStatus: 1,
					pageNum: this.pageNum,
					pageSize: 8,
					// categoryId: 1
				};
					if(key !== '') {
						params.keyWord = key;
					}
					this.$axios.get('/index/list', params).then(res => {
					const data = res.data.pageList;
					this.videoList = data;
					this.pages = res.data.pages;
					this.total = res.data.total;
				});
				}else{
					this.$axios.post('/index/queryVideo', {
						pageNum: this.pageNum,
						pageSize: 8,
						type: this.activeIndex == 2 || this.activeIndex == 3 ? this.activeIndex : null,
						keyWord: key
					}).then(res => {
						this.videoList = res.data.pageList;
						this.pages = res.data.pages;
						this.total = res.data.total;
					});
				}
			},
			//分页点击
			pageChange(val){
				this.pageNum = val;
				this.getVideolist();
			},
			goHome() {
				this.$router.push('/home')
			}
		},
		watch: {
			currentKey(){
				this.pageNum = 1;
				this.getVideolist();
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	 ::v-deep	.el-pagination .el-pager{
		display: inline-flex;
	}
	.index_btn{
		margin: 10px 0;
	}
	.search-num{
		width: 1200px;
		margin: 30px auto 0 auto;
		span{
			color: #2DBCF1;
		}
	}
	.select-wrap{
		margin: 30px 0;
		background: #fff;
		ul{
			display: flex;
			li:first-child{
				border-left: 0;
			}
			.active{
				.parent-title{
					color: #035AFF;
				}
			}
			li{
				padding: 0 21px 0 21px;
				margin: 17px 0 15px 0;
				border-left: solid 1px #B1B1B1;
				color: #999;
				.parent-title{
					font-size: 20px;
					line-height: 24px;
					cursor: pointer;
				}
			}
		}
	}
</style>
<style>
	.el-dropdown-menu__item{
		font-size: 16px;
	}
	.video-catalog i {
		margin-right: 0 !important;
	}
</style>
