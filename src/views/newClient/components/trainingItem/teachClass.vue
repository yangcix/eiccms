<template>
	<div style="padding: 40px 0;background-color: white;min-height: 694px;">
		<Swiper location="12"></Swiper>
		<div class="video-catalog ">
			<!-- <p class="home-title">
				<span>教师研修</span>
        <svg width="30" height="10" viewBox="0 0 30 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.32499 1.18183C3.87313 0.173917 2.68975 -0.276855 1.68183 0.175006C0.673917 0.626867 0.223145 1.81025 0.675006 2.81817L4.32499 1.18183ZM29.2881 2.89594C29.7829 1.9084 29.3835 0.706712 28.3959 0.211901C27.4084 -0.282911 26.2067 0.116524 25.7119 1.10406L29.2881 2.89594ZM2.5 2C0.675006 2.81817 0.675553 2.81939 0.67611 2.82063C0.67631 2.82107 0.676881 2.82234 0.677282 2.82323C0.678086 2.82501 0.678935 2.82688 0.67983 2.82885C0.68162 2.83279 0.683593 2.8371 0.68575 2.84178C0.690066 2.85114 0.695122 2.86197 0.700937 2.87423C0.712565 2.89875 0.727237 2.92899 0.745095 2.96457C0.780802 3.03571 0.82932 3.12832 0.891814 3.23928C1.01671 3.46104 1.19805 3.75719 1.44528 4.10227C1.93956 4.7922 2.70066 5.6825 3.80364 6.56302C6.03836 8.34703 9.56418 10 14.8418 10V6C10.4675 6 7.8224 4.65297 6.29921 3.43698C5.52323 2.8175 5.00862 2.2078 4.69693 1.77273C4.54117 1.55531 4.43696 1.38271 4.37705 1.27634C4.34714 1.22324 4.32844 1.18694 4.32003 1.17019C4.31584 1.16183 4.31422 1.15838 4.31509 1.16019C4.31552 1.1611 4.31657 1.16333 4.31822 1.16692C4.31905 1.16872 4.32003 1.17085 4.32116 1.17334C4.32172 1.17458 4.32233 1.17591 4.32296 1.17732C4.32328 1.17803 4.32379 1.17916 4.32395 1.17951C4.32447 1.18066 4.32499 1.18183 2.5 2ZM14.8418 10C20.1179 10 23.7078 8.34867 26.0066 6.58768C27.1432 5.71698 27.9413 4.83736 28.4648 4.15685C28.7266 3.81642 28.9206 3.52462 29.0549 3.30672C29.122 3.19769 29.1743 3.10691 29.2128 3.03749C29.2321 3.00277 29.2479 2.97337 29.2604 2.94965C29.2667 2.9378 29.2721 2.92736 29.2767 2.91839C29.279 2.91391 29.2811 2.90979 29.283 2.90605C29.284 2.90417 29.2848 2.90239 29.2857 2.90071C29.2861 2.89987 29.2867 2.89867 29.2869 2.89825C29.2875 2.89708 29.2881 2.89594 27.5 2C25.7119 1.10406 25.7125 1.10296 25.713 1.10189C25.7132 1.10156 25.7137 1.1005 25.714 1.09984C25.7147 1.09852 25.7153 1.09729 25.7159 1.09614C25.7171 1.09385 25.7181 1.09191 25.7189 1.09031C25.7205 1.08711 25.7215 1.08527 25.7217 1.08477C25.7223 1.08376 25.72 1.08805 25.7149 1.09727C25.7047 1.11574 25.683 1.15387 25.6491 1.20891C25.5812 1.31913 25.465 1.49608 25.2942 1.71815C24.9523 2.16264 24.3956 2.78302 23.5741 3.41232C21.9567 4.65133 19.2176 6 14.8418 6V10Z" fill="url(#paint0_linear_19_6572)"/>
          <defs>
          <linearGradient id="paint0_linear_19_6572" x1="2.81646" y1="2.375" x2="29.0823" y2="2.375" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3490F7"/>
          <stop offset="1" stop-color="#2F60F6"/>
          </linearGradient>
          </defs>
          </svg>
			</p> -->
      <div class="video-title">
        <p class="home-title" @click="setTitle(1)">
				<!-- <i class="iconfont iconnav-vedio"></i> -->
				<span :class="actives == 1 ? 'actives' : ''">直播</span>
        <svg :class="actives == 2 ? 'acts' : ''"  width="30" height="10" viewBox="0 0 30 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.32499 1.18183C3.87313 0.173917 2.68975 -0.276855 1.68183 0.175006C0.673917 0.626867 0.223145 1.81025 0.675006 2.81817L4.32499 1.18183ZM29.2881 2.89594C29.7829 1.9084 29.3835 0.706712 28.3959 0.211901C27.4084 -0.282911 26.2067 0.116524 25.7119 1.10406L29.2881 2.89594ZM2.5 2C0.675006 2.81817 0.675553 2.81939 0.67611 2.82063C0.67631 2.82107 0.676881 2.82234 0.677282 2.82323C0.678086 2.82501 0.678935 2.82688 0.67983 2.82885C0.68162 2.83279 0.683593 2.8371 0.68575 2.84178C0.690066 2.85114 0.695122 2.86197 0.700937 2.87423C0.712565 2.89875 0.727237 2.92899 0.745095 2.96457C0.780802 3.03571 0.82932 3.12832 0.891814 3.23928C1.01671 3.46104 1.19805 3.75719 1.44528 4.10227C1.93956 4.7922 2.70066 5.6825 3.80364 6.56302C6.03836 8.34703 9.56418 10 14.8418 10V6C10.4675 6 7.8224 4.65297 6.29921 3.43698C5.52323 2.8175 5.00862 2.2078 4.69693 1.77273C4.54117 1.55531 4.43696 1.38271 4.37705 1.27634C4.34714 1.22324 4.32844 1.18694 4.32003 1.17019C4.31584 1.16183 4.31422 1.15838 4.31509 1.16019C4.31552 1.1611 4.31657 1.16333 4.31822 1.16692C4.31905 1.16872 4.32003 1.17085 4.32116 1.17334C4.32172 1.17458 4.32233 1.17591 4.32296 1.17732C4.32328 1.17803 4.32379 1.17916 4.32395 1.17951C4.32447 1.18066 4.32499 1.18183 2.5 2ZM14.8418 10C20.1179 10 23.7078 8.34867 26.0066 6.58768C27.1432 5.71698 27.9413 4.83736 28.4648 4.15685C28.7266 3.81642 28.9206 3.52462 29.0549 3.30672C29.122 3.19769 29.1743 3.10691 29.2128 3.03749C29.2321 3.00277 29.2479 2.97337 29.2604 2.94965C29.2667 2.9378 29.2721 2.92736 29.2767 2.91839C29.279 2.91391 29.2811 2.90979 29.283 2.90605C29.284 2.90417 29.2848 2.90239 29.2857 2.90071C29.2861 2.89987 29.2867 2.89867 29.2869 2.89825C29.2875 2.89708 29.2881 2.89594 27.5 2C25.7119 1.10406 25.7125 1.10296 25.713 1.10189C25.7132 1.10156 25.7137 1.1005 25.714 1.09984C25.7147 1.09852 25.7153 1.09729 25.7159 1.09614C25.7171 1.09385 25.7181 1.09191 25.7189 1.09031C25.7205 1.08711 25.7215 1.08527 25.7217 1.08477C25.7223 1.08376 25.72 1.08805 25.7149 1.09727C25.7047 1.11574 25.683 1.15387 25.6491 1.20891C25.5812 1.31913 25.465 1.49608 25.2942 1.71815C24.9523 2.16264 24.3956 2.78302 23.5741 3.41232C21.9567 4.65133 19.2176 6 14.8418 6V10Z" fill="url(#paint0_linear_19_6572)"/>
          <defs>
          <linearGradient id="paint0_linear_19_6572" x1="2.81646" y1="2.375" x2="29.0823" y2="2.375" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3490F7"/>
          <stop offset="1" stop-color="#2F60F6"/>
          </linearGradient>
          </defs>
          </svg>
			</p>
      <p class="home-title" @click="setTitle(2)" style="margin-left: 10px;">
				<!-- <i class="iconfont iconnav-vedio"></i> -->
				<span :class="actives == 2 ? 'actives' : ''">视频</span>
        <svg :class="actives == 1 ? 'acts' : ''" width="30" height="10" viewBox="0 0 30 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.32499 1.18183C3.87313 0.173917 2.68975 -0.276855 1.68183 0.175006C0.673917 0.626867 0.223145 1.81025 0.675006 2.81817L4.32499 1.18183ZM29.2881 2.89594C29.7829 1.9084 29.3835 0.706712 28.3959 0.211901C27.4084 -0.282911 26.2067 0.116524 25.7119 1.10406L29.2881 2.89594ZM2.5 2C0.675006 2.81817 0.675553 2.81939 0.67611 2.82063C0.67631 2.82107 0.676881 2.82234 0.677282 2.82323C0.678086 2.82501 0.678935 2.82688 0.67983 2.82885C0.68162 2.83279 0.683593 2.8371 0.68575 2.84178C0.690066 2.85114 0.695122 2.86197 0.700937 2.87423C0.712565 2.89875 0.727237 2.92899 0.745095 2.96457C0.780802 3.03571 0.82932 3.12832 0.891814 3.23928C1.01671 3.46104 1.19805 3.75719 1.44528 4.10227C1.93956 4.7922 2.70066 5.6825 3.80364 6.56302C6.03836 8.34703 9.56418 10 14.8418 10V6C10.4675 6 7.8224 4.65297 6.29921 3.43698C5.52323 2.8175 5.00862 2.2078 4.69693 1.77273C4.54117 1.55531 4.43696 1.38271 4.37705 1.27634C4.34714 1.22324 4.32844 1.18694 4.32003 1.17019C4.31584 1.16183 4.31422 1.15838 4.31509 1.16019C4.31552 1.1611 4.31657 1.16333 4.31822 1.16692C4.31905 1.16872 4.32003 1.17085 4.32116 1.17334C4.32172 1.17458 4.32233 1.17591 4.32296 1.17732C4.32328 1.17803 4.32379 1.17916 4.32395 1.17951C4.32447 1.18066 4.32499 1.18183 2.5 2ZM14.8418 10C20.1179 10 23.7078 8.34867 26.0066 6.58768C27.1432 5.71698 27.9413 4.83736 28.4648 4.15685C28.7266 3.81642 28.9206 3.52462 29.0549 3.30672C29.122 3.19769 29.1743 3.10691 29.2128 3.03749C29.2321 3.00277 29.2479 2.97337 29.2604 2.94965C29.2667 2.9378 29.2721 2.92736 29.2767 2.91839C29.279 2.91391 29.2811 2.90979 29.283 2.90605C29.284 2.90417 29.2848 2.90239 29.2857 2.90071C29.2861 2.89987 29.2867 2.89867 29.2869 2.89825C29.2875 2.89708 29.2881 2.89594 27.5 2C25.7119 1.10406 25.7125 1.10296 25.713 1.10189C25.7132 1.10156 25.7137 1.1005 25.714 1.09984C25.7147 1.09852 25.7153 1.09729 25.7159 1.09614C25.7171 1.09385 25.7181 1.09191 25.7189 1.09031C25.7205 1.08711 25.7215 1.08527 25.7217 1.08477C25.7223 1.08376 25.72 1.08805 25.7149 1.09727C25.7047 1.11574 25.683 1.15387 25.6491 1.20891C25.5812 1.31913 25.465 1.49608 25.2942 1.71815C24.9523 2.16264 24.3956 2.78302 23.5741 3.41232C21.9567 4.65133 19.2176 6 14.8418 6V10Z" fill="url(#paint0_linear_19_6572)"/>
          <defs>
          <linearGradient id="paint0_linear_19_6572" x1="2.81646" y1="2.375" x2="29.0823" y2="2.375" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3490F7"/>
          <stop offset="1" stop-color="#2F60F6"/>
          </linearGradient>
          </defs>
          </svg>
			</p>
      </div>
      <div class="classify">
				<div>
					<div class="name">{{labelName}}：</div>
					<ul class="classes">
						<li :class="activeIndex == 0 ? 'act' : ''" @click="changeList(0)"><p class="parent-title">全部</p></li>
						<li v-for="item in labelList" :key="item.id" :class="activeIndex == item.id ? 'act' : ''" @click="handleOrg(item)">
							{{ item.name }}
						</li>
					</ul>
				</div>
				
				<div v-for="(item, i) in firstLabelList" :key="i" class="namList">
						<div class="name">{{ item.name }}：</div>
						<ul class="grade">
							<li v-for="(itemChildren, j) in item.children" :key="j" :class="{ act: indexes[i] === itemChildren.id }" @click="handleGrade(itemChildren,i,j)">
								{{ itemChildren.name }}
							</li>
						</ul>
					</div>
			</div>

			<!-- <div class="classify">
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
			</div> -->
			
			<div class="null-data" v-if="!liveList.length">
				<img src="../../../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
			<VideoList :videoList="liveList" :type="actives == 1 ? 0 : 2"></VideoList>
			<div class="pagination-wrap">
				<el-pagination
					background
					:page-size="8"
					layout="prev, pager, next"
					:current-page="pageNum"
					@current-change="pageChange"
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import Swiper from '../Swiper.vue'
	import VideoList from '../VideoList3'
	import {creatTree, session} from "../../../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				labelName: '研修类型',
        actives: 1,
				liveList: [],
				labelList: [],
				activeIndex: 0,
        orgId: this.$route.query.id ? this.$route.query.id : '',
				pageNum: 1,
				pages: 0,
				total: 0,
				labelId:[],
				typeClass: 1, // 课堂分类默认class
				categoryListData: [], // 分类数据
				firstLabelList: [], // 2级分类数据
				// indexes: new Array(this.firstLabelList.length).fill(0), // 2级选中
				indexes: [],
				isSelect: false,
				// release: session.get('userInfo').classify // 分类方式（1简单，2复杂）
				release: 2,
			}
		},
		components: {VideoList, Swiper},
		mounted() {
			// setTimeout(() => {
			// 	if (this.categoryListData.length > 0) {
			// 		this.getLivelist();
			// 	}
			// }, 100)
			
			// this.getLabelList();
			// if (this.release === 2) {
			// 	this.handleGetData();
			// }
			// this.handleGetData();
			// this.$nextTick(() => {
			// 	if (this.categoryListData.length > 0) {
			// 		this.getLivelist();
			// 	}
			// });
      this.handleType();
			this.visity();
		},
		methods: {
      setTitle(val){
        this.actives = val;
        // this.indexes = [''];
        this.pageNum = 1;
        this.getLivelist();
      },
			visity() {
				this.$axios.post('/buried/point/record', { pageName: this.$router.history.current.path, contentType: 0 }).then(res => {
					console.log('记录一次',res)
				});
			},
      //获取研修类型
			getLabelList(){
				this.$axios.get('/index/getAllCategory').then(res => {
					if (res.code === 200) {
						let arr = res.data.categoryList.find(el => {
							return el.id == 1
						})
						this.labelName = arr.name;
						// this.themeData = res.data;
					}
				})
				this.labelList = [
          {
            id: 1,
            name: '专家讲座',
          },
          {
            id: 2,
            name: '专业培训'
          }
        ];
			},
			handleGetData() {
				this.$axios.get('/index/getAllCategory').then(res => {
					this.categoryListData = res.data.categoryList;
					this.categoryListData.unshift({ name: '全部', id: '' });
					this.firstLabelList = creatTree(res.data.firstLabelList);
					this.getLivelist();
					this.firstLabelList.forEach(v => {
						if (v.children) {
							v.children.unshift({ name: '全部', id: '' })
						}
					})
					// this.indexes = new Array(creatTree(res.data.firstLabelList)).fill(0);
					this.indexes = this.firstLabelList.map(item => item.children[0].id);
				})
			},
      // 根据学校切换
      changeList(val) {
        this.$route.query.id = val
        this.activeIndex = val;
        this.getLivelist();
      },
      handleOrg(item) {
        this.activeIndex = item.id;
        this.$route.query.id = item.id
        this.pageNum = 1;
        this.getLivelist();
			},
			// 课堂分类场景切换
			handleType() {
				this.$axios.get('/index/getLabelInfo', { categoryId: 8 }).then(res => {
					res.data.forEach(el => {
						if(el.id == 23){
							this.labelName = el.name
						}
						if(el.id !== 23 && el.parentId == 23){
							this.labelList.push(el)
						}
					})
					let arr = creatTree(res.data);
					arr.forEach(el => {
						if(el.id !== 23){
							this.firstLabelList.push(el)
						}
					});
					this.firstLabelList.forEach(v => {
						if (v.children) {
							v.children.unshift({ name: '全部', id: '' })
              this.indexes.push('')
						}
					});
					if(this.$route.query.id){
						this.activeIndex = this.$route.query.id == 1 ? 24 : 25 
					}
					this.pageNum = 1;
					this.getLivelist();
				})
			},
			// 班级== type
			handleGrade({ id }, i) {
				this.indexes.splice(i, 1, id);
				this.pageNum = 1;
				this.getLivelist();
			},
			//获取视频
			getLivelist(){
        let url = '';
        if(this.actives == 1){
          url = '/index/comment/expertLecturesAndTraining';
        }else{
          url = '/index/comment/expertLecturesAndTrainingFile';
        }
				let params = {
					pageNum: this.pageNum,
					pageSize: 8,
          // realTimetTrainingType: [24,25],
				};
				let arr = []
				if(this.activeIndex !== 0){
					arr.push(Number(this.activeIndex))
					params.realTimetTrainingType = arr
				}
        // if(this.$route.query.id == 1 || this.$route.query.id == 2){
        //   params.realTimetTrainingType = this.$route.query.id == 1 ? [24] : [25];
        // }
				let idList = this.indexes.filter(v => v !== '');
				if (idList.length >= 1) {
					params.labelIds = this.indexes;
				}
				this.$axios.post(url, params).then(res => {
					const data = res.data.pageList;
					this.liveList = data;
					this.pages = res.data.pages;
					this.total = res.data.total;
				});
			},
			//分页点击
			pageChange(val){
				this.pageNum = val;
				this.getLivelist();
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>

 ::v-deep .video-catalog i{
	margin-right: 0;
}
 ::v-deep	.el-pagination .el-pager{
		display: inline-flex;
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

	.classify {
		overflow: hidden;
		margin: 30px 0;
		font-family:Microsoft YaHei;
		.parents-title{
			width: 72px;
			text-align: center;
			font-size: 14px;
			line-height: 30px;
			cursor: pointer;
		}
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
			li {
				cursor: pointer;
				float: left;
				text-align: center;
				height: 18px;
				line-height: 18px;
				font-weight:400;
				font-size: 14px;
				background: #F2F3F7;
				margin: 0 0 10px 25px;
				color: #687583;
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
				text-align: center;
				height: 18px;
				line-height: 18px;
				font-weight:400;
				font-size: 14px;
				background: #F2F3F7;
				margin: 0 0 10px 25px;
				color: #687583;
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
	}
   .home-title{
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    svg{
      margin-top: 2px;
    }
  }
  .actives{
    font-size: 24px;
    font-weight: bold;
    color: #333333;
  }
  .acts{
    opacity: 0;
  }
  .video-title{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }
</style>
<style lang="scss">
	.el-dropdown-menu__item{
		font-size: 16px;
	}
	.pagination-wrap {
		.el-pagination.is-background .el-pager li:not(.disabled).active {
			background-color: #035AFF;
		}
	}
</style>
