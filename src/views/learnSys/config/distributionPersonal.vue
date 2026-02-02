<template>
  <div class="content-main-wrap">
    <p class="content-title">AI分析次数管理</p>
    <div class="main-wrap">
      <div class="search-operat-new">
        <div>
          <el-input v-model="nameOrCodeSearchKey" class="width-2" placeholder="请输入姓名/编号关键字" v-search="search"
                    clearable></el-input>
          <span class="search-desc">分析池名称：</span>
          <el-select
              :popper-append-to-body="false"
              v-model="id"
              placeholder="请输入所在分析池关键字"
              class="width-2"
              filterable
              @clear="handlerClear"
          >
            <el-option v-for="item in distributionList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <span class="search-desc">状态：</span>
          <el-select v-model="searchStatus" placeholder="选择状态" class="width-3" style="width: 80px;">
            <el-option v-for="item in searchStatusList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" class="search-btn" @click="search()">查询</el-button>
          <el-button style="float: right;" v-if="permission.batch" @click="batch()">批量分配</el-button>
        </div>
      </div>
      <!--      <div style="width: 100%; display: flex; flex-wrap: nowrap;margin-top: 32px;font-size: 15px">
              <p style="margin-top: 20px; ; display: inline-block;">
                <span style="margin-left: 0;">AI课堂分析已分配次数：{{ assignableStatistics.aiAnalysisAssignedNumber + '次' }}</span>
                <span style="margin-left: 10px; color: green;font-weight: bold;">剩余可分配次数：{{ assignableStatistics.aiAnalysisAssignableNumber + '次' }}</span>
                <span style="margin-left: 30px;">大单元分析已分配次数：{{ assignableStatistics.largeUnitAssignedNumber + '次' }}</span>
                <span style="margin-left: 10px; color: green; font-weight: bold;">剩余可分配次数：{{assignableStatistics.largeUnitAssignableNumber + '次' }}</span>
              </p>
            </div>-->
      <div v-if="expendType == 1"
          style="width: 100%;min-width: 1260px; overflow-x: auto; height: 60px;align-items: center;display: flex;margin-top: 30px;background-color: #f0f0f0; border-radius: 5px;">
        <p style="width: 100%;min-width: 1260px;font-size: 16px;">
          <span style="display: block;float: left;height: 38px;line-height: 42px;margin-left: 30px;">
<!--            <span style="margin-left: 0;">AI课堂分析 - 已使用：{{ frequency.classAnalyseUsed + '次' }}</span>-->
            <span style="margin-left: 20px;">AI课堂分析 - <span style="color: #F59A23;">剩余：{{ frequency.classAnalyseRemainder + '次' }}</span></span>
            <span style="margin-left: 20px;border-left: 2px solid #D7D7D7;"></span>
            <span style="margin-left: 20px;">已分配：{{ frequency.classAnalyseAssigned + '次' }}</span>
            <span style="margin-left: 20px;padding-right: 10px; color: #70B603;">待分配：{{
                frequency.classAnalyseAssignable + '次'
              }}</span>
          </span>
          <span
              style="display: block;float: left;height: 38px;line-height: 42px;margin-left: 30px;border-right: 2px solid #AAAAAA;">
          </span>
          <span style="display: block;float: left;height: 38px;line-height: 42px;margin-left: 30px;">
            <span style="display: block; border-left: 2px solid #cccccc;line-height: 45px"></span>
            <span style="display: block;float: left;height: 38px;line-height: 42px;"></span>
<!--            <span style="padding-left: 10px;">AI大单元分析 - 已使用：{{ frequency.largeUnitUsed + '次' }}</span>-->
            <span style="margin-left: 20px;">AI大单元分析 - <span style="color: #F59A23;">剩余：{{ frequency.largeUnitRemainder + '次' }}</span></span>
            <span style="margin-left: 20px;border-left: 2px solid #D7D7D7;"></span>
             <span style="padding-left: 20px;">已分配：{{ frequency.largeUnitAssigned + '次' }}</span>
            <span style="margin-left: 20px; color: #70B603;">待分配：{{ frequency.largeUnitAssignable + '次' }}</span>
          </span>
        </p>
      </div>
      <div v-if="expendType == 1" class="table">
        <el-table v-loading="loading" :data="personalList" style="width: 100%;"
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="51"></el-table-column>
          <el-table-column prop="code" align="center" label="编号">
            <template slot-scope="scope">
              {{ scope.row.code ? scope.row.code : '——' }}
            </template>
          </el-table-column>
          <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              {{ scope.row.status === 0 ? '禁用' : '启用' }}
            </template>
          </el-table-column>
          <el-table-column prop="aiDistributionName" align="center" label="所在分析池"></el-table-column>
          <el-table-column prop="aiAnalysisUsedNum" align="center" label="AI课堂分析使用量">
            <template slot-scope="scope">
              {{ scope.row.aiAnalysisUsedNum }} / {{ scope.row.aiAnalysisDistributionNum }}
            </template>
          </el-table-column>
          <el-table-column prop="largeUnitUsedNum" align="center" label="大单元分析使用量">
            <template slot-scope="scope">
              {{ scope.row.largeUnitUsedNum }} / {{ scope.row.largeUnitDistributionNum }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <ul class="operat-list">
                <el-button type="text" v-if="permission.limit" @click="quotaAllocation(0,scope.row)">额度分配
                </el-button>
                <el-button type="text" v-if="permission.info" @click="checkInfo(scope.row)">查看明细</el-button>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="table-null">
        <div class="null-data">
          <img src="../../../assets/imgs/home-null.png" alt=""/>
          <p>该分析池为学校公用，无需分配到个人账号</p>
        </div>
      </div>
      <div v-if="expendType == 1" class="table-page">
        <el-pagination
            layout="prev, pager, next"
            @current-change="pageChange"
            :page-count="pages"
            :current-page="pageNum">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="批量分配" :close-on-click-modal="false" :visible.sync="batchShow" width="1000px"
               @close="batchCancel()">
      <hr class="batch-line"/>
      <div>
        <div>
          <em class="batch-prefix">*</em><span style="color: black;">调整产品：</span>
          <el-select v-model.trim="batchProducts" style="width: 280px; margin-bottom: 20PX; margin-left: 10px;">
            <el-option v-for="item in batchOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
        <p>
          <em class="batch-prefix">*</em><span style="color: black;">调整账号：</span>
          <span style="margin-left: 30px;color: black;">分配账号</span>
          <span style="margin-left: 60px;color: black;">所在分析池</span>
          <span style="margin-left: 70px;color: black;">AI课堂分析剩余次数</span>
          <span style="margin-left: 40px;color: black;">大单元分析剩余次数</span>
          <em class="batch-prefix" style="margin-left: 80px">*</em><span style="color: black;">调整数值</span>
          <el-tooltip placement="top">
            <div slot="content">正整数：将所选账号增加对应的AI分析次数；<br/>负整数：将所选账号减少对应的AI分析次数；</div>
            <i class="iconfont icon-wenhao" style="margin-left: 10px; color: #000000"></i>
          </el-tooltip>
        </p>
        <div class="batch-data">
          <el-table :show-header="false" :row-style="{ height: '10px'}" :cell-style="{ padding: '12px 0'}"
                    v-loading="loading" :data="batchTableData" style="width: 100%;">
            <el-table-column align="left" prop="userName" width="115px"></el-table-column>
            <el-table-column align="left" prop="aiDistributionName" width="135px"></el-table-column>
            <el-table-column align="center" prop="aiNumber" width="164px"></el-table-column>
            <el-table-column align="center" prop="largeUnitNumber" width="164px"></el-table-column>
            <el-table-column align="center" prop="number">
              <template #default="scoped">
                <el-input-number class="batch-num" :precision="0" v-model="scoped.row.number"
                                 @blur="blurNumber"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--        <p class="batch-prompt">注：账号将从所在分析池进行调整</p>-->
        <div class="batch-remark">
          <div class="batch-left">
            备注：
          </div>
          <el-input type="textarea" :rows="4" placeholder="" maxlength="200" show-word-limit class="batch-upload-wrap"
                    v-model="batchRemark"></el-input>
        </div>
        <div class="batch-btn-list">
          <el-button class="confirm" type="primary" @click="batchConfirm()">确定</el-button>
          <el-button class="cancel" @click="batchCancel()">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
        title="额度分配"
        :close-on-click-modal="false"
        :visible.sync="shareShow"
        width="700px"
        @close="quotaAllocation(2)"
    >
      <hr class="line"/>
      <div>
        <p>
          <span class="span-title">分配账号：</span>
          <span style="margin-left: 10px; color: #1e1e1e;">{{ shareRow.userName }}</span>
        </p>
        <p class="prompt">AI课堂分析剩余次数：{{
            personalRemainder.aiAnalysisRemainderNumber + '次'
          }}，大单元分析剩余次数：{{
            personalRemainder.largeUnitRemainderNumber + '次'
          }}</p>
        <p style="margin-bottom: 10px; margin-left: -14px;">
          <span class="span-title">所在分析池：</span>
          <span style="margin-left: 10px; color: #1e1e1e;">{{ shareRow.aiDistributionName }}</span>
        </p>
        <p class="prompt">AI课堂分析剩余可分配次数：{{
            personalRemainder.aiAnalysisAssignableNumber + '次'
          }}，大单元分析剩余可分配次数：{{
            personalRemainder.largeUnitAssignableNumber + '次'
          }}</p>
        <div>
          <em class="prefix">*</em>
          <span class="span-title">调整产品：</span>
          <el-select v-model.trim="shareProducts" style="width: 280px; margin-bottom: 20PX; margin-left: 10px;">
            <el-option v-for="item in shareOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <em class="prefix">*</em>
          <span class="span-title">调整数值：</span>
          <el-input-number class="width-6x" :precision="0" v-model="distributionNum"
                           @blur="blurNumber"></el-input-number>
          <el-tooltip placement="top">
            <div slot="content">正整数：将所选账号增加对应的AI分析次数；<br/>负整数：将所选账号减少对应的AI分析次数；
            </div>
            <i class="iconfont icon-wenhao" style="margin-left: 10px; color: #000000"></i>
          </el-tooltip>
        </div>
        <div class="remark">
          <div class="left">
            备注：
          </div>
          <el-input type="textarea" :rows="4" class="upload-wrap" show-word-limit maxlength="200"
                    v-model="remark"></el-input>
          `
        </div>
        <div class="btn-list">
          <el-button class="confirm" type="primary" @click="quotaAllocation(1,shareRow)">确定</el-button>
          <el-button class="cancel" @click="quotaAllocation(2)">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
        title="查看明细"
        :close-on-click-modal="false"
        :visible.sync="infoShow"
        width="1100px"
        @close="closedInfo()"
    >
      <hr class="info-line"/>
      <div class="tableData">
        <el-table
            :row-style="{ height: '10px'}"
            :cell-style="{ padding: '12px 0'}"
            v-loading="loading"
            :data="infoTableDate"
            style="width: 100%;">
          <el-table-column align="center" prop="products" label="产品名称" width="220px">
            <template slot-scope="scope">
              {{ scope.row.products === 1 ? 'AI课堂分析（教师版&专业版）' : '大单元分析' }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="time" label="时间" width="160px"></el-table-column>
          <el-table-column align="center" prop="relatedMatters" label="关联事项" width="100px"></el-table-column>
          <el-table-column align="center" prop="mattersInfo" label="备注">
            <template #default="scoped">
              <el-tooltip v-if="scoped.row.mattersInfo.replace(/\s+/g, '').length > 20"
                          :content="scoped.row.mattersInfo" placement="top" popper-class="custom-tooltip">
                            <span
                                style="display: -webkit-box;
                                       text-overflow: ellipsis;
                                       overflow: hidden;
                                       -webkit-line-clamp: 1;
                                       -webkit-box-orient: vertical;
                                       white-space: pre-line;">
                                {{ scoped.row.mattersInfo }}
                            </span>
              </el-tooltip>
              <span v-else>{{ scoped.row.mattersInfo }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="number" label="数值变化" width="100px">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.number >= 0 ? 'green' : 'red' }">{{
                  scope.row.number >= 0 ? '+' + scope.row.number : scope.row.number
                }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="surplusNumber" label="分析剩余次数" width="110px"></el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination
            layout="prev, pager, next"
            @current-change="infoPageChange"
            :page-count="infoPage"
            :current-page="infoPageNum">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {formatDate} from '@/assets/js/utils';

export default {
  data() {
    return {
      id: '',
      aiId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).aiDistributionId : "", // 用户所在分析池id
      personalList: [],
      tableData: [], // 列表数据
      distributionList: [],// 分析池列表
      assignableStatistics: {
        aiAnalysisAssignedNumber: 0,// AI课堂分析已分配次数
        aiAnalysisAssignableNumber: 0,// AI课堂分析剩余可分配次数
        largeUnitAssignedNumber: 0,// 大单元分析已分配次数
        largeUnitAssignableNumber: 0,// 大单元分析已分配次数
      },// 已分配和剩余可分配次数
      personalRemainder: {
        aiAnalysisRemainderNumber: 0,// AI课堂分析剩余次数(分配账号)
        aiAnalysisAssignableNumber: 0,// AI课堂分析剩余可分配次数(所在分析池)
        largeUnitRemainderNumber: 0,// 大单元分析剩余次数(分配账号)
        largeUnitAssignableNumber: 0,// 大单元分析剩余可分配次数(所在分析池)
      },//  AI分析次数管理-额度分配里面的当前账号已分配的剩余次数与分析池可分配次数的计算
      frequency: {
        classAnalyseUsed: 0,// AI课堂分析 - 已使用
        classAnalyseRemainder: 0,// 剩余
        classAnalyseAssigned: 0,// 已分配
        classAnalyseAssignable: 0,// 待分配
        largeUnitUsed: 0,// 大单元分析次数 - 已使用
        largeUnitRemainder: 0,// 剩余
        largeUnitAssigned: 0,// 已分配
        largeUnitAssignable: 0,// 待分配
      },
      expendType: 1,// 消耗方式
      clearId: false,//
      permission: '', // 权限
      nameOrCodeSearchKey: "", // 姓名/编号搜索关键词
      orgNameSearchKey: "", // 分析池搜索关键词
      searchStatus: "", // 搜索状态
      total: '',
      pageNum: 1,
      pages: 0,
      searchStatusList: [{value: '', label: '全部'}, {value: 0, label: '禁用'}, {value: 1, label: '启用'}],
      loading: false, // 表格加载
      batchShow: false, // 批量分配弹窗
      batchTableData: [], // 批量分配列表数据
      batchConfirmData: [], // 批量分配确定数据
      batchProducts: 1, // 批量分配弹窗调整产品默认选中数据
      batchOptions: [
        {
          value: 1,
          label: 'AI课堂分析（教师版&专业版）'
        },
        {
          value: 2,
          label: '大单元分析'
        }
      ], // 批量分配弹窗调整产品选择项
      batchRemark: "", // 批量分配备注
      shareShow: false, // 额度分配弹窗
      shareRow: {}, // 额度分配选择数据
      shareProducts: 1, // 额度分配弹窗调整产品默认选中数据
      shareOptions: [
        {
          value: 1,
          label: 'AI课堂分析（教师版&专业版）'
        },
        {
          value: 2,
          label: '大单元分析'
        }
      ], // 额度分配弹窗调整产品选择项
      distributionNum: 0, // 调整数值
      checkInfoId: '', // 查询明细时的ID
      remark: "", // 备注
      infoShow: false, // 明细弹窗
      infoTableDate: [], // 明细列表数据
      infoPageNum: 1,
      infoPage: 0,
      infoTotal: '',
    }
  },
  created() {
    this.getDistributionList();
    this.getDistributionSelect();
    this.getList();
  },
  mounted() {
    // this.search();
    // this.getAssignableStatistics();
    // this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.loading = true;
      if (this.expendType === 0 && this.clearId) {
        this.expendType = 1;
      }
      this.clearId = false;
      let data = new FormData();
      data.append('userKeyWord', this.nameOrCodeSearchKey);
      data.append('keyWord', this.orgNameSearchKey);
      data.append('status', this.searchStatus);
      data.append('expendType', this.expendType);
      data.append('id', this.id);
      data.append('pageNum', this.pageNum);
      data.append('pageSize', 10);
      this.$axios.post("/aiDistributionPersonal/list", data).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.personalList = res.data.pageList;

          this.permission = this.creatPermit(res.data.permit);
          this.pages = res.data.pages;
          this.total = res.data.total;
        }
      });
      this.loading = false;
    },
    //获取分析池列表
    getDistributionList() {
      let data = new FormData();
      data.append('id', this.id);
      data.append('keyWord', "");
      data.append('expendType', 1);
      data.append('pageNum', 1);
      data.append('pageSize', 200);
      this.$axios.post('/aiDistribution/listByAuthOrg', data).then(res => {
        if (res.code === 200) {
          this.distributionList = res.data.pageList;
          this.setDefaultId();
        }
      })
    },
    // 设置默认值
    setDefaultId() {
      if (this.id && this.distributionList.length > 0) {
        const selectedDistribution = this.distributionList.find(item => item.id === this.id);
        if (selectedDistribution) {
          this.id = selectedDistribution.id; // 确保 id 是有效的
        } else {
          this.id = ''; // 如果找不到对应的分析池，清空 id
        }
      }
    },
    getDistributionSelect() {
      this.$axios.get('/aiDistributionPersonal/getDistributionSelect').then(res => {
        if (res.code === 200) {
          this.id = res.data?.aiDistributionId;
          this.expendType = res.data?.expendType
          this.setDefaultId();
          this.getTotalUser();
          this.getList();
        }
      })
    },
    // 获取分析次数统计
    getTotalUser() {
      let data = {
        aiDistributionId: this.id,
        userKeyWord: this.nameOrCodeSearchKey,
        status: this.searchStatus
      }
      this.$axios.get("/aiDistributionPersonal/getTotal", data).then((res) => {
        if (res.code == 200) {
          this.frequency = res.data;
        }
      });
    },
    // 清空选择分析池
    handlerClear(){
      this.clearId = true;
    },
    // 当分析池变更时，相应的变更消耗方式
    distributionChange() {
      if (this.distributionList.length < 1 || !this.id) {
        return;
      }
      const selectDistribution = this.distributionList.filter(item => item.id === this.id);
      if (selectDistribution && selectDistribution.length === 1) {
        console.log("selectDistribution selectDistribution ", selectDistribution);
        this.expendType = selectDistribution[0].expendType;
        console.log("当前选择的分析池消耗方式：", selectDistribution[0].expendType);
      }
    },
    // 获取AI分析次数已分配与可分配情况(AI课堂、大单元)
    getAssignableStatistics() {
      this.$axios.get('/aiDistributionPersonal/getAssignableStatistics', {
        aiDistributionId: this.id
      }).then(res => {
        if (res.code === 200) {
          this.assignableStatistics = res.data;
        }
      })
    },
    // 列表搜索
    search() {
      this.scrollTo0();
      this.pageNum = 1;
      this.batchTableData = [];
      this.distributionChange();
      this.getTotalUser();
      this.getList();
    },
    // 批量分配
    batch() {
      console.log("批量分配中，分析池类型为：", this.expendType);
      if (this.batchTableData.length <= 0 && this.expendType === 1) {
        this.$message('请选择账号！', 'error');
        return;
      }
      if (this.batchTableData.length <= 0 && this.expendType === 0) {
        this.$message('该分析池为学校公用，无需分配到个人账号！', 'error');
        return;
      }
      this.batchShow = true;
    },
    // 批量分配确定
    batchConfirm() {
      this.batchConfirmData = this.batchTableData.map(item => ({
        aiDistributionId: item.aiDistributionId,
        products: this.batchProducts,
        remark: this.batchRemark,
        id: item.id,
        number: item.number
      }));
      this.$axios.post('/aiDistributionPersonal/batch', this.batchConfirmData).then(res => {
        if (res.code === 200) {
          this.batchShow = false;
          this.getTotalUser();
          this.getList();
        }
      })
    },
    // 批量分配取消
    batchCancel() {
      this.batchShow = false;
      this.batchProducts = 1;
      this.batchTableData = this.batchTableData.map(item => ({
        ...item,
        number: 0
      }))
      this.batchRemark = '';
    },
    // 调整
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
    //多选
    handleSelectionChange(val) {
      if (val.length == 0) {
        this.batchTableData = [];
      }
      this.batchTableData = [];
      val.forEach(val => {
        this.batchTableData.push(val);
      })
      this.batchTableData = this.batchTableData.map(item => ({
        ...item,
        aiNumber: item.aiAnalysisDistributionNum - item.aiAnalysisUsedNum,
        largeUnitNumber: item.largeUnitDistributionNum - item.largeUnitUsedNum,
        number: 0
      }))
    },
    // 列表分页点击
    pageChange(val) {
      this.scrollTo0();
      this.pageNum = val;
      this.getList();
    },
    // 获取AI分析次数已分配与可分配情况(AI课堂、大单元) 和 当前选择用户的剩余可分析次数情况
    getUserRemainder(aiDistributionId, userId) {
      this.$axios.get('/aiDistributionPersonal/getUserRemainder', {
        aiDistributionId: aiDistributionId,
        userId: userId
      }).then(res => {
        if (res.code === 200) {
          this.personalRemainder = res.data;
        }
      })
    },
    // 额度分配 0分配弹窗 1确认分配 2取消分配
    quotaAllocation(type, val) {
      if (type === 0) {
        this.shareRow = val;
        this.shareShow = true;
        this.getUserRemainder(val.aiDistributionId, val.userId);
      } else if (type === 1) {
        // 确认分配
        if (this.verify(val)) {
          return
        }
        console.log("==================================== shareRow: ", val);
        let requestData = new FormData();
        requestData.append('aiDistributionId', this.shareRow.aiDistributionId);
        requestData.append('id', this.shareRow.id)
        requestData.append('products', this.shareProducts);
        requestData.append('number', this.distributionNum);
        requestData.append('remark', this.remark);
        this.$axios.post('/aiDistributionPersonal/limit', requestData).then(res => {
          if (res.code === 200) {
            this.shareShow = false;
            this.getTotalUser();
            this.getList();
          }
        })
      } else {
        this.shareProducts = 1;
        this.distributionNum = 0;
        this.remark = '';
        this.shareShow = false;
      }
    },
    // 获取分析次数明细
    getAiDistributionPersonalInfo() {
      let data = new FormData();
      data.append('id', this.checkInfoId);
      data.append('pageNum', this.infoPageNum);
      data.append('pageSize', 10);
      this.$axios.post('/aiDistributionPersonal/info', data).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.infoTableDate = res.data.pageList;
          this.infoPage = res.data.pages;
          this.infoTotal = res.data.total;
        }
      })
    },
    closedInfo(){
      this.infoPage = 1;
      this.infoShow = false;
    },
    // 查看明细
    checkInfo(val) {
      this.infoShow = true;
      this.loading = true;
      this.checkInfoId = val.id;
      this.infoPageNum = 1;
      this.getAiDistributionPersonalInfo();
    },
    // 查看明细页分页点击
    infoPageChange(val) {
      this.scrollTo0();
      this.infoPageNum = val;
      this.getAiDistributionPersonalInfo();
    },
    // 数值还原
    blurNumber(e) {
      if (!e.target.value) {
        e.target.value = 0;
      }
    },
    // 验证
    verify(row) {
      if (this.distributionNum === 0) {
        this.$message('调整数值不能为0！', 'error');
        return true;
      }
      let stringLength = this.remark.replace(/\s+/g, '');
      if (stringLength.length > 200) {
        this.$message('备注内容不得超过200字！', 'error');
        return true;
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.custom-dropdown-btn {
  margin-left: 10px;
  cursor: pointer;
  color: #409EFF;
  padding: 0; /* 按钮内边距 */
  border: none;
}
.search-operat-new {
  width: 100%;
  z-index: 3000 !important;
}
.el-select-dropdown {
  z-index: 3000 !important;
}

.table {
  margin-top: 20px;
  padding: 0 24px;
  border: 1px solid #ebebeb;
  min-width: 1260px;
  overflow-x: auto;
}

.table-null {
  margin-top: 20px;
  padding: 0 24px;
  border: 1px solid #ebebeb;
  height: 400px;
}

.operat-list {
  color: #409eff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.batch-line {
  margin-top: -30px;
  margin-bottom: 20px;
  width: 945px;
}

.batch-data {
  padding: 0 20px;
  border: 1px solid #ebebeb;
  margin-top: 20px;
  margin-left: 75px;
  width: 800px;
}

.batch-num {
  width: 180px;
}

.batch-prompt {
  margin-top: 20px;
  margin-left: 105px;
  color: gray;
}

.batch-remark {
  display: flex;
  height: 80px;
  margin-top: 20px;
}

.batch-left {
  align-content: center;
  height: 80px;
  margin-left: 33px;
  color: black;
}

.batch-upload-wrap {
  height: 80px;
  width: 374px;
  border: solid #DCDFE6 1px;
  resize: none;
  margin-left: 14px;
}

.batch-btn-list {
  margin-top: 40px;
  margin-bottom: 20px;
  margin-left: 75px;
}

.line {
  margin-top: -30px;
  margin-bottom: 20px;
  width: 645px;
}

.info-line {
  margin-top: -30px;
  margin-bottom: 20px;
  width: 1045px;
}

.upload-wrap {
  height: 80px;
  width: 274px;
  border: solid #DCDFE6 1px;
  resize: none;
  margin-left: 14px;
}

.prompt {
  margin: 20px 80px;
  color: gray;
  font-size: 11px;
}

.batch-prefix {
  color: red;
}

.prefix {
  color: red;
  margin-left: -6px;
}

.remark {
  display: flex;
  height: 80px;
}

.left {
  align-content: center;
  height: 80px;
  margin-left: 27px;
  color: #1e1e1e;
}

.width-6x {
  width: 180px;
  margin-bottom: 20PX;
  margin-left: 10px;
}

.btn-list {
  margin-top: 40px;
  margin-left: 89px;
}

.confirm {
  width: 100px;
  height: 40px;
}

.cancel {
  width: 100px;
  height: 40px;
  margin-left: 20px;
}

.tableData {
  padding: 0 24px;
  border: 1px solid #ebebeb;
  margin-top: 20px;
  width: 996px;
}

.null-data {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  img {
    padding-top: 80px;
    width: 560px;
    height: 240px;
  }

  p {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
    color: rgb(117, 112, 112);
    font-size: 18px;
  }
}

.span-title {
  color: #1e1e1e;
}

.borderless-select .el-input {
  border: none;
  box-shadow: none;
}

.custom-tooltip .el-tooltip__popper {
  max-width: 400px !important;
  word-wrap: break-word;
  white-space: pre-line;
}
</style>

<style scoped>
::v-deep .el-dialog__header {
  padding: 20px 30px 10px;
}

::v-deep .el-dialog__body {
  padding: 30px 30px;
  font-size: 14px;
  color: white;
}

::v-deep .el-dialog__wrapper {
  left: 240px;
}
</style>