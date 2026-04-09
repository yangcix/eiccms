<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header @back="goBack" :content="`${$route.query.id ? '编辑' : '新增'}大单元分析`"></el-page-header>
        </p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div style="width: 100%; min-width: 1160px">
                    <div class="item-scroll-left">
                        <div class="item-wrap" v-if="aiConfigType == 1">
                            <p style="width: 150px">大单元分析剩余次数<em></em>：</p>
                            {{ largeUnitCount }}次
                        </div>
                        <div class="item-wrap">
                            <p style="width: 145px; margin-right: 10px">大单元分析名称<em>*</em></p>
                            <el-input class="width-2" v-model="addEditInfo.name" clearable></el-input>
                            <!--          <el-button type="primary" class="save-btn" @click="save()">创建分析</el-button>-->
                        </div>
                        <div class="item-wrap">
                            <p style="width: 145px; margin-right: 10px">科目<em>*</em></p>
                            <el-select
                                :popper-append-to-body="false"
                                v-model="addEditInfo.subjectId"
                                placeholder="选择科目"
                                class="width-2"
                            >
                                <el-option
                                    v-for="item in subjectList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item-scroll-right">
                        <p class="item-scroll-right-p">
                            <span>* 注：</span>
                            <span style="padding-left: 4px">请选择科目后再</span>
                            <span style="color: red">点击【添加课堂】</span>
                            <span
                                >，添加完按照课堂在单元中的顺序，拖拽排序图标进行排序，使得“第一课”在表格最上边，“最后一课”在最下边。确认无误后，</span
                            >
                            <span style="color: red">点击【确认】按钮进行创建。</span>
                        </p>
                    </div>
                </div>
                <div class="item-scroll-line">
                    <div class="item-wrap">
                        <el-button style="margin-right: 20px" type="primary" @click="handleAdd()">添加课堂</el-button>
                        <el-button
                            style="margin-right: 20px"
                            v-if="addEditInfo.largeUnitClassList.length > 0"
                            @click="clearAlert()"
                        >
                            清空选择
                        </el-button>
                        <el-button style="margin-right: 20px; background-color: #b3b6ba; color: #ffffff" v-else disabled
                            >清空选择
                        </el-button>
                        <!--            <el-button style="margin-right: 20px" type="primary" @click="save()">确认添加</el-button>-->
                    </div>
                </div>

                <div v-if="addEditInfo.largeUnitClassList.length != 0" class="info-list">
                    <div>
                        <el-table
                            row-key="id"
                            :row-style="{height: '10px'}"
                            :cell-style="{padding: '10px 0'}"
                            v-loading="loading"
                            :data="addEditInfo.largeUnitClassList"
                            style="width: 100%; height: 100%"
                            @row-drag-end="onRowDragEnd"
                        >
                            <el-table-column label="序号" align="center" width="73px">
                                <template v-slot="{row}">
                                    {{ addEditInfo.largeUnitClassList.indexOf(row) + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="courseName" label="课程名称"> </el-table-column>
                            <el-table-column align="center" prop="teacherName" label="授课教师"></el-table-column>
                            <el-table-column align="center" prop="schoolName" label="学校"> </el-table-column>
                            <el-table-column align="center" prop="gradeName" label="年级"> </el-table-column>
                            <el-table-column align="center" prop="classTime" label="上课时间"></el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <div class="iconList">
                                        <span style="margin-right: 10px">
                                            <i
                                                class="iconfont icon-ketuozhuai"
                                                style="color: rgb(0, 116, 208)"
                                                @click="rowDrop()"
                                            ></i
                                        ></span>
                                        <span>
                                            <i
                                                class="iconfont icon-shanchu1"
                                                style="color: rgb(255, 81, 64)"
                                                @click="deleteData(scope.row)"
                                            ></i>
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div>
                        <div style="margin-left: 40px; height: 60px; line-height: 60px">
                            <span>已选择 </span>
                            <span style="color: red"
                                >{{
                                    addEditInfo.largeUnitClassList.length ? addEditInfo.largeUnitClassList.length : 0
                                }}节课</span
                            >
                        </div>
                    </div>
                </div>

                <div v-else class="info-list">
                    <div class="null-data">
                        <img src="../../assets/imgs/home-null.png" alt="" />
                        <p>暂无数据，请添加课堂数据！</p>
                    </div>
                </div>
            </div>
            <div class="item-scroll-bottom">
                <el-button type="primary" class="save-btn" @click="!$route.query.id ? save() : update()"
                    >确认</el-button
                >
            </div>
        </div>

        <el-dialog
            title="添加课堂"
            :close-on-click-modal="false"
            :visible.sync="addEditShow"
            width="1000px"
            @close="cancel()"
        >
            <hr class="line" />
            <div class="dialog-scrollTo">
                <div>
                    <el-input
                        style="width: 302px; margin-left: 20px"
                        v-model="searchKey"
                        label=""
                        clearable
                        placeholder="请输入课程名称/授课教师关键字进行查询"
                        v-search="handleSearch"
                    ></el-input>
                    <el-button type="primary" class="search-btn" @click="handleSearch">查询 </el-button>
                </div>

                <div class="table-list">
                    <el-table
                        ref="multipleTable"
                        v-loading="loading"
                        :row-style="{height: '10px'}"
                        :cell-style="{padding: '10px 0'}"
                        :data="classroomList"
                        :default-checked-keys="selectRowKeys"
                        row-key="id"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column align="left" type="selection" reserve-selection width="50"> </el-table-column>
                        <el-table-column align="left" prop="courseName" label="课程名称" width="232"> </el-table-column>
                        <el-table-column align="left" prop="teacherName" label="授课教师"> </el-table-column>
                        <el-table-column align="left" prop="schoolName" label="学校"> </el-table-column>
                        <el-table-column align="left" prop="gradeName" label="年级"> </el-table-column>
                        <el-table-column align="left" prop="classTime" label="上课时间"> </el-table-column>
                    </el-table>
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
                <div>
                    <p style="margin-left: 20px; margin-top: 20px; color: red">
                        已选：{{ selectClassroomList.length ? selectClassroomList.length : 0 }} 节课
                    </p>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="confirm()" style="margin-left: 20px; margin-right: 15px"
                        >确定
                    </el-button>
                    <el-button @click="cancel()">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Sortable from 'sortablejs';

export default {
    name: '',
    data() {
        return {
            largeUnitCount: 0,
            subjectList: [],
            versions: JSON.parse(sessionStorage.getItem('userInfo')) || [],
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            aiConfigType: JSON.parse(localStorage.getItem('sysInfo')).type,
            searchKey: '',
            addEditInfo: {
                id: '',
                name: '', // 大单元分析名称
                subjectId: '', // 科目id
                aiConfigId: '',
                largeUnitClassList: [], //已选课堂数据
            },
            classroomList: [], // 添加课堂列表课堂数据
            selectClassroomList: [], // 选中的课堂数据
            selectRowKeys: [], // 存储选择状态的对象
            addEditShow: false, // 添加课堂弹窗
            loading: false, // 表格加载
            permission: '',
            pageNum: 1,
            pages: 0,
            totalS: '',
        };
    },
    mounted() {
        this.getSubjectList();
        this.getUserAiBalance();
        if (this.$route.query.id) {
            this.Id = this.$route.query.id;
            this.getLargeUnitInfo();
        }
        this.$nextTick(() => {
            this.rowDrop();
        });
    },
    methods: {
        // 获取科目
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
            });
        },
        // 获取用户AI剩余次数
        getUserAiBalance() {
            this.$axios.get('/aiDistributionPersonal/getUserAiBalance').then((res) => {
                this.largeUnitCount = res.data.aiLargeUnitBalanceNumber;
            });
        },
        // 课堂管理列表数据
        getClassroom() {
            this.$axios
                .get('/aiLargeUnit/listClassroom', {
                    subjectId: this.addEditInfo.subjectId,
                    keyWord: this.searchKey,
                    pageNum: this.pageNum, // 页数
                    pageSize: 10, // 请求显示条数
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.classroomList = res.data.pageList;
                        this.pages = res.data.pages;
                        this.permission = this.creatPermit(res.data.permit);
                        this.loading = false;
                        this.totalS = res.data.total;

                        // 选中状态
                        console.log('this.selectRowKeys....................', this.selectRowKeys);
                        if (this.selectRowKeys.length > 0) {
                            this.classroomList.forEach((item) => {
                                if (this.selectRowKeys.includes(item.id)) {
                                    this.$refs.multipleTable.toggleRowSelection(item, true);
                                }
                                if (this.selectClassroomList.length < this.selectRowKeys.length) {
                                    const selectIdMap = new Map(
                                        this.selectClassroomList.map((item) => [item.id, item])
                                    );
                                    this.selectRowKeys.forEach((selectRowKey) => {
                                        const selectRow = selectIdMap.get(selectRowKey);
                                        if (!selectRow) {
                                            console.log('添加selectClassroomList。。。。', item);
                                            this.selectClassroomList.push(item);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
        },
        // 获取编辑数据
        getLargeUnitInfo() {
            this.$axios.get('/aiLargeUnit/info', {id: this.Id}).then((res) => {
                if (res.code === 200) {
                    this.addEditInfo.id = res.data.id;
                    this.addEditInfo.name = res.data.name;
                    this.addEditInfo.subjectId = res.data.subjectId;
                    this.addEditInfo.largeUnitClassList = res.data.largeUnitClassVos;
                }
            });
        },
        // 添加课堂弹窗
        handleAdd() {
            if (!this.addEditInfo.subjectId) {
                this.$message('请选择科目！', 'error');
                return;
            }
            this.pageNum = 1;
            this.searchKey = '';
            this.getClassroom();
            if (this.addEditInfo.largeUnitClassList.length > 0) {
                this.addEditInfo.largeUnitClassList.forEach((item) => {
                    this.selectRowKeys.push(item.id);
                });
            }
            this.addEditShow = true;
        },
        // 清空前确认
        clearAlert() {
            this.$confirm(`确认清空当前选择吗？`, '清空确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.clear();
                })
                .catch(() => reject());
        },
        clear() {
            this.addEditInfo.largeUnitClassList = [];
            this.selectClassroomList = [];
            this.selectRowKeys = [];
            this.classroomList.forEach((item, index) => {
                this.$set(this.classroomList, index, {...item, isSelected: false});
            });
            this.$refs.multipleTable.clearSelection();
        },
        // 添加课堂确认
        confirm() {
            if (this.addEditInfo.largeUnitClassList.length >= 20) {
                this.$message('可分析课堂节数，仅可在2-20节课之间', 'error');
                return;
            }
            /*if (this.checkDuplicateData()) {
        this.$message("不可选择已添加的课堂数据", "error");
        return;
      }*/
            if (this.selectClassroomList < 1) {
                this.$message('请勾选需要的课堂数据后再操作！', 'error');
                return;
            }
            this.selectClassroomList.forEach((item) => {
                const unitClassAddIdMap = new Map(
                    this.addEditInfo.largeUnitClassList.map((unitClassItem) => [unitClassItem.id, unitClassItem])
                );
                if (!unitClassAddIdMap.get(item.id)) {
                    this.addEditInfo.largeUnitClassList.push(item);
                }
                if (!this.selectRowKeys.includes(item.id)) {
                    this.selectRowKeys.push(item.id);
                }
            });
            this.addEditShow = false;
            this.$nextTick(() => {
                this.rowDrop();
            });
        },
        //多选
        handleSelectionChange(val) {
            if (this.selectRowKeys.length < 1) {
                console.log('添加课堂多选数据： ', val);
                this.selectClassroomList = [];
                // 更新选择状态
                this.selectRowKeys = [];
                val.forEach((item) => {
                    this.selectClassroomList.push(item);
                    this.selectRowKeys.push(item.id);
                });
            } else {
                val.forEach((item) => {
                    if (!this.selectRowKeys.includes(item.id)) {
                        this.selectClassroomList.push(item);
                        this.selectRowKeys.push(item.id);
                    }
                });
            }
        },
        // 检测是否有重复数据
        checkDuplicateData() {
            if (!this.selectClassroomList || !this.addEditInfo.largeUnitClassList) {
                return false;
            }
            for (let selectedClassroom of this.selectClassroomList) {
                // 在 addEditInfo.largeUnitClassList 中查找与 selectedClassroom 有相同 id 和 type 的元素
                const isDuplicate = this.addEditInfo.largeUnitClassList.some((classroom) => {
                    return classroom.id === selectedClassroom.id && classroom.type === selectedClassroom.type;
                });
                // 如果找到相同的数据，则报错
                if (isDuplicate) {
                    return true; // 返回true表示找到了重复的数据
                }
            }
            // 如果没有找到重复的数据，则返回false
            return false;
        },
        // 添加课堂取消
        cancel() {
            this.selectRowKeys = [];
            this.selectClassroomList = [];
            this.classroomList.forEach((item, index) => {
                this.$set(this.classroomList, index, {...item, isSelected: false});
            });
            if (this.$refs.multipleTable) {
                this.$refs.multipleTable.clearSelection();
            }
            this.addEditShow = false;
        },
        // 课堂数据删除
        deleteData(row) {
            const index = this.addEditInfo.largeUnitClassList.findIndex(
                (item) => item.id === row.id && item.type === row.type
            );
            if (index !== -1) {
                this.addEditInfo.largeUnitClassList.splice(index, 1);
            } else {
                console.warn('未找到', row.name, '的数据项');
            }
        },
        // 课堂管理查询
        handleSearch() {
            this.pageNum = 1;
            this.getClassroom();
        },
        // 创建分析
        save() {
            if (this.verify()) {
                return;
            }
            this.addEditInfo.aiConfigId = this.aiType;
            this.$axios.post('/aiLargeUnit/save', this.addEditInfo).then((res) => {
                if (res.code === 200) {
                    this.$message('新增成功', 'success');
                    this.goBack();
                }
            });
        },
        update() {
            if (this.verify()) {
                return;
            }
            this.$axios.post('/aiLargeUnit/update', this.addEditInfo).then((res) => {
                if (res.code === 200) {
                    this.$message('编辑成功', 'success');
                    this.goBack();
                }
            });
        },
        //验证
        verify() {
            if (!this.addEditInfo.name) {
                this.$message('大单元分析名称不能为空！', 'error');
                return true;
            }
            if (this.addEditInfo.name.length > 50) {
                this.$message('大单元分析名称由中文大小写字母数字组成，最长50位！', 'error');
                return true;
            }
            const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
            if (!regex.test(this.addEditInfo.name)) {
                this.$message('大单元分析名称由中文大小写字母数字组成，最长50位！', 'error');
                return true;
            }
            if (!this.addEditInfo.subjectId) {
                this.$message('请选择科目！', 'error');
                return true;
            }
            if (this.addEditInfo.largeUnitClassList.length == 0) {
                this.$message('请添加需要课堂数据后再操作！', 'error');
                return true;
            }
            if (this.addEditInfo.largeUnitClassList.length < 2 || this.addEditInfo.largeUnitClassList.length > 21) {
                this.$message('可分析课堂节数，仅可在2-20节课之间！', 'error');
                return true;
            }
            if (this.largeUnitCount == 0) {
                this.$message('大单元分析剩余次数不足！', 'error');
                return true;
            }
        },
        rowDrop() {
            if (this.addEditInfo.largeUnitClassList.length < 1) {
                return;
            }
            let tbody = document.querySelector('.el-table__body-wrapper tbody');
            let _this = this;
            Sortable.create(tbody, {
                group: {
                    name: 'words',
                    pull: true,
                    put: true,
                },
                animation: 150, // ms, number 单位：ms，定义排序动画的时间
                onAdd: function (evt) {
                    // 拖拽时候添加有新的节点的时候发生该事件
                },
                onUpdate: function (evt) {
                    // 拖拽更新节点位置发生该事件
                },
                onRemove: function (evt) {
                    // 删除拖拽节点的时候促发该事件
                },
                onStart: function (evt) {
                    // 开始拖拽出发该函数
                },
                onSort: function (evt) {
                    // 发生排序发生该事件
                },
                onEnd({newIndex, oldIndex}) {
                    // 结束拖拽
                    let currRow = _this.addEditInfo.largeUnitClassList.splice(oldIndex, 1)[0];
                    _this.addEditInfo.largeUnitClassList.splice(newIndex, 0, currRow);
                },
            });
        },
        onRowDragEnd(newIndex, oldIndex) {
            console.log(`Row drag end: from ${oldIndex} to ${newIndex}`);
        },
        //分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.getClassroom();
        },
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('dialog-scrollTo')[0].scrollTo(0, 0);
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/aiLargeUnit');
            } else {
                this.$router.go(-1);
            }
        },
    },
    watch: {
        pageNum: function (newVal) {
            this.getClassroom();
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-wrap {
    overflow-x: auto;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    min-width: 1160px;
    padding: 0 45px;
}

.box {
    width: 100%;
    height: 100%;
}

.item-scroll {
    width: 100%;

    .box {
        min-width: 900px;
        width: 100%;
        height: 100%;
    }
}

.item-scroll-left {
    width: 33%;
    float: left;
}

.item-scroll-right {
    width: 62%;
    float: right;
    height: 106px;
    margin-top: 90px;
    //margin-left: 20px;
    background-color: #f9f9f9;
    border: 1px dashed #d7d7d7;
    border-radius: 12px;
    position: relative;
}

.item-scroll-right-p {
    width: 92%;
    height: 36px;
    font-size: 13px;
    margin-top: 42px;
    padding: 0 10px 0 10px;
}

.item-scroll-line {
    width: 100%;
    float: left;
}

.item-wrap {
    display: flex;
    align-items: center;
    margin-top: 25px;

    em {
        color: #f64646;
    }

    p:first-child {
        width: 120px;
        height: 40px;
        line-height: 40px;
        color: #303133;
        font-size: 14px;
    }

    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }

    .class-type {
        cursor: pointer;

        .act {
            border: solid 3px #5b8cff;
            border-radius: 8px;
        }

        img {
            width: 286px;
            height: 159px;
            border: solid 3px #fff;
        }

        p {
            margin-top: 7px;
            text-align: center;
            font-size: 14px;
            color: #606266;
        }
    }
}

.line {
    margin-top: -30px;
    margin-bottom: 20px;
    color: #ffffff;
}

.save-btn {
    width: 160px;
    height: 40px;
    margin-left: auto;
}

.dialog-btn {
    padding: 20px 0 0 0;
    display: flex;
    justify-content: left;
}

#vp {
    display: none;
}

.null-data {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;

    img {
        padding-top: 20px;
        width: 480px;
        height: 200px;
    }

    p {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
        color: rgb(117, 112, 112);
    }
}

.tableData {
    border: 1px solid #ebebeb;
    margin-top: 30px;
    height: calc(100vh - 100px); /* 页面高度减去顶部和底部间距 */
    overflow-y: auto;
}

.info-list {
    padding: 0 24px;
    border: 1px solid #ebebeb;
    margin-top: 20px;
    overflow-y: auto;
    float: left;
    width: calc(100% - 48px - 2px);
    height: 1200px;
    min-width: 1160px;
    overflow-x: auto;
    margin-bottom: 60px;
}

.table-list {
    padding: 0 24px;
    border: 1px solid #ebebeb;
    margin-top: 20px;
    margin-left: 20px;
}

.item-scroll-bottom {
    width: 200px;
    height: 46px;
    background-color: white;
    position: absolute;
    bottom: 11%;
}

.el-pagination {
    padding: 0 5px 20px;
}
</style>
