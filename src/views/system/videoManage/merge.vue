<template>
  <div class="content-main-wrap">
    <p class="content-title">视频合并</p>
    <div class="main-wrap">
      <div class="dialog-item">
        <p>合并视频</p>
        <p><em style="width: 19px;">*</em>：</p>
        <div class="elTag">
          <el-tag
            :key="tag.id"
            v-for="tag in totalData"
            closable
            :disable-transitions="false"
            @close="handleCloseTag(tag.name)"
          >
            {{ tag.name }}
          </el-tag>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            >添加视频</el-button
          >
        </div>
      </div>
      <div class="dialog-item">
        <p>视频名称</p>
        <p><em>*</em>：</p>
        <el-input v-model.trim="videoName" clearable class="width-5"></el-input>
      </div>
      <div class="item-wrap">
        <p>视频分类</p>
        <p style="width: 19px;"><em>*</em>：</p>
        <!-- <div style="display: flex">
          <p style="line-height: 32px">视频分类</p>
          <p style="padding-top: 6px"><em>*</em>：</p>
        </div> -->
        <div>
          <div class="itemList width-9" style="padding-left: 0">
            <el-select
              @change="handleTheme"
              v-model="themeValue"
              placeholder="请选择"
            >
              <el-option
                v-for="item in themeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>

          <div
            class="itemType width-9"
            v-for="(nape, index) in themeTypeList"
            :key="index"
          >
            <el-tooltip
              :disabled="nape.name.length > 12 ? false : true"
              class="item"
              effect="dark"
              :content="`请选择${nape.name}`"
              placement="top-start"
            >
              <el-select
                clearable
                v-model="nape.value"
                :placeholder="`请选择${nape.name}`"
                v-if="nape.children"
              >
                <el-option
                  v-for="item in nape.children"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-tooltip>
          </div>
        </div>
      </div>

      <!-- <div class="dialog-item" v-for="(nape,index) in themeTypeList" :key="index">
                <p :class="nape.name.length > 5 ? 'nameAct' : ''">{{ nape.name }}</p>
                <div class="px"><em>*</em>：</div>
                 <el-tooltip class="item" effect="dark" :content="`请选择${nape.name}`" placement="top-start">
                     <el-select class="width-5" clearable v-model="nape.value" :placeholder="`请选择${nape.name}`" v-if="nape.children">
                        <el-option
                        v-for="item in nape.children"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-tooltip>
            </div> -->

      <div class="dialog-item">
        <p>视频简介</p>
        <p style="width: 19px;"><em style="opacity: 0;">*</em>：</p>
        <el-input
          v-model="description"
          class="width-5"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 6 }"
          placeholder="请输入内容"
        >
        </el-input>
      </div>
      <div class="submit">
        <el-button type="primary" @click="handlePut">提交任务</el-button>
      </div>
    </div>

    <el-dialog
      title="选择视频"
      :close-on-click-modal="false"
      :visible.sync="chooseCpm"
      width="40%"
      :before-close="handleClose"
    >
      <div>
        <el-tabs v-model="activeName" @tab-click="handleTab">
          <el-tab-pane label="视频管理" name="first">
            <div>
              <el-input
                class="width-2"
                v-model="videoSeek"
                clearable
                placeholder="请输入视频名称关键字"
                v-search="handleSearchW"
              ></el-input>
              <el-button
                type="primary"
                class="search-btn"
                @click="handleSearchW"
                >查询</el-button
              >
            </div>
            <div>
              <el-table
                v-loading="loadingW"
                :data="videoList"
                style="width: 100%"
              >
                <el-table-column align="center" label="视频名称" width="180">
                  <template slot-scope="scope">
                    <el-tooltip
                      :disabled="scope.row.name.length > 10 ? false : true"
                      class="item"
                      effect="dark"
                      :content="scope.row.name"
                      placement="top-start"
                    >
                      <div class="nameHide">{{ scope.row.name }}</div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="time"
                  label="时长"
                  width="180"
                >
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <div>
                      <el-link
                        :disabled="
                          totalData.find(
                            (v) =>
                              v.id === scope.row.id && v.name === scope.row.name
                          )
                            ? true
                            : false
                        "
                        :underline="false"
                        type="primary"
                        @click="handleAddDataList(scope.row)"
                        >添加</el-link
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-page">
              <el-pagination
                :page-size="8"
                layout="prev, pager, next"
                @current-change="pageChange"
                :current-page="pageNum"
                :page-count="pages"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="剪辑视频" name="second">
            <div>
              <el-input
                class="width-2"
                v-model="videoSeekT"
                clearable
                placeholder="请输入视频名称关键字"
                v-search="handleSearchT"
              ></el-input>
              <el-button
                type="primary"
                class="search-btn"
                @click="handleSearchT"
                >查询</el-button
              >
            </div>
            <div>
              <el-table
                v-loading="loading"
                :data="clipsList"
                style="width: 100%"
              >
                <el-table-column
                  align="center"
                  prop="name"
                  label="视频名称"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="time"
                  label="时长"
                  width="180"
                >
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <div>
                      <!-- {{ scope.row | filtersDisabled }} -->
                      <el-link
                        :disabled="
                          totalData.find(
                            (v) =>
                              v.id === scope.row.id && v.name === scope.row.name
                          )
                            ? true
                            : false
                        "
                        :underline="false"
                        type="primary"
                        @click="handleAddDataList(scope.row)"
                        >添加</el-link
                      >
                      <!-- <el-link :disabled="scope.row | filtersDisabled" :underline="false" type="primary" @click="handleAddDataList(scope.row)">添加</el-link> -->
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-page">
              <el-pagination
                :page-size="8"
                layout="prev, pager, next"
                @current-change="pageChangeT"
                :current-page="pageNumT"
                :page-count="pagesT"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <el-dialog
      title="视频合并"
      :close-on-press-escape="false"
      top="40vh"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>视频合并任务提交成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAgain">再次编辑</el-button>
        <el-button type="primary" @click="handleExamine">查看进度</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { creatTree } from "../../../assets/js/utils";

export default {
  name: "",
  data() {
    return {
      loadingW: false,
      description: "",
      videoSeek: "",
      pages: 1,
      pagesT: 1,
      pageNum: 1,
      pageNumT: 1,
      chooseCpm: false,
      activeName: "first",
      videoList: [],
      clipsList: [],
      videoSeekT: "",
      totalData: [], //点击添加合并总视频数量
      themeValue: "",
      themeData: [
      {
          id: 8,
					name: "教师研修"
				},
        {
          id: 4,
          name: "优质资源"
        },
        {
          id: 6,
          name: "课外知识"
        },
      ],
      themeTypeList: [],
      videoName: "",
      centerDialogVisible: false,
      loading: false, // 表格加载
    };
  },
  mounted() {
    if(localStorage.getItem('uiType') == 2) {
      this.handleGetType();
    }
  },
  methods: {
    handleExamine() {
      this.$axios.get('auth/menu').then(res => {
        let istrue = res.data.filter(el => el.id == 4082)
        console.log(istrue,'fff')
        if(istrue.length > 0){
          this.$router.push('/sm/clip');
        }else{
          this.$message("您没有当前操作的权限，请联系管理员", "error"); 
        }
      })
    },
    // 再次编辑
    handleAgain() {
      this.totalData = [];
      this.themeTypeList = [];
      this.videoName = "";
      this.themeValue = "";
      this.description = "";
      this.centerDialogVisible = false;
    },
    // 提交任务
    handlePut() {
      if (this.totalData.length <= 0) {
        this.$message("请添加视频", "error");
        return;
      }
      if (this.totalData.length < 2) {
        this.$message("至少添加2个视频", "error");
        return;
      }
      if (!this.videoName) {
        this.$message("请输入视频名称", "error");
        return true;
      }
      if (this.videoName.length > 20) {
        this.$message("视频名称不能超过20字", "error");
        return true;
      }
      // if(this.$verify.chLetterNum(this.videoName, 20)){
      //     this.$message('名称为中文大小写字母和数字组成，最长20位！', 'error');
      //     return;
      // }
      if (this.$verify.isEmpty(this.themeValue)) {
        this.$message("请选择分类", "error");
        return true;
      }
      let ifResult = false;
      if (this.themeTypeList.length !== 0) {
        let ifType = this.themeTypeList.some((v, i) => {
          if (v.value === null || v.value === "") {
            this.$message(`${v.name}未选`, "error");
            ifResult = false;
            return true;
          }
          ifResult = true;
        });
      } else {
        ifResult = true;
      }
      if (!ifResult) {
        return true;
      }
      if (this.description.length > 50) {
        this.$message("视频简介不能超过50字", "error");
        return true;
      }
      let typeIdList = [];
      this.themeTypeList.forEach((v) => {
        if (v.value !== null || v.value !== "") {
          typeIdList.push(v.value);
        }
      });
      let id = JSON.parse(localStorage.getItem('userInfo')).userId
      const params = {
        labelIdList: typeIdList,
        name: this.videoName,
        urlList: this.totalData.map((v) => v.url),
        description: this.description,
        categoryId: this.themeValue,
        userId: id,
      };
      this.$axios.post("/sm/clip/addMerge", params).then((res) => {
        if (res.code === 200) {
          this.totalData = [];
          this.themeTypeList = [];
          this.videoName = "";
          this.themeValue = "";
          this.description = "";
          this.centerDialogVisible = true;
        }
      });
    },
    // 添加视频
    handleAdd() {
      this.handleVideo();
      this.chooseCpm = true;
    },
    handleTab() {
      // this.videoSeek = '';
      // this.videoSeekT = '';
      if (this.activeName === "first") {
        this.pageNum = 1;
        this.handleVideo();
      } else {
        this.pageNumT = 1;
        this.handleClips();
      }
    },
    // 获取类型
    handleGetType() {
      this.$axios.get("/sm/category/listAll").then((res) => {
        if (res.code === 200) {
          let arr = res.data.filter(el => el.id !== 1);
					this.themeData = arr;
        }
      });
    },
    // 视频分类change
    handleTheme() {
      this.getTypeList();
    },
    //获取类型2
    getTypeList() {
      this.$axios
        .get("/sm/label/listByCategory", {
          categoryId: this.themeValue,
          type: 3,
          // id: this.$route.query.themeid
          // id: this.currentData.id
        })
        .then((res) => {
          let treeList = creatTree(res.data);
          let data = [];
          treeList.forEach((val) => {
            if (val.children) {
              data.push(val);
            }
            // val.value = this.valData.find((v) => v.id === 12) ? this.valData.find((v) => v.id === 12).id : 0;
          });
          this.themeTypeList = data;
        });
    },
    handleClose() {
      this.chooseCpm = false;
      this.videoSeek = "";
      this.videoSeekT = "";
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
      this.pageNum = val;
      // this.pages = 1;
      this.handleVideo();
    },
    pageChangeT(val) {
      this.pageNumT = val;
      // console.log(val);
      this.handleClips();
    },
    // 视频管理查询
    handleSearchW() {
      this.pageNum = 1;
      this.handleVideo();
    },
    handleSearchT() {
      this.scrollTo0();
      this.pageNumT = 1;
      this.handleClips();
    },
    // 视频管理列表数据
    handleVideo() {
      this.loadingW = true;
      this.$axios
        .get("/sm/clip/listFile", {
          keyWord: this.videoSeek,
          pageNum: this.pageNum,
          pageSize: 8,
        })
        .then((res) => {
          this.loadingW = false;
          this.videoList = res.data.pageList;
          this.pages = res.data.pages;
        });
    },
    // 视频剪辑列表数据
    handleClips() {
      this.loading = true; // 表格加载
      this.$axios
        .get("/sm/clip/listClip", {
          keyWord: this.videoSeekT,
          pageNum: this.pageNumT,
          pageSize: 8,
        })
        .then((res) => {
          this.loading = false; // 表格加载
          this.clipsList = res.data.pageList;
          this.pagesT = res.data.pages;
        });
    },
    handleAddDataList(row) {
      if (this.totalData.length > 4) {
        this.$message("一次最多合并5个视频", "warning");
        return;
      }
      this.totalData.push(row);
    },
    handleCloseTag(tag) {
      const act = this.totalData.findIndex((v) => v.name === tag);
      console.log(act);
      this.totalData.splice(act, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.itemList {
  float: left;
  padding-left: 10px;
  padding-bottom: 10px;
}
.itemType {
  float: left;
  padding-left: 10px;
  padding-bottom: 10px;

  .p {
    line-height: 40px;
    text-align: justify;
    color: #303133;
    font-size: 14px;
    float: left;
  }

  .el-select {
    float: left !important;
  }
}
.nameAct {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.elTag {
  // padding-right: 20px;
  .el-tag {
    margin-right: 20px !important;
  }
}

.dialog-item-theme,
.dialog-item {
  // dialog-item
  font-size: 14px;
  p:first-child {
    float: left;
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
  }

  .p {
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
  }
}

.item-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  em {
    color: #f64646;
  }
  p:first-child {
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
    color: #303133;
    font-size: 14px;
  }
  p:first-child:after {
    content: "";
    display: inline-block;
    width: 100%;
  }
}

.dialog-item {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
}

.submit {
  padding-left: 160px;
  padding-top: 50px;
}

.nameHide {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

<style>
.el-dialog__body {
  padding-top: 0 !important;
}
</style>