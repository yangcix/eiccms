<template>
    <div class="content-main-wrap">
        <p class="content-title">课前指导</p>

        <div class="main-wrap">
            <div class="search-operat" style="min-width: 1190px">
                <div>
                    <el-input
                        class="width-3"
                        clearable
                        v-model="searchKey"
                        placeholder="请输入名称关键字"
                        v-search="handleSearch"
                        style="width: 160px"
                    ></el-input>
                    <span class="search-desc" v-show="curShowType != 4">学科：</span>
                    <el-select
                        v-model="searchSubject"
                        placeholder="选择学科"
                        style="width: 130px"
                        v-show="curShowType != 4"
                    >
                        <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc">状态：</span>
                    <el-select
                        v-model="searchThemeStatus"
                        placeholder="选择状态"
                        class="width-3"
                        style="width: 110px"
                        clearable
                    >
                        <el-option
                            v-for="item in searchThemeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <!-- 全部数据 或者是 教育局的下级数据 -->
                    <span class="search-desc" v-show="curShowType == 1 || (curOrgType == 1 && curShowType == 3)"
                        >学校：</span
                    >
                    <el-cascader
                        v-model="searchSchoolList"
                        :props="cascaderProps"
                        :options="departmentTree"
                        @change="handleChangeTeacher"
                        collapse-tags
                        clearable
                        filterable
                        class="width-3"
                        @visible-change="getDepartmentList"
                        style="width: 190px"
                        v-show="curShowType == 1 || (curOrgType == 1 && curShowType == 3)"
                    ></el-cascader>
                    <span class="search-desc" v-show="curShowType != 4">年级：</span>
                    <el-select
                        :popper-append-to-body="false"
                        v-model="searchGrade"
                        placeholder="请选择年级"
                        style="width: 130px"
                        v-show="curShowType != 4"
                    >
                        <el-option
                            v-for="item in gradeOptions"
                            :key="item.gradeId"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="handleSearch">查询</el-button>
                </div>
                <div>
                    <el-button icon="el-icon-plus" @click="add()">新增</el-button>
                </div>
            </div>
            <div class="data-table table-border" style="min-width: 1150px">
                <el-table
                    :row-style="{height: '10px'}"
                    :cell-style="{padding: '12px 0'}"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column align="center" label="课程名称">
                        <template slot-scope="scope">
                            <div class="tableName" @click="detail(scope.row)">{{ scope.row.name }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="subjectName" align="center" label="学科" width="100"> </el-table-column>
                    <el-table-column prop="classTypeName" align="center" label="课堂类型" width="100"></el-table-column>
                    <el-table-column prop="gradeName" align="center" label="年级" width="100"></el-table-column>
                    <el-table-column prop="teacherName" align="center" label="教师" width="100"> </el-table-column>
                    <!-- 全部数据或者市级/区县的下级数据 -->
                    <el-table-column
                        v-if="curShowType == 1 || ((curOrgLevel == 2 || curOrgLevel == 3) && curShowType == 3)"
                        prop="schoolName"
                        align="center"
                        label="学校"
                    >
                    </el-table-column>
                    <el-table-column align="center" label="状态" width="100">
                        <template slot-scope="scope">
                            <ul>
                                <li v-if="scope.row.status === -1">待提交</li>
                                <li v-if="scope.row.status === 0">未开始</li>
                                <li v-if="scope.row.status === 1">分析中</li>
                                <li v-if="scope.row.status === 2">分析成功</li>
                                <li v-if="scope.row.status === 3">
                                    分析失败
                                    <el-tooltip :content="scope.row.msg" placement="top-start">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="100" label="提交时间">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status != -1">{{ scope.row.submitDate }}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="80px" label="操作">
                        <template slot-scope="scope">
                            <div class="btnList">
                                <!-- 分析中或者分析成功不可编辑 -->
                                <el-button
                                    v-if="permission.update && scope.row.status != 1 && scope.row.status != 2"
                                    type="text"
                                    @click="add(0, scope.row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    type="text"
                                    @click="downloadPDFReport(scope.row, 5)"
                                    v-if="scope.row.status == 2"
                                    >下载报告</el-button
                                >
                                <el-button
                                    v-if="permission.update && scope.row.status != 1 && scope.row.status != 2"
                                    type="text"
                                    style="color: #f56c6c"
                                    @click="deleteData(scope.row)"
                                    >删除</el-button
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

            <el-dialog title="删除课前指导" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">确认删除该课前指导任务吗？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="handleDelete()">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
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
            searchThemeList: [
                {value: -1, label: '待提交'},
                {value: 0, label: '未开始'},
                {value: 1, label: '分析中'},
                {value: 2, label: '分析完成'},
                {value: 3, label: '分析失败'},
            ],
            searchSubject: '',
            searchThemeStatus: '',
            searchGrade: '',
            searchKey: '',
            deleteVal: {},
            deleteShow: false,
            pages: 1,
            pageNum: 1,
            tableData: [],
            permission: '',
            loading: false,
            totalS: '',
            subjectList: [],
            reportRow: {},
            departmentTree: [],
            cascaderProps: {
                value: 'id',
                label: 'name',
                multiple: true,
            },
            orgIdList: [],
            searchSchoolList: [],
            isFirstTime: true,
            curShowType: 1,
            curOrgType: 1,
            curOrgLevel: 2,
            gradeOptions: [],
        };
    },
    created() {},
    watch: {
        $route(to, from) {
            if (from.path == '/preClassGuide/detail' || to.path == '/preClassGuide') {
                // 从概览跳转过来的话，分页和过滤项重置
                if (!(from.path == '/sm/preClassGuideAddEdit' || from.path == '/preClassGuide/detail')) {
                    this.pageNum = 1;
                    this.searchKey = '';
                    this.searchThemeStatus = '';
                    this.searchSubject = '';
                    this.searchGrade = '';
                    this.orgIdList = [];
                    this.searchSchoolList = [];
                    this.handleGetData();
                }
                if (from.path == '/sm/preClassGuideAddEdit') {
                    if (from.query && from.query.themeid) {
                        this.handleGetData();
                    } else {
                        this.pageNum = 1;
                        this.handleGetData();
                    }
                }

                // 在当前节点下的操作，返回到节点主页时，过滤项和分页保持记忆
            } else if (from.path !== '/preClassGuide') {
                this.searchKey = '';
                this.searchThemeStatus = '';
                this.searchSubject = '';
                this.searchGrade = '';
                this.orgIdList = [];
                this.searchSchoolList = [];
            }
        },
    },
    mounted() {
        this.getSubjectList();
        this.pageNum = 1;
        this.searchThemeStatus = '';
        this.searchSubject = '';
        this.searchGrade = '';
        this.orgIdList = [];
        this.searchSchoolList = [];
        this.handleGetData();
        this.$bus.off('getAiList', this.handleGetData);
        this.$bus.on('getAiList', this.handleGetData);
        this.getUserInfo();
        this.getGradeOptions();
    },
    methods: {
        getUserInfo() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log(userInfo);
            // 角色权限（1全部数据，2全校数据，3下级数据, 4个人数据）
            this.curShowType = userInfo.sysUserAuth[0].type;
            // 1：教育局 2：学校 3：部门
            this.curOrgType = userInfo.sysOrganization.orgType;
            // admin和super的orgLevel为空
            // 1：省 2：市 3：区县 4：学校
            this.curOrgLevel = userInfo.sysOrganization.orgLevel ? userInfo.sysOrganization.orgLevel : 2;
        },
        detail(val) {
            if (this.permission.info) {
                this.$router.push({
                    path: '/aiPreClassGuidance/detail',
                    query: {themeid: val.id},
                });
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        openReport(row, downloadReport) {
            if (!row.analysisId) {
                return;
            }
            let route = '/preClassGuideReport?analysisId=' + row.analysisId + '&analysisType=1';
            if (downloadReport === 1) {
                route += '&downloadReport=1';
            }
            window.open(route, '_blank');
        },
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
            });
        },
        async getDepartmentList() {
            if (this.isFirstTime) {
                this.$message('下拉请求中，请稍等', 'success');
                await this.$axios.get('/sys/org/listDepartmentAndUser', {isAll: 1}).then((res) => {
                    this.departmentTree = [];
                    this.departmentTree = res.data;
                    let dataArray = JSON.parse(JSON.stringify(this.departmentTree));
                    // 如果第一级只有一项，跳过，显示下级
                    while (dataArray.length == 1) {
                        dataArray = JSON.parse(JSON.stringify(dataArray[0].children));
                    }
                    this.departmentTree = dataArray;
                    this.isFirstTime = false;
                });
            }
            return this.departmentTree;
        },

        handleChangeTeacher(valueArray) {
            // 取数组每项的最后一项，并转为数值类型
            this.orgIdList = valueArray.map((subArray) => parseInt(subArray.at(-1)));
        },
        deleteData(row) {
            this.deleteVal = row;
            this.deleteShow = true;
        },
        handleGetData() {
            this.loading = true;
            this.$axios
                .post('/aiPreClassGuidance/list', {
                    subjectId: this.searchSubject,
                    gradeName: this.searchGrade,
                    status: this.searchThemeStatus,
                    orgIdList: this.orgIdList,
                    keyWord: this.searchKey,
                    pageNum: this.pageNum, // 页数
                    pageSize: 10, // 请求显示条数
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.pageList;
                        this.pages = res.data.pages;
                        this.permission = this.creatPermit(res.data.permit);
                        this.loading = false;
                        this.totalS = res.data.total;
                    }
                });
        },

        // 合并
        add(type, val) {
            if (type == 0) {
                this.$router.push({
                    path: '/sm/preClassGuideAddEdit',
                    query: {
                        themeid: val ? val.id : '',
                        teacherName: val ? val.teacherName : '',
                        errorMsg: val.errorMsg ? val.errorMsg : '',
                    },
                });
            } else {
                this.$router.push('/sm/preClassGuideAddEdit');
            }
        },
        downloadPDFReport(row) {
            this.$axios.get('/sm/comment/exportPDFReport', {id: row.id, type: 3, form: 5}, 'blob').then((res) => {
                let url = window.URL.createObjectURL(new Blob([res]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.download = row.name + '_课前指导.pdf';
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
            });
        },
        // 删除
        handleDelete() {
            let data = new FormData();
            data.append('id', this.deleteVal.id);
            this.$axios.post('/aiPreClassGuidance/delete', data).then((res) => {
                if (res.code === 200) {
                    this.deleteShow = false;
                    this.$message(res.data, 'success');
                    // this.pageNum = 1;
                    this.totalS = this.totalS - 1;
                    if (this.pageNum * 10 - this.totalS === 10) {
                        this.pageNum = this.pageNum - 1 || 1;
                    }
                    this.handleGetData();
                }
            });
        },
        // 搜索
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
        getGradeOptions() {
            let orgId = '';
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!(userInfo.nickName == 'super' || userInfo.nickName == 'admin')) {
                orgId = userInfo.orgId;
            }
            this.$axios.get('/aiGrinding/getGrade', {orgId: orgId}).then((res) => {
                this.gradeOptions = res.data;
            });
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.sublevel {
    padding-left: 84px;
    overflow: hidden;

    .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.tableName {
    color: #409eff;
    cursor: pointer;
}

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

    // margin-top: 25px;
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

::v-deep .el-upload-dragger {
    width: 320px;
    height: 133px;
}

::v-deep .upload-democlip .el-upload-list {
    margin: -145px 0 0 15px;
    width: 290px;
}

.upload-democlip .el-upload-list__item-status-label {
    display: block;
}

.upload-democlip {
    height: 140px;
}

.el-upload-dragger .el-icon-upload {
    margin: 30px 0 16px;
}

.videoBox {
    ::v-deep .el-dialog__body {
        padding: 0 20px 30px 20px;
    }
}

::v-deep .videoEnd {
    width: 560px;
    height: 337.5px;
    background: #000;

    p {
        color: white;
        text-align: center;
        line-height: 337.5px;
    }
}

.popUp {
    margin-left: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: white;
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
.divider {
    margin: 20px 0;
    border: none;
    border-top: 1px solid #ddd;
}
</style>
