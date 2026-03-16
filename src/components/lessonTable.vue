<template>
  <div id="lessonTable">
    <div class="table-head">
      <div class="className">{{classInfo.name}} ： {{classInfo.className}}</div>
      <div class="optionName">自动录制:</div>
      <el-radio-group v-model="autoRecord" @change="allOption" :disabled="!this.enterClassId">
        <el-radio :label="1">全部开启</el-radio>
        <el-radio :label="0">全部暂停</el-radio>
      </el-radio-group>
    </div>
    
    <el-table
      :header-row-style="{ height: '83px' }"
			:cell-style="{ height: '83px' }"
      :data="applyTableData"
      border
      style="width: 1433px">
      <el-table-column
        prop="date"
        label="时间"
        width="179">
        <template slot-scope="scope">
            <div  class="has">{{scope.row.startTime}}-{{scope.row.endTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期一"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[0].subject">
            <p class="nameTitle" @click="aaa(scope.row)">{{scope.row.curriculumList[0].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[0].record"
              @change="aloneSwitch(scope.row.curriculumList[0],scope.$index,0)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期二"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[1].subject">
            <p class="nameTitle">{{scope.row.curriculumList[1].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[1].record"
              @change="aloneSwitch(scope.row.curriculumList[1],scope.$index,1)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期三"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[2].subject">
            <p class="nameTitle">{{scope.row.curriculumList[2].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[2].record"
              @change="aloneSwitch(scope.row.curriculumList[2],scope.$index,2)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期四"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[3].subject">
            <p class="nameTitle">{{scope.row.curriculumList[3].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[3].record"
              @change="aloneSwitch(scope.row.curriculumList[3],scope.$index,3)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期五"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[4].subject">
            <p class="nameTitle">{{scope.row.curriculumList[4].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[4].record"
              @change="aloneSwitch(scope.row.curriculumList[4],scope.$index,4)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期六"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[5].subject">
            <p class="nameTitle">{{scope.row.curriculumList[5].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[5].record"
              @change="aloneSwitch(scope.row.curriculumList[5],scope.$index,5)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="星期日"
        width="179">
        <template slot-scope="scope">
          <div v-if="scope.row.curriculumList[6].subject">
            <p class="nameTitle">{{scope.row.curriculumList[6].subject}}</p>
            <el-switch 
              v-if="scope.row.curriculumList"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.curriculumList[6].record"
              @change="aloneSwitch(scope.row.curriculumList[6],scope.$index,6)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapState } from 'vuex';
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
          lesson:{
            subject:'',
            teacherName:''
          },
          applyTableData:[], // 渲染数组
          tableData: [{
            startTime: '15:21',
            endTime: '22:10',
            curriculumList:[
              {
                subject:'数学',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学1',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学2',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学3',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学4',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学4',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学4',
                teacherName:'刘关',
                record: 0,
              },
            ]
          }, {
            startTime: '15:21',
            endTime: '22:10',
            curriculumList:[
              {
                subject:'数学5',
                teacherName:'刘关',
                record: 1,
              },
              {
                subject:'数学6',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学7',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学8',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学9',
                teacherName:'刘关',
                record: 0,
              },{
                subject:'数学4',
                teacherName:'刘关',
                record: 0,
              },
              {
                subject:'数学4',
                teacherName:'刘关',
                record: 0,
              },
            ]
          }],

          currentLessonX: '', // 当前课程索引X
          currentLessonY: '', // 当前课程索引Y
          isAddLesson: true, // 是添加

          autoRecord: 0 // 默认不全部开启

        }
    },
    computed:{
      ...mapState({
        classInfo:'classInfo'
      })
    },
    mounted() {
      this.getCurriculumInfo();
    },
    watch:{
      activeName(val) {
        if(val === 'second'){
          console.log('到课表')
          this.getCurriculumInfo();
        }
      }
    },
    methods: {
      // 获取课表
      getCurriculumInfo() {
        if(this.enterClassId){
          this.$axios.get('/sm/recordOverview/curriculumInfo',{
            classId: this.enterClassId,
          }).then(res => {
            this.autoRecord = res.data.record;
            this.tableData = res.data.list ? res.data.list : [];
            this.handleTableData();
          })
        }else {
          this.autoRecord = 0;
          this.tableData = [];
          this.handleTableData();
        }
        
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
        console.log(tempDate)
      },

      // 全部开关
      allOption() {
        let allData = {
          id:'',
          record: this.autoRecord,
          classId: this.enterClassId
        }
        this.$axios.post('/sm/recordOverview/switchRecord',allData).then(res => {
          if(res.code == 200){
            this.getCurriculumInfo();
            this.$message(res.message,'success')
          }else {
            this.$message(res.message,'error')
            this.autoRecord = this.autoRecord === 0 ? 1 : 0;
          }
        })
      },
      // 单独开关录制
      aloneSwitch(item,rindex,cindex) {
        console.log(item,rindex,cindex)
        let singleData = {
          id:item.id,
          record: item.record,
          classId: ''
        }
        this.$axios.post('/sm/recordOverview/switchRecord',singleData).then(res => {
          if(res.code == 200){
            this.$message(res.message,'success')
          }else {
            this.$message(res.message,'error')
            this.applyTableData[rindex].curriculumList[cindex].record = item.record === 0 ? 1 :0;
          }
        })
      },

      
    }
}
</script>

<style lang="scss" scoped>
  #lessonTable {

    .table-head {
      display: flex;
      margin: 14px 0 24px 0;
      .className {
        margin-right: 100px;
        font-size: 14px;
        color: #333333;
      }
      .optionName {
        margin-right: 20px;
        font-size: 14px;
        color: #333333;
      }
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

    }

    .nameTitle {
      font-weight:bold;
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

  }

</style>

<style lang="scss">
  #lessonTable {
    .el-dialog__body {
        padding-top: 0 ;
    }
    .el-table th.is-leaf {
      padding: 0 ;

      .cell {
        text-align: center ;
        padding: 0 ;
      }
    }
    .cell {
        text-align: center ;
        padding: 0 ;
      }
  }

</style>