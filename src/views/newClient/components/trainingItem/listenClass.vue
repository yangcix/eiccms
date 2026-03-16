<template>
	<div style="padding: 40px 0;background-color: white;min-height: 694px;">
		<Swiper location="13"></Swiper>
		<div class="video-catalog ">
			<p class="home-title">
				<!-- <i class="iconfont iconnav-vedio"></i> -->
				<span>听评课活动</span>
        <svg width="30" height="10" viewBox="0 0 30 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.32499 1.18183C3.87313 0.173917 2.68975 -0.276855 1.68183 0.175006C0.673917 0.626867 0.223145 1.81025 0.675006 2.81817L4.32499 1.18183ZM29.2881 2.89594C29.7829 1.9084 29.3835 0.706712 28.3959 0.211901C27.4084 -0.282911 26.2067 0.116524 25.7119 1.10406L29.2881 2.89594ZM2.5 2C0.675006 2.81817 0.675553 2.81939 0.67611 2.82063C0.67631 2.82107 0.676881 2.82234 0.677282 2.82323C0.678086 2.82501 0.678935 2.82688 0.67983 2.82885C0.68162 2.83279 0.683593 2.8371 0.68575 2.84178C0.690066 2.85114 0.695122 2.86197 0.700937 2.87423C0.712565 2.89875 0.727237 2.92899 0.745095 2.96457C0.780802 3.03571 0.82932 3.12832 0.891814 3.23928C1.01671 3.46104 1.19805 3.75719 1.44528 4.10227C1.93956 4.7922 2.70066 5.6825 3.80364 6.56302C6.03836 8.34703 9.56418 10 14.8418 10V6C10.4675 6 7.8224 4.65297 6.29921 3.43698C5.52323 2.8175 5.00862 2.2078 4.69693 1.77273C4.54117 1.55531 4.43696 1.38271 4.37705 1.27634C4.34714 1.22324 4.32844 1.18694 4.32003 1.17019C4.31584 1.16183 4.31422 1.15838 4.31509 1.16019C4.31552 1.1611 4.31657 1.16333 4.31822 1.16692C4.31905 1.16872 4.32003 1.17085 4.32116 1.17334C4.32172 1.17458 4.32233 1.17591 4.32296 1.17732C4.32328 1.17803 4.32379 1.17916 4.32395 1.17951C4.32447 1.18066 4.32499 1.18183 2.5 2ZM14.8418 10C20.1179 10 23.7078 8.34867 26.0066 6.58768C27.1432 5.71698 27.9413 4.83736 28.4648 4.15685C28.7266 3.81642 28.9206 3.52462 29.0549 3.30672C29.122 3.19769 29.1743 3.10691 29.2128 3.03749C29.2321 3.00277 29.2479 2.97337 29.2604 2.94965C29.2667 2.9378 29.2721 2.92736 29.2767 2.91839C29.279 2.91391 29.2811 2.90979 29.283 2.90605C29.284 2.90417 29.2848 2.90239 29.2857 2.90071C29.2861 2.89987 29.2867 2.89867 29.2869 2.89825C29.2875 2.89708 29.2881 2.89594 27.5 2C25.7119 1.10406 25.7125 1.10296 25.713 1.10189C25.7132 1.10156 25.7137 1.1005 25.714 1.09984C25.7147 1.09852 25.7153 1.09729 25.7159 1.09614C25.7171 1.09385 25.7181 1.09191 25.7189 1.09031C25.7205 1.08711 25.7215 1.08527 25.7217 1.08477C25.7223 1.08376 25.72 1.08805 25.7149 1.09727C25.7047 1.11574 25.683 1.15387 25.6491 1.20891C25.5812 1.31913 25.465 1.49608 25.2942 1.71815C24.9523 2.16264 24.3956 2.78302 23.5741 3.41232C21.9567 4.65133 19.2176 6 14.8418 6V10Z" fill="url(#paint0_linear_19_6572)"/>
          <defs>
          <linearGradient id="paint0_linear_19_6572" x1="2.81646" y1="2.375" x2="29.0823" y2="2.375" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3490F7"/>
          <stop offset="1" stop-color="#2F60F6"/>
          </linearGradient>
          </defs>
          </svg>
			</p>
			<div class="classify" v-for="(item, i) in firstLabelList" :key="i">
				<div class="namList">
					<div class="parents-title">{{ item.name }}：</div>
					<ul class="grade">
						<li v-for="(itemChildren, j) in item.children" :key="j" :class="{ act: indexes[i] === itemChildren.id }" @click="handleGrade(itemChildren,i,j)">
							{{ itemChildren.name }}
						</li>
					</ul>
				</div>
			</div>
			<div class="null-data" v-if="!liveList.length">
				<img src="../../../../assets/imgs/home-null.png" alt="">
				<p>暂无内容，您可以观看其他节目！</p>
			</div>
      <div class="contentBox">
        <div class="item" v-for="(val, index) in liveList" :key="index" @click="goDetail(val)">
					<div class="img-wrap">
          <img :src="val.coverUrl ? val.coverUrl : defaultImg" alt="" :onerror="defaultImg">
				</div>
				<div class="right">
					<p class="title" :title="val.name">{{ val.name }}</p>
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
			<div class="pagination-wrap">
				<el-pagination
					background
					:page-size="10"
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
  import img from '@/assets/imgs/titleicon.png'
	import Swiper from '../Swiper'
	import VideoList from '../VideoList'
	import {creatTree, session} from "../../../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
        defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
        img: img,
				liveList: [],
				labelList: [],
        orgId: this.$route.query.deptId ? this.$route.query.deptId : '',
        teacherId: this.$route.query.id ? this.$route.query.id : '',
        teacherList: [],
				activeIndex: this.$route.query.deptId ? this.$route.query.deptId : 0,
        active: this.$route.query.id ? this.$route.query.id : 0,
				pageNum: 1,
				pages: 0,
				total: 0,
				labelId:[],
				typeClass: 0, // 课堂分类默认class
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
			}
		},
		components: {VideoList, Swiper},
		mounted() {
			this.getLabelList();
      this.getTeacherList();
			this.handleType();
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
			goDetail(val){
				// if(val.status !== 4){
				// 	return
				// }
				if(val.type == 0){
					if(val.status !== 3 && val.status !== 4 && val.status !== 5){
						return
					}
					if(val.liveStatus == 1 || val.liveStatus == 0){
						this.$router.push('/hplay?themeid='+ val.objectId +'&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''))
					}
					if(val.liveStatus == 2){
						this.$router.push('/pplay?themeid='+ val.objectId +'&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''))
					}
				}else{
					if(val.resources == 3 || val.resources == 4){
						this.$router.push('/Hplays?themeid='+ val.id)
					}else{
						this.$router.push('/vplay?themeid='+ val.objectId +'&type=2&vtype=1')
					}
				}
				
			},
			visity() {
				this.$axios.post('/buried/point/record', { pageName: this.$router.history.current.path, contentType: 0 }).then(res => {
					console.log('记录一次',res)
				});
			},
      getTeacherList() {
        let data = new FormData();
        data.append('orgId', this.orgId);
        data.append('famous', 1);
        this.$axios.post('/index/getUser', data).then(res => {
          this.teacherList = res.data;
        })
      },
			handleType() {
				this.$axios.get('/index/getLabelInfo', { categoryId: 1 }).then(res => {
					this.firstLabelList = creatTree(res.data);
					this.firstLabelList.forEach(v => {
						if (v.children) {
							v.children.unshift({ name: '全部', id: '' })
              this.indexes.push('')
						}
					});
					console.log('ddd',this.firstLabelList)
					this.pageNum = 1;
					this.getLivelist();
				})
			},
      // 根据学校切换
      changeList(val) {
        this.orgId = '';
        this.teacherId = '';
        this.activeIndex = val;
        this.active = 0;
        this.getTeacherList();
        this.getLivelist();
      },
      changeItem(val) {
        this.teacherId = '';
        this.active = val;
        this.getLivelist();
      },
			handleOrg(item) {
        this.activeIndex = item.orgId;
        this.active = 0;
        this.teacherId = '';
        this.orgId = item.orgId;
        this.pageNum = 1;
        this.getTeacherList();
        this.getLivelist();
			},
			// 根据教师切换
			handleTeacher(item) {
				this.active = item.userId;
        this.teacherId = item.userId;
        this.pageNum = 1;
        this.getLivelist();
			},
			handleGrade({ id }, i) {
				this.indexes.splice(i, 1, id);
				this.pageNum = 1;
				this.getLivelist();
			},
			//获取所有学校
			getLabelList(){
				this.$axios.get('/index/getSchool').then(res => {
					this.labelList = res.data;
				});
			},
			//获取视频
			getLivelist(){
				const params = {
					pageNum: this.pageNum,
					pageSize: 10,
					// started: 1
				};
				let idList = this.indexes.filter(v => v !== '');
				console.log('dddd', this.indexes)
				if (idList.length >= 1) {
					params.labelIds = this.release === 1 ? labelIdArr : this.indexes;
				}
				this.$axios.post('/index/comment/list', params).then(res => {
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
				window.scrollTo(0, 0);
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
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
		// overflow: hidden;
		margin-top: 30px;
		// display: flex;
		font-family:Microsoft YaHei;
		.parents-title{
			font-size: 14px;
    float: left;
    height: 14px;
    border-radius: 15px;
    text-align: center;
    line-height: 14px;
    padding: 7px 15px;
    font-weight: 400;
		}
		.namList {
			// display: flex;
			// padding-bottom: 24px;
		}

		.name {
			font-size: 14px;
			float: left;
			height: 18px;
			border-radius: 15px;
			text-align: center;
			line-height: 18px;
			padding: 7px 15px;
			font-weight:400;
		}

		.classes {
			width: 100%;
			// padding-bottom: 24px;
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
				font-weight: 400;
				font-size: 14px;
				background: #F2F3F7;
				margin: 0 0 10px 25px;
				color: #687583;
				padding: 7px 16px;
				border-radius: 20px;
				-webkit-transition: background .3s;
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
</style>
<style lang="scss" scoped>
 ::v-deep .video-catalog i{
	margin-right: 0;
}
	.el-dropdown-menu__item{
		font-size: 16px;
	}
  .video-catalog{
    margin-top: 28px;
  }
	.pagination-wrap {
		.el-pagination.is-background .el-pager li:not(.disabled).active {
			background-color: #035AFF;
		}
	}
  .home-title{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    svg{
      margin-top: 2px;
    }
  }
  .contentBox{
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
</style>
