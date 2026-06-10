<template>
    <div class="content-main-wrap" style="min-width: 1260px; overflow-x: auto; overflow-y: auto">
        <p class="content-title">次数分配管理</p>
        <div class="content-overflow">
            <div class="main-wrap" style="min-width: 1260px; overflow-x: auto">
                <div class="search-operat-new">
                    <div>
                        <el-input
                            v-model="searchKey"
                            class="width-2"
                            placeholder="请输入项目名称/合同编号关键字"
                            v-search="search"
                            clearable
                        ></el-input>
                        <span class="search-desc" v-if="isAdmin">教育局/学校：</span>
                        <el-select
                            v-model="orgType"
                            placeholder="请选择"
                            class="width-8"
                            @change="changeOrgType"
                            v-if="isAdmin"
                        >
                            <el-option
                                v-for="item in orgTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-select v-model="orgId" placeholder="请选择" class="width-6" filterable v-if="isAdmin">
                            <el-option
                                v-for="item in orgIdList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                    </div>
                </div>
                <div class="info-content2" v-if="orgType == '4'">
                    <div class="info-list">
                        <div class="info-item">
                            <span
                                >AI课堂分析 -
                                <span style="color: #f59a23" class="bold-text"
                                    >剩余：{{ $comjs.formatValue(frequency[0]?.remainNum) + '次' }}</span
                                ></span
                            >
                        </div>
                        <div class="info-item">
                            <span
                                >大单元分析 -
                                <span style="color: #f59a23" class="bold-text"
                                    >剩余：{{ $comjs.formatValue(frequency[2]?.remainNum) + '次' }}</span
                                ></span
                            >
                        </div>
                        <div class="info-item">
                            <span
                                >赛课辅导 -
                                <span style="color: #f59a23" class="bold-text"
                                    >剩余：{{ $comjs.formatValue(frequency[1]?.remainNum) + '次' }}</span
                                ></span
                            >
                        </div>
                        <div class="info-item">
                            <span
                                >AI课前指导 -
                                <span style="color: #f59a23" class="bold-text"
                                    >剩余：{{ $comjs.formatValue(frequency[3]?.remainNum) + '次' }}</span
                                ></span
                            >
                        </div>
                    </div>
                </div>
                <div class="info-content" v-else>
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
                        <el-table-column prop="projectName" align="center" label="项目名称"></el-table-column>
                        <el-table-column prop="contractNo" align="center" label="合同编号"></el-table-column>
                        <el-table-column prop="orgTypeName" align="center" label="项目所属机构"></el-table-column>
                        <el-table-column prop="relationProduct" align="center" label="关联产品"></el-table-column>
                        <el-table-column prop="createDate" align="center" label="创建时间"></el-table-column>
                        <el-table-column align="center" label="操作" width="50">
                            <template slot-scope="scope">
                                <ul class="operat-list">
                                    <el-button type="text" @click="viewDetail(scope.row)">查看 </el-button>
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
            orgTypeList: [
                {value: '2,3', label: '教育局'},
                {value: '4', label: '学校'},
            ],
            orgIdList: [],
            orgType: '',
            orgId: '',
            frequency: [],
            isAdmin: false,
            teacherUserId: '',
        };
    },
    watch: {
        $route(to, from) {
            if (from.path == '/viewSchoolSharing' || from.path == '/viewEducationBureau') {
                this.getList();
                this.getTotal();
            } else if (to.path == '/aiAnalysisAllocation') {
                this.searchKey = '';
                this.pageNum = 1;
                this.getUserPower();
            }
        },
    },
    mounted() {
        this.getUserPower();
    },
    methods: {
        getUserPower() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (
                JSON.parse(localStorage.getItem('userInfo')).userId == 1 ||
                JSON.parse(localStorage.getItem('userInfo')).userId == 2
            ) {
                this.isAdmin = true;
                this.orgType = '2,3';
                this.getFirstList();
            } else {
                this.isAdmin = false;
                // 1：省 2：市 3：区县 4：学校
                if (userInfo.sysOrganization.orgLevel == 4) {
                    this.orgId = userInfo.orgId;
                    // 角色权限（1全部数据，2全校数据，3下级数据, 4个人数据）
                    // 区分是学校还是个人
                    if (userInfo.sysUserAuth[0].type == 4) {
                        this.teacherUserId = userInfo.userId;
                    }
                    this.orgType = '4';
                } else {
                    this.orgType = '2,3';
                }
                this.getList();
                this.getTotal();
            }
        },
        getFirstList() {
            this.$axios.get('/sys/org/getOrgOrUserList', {level: this.orgType}).then((res) => {
                if (res.code == 200) {
                    this.orgIdList = res.data;
                    this.orgId = this.orgIdList[0].value;
                    this.getList();
                    this.getTotal();
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
        //获取列表
        getList() {
            let params = {};
            params['keyWord'] = this.searchKey;
            params['pageNum'] = this.pageNum;
            params['orgId'] = this.orgId;
            // 如果权限是下级则需要传入orgId和当前登陆用户Id teacherUserId
            if (this.teacherUserId) {
                params['teacherUserId'] = this.teacherUserId;
            }
            params['pageSize'] = 10;
            this.loading = true;
            this.$axios.post('/aiAnalysisProject/allocateList', params).then((res) => {
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
            params['orgId'] = this.orgId;
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
        changeOrgType(val) {
            this.$axios.get('/sys/org/getOrgOrUserList', {level: val}).then((res) => {
                if (res.code == 200) {
                    this.orgIdList = res.data;
                    this.orgId = this.orgIdList[0].value;
                    this.getList();
                    this.getTotal();
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
        // 查看
        viewDetail(row) {
            let orgId = row.orgId ? row.orgId : row.eduOrgId;
            if (this.orgType == '4') {
                this.$router.push({
                    path: '/viewSchoolSharing',
                    query: {
                        projectName: row.projectName,
                        id: row.id,
                        orgId: orgId,
                    },
                });
            } else {
                this.$router.push({
                    path: '/viewEducationBureau',
                    query: {
                        projectName: row.projectName,
                        id: row.id,
                        orgId: orgId,
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
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
    .info-content2 {
        width: 100%;
        min-width: 1260px;
        overflow-x: auto;
        height: 50px;
        align-items: center;
        margin-top: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;

        .info-list {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
            height: 100%;
            text-align: left;

            .bold-text {
                font-weight: 700;
            }

            .info-item {
                width: 25%;
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
    margin-bottom: 20px;
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
