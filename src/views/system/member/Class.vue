<template>
    <div class="content-main-wrap">
        <p class="content-title">班级管理</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入班级名称关键字进行查询"
                        v-search="search"
                        clearable
                    ></el-input>
                    <span class="search-desc">学校：</span>
                    <el-select v-model="searchSchool" placeholder="选择学校" style="width: 200px" clearable>
                        <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc">状态：</span>
                    <el-select v-model="searchStatus" placeholder="请选择" class="width-1">
                        <el-option
                            v-for="item in searchStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                </div>

                <div>
                    <el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save"
                        >新增</el-button
                    >
                    <importResult
                        :isShowImportBtn="true"
                        :isShowTemplateBtn="true"
                        :uploadUrl="uploadUrl"
                        :importUrl="importUrl"
                        :templateUrl="templateUrl"
                        :templateParams="templateParams"
                        :afterImportMethod="getClassList"
                        :fileConfig="fileConfig"
                    ></importResult>
                </div>
            </div>
            <div class="data-table table-border">
                <el-table v-loading="loading" :data="tableData" style="width: 100%">
                    <el-table-column prop="code" align="center" :show-overflow-tooltip="true" label="编号">
                    </el-table-column>
                    <el-table-column prop="name" align="center" :show-overflow-tooltip="true" label="班级">
                    </el-table-column>
                    <el-table-column prop="gradeName" align="center" :show-overflow-tooltip="true" label="年级">
                    </el-table-column>
                    <el-table-column prop="orgName" align="center" :show-overflow-tooltip="true" label="所属学校">
                    </el-table-column>
                    <el-table-column prop="classroomName" align="center" :show-overflow-tooltip="true" label="教室">
                        <template slot-scope="scope">
                            {{ scope.row.buildingName }}{{ scope.row.classroomName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="principalNames" align="center" :show-overflow-tooltip="true" label="负责人">
                        <!-- <template slot-scope="scope">
							<span v-for="val in scope.row.principalNames" :key="val">{{val}}    </span>
							<ul class="principal-list">
								<li>{{ scope.row.principalNames.join(',') }}</li>
							</ul>
						</template> -->
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.status | useStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" align="center" label="创建时间"> </el-table-column>
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
        </div>

        <el-dialog
            :title="addEditType == 0 ? '编辑班级' : '新增班级'"
            :close-on-click-modal="false"
            :visible.sync="addEditShow"
            :before-close="clearaddEdit"
            width="485px"
        >
            <div class="dialog-wrap">
                <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                <div class="dialog-item">
                    <p>学校年级</p>
                    <p><em>*</em>：</p>
                    <el-select
                        v-model="addEditInfo.orgId"
                        @change="shcoolChange"
                        placeholder="请选择学校"
                        class="width-6"
                        style="margin-right: 10px"
                        filterable
                    >
                        <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="addEditInfo.gradeId" placeholder="请选择年级" class="width-7" filterable>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div class="dialog-item">
                    <p>班级编号</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-5" v-model="addEditInfo.code"></el-input>
                </div>
                <div class="dialog-item">
                    <p>班级名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-5" v-model="addEditInfo.name"></el-input>
                </div>

                <div class="dialog-item">
                    <p>教室</p>
                    <p><em>*</em>：</p>
                    <el-select
                        v-model="addEditInfo.buildingId"
                        @change="buildChange"
                        placeholder="请选择教学楼"
                        class="width-6"
                        style="margin-right: 10px"
                        filterable
                    >
                        <el-option v-for="item in buildlList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="addEditInfo.classroomId" placeholder="请选择教室" class="width-7" filterable>
                        <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div class="dialog-item">
                    <p>负责人</p>
                    <p><em>*</em>：</p>
                    <el-cascader
                        v-model="addEditInfo.principalIdList"
                        :show-all-levels="false"
                        class="width-5"
                        :options="chargeList"
                        :props="props"
                        @change="principalChange"
                        placeholder="请选择负责人"
                        clearable
                        filterable
                    >
                    </el-cascader>
                </div>

                <div class="dialog-item">
                    <p>状态</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="addEditInfo.status" placeholder="请选择" class="width-5">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirm">确 定</el-button>
                    <el-button @click="clearaddEdit">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该班级？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="updateConfirmShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您修改的信息将影响其他信息的状态，确认修改？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="updateConfirm">确 定</el-button>
                    <el-button @click="updateConfirmShow = false">取 消</el-button>
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
            searchKey: '',
            searchStatus: '',
            tableData: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            originStatus: 1,
            typeList: [],
            chargeList: [],
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            searchStatusList: [
                {value: '', label: '全部'},
                {value: 0, label: '禁用'},
                {value: 1, label: '启用'},
            ],
            statusList: [
                {value: 0, label: '禁用'},
                {value: 1, label: '启用'},
            ],
            addEditShow: false,
            updateConfirmShow: false,
            deleteShow: false,
            deleteRow: '',
            addEditType: 0,
            errorInfo: '',
            addEditInfo: {},
            schoolList: [],
            gradeList: [],
            buildlList: [],
            classroomList: [],
            totalS: '',
            loading: false, // 表格加载
            searchSchool: '',
            uploadUrl: baseUrl + '/sm/class/importClass',
            importUrl: '/sm/class/importClass',
            templateUrl: baseUrl + '/sm/class/exportClassTemplate',
            templateParams: {},
            fileConfig: {
                班级编号: 'code',
                班级名称: 'name',
                年级: 'grade',
                学校: 'orgName',
                教学楼: 'teachingBuilding',
                教室: 'classroom',
                负责人: 'principalName',
                状态: 'status',
                异常原因: 'msg',
            },
        };
    },
    components: {
        importResult,
    },
    mounted() {
        this.getClassList();
        this.getSchoolList();
    },
    methods: {
        //获取班级
        getClassList() {
            this.loading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
                status: this.searchStatus,
                orgId: this.searchSchool,
            };
            this.$axios.get('/sm/class/list', data).then((res) => {
                this.loading = false; // 表格加载
                this.tableData = res.data.pageList;
                this.tableData.forEach((el) => {
                    el.principalNames = el.principalNames.toString();
                });
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
        //根据学校id获取年级列表
        getGradeList(orgId) {
            this.$axios.get('/sm/grade/listGradeByOrg', {orgId: orgId}).then((res) => {
                this.gradeList = res.data;
            });
        },
        //根据学校id获取教学楼列表
        getTeachBuildList(orgId) {
            this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then((res) => {
                this.buildlList = res.data;
            });
        },
        //根据教学楼id获取教室列表
        getClassroomList(buildingId, classroomId) {
            this.$axios
                .get('/sys/classroom/getUnSelectedClassroomList', {buildingId: buildingId, classroomId: classroomId})
                .then((res) => {
                    this.classroomList = res.data;
                });
        },
        //新增 编辑
        add(type, val) {
            this.getSchoolList();
            this.errorInfo = '';
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.getGradeList(val.orgId);
                this.getTeachBuildList(val.orgId);
                this.getChargeList(val.orgId);
                this.getClassroomList(val.buildingId, val.classroomId);
                this.addEditInfo = {
                    classroomId: val.classroomId,
                    code: val.code,
                    gradeId: val.gradeId,
                    buildingId: val.buildingId,
                    id: val.id,
                    name: val.name,
                    orgId: val.orgId,
                    principalIdList: val.principalIdList,
                    status: val.status,
                };
                this.originStatus = val.status;
            } else {
                //新增
                let orgId = this.schoolList.length >= 1 ? this.schoolList[0].id : '';
                this.addEditInfo = {
                    classroomId: '',
                    code: '',
                    gradeId: '',
                    name: '',
                    orgId: '',
                    principalIdList: [],
                    status: 1,
                };
            }
            this.addEditShow = true;
        },
        //选择学校后年级、教学楼、负责人修改
        shcoolChange(id) {
            this.getGradeList(id);
            this.getTeachBuildList(id);
            this.getChargeList(id);
            this.addEditInfo.gradeId = '';
            this.addEditInfo.buildingId = '';
            this.addEditInfo.classroomId = '';
            this.classroomList = [];
            this.addEditInfo.principalIdList = [];
        },
        //教学楼改变后教室修改
        buildChange(id) {
            this.getClassroomList(id);
            this.addEditInfo.classroomId = '';
        },
        //获取负责人列表
        getChargeList(id) {
            this.$axios.get('/sys/org/listPrincipalForTree', {orgId: id}).then((res) => {
                this.chargeList = res.data;
            });
        },
        clearaddEdit() {
            this.gradeList = [];
            this.classroomList = [];
            this.buildlList = [];
            this.addEditShow = false;
        },
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            if (this.addEditType == 0) {
                //0编辑
                if (this.addEditInfo.status == this.originStatus) {
                    this.addEditInfo.statusUpdate = 0;
                    this.updateConfirm();
                } else {
                    //状态有修改
                    this.addEditShow = false;
                    this.updateConfirmShow = true;
                    this.addEditInfo.statusUpdate = 1;
                }
            } else {
                //1新增
                this.$axios.post('/sm/class/save', this.addEditInfo).then((res) => {
                    if (res.code == 200) {
                        this.addEditShow = false;
                        this.gradeList = [];
                        this.classroomList = [];
                        this.buildlList = [];
                        this.$message(res.message, 'success');
                        this.getClassList();
                    }
                });
            }
        },
        //确定修改
        updateConfirm() {
            this.$axios.post('/sm/class/update', this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.addEditShow = false;
                    this.gradeList = [];
                    this.classroomList = [];
                    this.buildlList = [];
                    this.updateConfirmShow = false;
                    this.$message(res.message, 'success');
                    this.getClassList();
                }
            });
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                this.$axios.post('/sm/class/delete', {id: this.deleteRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getClassList();
                    }
                });
            }
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getClassList();
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
            this.getClassList();
        },
        //验证
        verify() {
            if (this.$verify.isEmpty(this.addEditInfo.orgId, 10)) {
                this.errorInfo = '请选择学校！';
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.gradeId)) {
                this.errorInfo = '请选择年级！';
                return true;
            }
            if (!this.addEditInfo.code) {
                this.errorInfo = '班级编号不能为空！';
                return true;
            }
            if (this.$verify.letterNum(this.addEditInfo.code, 20)) {
                this.errorInfo = '班级编号为大小写字母和数字组成，最长20位！';
                return true;
            }
            if (!this.addEditInfo.name) {
                this.errorInfo = '班级名称不能为空！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 20)) {
                this.errorInfo = '班级名称由中文大小写字母数字组成，最长20位！';
                return true;
            }
            // if(this.$verify.isEmpty(this.addEditInfo.buildingId)){
            // 	this.errorInfo = '请选择教学楼！';
            // 	return true;
            // }
            // if(this.$verify.isEmpty(this.addEditInfo.classroomId)){
            // 	this.errorInfo = '请选择教室！';
            // 	return true;
            // }
            if (!this.addEditInfo.buildingId) {
                this.errorInfo = '请选择教学楼！';
                return true;
            }
            if (!this.addEditInfo.classroomId) {
                this.errorInfo = '请选择教室！';
                return true;
            }
            if (this.addEditInfo.principalIdList <= 0) {
                this.errorInfo = '请选择负责人';
                return true;
            }
            if (this.addEditInfo.principalIdList.length > 3) {
                this.errorInfo = '最多选择三个负责人';
                return true;
            }
            return false;
        },
        //负责人最多三个
        principalChange() {
            if (this.addEditInfo.principalIdList.length > 3) {
                // this.addEditInfo.principalIdList = this.addEditInfo.principalIdList.splice(0, 3);
                this.$message('最多选择三个负责人', 'error');
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.principal-list {
    white-space: nowrap;
}
</style>
