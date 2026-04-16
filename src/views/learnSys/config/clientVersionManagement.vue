<template>
    <div class="content-main-wrap">
        <p class="content-title">版本管理</p>
        <div class="main-wrap">
            <div class="search-operate">
                <div>
                    <el-button class="width-1" icon="el-icon-plus" @click="add(1)" v-if="permission.save"
                        >新增</el-button
                    >
                </div>
            </div>
            <div class="data-table table-border">
                <el-table :data="tableData" v-loading="loading" style="width: 100%">
                    <el-table-column align="center" label="序号" prop="id"></el-table-column>
                    <el-table-column prop="versionNumber" align="center" label="版本号"> </el-table-column>
                    <el-table-column prop="enabledStatusText" align="center" label="状态"> </el-table-column>
                    <el-table-column align="center" width="100px" label="安装包">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li @click="downloadClient(scope.row)">下载</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建时间"> </el-table-column>
                    <el-table-column align="center" width="180px" label="操作">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <!-- 待开启状态的可开启、编辑、删除 -->
                                <!-- 已开启状态可查看版本详情和关闭当前版本 -->
                                <!-- 已关闭状态可查看版本详情、删除 -->
                                <!-- 待开启：0，已开启：1，已关闭：2 -->
                                <li @click="operateClient(1, scope.row)" v-if="scope.row.enabledStatus == 0">开启</li>
                                <li @click="operateClient(2, scope.row)" v-if="scope.row.enabledStatus == 1">关闭</li>
                                <li @click="add(0, scope.row)" v-if="scope.row.enabledStatus == 0">编辑</li>
                                <li
                                    @click="viewVersionDetail(scope.row)"
                                    v-if="scope.row.enabledStatus == 1 || scope.row.enabledStatus == 2"
                                >
                                    查看
                                </li>
                                <li
                                    @click="deleteData(scope.row)"
                                    style="color: #f56c6c"
                                    v-if="scope.row.enabledStatus == 0 || scope.row.enabledStatus == 2"
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

            <el-dialog
                :title="addEditType == 0 ? '编辑版本' : '新增版本'"
                :close-on-click-modal="false"
                :visible.sync="addEditShow"
                width="500px"
            >
                <div class="dialog-wrap">
                    <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                    <div class="dialog-item">
                        <p>版本号</p>
                        <p><em>*</em>：</p>
                        <!-- trim过滤空格 -->
                        <el-input
                            class="width-2"
                            v-model.trim="addEditInfo.versionNumber"
                            maxlength="10"
                            show-word-limit
                        ></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>更新内容</p>
                        <p><em>*</em>：</p>
                        <el-input
                            class="width-2"
                            v-model="addEditInfo.updateExplain"
                            type="textarea"
                            :rows="7"
                        ></el-input>
                        <!-- maxlength="1000"
                            show-word-limit -->
                    </div>
                    <div class="dialog-item upload-exe">
                        <p>安装包</p>
                        <p><em>*</em>：</p>
                        <el-upload
                            ref="edufileupload"
                            :action="uploadUrl"
                            class="upload-edufile"
                            accept=".exe"
                            :on-change="selectExeFile"
                            :on-remove="removeExeFile"
                            :with-credentials="true"
                            :on-exceed="handleOnExceed"
                            :limit="1"
                            :file-list="clientExeList"
                        >
                            <el-button type="primary">立即上传</el-button>
                        </el-upload>
                    </div>
                </div>

                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirms">确 定</el-button>
                    <el-button @click="handleAddEditShow">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="operateClientShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">确认{{ curOperate == 1 ? '开启' : '关闭' }}该版本？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="operateClient()">确 定</el-button>
                        <el-button @click="operateClientShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">您确定删除该版本数据？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="deleteData()">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="查看" :close-on-click-modal="false" :visible.sync="detailShow" width="420px">
                <div class="dialog-wrap detail-dialog-content">
                    <div class="item">
                        <p class="title">版本号：</p>
                        <p class="content">{{ curRow.versionNumber }}</p>
                    </div>
                    <div class="item">
                        <p class="title">更新内容：</p>
                        <p class="content">{{ curRow.updateExplain }}</p>
                    </div>
                    <div class="item">
                        <p class="title">安装包：</p>
                        <p class="content">{{ curRow.fileName }}</p>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {baseUrl, throttle} from '@/assets/js/utils';

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
            addEditInfo: {},
            errorInfo: '',
            deleteShow: false,
            currentIndex: 0,
            totalS: '',
            loading: false, // 表格加载
            ruleList: [], // 所有规则
            clientExeList: [],
            uploadUrl: baseUrl + '/sys/clientVersion/upload',
            operateClientShow: false,
            curRow: {},
            curOperate: 0,
            detailShow: false,
        };
    },
    components: {},
    mounted() {
        this.getClientVersionList();
    },
    methods: {
        //获取设备
        async getClientVersionList() {
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
            };
            this.loading = true;
            const listResp = await this.$axios.get('/sys/clientVersion/list', data);
            if (listResp.code === 200) {
                this.tableData = listResp.data.pageList;
                this.permission = this.creatPermit(listResp.data.permit);
                this.pages = listResp.data.pages;
                this.totalS = listResp.data.total;
                this.loading = false;
            }
        },
        //新增 编辑
        add(type, val) {
            this.errorInfo = '';
            this.addEditType = type;
            if (type == 0) {
                //编辑
                this.addEditInfo = {
                    versionNumber: val.versionNumber,
                    updateExplain: val.updateExplain,
                    packageName: val.packageName,
                    packagePath: val.packagePath,
                    id: val.id,
                };
                this.clientExeList = [];
                this.clientExeList.push({name: val.packageName, url: val.packagePath});
            } else {
                this.addEditInfo = {
                    versionNumber: '',
                    updateExplain: '',
                    packageName: '',
                    id: '',
                };
                this.clientExeList = [];
            }
            this.addEditShow = true;
        },
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            let url = '/sys/clientVersion/save';
            if (this.addEditType == 0) {
                //0编辑
                url = '/sys/clientVersion/update';
            }
            this.$axios.post(url, this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.addEditShow = false;
                    this.$message(res.message, 'success');
                    this.getClientVersionList();
                }
            });
        },
        handleAddEditShow() {
            this.addEditShow = false;
        },
        //删除
        deleteData(val) {
            if (val) {
                this.deleteShow = true;
                this.curRow = val;
            } else {
                this.$axios.post('/sys/clientVersion/delete', [this.curRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getClientVersionList();
                    }
                });
            }
        },
        //开启/关闭
        operateClient(status, val) {
            if (val) {
                this.operateClientShow = true;
                this.curRow = val;
                this.curOperate = status;
            } else {
                this.$axios
                    .post('/sys/clientVersion/updateEnabled', {id: this.curRow.id, enabledStatus: this.curOperate})
                    .then((res) => {
                        if (res.code == 200) {
                            this.operateClientShow = false;
                            this.$message(res.data, 'success');
                            this.totalS = this.totalS - 1;
                            if (this.pageNum * 10 - this.totalS === 10) {
                                this.pageNum = this.pageNum - 1 || 1;
                            }
                            this.getClientVersionList();
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
            this.tableData = [];
            this.currentIndex = 0;
            this.pageNum = val;
            this.getClientVersionList();
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个安装包', 'error');
        },
        selectExeFile(file) {
            this.addEditInfo.packageName = file.name;
        },
        // 移除
        removeExeFile(file) {
            this.addEditInfo.packagePath = '';
            this.addEditInfo.packageName = null;
        },
        //验证
        verify() {
            if (this.$verify.isEmpty(this.addEditInfo.versionNumber)) {
                this.errorInfo = '版本号不能为空';
                return true;
            }
            if (!this.addEditInfo.updateExplain) {
                this.errorInfo = '更新内容不能为空！';
                return true;
            }
            if (!this.addEditInfo.packageName) {
                this.errorInfo = '请上传安装包！';
                return true;
            }
        },
        downloadClient(row) {
            // 使用 axios 的 params 选项传递查询参数，并设置响应类型为 blob 以处理文件下载
            this.$axios.get('/sys/clientVersion/download', {id: row.id}, 'blob').then((res) => {
                let url = window.URL.createObjectURL(new Blob([res]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.download = row.fileName;
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
            });
        },
        viewVersionDetail(row) {
            this.curRow = row;
            this.detailShow = true;
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.search-operate div {
    display: flex;
    justify-content: end;
}
.upload-exe {
    align-items: baseline;
}
.detail-dialog-content {
    .item {
        display: flex;
        color: #000;

        .title {
            width: 30%;
            text-align: right;
            margin-right: 20px;
        }
        .content {
            width: 65%;
            white-space: pre-line; /* 保留换行符，合并空格 */
            word-break: break-word;
        }
        p {
            margin: 30px 0;
        }
    }
}
</style>
