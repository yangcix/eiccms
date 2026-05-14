<template>
    <div class="content-main-wrap">
        <p class="content-title">大单元管理</p>

        <div class="main-wrap">
            <div class="search-operat" style="min-width: 960px">
                <div>
                    <el-input
                        style="width: 280px"
                        clearable
                        v-model="searchKey"
                        placeholder="请输入大单元分析名称关键字"
                        v-search="handleSearch"
                    ></el-input>
                    <span class="search-desc">科目：</span>
                    <el-select v-model="subjectId" placeholder="选择科目" style="margin-left: 10px; width: 150px">
                        <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc">分析状态：</span>
                    <el-select v-model="status" placeholder="选择分析状态" style="margin-left: 10px; width: 150px">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="handleSearch()">查询</el-button>
                </div>
                <div>
                    <!-- <el-button icon="el-icon-plus" v-if="permission.save" @click="add()">新增</el-button> -->
                    <el-button icon="el-icon-plus" v-if="permission.save" @click="add()">新增</el-button>
                </div>
            </div>
            <div class="table-list">
                <el-table
                    :row-style="{height: '10px'}"
                    :cell-style="{padding: '12px 0'}"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column align="center" prop="name" label="大单元分析名称"> </el-table-column>
                    <el-table-column align="center" prop="subjectName" label="科目"> </el-table-column>
                    <el-table-column align="center" prop="status" label="分析状态">
                        <template slot-scope="scope">
                            <ul>
                                <li v-if="scope.row.status === 0">未开始分析</li>
                                <li v-if="scope.row.status === 1">分析中</li>
                                <li v-if="scope.row.status === 2">分析完成</li>
                                <li v-if="scope.row.status === 3">分析失败</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" min-width="110" label="创建时间">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <div class="btnList">
                                <el-button
                                    type="text"
                                    v-if="scope.row.status === 3 && permission.downloadOrResetting"
                                    @click="resetting(scope.row)"
                                    >重置分析</el-button
                                >
                                <el-button
                                    type="text"
                                    v-if="scope.row.status === 3 && permission.update"
                                    @click="add(0, scope.row)"
                                    :disabled="scope.row.status !== 3"
                                    >编辑</el-button
                                >
                                <el-button
                                    type="text"
                                    style="color: #f56c6c"
                                    @click="deleteData(scope.row)"
                                    v-if="scope.row.status === 3 && permission.delete"
                                    >删除</el-button
                                >

                                <el-button
                                    type="text"
                                    @click="openReport(scope.row)"
                                    v-if="scope.row.status === 1 || scope.row.status === 2"
                                    :disabled="scope.row.status === 1"
                                    >查看报告</el-button
                                >
                                <el-button
                                    type="text"
                                    @click="download(scope.row)"
                                    v-if="scope.row.status === 2 && permission.download"
                                    >下载压缩包</el-button
                                >
                            </div>
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
                class="resetting"
                title="删除大单元分析"
                :close-on-click-modal="false"
                :visible.sync="deleteShow"
                width="420px"
            >
                <div class="dialog-wrap">
                    <p class="err-delete">确定删除该大单元分析任务吗？</p>
                    <div class="dialog-btn">
                        <el-button @click="deleteShow = false">取 消</el-button>
                        <el-button type="primary" @click="handleDelete()">确 定</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                class="resetting"
                title="重置分析"
                :close-on-click-modal="false"
                :visible.sync="resettingShow"
                width="500px"
            >
                <span class="popUp">确认要重新提交任务进行大单元分析吗？</span>
                <span class="prompt">(注：报告生成失败，请联系管理员或尝试重置分析)</span>
                <div style="margin-top: 20px; display: flex; justify-content: right">
                    <el-button @click="resettingShow = false" style="margin-right: 10px">取 消</el-button>
                    <el-button type="primary" @click="resetAnalysis()" style="margin-right: 10px">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="项目次数选择"
                :close-on-click-modal="false"
                :visible.sync="showChooseProjectTimes"
                width="600px"
                class="videoBox"
            >
                <div class="dialog-content">
                    <div class="tips">原有项目次数已用完，请选择新的项目次数进行 AI分析！</div>
                    <div class="dialog-item">
                        <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                        <p>{{ aiNum }}次</p>
                    </div>
                    <div class="dialog-item">
                        <p>优先使用<em>*</em>：</p>
                        <el-select :popper-append-to-body="false" v-model="resettingVal.aiProjectId" class="width-2">
                            <el-option
                                v-for="item in useList"
                                :key="item.allocationId"
                                :label="item.projectName + '-' + item.residueNum + '次'"
                                :value="item.allocationId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="resetAnalysis">确 定</el-button>
                    <el-button @click="handleCloseResetAnalysis">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            aiNum: 0,
            statusList: [
                {value: '', label: '全部'},
                {value: 1, label: '分析中'},
                {value: 2, label: '分析完成'},
                {value: 3, label: '分析失败'},
            ],
            subjectId: '', // 科目
            status: '', // 分析状态
            deleteVal: {}, // 删除数据
            deleteShow: false, // 删除提示弹窗
            resettingShow: false, // 重置分析弹窗
            resettingVal: {}, // 重置分析数据局
            searchKey: '',
            pages: 1,
            pageNum: 1,
            tableData: [
                // {name: "测试001",subject: "语文", aiStatus: 0, createDate: "2024-04-29 12:00:00"},
                // {name: "测试002",subject: "数学", aiStatus: 1, createDate: "2024-04-30 12:00:00"},
                // {name: "测试003",subject: "英语", aiStatus: 2, createDate: "2024-05-01 12:00:00"}
            ],
            permission: '',
            loading: false,
            total: '',
            subjectList: [],
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId, // ai配置id
            useList: [],
            showChooseProjectTimes: false,
        };
    },
    watch: {
        $route(to, from) {
            console.log('from', from);
            if (from.path !== '/aiLargeUnit') {
                this.searchKey = '';
                this.subjectId = '';
                this.status = '';
                if (from.path == '/sm/largeUnitAddEdit') {
                    if (from.query && from.query.id) {
                        // this.handleGetData();
                    } else {
                        this.pageNum = 1;
                        // this.handleGetData();
                    }
                } else {
                    this.pageNum = 1;
                    // this.handleGetData();
                }
            }
        },
    },
    mounted() {
        this.getSubjectList();
        this.handleGetData();
        //   this.handleDelete();
        // 数据库插入慢就用下面这种方式
        //   this.$bus.off('getAiList', this.handleGetData);
        //   this.$bus.on('getAiList', this.handleGetData);
    },
    methods: {
        // 新增、编辑路由跳转
        add(type, val) {
            if (type == 0) {
                this.$router.push({
                    path: '/sm/largeUnitAddEdit',
                    query: {id: val ? val.id : ''},
                });
            } else {
                this.$router.push('/sm/largeUnitAddEdit');
            }
        },
        // 查看报告
        openReport(val) {
            this.$axios
                .get('/aiLargeUnit/report', {params: {id: val.id}, responseType: 'blob'}, 'blob')
                .then((res) => {
                    console.log(res, 'report');
                    let url = window.URL.createObjectURL(new Blob([res]));
                    console.log(res, 'report12345');
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', decodeURIComponent('大单元分析报告.pdf'));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((err) => {
                    console.log(err, '下载大单元分析报告错误信息');
                });
        },
        // 下载压缩包
        download(val) {
            this.$axios
                .get('/aiLargeUnit/download', {params: {id: val.id}, responseType: 'blob'}, 'blob')
                .then((res) => {
                    console.log(res, 'download');
                    let url = window.URL.createObjectURL(new Blob([res]));
                    console.log(res, 'download12345');
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', decodeURIComponent(`${val.name}.rar`));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((err) => {
                    console.log(err, '下载压缩包错误信息');
                });
        },
        // 获取科目
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
                this.subjectList.unshift({
                    id: '',
                    name: '全部',
                });
            });
        },
        //重置分析弹窗
        resetting(row) {
            this.resettingVal = JSON.parse(JSON.stringify(row));
            const powerResult = this.hasProjectTimes(row);
            powerResult.then((res) => {
                if (res) {
                    this.resettingShow = true;
                }
            });
        },
        async hasProjectTimes(row) {
            // 1AI课堂分析 2赛课辅导 3大单元及学情分析 4AI课前指导
            let params = {};
            params['productType'] = 3;
            params['currentUserId'] = row.teacherId;
            return await this.$axios.get('/aiAnalysisRecharge/quota', params).then((res) => {
                if (res.code == 200) {
                    this.useList = res.data.options;
                    this.aiNum = res.data.totalResidue;
                    // 全部次数都没有了，直接给提示
                    if (this.aiNum == 0) {
                        this.$message('当前无可用分析次数！', 'error');
                        return false;
                    } else {
                        const currentItem = this.useList.find((item) => item.allocationId === row.aiProjectId);
                        // 当前项目没有次数，但还有其他项目次数可选
                        if (!currentItem || currentItem.residueNum == 0) {
                            this.$set(this.resettingVal, 'aiProjectId', '');
                            this.showChooseProjectTimes = true;
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            });
        },
        // 删除弹窗
        deleteData(row) {
            this.deleteVal = row;
            this.deleteShow = true;
        },
        // 获取列表数据
        handleGetData() {
            this.loading = true;
            this.$axios
                .get('/aiLargeUnit/list', {
                    keyWord: this.searchKey,
                    subjectId: this.subjectId,
                    status: this.status,
                    pageNum: this.pageNum, // 页数
                    pageSize: 10, // 请求显示条数
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.pageList;
                        this.pages = res.data.pages;
                        this.permission = this.creatPermit(res.data.permit);
                        this.loading = false;
                        this.total = res.data.total;
                    }
                });
        },
        // 删除
        handleDelete() {
            let data = new FormData();
            data.append('id', this.deleteVal.id);
            this.$axios.post('/aiLargeUnit/delete', data).then((res) => {
                if (res.code === 200) {
                    this.deleteShow = false;
                    this.$message(res.data, 'success');
                    this.total = this.total - 1;
                    if (this.pageNum * 10 - this.total === 10) {
                        this.pageNum = this.pageNum - 1 || 1;
                    }
                    this.handleGetData();
                }
            });
        },
        // 查询
        handleSearch() {
            this.scrollTo0();
            this.pageNum = 1;
            this.handleGetData();
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
        //分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.handleGetData();
        },
        //重置分析
        resetAnalysis() {
            let data = new FormData();
            data.append('id', this.resettingVal.id);
            data.append('aiProjectId', this.resettingVal.aiProjectId);
            this.$axios.post('/aiLargeUnit/resetting', data).then((res) => {
                if (res.code === 200) {
                    this.resettingShow = false;
                    this.showChooseProjectTimes = false;
                    this.$message(res.data, 'success');
                    this.handleGetData();
                }
            });
        },
        handleCloseResetAnalysis() {
            this.showChooseProjectTimes = false;
            this.aiNum = 0;
            this.useList = [];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.btnList {
    a {
        padding-right: 10px;
    }

    li {
        text-decoration: none;
    }
}

.dialog-item {
    display: flex;
    align-items: center;
    em {
        color: #f64646;
    }

    p:first-child {
        width: 84px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }
}

.popUp {
    margin-left: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #303133;
}

.prompt {
    color: gray;
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.resetting {
    ::v-deep .el-dialog__title {
        padding-left: 20px;
    }
}

.table-list {
    padding: 0 24px;
    border: 1px solid #ebebeb;
    margin-top: 33px;
}
</style>
