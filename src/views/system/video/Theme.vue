<template>
    <div class="content-main-wrap second-parent-wrap">
        <p class="content-title">课程录制</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div style="min-width: 780px">
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入主题名称关键字进行查询"
                        v-search="search"
                        clearable
                    ></el-input>
                    <span class="search-desc">主题状态：</span>
                    <el-select v-model="searchThemeStatus" placeholder="请选择" class="width-4">
                        <el-option
                            v-for="item in searchThemeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <span class="search-desc">录制状态：</span>
                    <el-select v-model="searchLiveStatus" placeholder="请选择" class="width-4">
                        <el-option
                            v-for="item in searchLiveList"
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
                </div>
            </div>

            <div class="data-table table-border">
                <el-table v-loading="loading" :data="tableData" style="width: 100%">
                    <el-table-column align="center" :show-overflow-tooltip="true" label="主题名称">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li class="active" @click="detail(scope.row)">{{ scope.row.name }}</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" align="center" min-width="110" label="开始时间">
                    </el-table-column>
                    <el-table-column prop="endTime" align="center" min-width="110" label="结束时间"> </el-table-column>
                    <el-table-column prop="founder" align="center" label="创建者"> </el-table-column>
                    <el-table-column prop="teacherName" align="center" label="授课教师"> </el-table-column>
                    <el-table-column align="center" label="主题状态">
                        <template slot-scope="scope">
                            <p>
                                {{ scope.row.status | theme
                                }}<i
                                    v-if="scope.row.status == 3"
                                    :title="scope.row.rejectReason ? scope.row.rejectReason : '无理由'"
                                    class="el-icon-question"
                                    style="margin-left: 5px"
                                ></i>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="录制状态">
                        <template slot-scope="scope">
                            <p>{{ scope.row.liveStatus | live }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="公网录制">
                        <template slot-scope="scope">
                            <p>{{ scope.row.publicLive === 0 ? '否' : '是' }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="录制模式">
                        <template slot-scope="scope">
                            <p>{{ scope.row.liveMode === 1 ? '录播录制' : '远程教学' }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="最大在线人数">
                        <template slot-scope="scope">
                            <p>{{ scope.row.maxOnline }}</p>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
						align="center"
						label="热门推荐">
						<template slot-scope="scope">
							<p>{{scope.row.hot | hot}}</p>
						</template>
					</el-table-column> -->
                    <el-table-column align="center" width="260px" label="操作">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li
                                    @click="submit(0, scope.row)"
                                    v-if="permission.submit"
                                    :class="scope.row.status == 0 ? 'active' : ''"
                                >
                                    送审
                                </li>
                                <li
                                    @click="audit(0, scope.row)"
                                    v-if="permission.audit"
                                    :class="scope.row.status == 1 ? 'active' : ''"
                                >
                                    审核
                                </li>
                                <li
                                    @click="release(0, scope.row)"
                                    v-if="permission.release"
                                    :class="scope.row.status == 2 ? 'active' : ''"
                                >
                                    发布
                                </li>
                                <li
                                    @click="add(0, scope.row)"
                                    v-if="permission.update"
                                    :class="scope.row.status == 0 || scope.row.status == 3 ? 'active' : ''"
                                >
                                    编辑
                                </li>
                                <li
                                    @click="playBack(scope.row)"
                                    :class="scope.row.playStatus == 2 ? 'active' : ''"
                                    v-if="permission.recordList"
                                >
                                    回放
                                </li>
                                <li
                                    @click="deleteData(0, scope.row)"
                                    v-if="permission.delete"
                                    style="color: #f56c6c"
                                    class="active"
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

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="submitShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">送审后无法修改该主题，确认送审？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="submit(1)">确 定</el-button>
                    <el-button @click="submitShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="发布主题" :close-on-click-modal="false" :visible.sync="releaseShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">确认发布该主题？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="release(1)">确 定</el-button>
                    <el-button @click="releaseShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="删除主题" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">确认删除该主题？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData(1)">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="主题审核" :close-on-click-modal="false" :visible.sync="auditShow" width="420px">
            <div class="dialog-wrap">
                <div class="dialog-item">
                    <p>审核结果</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="auditStatus" placeholder="请选择" class="width-5">
                        <el-option v-for="item in auditList" :key="item.id" :label="item.value" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-item" v-if="auditStatus == 3">
                    <p>驳回理由</p>
                    <p style="margin-right: 5px"><em></em>：</p>
                    <el-input type="textarea" :rows="3" class="width-5" v-model="rejectReason"></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="audit(1)">确 定</el-button>
                    <el-button @click="auditShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getNowDate} from '../../../assets/js/utils';
export default {
    name: '',
    data() {
        return {
            searchThemeList: [
                {value: '', label: '全部'},
                {value: 0, label: '待提交'},
                {value: 1, label: '待审核'},
                {value: 2, label: '待发布'},
                {value: 3, label: '驳回'},
                {value: 4, label: '已发布'},
            ],
            searchLiveList: [
                {value: '', label: '全部'},
                {value: 0, label: '预告中'},
                {value: 1, label: '授课中'},
                {value: 2, label: '已结束'},
            ],
            searchThemeStatus: '',
            searchLiveStatus: '',
            searchKey: '',
            tableData: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            submitShow: false,
            submitRow: '',
            auditList: [
                {id: 2, value: '通过'},
                {id: 3, value: '不通过'},
            ],
            auditStatus: 2,
            rejectReason: '',
            auditShow: false,
            auditRow: '',
            releaseShow: false,
            releaseRow: '',
            deleteShow: false,
            deleteRow: '',
            totalS: '',
            loading: false, // 表格加载
        };
    },
    components: {},
    mounted() {
        if (this.$route.query.type) {
            this.searchThemeStatus = Number(this.$route.query.type);
        }
        this.getThemeList();
    },
    watch: {
        $route(to, from) {
            if (from.path !== '/sm/theme') {
                // 详情、新增/编辑、回放返回主页面，不需要重置分页和过滤项
                if (
                    from.path == '/sm/themeaddedit' ||
                    from.path == '/sm/themedetail' ||
                    from.path == '/sm/themeplayback'
                ) {
                    this.getThemeList();
                } else {
                    this.searchKey = '';
                    this.searchLiveStatus = '';
                    if (from.path == '/sys/home') {
                        this.searchThemeStatus = this.$route.query.type ? Number(this.$route.query.type) : '';
                        this.pageNum = 1;
                        this.getThemeList();
                    } else {
                        this.searchThemeStatus = '';
                        this.pageNum = 1;
                        this.getThemeList();
                    }
                }
            }
        },
    },
    methods: {
        //获取主题列表
        getThemeList() {
            this.loading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
                status: this.searchThemeStatus,
                liveStatus: this.searchLiveStatus,
            };
            this.$axios.get('/sm/theme/list', data).then((res) => {
                this.loading = false; // 表格加载
                this.tableData = res.data.pageList;
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
            });
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getThemeList();
        },
        //送审 0送审 1送审确定
        submit(type, val) {
            if (type == 0) {
                if (val.status != 0) {
                    return;
                }
                if (this.judgeEndTime(val.endTime)) {
                    return;
                }
                this.submitRow = val;
                this.submitShow = true;
            } else {
                this.$axios.post('/sm/theme/submit', {id: this.submitRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.submitShow = false;
                        this.$message('送审成功', 'success');
                        this.getThemeList();
                    }
                });
            }
        },
        //发布 0发布 1发布确定
        release(type, val) {
            if (type == 0) {
                if (val.status != 2) {
                    return;
                }
                if (this.judgeEndTime(val.endTime)) {
                    return;
                }
                this.releaseRow = val;
                this.releaseShow = true;
            } else {
                this.$axios.post('/sm/theme/release', {id: this.releaseRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.releaseShow = false;
                        this.$message('发布成功', 'success');
                        this.getThemeList();
                    }
                });
            }
        },
        //回放
        playBack(val) {
            if (val.playStatus == 2) {
                this.$router.push({path: '/sm/themeplayback', query: {themeid: val.id}});
            }
        },
        //删除 0删除 1删除确定
        deleteData(type, val) {
            if (type == 0) {
                this.deleteRow = val;
                this.deleteShow = true;
            } else {
                this.$axios.post('/sm/theme/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getThemeList();
                    }
                });
            }
        },
        //审核 0审核 1审核确定
        audit(type, val) {
            if (type == 0) {
                if (val.status != 1) {
                    return;
                }
                // if(this.judgeEndTime(val.endTime)){
                // 	return
                // };
                this.auditStatus = 2;
                this.rejectReason = '';
                this.auditRow = val;
                this.auditShow = true;
            } else {
                let data = {
                    status: this.auditStatus,
                    id: this.auditRow.id,
                    rejectReason: this.rejectReason,
                };
                if (this.auditStatus == 2 && this.judgeEndTime(this.auditRow.endTime)) {
                    return;
                }
                if (this.rejectReason && this.rejectReason.length > 20) {
                    this.$message('驳回理由不得超过20字符', 'error');
                    return;
                }
                this.$axios.post('/sm/theme/audit', data).then((res) => {
                    if (res.code == 200) {
                        this.auditShow = false;
                        this.$message(this.auditStatus == 2 ? '审核成功' : '驳回成功', 'success');
                        // this.totalS = this.totalS - 1;
                        // if (this.pageNum * 10 - this.totalS === 10) {
                        // 	this.pageNum = this.pageNum - 1 || 1
                        // }
                        this.getThemeList();
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
            this.getThemeList();
        },
        //新增编辑 0编辑 1新增
        add(type, val) {
            if (type == 0) {
                if (val.status == 0 || val.status == 3) {
                    this.$router.push({path: '/sm/themeaddedit', query: {themeid: val ? val.id : ''}});
                }
            } else {
                this.$router.push('/sm/themeaddedit');
            }
        },
        //详情
        detail(val) {
            if (this.permission.info) {
                this.$router.push({path: '/sm/themedetail', query: {themeid: val.id}});
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        //送审 审核 发布判断过期时间
        judgeEndTime(time) {
            if (getNowDate() > time) {
                this.$message('该主题已过结束时间，无法操作', 'error');
                return true;
            }
            return false;
        },
    },
    filters: {
        hot(val) {
            return val == 0 ? '否' : '是';
        },
        theme(val) {
            let arr = ['待提交', '待审核', '待发布', '驳回', '已发布'];
            return arr[val];
        },
        live(val) {
            let arr = ['预告中', '授课中', '已结束'];
            if (val == -1) {
                return '-';
            }
            return arr[val];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.operat-list {
    display: flex;
    justify-content: space-around;
    color: #b3b6ba;
    font-size: 14px;
    cursor: pointer;
    .active {
        color: #409eff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
.dialog-item {
    p:first-child {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}
</style>
