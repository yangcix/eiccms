<template>
    <div class="content-main-wrap">
        <p class="content-title">客户端管理</p>
        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入客户端名称关键字进行查询"
                        v-search="search"
                        clearable
                    ></el-input>
                    <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                </div>

                <div>
                    <el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save"
                        >新增</el-button
                    >
                </div>
            </div>
            <div class="data-table table-border">
                <el-table :data="tableData" v-loading="loading" style="width: 100%">
                    <el-table-column prop="id" align="center" label="编号"> </el-table-column>
                    <el-table-column prop="name" align="center" label="客户端名称"> </el-table-column>
                    <el-table-column prop="macAddress" align="left" label="MAC地址"> </el-table-column>
                    <el-table-column prop="positionName" align="center" label="位置"> </el-table-column>
                    <el-table-column prop="onlineStatusName" align="center" label="状态"> </el-table-column>
                    <el-table-column align="center" width="100px" label="操作">
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

            <el-dialog
                :title="addEditType == 0 ? '编辑客户端' : '新增客户端'"
                :close-on-click-modal="false"
                :visible.sync="addEditShow"
                width="500px"
            >
                <div class="dialog-wrap">
                    <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                    <div class="dialog-item">
                        <p>客户端名称</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model.trim="addEditInfo.name"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>MAC地址</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model.trim="addEditInfo.macAddress"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>位置</p>
                        <p><em>*</em>：</p>
                        <el-select
                            v-model="addEditInfo.orgId"
                            @change="schoolChange"
                            placeholder="请选择学校"
                            class="width-2"
                            filterable
                        >
                            <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p style="margin-right: 19px"></p>
                        <el-select
                            v-model="addEditInfo.buildingId"
                            @change="buildChange"
                            placeholder="请选择教学楼"
                            style="margin-right: 10px; width: 150px"
                            filterable
                        >
                            <el-option v-for="item in buildList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            v-model="addEditInfo.classroomId"
                            placeholder="请选择教室"
                            style="width: 120px"
                            filterable
                        >
                            <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <p class="notice">注：MAC地址6个字节之间用符号“-”隔开。例如：00-1A-2B-3C-4D-5E</p>
                </div>

                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirms">确 定</el-button>
                    <el-button @click="handleAddEditShow">取 消</el-button>
                </div>
            </el-dialog>

            <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">您确定删除该客户端数据？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="deleteData()">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {creatTree, throttle} from '@/assets/js/utils';

export default {
    name: '',
    data() {
        this.addEditConfirms = throttle(this.addEditConfirm, 500);
        return {
            searchKey: '',
            searchStatus: '',
            tableData: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            addEditShow: false,
            addEditType: 0,
            addEditInfo: {classroomId: '', buildingId: ''},
            errorInfo: '',
            schoolList: [],
            buildList: [],
            classroomList: [],
            deleteShow: false,
            deleteRow: '',
            currentIndex: 0,
            totalS: '',
            loading: false, // 表格加载
            ruleList: [], // 所有规则
        };
    },
    components: {},
    mounted() {
        this.getClientList();
    },
    methods: {
        //获取设备
        async getClientList() {
            // type: localStorage.getItem('sysModule') == 1 ? 0 : -1,
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
            };
            this.loading = true;
            const listResp = await this.$axios.get('/sys/clientManagement/list', data);
            if (listResp.code === 200) {
                this.tableData = listResp.data.pageList;
                this.permission = this.creatPermit(listResp.data.permit);
                this.pages = listResp.data.pages;
                this.totalS = listResp.data.total;
                this.loading = false;
            }
        },
        //获取学校列表 type 0编辑 1新增
        getSchoolList(type) {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
                if (type === 1) {
                    if (this.schoolList.length > 0) {
                        this.addEditInfo.orgId = this.schoolList[0].orgId ? this.schoolList[0].orgId : '';
                        if (this.addEditInfo.orgId) {
                            this.getTeachBuildList(this.addEditInfo.orgId);
                        }
                    }
                }
            });
        },
        //选择学校后 教学楼、教室修改
        schoolChange(id) {
            this.buildList = [];
            this.addEditInfo.buildingId = '';
            this.addEditInfo.classroomId = '';
            this.classroomList = [];
            this.getTeachBuildList(id);
        },
        //根据学校id获取教学楼列表
        getTeachBuildList(orgId) {
            this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then((res) => {
                this.buildList = res.data;
            });
        },
        //根据教学楼id获取教室列表
        getClassroomList(buildingId) {
            this.$axios.get('/sys/classroom/getClassroomList', {buildingId: buildingId}).then((res) => {
                this.classroomList = res.data;
            });
        },
        //教学楼改变后教室修改
        buildChange(id) {
            this.addEditInfo.classroomId = '';
            this.classroomList = [];
            this.getClassroomList(id);
        },
        //新增 编辑
        add(type, val) {
            this.errorInfo = '';
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.getSchoolList(0);
                this.getTeachBuildList(val.orgId);
                this.getClassroomList(val.buildingId);
                this.addEditInfo = {
                    name: val.name,
                    orgId: val.orgId,
                    buildingId: val.buildingId,
                    classroomId: val.classroomId,
                    id: val.id,
                    macAddress: val.macAddress,
                };
            } else {
                this.addEditInfo = {
                    name: '',
                    orgId: '',
                    buildingId: '',
                    classroomId: '',
                    macAddress: '',
                    id: '',
                };
                this.classroomList = [];
                this.buildList = [];
                this.getSchoolList(1);
            }
            this.addEditShow = true;
        },
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            let url = '/sys/clientManagement/save';
            if (this.addEditType == 0) {
                //0编辑
                url = '/sys/clientManagement/update';
            }
            this.$axios.post(url, this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.addEditShow = false;
                    this.$message(res.message, 'success');
                    this.getClientList();
                    this.buildList = []; // 清空教学楼数据
                    this.classroomList = []; // 清空教室数据
                }
            });
        },
        handleAddEditShow() {
            this.addEditShow = false;
            this.classroomList = [];
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                this.$axios.post('/sys/clientManagement/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getClientList();
                    }
                });
            }
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getClientList();
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
            this.tableData = [];
            this.currentIndex = 0;
            this.pageNum = val;
            this.getClientList();
        },
        //验证
        verify() {
            if (this.$verify.isEmpty(this.addEditInfo.name)) {
                this.errorInfo = '设备名称不能为空';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 20)) {
                this.errorInfo = '设备名称由中文大小写字母数字组成，最长20位！';
                return true;
            }
            if (!this.addEditInfo.macAddress) {
                this.errorInfo = 'MAC格式不能为空！';
                return true;
            }
            if (this.$verify.checkMac(this.addEditInfo.macAddress)) {
                this.errorInfo = 'MAC格式不正确！';
                return true;
            }
            if (
                this.$verify.isEmpty(this.addEditInfo.orgId) ||
                this.$verify.isEmpty(this.addEditInfo.buildingId) ||
                this.$verify.isEmpty(this.addEditInfo.classroomId)
            ) {
                this.errorInfo = '请选择具体位置！';
                return true;
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.dialog-item p:first-child {
    width: 90px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
}
</style>
