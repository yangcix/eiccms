<template>
	<div class="font-color">
		<p class="item-title">概况</p>
		<ul class="theme-statistics-item">
			<li class="bg-color11">
				<p class="i-wrap bg-color12"><i class="iconfont icon-zongshichang"></i></p>
				<div class="data-wrap">
					<p>{{themeInfo.totalTime}}</p>
					<p class="data-title">总时长</p>
				</div>
			</li>
			<li class="bg-color21">
				<p class="i-wrap bg-color22"><i class="iconfont icon-guankancishu"></i></p>
				<div class="data-wrap">
					<p>{{themeInfo.totalViewed}}</p>
					<p class="data-title">观看总次数</p>
				</div>
			</li>
			<li class="bg-color31" @click="showTable(1)">
				<p class="i-wrap bg-color32"><i class="iconfont icon-guankanrenshu"></i></p>
				<div class="data-wrap">
					<p>{{themeInfo.totalVisitor}}</p>
					<p class="data-title">直播观看总人数</p>
					<p class="to-detail">详情 ></p>
				</div>
			</li>
			<li class="bg-color41" @click="showTable(0)">
				<p class="i-wrap bg-color42"><i class="iconfont icon-weiguankan"></i></p>
				<div class="data-wrap">
					<p>{{themeInfo.unvisited}}</p>
					<p class="data-title">未观看人数（指定用户）</p>
					<p class="to-detail">详情 ></p>
				</div>
			</li>
		</ul>
		
		<p class="item-title">数据走势</p>
		<div class="chart-wrap">
			<div id="main"></div>
		</div>
		
		<div class="table-shade" v-if="viewedShow">
			<div class="table-content">
				<p class="dialog-title">
					<span>在线观看用户</span>
					<span @click="viewedShow = false;searchKey='';searchType=''"><i class="iconfont icon-guanbi"></i></span>
				</p>
				<div class="search-operat">
					<div style="margin-left: 56px">
						<el-input v-model="searchKey" class="width-2" placeholder="请输入用户名关键字进行查询" @keyup.enter.native="search(1)" clearable></el-input>
						<span class="search-desc">用户属性：</span>
						<el-select v-model="searchType" placeholder="请选择" class="width-7">
							<el-option
								v-for="item in searchTypeList"
								:key="item.value"
								:label="item.name"
								:value="item.value">
							</el-option>
						</el-select>
						<el-button type="primary" class="search-btn" @click="search(1)">查询</el-button>
						<el-button type="primary" class="search-btn" @click="exportTable(1)" >导出</el-button>
					</div>
				</div>
				
				<div class="data-table table-border">
					<el-table
						v-loading="loading"
						:data="tableData"
						style="width: 100%">
						<el-table-column
							prop="nickName"
							align="center"
							label="用户名">
						</el-table-column>
						<el-table-column
							prop="ipAddress"
							align="center"
							label="IP">
						</el-table-column>
						<el-table-column
							align="center"
							label="用户属性">
							<template slot-scope="scope">
								{{scope.row.role | role}}
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							label="观看时长">
							<template slot-scope="scope">
								{{scope.row.totalTime}}分钟
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table-page">
					<el-pagination
						layout="prev, pager, next"
						@current-change="pageChange1"
						:current-page="pageNum"
						:page-count="pages">
					</el-pagination>
				</div>
			</div>
		</div>
		
		<div class="table-shade" v-if="unViewedShow">
			<div class="table-content">
				<p class="dialog-title">
					<span>未观看用户</span>
					<span @click="unViewedShow = false;nickName = ''"><i class="iconfont icon-guanbi"></i></span>
				</p>
				<div class="search-operat">
					<div style="margin-left: 56px">
						<el-input v-model="nickName" class="width-2" placeholder="请输入用户名关键字进行查询" @keyup.enter.native="search(0)" clearable></el-input>
						<el-button type="primary" class="search-btn" @click="search(0)">查询</el-button>
						<el-button type="primary" class="search-btn" @click="exportTable(0)" >导出</el-button>
					</div>
				</div>
				
				<div class="data-table table-border">
					<el-table
						v-loading="loading"
						:data="tableData"
						style="width: 100%">
						<el-table-column
							prop="nickName"
							align="center"
							label="用户名">
						</el-table-column>
						<el-table-column
							align="center"
							label="用户属性">
							<template slot-scope="scope">
								{{scope.row.role | role}}
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table-page">
					<el-pagination
						layout="prev, pager, next"
						@current-change="pageChange0"
						:current-page="pageNum"
						:page-count="pages">
					</el-pagination>
				</div>
			</div>
		</div>
		</div>
</template>

<script>
	import * as echarts from 'echarts';
	import axios from 'axios'
	export default {
		name: '',
		data() {
			return {
				searchType: '',
				searchKey: '',
				nickName: '',
				tableData: [],
				permission: '',
				pageNum: 1,
				pages: 0,
				searchTypeList: [{name: '全部', value: ''}, {name: '学生', value: 0},{name: '教师', value: 1},{name: '其他', value: 2}],
				viewedShow: false,
				unViewedShow: false,
				themeInfo: {},
				loading: false, // 表格加载
			}
		},
		components: {},
		mounted() {
			this.getThemeInfo();
		},
		methods: {
			//显示表格
			showTable(type){
				this.pageNum = 1
				if(type == 1){ //观看
					this.viewedShow = true;
					this.getData();
				}else{ //未观看
					this.unViewedShow = true;
					this.getNoData();
				}
			},
			//获取主题统计数据
			getThemeInfo(){
				this.$axios.get('/sm/theme/recordThemeInfo', {id: this.$route.query.themeid}).then(res => {
					this.themeInfo = res.data;
					this.initChart({x: res.data.visitedTime, y: res.data.visitedData});
				});
			},
			//获取观看数据
			getData(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					nickName: this.searchKey,
					role: this.searchType,
					themeId: this.$route.query.themeid
				};
				this.$axios.post('/sm/theme/visitedData', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
				});
			},
			//获取未观看数据
			getNoData(){
				this.loading = true; // 表格加载
				let data = {
					pageNum: this.pageNum,
					pageSize: 10,
					nickName: this.nickName,
					themeId: this.$route.query.themeid
				};
				this.$axios.post('/sm/theme/unvisitorInfo', data).then(res => {
					this.loading = false; // 表格加载
					this.tableData = res.data.pageList;
					this.permission = this.creatPermit(res.data.permit);
					this.pages = res.data.pages;
				});
			},
			//导出
			exportTable(type){
				let url = '/sm/theme/exportVisitedData';
				let data = {
					nickName: this.searchKey,
					themeId: this.$route.query.themeid,
					role: this.searchType
				};
				if(type == 0){ //未观看
					url = '/sm/theme/exportUnvisitorInfo';
					data.nickName = this.nickName;
				}
				if (this.tableData.length == 0) {
					if (type == 0) {
						this.$message('暂无未观看用户，无法导出', 'warning')
					} else {
						this.$message('暂无在线观看用户，无法导出', 'warning')
					}
				} else {
						axios({
						method: 'post',
						url: url,
						data: data,
						responseType: 'blob'
					}).then(res => {
						let url = window.URL.createObjectURL(new Blob([res.data]));
						let link = document.createElement('a');
						link.style.display = 'none';
						link.href = url;
						
						link.setAttribute('download', decodeURIComponent(res.headers.filename));
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}, err => {
						console.log(err)
						reject(err)
					})
				}
			},
			//初始化折线图
			initChart(data){
				this.myChart = echarts.init(document.getElementById('main'));
				this.myChart.setOption({
					xAxis: {
						type: 'category',
						data: data.x,
						name: '时间(分钟)',
					},
					yAxis: {
						type: 'value',
						name: '直播在线人数(人)',
						minInterval: 1
					},
					tooltip: {	
					},
					series: [
						{
							name: '直播在线人数(人)',
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
			//搜索
			search(type){
				this.pageNum = 1;
				if(type == 1){ //观看
					this.getData();
				}else{ //未观看
					this.getNoData();
				}
			},
			//分页点击
			pageChange1(val){ //观看
				this.pageNum = val;
				this.getData();
			},
			pageChange0(val){ //未观看
				this.pageNum = val;
				this.getNoData();
			},
		},
		filters: {
			role(val){
				let arr = ['学生', '教师', '其他'];
				return arr[val];
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.font-color{
		height: 84%;
		overflow: auto;
		width: 100%;
		color: #303133;
	}
	.item-title{
		margin: 45px 0 40px 45px;
		font-size: 20px;
		font-weight: bold;
	}
	.theme-statistics-item{
		display: flex;
		width: 100%;
		li{
			display: flex;
			width: 17%;
			height: 80px;
			min-width: 170px;
			margin-left: 3%;
			cursor: pointer;
			.i-wrap{
				flex-shrink: 0;
				width: 80px;
				height: 80px;
				text-align: center;
				line-height: 80px;
				i{
					font-size: 45px;
					color: #fff;
				}
			}
			.data-wrap{
				position: relative;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				font-size: 18px;
				color: #fff;
				p{
					margin-left: 10%;
				}
				.data-title{
					margin-top: 13px;
					font-size: 14px;
				}
				.to-detail{
					position: absolute;
					top: 10px;
					right: 13px;
					font-size: 14px;
				}
			}
		}
		.bg-color11{background: #409EFF;}
		.bg-color12{background: #328EED;}
		.bg-color21{background: #FFAC30;}
		.bg-color22{background: #FC9E13;}
		.bg-color31{background: #8379FF;}
		.bg-color32{background: #7267F6;}
		.bg-color41{background: #FF9864;}
		.bg-color42{background: #FF8C52;}
	}
	.chart-wrap{
		width: 80%;
		height: 320px;
		margin-left: 45px;
		#main{
			width: 100%;
			height: 100%;
		}
	}
	.table-shade{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		.table-content{
			width: 80%;
			height: 76%;
			overflow: auto;
			background: #fff;
			margin: 8% 0 0 18%;
		}
		.dialog-title{
			display: flex;
			justify-content: space-between;
			font-size: 18px;
			box-sizing: border-box;
			padding: 20px 30px;
		}
		
	}
	.table-page{
		margin-top: 10px !important;
	}
</style>
