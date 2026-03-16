<template>
	<div class="">
		<Swiper location="4"></Swiper>
		<div class="video-catalog">
			<p class="home-title">
				<!-- <i class="iconfont iconnav-vedio"></i> -->
				<span>点播资源</span>
			</p>
			<div class="select-wrap" v-if="release === 1">
				<ul>
					<li :class="activeIndex == 100 ? 'active' : ''" @click="changeLabel(100)"><p class="parent-title">全部</p></li>
					<li v-for="(val, index) in labelList" @click="changeLabel(index)" :class="activeIndex == index ? 'active' : ''" :key="index">
						<el-dropdown @command="handleCommand">
							<p class="parent-title">{{val.name}}</p>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(item, indexs) in val.children" :command="{index: index, id: item.id}" :key="indexs">{{item.name}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</li>
				</ul>
			</div>

			<div class="classify" v-else>
				<ul class="classes">
					<li v-for="(item, index) in categoryListData" :key="item.id" :class="typeClass === index ? 'act' : ''" @click="handleType(index,item)">
						{{ item.name }}
					</li>
				</ul>
				<div v-if="typeClass !== 0">
					<div v-for="(item, i) in firstLabelList" :key="i" class="namList">
						<div class="name">{{ item.name }}：</div>
						<ul class="grade">
							<li v-for="(itemChildren, j) in item.children" :key="j" :class="{ act: indexes[i] === itemChildren.id }" @click="handleGrade(itemChildren,i,j)">
								{{ itemChildren.name }}
							</li>
						</ul>
					</div>
				</div>
			</div>
			
			<div class="null-data" v-if="!videoList.length">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无点播资源，您可以观看其他节目！</p>
			</div>
			<VideoList :videoList="videoList" type="1"></VideoList>
			<div class="pagination-wrap">
				<el-pagination
					background
					:page-size="8"
					layout="prev, pager, next"
					@current-change="pageChange"
					:current-page="pageNum"
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import Swiper from '@/components/Swiper'
	import VideoList from '@/components/VideoList'
	import {creatTree, session} from "../../assets/js/utils";
	import { mapState , mapMutations } from 'vuex';
	export default {
		name: '',
		inject:['reload'],
		data() {
			return {
				videoList: [],
				labelList: [],
				activeIndex: '100',
				pageNum: 1,
				pages: 0,
				total: 0,
				labelId:[],
				categoryListData: [], // 分类数据
				firstLabelList: [], // 2级分类数据
				typeClass: 0, // 课堂分类默认class
				// release: session.get('userInfo').classify, // 分类方式（1简单，2复杂）
				release: 2,
				indexes: []
			}
		},
		components: {VideoList, Swiper},
		mounted() {
			this.getLabelList();
			// setTimeout(() => {
			// 	if (this.categoryListData.length > 0) {
			// 		this.getVideolist();
			// 	}
			// }, 100)
			this.handleGetData();
			// if (this.release === 2) {
			// 	this.handleGetData();
			// }
			// this.$nextTick(() => {
			// 	if (this.categoryListData.length > 0) {
			// 		this.getVideolist();
			// 	}
			// });
		},
		computed: {
			productss () {
				return this.$store.state.ifLogin
			},
			...mapState({
				isLoginReflash: 'loginRefalsh'
			})
		},
		watch: {
			productss(val) {
				this.getVideolist();
			},
			isLoginReflash(val) {
				if(val === true){
					this.reload(); // 刷新当前页
				}
			}
		},
		methods: {
			// 班级== type
			handleGrade({ id }, i) {
				this.indexes.splice(i, 1, id);
				// this.getLivelist();
				this.pageNum = 1;
				this.getVideolist();
			},
			// 课堂分类场景切换	
			handleType(i,item) {
				this.typeClass = i;
				this.$axios.get('/index/getLabelInfo', { categoryId: item.id }).then(res => {
					this.firstLabelList = creatTree(res.data);
					this.firstLabelList.forEach(v => {
						if (v.children) {
							v.children.unshift({ name: '全部', id: '' })
						}
					});
					// this.indexes = new Array(creatTree(res.data)).fill(0)
					if (item.id !== '') {
						this.indexes = this.firstLabelList.map(item => item.children[0].id);
					}
					if (item.name === "全部") {
						this.indexes = this.indexes.fill('');
					}
					this.pageNum = 1;
					this.getVideolist();
				})
			},
			handleGetData() {
				this.$axios.get('/index/getAllCategory').then(res => {
					this.categoryListData = res.data.categoryList;
					this.categoryListData.unshift({ name: '全部', id: '' });
					this.firstLabelList = creatTree(res.data.firstLabelList);
					this.getVideolist();
					this.firstLabelList.forEach(v => {
						if (v.children) {
							v.children.unshift({ name: '全部', id: '' })
						}
					})
					// this.indexes = new Array(creatTree(res.data.firstLabelList)).fill(0);
					this.indexes = this.firstLabelList.map(item => item.children[0].id);
				})
			},
			//获取标签
			getLabelList(){
				this.$axios.get('/index/getLabelInfo').then(res => {
					this.labelList = creatTree(res.data);
				});
			},
			//切换标签
			changeLabel(activeIndex){
				this.activeIndex = activeIndex;
				let labelIds = [];
				if(activeIndex != 100){
					labelIds.push(this.labelList[activeIndex].id);
				}
				this.labelId = labelIds;
				this.pageNum = 1;
				this.getVideolist();
			},
			handleCommand(obj){
				this.activeIndex = obj.index;
				this.labelId = [obj.id];
				this.getVideolist();
			},
			//获取视频
			getVideolist(){
				let labelIdArr = [];
				this.labelId.forEach(v => {
					if (v !== 0 || v !== '') {
						labelIdArr.push(v);
					}
				});
				const params = {
					// type: 1,
					pageNum: this.pageNum,
					pageSize: 8,
					// labelIds: this.release === 1 ? labelIdArr : this.indexes,
					categoryId: this.categoryListData.length > 0 ? this.categoryListData[this.typeClass].id : ''
				};
				let idList = this.indexes.filter(v => v !== '');
				if (idList.length >= 1) {
					params.labelIds = this.release === 1 ? labelIdArr : this.indexes;
				}
				this.$axios.post('/index/getLiveOrRecordVideo', params).then(res => {
					this.videoList = res.data.pageList;
					this.pages = res.data.pages;
					this.total = res.data.total;
				});
			},
			//分页点击
			pageChange(val){
				this.pageNum = val;
				this.getVideolist();
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
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

	.classify {
		overflow: hidden;
		margin: 30px 0;
		font-family:Microsoft YaHei;

		.namList {
			padding-bottom: 24px;
		}

		.name {
			font-size: 14px;
			float: left;
			height: 14px;
			border-radius: 15px;
			text-align: center;
			line-height: 14px;
			padding: 7px 15px;
			font-weight:400;
		}

		.classes {
			padding-bottom: 24px;
			overflow: hidden;
			li:first-child {
				margin-right: 12px;
			}
			li {
				cursor: pointer;
				float: left;
				text-align: center;
				height: 14px;
				line-height: 14px;
				font-weight:400;
				font-size: 14px;
				color: #303133;
				padding: 7px 16px;
				border-radius:20px;
				transition: background .3s;
			}
			li:hover {
				color:#035AFF;
			}
			.act {
				color: #035AFF;
				background: #C9DCFF;
			}
		}

		.grade {
			overflow: hidden;
			li {
				cursor: pointer;
				float: left;
				line-height: 14px;
				height: 14px;
				font-size: 14px;
				color: #303133;
				font-weight:400;
				padding: 7px 16px;
				border-radius:20px;
				text-align: center;
				transition: background .3s;
				// &:first-child {
				// 	margin-right: 30px;
				// }
			}
			li:hover {
				color:#035AFF;
			}
			.act {
				color: #035AFF;
				background: #C9DCFF;
			}
		}
	}
</style>
<style>
	.el-dropdown-menu__item{
		font-size: 16px;
	}
</style>
