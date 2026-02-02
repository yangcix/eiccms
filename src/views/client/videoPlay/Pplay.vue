<template>
	<div class="pplayPage">
		<div class="video-content-wrap">
			<div class="video-wrap">
				<div class="video-content" id="videoWrap">
					<div id="myVideo" ref="myVideo"></div>
					<!-- <video class="video-js vjs-default-skin vjs-big-play-centered" ref="video" id="myVideo" controls> -->
					<!-- <source type="video/mp4" :src="playUrl">
		</video> -->
				</div>
				<div class="video-tag-info">
					<div class="video-tag-left">
						<ul v-if="detailInfo.labels">
							<li v-for="val in detailInfo.labels">{{val}}</li>
						</ul>
						<div class="detailInfoTitle">{{detailInfo.name}}</div>
					</div>

					<div class="video-tag-right">
						<span v-show="detailInfo.themeStatus == 2">最大在线人数: {{detailInfo.maxOnline}}</span>
						<i class="iconfont icon-yonghu"></i>
						<span>{{detailInfo.nickName}}</span>
						<i class="iconfont icon-watch"></i>
						<span>{{detailInfo.viewed}}</span>
					</div>
				</div>
				<el-dialog
					class="dialogPassword"
					:close-on-press-escape="false"
					:show-close="false"
					:visible.sync="dialogVisible"
					width="450px"
					:close-on-click-modal="false"
					:modal="false"
					style="position: absolute;"
					:z-index="1997"
				>
				<p style="text-align: center;width: 100%;;font-size: 14px;color: red;position: absolute;top: 20px;left: 0;">{{ passwordMsg }}</p>
        <div class="admin">
          <div class="name">观看密码<label>*</label>：</div>
          <el-input
            class="width-5"
            placeholder="请输入观看密码"
            show-password
            clearable
            v-model="password"
          >
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn" type="primary" @click="handleEnsure">
            确定
          </el-button>
        </span>
      </el-dialog>
			</div>

			<div class="video-info" v-if="detailInfo">
				<div class="evaluation notselect" v-if="isLogin && isBindEvaluation" @click="toEvaluation">
					<img src="@/assets/imgs/evaluation.png" alt="">
				</div>
				<p class="title">{{detailInfo.name}}</p>
				<p class="time">
					<span>开始时间：</span>
					<span>{{detailInfo.startTime}}</span>
				</p>
				<p class="time">
					<span>结束时间：</span>
					<span>{{detailInfo.endTime}}</span>
				</p>
				<ul class="fileList" v-if="fileList.length != 0">
					<li v-for="(item,index) in fileList" :key="index">
						<i :class="fileTypeIcon(item.name)"></i> <span @click="download(item)">{{item.name}}</span>
					</li>
				</ul>
				<p class="downTips" v-if="fileList.length != 0">以上为课堂相关文档，点击文件名称下载</p>
				<p class="intro">
					<span class="cleintIntroduce">简介：</span>
					<span>{{detailInfo.description ? detailInfo.description : '暂无'}}</span>
				</p>
				<!-- <p class="select-title">机位选择</p>
				<ul class="camera-list">
					<li :class="index == activeIndex ? 'active' : ''" @click="changeTeminal(index)"
					    v-for="(val, index) in themeTeminalList">{{val.terminalName}}</li>
				</ul> -->
			</div>
		</div>
		<div class="other-video" v-if="recommendList.length">
			<p class="other-title">相关推荐</p>
			<VideoList :videoList="recommendList" type="0"></VideoList>
		</div>

		<transition name="bounce">
			<div class="evaluation-wrap" v-if="evaluationShow">
				<div class="evaluation-wrap-top"><i class="el-icon-close" @click="colseEvaluation"></i></div>
				<div class="evaluation-title">{{evaluationList[0].name}}在线评课<span style="text-align: right;" @click="openNew">新页面访问</span></div>
        <div class="totalNum">
          <span v-if="evaluationList[activeName].type == 1">得分：{{totalNum}}</span>
					<span v-else style="opacity: 0;">得分</span>
        </div>
				<el-tabs v-model="activeName" style="pointer-events: none;">
          <el-tab-pane v-for="(item, index) in evaluationList" style="pointer-events: auto;" :key="index" :label="item.templateName" :name="index.toString()">
          <div class="evaluation-content">
						<div style="max-height: 503px;overflow: auto;">
							<el-table v-if="item.strategy == 1 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border default-expand-all>
            <el-table-column width="320" align="left" prop="levelOne" label="评课要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0)? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && ( item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" @blur="blurNumber" @change="changeNum" clearable :min="0" :max="scope.row.score"></el-input-number>
              </template>
            </el-table-column>
						<el-table-column  v-if="item.itemList[0] && ( item.itemList[0].type == 1 || item.itemList[0].type == 2)" align="center" label="评语" style="min-width: 350px;">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.isOpenRemarks == 1" align="center" :label="item.remarksName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
					<el-table v-if="item.strategy == 2 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border default-expand-all :span-method="(param)=>objectSpanMethod(param,item.wordDataDtos)">
            <el-table-column width="150" align="center" prop="levelOne" label="评课项目"> </el-table-column>
            <el-table-column width="320" align="left" prop="levelTwo" label="评课要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0)? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" @blur="blurNumber" @change="changeNum" clearable :min="0" :max="scope.row.score"></el-input-number>
              </template>
            </el-table-column>
						<el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)" align="center" label="评语" style="min-width: 350px;">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.isOpenRemarks == 1" align="center" :label="item.remarksName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
					<el-table v-if="item.strategy == 3 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border :header-cell-style="handerMethod" default-expand-all :span-method="(param)=>objectSpanMethod(param,item.wordDataDtos)">
            <el-table-column width="100" align="center" prop="levelOne" label="一级名称"> </el-table-column>
            <el-table-column width="100" align="center" prop="levelTwo" label="评课项目"> </el-table-column>
            <el-table-column width="320" align="left" prop="levelThree" label="评课要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0)? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" @blur="blurNumber" @change="changeNum" clearable :min="0" :max="scope.row.score"></el-input-number>
              </template>
            </el-table-column>
						<el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)" align="center" label="评语" style="min-width: 350px;">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.isOpenRemarks == 1" align="center" :label="item.remarksName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
						</div>
						
          <div class="evaluation-parttwo" v-if="item.isOpenSummary == 1">
            <h3 class="part-title">{{item.summaryName}}</h3>
            <textarea
              class="evaluation-text"
              v-model.trim="item.summary"
              style="resize: none"
              type="textarea"
              :disabled="isSubmit"
            ></textarea>
          </div>
					<div class="evaluation-bottom">
            <el-button v-show="activeName != 0" @click="goPre" class="evaluation-btn"
              >上一个任务</el-button
            >
            <el-button v-show="(Number(activeName) + 1) < evaluationList.length" @click="goNext" class="evaluation-btn"
              >下一个任务</el-button
            >
            <el-button v-if="!isSubmit" v-show="(Number(activeName) + 1) == evaluationList.length" @click="submitEvaluation" class="evaluation-btn"
              >完成</el-button
            >
            <el-button v-if="!isSubmit" class="evaluation-btn" @click="saveEvaluation"
              >保存草稿</el-button
            >
          </div>
        </div>
          </el-tab-pane>
        </el-tabs>
			</div>
		</transition>
		<el-dialog title="提交评课" :close-on-click-modal="false" :visible.sync="checkShow" width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">提交评课后无法再次编辑，确认提交？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="submitData">确 定</el-button>
					<el-button @click="checkShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import videojs, { log } from "video.js"
import Player from 'xgplayer';
import VideoList from '@/components/VideoList'
import { judgeMobile } from "@/assets/js/utils";
export default {
	name: '',
	data() {
		return {
			settimeVideo: null,
			recordInterval: null,
			totalNum: 0,
			password: '',
			activeName: 0,
			passwordMsg: '',
			checkShow: false,
			recommendList: [],
			detailInfo: {},
			activeIndex: 0,
			themeTeminalList: [],
			myVideo: null,
			playUrl: null,
			dialogVisible: false,
			evaluationShow: false, // 评课显示
			evaluationList: [],// 评课数组
			summary: '', // 评课总结
			colors: ['#FA8C47', '#FA8C47', '#FA8C47'],
			isBindEvaluation: false,
			isSubmit: false, //是否已提交评测
			themeId: '',
			fileList: [], // 教学文件数组
			evaluationData: {},
			videoSource: [],
			commentData: {},
			userId:  window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).userId : '',
		}
	},
	components: { VideoList },
	beforeCreate() {
		if (judgeMobile()) {
			this.$router.replace({ path: '/mobile' + this.$route.path, query: this.$route.query });
		};
	},
	mounted() {
		this.getDetailInfo();
		this.checkIsComment();
	},
	computed: {
		isLogin() {
			return this.$parent.userInfo ? true : false
		}
	},
	methods: {
		handleClick(tab, event) {
      this.changeNum();
    },
		// 文件类型icon判断
		fileTypeIcon(name) {
			if (name.match('ppt') || name.match('pptx')) {
				return 'iconfont icon-ppt ppt';
			} else if (name.match('pdf')) {
				return 'iconfont icon-pdf pdf';
			} else if (name.match('doc') || name.match('docx')) {
				return 'iconfont icon-word word';
			} else if (name.match('jpg')) {
				return 'iconfont icon-jpg jpg';
			} else if (name.match('png')) {
				return 'iconfont icon-png png';
			} else if (name.match('xls') || name.match('xlsx')) {
				return 'iconfont icon-excel xls';
			} else if (name.match('rar') || name.match('zip')) {
				return 'iconfont icon-RAR zip';
			}
		},
		// 下载文件
		download(item) {
			let link = document.createElement('a');
			link.style.display = 'none';
			link.href = item.url;
			link.setAttribute('download', decodeURIComponent(item.name));
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		handleEnsure() {
			if (this.password == '') {
        this.passwordMsg = '请输入观看密码';
        return;
      }
      if (this.password !== this.detailInfo.password) {
        this.passwordMsg = '密码错误，请重新输入密码';
        return;
      }
      let list = window.sessionStorage.getItem('liveList') ? JSON.parse(window.sessionStorage.getItem('liveList')) : []
      if(list){
        let isTrue = false;
        list.forEach(el => {
          if(el.id === this.detailInfo.id){
            isTrue = true;
            el.password = this.password;
          }
        });
        if(isTrue == false){
          list.push({
            id: this.detailInfo.id,
            password: this.password
          })
        }
      }else{
        list = [{
          id: this.detailInfo.id,
          password: this.password
        }]
      }
      window.sessionStorage.setItem('liveList',JSON.stringify(list))
      this.dialogVisible = false;
      this.setInit();
    },
		openNew() {
      if(!this.isSubmit){
        let evaluationData = {
        type: 0,
        objectId: this.themeId,
        status: 0,
        itemList: this.evaluationList,
        summary: this.summary,
      };
      this.$axios.post("/index/commentOnline", evaluationData).then(
        (res) => {
          if (res.code == 200) {
            this.evaluationShow = false;
            let routeUrl = this.$router.resolve({
              path: "/newplay",
              query:{
                  id: this.themeId,
                  type: 0,
                }
            });
            window.open(routeUrl.href, '_blank');
          }else{
						this.$message(res.message, 'error')
					}
        },
        (err) => {}
      );
      }else{
				this.evaluationShow = false;
        let routeUrl = this.$router.resolve({
          path: "/newplay",
          query:{
              id: this.themeId,
              type: 0,
            }
        });
        window.open(routeUrl.href, '_blank');
      }
    },
		blurNumber(e) {
			if (!e.target.value) {
				e.target.value = 0;
			}
		},
    changeNum() {
      let num = 0;
      let data = this.evaluationList;
      if(data[this.activeName].wordDataDtos.length > 0) {
        for(let j in data[this.activeName].wordDataDtos) {
          if(data[this.activeName].wordDataDtos[j].type == 0 || data[this.activeName].wordDataDtos[j].type == 2) {
            if(!data[this.activeName].wordDataDtos[j].userScore) {
              data[this.activeName].wordDataDtos[j].userScore = 0;
            }
            num = num + data[this.activeName].wordDataDtos[j].userScore;
          }
        }
      }
      this.totalNum = num;
    },
		// 检测是否有权评课
		checkIsComment() {
			if(!this.userId) {
        return;
      }
			this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId,userId: this.userId }).then(res => {
				if (res.code === 200) {
					this.isBindEvaluation = true;
					this.commentData = res.data;
					this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
						this.evaluationList = res.data ? res.data : [];
						this.changeNum();
						this.summary = res.data.summary ? res.data.summary : '';
						if (res.data[0].status == 1) {
							this.isSubmit = true;
						}
					})
				} else {
					this.isBindEvaluation = false;
				}
			})
		},
		goNext() {
      if(this.checkData(this.activeName) == false) {
        this.activeName = (Number(this.activeName) + 1).toString();
				this.changeNum();
      }
    },
    goPre() {
      this.activeName = (Number(this.activeName) - 1).toString();
			this.changeNum();
    },
		// 保存评课草稿
		saveEvaluation() {
			if (this.summary.length > 300) {
				this.$message('评课字数限制300字内！', 'error');
				return
			}
			let evaluationData = {
				type: 0,
				objectId: this.themeId,
				status: 0,
				itemList: this.evaluationList,
				summary: this.summary
			}
			this.$axios.post('/index/commentOnline', evaluationData).then(
				res => {
					if (res.code == 200) {
						this.$message('保存草稿成功', 'success')
						this.evaluationShow = false;
					}else{
						this.$message(res.message, 'error')
					}
				},
				err => {

				})
		},
		// 提交评课
		submitEvaluation() {
      if(this.checkData(this.evaluationList.length - 1) == false) {
        this.evaluationData = {
          type: 0,
          objectId: this.themeId,
          status: 1,
          itemList: this.evaluationList,
          summary: this.summary,
        };
        this.checkShow = true;
      }
    },
		checkData(i) {
      if(this.evaluationList[i].wordDataDtos.length > 0) {
        for(let j in this.evaluationList[i].wordDataDtos){
          if(this.evaluationList[i].wordDataDtos[j].type == 0) {
            if(!this.evaluationList[i].wordDataDtos[j].userScore){
              this.evaluationList[i].wordDataDtos[j].userScore = 0;
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`评分评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          }else if(this.evaluationList[i].wordDataDtos[j].type == 1){
            if(this.evaluationList[i].wordDataDtos[j].content == '' || this.evaluationList[i].wordDataDtos[j].content == null) {
              return this.$message(`评语必填！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content.length > 100) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `评语为100字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          }else if(this.evaluationList[i].wordDataDtos[j].type == 2){
            if(!this.evaluationList[i].wordDataDtos[j].userScore){
              this.evaluationList[i].wordDataDtos[j].userScore = 0;
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`评分评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content == '' || this.evaluationList[i].wordDataDtos[j].content == null) {
              return this.$message(`评语必填！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content.length > 100) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `评语为100字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`文字评课项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          }
        }
      }
      if(this.evaluationList[i].isOpenSummary == 1){
        // if(this.evaluationList[i].summary === null || this.evaluationList[i].summary == '') {
        //   return this.$message(`中总结性内容不能为空！`, 'error');
        // }
        if(this.evaluationList[i].summary && this.evaluationList[i].summary.length > 200) {
          return this.$message(`总结性内容为200字符内！`, 'error');
        }
      }
      return false;
    },
		submitData() {
			this.$axios.post('/index/commentOnline', this.evaluationData).then(
				res => {
					if (res.code == 200) {
						this.$message('评课成功', 'success')
						this.checkShow = false;
						this.evaluationShow = false;
					}else{
						this.$message(res.message, 'error')
					}
				},
				err => {

				})
		},
		handerMethod ({ row, column, rowIndex, columnIndex }) {
      //这里有个非常坑的bug 必须是row[0]=0 row[1]=2才会生效
      row[1].colSpan = 2
      row[2].colSpan = 0
      if (columnIndex === 0) {
        return { display: 'none' }
      }
    },
		objectSpanMethod({ row, column, rowIndex, columnIndex }, data) {
      if (columnIndex === 0) {
        // 表格数据修改
        const _row = this.flitterData(data).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
      }
      if (columnIndex === 1) {
        // 表格数据修改
        const _row = this.flitterData(data).two[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
      }
    },
    flitterData(arr) {
      let spanOneArr = [];
      let spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
        } else {
          if (item.levelOne == arr[index - 1].levelOne) {
            //第一列需合并相同内容的判断条件（data_）
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
          if (item.levelTwo == arr[index - 1].levelTwo) {
            //第二列需合并相同内容的判断条件（data_）
            spanTwoArr[concatTwo] += 1;
            spanTwoArr.push(0);
          } else {
            spanTwoArr.push(1);
            concatTwo = index;
          }
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr,
      };
    },
		//关闭评课窗
		colseEvaluation() {
			// if(!this.isSubmit) {
      //   this.saveEvaluation();
      // }
			this.evaluationShow = false;
		},
		// 评课拖拽窗
		toEvaluation() {
			if (this.commentData.status !== 1) {
				this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId,userId: this.userId }).then(res => {
					if (res.code === 200) {
						this.isBindEvaluation = true;
						this.commentData = res.data;
						this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
							if(res.code == 200){
                this.evaluationList = res.data;
                this.changeNum();
                if (res.data[0].status == 1) {
                  this.isSubmit = true;
                }
              }else{
                this.$message(res.message,'error')
              }
						})
						if (this.commentData.status !== 1) {
							this.$message('评课时间' + this.commentData.startTime, 'warning')
							return;
						} else {
							this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId, userId: this.userId }).then(ress => {
								if (ress.code == 200) {
									this.activeName = '0';
									this.evaluationShow = true;
									this.$nextTick(() => {
										//获取元素
										var dv = document.querySelector('.evaluation-wrap');
										var x = 0;
										var y = 0;
										var l = 0;
										var t = 0;
										var isDown = false;
										//鼠标按下事件
										// dv.onmousedown = function (e) {
										// 	//获取x坐标和y坐标
										// 	x = e.clientX;
										// 	y = e.clientY;

										// 	//获取左部和顶部的偏移量
										// 	l = dv.offsetLeft;
										// 	t = dv.offsetTop;
										// 	//开关打开
										// 	isDown = true;
										// 	//设置样式  
										// 	dv.style.cursor = 'move';
										// 	// console.log(document.body)
										// 	document.body.classList.add("notselect")
										// }
										//鼠标移动
										// window.onmousemove = function (e) {
										// 	if (isDown == false) {
										// 		return;
										// 	}
										// 	//获取x和y
										// 	var nx = e.clientX;
										// 	var ny = e.clientY;
										// 	//计算移动后的左偏移量和顶部的偏移量
										// 	var nl = nx - (x - l);
										// 	var nt = ny - (y - t);

										// 	dv.style.left = nl + 'px';
										// 	dv.style.top = nt + 'px';
										// }
										//鼠标抬起事件
										dv.onmouseup = function () {
											//开关关闭
											isDown = false;
											dv.style.cursor = 'default';
											document.body.classList.remove("notselect")
										}
										this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
											this.evaluationList = Object.assign([], res.data ? res.data : []);
											this.changeNum();
											// this.summary = res.data.summary ? res.data.summary : '';
											if (res.data[0].status == 1) {
												this.isSubmit = true;
											}
										})
										let text = document.querySelector(".evaluation-text");
										text.addEventListener('mousemove', (e) => {
											let event = e || window.event;
											if (event) {
												e.cancelBubble = true;
												e.stopPropagation()
												return false;
											}
										})
									})
								} else {
									this.$message(ress.message, 'warning');
									this.evaluationShow = false;
									this.isBindEvaluation = false;
									return;
								}
							})
						}
					} else {
						this.isBindEvaluation = false;
					}
				})
			} else {
				this.$axios.post('/index/checkCommentAuth', { type: 0, objectId: this.themeId, userId: this.userId }).then(ress => {
					if (ress.code == 200) {
						this.activeName = '0';
						this.evaluationShow = true;
						this.$nextTick(() => {
							//获取元素
							var dv = document.querySelector('.evaluation-wrap');
							var x = 0;
							var y = 0;
							var l = 0;
							var t = 0;
							var isDown = false;
							//鼠标按下事件
							// dv.onmousedown = function (e) {
							// 	//获取x坐标和y坐标
							// 	x = e.clientX;
							// 	y = e.clientY;

							// 	//获取左部和顶部的偏移量
							// 	l = dv.offsetLeft;
							// 	t = dv.offsetTop;
							// 	//开关打开
							// 	isDown = true;
							// 	//设置样式  
							// 	dv.style.cursor = 'move';
							// 	// console.log(document.body)
							// 	document.body.classList.add("notselect")
							// }
							//鼠标移动
							// window.onmousemove = function (e) {
							// 	if (isDown == false) {
							// 		return;
							// 	}
							// 	//获取x和y
							// 	var nx = e.clientX;
							// 	var ny = e.clientY;
							// 	//计算移动后的左偏移量和顶部的偏移量
							// 	var nl = nx - (x - l);
							// 	var nt = ny - (y - t);

							// 	dv.style.left = nl + 'px';
							// 	dv.style.top = nt + 'px';
							// }
							//鼠标抬起事件
							dv.onmouseup = function () {
								//开关关闭
								isDown = false;
								dv.style.cursor = 'default';
								document.body.classList.remove("notselect")
							}
							this.$axios.post('/index/getUserCommentDetail', { type: 0, objectId: this.themeId }).then(res => {
								this.evaluationList = Object.assign([], res.data ? res.data : []);
								this.evaluationList.forEach(el => {
								let isTrue = el.itemList.every(ele => ele.type === 0);
									if(isTrue == false){
										el.type = 0
									}else{
										el.type = 1
									}
								})
								this.changeNum();
								// this.summary = res.data.summary ? res.data.summary : '';
								if (res.data[0].status == 1) {
									this.isSubmit = true;
								}
							})
							let text = document.querySelector(".evaluation-text");
							text.addEventListener('mousemove', (e) => {
								let event = e || window.event;
								if (event) {
									e.cancelBubble = true;
									e.stopPropagation()
									return false;
								}
							})
						})
					} else {
						this.$message(ress.message, 'warning');
						this.evaluationShow = false;
						this.isBindEvaluation = false;
						return;
					}
				})
			}
		},
		//初始化视频  点播
		initVideo() {
			this.myVideo = new Player({
				id: 'myVideo',
				// url: this.detailInfo.themeTeminalList[0].playbackUrl,
				url: this.playUrl,
				width: 927,
				height: 647,
				autoplay: true,
				videoInit: true,
				closeVideoClick: true,
				closeVideoTouch: true,
				errorTips: '暂无视频源',
				lang: 'zh-cn',
			});
			console.log('this.myVideo', this.myVideo)
			const _this = this;
			this.myVideo.on('ended', function (e) {
				console.log(e, '结束播放')
				// let currentErrorTime = _this.myVideo.currentTime;
				// _this.myVideo.reload()
				// _this.myVideo.currentTime = currentErrorTime + 4; //遇到错误跳四秒
			})
			this.myVideo.on('error', function (e) {
				console.log(e, '播放器错误')
				// if(e.duration - e.currentTime <=1){
				// 	let replay = document.getElementsByClassName('xgplayer-replay');
				// 	let error = document.getElementsByClassName('xgplayer-error');
				// 	// let start = document.getElementsByClassName('xgplayer-start');
				// 	error[0].style.display = 'none';
				// 	replay[0].style.display = 'flex';
				// 	// start[0].style.display = 'none';
				// 	let classNames = 'xgplayer-playing';
				// 	let classNamesss = 'xgplayer-pause';
				// 	let classNamessss = 'xgplayer-is-error';
				// 	let className = 'xgplayer-is-replay';
				// 	let classNamess = 'xgplayer-ended';
				// 	classNamessss.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
				// 		item && _this.myVideo.root.classList.remove(item)
				// 	});
				// 	classNames.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
				// 		item && _this.myVideo.root.classList.remove(item)
				// 	});
				// 	classNamesss.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
				// 		item && _this.myVideo.root.classList.remove(item)
				// 	});
				// 	className.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
				// 		item && _this.myVideo.root.classList.add(item)
				// 		// _this.myVideo.root.className += ' ' + className
				// 	});
				// 	classNamess.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
				// 		item && _this.myVideo.root.classList.add(item)
				// 		// _this.myVideo.root.className += ' ' + classNamess
				// 	});
				// }
				// console.log(_this.myVideo.root.classList,'_this.myVideo',_this.myVideo.root.className)
				// let currentErrorTime = _this.myVideo.currentTime;
				// _this.myVideo.reload()
				// _this.myVideo.currentTime = currentErrorTime + 4; //遇到错误跳四秒
			})
			// 		 this.$nextTick(() => {
			// let myPlayer = videojs('myVideo', {
			//   controls: true,
			//   //自动播放属性,muted:静音播放
			//   autoplay: false,
			//   //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
			//   preload: "auto",
			//   //设置视频播放器的显示宽度（以像素为单位）
			//   width: "927px",
			//   //设置视频播放器的显示高度（以像素为单位）
			//   height: "647px",
			//   playbackRates: [0.5, 1, 1.5, 2, 3],// 倍速播放
			//   controlBar: {
			//     playToggle:true
			//   },
			// });
			// myPlayer.src(this.playUrl); // 重新初始化URL
			// myPlayer.load(url); //重新加载
			// })
		},
		//获取详情
		getDetailInfo() {
			let query = this.$route.query;
			this.themeId = query.themeid;
			let data = {
        id: query.themeid,
        type: query.type
      };
      if(query.etype){
        data.evaluationType = query.etype;
      };
			this.$axios.get('/index/getVideoInfo', data).then(res => {
				if (res.data === null) {
					// this.$message('暂无观看权限','error');
					setTimeout(() => {
						if(window.history.length > 1){
							this.$router.go(-1)
						}else{
							this.$router.push({ name: 'home' });
						}
					}, 1000)
					return;
				}
				clearTimeout(this.recordInterval);
				this.recordInterval = setTimeout(() => {
					this.$axios.get('/index/recordViewInfo', {
						themeId: this.themeId,
						time: 300,
						type: 1
					}).then(res => {

					})
				}, 300000)
				this.fileList = res.data.teachingFileList;
				this.detailInfo = res.data;
				this.getRecommendList();
				let list = JSON.parse(window.sessionStorage.getItem('liveList'));
          let isTrue = false;
          if(list) {
            list.forEach(el => {
              if(el.id == res.data.id && el.password == res.data.password) {
                isTrue = true;
              }
            })
          }
          if(res.data.groupId == 1 && res.data.password !== '' && res.data.password !== null && isTrue == false) {
            this.dialogVisible = true;
          }else{
						this.dialogVisible = false;
						this.setInit();
					}
			});
		},
		getDetailInfos() {
			let query = this.$route.query;
			this.themeId = query.themeid;
			let data = {
        id: query.themeid,
        type: query.type
      };
      if(query.etype){
        data.evaluationType = query.etype;
      };
			this.$axios.get('/index/getVideoInfo', data).then(res => {
				if (res.data === null) {
					// this.$message('暂无观看权限','error');
					setTimeout(() => {
						if(window.history.length > 1){
							this.$router.go(-1)
						}else{
							this.$router.push({ name: 'home' });
						}
					}, 1000)
					return;
				}
				this.fileList = res.data.teachingFileList;
				this.detailInfo = res.data;
				this.getRecommendList();
				let list = JSON.parse(window.sessionStorage.getItem('liveList'));
          let isTrue = false;
          if(list) {
            list.forEach(el => {
              if(el.id == res.data.id && el.password == res.data.password) {
                isTrue = true;
              }
            })
          }
          if(res.data.groupId == 1 && res.data.password !== '' && res.data.password !== null && isTrue == false) {
            this.dialogVisible = true;
          }else{
						this.dialogVisible = false
						this.setInit();
					}
			});
		},
		setInit() {
			this.passwordMsg = '';
			const val = this.detailInfo;
			this.themeTeminalList = val.themeTeminalList;
			if(val.themeTeminalList == null){
				let html = `<div class="videoEnd" -webkit><p>该主题回放资源已被删除！</p></div>`
				document.querySelector('#videoWrap').innerHTML = html;
				return
			}
			let playUrl = this.detailInfo.themeTeminalList[0].playbackUrl;
			// playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
			this.playUrl = process.env.NODE_ENV === "production" ? `${location.protocol}//${location.host}${playUrl}` : `${location.protocol}//192.168.164.59${playUrl}` // host
			if (playUrl && playUrl !== null) {
				this.addViewed(val.id);
				this.$nextTick(() => {
					document.querySelector('#videoWrap').innerHTML = `<div id="myVideo" ref="myVideo"></div>`;
					this.initVideo();
				})
			}else{
				let videoEl = `<div class="videoEnd" -webkit><p>视频正在努力生成中，请稍等后再看！</p></div>`
				document.querySelector('#videoWrap').innerHTML = videoEl;
				this.settimeVideo = setTimeout(() => {
					this.getDetailInfos()
				}, 5000);
			}
			
		},
		// //切换机位 点播
		// changeTeminal(index){
		// 	this.activeIndex = index;
		// 	let playUrl = this.detailInfo.themeTeminalList[index].playbackUrl;
		// 	this.playUrl = `http://${location.hostname}${playUrl}`;
		// 	// playUrl = playUrl.split('://')[0] + '://' + location.hostname + ':' + playUrl.split('//')[1].split(':')[1];
		// 	// this.myVideo.url = this.playUrl;
		// 	if (playUrl) {
		// 		// this.myVideo.src = this.playUrl;
		// 		this.$refs.myVideo.innerHTML = '';
		// 		this.initVideo();
		// 	} else {
		// 		this.$refs.myVideo.innerHTML = '';
		// 	}
		// },
		//获取推荐视频列表
		getRecommendList() {
			this.$axios.post('/index/relevantRecommend', {
				id: this.detailInfo.id,
				labelIds: this.detailInfo.labelIds,
				// type: this.$route.query.type
			}).then(res => {
				this.recommendList = res.data;
			});
		},
		//更新视频观看数
		addViewed(id) {
			this.$axios.get('/index/updateThemeViewed', { themeId: id }).then(res => { });
		},
	},
	watch: {
		$route(to, from) {
			if (to.path === from.path) {
				this.evaluationShow = false;
				this.getDetailInfo();
				this.checkIsComment();
			}
			if (this.myVideo && this.myVideo.destroy) {
				this.myVideo.destroy();
			} else {
				this.$refs.myVideo.innerHTML = "";
			}
			this.activeIndex = 0;

		}
	},
	beforeDestroy() {
		clearTimeout(this.settimeVideo);
		clearTimeout(this.recordInterval);
		if (this.myVideo && this.myVideo.destroy) {
			this.myVideo.destroy();
		}
		if (this.$refs.myVideo) {
			this.$refs.myVideo.innerHTML = "";
		}
	}
}
</script>

<style lang="scss" type="text/scss" scoped>
 ::v-deep .el-tabs__header{
  margin: 0 30px 30px 30px;
}

.admin{
  display: flex;
  justify-content: center;
  align-items: center;
}
.pplayPage {
	margin-top: 24px;
}

.detailInfoName {
	padding-bottom: 20px;
	padding-left: 10px;
	background: #fff;
}

.video-content-wrap {
	margin-top: 30px;
	display: flex;
	width: 1200px;
	min-height: 700px;
	margin: 0 auto;
	background: #F1F2F4;

	.video-wrap {
		position: relative;
		width: 927px;
	}

	.video-content {
		position: relative;
		height: 647px;
		width: 100%;
		background: #000;

		video {
			width: 927px;
			height: 647px;
		}
	}

	.video-tag-info {
		background: #fff;
		width: 100%;
		min-height: 66px;
		display: flex;
		justify-content: space-between;
		padding: 20px 0;
		box-sizing: border-box;

		.video-tag-left {
			padding: 0 10px;

			ul {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 16px;

				li {
					margin: 2px 0;
					padding: 5px 12px 4px 12px;
					margin-right: 8px;
					background: #FF9727;
					box-shadow: 0px 2px 3px 0px rgba(255, 151, 39, 0.5);
					border-radius: 16px;
					color: #fff;
					font-size: 12px;
				}
			}

			.detailInfoTitle {
				max-width: 700px;
				margin-left: 2px;
				padding: 2px 0 0 0;
				box-sizing: border-box;
			}
		}

		.video-tag-right {
			padding: 2px 10px 0 0;
			box-sizing: border-box;
			font-size: 12px;
			color: #999;

			i {
				margin: 0 5px 0 14px;
				font-size: 13px;
			}
		}
	}

	.video-info {
		width: 273px;
		box-sizing: border-box;
		padding: 23px 19px 0 32px;
		margin-left: 6px;
		background: #fff;
		position: relative;

		.evaluation {
			width: 154px;
			height: 145px;
			position: absolute;
			right: -160px;
			top: 430px;
			// z-index: 1;
			cursor: pointer;
		}

		.title {
			font-size: 18px;
			color: #222;
			word-break: break-all;
			// -webkit-line-clamp:1;
					line-clamp:1;
		}

		.time {
			margin-top: 10px;
			color: #999;
			font-size: 12px;

			i {
				margin-right: 7px;
				font-size: 15px;
			}
		}

		.fileList {
			margin: 22px 0;

			li {
				transition: all 0.3s;
				margin: 3px 0;
				cursor: pointer;

				.ppt {
					color: rgb(235, 115, 76);
				}

				.pdf {
					color: rgb(255, 85, 98);
				}

				.word {
					color: rgb(47, 151, 254);
				}

				.jpg {
					color: rgb(209, 102, 61);
				}

				.png {
					color: rgb(60, 211, 199);
				}

				.xls {
					color: rgb(0, 182, 50);
				}

				.zip {
					color: rgb(249, 189, 15);
				}

				span {
					display: inline-block;
					color: #035AFF;
					font-size: 12px;
					overflow: hidden;
					width: 188px;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			li:hover {
				transform: translate(0px, -3px);

				span {
					color: #232325;
					font-size: 14px;
					font-weight: 600;
				}
			}
		}

		.downTips {
			font-size: 12px;
			color: #999;
		}

		.intro {
			word-break: break-all;
			margin-top: 22px;
			line-height: 18px;
			font-size: 12px;
			color: #999;

			span:first-child {
				color: #111;
			}
		}

		.select-title {
			margin-top: 25px;
			font-size: 12px;
			color: #111;
		}

		.camera-list {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			li {
				line-height: 28px;
				width: 150px;
				padding: 0 2px;
				margin-top: 15px;
				text-align: center;
				-webkit-line-clamp:1;
					line-clamp:1;
				background: #EEE;
				color: #999;
				font-size: 12px;

				&.active {
					background: #C7EDFF;
					color: #035AFF;
				}
			}
		}
	}
}

.other-video {
	width: 1200px;
	margin: 52px auto 0 auto;

	.other-title {
		font-size: 24px;
		color: #333333;
		font-family: Microsoft YaHei;
		font-weight: bold;
		position: relative;
		z-index: 1;
		margin-left: 20px;
	}

	.other-title::after {
		content: '';
		width: 39px;
		height: 39px;
		background: #C9DCFF;
		border-radius: 50%;
		position: absolute;
		left: -20px;
		top: -6px;
		z-index: -1;
	}
}
</style>
<style lang="scss" type="text/scss" scoped>
::v-deep .videoEnd {
	width: 927px;
	height: 647px;
	background: #000;

	p {
		color: white;
		text-align: center;
		line-height: 647px;
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
	{
	opacity: 0;
}

.bounce-enter-active {
	animation: bounce-in .8s;
}

.bounce-leave-active {
	animation: bounce-in .8s reverse;
}

@keyframes bounce-in {
	0% {
		transform: scale(0);
	}

	50% {
		transform: scale(1.05);
	}

	100% {
		transform: scale(1);
	}
}

.evaluation-wrap {
	min-width: 500px;
	min-height: 600px;
	width: 1000px;
	height: auto;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
	resize: both;
	// overflow:auto;
	position: absolute;
	top: 123px;
	left: 500px;
	z-index: 2000;

	.evaluation-wrap-top {
		width: 100%;
		height: 30px;
		padding: 16px 20px;
		box-sizing: border-box;

		i {
			float: right;
			cursor: pointer;
		}
	}

	.evaluation-title {
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 18px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #333333;
		span{
			position: absolute;
			cursor: pointer;
			// top: 35px;
			right: 60px;
			font-size: 16px;
			color: blueviolet;
		}
	}

	.evaluation-content {
		width: 100%;
    padding: 0 30px 30px 30px;
		box-sizing: border-box;

		.part-title {
			margin: 0 0 10px 0;
			word-wrap: break-word;
			font-size: 18px;
			color: #333333;
		}

		.part-one-itemwrap {
			height: 448px;
			box-sizing: border-box;
			overflow: auto;

			.one-item {
				margin-top: 15px;

				.one-item-title {
					display: flex;
					font-size: 15px;
					font-weight: bold;
					line-height: 22px;
					color: #333333;

					span:last-child {
						max-width: 690px;
					}
				}

				.score {
					margin: 10px 0 0 24px;
				}
			}
		}

		.evaluation-parttwo {
			.part-title {
				margin: 10px 0 0 0;
				word-wrap: break-word;
			}

			.evaluation-text {
				width: 100%;
				height: 86px;
				background: #FFFFFF;
				border: 1px solid #DBE2E7;
				opacity: 1;
				border-radius: 6px;
				margin: 10px 0 0 0;
				padding: 10px;
				box-sizing: border-box;
			}
		}

		.evaluation-bottom {
			padding: 10px 0px 0 0px;
      box-sizing: border-box;
			display: flex;
			justify-content: center;
			.evaluation-btn {
				width: 169px;
				height: 55px;
				border: 1px solid#305BFF;
				opacity: 1;
				border-radius: 28px;
				margin: 0 26px;
				color: #305BFF;
			}

			// .evaluation-btn:first-child {
			// 	color: #fff;
			// 	background: #305BFF;
			// }
		}
	}
	.totalNum{
		text-align: right;
  	margin-right: 60px;
	}
}
</style>
<style lang="scss" type="text/scss" scoped>
.pplayPage {
	.el-rate__text {
		color: #FA8C47 !important;
	}
}
</style>