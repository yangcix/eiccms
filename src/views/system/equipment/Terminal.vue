<template>
  <div class="content-main-wrap">
    <p class="content-title">终端管理</p>
    <div class="main-wrap">
      <div class="search-operat">
        <div>
          <el-input v-model="searchKey" class="width-2" placeholder="请输入设备名称关键字进行查询" v-search="search"
                    clearable></el-input>
          <el-button type="primary" class="search-btn" @click="search">查询</el-button>
        </div>

        <div>
          <el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save">新增</el-button>
        </div>
      </div>
      <div class="data-table table-border">
        <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%">
          <el-table-column
              prop="id"
              align="center"
              label="编号">
          </el-table-column>
          <el-table-column
              prop="terminalName"
              align="center"
              label="设备名称">
          </el-table-column>
          <el-table-column
              prop="productName"
              align="center"
              label="设备类型">
          </el-table-column>
          <el-table-column
              prop="model"
              align="center"
              min-width="95px"
              label="设备型号">
            <template slot-scope="scope">
              {{ scope.row.model }}
              <!-- /{{scope.row.code}} -->
            </template>
          </el-table-column>
          <el-table-column
              prop="ipAddress"
              align="left"
              label="IP地址">
          </el-table-column>
          <el-table-column
              prop="terminalPosition"
              align="center"
              label="位置">
          </el-table-column>
          <el-table-column
              prop="online"
              align="center"
              label="状态">
          </el-table-column>
          <el-table-column
              align="center"
              width="100px"
              label="操作">
            <template slot-scope="scope">
              <ul class="operat-list">
                <li @click="add(0, scope.row)" v-if="permission.update">编辑</li>
                <li @click="deleteData(scope.row)" style="color:#f56c6c" v-if="permission.delete">删除</li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination
            layout="prev, pager, next"
            @current-change="pageChange"
            :page-count="pages"
            :current-page="pageNum">
        </el-pagination>
      </div>

      <el-dialog
          :title="addEditType == 0 ? '编辑设备' : '新增设备'"
          :close-on-click-modal="false"
          :visible.sync="addEditShow"
          width="450px">
        <div class="dialog-wrap">
          <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
          <div class="dialog-item">
            <p>设备名称</p>
            <p><em>*</em>：</p>
            <el-input class="width-2" v-model.trim="addEditInfo.terminalName"></el-input>
          </div>
          <div class="dialog-item">
            <p>设备型号</p>
            <p><em>*</em>：</p>
            <el-select v-model.trim="addEditInfo.ruleId" placeholder="请选择" class="width-2" filterable>
              <el-option
                  v-for="item in ruleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>


          <div class="dialog-item">
            <p>IP地址</p>
            <p><em>*</em>：</p>
            <el-input class="width-2" v-model.trim="addEditInfo.ipAddress"></el-input>
          </div>
          <div class="dialog-item">
            <p>用户名</p>
            <p><em>*</em>：</p>
            <el-input class="width-2" v-model.trim="addEditInfo.terminalAccount"></el-input>
          </div>
          <div class="dialog-item">
            <p>用户密码</p>
            <p><em>*</em>：</p>
            <el-input class="width-2" v-model.trim="addEditInfo.terminalPassword"></el-input>
          </div>
          <div class="dialog-item">
            <p>直播方式</p>
            <p><em>*</em>：</p>
            <el-radio-group v-model="addEditInfo.streamMode">
              <el-radio :label="0">RTMP推流</el-radio>
              <el-radio :label="1">RTSP拉流</el-radio>
            </el-radio-group>
          </div>
          <div class="dialog-item">
            <p>位置</p>
            <p><em>*</em>：</p>
            <el-select v-model="addEditInfo.orgId" @change="shcoolChange" placeholder="请选择学校" class="width-2"
                       filterable>
              <el-option
                  v-for="item in schoolList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="dialog-item">
            <p style="margin-right: 19px"></p>
            <el-select v-model="addEditInfo.buildingId" @change="buildChange" placeholder="请选择教学楼"
                       style="margin-right: 10px;width: 150px" filterable>
              <el-option
                  v-for="item in buildlList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="addEditInfo.classroomId" placeholder="请选择教室" style="width: 120px" filterable>
              <el-option
                  v-for="item in classroomList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="dialog-btn">
          <el-button type="primary" @click="addEditConfirms">确 定</el-button>
          <el-button @click="handleAddEditShow">取 消</el-button>
        </div>

      </el-dialog>

      <el-dialog
          title="系统提示"
          :close-on-click-modal="false"
          :visible.sync="deleteShow"
          width="420px">
        <div class="dialog-wrap">
          <p class="err-delete">您确定删除该设备？</p>
          <div class="dialog-btn">
            <el-button type="primary" @click="deleteData()">确 定</el-button>
            <el-button @click="deleteShow = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {creatTree, throttle} from '@/assets/js/utils';

export default {
  name: '',
  data() {
    this.addEditConfirms = throttle(this.addEditConfirm, 500);
    return {
      searchKey: '',
      searchStatus: '',
      tableData: [],
      pageNum: 1,
      permission: '',
      pages: 0,
      addEditShow: false,
      addEditType: 0,
      addEditInfo: {classroomId: '', buildingId: '', rtspUrl: ''},
      errorInfo: '',
      // terminalTypeList: [{label: '手机', value: 0}, {label: '编码器', value: 1}, {label: '录播设备', value: 2}],
      schoolList: [],
      buildlList: [],
      classroomList: [],
      deleteShow: false,
      deleteRow: '',
      currentIndex: 0,
      totalS: '',
      loading: false, // 表格加载
      ruleList: [], // 所有规则
    }
  },
  components: {},
  mounted() {
    this.getTerminalList();
    this.getAllTerminalRule();
  },
  methods: {
    //获取设备
    async getTerminalList() {
      let data = {
        type: localStorage.getItem('sysModule') == 1 ? 0 : -1,
        pageNum: this.pageNum,
        pageSize: 10,
        keyWord: this.searchKey,
      };
      this.loading = true;
      const listResp = await this.$axios.get('/sys/terminal/list', data);
      if (listResp.code === 200) {
        this.tableData = await this.getTerminalStatus(listResp.data.pageList);
        this.permission = this.creatPermit(listResp.data.permit);
        this.pages = listResp.data.pages;
        this.totalS = listResp.data.total;
        this.loading = false;
      }
    },
    // 获取所有设备规则
    getAllTerminalRule() {
      this.$axios.get('/sm/terminalRule/listAll').then(res => {
        this.ruleList = res.data;
      });
    },
    //获取服务器状态
    async getTerminalStatus(tableData) {
      console.log("tableData: ", tableData);
      if (!tableData) {
        return;
      }
      console.log("遍历中...");
      tableData.forEach((item, i) => {
        let getStatus = async (i) => {
          if (tableData.length - 1 < i) {
            return
          }
          let terminal = tableData[i];
          if (terminal.ipAddress) {
            const resp =  await this.$axios.get('/sys/terminal/getTerminalStatus', {
              ip: terminal.ipAddress,
              port: 0,
              password: terminal.terminalPassword ? terminal.terminalPassword : 'test',
              name: terminal.terminalName,
              user: terminal.terminalAccount ? terminal.terminalAccount : 'test',
            });
            if (resp.code == 200) {
              if (tableData.length - 1 < i) {
                return
              }
              console.log("resp.data.status : ", resp.data.status);
              this.$set(tableData[i], 'online', resp.data.status == 1 ? '在线' : '不在线');
            } else {
              this.$set(tableData[i], 'online', '不在线');
              console.log(terminal.name + ": 不在线");
            }
          } else {
            this.$set(tableData[i], 'online', '-');
            console.log(terminal.name + ": -");
          }
        }
        getStatus(i);
      })
      return tableData;
    },
    //获取学校列表 type 0编辑 1新增
    getSchoolList(type) {
      this.$axios.get('/sys/org/listSchool').then(res => {
        this.schoolList = res.data;
        if (type === 1) {
          if (this.schoolList.length > 0) {
            this.addEditInfo.orgId = this.schoolList[0].orgId ? this.schoolList[0].orgId : '';
            if (this.addEditInfo.orgId) {
              this.getTeachBuildList(this.addEditInfo.orgId);
            }
          }
        }
      })
    },
    //选择学校后 教学楼、教室修改
    shcoolChange(id) {
      this.buildlList = [];
      this.addEditInfo.buildingId = '';
      this.addEditInfo.classroomId = '';
      this.classroomList = [];
      this.getTeachBuildList(id);
    },
    //根据学校id获取教学楼列表
    getTeachBuildList(orgId) {
      this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then(res => {
        this.buildlList = res.data;
      })
    },
    //根据教学楼id获取教室列表
    getClassroomList(buildingId) {
      this.$axios.get('/sys/classroom/getClassroomList', {buildingId: buildingId}).then(res => {
        this.classroomList = res.data;
      })
    },
    //教学楼改变后教室修改
    buildChange(id) {
      this.addEditInfo.classroomId = '';
      this.classroomList = [];
      this.getClassroomList(id);
    },
    //新增 编辑
    add(type, val) {
      this.errorInfo = '';
      this.addEditType = type;
      if (type == 0) { //编辑
        this.getSchoolList(0);
        this.getTeachBuildList(val.orgId);
        this.getClassroomList(val.buildingId);
        this.addEditInfo = {
          terminalName: val.terminalName,
          ruleId: val.ruleId,
          terminalAccount: val.terminalAccount,
          terminalPassword: val.terminalPassword,
          streamMode: val.streamMode,
          orgId: val.orgId,
          buildingId: val.buildingId,
          classroomId: val.classroomId,
          id: val.id,
          ipAddress: val.ipAddress,
        };
        this.originStatus = val.status;
      } else {
        this.addEditInfo = {
          terminalName: '',
          ruleId: '',
          terminalAccount: '',
          terminalPassword: '',
          streamMode: 0,
          orgId: '',
          buildingId: '',
          classroomId: '',
          ipAddress: '',
        };
        this.classroomList = []
        this.buildlList = []
        this.getSchoolList(1);
      }
      this.addEditShow = true;
    },
    addEditConfirm() {
      this.errorInfo = '';
      if (this.verify()) {
        return
      }
      ;
      let url = '/sys/terminal/save';
      if (this.addEditType == 0) { //0编辑
        url = '/sys/terminal/update';
      }
      ;
      this.$axios.post(url, this.addEditInfo).then(res => {
        if (res.code == 200) {
          this.addEditShow = false;
          this.$message(res.message, 'success');
          this.getTerminalList();
          this.buildlList = []; // 清空教学楼数据
          this.classroomList = []; // 清空教室数据
        }
      })
    },
    handleAddEditShow() {
      this.addEditShow = false;
      this.classroomList = [];
    },
    //删除
    deleteData(val) {
      if (val) {
        this.deleteShow = true;
        this.deleteRow = val;
      } else {
        this.$axios.post('/sys/terminal/delete', [this.deleteRow.id]).then(res => {
          if (res.code == 200) {
            this.deleteShow = false;
            this.$message('删除成功', 'success');
            this.totalS = this.totalS - 1;
            if (this.pageNum * 10 - this.totalS === 10) {
              this.pageNum = this.pageNum - 1 || 1
            }
            this.getTerminalList();
          }
        })
      }
    },
    //搜索
    search() {
      this.scrollTo0();
      this.pageNum = 1;
      this.getTerminalList();
      // 获取设备状态
      this.$nextTick(() => {
        // 确保在数据更新后再获取状态
        if (this.tableData.length) {
          console.log("获取设备在线状态...")
          this.getTerminalStatus();
        }
      });
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
    //分页点击
    pageChange(val) {
      this.scrollTo0();
      this.tableData = [];
      this.currentIndex = 0;
      this.pageNum = val;
      this.getTerminalList();
    },
    //验证
    verify() {
      if (this.$verify.isEmpty(this.addEditInfo.terminalName)) {
        this.errorInfo = "设备名称不能为空";
        return true;
      }
      if (this.$verify.chLetterNum(this.addEditInfo.terminalName, 20)) {
        this.errorInfo = '设备名称由中文大小写字母数字组成，最长20位！';
        return true;
      }
      if (!this.addEditInfo.ruleId) {
        this.errorInfo = '请选择设备型号！';
        return true;
      }
      if (!this.addEditInfo.ipAddress) {
        this.errorInfo = 'IP格式不能为空！';
        return true;
      }
      if (this.$verify.ip(this.addEditInfo.ipAddress)) {
        this.errorInfo = 'IP格式不正确！';
        return true;
      }
      if (!this.addEditInfo.terminalAccount || this.addEditInfo.terminalAccount.length > 20) {
        this.errorInfo = '用户名不能为空且最长20位！';
        return true;
      }
      ;
      if (!this.addEditInfo.terminalPassword || this.addEditInfo.terminalPassword.length > 50) {
        this.errorInfo = '用户密码不能为空且最长50位！';
        return true;
      }
      ;
      console.log(this.addEditInfo.orgId, this.addEditInfo.buildingId, this.addEditInfo.classroomId)
      if (this.$verify.isEmpty(this.addEditInfo.orgId) || this.$verify.isEmpty(this.addEditInfo.buildingId) || this.$verify.isEmpty(this.addEditInfo.classroomId)) {
        this.errorInfo = '请选择具体位置！';
        return true;
      }
    },
  }
  ,
}
</script>

<style lang="scss" type="text/scss" scoped>

</style>
