<template>
    <div class="content-main-wrap">
        <p class="content-title">角色管理</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入角色名称关键字进行查询"
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
                    <el-table-column prop="name" align="center" label="角色名称"> </el-table-column>
                    <el-table-column prop="description" align="center" label="描述"> </el-table-column>
                    <el-table-column prop="typeDescription" align="center" label="类型"> </el-table-column>
                    <el-table-column align="center" width="160px" label="操作">
                        <template slot-scope="scope">
                            <ul class="operat-list" v-if="isAdmin == 'true'">
                                <!-- <li @click="add(0, scope.row)" v-if="permission.update && scope.row.type != 0">编辑</li>
								<li @click="deleteData(scope.row)" v-if="permission.delete && scope.row.type != 0">删除</li>
								<li @click="roleAuthEdit(scope.row)" v-if="permission.updateRoleOptAuth && scope.row.type != 0">权限授权</li> -->
                                <li @click="add(0, scope.row)" v-if="permission.update && scope.row.type != 0">编辑</li>
                                <!-- <li @click="roleAuthEdit(scope.row)" v-if="permission.updateRoleOptAuth&&!(scope.row.sign=='admin'||scope.row.sign=='super')">权限授权</li> -->
                                <li
                                    @click="roleAuthEdit(scope.row)"
                                    v-if="permission.updateRoleOptAuth && scope.row.name !== '学生'"
                                >
                                    权限授权
                                </li>
                                <li
                                    @click="deleteData(scope.row)"
                                    style="color: #f56c6c"
                                    v-if="permission.delete && scope.row.type != 0"
                                >
                                    删除
                                </li>
                            </ul>
                            <ul class="operat-list" v-else>
                                <!-- <li @click="add(0, scope.row)" v-if="permission.update && scope.row.type != 0">编辑</li>
								<li @click="deleteData(scope.row)" v-if="permission.delete && scope.row.type != 0">删除</li>
								<li @click="roleAuthEdit(scope.row)" v-if="permission.updateRoleOptAuth && scope.row.type != 0">权限授权</li> -->
                                <li @click="add(0, scope.row)" v-if="permission.update && scope.row.type != 0">编辑</li>
                                <li
                                    @click="roleAuthEdit(scope.row)"
                                    v-if="
                                        permission.updateRoleOptAuth &&
                                        scope.row.name !== '学生' &&
                                        !(
                                            scope.row.sign == 'admin' ||
                                            scope.row.sign == 'super' ||
                                            scope.row.sign == 'teacher' ||
                                            scope.row.sign == 'student' ||
                                            scope.row.sign == 'charge'
                                        )
                                    "
                                >
                                    权限授权
                                </li>
                                <li
                                    @click="deleteData(scope.row)"
                                    style="color: #f56c6c"
                                    v-if="permission.delete && scope.row.type != 0"
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
            :title="addEditType == 0 ? '编辑角色' : '新增角色'"
            :close-on-click-modal="false"
            :visible.sync="addEditShow"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                <div class="dialog-item">
                    <p>角色名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-5" v-model="addEditInfo.name"></el-input>
                </div>
                <div class="dialog-item">
                    <p>描述</p>
                    <p style="margin-right: 5px"><em></em>：</p>
                    <el-input class="width-5" v-model="addEditInfo.description"></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirm">确 定</el-button>
                    <el-button @click="addEditShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该角色？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="权限授权" :close-on-click-modal="false" :visible.sync="authShow" width="420px">
            <div class="dialog-wrap">
                <div class="dialog-item">
                    <el-cascader
                        v-model="authEditInfo.menuIds"
                        :show-all-levels="false"
                        class="width-5"
                        collapse-tags
                        :options="authList"
                        :props="props"
                        placeholder="请选择权限"
                    >
                    </el-cascader>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="authEditConfirm">确 定</el-button>
                    <el-button @click="authShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {creatTree} from '../../../assets/js/utils';
export default {
    name: '',
    data() {
        return {
            isAdmin: false,
            searchKey: '',
            pages: 0,
            pageNum: 1,
            permission: {},
            tableData: [],
            errorInfo: '',
            addEditInfo: '',
            addEditShow: false,
            deleteShow: false,
            authShow: false,
            addEditType: '',
            authList: [],
            authEditInfo: {
                menuIds: [],
            },
            roleType: JSON.parse(localStorage.getItem('userInfo')).roleType,
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            totalS: '',
            loading: false, // 表格加载
        };
    },
    components: {},
    watch: {
        $route(to, from) {
            console.log(from.path);
            if (from.path !== '/sys/role') {
                if (from.path == '/RoleEdit') {
                    if (from.query && from.query.id) {
                        this.getRoleList();
                    } else {
                        this.searchKey = '';
                        this.pageNum = 1;
                        this.getRoleList();
                    }
                } else {
                    this.searchKey = '';
                    this.pageNum = 1;
                    this.getRoleList();
                }
            }
        },
    },
    mounted() {
        this.isAdmin = window.localStorage.getItem('isAdmin');
        this.getRoleList();
    },
    methods: {
        //获取列表
        getRoleList() {
            this.loading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
            };
            this.$axios.get('/sys/role/list', data).then((res) => {
                this.loading = false; // 表格加载
                this.tableData = res.data.pageList;
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
            });
        },
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getRoleList();
        },
        //新增 编辑
        add(type, val) {
            this.errorInfo = '';
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.addEditInfo = {
                    name: val.name,
                    description: val.description,
                    id: val.id,
                };
            } else {
                //新增
                this.addEditInfo = {
                    name: '',
                    description: '',
                };
            }
            this.addEditShow = true;
        },
        //新增 编辑 确定
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            let url = '';
            if (this.addEditType == 0) {
                //编辑
                url = '/sys/role/update';
            } else {
                //新增
                url = '/sys/role/save';
            }
            this.$axios.post(url, this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.addEditShow = false;
                    this.$message(res.message, 'success');
                    this.getRoleList();
                }
            });
        },
        //验证
        verify() {
            if (!this.addEditInfo.name) {
                this.errorInfo = '角色名称不能为空！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 20)) {
                this.errorInfo = '角色名称为大小写字母、数字、中文组成，最长20位！';
                return true;
            }
            if (this.addEditInfo.description.length > 50) {
                this.errorInfo = '描述最长50位！';
                return true;
            }
            return false;
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                this.$axios.post('/sys/role/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message(res.message, 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getRoleList();
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
            this.getRoleList();
        },
        //获取可分配权限
        roleAuthEdit(val) {
            this.$router.push({path: '/RoleEdit', query: {id: val.id, name: val.name}});
            // this.authEditInfo.roleId = val.id;
            // this.$axios.get('/sys/role/getMenuInfo', {roleId: val.id}).then(res => {
            // 	this.authList = creatTree(res.data.menuList);
            // 	this.authEditInfo.menuIds = res.data.choice;
            // });
            // this.authShow = true;
        },
        //构造选中数组
        createChoice(c) {
            let choiceList = [];
            this.authList.forEach((val) => {
                if (c.includes(val.id)) {
                    choiceList.push(val);
                }
            });
            let selectList = [];
            let translator = (arr, list) => {
                arr.forEach((val) => {
                    let temp = JSON.parse(JSON.stringify(list));
                    if (val.children) {
                        temp.push(val.id);
                        translator(val.children, temp);
                    } else {
                        temp.push(val.id);
                        selectList.push(temp);
                    }
                });
            };
            translator(choiceList, []);
            return selectList;
        },
        //权限改变
        authChange(ids) {
            let res = [];
            let translator = (arr, obj) => {
                arr.forEach((val) => {
                    let temp = JSON.parse(JSON.stringify(obj || {}));
                    if (val.children) {
                        temp[val.id] = val.id;
                        translator(val.children, temp);
                    } else {
                        if (ids.includes(val.id)) {
                            temp[val.id] = val.id;
                            for (let item in temp) {
                                res.push(parseInt(item));
                            }
                        }
                    }
                });
            };
            translator(this.authList);
            return res;
        },
        //确定修改权限
        authEditConfirm() {
            let data = this.authChange(this.authEditInfo.menuIds);
            data = [...new Set(data)];
            this.$axios
                .post('/sys/role/updateRoleOptAuth', {menuIds: data, roleId: this.authEditInfo.roleId})
                .then((res) => {
                    if (res.code == 200) {
                        this.authShow = false;
                        this.$message(res.message, 'success');
                        this.getRoleList();
                    }
                });
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.dialog-item p:first-child {
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
}
</style>
