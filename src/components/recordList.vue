<!-- recordlist -->
<template>
  <div id="recordlist">
      <div class="search-operat">
				<div class="option-head">
					<el-input class="width-6" clearable v-model="keyWord" placeholder="请输入视频名称关键字" v-search="handleSearch"></el-input>
          <div>
            <span class="add-time">添加时间:</span>
            <el-date-picker
              v-model="startTime"
              type="datetime"
              class="startTime"
              placeholder="开始时间">
            </el-date-picker>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              class="startTime"
              placeholder="结束时间">
            </el-date-picker>
          </div>
					<el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
				</div>
				
			</div>
			<div class="data-table table-border">
				<el-table
					:row-style="{ height: '10px' }"
					:cell-style="{ padding: '4px 0' }"
					v-loading="loading"
					:data="tableData"
					style="width: 100%;margin-bottom: 20px;"
					>
					<el-table-column
						align="center"
						prop="name"
						label="视频名称">
            <template slot-scope="scope">
							  <span class="vName" @click="toplay(scope.row.url)"><i class="el-icon-video-play"></i> {{scope.row.name}}</span> 
						</template>
					</el-table-column>
					<el-table-column
            prop="className"
						align="center"
						label="班级">
					</el-table-column>
          <el-table-column
						prop="subject"
						label="课程">
					</el-table-column>
          <el-table-column
						prop="teacherName"
						label="教师">
					</el-table-column>
					<el-table-column
						align="center"
						prop="completeDate"
						label="添加时间">
					</el-table-column>
					<el-table-column
						align="center"
						label="操作">
						<template slot-scope="scope">
              <el-button type="text" @click="handleDownload(scope.row)">下载</el-button>
							<el-button type="text" style="color:#f56c6c" @click="openDeleteShow(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
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
			title="删除视频"
			:close-on-click-modal="false"
			:visible.sync="deleteShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认删除该视频？</p>
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
        <div id="videoFilm" ref="videoFilm"></div>
      </el-dialog>
  </div>
</template>

<script>
  import Player from 'xgplayer';
	import { formatDate } from '@/assets/js/utils.js'
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
				deleteShow: false,
				id: '',
        keyWord:'',
        startTime:'',
        endTime:'',
        tableData:[],
        pages:0,
        pageNum:1,
        totalS:'',
        loading:false,
				playVisible:false,
        myVideo:null,

			}
		},
		components: {},
		watch:{
      activeName(val) {
        if(val === 'third'){
          console.log('录制列表')
					this.keyWord = '';
					this.startTime = '';
					this.endTime = '';
					this.pageNum = 1;
          this.handleGetData();
        }
      }
    },
		mounted() {
			this.handleGetData();
		},
		methods: {
      // 播放
			toplay(url){
        this.playVisible = true;
        this.$nextTick(() => {
          this.handelGetVideo(url)
        })
      },

      // 下载
      handleDownload(row) {
        const link = document.createElement('a');
        link.style.display = 'none';
				link.href = row.url;
        link.setAttribute("download", row.name); // 下载的文件名
				document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      // 视频初始化
      handelGetVideo(params) {
				this.myVideo = new Player({
					id: 'videoFilm',
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
      // 关闭播放
      closePlay() {
        this.myVideo.destroy();
				this.myVideo = null
        this.playVisible = false;
      },
			openDeleteShow(id) {
				this.id = id;
				this.deleteShow = true;
			},
			// 删除
			handleDelete() {
				this.$axios.post('/sm/record/delete', {id: this.id}).then(res => {
					if (res.code === 200) {
						this.totalS = this.totalS - 1;
						if (this.pageNum * 10 - this.totalS === 10) {
							this.pageNum = this.pageNum - 1 || 1
						}
						this.deleteShow = false;
						this.$message('删除成功', 'success');
						this.handleGetData();
					}
				})
			},

			handlePageChange(val) {
				this.scrollTo0();
				this.pageNum = val;
				this.handleGetData();
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
			// 搜索
			handleSearch() {
				this.scrollTo0();
				this.pageNum = 1;
				this.handleGetData();
			},
			handleGetData() {
				this.loading = true;
				this.$axios.get('/sm/record/list',{
					keyWord: this.keyWord,
					classId: this.enterClassId ? this.enterClassId : '0',
					pageNum: this.pageNum,
          startTime: formatDate(this.startTime),
          endTime: formatDate(this.endTime),
					pageSize: 10,
				}).then(res => {
					this.loading = false;
					this.tableData = res.data.pageList;
					this.pages = res.data.pages;
					this.totalS = res.data.total;
					this.pageNum = res.data.pageNum;
				})
			},

		},
	}
</script>
<style lang="scss" type="text/scss" scoped>
#recordlist {
	.search-operat{
		min-width: 1000px;
	}
  .option-head{
    display: flex;
    margin: 14px 0 0px 0;

    .add-time {
      font-size: 14px;
      color: #333333;
      margin:0 20px 0 50px; 
    }
    .startTime {
      width: 200px;
      margin-right: 10px;
    }
  }

  .vName {
    cursor: pointer;
    color: #409EFF;
  }
}

</style>