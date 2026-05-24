<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header @back="goBack" :content="`${$route.query.projectName}`"></el-page-header>
        </p>
        <div class="content-main-wrap" style="min-width: 1260px; overflow-x: auto; overflow-y: auto">
            <div class="content-overflow">
                <div class="main-wrap" style="min-width: 1260px; overflow-x: auto">
                    <div class="search-operat-new">
                        <div>
                            <span class="search-desc">学校名称：</span>
                            <el-select v-model="orgId" placeholder="请选择" class="width-6" filterable clearable>
                                <el-option
                                    v-for="item in orgIdList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                            <el-button
                                class="search-btn"
                                style="position: relative; right: 0; float: right"
                                @click="showExportDialog()"
                                >导出
                            </el-button>
                            <el-button
                                class="search-btn"
                                type="primary"
                                style="position: relative; right: 0; float: right"
                                @click="infoData()"
                                >查看分配明细
                            </el-button>
                        </div>
                    </div>
                    <div class="info-content">
                        <div class="info-list">
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >AI课堂分析 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[0]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[0]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[0]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >赛课辅导 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[1]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[1]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[1]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                        </div>
                        <span
                            style="
                                display: flex;
                                float: left;
                                height: 38px;
                                line-height: 42px;
                                margin-left: 30px;
                                border-right: 2px solid #aaaaaa;
                            "
                        >
                        </span>
                        <div class="info-list">
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >大单元分析 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[2]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[2]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[2]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >AI课前指导 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[3]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[3]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[3]?.waitAllocatedNum) + '次' }}</span
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
                            <el-table-column prop="schoolName" align="center" label="学校名称"></el-table-column>
                            <el-table-column align="center" label="AI课堂分析">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['aiClassUsed'] }}/{{ scope.row['aiClassAllocated'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="大单元及学情分析">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['bigUnitUsed'] }}/{{ scope.row['bigUnitAllocated'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="赛课辅导">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['contestUsed'] }}/{{ scope.row['contestAllocated'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="AI课前指导">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['preClassUsed'] }}/{{ scope.row['preClassAllocated'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="80">
                                <template slot-scope="scope">
                                    <ul class="operat-list">
                                        <el-button type="text" @click="showQuotaAllocationDlg(scope.row)"
                                            >额度分配</el-button
                                        >
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
                </div>
                <el-dialog
                    title="数据导出"
                    :close-on-click-modal="false"
                    :visible.sync="isShowDataExport"
                    width="600px"
                    class="videoBox"
                >
                    <div class="dialog-content">
                        <div class="dialog-item">
                            <p>数据量：</p>
                            <p style="color: #000">{{ exportDataNum }}</p>
                        </div>
                        <div class="dialog-item">
                            <p>时间区间：</p>
                            <el-date-picker
                                v-model="exportData.time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="changeExportFilter"
                                value-format="yyyy-MM-dd"
                                class="width-5"
                            >
                            </el-date-picker>
                        </div>
                        <div class="dialog-item">
                            <p>产品名称：</p>
                            <el-select
                                v-model="exportData.productList"
                                placeholder="请选择产品"
                                class="width-5"
                                filterable
                                @change="changeExportFilter"
                                multiple
                                collapse-tags
                            >
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handleExportData">确 定</el-button>
                        <el-button @click="handleCloseExportDialog">取 消</el-button>
                    </span>
                </el-dialog>
                <el-dialog
                    title="查看分配明细"
                    :close-on-click-modal="false"
                    :visible.sync="infoShow"
                    width="1140px"
                    @close="infoCancel()"
                >
                    <hr class="info-line" />
                    <div>
                        <el-input
                            v-model="infoSearchKey"
                            placeholder="请输入学校名称关键字"
                            v-search="infoSearch"
                            style="width: 240px"
                            clearable
                        >
                        </el-input>
                        <span class="search-desc"><em style="color: red"></em> 产品名称</span>
                        <el-select
                            v-model="infoProductIdList"
                            placeholder="选择产品名称"
                            style="width: 240px"
                            multiple
                            collapse-tags
                            clearable
                        >
                            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button type="primary" class="search-btn" @click="infoSearch()">查询</el-button>
                    </div>
                    <div class="table-list">
                        <el-table
                            :row-style="{height: '10px'}"
                            :cell-style="{padding: '12px 0'}"
                            v-loading="loading"
                            :data="infoTableData"
                            style="width: 100%"
                        >
                            <el-table-column align="center" prop="orgName" label="学校名称"></el-table-column>
                            <el-table-column align="center" prop="productName" label="产品名称" width="220px">
                            </el-table-column>
                            <el-table-column align="center" prop="operateNum" label="次数" width="100px">
                                <template slot-scope="scope">
                                    <span :style="{color: scope.row.operateNum >= 0 ? 'green' : 'red'}">{{
                                        scope.row.operateNum >= 0 ? '+' + scope.row.operateNum : scope.row.operateNum
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="remark" label="备注" width="238px">
                                <template #default="scoped">
                                    <el-tooltip
                                        v-if="scoped.row.remark?.replace(/\s+/g, '').length > 15"
                                        :content="scoped.row.remark"
                                        placement="top"
                                    >
                                        <span
                                            style="
                                                display: block;
                                                text-overflow: ellipsis;
                                                overflow: hidden;
                                                -webkit-line-clamp: 1;
                                                -webkit-box-orient: vertical;
                                                white-space: nowrap;
                                                max-width: 320px;
                                                word-break: break-word;
                                            "
                                        >
                                            {{ scoped.row.remark }}
                                        </span>
                                    </el-tooltip>
                                    <span v-else>{{ scoped.row.remark }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="createDate"
                                label="操作时间"
                                width="160px"
                            ></el-table-column>
                        </el-table>
                    </div>
                    <div class="table-page">
                        <el-pagination
                            layout="prev, pager, next"
                            @current-change="infoPageChange"
                            :page-count="infoPage"
                            :current-page="infoPageNum"
                        >
                        </el-pagination>
                    </div>
                </el-dialog>
                <el-dialog
                    title="额度分配"
                    :close-on-click-modal="false"
                    :visible.sync="isShowQuotaAllocation"
                    width="600px"
                    @close="quotaAllocation(2)"
                >
                    <hr class="line" />
                    <div class="quota-dialog-wrap">
                        <div class="info-content-dlg">
                            <div class="info-item">
                                AI课堂分析待分配：{{ $comjs.formatValue(frequency[0]?.remainNum) }}次
                            </div>
                            <div class="info-item">
                                大单元及学情分析待分配：{{ $comjs.formatValue(frequency[2]?.remainNum) }}次
                            </div>
                            <div class="info-item">
                                赛课辅导待分配：{{ $comjs.formatValue(frequency[1]?.remainNum) }}次
                            </div>
                            <div class="info-item">
                                AI课前指导待分配：{{ $comjs.formatValue(frequency[3]?.remainNum) }}次
                            </div>
                            <p class="prompt">注：若次数不足，请联系管理员充值</p>
                        </div>
                        <div class="dialog-item">
                            <p>学校名称：</p>
                            <p>{{ curRow.schoolName }}</p>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>产品名称：</p>
                            <el-select v-model="quotaInfo.productId">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>次数：</p>
                            <el-input-number
                                class="width-6x"
                                :precision="0"
                                v-model="quotaInfo.num"
                                @blur="blurNumber"
                            ></el-input-number>
                            <el-tooltip placement="top">
                                <div slot="content">
                                    正整数：将所选学校增加对应的AI分析次数；<br />负整数：将所选学校减少对应的AI分析次数；
                                </div>
                                <i class="iconfont icon-wenhao" style="margin-left: 10px; color: #000000"></i>
                            </el-tooltip>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title">备注：</p>
                            <el-input
                                type="textarea"
                                :rows="4"
                                placeholder=""
                                maxlength="200"
                                show-word-limit
                                class="upload-wrap"
                                v-model="quotaInfo.remark"
                            ></el-input>
                        </div>
                        <div class="btn-list">
                            <el-button class="confirm" type="primary" @click="quotaAllocation(1)">确定</el-button>
                            <el-button class="cancel" @click="quotaAllocation(2)">取消</el-button>
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
            isShowProjectDlg: false,
            isShowRechargeDlg: false,
            rechargeInfo: {},
            orgIdAllList: [],
            productArray: [],
            numberArray: [],
            productNum: 0,
            productList: [],
            curRow: {},
            orgIdList: [],
            orgId: '',
            frequency: [],
            isShowDataExport: false,
            exportDataNum: 0,
            exportData: {
                productList: [],
            },
            infoShow: false,
            infoSearchKey: '', // 分配明细搜索关键词
            infoProductIdList: [],
            infoPageNum: 1,
            infoPage: 0,
            infoTotal: '',
            infoTableData: [], // 明细列表数据
            isShowQuotaAllocation: false,
            quotaInfo: {},
        };
    },
    mounted() {
        this.getList();
        this.getTotal();
        this.getOrgIdList();
    },
    methods: {
        //获取列表
        getList() {
            let params = {};
            params['pageNum'] = this.pageNum;
            params['orgId'] = this.$route.query.orgId;
            params['schoolId'] = this.orgId;
            params['projectId'] = this.$route.query.id;
            params['allocateType'] = 0;
            params['pageSize'] = 10;
            this.loading = true;
            this.$axios.post('/aiAnalysisAllocation/allocation/schoolList', params).then((res) => {
                if (res.code === 200) {
                    this.loading = false;
                    this.tableData = res.data.pageList;
                    this.pages = res.data.pages;
                }
            });
        },
        // 获取分析池总计数据 data 查询参数
        getTotal() {
            let params = {};
            params['keyWord'] = this.searchKey;
            params['orgId'] = this.$route.query.orgId;
            params['schoolId'] = this.orgId;
            params['projectId'] = this.$route.query.id;
            params['allocateType'] = 0;
            this.$axios.post('/aiAnalysisAllocation/allocation/topStat', params).then((res) => {
                if (res.code == 200) {
                    this.frequency = res.data;
                }
            });
        },
        // 列表搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getList();
            this.getTotal();
        },
        // 列表分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.getList();
        },
        // 调整
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('main-wrap')[0].scrollTo(0, 0);
        },
        getOrgIdList() {
            this.$axios.get('/sys/org/getOrgOrUserList', {level: 4, orgId: this.$route.query.orgId}).then((res) => {
                if (res.code == 200) {
                    this.orgIdList = res.data;
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/aiAnalysisAllocation');
            } else {
                this.$router.go(-1);
            }
        },
        showExportDialog() {
            this.changeExportFilter();
            this.getProductList();
            this.isShowDataExport = true;
        },
        // 导出弹窗数据改变
        changeExportFilter() {
            console.log(this.exportData);
            this.$axios
                .post('/aiAnalysisAllocation/allocation/getAllocationDataCount', {
                    startDate: this.exportData.time ? this.exportData.time[0] + ' 00:00:00' : '',
                    endDate: this.exportData.time ? this.exportData.time[1] + ' 23:59:59' : '',
                    productIdList: this.exportData.productList,
                    pageSize: -1, // 请求显示条数
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.exportDataNum = res.data;
                        console.log(this.exportDataNum, 'this.exportDataNum ');
                    }
                });
        },
        handleCloseExportDialog() {
            this.isShowDataExport = false;
            this.exportData = {
                productList: [],
            };
        },
        handleExportData() {
            this.exportData['startDate'] = this.exportData.time ? this.exportData.time[0] + ' 00:00:00' : '';
            this.exportData['endDate'] = this.exportData.time ? this.exportData.time[1] + ' 23:59:59' : '';
            this.exportData['productIdList'] = this.exportData.productList;
            const now = this.$moment();
            let fileName = this.$route.query.projectName + '次数分配导出数据_' + now.format('YYYY-MM-DD HHmmss');
            this.$comjs.exportTableData(
                '/aiAnalysisAllocation/allocation/exportAllocationData',
                this.exportData,
                fileName
            );
        },
        // 获取产品下拉
        getProductList() {
            this.$axios.get('/aiAnalysisStock/listAll').then((res) => {
                if (res.code == 200) {
                    this.productList = res.data;
                }
            });
        },
        // 查看分配明细
        infoData() {
            this.infoShow = true;
            this.getProductList();
            let params = {};
            params['orgName'] = this.infoSearchKey;
            params['productIdList'] = this.infoProductIdList;
            params['pageNum'] = this.infoPageNum;
            params['pageSize'] = 10;
            params['projectId'] = this.$route.query.id;
            params['orgId'] = this.$route.query.orgId;
            this.$axios.post('/aiAnalysisAllocation/allocation/logList', params).then((res) => {
                if (res.code === 200) {
                    this.loading = false;
                    this.infoTableData = res.data.pageList;
                    this.infoPage = res.data.pages;
                    this.infoTotal = res.data.total;
                }
            });
        },
        // 查看明细取消
        infoCancel() {
            this.infoSearchKey = '';
            this.infoProductIdList = [];
            this.infoPageNum = 1;
        },
        // 查看明细搜索
        infoSearch() {
            this.scrollTo0();
            this.infoPageNum = 1;
            this.infoData();
        },
        // 明细页分页点击
        infoPageChange(val) {
            this.scrollTo0();
            this.infoPageNum = val;
            this.infoData();
        },
        // 额度分配 0分配弹窗 1确认分配 2取消分配
        quotaAllocation(type) {
            if (type == 1) {
                // 确认分配
                if (this.verify()) {
                    return;
                }
                this.$axios.post('/aiAnalysisAllocation/allocation/educationDoAllocate', this.quotaInfo).then((res) => {
                    if (res.code == 200) {
                        this.isShowQuotaAllocation = false;
                        this.getList();
                        this.getTotal();
                    } else {
                        this.$message(res.message, 'error');
                    }
                });
            } else {
                this.isShowQuotaAllocation = false;
            }
        },
        showQuotaAllocationDlg(row) {
            this.curRow = JSON.parse(JSON.stringify(row));
            this.isShowQuotaAllocation = true;
            this.quotaInfo = {};
            this.quotaInfo['projectId'] = this.$route.query.id;
            this.quotaInfo['eduOrgId'] = this.$route.query.orgId;
            this.quotaInfo['orgId'] = this.curRow.id;
            this.quotaInfo['allocateType'] = 0;
            this.$set(this.quotaInfo, 'num', 1);
            this.getProductList();
        },
        // 验证
        verify() {
            if (!this.quotaInfo.productId) {
                this.$message('产品名称不能为空！', 'error');
                return true;
            }
            if (this.quotaInfo.num === 0) {
                this.$message('次数不能为0！', 'error');
                return true;
            } else if (!this.quotaInfo.num) {
                this.$message('次数不能为空！', 'error');
                return true;
            }
            if (this.quotaInfo.remark) {
                let stringLength = this.quotaInfo.remark.replace(/\s+/g, '');
                if (stringLength.length > 200) {
                    this.$message('备注内容不得超过200字！', 'error');
                    return true;
                }
            }
        },
        blurNumber(e) {
            if (!e.target.value) {
                e.target.value = 0;
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.main-wrap {
    padding-bottom: 35px;
}
.content-overflow {
    overflow-y: auto;
    overflow-x: auto;
    height: 100%;
    width: 100%;
    min-width: 1260px;

    .info-content {
        width: 100%;
        min-width: 1260px;
        overflow-x: auto;
        height: 100px;
        align-items: center;
        display: flex;
        margin-top: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;
        display: flex;

        .info-list {
            width: 49%;

            .bold-text {
                font-weight: 700;
            }

            .info-item {
                height: 38px;
                line-height: 42px;
            }
        }
    }
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
    margin-top: 0px;
    margin-bottom: 20px;
    width: 1095px;
}

.line {
    margin-top: -30px;
    margin-bottom: 20px;
    width: 545px;
}

.table-list {
    padding: 0 24px;
    border: 1px solid #ebebeb;
    margin-top: 20px;
    width: 1036px;
}

.upload-wrap {
    height: 80px;
    width: 282px;
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
    margin-left: 100px;
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
.quota-dialog-wrap {
    color: #202020;

    .info-content-dlg {
        display: flex;
        background-color: #f9f9f9;

        flex-wrap: wrap;
        padding-left: 20px;

        .info-item {
            width: 40%;
            margin-right: 20px;
            margin-top: 15px;
        }
        p {
            color: #bdbdbd;
            font-size: 12px;
        }
    }
    .dialog-item {
        margin-top: 15px;
        margin-bottom: 0;
        align-items: center;

        p:first-child {
            text-align: right;
            width: 80px;
            margin-right: 20px;
        }
    }
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
<style lang="scss">
.el-tooltip__popper.is-dark {
    max-width: 260px;
}
</style>
