<template>
  <div class="content-main-wrap">
    <p class="content-title">敏感操作日志</p>
    <div class="main-wrap">
      <div class="search-operat">
        <div>
          <span class="search-desc">操作人：</span>
          <el-select
            v-model="user"
            placeholder="全部"
            class="width-4"
            clearable
            filterable
          >
            <el-option
              v-for="item in userList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <span class="search-desc">操作时间：</span>
          <el-date-picker
            v-model="valueTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <span class="search-desc">操作模块：</span>
          <el-select
            v-model="moduleId"
            placeholder="全部"
            style='width: 150px;'
            clearable
          >
            <el-option
              v-for="item in moduleList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button type="primary" class="search-btn" @click="search"
            >查询</el-button
          >
        </div>
      </div>
      <div class="data-table table-border">
        <el-table v-loading="loading" :data="tableData" style="width: 100%;min-width: 900px;">
          <el-table-column prop="operator" align="center" label="操作人">
          </el-table-column>
          <el-table-column prop="ipAddress" align="center" label="IP地址">
          </el-table-column>
          <el-table-column prop="operatingTime" align="center" label="操作时间">
          </el-table-column>
          <el-table-column prop="operationModule" align="center" label="操作模块">
          </el-table-column>
          <el-table-column prop="operationEvent" align="center" label="操作事件">
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination
          layout="prev, pager, next"
          @current-change="pageChange"
          :page-count="pages"
          :current-page="pageNum"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      userList: [],
      moduleList: [],
			valueTime: [],
      totalS: "",
      user: '',
      moduleId: "",
      tableData: [],
      pageNum: 1,
      pages: 0,
      loading: false, // 表格加载
    };
  },
  mounted() {
    this.getList();
    this.getUserList()
  },
  methods: {
    getUserList(){
      this.$axios.get("/sys/sensitive/getOperator").then((res) => {
        this.userList = res.data
      })
      this.$axios.get("/sys/sensitive/getModule").then((res) => {
        this.moduleList = res.data
      })
    },
    //获取文章列表
    getList() {
      this.loading = true; // 表格加载
      let data = {
        pageNum: this.pageNum,
        pageSize: 10,
        keyWord: this.user,
        startDate: this.valueTime ? this.valueTime[0] : '',
        endDate: this.valueTime ? this.valueTime[1] : '',
        operationModule: this.moduleId
      };
      this.$axios.get("/sys/sensitive/operation/log/list", data).then((res) => {
        this.loading = false; // 表格加载
        this.tableData = res.data.pageList;
        this.pages = res.data.pages;
        this.totalS = res.data.total;
      });
    },
    //搜索
    search() {
      this.pageNum = 1;
      this.getList();
      this.getUserList()
    },
    //分页点击
    pageChange(val) {
      this.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.width-4{
  width: 110px;
}
.el-upload-dragger {
  width: 270px;
  height: 130px;
  padding-bottom: 28px;
}
.el-upload-dragger .el-icon-upload {
  margin-top: 20px;
}
.upload-demoad .el-upload-list {
  margin: -162px 0 0 25px;
  width: 222px;
}
.upload-demoad .el-upload-list__item-status-label {
  display: block;
}
.upload-wrap {
  border: 1px dashed #d9d9d9;
  height: 130px;
}
.adv-img {
  width: 143px;
  height: 35px;
}
.dialog-item {
  p:first-child {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
  }
}

.tip_color {
  font-size: 12px;
  display: inline-block;
  color: #e6a23c;
}
.search-operat{
  min-width: 1100px;
}
</style>
