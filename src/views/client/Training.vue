<template>
	<div v-if="$route.query.type == 1">
		<listenClass></listenClass>
	</div>
	<div v-else-if="$route.query.type == 2" >
		<teachClass/>
	</div>
	<div v-else class="box" style="min-height: 694px;">
		<Swiper location="5"></Swiper>
		<div class="result-box" v-if="messageList.length > 0">
      <p class="item-title">
        <img :src="icons" alt="">
        <span style="margin-left: 7px">活动通知</span>
      </p>
			<div class="item-box" @mouseover="mouseOver" @mouseout="mouseOut">
				<div :class="{ anim: animate == true }">
					<div class="item-content" v-for="(item,index) in messageList" :key="index">
						<span :title="item.name" @click="goDetail(item)" class="item-content-total"><div :class="item.status == 3 ? 'item-content-title bg0' : 'item-content-title bg1'">{{item.status == 3 ? '即将开始' : '评课阶段'}}</div>
						【 听评课活动 】{{ item.name }}</span>
					</div>
				</div>
					
			</div>
      
    </div>
		<div class="video-catalog ">
			<p class="home-title">
					<!-- <i class="iconfont iconnav-vedio"></i> -->
					<span>听评课活动</span>
				<router-link v-if="isTrainList > 0" to="/training?type=1" class="more mores"
          >查看全部
          <img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
            src="@/assets/imgs/arrow-r.png"
            alt=""
            class="moreImg"
        /></router-link>
			</p>
			<div class="classList">
				<div class="item" v-for="(val, index) in liveList" :key="index" @click="goDetail(val)">
					<div class="img-wrap">
          <img :src="val.coverUrl ? val.coverUrl : defaultImg" alt="" :onerror="defaultImg">
				</div>
				<div class="right">
					<p class="title" :title="val.name">【 听评课活动 】{{ val.name }}</p>
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
			<div class="null-data" v-if="isTrainList==0">
				<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
		</div>
		<div class="content-box">
				<div class="left">
					<p class="home-title">
					<!-- <i class="iconfont iconnav-vedio"></i> -->
					<span>专家讲座</span>
					<router-link v-if="isLectureList > 0" to="/training?type=2&id=1" class="more mores"
						>查看全部
						<img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
							src="@/assets/imgs/arrow-r.png"
							alt=""
							class="moreImg"
					/></router-link>
					</p>
					<div class="list">
						<div class="item" v-for="(val, index) in lectureList" :key="index" @click="goDetails(val)">
						<div class="img-wrap">
							<img :src="val.imgUrl ? val.imgUrl : defaultImg" alt="" :onerror="defaultImg">
							<!-- <img :src="val.imgUrl" alt="" :onerror="defaultImg"> -->
							<ul class="tag-list">
								<li v-for="item in val.labels" :key="item.id">{{item}}</li>
							</ul>
						</div>

						<div class="layout-item">
							<span class="name" :title='val.name'>{{val.name}}</span>
						</div>

						<div class="layout-item">
							<span v-if="val.status != 0" style="min-width: 50px"><i class="iconfont icon-watch"></i> {{val.viewed}}</span>
							<span v-else></span>
							<span>{{val.nickName}}</span>
						</div>
						<p class="video-status status1" v-if="val.status == 1">
							<span class="playAnimation">
								<span class="animationli"></span>
								<span class="animationli"></span>
								<span class="animationli"></span>
								<span class="animationli"></span>
							</span>授课中</p>
						<p class="video-status status0" v-if="val.status == 0"><i class="el-icon-alarm-clock"></i>预告中</p>
						<p class="video-status status2" v-if="val.status == 2"><i class="el-icon-refresh-left"></i>已结束</p>
						<p class="time" v-if="val.time">{{val.time}}</p>
					</div>
					</div>
					<div class="null-data" v-if="isLectureList==0">
						<img src="../../assets/imgs/home-null.png" alt="">
						<p>暂无内容，您可以观看其他节目！</p>
					</div>
				</div>
				<div class="right">
					<p class="home-title">
					<!-- <i class="iconfont iconnav-vedio"></i> -->
					<span>专业培训</span>
					<router-link v-if="isLectureLists > 0" to="/training?type=2&id=2" class="more mores"
						>查看全部
						<img src="@/assets/imgs/arrow-r.png" alt="" class="moreImg" /><img
							src="@/assets/imgs/arrow-r.png"
							alt=""
							class="moreImg"
					/></router-link>
					</p>
					<div class="list">
						<div class="item" v-for="(val, index) in lectureLists" :key="index" @click="goDetails(val)">
						<div class="img-wrap">
							<img :src="val.imgUrl ? val.imgUrl : defaultImg" alt="" :onerror="defaultImg">
							<!-- <img :src="val.imgUrl" alt="" :onerror="defaultImg"> -->
							<ul class="tag-list">
								<li v-for="item in val.labels" :key="item.id">{{item}}</li>
							</ul>
						</div>

						<div class="layout-item">
							<span class="name" :title='val.name'>{{val.name}}</span>
						</div>

						<div class="layout-item">
							<span v-if="val.status != 0" style="min-width: 50px"><i class="iconfont icon-watch"></i> {{val.viewed}}</span>
							<span v-else></span>
							<span>{{val.nickName}}</span>
						</div>
						<p class="video-status status1" v-if="val.status == 1">
							<span class="playAnimation">
								<span class="animationli"></span>
								<span class="animationli"></span>
								<span class="animationli"></span>
								<span class="animationli"></span>
							</span>授课中</p>
						<p class="video-status status0" v-if="val.status == 0"><i class="el-icon-alarm-clock"></i>预告中</p>
						<p class="video-status status2" v-if="val.status == 2"><i class="el-icon-refresh-left"></i>已结束</p>
						<p class="time" v-if="val.time">{{val.time}}</p>
					</div>
					</div>
					<div class="null-data" v-if="isLectureLists==0">
						<img src="../../assets/imgs/home-null.png" alt="">
						<p>暂无内容，您可以观看其他节目！</p>
					</div>
				</div>
			</div>
	</div>
</template>

<script>
	import listenClass from './components/trainingItem/listenClass.vue';
	import teachClass from './components/trainingItem/teachClass.vue';
	import icons from '@/assets/imgs/icon_events.png'
	import Swiper from './components/SwiperTrain'
	import VideoList from './components/VideoList'
	import {creatTree, session} from "../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				animate: false,
				timer: null,
				icons: icons,
				isLectureList: 0,
				isLectureLists: 0,
				lectureList: [],
				lectureLists: [],
				trainList: [],
				messageList: [],
				isTrainList: 0,
				liveList: [],
				labelList: [],
				activeIndex: '',
				pageNum: 1,
				pages: 0,
				total: 0,
				labelId:[],
				typeClass: 1, // 课堂分类默认class
				gradeClass: 0,
				gradeData: [
					{ name: '全部', id: 1 },
					{ name: '一年级', id: 2 },
					{ name: '二年级', id: 3 },
					{ name: '三年级', id: 4 },
				],
				categoryListData: [], // 分类数据
				firstLabelList: [], // 2级分类数据
				// indexes: new Array(this.firstLabelList.length).fill(0), // 2级选中
				indexes: [],
				isSelect: false,
				// release: session.get('userInfo').classify // 分类方式（1简单，2复杂）
				release: 2,
				defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"' // 默认图片
			}
		},
		components: {VideoList, Swiper,teachClass, listenClass},
		mounted() {
			// setTimeout(() => {
			// 	if (this.categoryListData.length > 0) {
			// 		this.getLivelist();
			// 	}
			// }, 100)
			this.getLabelList();
			// if (this.release === 2) {
			// 	this.handleGetData();
			// }
			// this.handleGetData();
			// this.$nextTick(() => {
			// 	if (this.categoryListData.length > 0) {
			// 		this.getLivelist();
			// 	}
			// });
			this.getMsgList();
      this.handleType();
			this.getList();
			this.visity();
		},
		computed: {
			productss () {
				return this.$store.state.ifLogin
			},
		},
		watch: {
			productss() {
				this.getLivelist();
			}
		},
		methods: {
			scroll() {
      this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(() => {
        //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.messageList.push(this.messageList[0]); // 将数组的第一个元素添加到数组的
        this.messageList.shift(); //删除数组的第一个元素
        this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 1000);
    },
			mouseOver(){
      console.log('鼠标悬停')
      // this.animate = false;
      clearInterval(this.timer)
    },
    mouseOut(){
      // this.animate = true;
      if(this.messageList.length > 5){
        this.timer=setInterval(this.scroll, 2000);
      }
    },
			goDetail(val){
        console.log("选择进入听评课活动：", val);
				if(val.type == 0){
					if(val.status !== 3 && val.status !== 4 && val.status !== 5){
						return
					}
					if(val.liveStatus == 1 || val.liveStatus == 0){
						this.$router.push('/hplay?themeid='+ val.objectId +'&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''))
					}
					if(val.liveStatus == 2){
						this.$router.push('/pplay?themeid='+ val.objectId +'&type=0&vtype=1' + (val.resources == 2 ? '&etype=0' : ''))
					}
				}else{
					if(val.resources == 3 || val.resources == 4){
						this.$router.push({path: '/Hplays', query: {themeid: val.id}});
					}else{
						this.$router.push({path: 'vplay',
              query:
                  {
                    id: val.id,
                    themeid: val.objectId,
                    type: 2,
                    vtype: 1,
                    resource: val.resources
                  }
            });
					}	
				}
			},
			goDetails(val){
				if(val.type == 0){
					if(val.status == 1 || val.status == 0){
						this.$router.push('/hplay?themeid='+ val.id +'&type=0')
					}
					if(val.status == 2){
						this.$router.push('/pplay?themeid='+ val.id +'&type=0')
					}
				}else{
					this.$router.push({path: 'vplay', query: {themeid: val.id, type: 2}});
				}
			},
			getMsgList(){
				this.$axios.post('/index/comment/list',{
					pageNum: 1,
					pageSize: 999999,
					started: 1
				}).then(res => {
					this.messageList = res.data.pageList;
					if(this.messageList.length > 5) {
						this.timer=setInterval(this.scroll, 2000);
					}
				});
			},
			visity() {
				this.$axios.post('/buried/point/record', { pageName: this.$router.history.current.path, contentType: 0 }).then(res => {
					console.log('记录一次',res)
				});
			},
			// handleGetData() {
			// 	this.$axios.get('/index/getAllCategory').then(res => {
			// 		this.categoryListData = res.data.categoryList;
			// 		this.categoryListData.unshift({ name: '全部', id: '' });
			// 		this.firstLabelList = creatTree(res.data.firstLabelList);
			// 		this.getLivelist();
			// 		this.firstLabelList.forEach(v => {
			// 			if (v.children) {
			// 				v.children.unshift({ name: '全部', id: '' })
			// 			}
			// 		})
			// 		// this.indexes = new Array(creatTree(res.data.firstLabelList)).fill(0);
			// 		this.indexes = this.firstLabelList.map(item => item.children[0].id);
			// 	})
			// },
			// 课堂分类场景切换
			handleType() {
				this.$axios.get('/index/getLabelInfo', { categoryId: 1 }).then(res => {
					this.firstLabelList = creatTree(res.data);
					this.firstLabelList.forEach(v => {
						if (v.children) {
							v.children.unshift({ name: '全部', id: '' })
              this.indexes.push('')
						}
					});
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
				this.getLivelist();
			},
			handleCommand(obj){
				this.activeIndex = obj.index;
				this.labelId = [obj.id];
				this.getLivelist();
			},
			//获取实时研修
			getList(){
				this.$axios.post('/index/comment/expertLecturesAndTraining', {
					pageNum: 1,
					pageSize: 3,
					realTimetTrainingType: [24]
				}).then(res => {
					if(res.data.pageList.length == 0){
						this.$axios.post('/index/comment/expertLecturesAndTrainingFile', {
							pageNum: 1,
							pageSize: 3,
							realTimetTrainingType: [24]
						}).then(ress => {
							if(ress.data.pageList.length > 2){
								this.lectureList = ress.data.pageList.slice(0,2)
							}else{
								this.lectureList = ress.data.pageList;
							}
							this.isLectureList = ress.data.total;
						})
					}else{
						if(res.data.pageList.length > 2){
							this.lectureList = res.data.pageList.slice(0,2)
						}else{
							this.lectureList = res.data.pageList;
						}
						this.isLectureList = res.data.total;
					}
				});
				this.$axios.post('/index/comment/expertLecturesAndTraining', {
					pageNum: 1,
					pageSize: 3,
					realTimetTrainingType: [25]
				}).then(res => {
					if(res.data.pageList.length == 0){
						this.$axios.post('/index/comment/expertLecturesAndTrainingFile', {
							pageNum: 1,
							pageSize: 3,
							realTimetTrainingType: [25]
						}).then(ress => {
							if(ress.data.pageList.length > 2){
								this.lectureLists = ress.data.pageList.slice(0,2)
							}else{
								this.lectureLists = ress.data.pageList;
							}
							this.isLectureLists = ress.data.total;
						})
					}else{
						if(res.data.pageList.length > 2){
							this.lectureLists = res.data.pageList.slice(0,2)
						}else{
							this.lectureLists = res.data.pageList;
						}
						this.isLectureLists = res.data.total;
					}
				});
			},
			getLivelist(){
				let labelIdArr = [];
				this.labelId.forEach(v => {
					if (v !== 0 || v !== '') {
						labelIdArr.push(v);
					}
				});
				const params = {
					pageNum: this.pageNum,
					pageSize: 6,
					// categoryId: 8
				};
				this.$axios.post('/index/comment/list', params).then(res => {
					const data = res.data.pageList;
					this.liveList = data;
					this.pages = res.data.pages;
					this.total = res.data.total;
					this.isTrainList = res.data.total;
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
.content-box{
	width: 1200px;
  margin: 28px auto 0 auto;
	display: flex;
	justify-content: space-between;
	.null-data{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px 0;
		img{
			width: 400px;
			margin-bottom: 17px;
		}
		p{
			font-size: 14px;
    	color: #999;
		}
	}
	.mores{
		float: right;
		font-size: 14px;
		text-decoration: none;
		font-weight: normal;
		// margin-top: 10px;
		color: #035AFF;
	}
	.list{
		display: flex;
		justify-content: space-between;
	}
	.item:hover{
		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		transform: translateY(-5px) scale(1.02);
	}
	.item:hover img{
		transform: scale(0.95);
	}
	// .item:hover .img-wrap {
	// 	transform: scale(0.95);
	// 	// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
	// }
	.tag-list{
			display: flex;
			position: absolute;
			top: 0;
			left: 0;
			flex-wrap: wrap; // 换行
			li{
				min-width: 36px;
				height: 14px;
				margin-bottom: 5px;
				margin-right: 6px;
				padding: 5px 8px;
				border-radius: 8px 0px 8px 0px;
				box-shadow: 0px 2px 3px 0px rgba(255,151,39,0.5);
				text-align: center;
				font-size: 12px;
				background: linear-gradient(88deg, #F8BE56 0%, #FA8846 100%);
				color: #fff;
			}
		}
	.item{
		overflow: hidden;
    position: relative;
    width: 280px;
    height: 250px;
    margin: 20px 0 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    color: #999;
    border-radius: 8px;
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.13);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.13);
    -webkit-transition: all 0.1s;
    transition: all 0.1s;
    cursor: pointer;
		img{
			width: 280px;
			height: 160px;
			border-radius: 8px;
			-webkit-transition: all 0.3s;
			transition: all 0.3s;
		}
		.layout-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			box-sizing: border-box;
			border-bottom: solid 1px #F1F2F4;
			height: 45px;
			font-size: 12px;
			padding:0 10px;
			.name{
				overflow: hidden;
				// max-width: 190px;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 14px;
        font-weight: 600;
				color: #333333;
			}
			i{
				margin-right: 5px;
				font-size: 14px;
				vertical-align: top;
			}
		}
	}
	.left{
		width: 580px;
	}
	.right{
		width: 580px;
	}
}
.result-box {
	z-index: 120;
  position: absolute;
  width: 250px;
  height: 310px;
  right: 30px;
  top: 78px;
  background: #ffffff;
  border-radius: 6px;
  padding: 25px;
	box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
  .item-title {
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 34px;
    color: #2f3742;
    display: flex;
    justify-content: left;
    align-items: center;
  }
	.item-box{
		overflow: hidden;
		height: 285px;
	}
  .item-content {
		height: 48px;
		margin-left: 1px;
    padding-top: 9px;
    .item-content-title {
			display: inline-block;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #fff;
			padding: 0 8px;
			border-radius:1px 8px 8px 8px;
    }
		.bg0{
			background: #FE3271;
		}
		.bg1{
			background: #305EF5;
		}
		.bg2{
			background: #687583;
		}
    .item-content-total {
			cursor: pointer;
			display: inline-block;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #2f3742;
			overflow:hidden;
			text-overflow:-o-ellipsis-lastline;
			text-overflow:ellipsis;
			display:-webkit-box;
			-webkit-line-clamp:2;
			line-clamp:2;
			-webkit-box-orient:vertical;
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
.classList{
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
		font-size: 24px;
    font-weight: bold;
    color: #333333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    svg{
      margin-top: 2px;
    }
  }
	.anim {
		transition: all 1s;
		margin-top: -57px !important;
	}
	.time{
		position: absolute;
		right: 8px;
		bottom: 96px;
		padding: 3px 6px;
		border-radius:10px;
		font-size: 12px;
		background:rgba(0,0,0,.4);
		color: #fff;
	}
	.video-catalog{
		margin-top: 22px;
	}
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
