<template>
  <div class="liveInteract">
    <div class="video-content-wrap">
      <div class="evaluation-wrap">
        <div class="evaluation-title">{{evaluationList[0].name}}在线评课
          <div class="totalNum">
          <span v-if="evaluationList[activeName] && evaluationList[activeName].itemList[0] && (evaluationList[activeName].itemList[0].type == 0 || evaluationList[activeName].itemList[0].type == 2)">得分：{{totalNum}}</span>
					<span v-else style="opacity: 0;">得分</span>
        </div></div>
        
        <el-tabs v-model="activeName" style="pointer-events: none;">
          <el-tab-pane v-for="(item, index) in evaluationList" :key="index" style="pointer-events: auto;" :label="item.templateName" :name="index.toString()">
          <div class="evaluation-content">
            <div style="max-height: 480px;overflow: auto;">
              <el-table v-if="item.strategy == 1 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border default-expand-all>
            <el-table-column width="320" align="left" prop="levelOne" label="评价要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0) ? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" clearable :min="0" @blur="changeNum" @change="changeNum" :max="scope.row.score"></el-input-number>
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
          <el-table v-if="item.strategy == 2 && item.wordDataDtos.length > 0" :data="item.wordDataDtos" style="width: 100%;" border default-expand-all :span-method="(param)=>objectSpanMethod(param,item.wordDataDtos)">
            <el-table-column width="150" align="center" prop="levelOne" label="评价项目"> </el-table-column>
            <el-table-column width="320" align="left" prop="levelTwo" label="评价要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0) ? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" clearable :min="0" @blur="changeNum" @change="changeNum" :max="scope.row.score"></el-input-number>
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
            <el-table-column width="100" align="center" prop="levelTwo" label="评价项目"> </el-table-column>
            <el-table-column width="320" align="left" prop="levelThree" label="评价要素"> </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="分值">
              <template slot-scope="scope">
                <span>
                  {{(scope.row.type == 0 || scope.row.type == 2) && (!scope.row.children || scope.row.children.length == 0) ? scope.row.score : ''}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)" align="center" label="评分" width="250px">
              <template slot-scope="scope">
                  <el-input-number v-if="!scope.row.children || scope.row.children.length == 0" class="width-6" v-model="scope.row.userScore" :precision="0" clearable :min="0" @blur="changeNum" @change="changeNum" :max="scope.row.score"></el-input-number>
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
    </div>
    <el-dialog
      title="提交评课"
      :close-on-click-modal="false"
      :visible.sync="checkShow"
      width="420px"
    >
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
export default {
  name: "",
  data() {
    return {
      activeName: 0,
      checkShow: false,
      evaluationList: [], // 评课数组
      summary: "", // 评价总结
      isSubmit: false, //是否已提交评测
      totalNum: 0,
      commentData: {}, // 评课数据
      userId:  window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).userId : ''
    };
  },
  mounted() {
    this.checkIsComment();
    console.log(this.$route,'reeee')
  },
  methods: {
    handleClick(tab, event) {
      this.changeNum();
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
        this.$router.push('/home')
        return;
      }
      let data = {
        type: Number(this.$route.query.type),
        userId: this.userId
      }
      if(this.$route.query.model){
        data.id = Number(this.$route.query.id)
      }else{
        data.objectId = Number(this.$route.query.id)
      }
      this.$axios
        .post("/index/checkCommentAuth", data)
        .then((res) => {
          if (res.code === 200) {
            this.commentData = res.data;
            this.$axios
              .post("/index/getUserCommentDetail", {
                type: Number(this.$route.query.type),
                id: Number(this.$route.query.id),
              })
              .then((res) => {
                this.evaluationList = res.data;
                this.changeNum();
                if (res.data[0].status == 1) {
                  this.isSubmit = true;
                }
              });
          }
        });
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
        this.$message("评课字数限制300字内！", "error");
        return;
      }
      let evaluationData = {
        type: Number(this.$route.query.type),
        commentId: Number(this.$route.query.id),
        status: 0,
        itemList: this.evaluationList,
        summary: this.summary,
      };
      this.$axios.post("/index/commentOnline", evaluationData).then(
        (res) => {
          if (res.code == 200) {
            this.$message("保存草稿成功", "success");
            this.checkIsComment();
          }
        },
        (err) => {}
      );
    },
    // 提交评课
    submitEvaluation() {
      if(this.checkData(this.evaluationList.length - 1) == false) {
        this.evaluationData = {
          type: Number(this.$route.query.type),
          commentId: Number(this.$route.query.id),
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
              return this.$message(`评分评价项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          }else if(this.evaluationList[i].wordDataDtos[j].type == 1){
            if(this.evaluationList[i].wordDataDtos[j].content == '' || this.evaluationList[i].wordDataDtos[j].content == null) {
              return this.$message(`评语必填！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content.length > 100) {
              return this.$message(`文字评价项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `评语为100字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`文字评价项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
          } else if(this.evaluationList[i].wordDataDtos[j].type == 2) {
            if(!this.evaluationList[i].wordDataDtos[j].userScore){
              this.evaluationList[i].wordDataDtos[j].userScore = 0;
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`评分评价项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content == '' || this.evaluationList[i].wordDataDtos[j].content == null) {
              return this.$message(`评语必填！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].content.length > 100) {
              return this.$message(`文字评价项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `评语为100字符内！`, 'error');
            }
            if(this.evaluationList[i].wordDataDtos[j].remarks && this.evaluationList[i].wordDataDtos[j].remarks !== '' && this.evaluationList[i].wordDataDtos[j].remarks.length > 50) {
              return this.$message(`文字评价项` + `${this.evaluationList[i].wordDataDtos[j].levelOne + (this.evaluationList[i].wordDataDtos[j].levelTwo ? (this.evaluationList[i].wordDataDtos[j].levelThree ? this.evaluationList[i].wordDataDtos[j].levelTwo + this.evaluationList[i].wordDataDtos[j].levelThree : this.evaluationList[i].wordDataDtos[j].levelTwo) : '')}` + `备注内容为50字符内！`, 'error');
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
      this.$axios.post("/index/commentOnline", this.evaluationData).then(
        (res) => {
          if (res.code == 200) {
            this.$message("评课成功", "success");
            this.checkIsComment();
            this.checkShow = false;
          }
        },
        (err) => {}
      );
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
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
 ::v-deep .el-tabs__header{
  margin: 15px 30px 30px 30px;
}
.admin{
  display: flex;
  justify-content: center;
  align-items: center;
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
  // height: 700px;
  margin: 0 auto;
  background: #f1f2f4;

  .video-wrap {
    position: relative;
    width: 927px;

    .video-error {
      position: absolute;
      height: 647px;
      width: 927px;
      z-index: 10;
      background: #000;
      top: 0;
      left: 0;
      color: #fff;
      text-align: center;
      line-height: 580px;
    }
  }

  .video-content {
    position: relative;
    height: 647px;
    width: 100%;
    background: #000;
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
          background: #ff9727;
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
    margin-left: 6px;
    background: #fff;
    position: relative;

    // padding: 23px 25px 0 32px;
    .evaluation {
      width: 154px;
      height: 145px;
      position: absolute;
      right: -160px;
      top: 430px;
      // z-index: 1;
      cursor: pointer;
    }

    .tabs {
      display: flex;
      justify-content: space-around;
      width: 273px;
      height: 42px;
      line-height: 42px;
      border-bottom: 1px solid #eeeeee;
      background: #fff;
      position: absolute;
      z-index: 100;

      .tabItem {
        // width: 168px;
        height: 42px;
        font-size: 22px;
        color: #333333;
        cursor: pointer;

        span {
          font-size: 16px;
        }

        .tabItemActive {
          height: 40px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          display: inline-block;
          color: #035aff;
          border-bottom: 2px solid #035aff;
        }
      }
    }

    .item-info {
      width: 273px;
      height: 100%;
      box-sizing: border-box;
      padding: 60px 25px 0 32px;

      .title {
        font-size: 18px;
        color: #222;
        font-weight: bold;
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
            color: #035aff;
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
    }

    .chat-window {
      position: relative;
      width: 273px;
      height: 100%;
      background: #fff;
      overflow: hidden;

      .chat-box {
        position: relative;
        width: 280px;
        height: 543px;
        padding: 40px 30px 15px 30px;
        overflow-y: auto;
        color: #333333;
        font-family: Microsoft YaHei;
        // border:1px solid #c9d8db;
        box-sizing: border-box;

        .message {
          margin: 24px 0;

          .message-author {
            line-height: 1;
            color: #999999;

            .avatar {
              width: 20px;
              height: 20px;
              margin-right: 9px;
              display: inline-block;
              // border: 1px #000 dashed;
              vertical-align: text-bottom;
            }

            .teacherMark {
              display: inline-block;
              border: 1px #409eff solid;
              border-radius: 4px;
              color: #409eff;
              font-size: 12px;
              position: relative;
              top: -1px;
            }
          }

          .a-message {
            min-width: 100px;
            // background: #ebeef5;
            padding: 1px;
            box-sizing: border-box;
            border-radius: 6px;
            margin: 5px;
            padding-left: 27px;
            word-wrap: break-word;
            vertical-align: text-bottom;
          }
        }
      }

      .send-btn {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 101;
        padding: 5px 10px;
      }

      .forbidden,
      .unLogin {
        width: 100%;
        height: 212px;
        text-align: center;
        position: absolute;
        bottom: 0;
        font-family: Microsoft YaHei;
        font-size: 14px;
        color: #999999;
      }

      .forbidden {
        z-index: 200;
        line-height: 248px;
        cursor: not-allowed;
      }

      .unLogin {
        z-index: 201;
        line-height: 288px;
      }

      .newTips {
        min-width: 130px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: rgba(44, 188, 240, 0.8);
        border-radius: 10px;
        font-size: 12px;
        color: #fff;
        position: absolute;
        left: 50%;
        top: 500px;
        transform: translate3d(-50%, -50%, 0);
        cursor: pointer;
      }

      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.5s;
      }

      .fade-enter,
			.fade-leave-to

			/* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
      }
    }
  }
}

.imgViewBox {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;

  .block {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: 900px;

    .imgView {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
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
    content: "";
    width: 39px;
    height: 39px;
    background: #c9dcff;
    border-radius: 50%;
    position: absolute;
    left: -20px;
    top: -6px;
    z-index: -1;
  }
}
</style>

<style lang="scss">
.videoEnd {
  width: 927px;
  height: 647px;
  background: #000;

  p {
    color: white;
    text-align: center;
    line-height: 647px;
  }
}
</style>
<style lang="scss">
.liveInteract {
  margin-top: 50px;

  // .el-dialog {
  //   background: #4f4f4fe8 !important;
  // }

  .el-carousel__container {
    height: 780px !important;
  }

  .el-carousel__item {
    display: flex !important;
  }

  .el-dialog--center {
    margin-top: 2vh !important;
  }

  .el-rate__text {
    color: #fa8c47 !important;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .bounce-enter-active {
    animation: bounce-in 0.8s;
  }

  .bounce-leave-active {
    animation: bounce-in 0.8s reverse;
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
    // min-width: 500px;
    // min-height: 600px;
    width: 1300px;
    height: auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
    resize: both;
    // overflow:auto;
    top: 54px;
    left: 300px;
    z-index: 999;

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
      margin-top: 20px;
      position: relative;
      width: 100%;
      // height: 30px;
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
        // color: blueviolet;
      }
    }

    .evaluation-content {
      // table{
      //   border-collapse: collapse;
      //   tr{   
      //     height: 50px;
      //     line-height: 50px;
      //   }
      //   th{

      //   }
      //   td{
      //     // border: 1px solid;
      //   }
      // }
      // height: 700px;
      width: 100%;
      padding: 0 30px 30px 30px;
      box-sizing: border-box;

      .part-title {
        margin: 0 0 10px 0;
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
        }

        .evaluation-text {
          width: 100%;
          height: 118px;
          background: #ffffff;
          border: 1px solid #dbe2e7;
          opacity: 1;
          border-radius: 6px;
          margin: 18px 0 0px 0;
          padding: 10px;
          box-sizing: border-box;
        }
      }

      .evaluation-bottom {
        padding: 30px 0px 0 0px;
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
          color: #305bff;
        }

        // .evaluation-btn:first-child {
        //   color: #fff;
        //   background: #305bff;
        // }
      }
    }
  }
}

.w-e-text-container {
  border: none !important;
  width: 280px;
  height: 128px !important;
  z-index: 100 !important;
}

.w-e-toolbar {
  border: none !important;
  width: 280px;
  background: #fbfbfb !important;
  border: 1px solid #f1f1f1 !important;
  z-index: 100 !important;
}

.w-e-text {
  text-align: left;
  font-family: Microsoft YaHei;
  font-size: 14px;
  z-index: 100 !important;
  word-break: break-all;
}

.w-e-panel-container {
  width: 262px !important;
  top: -170px !important;
  left: 35% !important;
}

.w-e-panel-tab-content {
  height: 100px !important;
}

.eleImg {
  vertical-align: text-bottom;
}
.totalNum{
  text-align: right;
  margin-right: 60px;
}
</style>
