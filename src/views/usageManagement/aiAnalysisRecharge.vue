<template>
    <div class="content-main-wrap" style="min-width: 1260px; overflow-x: auto; overflow-y: auto">
        <p class="content-title">充值管理</p>
        <div class="content-overflow">
            <div class="main-wrap" style="min-width: 1260px; overflow-x: auto">
                <div class="search-operat-new">
                    <div>
                        <el-input
                            v-model="searchKey"
                            class="width-2"
                            placeholder="请输入项目名称/合同编号"
                            clearable
                            v-search="handleSearch"
                        ></el-input>
                        <el-button type="primary" class="search-btn" @click="pageChange(1)">查询</el-button>
                        <el-button
                            class="search-btn"
                            style="position: relative; right: 0; float: right"
                            @click="addProject(false)"
                            >新增
                        </el-button>
                    </div>
                </div>
                <div class="info-content">
                    <div class="info-content1">
                        <div class="info-item">
                            <span class="info-text">AI平台[AI课堂分析/赛课辅导]- </span>
                            <span class="info-text orange-text"
                                >剩余：{{ $comjs.formatValue(recharge.aiClassResidue) }}次</span
                            >
                        </div>
                        <div class="info-item">
                            <span class="info-text">AI平台[大单元及学情分析]- </span>
                            <span class="info-text orange-text"
                                >剩余：{{ $comjs.formatValue(recharge.unitResidue) }}次</span
                            >
                        </div>
                    </div>
                    <div class="info-content2">
                        <div class="info-item">
                            <span class="info-text">AI课堂分析： </span>
                            <span class="info-text green-text"
                                >已充值{{ $comjs.formatValue(recharge.aiClassTotal) }}次</span
                            >
                        </div>
                        <div class="info-item">
                            <span class="info-text">赛课辅导： </span>
                            <span class="info-text green-text"
                                >已充值{{ $comjs.formatValue(recharge.matchTotal) }}次</span
                            >
                        </div>
                        <div class="info-item">
                            <span class="info-text">大单元及学情分析： </span>
                            <span class="info-text green-text"
                                >已充值{{ $comjs.formatValue(recharge.unitTotal) }}次</span
                            >
                        </div>
                        <div class="info-item">
                            <span class="info-text">AI课前指导： </span>
                            <span class="info-text green-text"
                                >已充值{{ $comjs.formatValue(recharge.prepareTotal) }}次</span
                            >
                        </div>
                    </div>
                </div>

                <div class="data-table table-border" style="min-width: 1260px; overflow-y: auto; overflow-x: auto">
                    <el-table
                        v-loading="loading"
                        :row-style="{height: '10px'}"
                        :cell-style="{padding: '12px 0'}"
                        :data="tableData"
                        style="width: 100%"
                    >
                        <el-table-column prop="projectName" align="center" label="项目名称"></el-table-column>
                        <el-table-column prop="contractNo" align="center" label="合同编号"></el-table-column>
                        <el-table-column prop="orgTypeName" align="center" label="所属机构/教师"></el-table-column>
                        <el-table-column prop="relationProduct" align="center" label="关联产品"></el-table-column>
                        <el-table-column prop="createDate" align="center" label="创建时间"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <ul class="operat-list">
                                    <el-button type="text" @click="openRechargeDlg(scope.row)">充值 </el-button>
                                    <el-button type="text" @click="viewRechargeDetail(scope.row)">充值记录 </el-button>
                                    <el-button type="text" @click="addProject(true, scope.row)">编辑 </el-button>
                                    <el-button
                                        type="text"
                                        @click="deleteProject(scope.row)"
                                        style="color: #f56c6c"
                                        v-if="scope.row.usedCount == 0"
                                        >删除
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
                        :current-page="pageNum"
                    >
                    </el-pagination>
                </div>
                <el-dialog
                    :title="isEditProject ? '编辑' : '新增'"
                    :close-on-click-modal="false"
                    :visible.sync="isShowProjectDlg"
                    width="600px"
                >
                    <div class="dialog-wrap">
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>项目名称</p>
                            <el-input
                                class="width-5"
                                v-model="addEditInfo.projectName"
                                placeholder="请输入项目名称"
                            ></el-input>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>合同编号</p>
                            <el-input
                                class="width-5"
                                v-model="addEditInfo.contractNo"
                                placeholder="请输入合同编号"
                            ></el-input>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>所属机构/教师</p>
                            <el-select
                                v-model="addEditInfo.orgType"
                                placeholder="请选择"
                                style="width: 90px"
                                @change="changeOrgType"
                                :disabled="isEditProject"
                            >
                                <el-option
                                    v-for="item in orgTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <el-select
                                v-model="addEditInfo.orgId"
                                placeholder="请选择"
                                style="width: 242px"
                                :disabled="isEditProject"
                                filterable
                                remote
                                :remote-method="getTeacherList"
                                clearable
                                :filter-method="getTeacherList"
                                @clear="getTeacherList"
                            >
                                <el-option
                                    v-for="item in orgIdList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="dialog-btn">
                            <el-button type="primary" @click="confirmProject">确 定</el-button>
                            <el-button @click="isShowProjectDlg = false">取 消</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                    title="次数充值"
                    :close-on-click-modal="false"
                    :visible.sync="isShowRechargeDlg"
                    width="600px"
                >
                    <div class="dialog-wrap">
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>项目名称</p>
                            <p>{{ rechargeInfo.projectName }}</p>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>合同编号</p>
                            <p>{{ rechargeInfo.contractNo }}</p>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>所属机构/教师</p>
                            <p>{{ rechargeInfo.orgTypeName }}</p>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>类型</p>
                            <el-select v-model="rechargeInfo.rechargeType" placeholder="请选择" class="width-5">
                                <el-option
                                    v-for="item in rechargeTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>失效日期</p>
                            <el-date-picker
                                v-model="rechargeInfo.invalidTime"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                class="width-5"
                                :picker-options="pickerOptions"
                            >
                            </el-date-picker>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>关联产品</p>
                            <el-select v-model="productArray[0]" placeholder="请选择" class="width-6">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-input
                                class="width-8"
                                v-model.number="numberArray[0]"
                                placeholder="请输入充值次数"
                            ></el-input>
                            <p class="dialog-unit">次</p>
                            <i
                                class="el-icon-circle-plus-outline el-icon"
                                @click="addProduct"
                                v-show="productNum < productList.length - 1"
                            ></i>
                        </div>
                        <div class="dialog-item" v-for="ite in productNum" :key="ite">
                            <p class="dialog-title"></p>
                            <el-select v-model="productArray[ite]" placeholder="请选择" class="width-6">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-input
                                class="width-8"
                                v-model.number="numberArray[ite]"
                                placeholder="请输入充值次数"
                            ></el-input>
                            <p class="dialog-unit">次</p>
                            <i class="el-icon-remove-outline el-icon" @click="decreaseProduct(ite)"></i>
                        </div>
                        <div class="dialog-item">
                            <div class="dialog-tips">（注：请根据购买情况合理充值！）</div>
                        </div>
                        <div class="dialog-btn">
                            <el-button type="primary" @click="confirmRecharge">确 定</el-button>
                            <el-button @click="isShowRechargeDlg = false">取 消</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                    :title="curRow.orgTypeName + ' - 充值记录'"
                    :close-on-click-modal="false"
                    :visible.sync="isShowRechargeDetailDlg"
                    width="1200px"
                >
                    <div class="dialog-wrap">
                        <div
                            class="data-table table-border"
                            style="min-width: 1060px; overflow-y: auto; overflow-x: auto"
                        >
                            <el-table
                                :row-style="{height: '10px'}"
                                :cell-style="{padding: '6px 0'}"
                                :data="dlgTableData"
                                style="width: 100%"
                            >
                                <el-table-column
                                    prop="relationProduct"
                                    align="center"
                                    label="关联产品"
                                ></el-table-column>
                                <el-table-column prop="rechargeNum" align="center" label="充值次数"></el-table-column>
                                <el-table-column
                                    prop="remainNum"
                                    align="center"
                                    label="剩余未消耗次数"
                                ></el-table-column>
                                <el-table-column prop="rechargeTypeName" align="center" label="类型"></el-table-column>
                                <el-table-column prop="rechargeTime" align="center" label="充值时间"></el-table-column>
                                <el-table-column prop="invalidTime" align="center" label="失效日期"></el-table-column>
                                <el-table-column align="center" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <ul class="operat-list">
                                            <el-button
                                                type="text"
                                                @click="cancelRecharge(scope.row)"
                                                v-show="scope.row.rechargeNum == scope.row.remainNum"
                                                >撤销充值
                                            </el-button>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table-page">
                            <el-pagination
                                layout="prev, pager, next"
                                @current-change="dlgPageChange"
                                :page-count="dlgPages"
                                :current-page="dlgPageNum"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchKey: '',
            recharge: {},
            pageNum: 1,
            pages: 0,
            loading: false,
            tableData: [],
            isEditProject: false,
            addEditInfo: {},
            orgTypeList: [
                {value: '2', label: '市'},
                {value: '3', label: '区县'},
                {value: '4', label: '学校'},
                {value: '5', label: '教师'},
            ],
            orgIdList: [],
            isShowProjectDlg: false,
            isShowRechargeDlg: false,
            rechargeTypeList: [
                {value: 0, label: '购买'},
                {value: 1, label: '赠送'},
            ],
            rechargeInfo: {},
            orgIdAllList: [],
            productArray: [],
            numberArray: [],
            productNum: 0,
            productList: [],
            isShowRechargeDetailDlg: false,
            curRow: {},
            dlgPageNum: 1,
            dlgTableData: [],
            dlgPages: 0,
            pickerOptions: {
                disabledDate(time) {
                    // 今天及之前的日期不可选
                    return time.getTime() <= new Date(new Date().setHours(0, 0, 0, 0));
                },
            },
            dlgTotal: 0,
            total: 0,
        };
    },
    mounted() {
        this.prepareTotal();
        this.getList();
    },
    methods: {
        prepareTotal() {
            let params = {};
            params['keyWord'] = this.searchKey;
            this.$axios.post('/aiAnalysisStock/getTopProductStat', params).then((res) => {
                if (res.code === 200) {
                    this.recharge = res.data;
                }
            });
        },
        getList() {
            let params = {};
            params['keyWord'] = this.searchKey;
            params['pageNum'] = this.pageNum;
            params['pageSize'] = 10;
            this.loading = true;
            this.$axios.post('/aiAnalysisProject/list', params).then((res) => {
                if (res.code === 200) {
                    this.loading = false;
                    this.tableData = res.data.pageList;
                    this.pages = res.data.pages;
                    this.total = res.data.total;
                }
            });
        },
        editAiPreClassGuideTimes() {},
        // 列表分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.getList();
            if (val == 1) {
                this.prepareTotal();
            }
        },
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('main-wrap')[0].scrollTo(0, 0);
        },
        addProject(isEdit, row) {
            this.addEditInfo = {};
            this.orgIdList = [];
            this.isShowProjectDlg = true;
            this.isEditProject = isEdit;
            if (isEdit) {
                this.addEditInfo = JSON.parse(JSON.stringify(row));
                if (row.orgType == '5') {
                    this.getTeacherList(row.orgTypeName);
                } else {
                    this.changeOrgType(row.orgType);
                }
            }
        },
        confirmProject() {
            if (!this.addEditInfo.projectName) {
                this.$message('项目名称不能为空！', 'error');
                return;
            }
            if (this.addEditInfo.projectName.length > 20) {
                this.$message('项目名称由中文、英文大小写字母、数字及符号组成，最长20位！', 'error');
                return;
            }
            if (!this.addEditInfo.contractNo) {
                this.$message('合同编号不能为空！', 'error');
                return;
            }
            if (this.$verify.letterNum(this.addEditInfo.contractNo, 20)) {
                this.errorInfo = '合同编号由英文大小写字母、数字组成，最长20位！';
                return true;
            }
            if (!this.addEditInfo.orgId || !this.addEditInfo.orgType) {
                this.$message('请选择所属机构/教师！', 'error');
                return;
            }
            let url = this.isEditProject ? '/aiAnalysisProject/update' : '/aiAnalysisProject/save';
            this.$axios.post(url, this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.isShowProjectDlg = false;
                    this.getList();
                    this.prepareTotal();
                    this.$message((this.isEditProject ? '编辑' : '新增') + '成功！', 'success');
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
        changeOrgType(val) {
            if (val == '5') {
                this.orgIdList = [];
            } else {
                this.$axios.get('/sys/org/getOrgOrUserList', {level: val}).then((res) => {
                    if (res.code == 200) {
                        this.orgIdAllList = JSON.parse(JSON.stringify(res.data));
                        this.orgIdList = res.data;
                    } else {
                        this.$message(res.message, 'error');
                    }
                });
            }
        },
        getTeacherList(name) {
            if (this.addEditInfo.orgType == 5) {
                // 如果没有关键字或者清空文本框，就不请求数据且清掉下拉缓存数据。数据过多，请求全部的话，会因为渲染导致页面卡顿
                if (!name) {
                    this.orgIdList = [];
                    return;
                }
                this.$axios.post('/sm/interactive/getUserList', {nickName: name}).then((res) => {
                    this.orgIdList = res.data.map((user) => ({
                        value: user.userId,
                        label: user.name + (user.schoolName ? '-' + user.schoolName : '') + '-' + user.code,
                    }));
                });
            } else {
                this.orgIdList = this.orgIdAllList.filter((item) => {
                    return item.label.includes(name);
                });
            }
        },
        deleteProject(row) {
            this.$confirm('确认删除该项目吗?', '删除项目', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$axios.get('/aiAnalysisProject/delete', {id: row.id}).then((res) => {
                        if (res.code == 200) {
                            this.total = this.total - 1;
                            if (this.pageNum * 10 - this.total === 10) {
                                this.pageNum = this.pageNum - 1 || 1;
                            }
                            this.getList();
                            this.prepareTotal();
                            this.$message('删除成功！', 'success');
                        } else {
                            this.$message(res.message, 'error');
                        }
                    });
                })
                .catch(() => {});
        },
        // 打开充值弹窗
        openRechargeDlg(row) {
            this.isShowRechargeDlg = true;
            this.rechargeInfo = {};
            this.rechargeInfo = JSON.parse(JSON.stringify(row));
            this.curRow = JSON.parse(JSON.stringify(row));
            this.$set(this.rechargeInfo, 'rechargeType', 0);
            this.productArray = [];
            this.numberArray = [];
            this.productNum = 0;
            this.getProductList();
        },
        // 获取产品下拉
        getProductList() {
            this.$axios.get('/aiAnalysisStock/listAll').then((res) => {
                if (res.code == 200) {
                    this.productList = res.data;
                }
            });
        },
        addProduct() {
            this.productNum++;
        },
        decreaseProduct(index) {
            this.productNum--;
            this.productArray.splice(index, 1);
            this.numberArray.splice(index, 1);
        },
        // 确认充值
        confirmRecharge() {
            if (!this.rechargeInfo.invalidTime) {
                this.$message('失效日期不能为空！', 'error');
                return;
            }
            if (this.productArray.length == 0 && this.numberArray.length == 0) {
                this.$message('关联产品不能为空！', 'error');
                return;
            }
            for (let i = 0; i < this.productNum + 1; i++) {
                if (!this.productArray[i]) {
                    this.$message('关联产品不能为空！', 'error');
                    return;
                }
                if (!this.numberArray[i]) {
                    this.$message('关联产品次数不能为空！', 'error');
                    return;
                }
            }
            if (new Set(this.productArray).size !== this.productArray.length) {
                this.$message('产品不能重复添加！', 'error');
                return;
            }
            this.rechargeInfo['productList'] = this.productArray.map((id, index) => ({
                stockId: id,
                number: this.numberArray[index],
            }));
            this.rechargeInfo['projectId'] = this.curRow['id'];
            this.rechargeInfo['id'] = null;
            this.$axios.post('/aiAnalysisRecharge/save', this.rechargeInfo).then((res) => {
                if (res.code == 200) {
                    this.getList();
                    this.prepareTotal();
                    this.isShowRechargeDlg = false;
                    this.$message('充值成功！', 'success');
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
        // 充值记录
        viewRechargeDetail(row) {
            this.curRow = JSON.parse(JSON.stringify(row));
            this.dlgTableData = [];
            this.dlgPageNum = 1;
            this.dlgPages = 0;
            this.getRechargeList();
        },
        getRechargeList() {
            let params = {};
            params['projectId'] = this.curRow.id;
            params['pageNum'] = this.dlgPageNum;
            params['pageSize'] = 10;
            this.$axios.get('/aiAnalysisRecharge/list', params).then((res) => {
                if (res.code == 200) {
                    this.dlgTableData = res.data.pageList;
                    this.dlgPages = res.data.pages;
                    this.dlgTotal = res.data.total;
                    this.isShowRechargeDetailDlg = true;
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
        cancelRecharge(row) {
            this.$confirm(
                '<div style="line-height: 1.8;">' +
                    '<p style="color: #f56c6c;">确认撤销当前产品的充值吗？</p>' +
                    '<p style="color: #d7d7d7;">撤销后本次充值次数将扣除。</p>' +
                    '</div>',
                '撤销充值',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                }
            )
                .then(() => {
                    this.$axios.get('/aiAnalysisRecharge/delete', {id: row.id}).then((res) => {
                        if (res.code == 200) {
                            this.getList();
                            this.prepareTotal();
                            this.getRechargeList();
                            this.$message('撤销充值成功！', 'success');
                            this.dlgTotal = this.dlgTotal - 1;
                            if (this.dlgPageNum * 10 - this.dlgTotal === 10) {
                                this.dlgPageNum = this.dlgPageNum - 1 || 1;
                            }
                        } else {
                            this.$message(res.message, 'error');
                        }
                    });
                })
                .catch(() => {});
        },
        dlgPageChange(val) {
            this.dlgPageNum = val;
            this.getRechargeList();
        },
        handleSearch() {
            this.pageChange(1)
        }
    },
};
</script>
<style lang="scss" scoped>
.content-main-wrap {
    .content-overflow {
        .info-content {
            width: 100%;
            min-width: 1260px;
            overflow-x: auto;
            margin-top: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            height: 100px;
            padding: 0 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .info-content1,
            .info-content2 {
                align-items: center;
                justify-content: space-around;
                display: flex;

                .info-item {
                    width: 25%;
                    text-align: left;

                    .orange-text {
                        color: #f59f2e;
                        font-weight: 700;
                    }
                    .green-text {
                        color: #70b604;
                        font-weight: 700;
                    }
                }
            }
            .info-content1 {
                margin-bottom: 20px;
                justify-content: start;
                .info-item {
                    width: 30%;
                }
            }
        }
    }
    .dialog-item {
        p:first-child {
            width: 100px;
            text-align: right;
        }
        .dialog-title {
            margin-right: 12px;
        }
        .dialog-unit {
            margin: 0 5px;
        }
        .el-icon {
            font-size: 40px;
            color: #d7d7d7;
        }
        .width-5 {
            width: 332px;
        }
        .dialog-tips {
            color: #ababab;
            text-indent: 30px;
        }
    }
    .dialog-btn {
        justify-content: center;
    }
}
</style>
