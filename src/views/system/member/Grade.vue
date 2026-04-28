<template>
    <div class="content-main-wrap">
        <p class="content-title">年级管理</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入年级名称关键字进行查询"
                        v-search="search"
                        clearable
                    ></el-input>
                    <span class="search-desc">学校：</span>
                    <el-select v-model="searchSchool" placeholder="选择学校" style="width: 200px" clearable filterable>
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
                        v-if="permission.save"
                        :isShowImportBtn="true"
                        :isShowTemplateBtn="true"
                        :uploadUrl="uploadUrl"
                        :importUrl="importUrl"
                        :templateUrl="templateUrl"
                        :templateParams="templateParams"
                        :afterImportMethod="getGradeList"
                        :fileConfig="fileConfig"
                    ></importResult>
                </div>
            </div>
            <div class="data-table table-border">
                <el-table v-loading="loading" :data="tableData" style="width: 100%">
                    <el-table-column prop="code" align="center" :show-overflow-tooltip="true" label="编号">
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="年级"> </el-table-column>
                    <el-table-column prop="year" align="center" label="入学年份"> </el-table-column>
                    <el-table-column prop="orgName" align="center" label="所属学校"> </el-table-column>
                    <el-table-column align="center" :show-overflow-tooltip="true" label="负责人">
                        <template slot-scope="scope">
                            {{ scope.row.principalNames?.join(',') }}
                            <!-- <ul class="principal-list">
								<li>{{ scope.row.principalNames.join(',') }}</li>
							</ul> -->
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.status | useStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" align="center" min-width="110" label="创建时间">
                    </el-table-column>
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
            :title="addEditType == 0 ? '编辑年级' : '新增年级'"
            :close-on-click-modal="false"
            :visible.sync="addEditShow"
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
                    <el-select
                        v-model="addEditInfo.orgId"
                        @change="schoolChange"
                        placeholder="请选择学校"
                        class="width-3"
                        filterable
                    >
                        <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div class="dialog-item">
                    <p>年级名称</p>
                    <p><em>*</em>：</p>
                    <!-- <el-input class="width-3" v-model="addEditInfo.name"></el-input> -->
                    <el-select v-model="addEditInfo.name" placeholder="请选择年级" class="width-3">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </div>

                <div class="dialog-item">
                    <p>入学年份</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="addEditInfo.year" placeholder="请选择年份" class="width-3">
                        <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div class="dialog-item">
                    <p style="width: 65px">负责人</p>
                    <p><em>*</em>：</p>
                    <el-cascader
                        v-model="addEditInfo.principalIdList"
                        ref="principalIdList"
                        :show-all-levels="false"
                        style="width: 270px"
                        :options="chargeList"
                        placeholder="请选择负责人"
                        :props="props"
                        @change="principalChange"
                        clearable
                        filterable
                    >
                    </el-cascader>
                </div>

                <div class="dialog-item">
                    <p>状态</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="addEditInfo.status" placeholder="请选择" class="width-3">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirm">确 定</el-button>
                    <el-button @click="addEditShow = false">取 消</el-button>
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

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该年级？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="uploadErrorShow" width="420px">
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
        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="uploadSuccessShow" width="420px">
            <div class="dialog-wrap">
                <p class="success-icon"><i class="el-icon-circle-check"></i></p>
                <p class="success-title">共{{ failSize + successSize }}条合法数据！</p>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import {baseUrl, creatTree, creatYear} from '@/assets/js/utils';
import importResult from '@/components/importResult.vue';
import axios from 'axios';
export default {
    name: '',
    data() {
        return {
            searchKey: '',
            searchStatus: '',
            tableData: [],
            gradeList: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            originStatus: 1,
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
            chargeList: [],
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            typeList: [],
            schoolList: '',
            yearList: '',
            totalS: '',
            loading: false, // 表格加载
            gradeNameIdMap: {},
            searchSchool: '',
            uploadUrl: baseUrl + '/sm/grade/importGrade',
            importUrl: '/sm/grade/importGrade',
            templateUrl: baseUrl + '/sm/grade/exportGradeTemplate',
            templateParams: {},
            fileConfig: {
                年级编号: 'code',
                年级名称: 'name',
                入学年份: 'year',
                学校: 'orgName',
                负责人: 'principalName',
                状态: 'status',
                异常原因: 'msg',
            },
            // uploadErrorShow: false,
            // failSize: 0,
            // successSize: 0,
            // downErrorInfo: {},
            // uploadSuccessShow: false,
        };
    },
    components: {
        importResult,
    },
    mounted() {
        this.getGradeList();
        this.getSchoolList(); // 点击新增才触发 需修复
        this.yearList = creatYear();
        this.getGradeOptions();
    },
    methods: {
        //获取列表
        getGradeList() {
            this.loading = true; // 表格加载
            // TODO 学校过滤的参数
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
                status: this.searchStatus,
                orgId: this.searchSchool,
            };
            this.$axios.get('/sm/grade/list', data).then((res) => {
                this.loading = false; // 表格加载
                this.tableData = res.data.pageList;
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
            });
        },
        getSchoolList() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
            });
        },
        add(type, val) {
            this.getSchoolList();
            this.errorInfo = '';
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.getChargeList(val.orgId);
                this.addEditInfo = {
                    status: val.status,
                    code: val.code,
                    orgId: val.orgId,
                    name: val.name,
                    year: val.year,
                    id: val.id,
                    principalIdList: val.principalIdList,
                };
                this.originStatus = val.status;
            } else {
                //新增
                let orgId = this.schoolList ? this.schoolList[0].id : '';
                this.getChargeList(orgId);
                this.addEditInfo = {
                    status: 1,
                    code: '',
                    orgId: '',
                    name: '',
                    year: '',
                    principalIdList: [],
                };
            }
            this.addEditShow = true;
        },
        //获取负责人列表
        getChargeList(id) {
            this.$axios.get('/sys/org/listPrincipalForTree', {orgId: id}).then((res) => {
                this.chargeList = res.data;
            });
        },
        //新增编辑确定
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
                this.addEditInfo['labelId'] = this.gradeNameIdMap[this.addEditInfo.name];
                //1新增
                this.$axios.post('/sm/grade/save', this.addEditInfo).then((res) => {
                    if (res.code == 200) {
                        this.addEditShow = false;
                        this.$message(res.message, 'success');
                        this.getGradeList();
                    }
                });
            }
        },
        //确定修改
        updateConfirm() {
            this.addEditInfo['labelId'] = this.gradeNameIdMap[this.addEditInfo.name];
            this.$axios.post('/sm/grade/update', this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.addEditShow = false;
                    this.updateConfirmShow = false;
                    this.$message(res.message, 'success');
                    this.getGradeList();
                }
            });
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                this.$axios.post('/sm/grade/delete', {id: this.deleteRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getGradeList();
                    }
                });
            }
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getGradeList();
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
            this.getGradeList();
        },
        //负责人最多三个
        principalChange(val) {
            if (this.addEditInfo.principalIdList.length > 3) {
                this.$message('最多选择三个负责人', 'error');
                // this.addEditInfo.principalIdList = this.addEditInfo.principalIdList.slice(0, 3);
            }
        },
        //验证
        verify() {
            if (!this.addEditInfo.code) {
                this.errorInfo = '编号不能为空！';
                return true;
            }
            if (this.$verify.letterNum(this.addEditInfo.code, 20)) {
                this.errorInfo = '编号为大小写字母和数字组成，最长20位！';
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.orgId)) {
                this.errorInfo = '请选择学校！';
                return true;
            }
            if (!this.addEditInfo.name) {
                this.errorInfo = '年级名称不能为空！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 20)) {
                this.errorInfo = '年级名称由中文大小写字母数字组成，最长20位！';
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.year)) {
                this.errorInfo = '请选择入学年份！';
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
        //学校选择变化
        schoolChange(val) {
            this.getChargeList(val);
            this.addEditInfo.principalIdList = [];
        },
        getGradeOptions() {
            this.$axios.get('/sm/label/listByParentId', {parentId: 13}).then((res) => {
                if (res.data) {
                    this.gradeList = res.data;
                    res.data.map((item) => {
                        this.gradeNameIdMap[item.name] = item.id;
                    });
                }
            });
        },
        // //选择上传文件
        // selectFile() {
        //     this.loading = this.$loading({
        //         lock: true,
        //         text: '上传中',
        //         spinner: 'el-icon-loading',
        //         background: 'rgba(0, 0, 0, 0.7)',
        //     });
        // },
        // //覆盖默认上传，手动上传
        // httpRequest(param) {
        //     let fileObj = param.file;
        //     let formData = new FormData();
        //     formData.append('file', param.file);
        //     formData.append('userType', this.activeIndex);
        //     axios({
        //         method: 'post',
        //         url: '/sys/user/importUserInfo',
        //         data: formData,
        //         responseType: 'blob',
        //     }).then(
        //         (response) => {
        //             let res = '';
        //             if (response.headers.result_data) {
        //                 res = JSON.parse(decodeURIComponent(response.headers.result_data));
        //             }
        //             if (res.code == 200) {
        //                 this.uploadSuccessShow = true;
        //                 this.successSize = res.data.successSize;
        //                 this.failSize = res.data.failSize;
        //                 this.getTableData();
        //             } else if (res.code == -10001) {
        //                 this.uploadErrorShow = true;
        //                 this.successSize = res.data.successSize;
        //                 this.failSize = res.data.failSize;
        //                 this.downErrorInfo.url = window.URL.createObjectURL(new Blob([response.data]));
        //                 this.downErrorInfo.filename = decodeURIComponent(response.headers.filename);
        //                 this.getTableData();
        //             } else {
        //                 if (response.config.responseType == 'blob' && !response.headers.result_data) {
        //                     this.search(); // token失效，取巧刷新token
        //                     this.$message('导入失败，请再次尝试导入', 'error');
        //                 } else {
        //                     this.$message(res.message, 'error');
        //                 }
        //             }
        //             this.loading.close();
        //         },
        //         (err) => {
        //             this.loading.close();
        //             console.log(err);
        //             reject(err);
        //         }
        //     );
        // },
        // //下载异常数据
        // downError() {
        //     let link = document.createElement('a');
        //     link.style.display = 'none';
        //     link.href = this.downErrorInfo.url;
        //     link.setAttribute('download', decodeURIComponent(this.downErrorInfo.filename));
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        //     this.uploadErrorShow = false;
        // },
        // //下载模板
        // downLoad() {
        //     let dataVal = '';
        //     let data = {};
        //     axios
        //         .get('/sys/user/getExcel', {
        //             params: data,
        //             responseType: 'blob',
        //         })
        //         .then((res) => {
        //             let url = window.URL.createObjectURL(new Blob([res.data]));
        //             let link = document.createElement('a');
        //             link.style.display = 'none';
        //             link.href = url;
        //             link.setAttribute('download', decodeURIComponent(res.headers.filename));
        //             document.body.appendChild(link);
        //             link.click();
        //             document.body.removeChild(link);
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             reject(err);
        //         });
        // },
    },
};
</script>

<style lang="scss" type="text/scss"></style>
