<template>
	<div class="content-main-wrap" v-loading="loading" element-loading-background="rgba(255, 255, 255, 1)">
	<p class="content-title">概览</p>
		<div v-if="seeHome == 1" class="content-overflow">
			<div class="content-wrap" style="display: -webkit-box;">
				<div class="item1">
					<p class="item-title">平台数据统计</p>
					<ul class="theme-list" v-if="plateFormData">
						<li>
							<p>直播主题总数</p>
							<p>{{plateFormData.theme.total}}</p>
						</li>
						<li>
							<p>直播观看总数</p>
							<p>{{plateFormData.theme.viewed}}</p>
						</li>
						<li>
							<p>视频总数</p>
							<p>{{plateFormData.file.total}}</p>
						</li>
						<li>
							<p>视频观看总数</p>
							<p>{{plateFormData.file.viewed}}</p>
						</li>
						<li>
							<p>互动课堂总数</p>
							<p>{{plateFormData.interactive.total}}</p>
						</li>
						<!-- <li v-if="version != 1">
							<p>专递课堂总数</p>
							<p>{{plateFormData.cross.total}}</p>
						</li> -->
					</ul>
				</div>
				<div v-if="version == 3 && uiType == 1" class="quickneed" style="height: 230px;">
					<div class="quick center" style="height: 160px;">
						<h2 @click="openShow">数据驾驶舱</h2>
					</div>
				</div>
				<div v-else class="quickneed" style="height: 230px;background-color: #ffffff;">
					<p class="item-title space-title">剩余存储空间</p>
						<div class="space-wrap">
							<div class="space-num" v-if="spaceData">
								<p class="num " :class="spaceData.free < spaceData.capacity * 0.1 ? 'lower' : ''">{{spaceData.free}}G
									<span v-if="spaceData.free < spaceData.capacity * 0.1">容量低</span>
								</p>
								<p>预计可存储视频{{spaceData.restTime}}小时</p>
							</div>
							<div class="space-chart">
								<div id="space"></div>
								<ul>
									<li>
										<p class="color-wrap color1"></p>
										<span class="color-desc">已使用空间</span>
									</li>
									<li>
										<p class="color-wrap color2"></p>
										<span class="color-desc">可用空间</span>
									</li>
								</ul>
							</div>
						</div>
				</div>
			</div>
			<div class="content-wrap2">
				<div class="item1 max-wrap">
					<p class="item-title">数据走势</p>
					<div>
						<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
							<el-menu-item index="0" class="menu-item">视频资源</el-menu-item>
							<el-menu-item index="1">直播次数</el-menu-item>
						</el-menu>
						<div class="line"></div>
					</div>
					<div class="chart-options">
						<p class="video-space" v-show="activeIndex == 0">总视频大小：<span>{{fileSize}}</span>G</p>
						<p class="video-space" v-show="activeIndex == 1">主题总量：<span>{{liveTotal}}</span>次</p>
						<p>时间颗粒：</p>
						<el-select v-model="time" class="width-4" @change="timeChange">
							<el-option
								v-for="item in timeList"
								:key="item.type"
								:label="item.label"
								:value="item.type">
							</el-option>
						</el-select>
					</div>
					<div class="statistics-wrap">
						<div id="main"></div>
					</div>
				</div>
				<div class="item2">
					<p v-if="version == 3 && uiType == 1" class="item-title space-title">剩余存储空间</p>
						<div v-if="version == 3 && uiType == 1" class="space-wrap">
							<div class="space-num" v-if="spaceData">
								<p class="num " :class="spaceData.free < spaceData.capacity * 0.1 ? 'lower' : ''">{{spaceData.free}}G
									<span v-if="spaceData.free < spaceData.capacity * 0.1">容量低</span>
								</p>
								<p>预计可存储视频{{spaceData.restTime}}小时</p>
							</div>
							<div class="space-chart">
								<div id="space"></div>
								<ul>
									<li>
										<p class="color-wrap color1"></p>
										<span class="color-desc">已使用空间</span>
									</li>
									<li>
										<p class="color-wrap color2"></p>
										<span class="color-desc">可用空间</span>
									</li>
								</ul>
							</div>
						</div>
					<div class="quickneed">
					<div class="quick">
						<p class="quickneed-title">快捷操作</p>
						<ul class="quick-order">
							<li v-for="val in quickOrderList" :key="val.order" @click="toQuick(val)">
								<span class="thing-name">{{val.order}}</span>
							</li>
						</ul>
					</div>
					<div v-if="version != 3" class="need">
						<p class="quickneed-title">待办事项</p>
						<ul v-if="toDoList.length > 0" class="quick-order">
							<li v-for="(val,index) in toDoList" :key="index" @click="goTo(val.category,val.status)">
								<span class="num">{{val.num}}条</span>
								<span class="thing-name">{{val.status | status}}{{val.category | category}}</span>
							</li>
						</ul>
						<div v-else class="gary">
							无待办事项
						</div>
					</div>
				</div>
				</div>
			</div>
		</div>
		<div v-else class="no-found">
			<img src="../../assets/imgs/home-null.png" alt="">
				<p>暂无访问权限！</p>
		</div>
	</div>
</template>

<script>
	import { session } from "@/assets/js/utils";
	import { checkPrime } from "crypto";
	import * as echarts from 'echarts';
	import { mapState , mapActions } from 'vuex';
	export default {
		name: '',
		data() {
			return {
				fileSize: '',
				liveTotal: '',
				loading: false,
				seeHome: null,
				plateFormData: '',
				spaceData: '',
				toDoList: [],
				activeIndex: '0',
				timeList: [{label: '近7日', type: 1}, {label: '近30日', type: 2},
					{label: '近1年', type: 3}, {label: '近3年', type: 4}],
				time: 1,
				myChart: '',
				StatisticsData: '',
				uiType: localStorage.getItem('uiType'),
				version: localStorage.getItem('version'),
				quickOrder: [],
				quickOrders: JSON.parse(localStorage.getItem('sysInfo')).recordType == 1 ? [
					{
						order:'创建直播',
						url:'/sm/themeaddedit',
						vShow:['1','2','3']
					},
					{
						order:'上传视频',
						url:'/sm/fileaddedit',
						vShow:['1','2','3']
					},
					{
						order:'创建互动课堂',
						url:'/sm/interactiveaddedit',
						vShow:['2','3']
					},
					// {
					// 	order:'创建专递课堂',
					// 	url:'/sys/crossSchoolInteractionAddEdit',
					// 	vShow:['1','2']
					// },
					// {
					// 	order:'创建评课',
					// 	url:'/sm/commentaddedit',
					// 	vShow:['1','2','3']
					// },
					{
						order:'智能巡课',
						url:'/recordhome',
						vShow:['1','2','3']
					},
				] : [
					{
						order:'创建直播',
						url:'/sm/themeaddedit',
						vShow:['1','2','3']
					},
					{
						order:'上传视频',
						url:'/sm/fileaddedit',
						vShow:['1','2','3']
					},
					{
						order:'创建互动课堂',
						url:'/sm/interactiveaddedit',
						vShow:['2','3']
					},
					// {
					// 	order:'创建专递课堂',
					// 	url:'/sys/crossSchoolInteractionAddEdit',
					// 	vShow:['1','2']
					// },
					// {
					// 	order:'创建评课',
					// 	url:'/sm/commentaddedit',
					// 	vShow:['1','2','3']
					// },
				]
			}
		},
		mounted() {
			this.seeHome = window.localStorage.getItem('seeHome')
			this.$nextTick(()=> {
				this.getQuickOrder()
				this.getSystemList()
				this.checkPms()
			})
		},
		computed: {
			quickOrderList() {
				return this.quickOrder.filter((item) => {
					return item.vShow.includes(this.version)
				})
			},
			// ...mapState({
			// 	sysModule: 'sysModule',
			// })
			oldSeeHome() {
				return this.$store.state.seeHome
			}
		},
		watch: {
			oldSeeHome: {
				handler(newVal, oldVal){
					this.seeHome = newVal
				},
				deep: true
			}
		},
		methods: {
			getQuickOrder(){
				this.$axios.get('/sys/overview/quickActions').then(res => {
					for (let index = 0; index < res.data.length; index++) {
						let obj = {
							order: '',
							url: '',
							vShow:[]
						};
						switch (res.data[index]) {
							case '创建直播':
								obj = {
									order: '创建直播',
									url:'/sm/themeaddedit',
									vShow:['1','2','3']
								};
								break;
							case '上传视频':
								obj = {
									order:'上传视频',
									url:'/sm/fileaddedit',
									vShow:['1','2','3']
								};
								break;
							case '创建互动课堂':
								obj = {
									order:'创建互动课堂',
									url:'/sm/interactiveaddedit',
									vShow:['2','3']
								};
								break;
							case '智能巡课':
								if(JSON.parse(localStorage.getItem('sysInfo')).recordType == 1){
									obj =	{
										order:'智能巡课',
										url:'/recordhome',
										vShow:['1','2','3']
									};
								}
								break;
							default:
								break;
						}
						this.quickOrder.push(obj);
					}
				});
			},
			getSystemList(){
				this.$axios.get('/sys/system/list').then(res => {
					// this.plateFormData = res.data;
				});
			},
			openShow() {
				window.open('/bigData', '_target')
			},
			checkPms() {
				setTimeout(() => {
					if(this.seeHome == 1) {
						this.getPlateformData();
						this.getDataStatistics();
						this.getSpaceData();
						this.getToDoList();
						this.loading = false
					} else {
						this.loading = false
					}
				}, 500);
			},
			// // //修改系统类型
			// ...mapActions({
      //   commitSysModule:'commitSysModule',
      // }),
			//平台数据
			getPlateformData(){
				this.$axios.get('/index/systemInfo').then(res => {})
				this.$axios.get('/sys/overview/platformStatistics').then(res => {
					this.plateFormData = res.data;
				});
			},
			//剩余存储空间
			getSpaceData(){
				this.$axios.get('/sys/overview/storageInfo').then(res => {
					this.spaceData = res.data;
					this.$nextTick(() => {
						this.initSpaceChart(this.spaceData);
					})
				});
			},
			//初始化剩余空间饼图
			initSpaceChart(data){
				var myChart = echarts.init(document.getElementById('space'));
				myChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{b}空间 : {c}G ({d}%)'
					},
					series: [
						{
							type: 'pie',
							radius: ['50%', '70%'],
							label: {
								show: false,
							},
							color: ['#409EFF', '#FF4040'],
							data: [
								{value: data ? data.capacity - data.free : 0, name: '已使用'},
								{value: data ? data.free : 0, name: '可使用'}
							]
						}
					]});
			},
			//获取待办事项
			getToDoList(){
				this.$axios.get('/sys/overview/toDoList').then(res => {
					this.toDoList = res.data;
				})
			},
			//待办事项跳转
			goTo(type,status){
				let url = type == 'theme' ? '/sm/theme' : '/sm/file';
				this.$router.push({path: url, query: {type: status}});
				// if(type == 'theme'){
				// 	this.$router.push({path: url, query: {type: status}});
				// }else{
				// 	this.$router.push(url);
				// }
			},
			// 快捷方式
			toQuick(val){
				console.log(this.$parent)
				// this.$parent.changeModule(2)
				this.$router.push(val.url);
			},
			//获取统计数据
			getDataStatistics(type){
				this.$axios.get('/sys/overview/dataStatistics', {
					type: this.time
				}).then(res => {
					this.StatisticsData = res.data;
					let sum = 0;
					let sums = 0;
					res.data.themeY.forEach(element => {
						sum += element;
					});
					res.data.fileY.forEach(element => {
						sums += parseFloat(element);
					});
					this.fileSize = Math.floor(sums*1000)/1000;
					this.liveTotal = sum;
					if(type == 1){ //改变数据
						this.chartChange();
					}else{
						this.$nextTick(() => {
								this.initVideoChart({x: this.StatisticsData.fileX, y: this.StatisticsData.fileY,name: '流量/G'});
						})
					}
				})
			},
			//统计切换
			handleSelect(index){
				this.activeIndex = index;
				this.chartChange();
			},
			//时间切换
			timeChange(val){
				this.time = val;
				this.getDataStatistics(1);
			},
			//图表数据变化
			chartChange(){
				let data;
				if(this.activeIndex == 0){ //视频
					data= {
						x: this.StatisticsData.fileX,
						y: this.StatisticsData.fileY,
						name: '流量/G'
					}
				}else{
					data= {
						x: this.StatisticsData.themeX,
						y: this.StatisticsData.themeY,
						name: '次数/次'
					}
				}
				this.myChart.setOption({
					xAxis: {
						type: 'category',
						data: data.x
					},
					yAxis: {
						name: data.name,
						type: 'value',
					},
					series: [{
						name: data.name,
						data: data.y,
						type: 'line'
					}]
				})
			},
			//初始化统计
			initVideoChart(data){
				this.myChart = echarts.init(document.getElementById('main'));
				this.myChart.setOption({
					xAxis: {
						type: 'category',
						data: data.x,
						name: '日期'
					},
					yAxis: {
						name: data.name,
						type: 'value',
						minInterval: 1,
					},
					tooltip: {	
					},
					series: [
						{
							name: data.name,
							type: "line",
							data: data.y,
							smooth: true, // 折现圆滑
							symbolSize: 11, // 设定实心点的大小
							lineStyle: {
								color: "#3869FF" // 线的颜色
							},
							itemStyle: {
								color: "#6A5ACD",
								normal: {
									borderWidth: 3,
									color: "#3869FF", // 圆点的颜色
									lineStyle: {
										// 系列级个性化折线样式
										width: 7,
										type: "solid",
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{
												offset: 0,
												color: "#3869FF"
											},
											{
												offset: 1,
												color: "#3869FF"
											}
										]) //线条渐变色
									}
								},
								emphasis: {
									borderWidth: 5,
									color: "#ffffff",
									borderColor: "#6A5ACD",
									lineStyle: {
										// 系列级个性化折线样式
										width: 2,
										type: "dotted",
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{
												offset: 0,
												color: "#1E90FF"
											},
											{
												offset: 1,
												color: "#0000FF"
											}
										])
									}
								}
							}, //线条样式
							areaStyle: {
								normal: {
									//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
										{
											offset: 0,
											color: "rgba(56, 105, 255, 0.39)"
										},
										{
											offset: 0.34,
											color: "rgba(56, 105, 255, 0.25)"
										},
										{
											offset: 1,
											color: "rgba(56, 105, 255, 0.00)"
										}
									])
								}
							}
						}
					]
				});
			},
		},
		filters: {
			status(val){
				let arr = ['待提交', '待审核', '待发布'];
				return arr[val];
			},
			category(val){
				return val == 'theme' ? '直播主题' : '视频';
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	 ::v-deep .el-dialog{
		margin-top: 1vh !important;
	}
	 ::v-deep .el-dialog__header{
		padding: 0 !important;
	}
	 ::v-deep .dialog-wrap{
		padding: 0px !important;
	}
	 ::v-deep .el-dialog__body{
		padding: 0px !important;
	}
	 ::v-deep .el-dialog__wrapper{
		overflow: hidden !important;
	}
	.content-main-wrap{
		position: relative;
		color: #303133;
		background: #F1F2F4;
		.no-found{
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction:column;
		}
		img{
			width: 560px;
    	margin-bottom: 17px;
		}
	}
	.content-overflow{
		// margin-top: 50px;
		// position: absolute;
		overflow-y: auto;
		overflow-x: auto;
		height: 100%;
		width: 100%;
	}
	.content-wrap,.content-wrap2{
		display: flex;
		justify-content: space-between;
		width: 100%;
		min-width: 1200px;
		margin-bottom: 11px;
		.item1{
			min-width: 900px;
			flex: 1;
			margin-right: 30px;
			background: #fff;
		}
		.item2{
			// min-width: 400px;
			width: 480px;
			// height: 230px;
			background: #fff;
		}
		.quickneed{
			width: 480px;
			min-width: 400px;
			
			.quickneed-title {
					font-size: 20px;
					font-weight: bold;
					margin-bottom:10px;
				}
			.quick{
				height: 116px;
				padding: 35px 45px;
				background: #fff;
				.quick-order{
					display: flex;
					justify-content: flex-start;
					flex-direction: row;
          flex-wrap: wrap;
					li{
						width: 110px;
						margin: 23px 16px 0 0;
						cursor: pointer;
						.thing-name{
							font-size: 14px;
						}
					}
				}

			}
			.need{
				padding: 35px 45px;
				background: #fff;
				margin-top:30px;
				height: 222px;
				
				.quick-order{
					height: 180px;
					overflow-y: auto;
					width: 430px;
					li{
						margin-top: 23px;
						cursor: pointer;
						.num{
							margin-right: 10px;
							font-size: 16px;
							color: #409EFF;
						}
						.thing-name{
							font-size: 14px;
						}
					}
				}
			}

		}
		.max-wrap{
			// height: 510px;
			.menu-item{
				margin-left: 55px;
			}
			.chart-options{
				display: flex;
				margin: 28px 0 0 45px;
				font-size: 14px;
				line-height: 40px;
				.video-space{
					width: 200px;
					span{
						color: #409EFF;
					}
				}
			}
			.statistics-wrap{
				width: 950px;
				height: 232px;
				#main{
					width: 100%;
					height: 100%;
				}
			}
		}
		.item-title{
			margin: 35px 0 45px 45px;
			font-size: 20px;
			font-weight:bold;
		}
		.space-title{
			margin-bottom: 0;
		}
	}
	.content-wrap2 {
		margin-bottom: 0;
	}
	.theme-list{
		display: flex;
		margin: 0 45px;
		justify-content: space-between;
		li{
			// margin-right: 20px;
			p:first-child{
				font-size: 14px;
			}
			p:last-child{
				margin-top: 24px;
				font-size: 18px;
				color: #409EFF;
			}
		}
	}
	.space-wrap{
		display: flex;
		.space-num{
			margin-left: 45px;
			font-size: 14px;
			.num{
				margin: 45px 0 25px 0;
				font-size: 18px;
				color: #409EFF;
			}
			.lower{
				color: #FF4040;
				span{
					margin-left: 25px;
					font-size: 12px;
				}
			}
		}
		.space-chart{
			margin-left: 100px;
			li{
				display: flex;
				margin-top: 15px;
			}
			#space{
				width: 90px;
				height: 90px;
			}
			.color-wrap{
				width: 18px;
				height: 18px;
				margin-right: 7px;
			}
			.color-desc{
				font-size: 14px;
			}
			.color1{
				background: #409EFF;
			}
			.color2{
				background: #FF4040;
			}
		}
	}
	.wait-thing{
		margin-left: 45px;
		li{
			margin-top: 33px;
			cursor: pointer;
			.num{
				margin-right: 10px;
				font-size: 16px;
				color: #409EFF;
			}
			.thing-name{
				font-size: 14px;
			}
		}
	}
	.center{
		display: flex;
		justify-content: center;
		align-items: center;
		color: #409EFF;
		cursor: pointer;
	}
	.gary{
		color:#B3B6BA;
		text-align: center;
		margin-top: 100px;
		font-size: 22px;
	}
</style>

