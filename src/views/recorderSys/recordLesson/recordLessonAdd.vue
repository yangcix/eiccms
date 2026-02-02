<!-- recordLessonAdd -->
<template>
  <!-- <div id="recordLessonAdd"> -->
    <div class="content-main-wrap" id="recordLessonAdd">
      <p class="content-title"><el-page-header @back="goBack" content="编辑课表"></el-page-header></p>
      
      <div class="main-wrap">

        <div>班级名称：<el-input class="width-2" type="text" placeholder="输入班级名称" v-model.trim="classTemplate" disabled/></div>
        <div class="introduce">课表内容:</div>
        <el-table
          :data="applyTableData"
          border
          style="width: 1433px">
          <el-table-column
            prop="date"
            label="时间\星期"
            :render-header="renderHeaderDate"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.startTime">
                <!-- <i class="el-icon-edit-outline icon"></i> -->
                <div  class="has">{{scope.row.startTime}}-{{scope.row.endTime}}</div>
              </div>
              
              <!-- <div v-else @click="add(scope,scope.$index)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期一"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[0].subject" @click="editLesson(scope.row, scope.$index,0)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[0].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[0].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,0)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期二"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[1].subject" @click="editLesson(scope.row, scope.$index,1)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[1].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[1].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,1)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期三"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[2].subject" @click="editLesson(scope.row, scope.$index,2)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[2].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[2].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,2)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期四"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[3].subject" @click="editLesson(scope.row, scope.$index,3)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[3].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[3].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,3)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期五"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[4].subject" @click="editLesson(scope.row, scope.$index,4)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[4].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[4].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,4)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期六"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[5].subject" @click="editLesson(scope.row, scope.$index,5)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[5].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[5].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,5)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="星期日"
            width="179">
            <template slot-scope="scope">
              <div v-if="scope.row.curriculumList && scope.row.curriculumList[6].subject" @click="editLesson(scope.row, scope.$index,6)">
                <i class="el-icon-edit-outline icon"></i>
                <div class="lessonHas">{{scope.row.curriculumList[6].subject}}</div>
                <div class="teacherHas">{{scope.row.curriculumList[6].teacherName}}</div>
              </div>
              
              <div v-else @click="addLesson(scope,scope.$index,6)" class="hasnt">
                <i class="el-icon-plus"></i>
                <p>点击添加</p>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" class="saveBtn">保存</el-button>

        <el-dialog
          title="输入课程"
          :visible.sync="lessonVisible"
          width="370px"
          :close-on-click-modal="false"
          :before-close="lessonVisibleClose">
          <el-input class="width-5 subject" placeholder="课程内容" v-model.trim="curriculumList.subject"></el-input>
          <el-select v-model="curriculumList.teacherId" placeholder="请选择教师" class="width-5" filterable>
            <el-option
              v-for="item in listTeacher"
              :key="item.id"
              :label="item.nickName"
              :value="item.id">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="lessonVisibleClose">取 消</el-button> -->
            <el-button type="primary" @click="comfirmLesson">确 定</el-button>
          </span>
        </el-dialog>

      </div>
    </div>
  <!-- </div> -->

</template>

<script>
import { dateFormat } from '../../../assets/js/utils'
export default {
    name: '',
    data() {
        return {
          classTemplate:'', // 课表名称
          deleteShow:false,
          dialogFormVisible:false,
          currentAddIndex:'',
          listTeacher:[],
          form:{
            start:'',
            end:''
          },
          curriculumList:{
            subject:'',
            teacherId:''
          },
          formLabelWidth:"60",
          tableData: [],
          applyTableData:[], // 展示表数据
          lessonVisible: false,
          currentLessonX: '', // 当前课程索引X
          currentLessonY: '', // 当前课程索引Y
          isAddLesson: true, // 是添加
          editId:'' // 课表id

        }
    },
    mounted() {
        this.handleListTeacher();
          if(this.$route.query.id){
          this.editId = this.$route.query.id;
          this.classTemplate = this.$route.query.name;
          this.getTableData();
        }
    },
    methods: {
      //返回
			goBack(){
				this.$router.go(-1);
			},
      // 获取主讲教师列表
			handleListTeacher() {
				this.$axios.get('/sys/user/listTeacher').then(res => {
					this.listTeacher = res.data;
				});
			},
      // 获取课表数据
      getTableData() {
        this.$axios.get(`/sm/curriculum/info?classId=${this.editId}`).then(res => {
          this.tableData = res.data;
          console.log(this.tableData)
          this.handleTableData();
        })
      },
      // 处理表格数据
      handleTableData() {
        // 构造已填数据map
        let lessonMap = {}
        this.tableData.forEach((row,ri) => {
          if( row.curriculumList){
            row.curriculumList.forEach((lesson,li) => {
              lessonMap[`${ri+1}-${lesson.week}`] = lesson
            })
          }
        })
        // console.table(lessonMap)
        // 构造空结构课表
        let tempDate = [];
        tempDate =  this.tableData.map(item => {
          return  {
            startTime:item.startTime,
            endTime:item.endTime,
            id:item.id,
            templateId:item.templateId,
            curriculumList:[]
          }
        })
        // console.log(tempDate)
        // 空课表填入map数据
        tempDate.forEach((row,rindex) => {
          for(let i=1;i<8;i++){
            if(lessonMap[`${rindex+1}-${i}`]){
              row.curriculumList.push(lessonMap[`${rindex+1}-${i}`])
            }else {
              let lesson = {
                  subject:'',
                  teacherName:'',
                  teacherId:'',
                  templateDetailId:row.id,
                  week:i
                }
                row.curriculumList.push(lesson)
              }
            }
        })
        
        this.applyTableData = Object.assign([],tempDate);
      },


      // 选择教师
      chooseTeacher(e) {
        // debugger
        this.applyTableData[this.currentLessonX].curriculumList[this.currentLessonY].teacherName = this.listTeacher.filter(item => item.id == e)[0].nickName;
      },
     

      // 添加课程
      addLesson(data,index,s) {
        console.log(data,index,s)
        this.isAddLesson = true;
        this.currentLessonX = index;
        this.currentLessonY = s;
        this.lessonVisible = true;
        
      },

      // 编辑课程
      editLesson(data,index,s) {
        console.log(data,index,s)
        this.isAddLesson = false;
        this.currentLessonX = index;
        this.currentLessonY = s;
        this.curriculumList.subject = data.curriculumList[s].subject;
        this.curriculumList.teacherId = data.curriculumList[s].teacherId;
        this.lessonVisible = true;
      },

      // 关闭课程对话框
      lessonVisibleClose() {
        this.curriculumList.subject = '';
        this.curriculumList.teacherId = '';
        this.lessonVisible = false;
      },

      // 确认课程信息
      comfirmLesson() {
        if(!this.curriculumList.subject){
          this.$message('请输入课程名称','error');
          return 
        }
        if(this.curriculumList.subject && this.curriculumList.subject.length > 10){
          this.$message('课程名称不超过10字符','error');
          return 
        }
        if(!this.curriculumList.teacherId){
          this.$message('请选择教师','error');
          return 
        }
        this.chooseTeacher(this.curriculumList.teacherId)
        this.applyTableData[this.currentLessonX].curriculumList[this.currentLessonY].subject = this.curriculumList.subject;
        this.applyTableData[this.currentLessonX].curriculumList[this.currentLessonY].teacherId = this.curriculumList.teacherId;
        this.curriculumList.subject = '';
        this.curriculumList.teacherId = '';
        this.lessonVisible = false;
      },

      save () {
        // this.verify()
        let temp = [];
        this.applyTableData.forEach(item => {
          temp = temp.concat(item.curriculumList)
        })
        
        let params = {
          classId:this.editId,
          curriculumList:temp
        }
        this.$axios.post('/sm/curriculum/update',params).then(res => {
         if(res.code == 200){
           this.$message('保存成功','success')
           this.$router.push('/sm/curriculum')
         }
        })
      },
      // 表头
      renderHeaderDate(){
        return (
          <div class="line">
              <div class="week">星期</div>
              <div class="time">时间</div>
          </div>
          )
      },
      // aline() {
      //   var c=document.getElementById("myCanvas");
      //   console.log(c)
      //   var ctx=c.getContext("2d");
      //   ctx.beginPath();
      //   ctx.moveTo(0,0);
      //   ctx.lineTo(300,150);
      //   ctx.stroke();
      // }
    }
}
</script>

<style lang="scss" scoped>
  #recordLessonAdd {
    .main-wrap {
      height: 620px;
    }
    .introduce {
      margin: 30px 0 30px 0;
    }
    .line{
      position:relative;
      width:180px;
      height:50px;
      box-sizing:border-box;
      // border:1px solid #333;  
      // background-color:#333;
      // line-height:120px;
      text-indent:5px;

      .week {
        position: absolute;
        top:3px;
        left: 109px;
        width: 54px;
        height: 30px;
        color: #909399;
        z-index: 1000;
      }
      .time {
        position: absolute;
        top:18px;
        left: 4px;
        width: 54px;
        height: 30px;
        color: #909399;
        z-index: 1000;
      }
    }

    .hasnt {
      height: 47px;
      line-height: 22px;
      cursor: pointer;
      color: #379BFF;
      font-size: 14px;
    }
    .has {
      height: 47px;
      line-height: 47px;
      cursor: pointer;
      font-size: 14px;
    }
    .teacherHas {
      color: #999999;
    }
    .icon {
      position: absolute;
      top: 18px;
      right: 14px;
      cursor: pointer;
    }

    .line::before{
      content: "";
        position: absolute;
        left: 48px;
        top: 12px;
        width: 130%;
        height: 38px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        transform-origin: bottom center;
        transform: rotateZ(16deg) scale(1.414);
      // animation:slash 5s infinite ease;
    }

    .subject {
      margin-bottom: 20px;
    }

    @keyframes slash{
      0%{
        transform:rotateZ(0deg) scale(1);
      }
      30%{
        transform:rotateZ(45deg) scale(1);
      }
      60%{
        transform:rotateZ(45deg) scale(1.414);
      }
      100%{
        transform:rotateZ(45deg) scale(1.414);
      }
    }

    .saveBtn {
      width: 161px;
      height: 48px;
      background: #409EFF;
      color: #fff;
      font-size: 22px;
      border-radius: 7px;
      position: relative;
      left: 50%;
      transform: translate(-50%, 25px);
    }
  }
</style>

<style lang="scss">
#recordLessonAdd {
  .el-table th.is-leaf {
    padding: 0;

    .cell {
      text-align: center;
      padding: 0;
    }
  }
  .cell {
    text-align: center;
    padding: 0;
  }
}

</style>