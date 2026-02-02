<template>
  <div class="content-main-wrap" style="min-width: 1260px;overflow-x: auto;overflow-y: auto">
    <p class="content-title">AI分析池管理</p>
    <div class="content-overflow">
      <div class="main-wrap" style="min-width: 1260px;overflow-x: auto;">
        <div class="search-operat-new">
          <div>
            <el-input v-model="searchKey" class="width-2" placeholder="请输入分析池名称关键字" v-search="search"
                      clearable></el-input>
<!--            <span class="search-desc">分析池状态：</span>
            <el-select v-model="orgStatus" placeholder="选择分析池状态" class="width-3" style="width: 160px;" clearable>
              <el-option v-for="item in orgStatusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>-->
            <el-button type="primary" class="search-btn" @click="search">查询</el-button>
            <el-button class="search-btn" type="primary" style="position: relative; right: 0;float: right"
                       @click="infoData()">查看分配明细
            </el-button>
          </div>
        </div>
        <div style="width: 100%;min-width: 1260px;overflow-x: auto;height: 60px;align-items: center;display: flex;margin-top: 30px;background-color: #F9F9F9; border-radius: 5px;">
          <p style="width: 93.04%;font-size: 16px;">
            <span style="display: block;float: left;margin-left: 30px;height: 38px;line-height: 42px;"><span style="margin-left: 20px;">AI课堂分析 - <span style="color: #F59A23;">剩余：{{ frequency.classAnalyseRemainder + '次' }}</span></span>
            <!-- <span style="display: block;float: left;margin-left: 30px;height: 38px;line-height: 42px;"><span style="margin-left: 20px;">AI课堂分析 - <span style="color: #F59A23;">剩余：0次</span></span> -->
              <span style="margin-left: 20px;border-left: 2px solid #D7D7D7;"></span>
              <span style="margin-left: 20px;">已分配：{{ frequency.classAnalyseAssigned + '次' }}</span>
              <span style="margin-left: 20px;padding-right: 10px; color: #70B603;">待分配：{{ frequency.classAnalyseAssignable + '次'}}</span>
            </span>
            <span style="display: flex;float: left;height: 38px;line-height: 42px;margin-left: 30px;border-right: 2px solid #AAAAAA;">
            </span>
            <span style="display: block;float: left;height: 38px;line-height: 42px;margin-left: 30px;">
              <span style="margin-left: 20px;">AI大单元分析 - <span style="color: #F59A23;">剩余：{{ frequency.largeUnitRemainder + '次' }}</span></span>
              <span style="margin-left: 20px;border-left: 2px solid #D7D7D7;"></span>
              <span style="padding-left: 20px;">已分配：{{ frequency.largeUnitAssigned + '次' }}</span>
              <span style="margin-left: 20px; color: #70B603;">待分配：{{ frequency.largeUnitAssignable + '次' }}</span>
            </span>
          </p>
        </div>
        <div class="data-table table-border" style="min-width: 1260px;overflow-y: auto;overflow-x: auto">
          <el-table v-loading="loading" :row-style="{ height: '10px' }" :cell-style="{ padding: '12px 0' }"
                    :data="tableData" style="width: 100%;">
            <el-table-column prop="name" align="center" label="分析池名称"></el-table-column>
            <el-table-column prop="aiAnalysisTotalNum" align="center" label="AI课堂分析已分配次数"></el-table-column>
            <el-table-column prop="aiAnalysisUsedNum" align="center" label="AI课堂分析使用量">
              <template slot-scope="scope">
                {{ scope.row.aiAnalysisUsedNum }} / {{ scope.row.aiAnalysisTotalNum }}
              </template>
            </el-table-column>
            <el-table-column prop="largeUnitTotalNum" align="center" label="大单元分析已分配次数"></el-table-column>
            <el-table-column prop="largeUnitUsedNum" align="center" label="大单元分析使用量">
              <template slot-scope="scope">
                {{ scope.row.largeUnitUsedNum }} / {{ scope.row.largeUnitTotalNum }}
              </template>
            </el-table-column>
            <el-table-column prop="expendType" align="center" label="消耗方式">
              <template slot-scope="scope">
                {{ scope.row.expendType === 0 ? '学校公用' : '个人账号消耗' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <ul class="operat-list">
                  <el-button type="text" v-if="scope.row.orgStatus === 1" @click="quotaAllocation(0,scope.row)">额度分配
                  </el-button>
                  <el-button type="text" v-if="scope.row.orgStatus === 1" @click="consumeConfig(0,scope.row)">消耗配置
                  </el-button>
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
      </div>
    </div>

    <el-dialog
        title="查看分配明细"
        :close-on-click-modal="false"
        :visible.sync="infoShow"
        width="1020px"
        @close="infoCancel()">
      <hr class="info-line"/>
      <div>
        <el-input
            v-model="infoSearchKey"
            placeholder="请输入分析池名称关键字"
            v-search="infoSearch"
            style="width: 240px;"
            clearable>
        </el-input>
        <span class="search-desc"><em style="color: red;"></em> 产品名称</span>
        <el-select v-model="products" placeholder="选择产品名称" style="width: 240px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" class="search-btn" @click="infoSearch()">查询</el-button>
      </div>
      <div class="table-list">
        <el-table
            :row-style="{ height: '10px'}"
            :cell-style="{ padding: '12px 0'}"
            v-loading="loading"
            :data="infoTableData"
            style="width: 100%;">
          <el-table-column align="center" prop="name" label="分析池名称"></el-table-column>
          <el-table-column align="center" prop="products" label="产品名称" width="220px">
            <template slot-scope="scope">
              {{ scope.row.products === 1 ? 'AI课堂分析（教师版&专业版）' : '大单元分析' }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="number" label="调整数值" width="100px">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.number >= 0 ? 'green' : 'red' }">{{
                  scope.row.number >= 0 ? '+' + scope.row.number : scope.row.number
                }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注" width="238px">
            <template #default="scoped">
              <el-tooltip v-if="scoped.row.remark.replace(/\s+/g,'').length > 15" :content="scoped.row.remark"
                          placement="top">
                  <span
                      style="display: block;
                           text-overflow: ellipsis;
                           overflow: hidden;
                           -webkit-line-clamp: 1;
                           -webkit-box-orient: vertical;
                           white-space: nowrap;
                           max-width: 320px;
                           word-break: break-word;">
                    {{ scoped.row.remark }}
                </span>
              </el-tooltip>
              <span v-else>{{ scoped.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="time" label="操作时间" width="160px"></el-table-column>
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

    <el-dialog
        title="额度分配"
        :close-on-click-modal="false"
        :visible.sync="shareShow"
        width="700px"
        @close="quotaAllocation(2)"
    >
      <hr class="line"/>
      <div>
        <p style="color: black;">AI课堂分析剩余可分配次数：{{
            frequency?.classAnalyseAssignable + '次'
          }}；大单元分析剩余可分配次数：{{ frequency?.largeUnitAssignable + '次' }}</p>
        <p class="prompt">注：若次数不足，请联系管理员充值</p>
        <p style="color:black; margin-bottom: 10px;">分析池名称：{{ shareRow.name }}</p>
        <div>
          <em class="prefix">*</em>
          <span style="color: #666668; font-weight: bold;"> 调整产品：</span>
          <el-select v-model.trim="shareProducts" style="width: 280px; margin-bottom: 20PX; margin-left: 10px;">
            <el-option v-for="item in shareOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <em class="prefix">*</em>
          <span style="color: #666668; font-weight: bold;"> 调整数值：</span>
          <el-input-number class="width-6x" :precision="0" v-model="distributionNum"
                           @blur="blurNumber"></el-input-number>
          <el-tooltip placement="top">
            <div slot="content">正整数：将所选分析池增加对应的AI分析次数；<br/>负整数：将所选分析池减少对应的AI分析次数；
            </div>
            <i class="iconfont icon-wenhao" style="margin-left: 10px; color: #000000"></i>
          </el-tooltip>
        </div>
        <div class="remark">
          <div class="left">备注：</div>
          <el-input type="textarea" :rows="4" placeholder="" maxlength="200" show-word-limit class="upload-wrap"
                    v-model="remark"></el-input>
        </div>
        <div class="btn-list">
          <el-button class="confirm" type="primary" @click="quotaAllocation(1,shareRow)">确定</el-button>
          <el-button class="cancel" @click="quotaAllocation(2)">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
        title="消耗配置"
        :close-on-click-modal="false"
        :visible.sync="configShow"
        width="555px"
        @close="consumeConfig(2)">
      <div>
        <em class="prefix">*</em>
        <span style="color: #000000; font-weight: bold"> 消耗配置：</span>
        <template>
          <el-radio style="margin-left: 40px" v-model="configNum" label="0">学校公用</el-radio>
          <el-radio v-model="configNum" label="1">个人账号消耗</el-radio>
        </template>
        <p class="promptTwo">注：配置不同消耗方式，将会影响AI课堂分析，大单元分析 学校份额使用规则；</p>
        <p class="promptColor">学校公用：所有账号公用学校池的AI分析产品次数；</p>
        <p class="promptColor">个人账号消耗：需从学校池再分配至个人账号后才可使用；</p>
        <div class="button-list">
          <el-button style="margin-right: 20px;" @click="consumeConfig(2)">取消</el-button>
          <el-button type="primary" @click="consumeConfig(1,shareRow)">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
        title="修改配置"
        :close-on-click-modal="false"
        :visible.sync="configConfirmShow"
        width="540px"
        @close="cancelConfig()">
      <div v-if="configRow.expendType === 0 && configNum === '1'">
        <p class="revise">确定要修改消耗配置吗？修改后需要给账号分配产品AI分析次数后才可使用</p>
      </div>
      <div v-if="configRow.expendType === 1 && configNum === '0'">
        <p class="revise">确定要修改消耗配置吗？一旦修改，原本账号关联的AI分析次数将会被回收</p>
      </div>
      <div class="button-list">
        <el-button style="margin-right: 20px;" @click="cancelConfig()">取消</el-button>
        <el-button type="primary" @click="configConfirm()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).userId : "",
      tableData: [], // 列表数据
      searchKey: "", // 搜索关键词
      orgStatus: '',// 分析池状态
      orgStatusOptions: [
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      total: '',
      pageNum: 1,
      pages: 0,
      loading: false, // 表格加载
      aiAnalysisNum: 0, // AI课堂分析总次数
      aiAnalysisApplyNum: 0, // AI课堂分析分配次数
      aiAnalysisResidueNum: 0, // AI课堂分析剩余次数
      largeUnitNum: 0, // AI大单元分析总次数
      largeUnitApplyNum: 0, // AI大单元分析分配次数
      largeUnitResidueNum: 0, // AI大单元分析剩余次数

      frequency: {
        classAnalyseUsed: 0,// AI课堂分析次数 - 已使用
        classAnalyseRemainder: 0,// 剩余
        classAnalyseAssigned: 0,// 已分配
        classAnalyseAssignable: 0,// 待分配
        largeUnitUsed: 0,// 大单元分析次数 - 已使用
        largeUnitRemainder: 0,// 剩余
        largeUnitAssigned: 0,// 已分配
        largeUnitAssignable: 0,// 待分配
      },

      infoPageNum: 1,
      infoPage: 0,
      infoTotal: '',
      infoTableData: [], // 明细列表数据
      infoShow: false, // 查看明细弹窗
      shareShow: false, // 额度分配弹窗
      shareRow: {}, // 额度分配选择数据
      shareProducts: 1, // 额度分配弹窗调整产品默认选中数据
      configShow: false, // 消耗配置弹窗
      configRow: {}, //消耗配置选择数据
      configNum: "0", // 消耗配置默认选中
      infoSearchKey: "", // 分配明细搜索关键词
      products: '',
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: 'AI课堂分析（教师版&专业版）'
        },
        {
          value: 2,
          label: '大单元分析'
        }
      ], // 分配明细产品名称
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
      remark: "", // 备注
      configConfirmShow: false, // 消耗配置确认弹窗
    };
  },
  mounted() {
    if (this.userId == 1 || this.userId == 2) {
      this.getList();
      // this.getCount();
      // this.getNuBiAllowance();
      // this.getTotal();
    } else {
      this.$message('暂无访问权限', 'error');
      this.$router.push('/home');
    }
  },
  methods: {
    //获取列表
    getList() {
      this.loading = true;
      let data = new FormData();
      data.append('keyWord', this.searchKey);
      data.append('orgStatus', this.orgStatus);
      data.append('pageNum', this.pageNum);
      data.append('pageSize', 10);
      this.$axios.post('/aiDistribution/list', data).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.tableData = res.data.pageList;
          this.pages = res.data.pages;
          this.total = res.data.total;
        }
      })
      this.getTotal(this.searchKey, this.orgStatus);
    },
    // 获取分析池总计数据 data 查询参数
    getTotal(searchKey, orgStatus) {
      let data = {
        keyWord: searchKey,
        orgStatus: orgStatus
      }
      this.$axios.get("/aiDistribution/getTotal", data).then((res) => {
        if (res.code == 200) {
          this.frequency = res.data;
        }
      });
    },
    // 获取分析次数
    /* getCount(){
       this.$axios.get('/aiDistribution/getCircumstance').then((res) =>{
         if(res.code === 200){
           this.aiAnalysisNum = res.data.aiAnalysisNum;
           this.aiAnalysisApplyNum = res.data.aiAnalysisApplyNum;
           this.aiAnalysisResidueNum = res.data.aiAnalysisResidueNum;
           this.largeUnitNum = res.data.largeUnitNum;
           this.largeUnitApplyNum = res.data.largeUnitApplyNum;
           this.largeUnitResidueNum = res.data.largeUnitResidueNum;
         }
       })
     },*/
    // 获取努比AI剩余次数
    /*getNuBiAllowance() {
      this.$axios.get("/Api/getNuBiAllowance").then((res) => {
        if (res.code == 200) {
          this.aiAnalysisNum = res.data.analysisAllowance;
          this.largeUnitNum = res.data.largeUnitAllowance;
          console.log("this.aiAnalysisNum: ", this.aiAnalysisNum);
          console.log("this.largeUnitNum: ", this.largeUnitNum);
        }
      });
    },*/
    // 列表搜索
    search() {
      this.scrollTo0();
      this.pageNum = 1;
      this.getList();
    },
    // 列表分页点击
    pageChange(val) {
      this.scrollTo0();
      this.pageNum = val;
      this.getList();
    },
    // 明细页分页点击
    infoPageChange(val) {
      this.scrollTo0();
      this.infoPageNum = val;
      this.infoData();
    },
    // 查看分配明细
    infoData() {
      this.infoShow = true;
      let data = new FormData();
      data.append('keyWord', this.infoSearchKey);
      data.append('products', this.products);
      data.append('pageNum', this.infoPageNum);
      data.append('pageSize', 10);
      this.$axios.post('/aiDistribution/listDetai', data).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.infoTableData = res.data.pageList;
          this.infoPage = res.data.pages;
          this.infoTotal = res.data.total;
        }
      })
    },
    // 查看明细搜索
    infoSearch() {
      this.scrollTo0();
      this.infoPageNum = 1;
      this.infoData();
    },
    // 查看明细取消
    infoCancel() {
      this.infoSearchKey = '';
      this.products = '';
      this.infoPageNum = 1;
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
    // 额度分配 0分配弹窗 1确认分配 2取消分配
    quotaAllocation(type, val) {
      if (type == 0) {
        this.shareRow = val;
        this.shareShow = true;
      } else if (type == 1) {
        // 确认分配
        if (this.verify(val)) {
          return;
        }
        let requestData = new FormData();
        requestData.append('id', this.shareRow.id);
        // requestData.append('expendType',this.shareRow.expendType);
        requestData.append('products', this.shareProducts);
        requestData.append('number', this.distributionNum);
        requestData.append('remark', this.remark);
        this.$axios.post("/aiDistribution/update", requestData).then((res) => {
          if (res.code == 200) {
            this.shareShow = false;
            this.getList();
            this.getNuBiAllowance();
            // this.getCount();
          }
        })
      } else {
        this.shareProducts = 1;
        this.distributionNum = 0;
        this.remark = '';
        this.shareShow = false;
      }
    },
    // 消耗配置
    consumeConfig(type, val) {
      if (type == 0) {
        this.configRow = val;
        this.configNum = val.expendType.toString();
        this.configShow = true;
      } else if (type == 1) {
        if ((this.configRow.expendType === 0 && this.configNum === '1') || (this.configRow.expendType === 1 && this.configNum === '0')) {
          this.configConfirmShow = true;
        } else {
          this.configShow = false;
          this.$message('更新成功', 'success');
        }
      } else {
        this.configNum = this.configRow.expendType.toString();
        this.configShow = false;
      }
    },
    // 确认消耗配置——取消事件
    cancelConfig() {
      this.configConfirmShow = false;
    },
    // 确认消耗配置——确定事件
    configConfirm() {
      let data = new FormData();
      data.append('id', this.configRow.id);
      data.append('expendType', Number(this.configNum));
      this.$axios.post("/aiDistribution/update", data).then((res) => {
        if (res.code == 200) {
          this.configConfirmShow = false;
          this.configShow = false;
          this.getList();
        }
      })
    },
    blurNumber(e) {
      if (!e.target.value) {
        e.target.value = 0;
      }
    },
    // 验证
    verify(row) {
      if (this.distributionNum == 0) {
        this.$message('调整数值不能为0！', 'error');
        return true;
      }
      if (this.shareProducts === 1) {
        console.log("课堂分析当前分配次数：" + this.distributionNum + "当前已分配次数：" + row.aiAnalysisTotalNum
        + "计算结果：" + (this.distributionNum  + row.aiAnalysisTotalNum - row.aiAnalysisAllocationNum));
        if (this.distributionNum > 0 && this.distributionNum > this.frequency.classAnalyseAssignable) {
          // 可分配次数
          this.$message('剩余可分配次数不足！', 'error');
          return true;
        } else if (this.distributionNum < 0 && (this.distributionNum  + row.aiAnalysisTotalNum - row.aiAnalysisAllocationNum) < 0) {
          // 可减少次数
          this.$message('剩余可减少次数不足！', 'error');
          return true;
        }
      } else {
        console.log("大单元当前分配次数：" + this.distributionNum + "当前已分配次数：" + row.largeUnitTotalNum
        + "计算结果：" + (this.distributionNum + row.largeUnitTotalNum - row.largeUnitAllocationNum));
        if (this.distributionNum > 0 && this.distributionNum > this.frequency.largeUnitAssignable) {
          this.$message('剩余可分配次数不足！', 'error');
          return true;
        } else if (this.distributionNum < 0 && (this.distributionNum + row.largeUnitTotalNum - row.largeUnitAllocationNum) < 0) {
          this.$message('剩余可减少次数不足！', 'error');
          return true;
        }
      }
      let stringLength = this.remark.replace(/\s+/g, '')
      if (stringLength.length > 200) {
        this.$message('备注内容不得超过200字！', 'error');
        return true;
      }
    }
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-overflow{
  overflow-y: auto;
  overflow-x: auto;
  height: 100%;
  width: 100%;
  min-width: 1260px;
}
.operat-list {
  color: #409eff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-operat-new {
  width: 100%;
}

.button {
  float: right;
  margin-top: 2px;
}

.info-line {
  margin-top: -30px;
  margin-bottom: 20px;
  width: 965px;
}

.line {
  margin-top: -30px;
  margin-bottom: 20px;
  width: 645px;
}

.table-list {
  padding: 0 24px;
  border: 1px solid #ebebeb;
  margin-top: 20px;
  width: 916px;
}

.upload-wrap {
  height: 80px;
  width: 282px;
  //border: solid #DCDFE6 1px;
  //resize: none;
  margin-left: 14px;
  color: #808285;
}

.prompt {
  margin: 10px 0;
  color: gray;
}

.promptTwo {
  margin-top: 40px;
  margin-bottom: 20px;
  color: gray;
}

.prefix {
  color: red;
}

.width-6x {
  width: 180px;
  margin-bottom: 20PX;
  margin-left: 10px;
}

.remark {
  display: flex;
  height: 80px;
}

.left {
  align-content: center;
  height: 80px;
  margin-left: 33px;
  font-weight: bold;
  color: #808285;
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

.promptColor {
  color: gray;
}

.button-list {
  margin-top: 40px;
  text-align: right;
}

.revise {
  color: red;
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
  left: 180px;
}
</style>
