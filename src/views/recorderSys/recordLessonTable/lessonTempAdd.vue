<!-- lessonTempAdd -->
<template>
  <div class="content-main-wrap">
      <p class="content-title"><el-page-header @back="goBack" :content="`${$route.query.data ? '编辑' : '新增'}课表模板`"></el-page-header></p>
        <div class="main-wrap" >
          <div id="lessonTempAdd">
            <div><em class="custom">*</em>模板名称
          <el-input class="input" type="text" placeholder="输入模板名称" v-model.trim="classTemplate" />
        </div>
        <template>
          <div id="lessonTempAdd">
            <div class="introduce"><em class="custom">*</em>模板内容
          <el-button type="primary" class="content" @click="lessonAllocation()">上课时长配置</el-button>
          <el-button type="primary" class="content" @click="addRow()">添加一行</el-button>
          <el-button type="primary" class="content" @click="reduceRow()">减少一行</el-button>
          <span class="content">注：从模版最后一行位置开始添加和减少</span>
          </div>
          </div>
        </template>
        <el-dialog
			title="上课时长配置"
			:close-on-click-modal="false"
			:visible.sync="durationConfigurationShow"
			width="500px"
      @close="cancel()">
			<div class="popUp">
          <div><em class="custom">*</em><span style="color: #303133">上课时长</span>
            <el-input class="input" v-model="duration"  @input="(v) => (duration = v.replace(/[^0-9]/g,''))" @blur="defocus()"/>
          </div>
        </div>
        <span class="popUp">注：默认填充时间使用！最少10分钟，最多输入60分钟。</span>
				<div style="margin-top: 40px; display: flex; justify-content: right;">
          <el-button @click="cancel()" style="margin-right: 10px;">取 消</el-button>
					<el-button type="primary" @click="confirm()" style="margin-right: 10px;">确 定</el-button>
				</div>
		</el-dialog>
            <el-table
              :data="tableData"
              border
              style="width: 1433px">
              <el-table-column
                prop="date"
                label="时间\星期"
                :render-header="renderHeaderDate"
                width="186"
                :resizable="false" >
                <template slot-scope="scope">
                  <div v-if="scope.row.startTime" @click="edit(scope.row, scope.$index)">
                    <i class="el-icon-edit-outline icon"></i>
                    <div class="has">{{scope.row.startTime}}-{{scope.row.endTime}}</div>
                  </div>
                  <div v-else @click="add(scope,scope.$index)" class="hasnt">
                    <i class="el-icon-plus"></i>
                    <p>点击添加</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期一"
                width="178"
                :resizable="false" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期二"
                width="178"
                :resizable="false" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期三"
                width="178"
                :resizable="false" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期四"
                width="178"
                :resizable="false" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期五"
                width="178"
                :resizable="false" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期六"
                width="178"
                :resizable="false" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="星期日"
                width="178"
                :resizable="false" >
              </el-table-column>
            </el-table>

            <el-button type="primary" @click="save" class="saveBtn">保存</el-button>


            <el-dialog 
              width="320px" 
              title="时间" 
              :close-on-click-modal="false"
              :visible.sync="dialogFormVisible"
              :before-close="timeFormClose"
              center>
              <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="开始时间">
                  <el-time-picker
                      v-model="form.start"
                      @change="autoTime"
                      type="datetime"
                      style="width: 180px"
                      format="HH:mm"
                      placeholder="开始时间">
                    </el-time-picker>
                    
                  <!-- <el-input v-model="form.start" placeholder="开始时间" @change = da></el-input> -->
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-time-picker
                      v-model="form.end"
                      @change="verifyTime"
                      type="datetime"
                      style="width: 180px"
                      format="HH:mm"
                      placeholder="结束时间">
                    </el-time-picker>
                  <!-- <el-input v-model="form.end" placeholder="结束时间"></el-input> -->
                </el-form-item>
         
                  <el-button class="timeBtn" type="primary" @click="onSubmit">确 定</el-button>
              
              </el-form>
            </el-dialog>
          </div>
        </div>
  </div>
</template>

<script>
import { dateFormat, formatterDate } from '../../../assets/js/utils'
export default {
    name: '',
    data() {
        return {
          classTemplate:'',
          durationConfigurationShow:false,
          dialogFormVisible:false,
          currentAddIndex:'',
          duration:40,
          addDuration:40,
          returnValue:0,
          form:{
            start:'',
            end:''
          },
          formLabelWidth:"60",
          tableData: [
            {
              startTime:'',
              endTime: '',
            }, {
              startTime:'',
              endTime: '',
            }, {
              startTime:'',
              endTime: '',
            }, {
              startTime:'',
              endTime: '',
            },
            {
              startTime:'',
              endTime: '',
            },
            {
              startTime:'',
              endTime: '',
            },
            {
              startTime:'',
              endTime: '',
            },
            {
              startTime:'',
              endTime: '',
            },
            {
              startTime:'',
              endTime: '',
            }
          ],

          editId:'',
          gradeList: []
        }
    },
    mounted() {
      if(this.$route.query.data){
        let data = JSON.parse(this.$route.query.data)
        this.editId = data.id;
        this.classTemplate = data.name;
        this.gradeList = data.gradeList;
        this.getEditTemp();
      }
      if(this.editId != ''){
        this.getDefaultTime()
      }
    },
    methods: {
      // 编辑获取数据
      //返回
			goBack(){
				this.$router.go(-1);
			},
      getEditTemp() {
        this.$axios.get(`/sm/lessonTemplate/detailInfo?id=${this.editId}`).then(res => {
          this.tableData = res.data
          // this.tableData = [
          //   {
          //     startTime:'08:30',
          //     endTime: '09:15',
          //   }, {
          //     startTime:'08:30',
          //     endTime: '09:15',
          //   }, {
          //     startTime:'08:30',
          //     endTime: '09:15',
          //   }, {
          //     startTime:'08:30',
          //     endTime: '09:15',
          //   },
          //   {
          //     startTime:'08:30',
          //     endTime: '09:15',
          //   },
          //   {
          //     startTime:'08:30',
          //     endTime: '09:15',
          //   },
          //   {
          //     startTime:'',
          //     endTime: '',
          //   }
          // ]
        })
      },
      deleteData() {
        
      },
      checkTime(start,end){
        for(let i = 0;i<= this.tableData.length; i++){
          if(i!== this.currentAddIndex){
            if(this.tableData[i] && this.tableData[i].startTime !=='' && this.tableData[i].endTime !== ''){
              if (start >= this.tableData[i].startTime && start <= this.tableData[i].endTime) {
                return true;
              }
              if (end >= this.tableData[i].startTime&& end <= this.tableData[i].endTime) {
                return true;
              }
              if (start <= this.tableData[i].startTime && end >= this.tableData[i].endTime) {
                return true;
              }
              // return false;
            }
          }
        }
      },
      // 确定时间
      onSubmit() {
        if(this.form.start && this.form.end){
          if(this.checkTime(dateFormat("HH:MM",this.form.start),dateFormat("HH:MM",this.form.end))== true){
            return this.$message('时间存在重复，请重新选择','error')
          }
          this.tableData[this.currentAddIndex].startTime = dateFormat("HH:MM",this.form.start)
          this.tableData[this.currentAddIndex].endTime = dateFormat("HH:MM",this.form.end)
          this.dialogFormVisible = false
          this.form.start = '';
          this.form.end = '';
        }else {
          this.$message('请输入开始时间和结束时间','error')
        }
      },

      // 关闭清空
      timeFormClose(){
        this.form.start = '';
        this.form.end = '';
        this.dialogFormVisible = false;
      },
      // 编辑时间
      edit (item,index) {
        this.currentAddIndex = index; // 编辑索引赋值
        // 标准化时间
        this.form.start = formatterDate(item.startTime)
        this.form.end = formatterDate(item.endTime) 
        this.dialogFormVisible = true
      },
      // 添加时间
      add (item) {
        this.dialogFormVisible = true
        this.currentAddIndex = item.$index
        console.log(item)
      },
      // 自动结束时间加40分
      autoTime () {
        if(this.form.start){
          let val = this.editId == ''? this.duration : this.addDuration
          let end = this.form.start.getTime() + (val != 40 ? val * 60 * 1000 : 2400000)
          if(dateFormat("HH:MM",this.form.start) >= dateFormat("HH:MM",new Date(end))){
            return
          }
          this.form.end = new Date(end)
        }
      },
      // 时间校验
      verifyTime() {
        if(this.form.end && dateFormat("HH:MM",this.form.start) >= dateFormat("HH:MM",this.form.end)){
          this.$message('结束时间不得早于或等于开始时间','error')
          this.form.end = ''
          return
        }
      },
      
      verify() {
        if(!this.classTemplate || this.classTemplate.length>20) {
          this.$message('请输入模板名称，限制20字符','error')
          return true
        }
        for(let i in this.tableData) {
          if(this.tableData[i].startTime === '' || this.tableData[i].endTime === ''){
            this.$message('需要全部填写时间后才可保存！','error');
            return true;
          }
        }

        return false
      },
      save () {
        if(!this.verify()){
          let data
          let params = {
            name: this.classTemplate,
            detailList: this.tableData,
            defaultDuration: this.duration
          }
         if(this.$route.query.data){
          data = JSON.parse(this.$route.query.data)
          params.id=data.id
         }       
         let url = data&& data.id ? '/sm/lessonTemplate/update' : '/sm/lessonTemplate/save';
          this.$axios.post(url, params).then(res => {
						if (res.code === 200) {
              this.$message( data&& data.id ? '修改成功' : '添加成功', 'success' );
              this.$router.push('/sm/lessonTemplate');
            }
          })
        }
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
      //课时配置
      lessonAllocation(){
        if(this.editId != ''){
        this.$axios.get(`/sm/lessonTemplate/defaultDuration?id=${this.editId}`).then(res=>{
          if(res.code === 200){
            this.duration = res.data.defaultDuration;
            this.returnValue = res.data.defaultDuration;
          }
          this.durationConfigurationShow = true;
        })
      }else{
        this.duration = this.duration ? this.duration : 40
        this.durationConfigurationShow = true;
      }
      },
      //取消课时配置
      cancel(){
        this.durationConfigurationShow = false;
        setTimeout(() => {
          this.duration = this.addDuration === 40 ? 40 : this.addDuration
        }, 200);
      },
      //确认课时配置
      confirm(){
        if(this.$verify.isEmpty(this.duration)){
          this.$message('请输入上课时长！', 'error');
          return;
				};
        if (this.duration < 10 || this.duration > 60) {
        this.$message('请输入10-60之间的正整数！', 'error');
        this.duration = this.returnValue === 0 ? this.addDuration : this.returnValue
        return;
       };
       let formData = new FormData()
        formData.append('id', this.editId);
        formData.append('defaultDuration',this.duration);
        if(this.editId != ''){
          this.$axios.post(`/sm/lessonTemplate/updateTime`,formData).then(res=>{
            if(res.code == 200){
              this.addDuration = this.duration;
              this.durationConfigurationShow = false;
            }
          })
        }else{
          this.addDuration = this.duration;
          this.durationConfigurationShow = false;
        }
      },
      defocus(){
        if(this.duration){
          this.duration = parseInt(this.duration)
        }
      },
      //添加一行
      addRow(){
        if(this.gradeList.length > 0){
          this.$message('该模板已经被应用，无法添加！', 'error');
          return;
        }
        if(this.tableData.length >= 15){
          this.$message('模板最多只可添加15个时间段', 'error');
          return;
        }
        const newData = {
          startTime:'',
          endTime:''
        }
        this.tableData.push(newData);
      },
      //减少一行
      reduceRow(){
        if(this.gradeList.length > 0){
          this.$message('该模板已经被应用，无法减少！', 'error');
          return;
        }
        if(this.tableData.length <= 1){
          this.$message('模板至少添加一个时间段', 'error');
          return;
        }
        this.tableData.pop();
      },
      // 获取模版时长
      getDefaultTime(){
        this.$axios.get(`/sm/lessonTemplate/defaultDuration?id=${this.editId}`).then(res=>{
          if(res.code === 200){
            this.duration = res.data.defaultDuration;
            this.returnValue = res.data.defaultDuration;
            this.addDuration = res.data.defaultDuration;
          }
      })
      }
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
#lessonTempAdd {
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
      top:5px;
      left: 116px;
      width: 54px;
      height: 30px;
      color: #909399;
      z-index: 1000;
    }
    .time {
      position: absolute;
      top:16px;
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
  .icon {
    position: absolute;
    top: 18px;
    right: 23px;
    cursor: pointer;
  }

  .line::before{
    content: "";
    position: absolute;
    left: 15px;
    top: -6px;
    width: 100%;
    height: 38px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    -webkit-transform-origin: bottom center;
    transform-origin: bottom center;
    -webkit-transform: rotateZ(
22deg
) scale(1.414);
    transform: rotateZ(
15deg
) scale(1.414);
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

  .timeBtn {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .input {
    width: 280px;
    margin-left: 20px;
  }

  .content {
    margin-left: 20px;
  }
}
  .popUp {
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 40px;
    margin-bottom: 20px;
    color: #606266;
  }

  ::v-deep .el-dialog__title{
    padding-left: 20px;
  }

  ::v-deep input::-webkit-outer-spin-button,
	::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
	}
	::v-deep input[type='number'] {
		-moz-appearance: textfield !important;
	}

  .custom{
    color: red;
    margin-right: 1px;
  }

</style>

<style lang="scss">
  #lessonTempAdd {
    .el-dialog__body {
        padding-top: 0 !important;
    }
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