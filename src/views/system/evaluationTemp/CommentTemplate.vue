<template>
  <div class="content-main-wrap">
    <p class="content-title">评课模板管理</p>

    <div class="main-wrap">
      <div class="search-operat">
        <div>
          <el-input class="width-2" clearable v-model="keyword" placeholder="请输入模板名称关键字"
                    v-search="handleSearch"></el-input>
          <el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
        </div>

        <div>
          <el-button class="width-1" icon="el-icon-upload2" @click="add(1)" v-if="permission.save">新增</el-button>
        </div>
      </div>
      <div class="data-table table-border">
        <el-table
            :row-style="{ height: '10px' }"
            :cell-style="{ padding: '4px 0' }"
            v-loading="loading"
            :data="tableData">
          <el-table-column
              align="center"
              label="模板名称">
            <template slot-scope="scope">
              <p>{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="属性">
            <template slot-scope="scope">
              <p>{{ scope.row.attribute == 2 ? '自定义' : '默认' }}</p>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="createDate"
              label="创建时间">
          </el-table-column>
          <el-table-column
              align="center"
              label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="add(0,scope.row)" v-if="permission.update && scope.row.attribute !== 1">
                编辑
              </el-button>
              <el-button type="text" @click="view(scope.row)" v-if="permission.info">预览</el-button>
              <!--              <el-button type="text" @click="downloadExcel(scope.row)" v-if="permission.info">下载模板</el-button>-->
              <el-button type="text" style="color:#f56c6c" @click="deleteData(scope.row.id)"
                         v-if="permission.delete && scope.row.attribute !== 1">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination
            layout="prev, pager, next"
            @current-change="handlePageChange"
            :page-count="pages"
            :current-page="pageNum">
        </el-pagination>
      </div>
      <el-dialog
          title="删除模板"
          :close-on-click-modal="false"
          :visible.sync="deleteShow"
          width="420px">
        <div class="dialog-wrap">
          <p class="err-delete">确认删除该模板？</p>
          <div class="dialog-btn">
            <el-button type="primary" @click="handleDelete()">确 定</el-button>
            <el-button @click="deleteShow = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
          :destroy-on-close='true'
          :close-on-click-modal="false"
          :visible.sync="previewShow"
          width="69%">
        <p style="font-size: 16px;text-align: center;margin-bottom: 20px;">{{ addEditInfo.name }}</p>
        <div class="evaluation-content">
          <el-table v-if="strategy == 1 && type == 0 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all>
            <el-table-column width="320" align="left" prop="levelOne" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 1 && type == 1 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all>
            <el-table-column width="320" align="left" prop="levelOne" label="评价要素"></el-table-column>
            <el-table-column align="center" label="评语">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 1 && type == 2 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all>
            <el-table-column width="320" align="left" prop="levelOne" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分">
            </el-table-column>
            <el-table-column align="center" label="评语">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 2 && type == 0 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="150" prop="levelOne" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelTwo" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 2 && type == 1 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="150" prop="levelOne" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelTwo" label="评价要素"></el-table-column>
            <el-table-column align="center" label="评语">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 2 && type == 2 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="150" prop="levelOne" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelTwo" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分"></el-table-column>
            <el-table-column align="center" label="评语"></el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 3 && type == 0  && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border :header-cell-style="handerMethod" default-expand-all
                    :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="100" prop="levelOne" label="一级名称"></el-table-column>
            <el-table-column width="100" prop="levelTwo" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelThree" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 3 && type == 1 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border :header-cell-style="handerMethod" default-expand-all
                    :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="100" prop="levelOne" label="一级名称"></el-table-column>
            <el-table-column width="100" prop="levelTwo" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelThree" label="评价要素"></el-table-column>
            <el-table-column align="center" label="评语">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
          <el-table v-if="strategy == 3 && type == 2  && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border :header-cell-style="handerMethod" default-expand-all
                    :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="100" prop="levelOne" label="一级名称"></el-table-column>
            <el-table-column width="100" prop="levelTwo" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelThree" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分"></el-table-column>
            <el-table-column align="center" label="评语"></el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>
<!--          <el-table v-if="strategy == 4 && type == 2 && itemLists.length > 0" :data="itemLists" style="width: 100%;"
                    border default-expand-all :span-method="(param)=>objectSpanMethod(param,itemLists)">
            <el-table-column width="200" prop="levelOne" label="一级名称"></el-table-column>
            <el-table-column width="320" align="left" prop="levelTwo" label="评价项目"></el-table-column>
            <el-table-column width="320" align="left" prop="levelThree" label="评价要素"></el-table-column>
            <el-table-column align="center" label="分值">
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.score }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评分">
            </el-table-column>
            <el-table-column align="center" label="评语">
            </el-table-column>
            <el-table-column v-if="addEditInfo.isOpenRemarks == 1" align="center" :label="addEditInfo.remarksName">
            </el-table-column>
          </el-table>-->
          <div class="evaluation-parttwo" v-if="addEditInfo.isOpenSummary == 1">
            <h3 class="part-title">{{ addEditInfo.summaryName }}</h3>
            <textarea
                class="evaluation-text"
                v-model.trim="addEditInfo.summary"
                style="resize: none;width: 100%;height: 60px;"
                type="textarea"
            ></textarea>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {creatTree} from "../../../assets/js/utils";

export default {
  name: '',
  data() {
    return {
      addEditInfo: {},
      type: '',
      strategy: 3,
      itemList: [],
      itemLists: [],
      previewShow: false,
      deleteShow: false,
      deleteId: '',
      editId: 0, // 编辑save id
      addClass: false, // true===新增 !=编辑
      pageNum: 1, //请求当前页数
      pages: 0, // 总页数
      keyword: '', // 关键字
      loading: false, // 表格加载
      errorInfo: '',
      menuName: '',
      tableData: [], // 表格data
      totalS: '',
      permission: '', // 许可操作
    }
  },
  components: {},
  mounted() {
    this.handleGetData();
  },
  watch: {
    $route(to, from) {
      if (from.path == '/sm/commentdetail' || from.path == '/sm/themedetail') {
        this.handleGetData();
      } else if (from.path !== '/sm/template') {
        this.keyword = '';
        if (from.path == '/sm/templateaddedit') {
          if (from.query && from.query.tepmid) {
            this.handleGetData();
          } else {
            this.pageNum = 1;
            this.handleGetData();
          }
        } else {
          this.pageNum = 1;
          this.handleGetData();
        }
      }
    },
  },
  filters: {
    evaluationState(val) {
      let arr = ['s', 'a', 'd']
      return arr[val]
    },
  },
  methods: {
    handerMethod({row, column, rowIndex, columnIndex}) {
      //这里有个非常坑的bug 必须是row[0]=0 row[1]=2才会生效
      row[1].colSpan = 2
      row[2].colSpan = 0
      if (columnIndex === 0) {
        return {display: 'none'}
      }
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}, data) {
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
    deleteData(id) {
      this.deleteId = id
      this.deleteShow = true
    },
    //评课详情
    evaluationDetail(val) {
      this.$router.push({path: '/sm/commentdetail', query: {evaluationid: val.id}});
    },
    //相关主题详情
    aboutDetail(val, type) {
      if (type) {
        this.$router.push({path: '/sm/themedetail', query: {themeid: val.id}});
      } else {
        this.$router.push({path: '/sm/themedetail', query: {themeid: val.id}});
      }
    },
    // 删除
    handleDelete() {
      this.$axios.post('/sm/template/delete', {id: this.deleteId}).then(res => {
        if (res.code === 200) {
          this.totalS = this.totalS - 1;
          if (this.pageNum * 10 - this.totalS === 10) {
            this.pageNum = this.pageNum - 1 || 1
          }
          this.deleteShow = false
          this.$message('删除成功', 'success');
          this.handleGetData();
        }
      })
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
    // 分页点击
    handlePageChange(val) {
      this.scrollTo0();
      this.pageNum = val;
      this.handleGetData();
    },
    // 搜索
    handleSearch() {
      this.scrollTo0();
      this.pageNum = 1;
      this.handleGetData();
    },
    handleGetData() {
      this.loading = true;
      this.$axios.get('/sm/template/list', {
        keyWord: this.keyword,
        pageNum: this.pageNum,
        pageSize: 10,
      }).then(res => {
        this.loading = false;
        this.tableData = res.data.pageList;
        this.pages = res.data.pages;
        this.totalS = res.data.total;
        this.permission = this.creatPermit(res.data.permit);
      })
    },
    // 新增or编辑
    add(type, val) {
      if (type == 0) {
        this.$router.push({path: '/sm/templateaddedit', query: {tepmid: val ? val.id : ''}});
      } else {
        this.$router.push('/sm/templateaddedit');
      }
    },
    view(val) {
      this.addEditInfo = {}
      this.$axios.get('/sm/template/info', {id: val.id}).then(res => {
        this.addEditInfo = res.data;
        const arr = res.data.itemList;
        arr.forEach(el => {
          if (el.children && el.children.length > 0) {
            el.show = 1;
            el.children.forEach(ele => {
              if (ele.children && el.children.length > 0) {
                ele.show = 1;
              } else {
                ele.show = 0;
              }
            })
          } else {
            el.show = 0;
          }
        });
        this.itemList = arr;
        this.openPreview();
      })
    },
    downloadExcel(val) {

    },
    openPreview() {
      this.type = this.itemList[0] && this.itemList[0].type ? this.itemList[0].type : '';
      let arr = [];
      let strategyTemp = 0;
      for (let i in this.itemList) {
        if (this.itemList[i].type == 0) {
          const levelOne = this.itemList[i].item;
          if (this.itemList[i].children.length > 0) {
            for (let j in this.itemList[i].children) {
              const levelTwo = this.itemList[i].children[j].item;
              if (this.itemList[i].children[j].children.length > 0) {
                for (let k in this.itemList[i].children[j].children) {
                  const levelThree = this.itemList[i].children[j].children[k].item;
                  const obj = {
                    levelOne: levelOne,
                    levelTwo: levelTwo,
                    levelThree: levelThree,
                    score: this.itemList[i].children[j].children[k].score,
                    remarks: ''
                  }
                  arr.push(obj)
                }
              } else {
                const obj = {
                  levelOne: levelOne,
                  levelTwo: levelTwo,
                  levelThree: '',
                  score: this.itemList[i].children[j].score,
                  remarks: ''
                }
                arr.push(obj)
              }
            }
          } else {
            const obj = {
              levelOne: levelOne,
              levelTwo: '',
              levelThree: '',
              score: this.itemList[i].score,
              remarks: ''
            }
            arr.push(obj)
          }
        } else if (this.itemList[i].type == 1) {
          const levelOne = this.itemList[i].item;
          if (this.itemList[i].children.length > 0) {
            for (let j in this.itemList[i].children) {
              const levelTwo = this.itemList[i].children[j].item;
              if (this.itemList[i].children[j].children.length > 0) {
                for (let k in this.itemList[i].children[j].children) {
                  const levelThree = this.itemList[i].children[j].children[k].item;
                  const obj = {
                    levelOne: levelOne,
                    levelTwo: levelTwo,
                    levelThree: levelThree,
                    content: '',
                    remarks: ''
                  }
                  arr.push(obj)
                }
              } else {
                const obj = {
                  levelOne: levelOne,
                  levelTwo: levelTwo,
                  levelThree: '',
                  content: '',
                  remarks: ''
                }
                arr.push(obj)
              }
            }
          } else {
            const obj = {
              levelOne: levelOne,
              levelTwo: '',
              levelThree: '',
              content: '',
              remarks: ''
            }
            arr.push(obj)
          }
        } else if (this.itemList[i].type == 2) {
          const levelOne = this.itemList[i].item;
          if (this.itemList[i].children.length > 0) {
            for (let j in this.itemList[i].children) {
              const levelTwo = this.itemList[i].children[j].item;
              if (this.itemList[i].children[j].children.length > 0) {
                for (let k in this.itemList[i].children[j].children) {
                  const levelThree = this.itemList[i].children[j].children[k].item;
                  const obj = {
                    levelOne: levelOne,
                    levelTwo: levelTwo,
                    levelThree: levelThree,
                    score: this.itemList[i].children[j].children[k].score,
                    remarks: ''
                  }
                  arr.push(obj)
                }
              } else {
                const obj = {
                  levelOne: levelOne,
                  levelTwo: levelTwo,
                  levelThree: '',
                  score: this.itemList[i].children[j].score,
                  remarks: ''
                }
                arr.push(obj)
              }
            }
          } else {
            const obj = {
              levelOne: levelOne,
              levelTwo: '',
              levelThree: '',
              score: this.itemList[i].score,
              remarks: ''
            }
            arr.push(obj)
          }
        }
      }
      let x = 3;
      let a = arr.every(item => !item.levelThree)
      if (a == true) {
        x = 2;
        let aa = arr.every(item => !item.levelTwo)
        if (aa == true) {
          x = 1;
        }
      }
      this.strategy = x;
      this.itemLists = arr;
      this.previewShow = true;
      console.log("this.strategy: ", this.strategy);
      console.log("this.type: ", this.type);
    },
  },
}
</script>

<style lang="scss" type="text/scss" scoped>
.detail {
  color: #409EFF;
  cursor: pointer;
}
</style>
