<template>
    <div class="content-main-wrap">
        <p class="content-title">教学楼管理</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入教学楼名称关键字进行查询"
                        v-search="search"
                        clearable
                    ></el-input>
                    <span class="search-desc">学校：</span>
                    <el-select v-model="searchSchool" placeholder="选择学校" style="width: 200px" clearable filterable>
                        <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                </div>

                <div>
                    <el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save"
                        >新增</el-button
                    >
                    <importResult
                        v-if="permission.save"
                        :isShowImportBtn="true"
                        :isShowTemplateBtn="true"
                        :uploadUrl="uploadUrl"
                        :importUrl="importUrl"
                        :templateUrl="templateUrl"
                        :templateParams="templateParams"
                        :afterImportMethod="getBuildList"
                        :fileConfig="fileConfig"
                    ></importResult>
                </div>
            </div>

            <div class="data-table table-border">
                <el-table v-loading="loading" :data="tableData" style="width: 100%">
                    <el-table-column prop="code" align="center" label="教学楼编号"> </el-table-column>
                    <el-table-column prop="orgName" align="center" label="学校"> </el-table-column>
                    <el-table-column prop="name" align="center" label="教学楼"> </el-table-column>
                    <el-table-column prop="floors" align="center" label="楼层数"> </el-table-column>
                    <el-table-column prop="classrooms" align="center" label="单层教室数量"> </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li @click="add(0, scope.row)" v-if="permission.update">编辑</li>
                                <li @click="deleteData(scope.row)" style="color: #f56c6c" v-if="permission.delete">
                                    删除
                                </li>
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
            :title="addEditType == 0 ? '编辑教学楼' : '新增教学楼'"
            :close-on-click-modal="false"
            :visible.sync="addEditShow"
            :before-close="closeAddEditShow"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                <div class="dialog-item">
                    <p>编号</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addEditInfo.code"></el-input>
                </div>
                <div class="dialog-item">
                    <p>所属学校</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="addEditInfo.orgId" placeholder="请选择学校" class="width-3" filterable>
                        <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-item">
                    <p>教学楼</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addEditInfo.name"></el-input>
                </div>
                <div class="dialog-item">
                    <p>楼层数</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addEditInfo.floors"></el-input>
                </div>
                <div class="dialog-item">
                    <p>单层教室数量</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addEditInfo.classrooms"></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirm">确 定</el-button>
                    <el-button @click="closeAddEditShow">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该教学楼？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import importResult from '@/components/importResult.vue';
import {baseUrl} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            addEditType: 0,
            searchKey: '',
            tableData: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            addEditShow: false,
            deleteShow: false,
            deleteRow: '',
            errorInfo: '',
            addEditInfo: '',
            schoolList: [],
            totalS: '',
            loading: false, // 表格加载
            searchSchool: '',
            uploadUrl: baseUrl + '/sys/teachBuild/importSysTeachingBuildingManagement',
            importUrl: '/sys/teachBuild/importSysTeachingBuildingManagement',
            templateUrl: baseUrl + '/sys/teachBuild/exportSysTeachingBuildingManagementTemplate',
            templateParams: {},
            fileConfig: {
                教学楼编号: 'code',
                教学楼名称: 'name',
                楼层数: 'floors',
                单层教室数量: 'classrooms',
                学校: 'orgName',
                异常原因: 'msg',
            },
        };
    },
    components: {
        importResult,
    },
    mounted() {
        this.getBuildList();
        this.getSchoolList();
    },
    methods: {
        //获取列表
        getBuildList() {
            this.loading = true; // 表格加载
            let data = {
                type: 1,
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
                orgId: this.searchSchool,
            };
            this.$axios.get('/sys/teachBuild/list', data).then((res) => {
                this.loading = false; // 表格加载
                this.tableData = res.data.pageList;
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
            });
        },
        //获取学校列表
        getSchoolList() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
            });
        },
        // 关闭
        closeAddEditShow() {
            this.addEditShow = false;
            this.errorInfo = '';
        },
        //新增
        add(type, val) {
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.addEditInfo = {
                    orgId: val.orgId,
                    name: val.name,
                    code: val.code,
                    classrooms: val.classrooms,
                    floors: val.floors,
                    id: val.id,
                };
            } else {
                //新增
                this.addEditInfo = {
                    orgId: '',
                    name: '',
                    code: '',
                };
            }
            this.addEditShow = true;
        },
        //新增编辑确定
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            if (this.addEditType == 0) {
                //编辑
                this.$axios.post('/sys/teachBuild/update', this.addEditInfo).then((res) => {
                    if (res.code == 200) {
                        this.addEditShow = false;
                        this.errorInfo = '';
                        this.$message('修改成功', 'success');
                        this.getBuildList();
                    }
                });
            } else {
                //新增
                this.$axios.post('/sys/teachBuild/save', this.addEditInfo).then((res) => {
                    if (res.code == 200) {
                        this.addEditShow = false;
                        this.errorInfo = '';
                        this.$message('添加成功', 'success');
                        this.getBuildList();
                    }
                });
            }
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getBuildList();
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                this.$axios.post('/sys/teachBuild/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message(res.message, 'success');
                        // let page = this.pageNum; // 当前页数 1
                        // const pageSize = 10; // 每页数量 10
                        // let total = this.totalS; // 总数量 11
                        // total = total - 1; // 减去删掉的一个 10
                        // if (page * pageSize - total === pageSize) {
                        // 	// 当前页无数据，页数减1，页数最小为1
                        // 	page = page - 1 || 1
                        // 	// this.page = page
                        // 	this.pageNum = page;
                        // }
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getBuildList();
                    }
                });
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
        //分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.getBuildList();
        },
        //验证
        verify() {
            if (!this.addEditInfo.code) {
                this.errorInfo = '教学楼编号不能为空！';
                return true;
            }
            if (this.$verify.letterNum(this.addEditInfo.code, 10)) {
                this.errorInfo = '教学楼编号为大小写字母和数字组成，最长10位！';
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.orgId)) {
                this.errorInfo = '请选择学校！';
                return true;
            }
            if (!this.addEditInfo.name) {
                this.errorInfo = '教学楼名字不能为空！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 20)) {
                this.errorInfo = '教学楼名字由中文大小写字母数字组成，最长20位！';
                return true;
            }
            if (!this.addEditInfo.floors) {
                this.errorInfo = '楼层数不能为空';
                return true;
            }
            if (this.$verify.numStr(this.addEditInfo.floors, 0, 41)) {
                this.errorInfo = '楼层数必须为正整数！1-40';
                return true;
            }
            if (!this.addEditInfo.classrooms) {
                this.errorInfo = '单层教室数量不能为空';
                return true;
            }
            if (this.$verify.numStr(this.addEditInfo.classrooms, 0, 41)) {
                this.errorInfo = '单层教室数量必须为正整数！1-40';
                return true;
            }
            return false;
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.dialog-item p:first-child {
    width: 100px !important;
}
</style>
