<template>
    <div class="content-main-wrap">
        <p class="content-title">用户组管理</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入用户组名称关键字进行查询"
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
                <el-table v-loading="loading" :data="tableData" style="width: 100%">
                    <el-table-column prop="groupName" align="center" label="用户组名称"> </el-table-column>
                    <el-table-column prop="remark" align="center" label="备注"> </el-table-column>
                    <el-table-column prop="createDate" align="center" min-width="110" label="创建时间">
                    </el-table-column>
                    <el-table-column align="center" width="170px" label="操作">
                        <template slot-scope="scope">
                            <ul
                                class="operat-list"
                                v-if="scope.row.id == 1 || scope.row.id == 2 || scope.row.id == 3 || scope.row.id == 4"
                            >
                                <!-- <li @click="add(0, scope.row)" v-if="permission.update && scope.row.createDate && userName == 'super'" :class="scope.row.createDate ? 'istrue' : 'disable'">编辑</li>
								<li @click="getUserList(scope.row)" v-if="permission.addUser && scope.row.createDate && userName == 'super'" :class="scope.row.createDate ? '' : 'disable'">添加用户</li>
								<li @click="deleteData(scope.row)" v-if="permission.delete && scope.row.createDate && userName == 'super'" :class="scope.row.createDate ? 'istrue' : 'disable'">删除</li> -->
                            </ul>
                            <ul class="operat-list" v-else>
                                <li
                                    @click="add(0, scope.row)"
                                    v-if="permission.update && scope.row.createDate"
                                    :class="scope.row.createDate ? 'istrue' : 'disable'"
                                >
                                    编辑
                                </li>
                                <li
                                    @click="getUserList(scope.row)"
                                    v-if="permission.addUser && scope.row.createDate"
                                    :class="scope.row.createDate ? '' : 'disable'"
                                >
                                    添加用户
                                </li>
                                <li
                                    @click="deleteData(scope.row)"
                                    style="color: #f56c6c"
                                    v-if="permission.delete && scope.row.createDate"
                                    :class="scope.row.createDate ? 'istrue' : 'disable'"
                                >
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
            :title="addEditType == 0 ? '编辑用户组' : '新增用户组'"
            :close-on-click-modal="false"
            :visible.sync="addShow"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                <div class="dialog-item">
                    <p>用户组名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addInfo.groupName"></el-input>
                </div>
                <div class="dialog-item">
                    <p>备注</p>
                    <p><em style="opacity: 0">*</em>：</p>
                    <el-input class="width-3" v-model="addInfo.remark"></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirm">确 定</el-button>
                    <el-button @click="addShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="添加用户" :close-on-click-modal="false" :visible.sync="selectUserShow" width="420px">
            <div class="dialog-wrap">
                <div class="dialog-item">
                    <el-cascader
                        v-model="selectUserList"
                        :show-all-levels="false"
                        class="width-5"
                        :options="userList"
                        :props="props"
                        placeholder="请选择用户"
                        filterable
                        clearable
                    >
                    </el-cascader>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="selectUserConfirm">确 定</el-button>
                    <el-button @click="selectUserShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该用户组？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {creatTree} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            userName: JSON.parse(localStorage.getItem('userInfo')).account,
            searchKey: '',
            tableData: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            addShow: false,
            deleteShow: false,
            deleteRow: '',
            errorInfo: '',
            addInfo: {},
            addEditType: 0,
            originUserList: [],
            userList: [],
            selectUserList: [],
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            selectUserShow: false,
            groupId: '',
            totalS: '',
            loading: false, // 表格加载
        };
    },
    components: {},
    mounted() {
        this.getGroupList();
    },
    methods: {
        editData(data) {
            this.addInfo.id = data.id;
            this.addInfo.groupName = data.groupName;
            this.addInfo.remark = data.remark;
            this.errorInfo = '';
            this.addShow = true;
        },
        add(type, val) {
            this.errorInfo = '';
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.addInfo = {
                    id: val.id,
                    groupName: val.groupName,
                    remark: val.remark,
                };
            } else {
                //新增
                this.addInfo = {
                    groupName: '',
                    remark: '',
                };
            }
            this.addShow = true;
        },
        //获取列表
        getGroupList() {
            this.loading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
            };
            this.$axios.get('/sys/group/list', data).then((res) => {
                this.loading = false; // 表格加载
                let arr = res.data.pageList;
                // arr.forEach(el => {
                // 	if(JSON.parse(localStorage.getItem('userInfo')).account == 'super') {

                // 	}else{

                // 	}
                // })
                this.tableData = arr;
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
            });
        },
        //获取当前用户组用户
        getUserList(val) {
            if (!val.createDate) {
                return;
            }
            this.groupId = val.id;
            this.$axios.get('/sys/group/getOrganizationInfo', {groupId: val.id}).then((res) => {
                let arr = res.data.organization;
                arr.forEach((el) => {
                    if (el.orgType == 7) {
                        el.name = '学生-' + el.name;
                    } else if (el.orgType == 8) {
                        el.name = '教师-' + el.name;
                    } else if (el.orgType == 9) {
                        el.name = '其他-' + el.name;
                    }
                });
                console.log(arr, '222');
                this.selectUserShow = true;
                this.userList = creatTree(arr);
                this.originUserList = res.data.organization;
                this.selectUserList = res.data.choice;
            });
        },
        //选择用户确定
        selectUserConfirm() {
            let submitList = [];
            this.selectUserList.forEach((val) => {
                this.originUserList.forEach((item) => {
                    if (val == item.id && (item.orgType == 7 || item.orgType == 8 || item.orgType == 9)) {
                        submitList.push({id: item.tid, type: item.orgType});
                    }
                });
            });
            this.$axios
                .post('/sys/group/addUser', {
                    groupId: this.groupId,
                    sysUserGroupFroms: submitList,
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.selectUserShow = false;
                        this.$message(res.message, 'success');
                        this.getGroupList();
                    }
                });
        },
        //新增用户组确定
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            let url = '/sys/group/save';
            if (this.addEditType == 0) {
                url = '/sys/group/update';
            }
            this.$axios.post(url, this.addInfo).then((res) => {
                if (res.code == 200) {
                    this.addShow = false;
                    this.$message(res.message, 'success');
                    this.getGroupList();
                }
            });
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getGroupList();
        },
        //删除
        deleteData(val) {
            if (val) {
                if (!val.createDate) {
                    this.deleteShow = false;
                    return;
                }
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                this.$axios.post('/sys/group/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message(res.message, 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getGroupList();
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
            this.getGroupList();
        },
        //验证
        verify() {
            if (!this.addInfo.groupName) {
                this.errorInfo = '用户组名称不能为空！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addInfo.groupName, 30)) {
                this.errorInfo = '用户组名称由中文大小写字母数字组成，最长30位！';
                return true;
            }

            if (this.addInfo.remark && this.addInfo.remark.length > 50) {
                this.errorInfo = '备注最长50位！';
                return true;
            }
            return false;
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.dialog-item {
    p:first-child {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}
.operat-list {
    .disable {
        color: #b3b6ba;
    }
    .isTrue {
        color: #f56c6c;
    }
}
</style>
