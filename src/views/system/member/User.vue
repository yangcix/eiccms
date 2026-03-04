<template>
    <div class="content-main-wrap">
        <p class="content-title">用户管理</p>

        <div class="main-wrap current-wrap">
            <div class="user-menu">
                <el-menu class="el-menu-demo" mode="horizontal" :default-active="activeIndex" @select="menuSelect">
                    <el-menu-item v-for="(val, index) in userList" :index="index + ''" :key="index">{{
                        val.name
                    }}</el-menu-item>
                </el-menu>

                <div class="tree-list">
                    <el-tree :data="treeList" :props="menuProps" @node-click="menuTreeChange">
                        <!-- <el-tooltip class="item" effect="dark" :content="node.label" placement="top" slot-scope="{ node, data }">
							<span class="span-ellipsis">{{ node.label }}</span>
    				</el-tooltip> -->
                        <template slot-scope="{node, data}">
                            <span :title="node.label" class="span-ellipsis">{{ node.label }}</span>
                        </template>
                    </el-tree>
                </div>
            </div>

            <div class="data-wrap">
                <div class="search-operat" style="min-width: 900px; max-height: 40px">
                    <div>
                        <el-input
                            v-model="searchKey"
                            placeholder="请输入姓名或学号/编号"
                            v-search="search"
                            clearable
                            style="width: 180px"
                        ></el-input>
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
                        <el-button
                            class="width-1"
                            icon="el-icon-delete"
                            @click="mutipleDelete"
                            v-if="permission.mutipleDelete"
                            >删除</el-button
                        >
                        <el-upload
                            v-if="permission.importUserInfo"
                            class="upload-demo upload-btn"
                            :action="uploadUrl"
                            accept=".xls,.xlsx"
                            :before-upload="selectFile"
                            :show-file-list="false"
                            :http-request="httpRequest"
                        >
                            <el-button class="width-1" icon="el-icon-upload2" v-if="permission.importUserInfo"
                                >导入</el-button
                            >
                        </el-upload>
                        <el-button class="width-1" icon="el-icon-download" @click="downLoad" v-if="permission.getExcel"
                            >模板</el-button
                        >
                        <el-button class="width-1" @click="showSyncTeacherDialog">同步教师</el-button>
                    </div>
                </div>

                <div class="data-table table-border" v-show="activeIndex == 0">
                    <el-table
                        v-loading="tloading"
                        ref="studentMultipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column align="center" type="selection" width="48"> </el-table-column>
                        <el-table-column prop="code" align="center" label="学号"> </el-table-column>
                        <el-table-column prop="nickName" align="center" label="学生姓名"> </el-table-column>
                        <el-table-column prop="account" align="center" label="账号"> </el-table-column>
                        <el-table-column prop="className" align="center" label="班级"> </el-table-column>
                        <el-table-column align="center" label="状态">
                            <template slot-scope="scope">
                                {{ scope.row.status | useStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" align="center" min-width="110" label="创建时间">
                        </el-table-column>
                        <el-table-column align="center" width="160px" label="操作">
                            <template slot-scope="scope">
                                <ul class="operat-list">
                                    <li @click="add(0, scope.row)" v-if="permission.update">编辑</li>
                                    <li @click="resetPwd(scope.row)" v-if="permission.reset">重置密码</li>
                                    <!-- <li @click="roleEdit(scope.row)" v-if="permission.updateUserRole">角色分配</li> -->
                                    <li @click="deleteData(scope.row)" style="color: #f56c6c" v-if="permission.delete">
                                        删除
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="data-table table-border" v-show="activeIndex != 0">
                    <el-table
                        v-loading="tloading"
                        ref="otherMultipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column align="center" type="selection" width="48"> </el-table-column>
                        <el-table-column prop="code" align="center" :show-overflow-tooltip="true" label="编号">
                        </el-table-column>
                        <el-table-column prop="nickName" align="center" :show-overflow-tooltip="true" label="姓名">
                        </el-table-column>
                        <el-table-column prop="account" align="center" :show-overflow-tooltip="true" label="账号">
                        </el-table-column>
                        <el-table-column prop="deptName" align="center" :show-overflow-tooltip="true" label="部门">
                        </el-table-column>
                        <el-table-column
                            v-if="activeIndex == 1"
                            prop="subjectName"
                            align="center"
                            :show-overflow-tooltip="true"
                            label="科目"
                        >
                        </el-table-column>
                        <el-table-column align="center" label="状态">
                            <template slot-scope="scope">
                                {{ scope.row.status | useStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" align="center" min-width="110" label="创建时间">
                        </el-table-column>
                        <el-table-column align="center" width="220px" label="操作">
                            <template slot-scope="scope">
                                <ul class="operat-list">
                                    <li @click="add(0, scope.row)" v-if="permission.update">编辑</li>
                                    <li @click="resetPwd(scope.row)" v-if="permission.reset">重置密码</li>
                                    <li @click="roleEdit(scope.row)" v-if="permission.updateUserRole">角色分配</li>
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
                        :current-page="pageNum"
                        :page-count="pages"
                    >
                    </el-pagination>
                </div>
            </div>

            <el-dialog
                :title="addEditType == 0 ? '编辑学生' : '新增学生'"
                :close-on-click-modal="false"
                :visible.sync="addEditShow"
                width="420px"
            >
                <div class="dialog-wrap">
                    <p class="err-title" v-show="errorInfo">提示：{{ errorInfo }}</p>
                    <div class="dialog-item">
                        <p>学号</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.code"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>账号</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.account"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>姓名</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.nickName"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>类型</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" :disabled="true" v-model="roleType"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>班级</p>
                        <p><em>*</em>：</p>
                        <el-cascader
                            v-model="addEditInfo.classId"
                            :show-all-levels="false"
                            style="width: 270px"
                            :options="selectStudentTree"
                            placeholder="请选择班级"
                            :props="props"
                        >
                        </el-cascader>
                    </div>
                    <div class="dialog-item">
                        <p>状态</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="addEditInfo.status" placeholder="请选择" class="width-2">
                            <el-option
                                v-for="item in statusList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <p class="notice">注：密码默认与学号一致，添加后请及时提醒用户修改密码！</p>
                    <div class="dialog-btn">
                        <el-button v-preventReClick="1000" type="primary" @click="addEditConfirm">确 定</el-button>
                        <el-button @click="addEditShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                :destroy-on-close="true"
                :title="otherNotice"
                :close-on-click-modal="false"
                :visible.sync="otherAddEditShow"
                style="margin-top: -13vh"
                @close="fileLists = []"
                width="420px"
            >
                <div class="dialog-wrap">
                    <p class="err-title" v-show="errorInfo">提示：{{ errorInfo }}</p>
                    <div class="dialog-item">
                        <p>编号</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.code"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>账号</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.account"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>姓名</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.nickName"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>类型</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" :disabled="true" v-model="roleType"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>部门</p>
                        <p><em>*</em>：</p>
                        <el-cascader
                            v-model="addEditInfo.deptId"
                            :show-all-levels="false"
                            style="width: 270px"
                            :options="selectDepartmentTree"
                            placeholder="请选择部门"
                            :props="otherProps"
                            clearable
                        >
                        </el-cascader>
                    </div>
                    <div v-if="activeIndex == 1" class="dialog-item">
                        <p>科目</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="addEditInfo.subject" placeholder="请选择" class="width-2">
                            <el-option
                                v-for="item in subjectList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="activeIndex == 1" class="dialog-item">
                        <p>名师</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="addEditInfo.famous" placeholder="请选择" class="width-2">
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>状态</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="addEditInfo.status" placeholder="请选择" class="width-2">
                            <el-option
                                v-for="item in statusList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="activeIndex == 1" class="dialog-item">
                        <p>照片</p>
                        <p><em style="opacity: 0">*</em>：</p>
                        <div class="upload-wrap">
                            <el-upload
                                :limit="1"
                                :on-exceed="handleOnExceed"
                                class="upload-demo"
                                :action="uploadImg"
                                accept=".png,.jpg"
                                :file-list="fileLists"
                                :on-change="selectFiles"
                                :on-remove="removeFile"
                                list-type="picture"
                                :auto-upload="false"
                                drag
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将图片拖到此处，或<em style="color: #409eff">点击上传</em>
                                </div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </div>
                    </div>
                    <p class="notice">注：密码默认与编号一致，添加后请及时提醒用户修改密码！</p>
                    <div class="dialog-btn">
                        <el-button v-preventReClick="1000" type="primary" @click="otherDddEditConfirm">确 定</el-button>
                        <el-button
                            @click="
                                otherAddEditShow = false;
                                fileLists = [];
                            "
                            >取 消</el-button
                        >
                    </div>
                </div>
            </el-dialog>

            <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">{{ deleteRow.length > 1 ? '您确定删除所选用户？' : '您确定删除该用户？' }}</p>
                    <div class="dialog-btn">
                        <el-button v-preventReClick="1000" type="primary" @click="deleteData()">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="resetShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">确认重置密码？(新密码：123456)</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="resetPwd()">确 定</el-button>
                        <el-button @click="resetShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog title="角色分配" :close-on-click-modal="false" :visible.sync="roleEditShow" width="420px">
                <div class="dialog-wrap">
                    <div class="dialog-item">
                        <p>账号</p>
                        <p><em>*</em>：</p>
                        <p>{{ roleEditInfo.account }}</p>
                    </div>
                    <div class="dialog-item">
                        <p>角色</p>
                        <p><em>*</em>：</p>
                        <el-select multiple v-model="roleEditInfo.roleIdList" placeholder="请选择" class="width-2">
                            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-btn">
                        <el-button v-preventReClick="1000" type="primary" @click="roleEditConfirm">确 定</el-button>
                        <el-button @click="roleEditShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="uploadSuccessShow" width="420px">
                <div class="dialog-wrap">
                    <p class="success-icon"><i class="el-icon-circle-check"></i></p>
                    <p class="success-title">共{{ failSize + successSize }}条合法数据！</p>
                </div>
            </el-dialog>

            <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="uploadErrorShow" width="420px">
                <div class="dialog-wrap">
                    <p class="success-icon"><i class="el-icon-warning-outline err-icon"></i></p>
                    <p class="success-title">
                        共{{ failSize + successSize }}条数据，上传成功{{ successSize }}条，异常数据{{ failSize }}条！
                    </p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="downError">下载异常数据</el-button>
                        <el-button @click="uploadErrorShow = false">取消</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="学生模板导出"
                :close-on-click-modal="false"
                :visible.sync="studentDownloadShow"
                width="420px"
            >
                <div class="dialog-wrap">
                    <p class="err-title" v-show="errorInfo">提示：{{ errorInfo }}</p>
                    <div class="dialog-item">
                        <p>班级</p>
                        <p><em>*</em>：</p>
                        <el-cascader
                            v-model="downloadInfo"
                            :show-all-levels="false"
                            style="width: 270px"
                            :options="selectStudentTree"
                            placeholder="请选择班级"
                            :props="props"
                        >
                        </el-cascader>
                    </div>
                    <p class="notice">注：学生模板按班级为单位，下载模板名字请勿修改！</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="downConfirm">确 定</el-button>
                        <el-button @click="studentDownloadShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                :title="activeIndex == 1 ? '教师模板导出' : '其他模板导出'"
                :close-on-click-modal="false"
                :visible.sync="teacherDownloadShow"
                width="420px"
            >
                <div class="dialog-wrap">
                    <p class="err-title" v-show="errorInfo">提示：{{ errorInfo }}</p>
                    <div class="dialog-item">
                        <p>学校</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="downloadInfo" placeholder="请选择学校" class="width-3" filterable>
                            <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <p class="notice">注：教师模板按学校为单位，下载模板名字请勿修改！</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="downConfirm">确 定</el-button>
                        <el-button @click="teacherDownloadShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                title="同步教师"
                :close-on-click-modal="false"
                :visible.sync="isShowSyncTeacherDialog"
                width="550px"
            >
                <div class="dialog-content">
                    <div class="dialog-item">
                        <p>所属机构</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="teacherInfo.orgType" placeholder="请选择所属机构" class="width-5">
                            <el-option
                                v-for="item in orgOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>教师姓名</p>
                        <p><em>*</em>：</p>
                        <el-input
                            class="width-5"
                            v-model="teacherInfo.teacherName"
                            placeholder="请输入教师姓名"
                        ></el-input>
                    </div>
                    <div class="dialog-btn">
                        <el-button
                            @click="
                                isShowSyncTeacherDialog = false;
                                teacherName = '';
                            "
                            >取 消</el-button
                        >
                        <el-button type="primary" @click="syncTeacher">确 定</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {baseUrl, cookie, creatTree} from '../../../assets/js/utils';
import axios from 'axios';
import MD5 from 'js-md5';
export default {
    name: '',
    data() {
        return {
            classId: '',
            uploadImg: baseUrl + '/sm/label/save',
            uploadUrl: baseUrl + '/sys/user/importUserInfo',
            loading: '',
            searchKey: '',
            searchStatus: '',
            activeIndex: '0',
            subjectList: [],
            addEditShow: false,
            otherAddEditShow: false,
            errorInfo: '',
            deleteShow: false,
            deleteRow: '',
            deleteList: '',
            resetShow: false,
            resetRow: '',
            roleEditShow: false,
            uploadSuccessShow: false,
            uploadErrorShow: false,
            addEditStatus: '全部',
            fileList: [],
            userList: [
                {name: '学生', value: 0},
                {name: '教师', value: 1},
                {name: '其他', value: 2},
            ],
            searchStatusList: [
                {value: '', label: '全部'},
                {value: 0, label: '禁用'},
                {value: 1, label: '启用'},
            ],
            statusList: [
                {value: 0, label: '禁用'},
                {value: 1, label: '启用'},
            ],
            tableData: [],
            fileLists: [],
            schoolList: [],
            treeList: [], //展示的树(菜单)
            studentTree: [], //学生树(菜单)
            departmentTree: [], //教师、其他树(菜单)
            originStudentTree: [], //学生原始数据(新增、编辑)
            selectStudentTree: [], //学生树数据(新增、编辑)
            originDepartmentTree: [], //教师、其他原始数据(新增、编辑)
            selectDepartmentTree: [], //教师、其他树数据(新增、编辑)
            menuProps: {label: 'name'},
            pageNum: 1,
            orgType: '', //查询类型1教育局;2学校;3部门;4年级；5班级；6用户
            queryId: '', //查询id学生tid 部门其他id
            addEditInfo: {},
            addEditType: 0,
            pages: 0,
            permission: '',
            props: {label: 'name', value: 'id', emitPath: false},
            otherProps: {label: 'name', value: 'id', emitPath: false, checkStrictly: true},
            roleList: '',
            roleEditInfo: '',
            studentDownloadShow: false,
            teacherDownloadShow: false,
            downloadInfo: '',
            failSize: 0,
            successSize: 0,
            downErrorInfo: {},
            roleType: '学生',
            totalS: '',
            tloading: false, // 表格加载
            userId: JSON.parse(localStorage.getItem('userInfo')).userId, //当前用户id
            isShowSyncTeacherDialog: false,
            teacherName: '',
            orgOptions: [],
            teacherInfo: {},
        };
    },
    components: {},
    mounted() {
        this.getStudentTree();
        this.getDepartmentList();
        this.getTableData();
        this.getSchoolList();
        this.getSubject();
    },
    methods: {
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        //上传的封面
        selectFiles(file) {
            // console.log(file,'fff')
            let isJpg;
            if (file.raw.type == 'image/jpeg' || file.raw.type == 'image/png' || file.raw.type == 'image/jpg') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                this.fileLists = [];
                return this.$message('上传失败，文件格式错误', 'error');
            }
            if (file.raw.size / 1024 > 500) {
                this.fileLists = [];
                return this.$message('照片只能上传jpg/png文件，且不超过500kb', 'error');
            } else {
                this.addEditInfo.file = file.raw;
            }
        },
        // 移除封面
        removeFile(file) {
            this.addEditInfo.file = null;
        },
        //获取科目列表
        getSubject() {
            this.$axios.get('/sys/user/subject').then((res) => {
                this.subjectList = res.data;
            });
        },
        //获取全部学生树
        getStudentTree() {
            this.$axios.get('/sys/org/listClass', {isAll: 1}).then((res) => {
                this.studentTree = creatTree(res.data);
                this.treeList = this.studentTree;
            });
        },
        //获取全部部门树（教室、其他）
        getDepartmentList() {
            this.$axios.get('/sys/org/listDepartment', {isAll: 1}).then((res) => {
                this.departmentTree = creatTree(res.data);
            });
        },
        //获取有效学生树（无禁用）
        getSelectStudentTree() {
            this.$axios.get('/sys/org/listClass').then((res) => {
                this.originStudentTree = JSON.parse(JSON.stringify(res.data));
                this.selectStudentTree = creatTree(res.data);
            });
        },
        //获取有效部门树（教室、其他）（无禁用）
        getSelectDepartmentList() {
            this.$axios.get('/sys/org/listDepartment').then((res) => {
                this.originDepartmentTree = JSON.parse(JSON.stringify(res.data));
                this.selectDepartmentTree = creatTree(res.data);
            });
        },
        //菜单点击改变树
        menuSelect(index) {
            this.searchStatus = '';
            this.searchKey = '';
            console.log(index, 'xuanz');
            this.pageNum = 1;
            this.treeList = index == 0 ? this.studentTree : this.departmentTree;
            this.activeIndex = index;
            this.roleType = this.userList[this.activeIndex].name;
            this.queryId = '';
            this.orgType = '';
            this.getTableData();
        },
        //树节点点击
        menuTreeChange(val) {
            this.pageNum = 1;
            this.queryId = this.activeIndex == 0 ? val.tid : val.id;
            this.orgType = val.orgType;
            this.getTableData();
        },
        //获取表格数据
        getTableData() {
            this.tloading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
                status: this.searchStatus,
                orgType: this.orgType,
                type: this.activeIndex,
                id: this.queryId,
            };
            this.$axios.get('/sys/user/list', data).then((res) => {
                this.tloading = false; // 表格加载
                this.tableData = res.data.pageList;
                if (this.activeIndex == 1) {
                    this.subjectList.forEach((el) => {
                        this.tableData.forEach((ele) => {
                            if (ele.subject == el.code) {
                                ele.subjectName = el.name;
                            }
                        });
                    });
                }
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
            });
        },
        //获取角色列表
        getRoleList(userId) {
            this.$axios.get('/sys/role/listRole', {userId: userId}).then((res) => {
                this.roleList = res.data;
            });
        },
        getSchoolList() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
            });
        },
        //修改角色
        roleEditConfirm() {
            if (this.roleEditInfo.roleIdList.length == 0) {
                this.$message('角色分配必选', 'error');
                return;
            }
            let data = {
                account: this.roleEditInfo.account,
                id: this.roleEditInfo.id,
                roleIdList: this.roleEditInfo.roleIdList,
                roleType: this.activeIndex,
            };
            this.$axios.post('/sys/user/updateUserRole', data).then((res) => {
                if (res.code == 200) {
                    this.roleEditShow = false;
                    this.$message(res.message, 'success');
                    this.getTableData();
                    if (this.userId == this.roleEditInfo.id) {
                        //更新左侧树结构
                        this.$axios.get('/sys/org/listClass', {isAll: 1}).then((res) => {
                            this.studentTree = creatTree(res.data);
                        });
                        this.$axios.get('/sys/org/listDepartment', {isAll: 1}).then((res) => {
                            this.departmentTree = creatTree(res.data);
                            this.treeList = this.departmentTree;
                        });
                    }
                }
            });
        },
        //多选
        handleSelectionChange(val) {
            this.deleteList = [];
            val.forEach((val) => {
                this.deleteList.push(val.id);
            });
        },
        //新增
        add(type, val) {
            this.errorInfo = '';
            if (this.activeIndex == 0) {
                //学生
                console.log('学生 type=0');
                this.getSelectStudentTree();
                this.studentAddEdit(type, val);
            } else {
                this.getSelectDepartmentList();
                this.otherAddEdit(type, val);
            }
        },
        //学生新增编辑
        studentAddEdit(type, val) {
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.addEditInfo = {
                    code: val.code,
                    account: val.account,
                    nickName: val.nickName,
                    status: val.status,
                    classId: val.orgId + '_' + val.classId,
                    id: val.id,
                    roleType: this.activeIndex,
                };
                this.classId = val.classId;
                // if (this.selectStudentTree.length === 0) {
                // 	this.addEditInfo.classId = "";
                // }
            } else {
                //新增
                this.addEditInfo = {
                    code: '',
                    account: '',
                    nickName: '',
                    status: 1,
                    classId: '',
                    roleType: this.activeIndex,
                };
                this.classId = '';
            }
            this.addEditShow = true;
        },
        //学生新增编辑确定
        addEditConfirm() {
            this.errorInfo = '';
            let flag = false;
            this.originStudentTree.forEach((val) => {
                if (this.addEditInfo.classId == val.id && !flag) {
                    this.classId = val.tid;
                    this.addEditInfo.orgId = val.orgId;
                    flag = true;
                }
            });
            if (this.verify()) {
                return;
            }
            this.addEditInfo.password = MD5(this.addEditInfo.code);
            // let flag = false;
            // this.originStudentTree.forEach(val => {
            // 	if(this.addEditInfo.classId == val.id && !flag){
            // 		this.addEditInfo.classId = val.tid;
            // 		this.addEditInfo.orgId = val.orgId;
            // 		flag = true;
            // 	}
            // });
            let data = new FormData();
            if (this.addEditInfo.id) {
                data.append('id', this.addEditInfo.id);
            }
            data.append('account', this.addEditInfo.account);
            data.append('classId', this.classId);
            data.append('code', this.addEditInfo.code);
            data.append('nickName', this.addEditInfo.nickName);
            data.append('orgId', this.addEditInfo.orgId);
            data.append('password', this.addEditInfo.password);
            data.append('roleType', this.addEditInfo.roleType);
            data.append('status', this.addEditInfo.status);
            let addEditInfo = JSON.parse(JSON.stringify(this.addEditInfo));
            addEditInfo.classId = this.classId;
            let url = this.addEditType == 0 ? '/sys/user/update' : '/sys/user/save';
            this.$axios.post(url, data).then((res) => {
                if (res.code == 200) {
                    this.addEditShow = false;
                    this.$message(res.message, 'success');
                    this.getTableData();
                    /* setTimeout(() => {
							this.getTableData();
						}, 200); */
                }
            });
        },
        //教师、其他新增编辑
        otherAddEdit(type, val) {
            this.addEditType = type;
            if (type == 0) {
                //编辑
                if (this.activeIndex == 1) {
                    this.addEditInfo = {
                        code: val.code,
                        account: val.account,
                        nickName: val.nickName,
                        status: val.status,
                        deptId: val.deptId.toString(),
                        id: val.id,
                        roleType: this.activeIndex,
                        famous: val.famous,
                        subject: val.subject,
                        file: val.avatar,
                    };
                    if (val.avatar) {
                        this.fileLists = [{name: '', url: val.avatar}];
                    } else {
                        this.fileLists = [];
                    }
                } else {
                    this.addEditInfo = {
                        code: val.code,
                        account: val.account,
                        nickName: val.nickName,
                        status: val.status,
                        deptId: val.deptId.toString(),
                        id: val.id,
                        roleType: this.activeIndex,
                        file: val.avatar,
                    };
                    if (val.avatar) {
                        this.fileLists = [{name: '', url: val.avatar}];
                    }
                }
            } else {
                //新增
                if (this.activeIndex == 1) {
                    this.addEditInfo = {
                        code: '',
                        account: '',
                        nickName: '',
                        status: 1,
                        deptId: '',
                        famous: 0,
                        subject: '',
                        roleType: this.activeIndex,
                    };
                    this.fileLists = [];
                } else {
                    this.addEditInfo = {
                        code: '',
                        account: '',
                        nickName: '',
                        status: 1,
                        deptId: '',
                        roleType: this.activeIndex,
                    };
                }
            }
            this.otherAddEditShow = true;
        },
        //教师、其他新增编辑确定
        otherDddEditConfirm() {
            if (this.verify()) {
                return;
            }
            let data = new FormData();
            this.addEditInfo.password = MD5(this.addEditInfo.code);
            this.originDepartmentTree.forEach((val) => {
                if (this.addEditInfo.deptId == val.id) {
                    this.addEditInfo.deptId = val.id;
                    this.addEditInfo.orgId = val.orgId;
                    return;
                }
            });
            if (this.addEditInfo.id) {
                data.append('id', this.addEditInfo.id);
            }
            if (this.activeIndex == 1) {
                data.append('fileDetection', this.addEditInfo.file !== null ? 0 : 1);
                data.append('subject', this.addEditInfo.subject);
                data.append('famous', this.addEditInfo.famous);
            }
            data.append('account', this.addEditInfo.account);
            data.append('code', this.addEditInfo.code);
            data.append('deptId', this.addEditInfo.deptId);
            data.append('file', this.addEditInfo.file);
            data.append('nickName', this.addEditInfo.nickName);
            data.append('orgId', this.addEditInfo.orgId);
            data.append('password', this.addEditInfo.password);
            data.append('roleType', this.addEditInfo.roleType);
            data.append('status', this.addEditInfo.status);

            let url = this.addEditType == 0 ? '/sys/user/update' : '/sys/user/save';
            this.$axios.post(url, data).then((res) => {
                if (res.code == 200) {
                    this.fileLists = [];
                    this.otherAddEditShow = false;
                    this.$message(res.message, 'success');
                    this.getTableData();
                }
            });
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                let data = '';
                if (this.deleteRow instanceof Array) {
                    data = this.deleteRow;
                } else {
                    data = [this.deleteRow.id];
                }
                this.$axios.post('/sys/user/delete', data).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.deleteList = [];
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - data.length;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getTableData();
                    }
                });
            }
        },
        //多选删除
        mutipleDelete() {
            if (this.deleteList.length != 0) {
                this.deleteData(this.deleteList);
            } else {
                this.$message('请勾选具体数据', 'error');
            }
        },
        //重置密码
        resetPwd(val) {
            if (val) {
                this.resetShow = true;
                this.resetRow = val;
            } else {
                this.$axios.post('/sys/user/reset', [this.resetRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.resetShow = false;
                        this.$message(res.message, 'success');
                    }
                });
            }
        },
        //角色分配
        roleEdit(val) {
            this.getRoleList(val.id);
            this.roleEditInfo = JSON.parse(JSON.stringify(val));
            this.roleEditShow = true;
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getTableData();
        },
        //选择上传文件
        selectFile() {
            this.loading = this.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        },
        //覆盖默认上传，手动上传
        httpRequest(param) {
            let fileObj = param.file;
            let formData = new FormData();
            formData.append('file', param.file);
            formData.append('userType', this.activeIndex);
            axios({
                method: 'post',
                url: '/sys/user/importUserInfo',
                data: formData,
                responseType: 'blob',
            }).then(
                (response) => {
                    let res = '';
                    if (response.headers.result_data) {
                        res = JSON.parse(decodeURIComponent(response.headers.result_data));
                    }
                    if (res.code == 200) {
                        this.uploadSuccessShow = true;
                        this.successSize = res.data.successSize;
                        this.failSize = res.data.failSize;
                        this.getTableData();
                    } else if (res.code == -10001) {
                        this.uploadErrorShow = true;
                        this.successSize = res.data.successSize;
                        this.failSize = res.data.failSize;
                        this.downErrorInfo.url = window.URL.createObjectURL(new Blob([response.data]));
                        this.downErrorInfo.filename = decodeURIComponent(response.headers.filename);
                        this.getTableData();
                    } else {
                        if (response.config.responseType == 'blob' && !response.headers.result_data) {
                            this.search(); // token失效，取巧刷新token
                            this.$message('导入失败，请再次尝试导入', 'error');
                        } else {
                            this.$message(res.message, 'error');
                        }
                    }
                    this.loading.close();
                },
                (err) => {
                    this.loading.close();
                    console.log(err);
                    reject(err);
                }
            );
        },
        //下载异常数据
        downError() {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = this.downErrorInfo.url;
            link.setAttribute('download', decodeURIComponent(this.downErrorInfo.filename));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.uploadErrorShow = false;
        },
        //下载模板
        downLoad() {
            this.downloadInfo = '';
            this.errorInfo = '';
            if (this.activeIndex == 0) {
                //学生
                this.studentDownloadShow = true;
                this.getSelectStudentTree();
            } else {
                //老师、其它
                this.teacherDownloadShow = true;
                this.getSchoolList();
            }
        },
        //学生、老师、其它模板确认下载
        downConfirm() {
            let dataVal = '';
            let data = {};
            if (this.activeIndex == 0) {
                if (this.$verify.isEmpty(this.downloadInfo)) {
                    this.errorInfo = '请选择班级！';
                    return;
                }
                this.originStudentTree.forEach((val) => {
                    if (this.downloadInfo == val.id) {
                        dataVal = val;
                        return;
                    }
                });
                data = {
                    orgId: dataVal.orgId,
                    classId: dataVal.tid,
                    gradeId: dataVal.parentId,
                    typeId: 1,
                };
            } else {
                if (this.$verify.isEmpty(this.downloadInfo)) {
                    this.errorInfo = '请选择学校！';
                    return;
                }
                data = {
                    orgId: this.downloadInfo,
                    typeId: this.activeIndex == 1 ? 2 : 3,
                };
            }
            axios
                .get('/sys/user/getExcel', {
                    params: data,
                    responseType: 'blob',
                })
                .then((res) => {
                    let url = window.URL.createObjectURL(new Blob([res.data]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', decodeURIComponent(res.headers.filename));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    this.studentDownloadShow = false;
                    this.teacherDownloadShow = false;
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
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
            this.getTableData();
        },
        //验证
        verify() {
            if (this.activeIndex == 0 && this.$verify.letterNum(this.addEditInfo.code, 30)) {
                this.errorInfo = '学号必填并由大小写字母或数字组成，最长30位！';
                return true;
            }
            if (this.activeIndex != 0 && this.$verify.letterNum(this.addEditInfo.code, 30)) {
                this.errorInfo = '编号必填并由大小写字母或数字组成，最长30位！';
                return true;
            }
            if (this.$verify.letterNum(this.addEditInfo.account, 20)) {
                this.errorInfo = '账号必填并由大小写字母或数字组成，最长20位！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.nickName, 20)) {
                this.errorInfo = '姓名必填并由中文或大小写字母或数字组成，最长20位！';
                return true;
            }
            if (this.activeIndex == 0 && (!this.classId || isNaN(this.classId))) {
                this.errorInfo = '请选择班级！';
                return true;
            }
            if (this.activeIndex != 0 && (!this.addEditInfo.deptId || isNaN(this.addEditInfo.deptId))) {
                this.errorInfo = '请选择部门！';
                return true;
            }
            if (this.activeIndex == 1 && (!this.addEditInfo.subject || isNaN(this.addEditInfo.subject))) {
                this.errorInfo = '请选择科目！';
                return true;
            }
            return false;
        },
        showSyncTeacherDialog() {
            this.isShowSyncTeacherDialog = true;
            this.getOrgOptions();
        },
        syncTeacher() {
            if (this.teacherInfo.teacherName.length == 0 || this.teacherInfo.teacherName.length > 20) {
                this.$message('教师名称为必填，由中文或大小写字母或数字组成，最长20位！', 'error');
                return;
            }
            if (!this.teacherInfo.orgType) {
                this.$message('请选择所属机构！', 'error');
                return;
            }
            let params = {};
            params['teacherName'] = this.teacherInfo.teacherName;
            params['orgType'] = this.teacherInfo.orgType;
            this.$axios.post('/sys/org/update', params).then((res) => {
                if (res.code == 200) {
                    this.isShowSyncTeacherDialog = false;
                    this.$message(res.message, 'success');
                    this.getTableData();
                }
            });
        },
        getOrgOptions() {
            this.$axios.post('').then((res) => {
                this.orgOptions = res.data;
            });
        },
    },
    computed: {
        otherNotice(val) {
            let type1 = this.addEditType == 0 ? '编辑' : '新增';
            let type2 = this.activeIndex == 1 ? '教师' : '其他';
            return type1 + type2;
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep .el-input__inner {
    padding-right: 0;
}
.current-wrap {
    display: flex;
}
.user-menu {
    overflow: auto;
    flex-shrink: 0;
    width: 210px;
    height: 100%;
    box-sizing: border-box;
    padding: 0 18px;
    border: 1px solid #ebebeb;

    .el-menu {
        display: flex;
        justify-content: space-between;
    }
}
.tree-list {
    margin-top: 28px;

    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
.data-wrap {
    flex: 1;
    margin-left: 15px;
    .nickName {
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .dialog-item {
        p:first-child {
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: justify;
        }
    }
}

.upload-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 25px;
}
.upload-box p:first-child {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
}
::v-deep .upload-demo .el-upload-list {
    margin: -145px 0 0 10px;
    width: 250px;
}
.upload-wrap {
    height: 180px;
    width: 280px;
    ::v-deep .el-upload {
        width: 100%;
        height: 142px;
    }
    ::v-deep .el-upload-dragger {
        width: 100%;
        height: 100%;
    }
    textarea {
        height: 130px;
        width: 280px;
        border: solid #dcdfe6 1px;
        resize: none;
    }
}
</style>
<style>
.el-menu-item {
    padding: 0 14px;
}
.el-tree-node__label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
