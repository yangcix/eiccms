<!-- recordlist -->
<template>
  <div id="recordlist">
		<el-date-picker
			style="margin-top: 20px;"
      v-model="value"
      type="daterange"
			value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
			@change="timeChange">
    </el-date-picker>
		<div class="dataList">
			<div v-if="tableData.length > 0">
				<div v-for="item in tableData" class="item" :key="item.id">
				<p>{{item.datetime}}</p>
				<el-divider></el-divider>
				<div style="margin-top: 20px;" v-for="items in item.child" :key="items.id">
					<div class="itemTop"><span class="content">{{items.context}}</span><div class="itemTime">{{items.timetime}}</div></div>
					<div class="itemFoot">
						<span>记录教师：{{items.markTeacher}}<span v-show="items.teacherName" style="margin-left: 30px;">上课教师：{{items.teacherName}}({{items.subject}})</span></span>
						<div>
							<i v-if="items.url" class="el-icon-video-play" type="primary" style="cursor: pointer;color: #409eff;margin-right: 10px;" @click="toplay(items.url)"></i>
							<!-- <span v-else style="margin-right: 5px;">未录制</span> -->
							<i class="el-icon-delete" type="primary" style="cursor: pointer;color: #409eff;" @click="openDeleteShow(items.id)"></i>
						</div>
					</div>
				</div>
			</div>
			</div>
			<div v-else class="empty">
				<p>暂无数据</p>
			</div>
		</div>
		<div class="table-page">
				<el-pagination
					layout="prev, pager, next"
					@current-change="handlePageChange"
					:current-page="pageNum"
					:page-count="pages">
				</el-pagination>
			</div>
			<el-dialog
			title="删除记录"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该巡课记录？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="handleDelete()">确 定</el-button>
					<el-button @click="deleteShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog
        title="播放"
				:close-on-click-modal="false"
        :visible.sync="playVisible"
        :before-close="closePlay"
        width="fit-content"
        center>
        <div id="videoFilms" ref="videoFilms"></div>
      </el-dialog>
  </div>
</template>

<script>
	import Player from 'xgplayer';
	import { handleGetQueryString } from '@/assets/js/utils.js'
	export default {
		name: '',
		props:{
      activeName:{
        type: String,
        default: ''
      },
      enterClassId:{
        type: [String, Number],
        default: ''
      }
    },
		data() {
			return {
				pages:0,
        pageNum:1,
				value: '',
				deleteShow: false,
				id: '',
				totalS: '',
        tableData:[
					{
						date: '2022-12-23',
						itemList: [
							{
								time: '09:16',
								content: '记录一条',
								recordTeacher: '教师1',
								classTeacher: '教师2'
							},
							{
								time: '09:36',
								content: '记录一条',
								recordTeacher: '教师1',
								classTeacher: '教师2'
							}
						]
					}
				],
				playVisible: false,
				myVideos: null,
			}
		},
		components: {},
		watch:{
      activeName(val) {
        if(val === 'fourth'){
					this.value = '';
					this.pageNum = 1;
          this.handleGetData();
        }
      }
    },
		mounted() {
			this.handleGetData();
		},
		methods: {
			handlePageChange(val) {
				this.scrollTo0();
				this.pageNum = val;
				this.handleGetData();
			},
			timeChange() {
				console.log('value',this.value);
				this.pageNum = 1;
				this.handleGetData();
			},
			// 关闭播放
      closePlay() {
        this.myVideos.destroy();
				this.myVideos = null
        this.playVisible = false;
      },
			toplay(url){
        this.playVisible = true;
        this.$nextTick(() => {
          this.handelGetVideo(url)
        })
      },
			handelGetVideo(params) {
				this.myVideos = new Player({
					id: 'videoFilms',
					url: params,
					autoplay: true,
					videoInit: true,
					width: 460,
					height: 270,
					fitVideoSize:'auto',
					closeVideoClick: true,
					closeVideoTouch: true,
					errorTips: '暂无视频源',
					lang: 'zh-cn'
				})
			},
			openDeleteShow(id) {
				this.id = id;
				this.deleteShow = true;
			},
			// 删除
			handleDelete() {
				this.$axios.post('/sys/note/delete', {id: this.id}).then(res => {
					if (res.code === 200) {
						this.deleteShow = false;
						this.totalS = this.totalS - 1;
						if (this.pageNum * 10 - this.totalS === 10) {
							this.pageNum = this.pageNum - 1 || 1
						}
						this.$message('删除成功', 'success');
						this.handleGetData();
					}
				})
			},
			scrollTo0() {
				let bodyWrapper = document.getElementsByClassName(
					"el-table__body-wrapper"
				);
				if (bodyWrapper && bodyWrapper.length > 0) {
					for (let item of bodyWrapper) {
						item.scrollTo(0, 0);
					}
				}
				document.getElementsByClassName("main-wrap")[0].scrollTo(0, 0);
			},
			handleGetData() {
				let data = new FormData();
				data.append('id', Number(handleGetQueryString('classroomId')));
				data.append('pageNum', this.pageNum);
				data.append('pageSize', 10);
				data.append('startTime', this.value ? this.value[0] : '');
				data.append('stopTime', this.value ? this.value[1] : '');
				this.$axios.post('/sys/note/search',data).then(res => {
					let arr = [];
					res.data.pageList.forEach(el => {
						arr.push(el.datetime.slice(0,10))
					})
					this.totalS = res.data.total;
					let arrs =  Array.from(new Set(arr));
					let newArr = [];
					arrs.forEach(ele =>  {
						let obj = {
							datetime: ele,
							child: []
						};
						newArr.push(obj);
					})
					res.data.pageList.forEach(el => {
						newArr.forEach(ele =>  {
							if(el.datetime.slice(0,10) == ele.datetime) {
								ele.child.push(el);
							}
						})
					});
					this.tableData = newArr;
					this.pages = res.data.pages;
				})
			},
		},
	}
</script>
<style lang="scss" type="text/scss" scoped>
#recordlist {
	
  .dataList{
		min-width: 800px;
		.item{
			margin-top: 25px;
		}
		
		 ::v-deep .el-divider--horizontal{
			margin:5px 0 15px 0;
		}
		.itemTop{
			width: 100%;
			display: flex;
			justify-content: space-between;
			.content{
				word-break: normal;
        width: 80%;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
				line-height: 19px;
			}
		}
		.itemFoot{
			margin: 10px 0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			span{
				font-size: 14px;
				color: gray;
			}
		}
		.itemTime{
			text-align: right;
			width: 20%;
			font-size: 14px;
			color: gray;
		}
	}

  .vName {
    cursor: pointer;
    color: #409EFF;
  }
}
.empty{
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	color: #C1C4CC;
}
</style>