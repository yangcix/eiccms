<template>
    <div class="content-main-wrap">
        <p class="content-title">教学建议配置</p>

        <div class="main-wrap">
            <div class="search-operat" style="min-width: 1250px">
                <div>
                    <span class="search-desc">学科：</span>
                    <el-select
                        v-model="subjectId"
                        placeholder="选择学科"
                        class="width-3"
                        style="margin-left: 10px; width: 150px"
                    >
                        <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc">学段：</span>
                    <!-- <span class="search-desc">直播：</span> -->
                    <el-select v-model="gradeId" placeholder="选择学段" style="margin-left: 10px; width: 150px">
                        <el-option v-for="item in studyGradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc">课堂类型：</span>
                    <el-select v-model="classTypeId" placeholder="选择课堂类型" style="margin-left: 10px; width: 150px">
                        <el-option v-for="item in classTypeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc">分类：</span>
                    <el-select v-model="classification" placeholder="选择分类" style="margin-left: 10px; width: 150px">
                        <el-option
                            v-for="item in classificationList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="handleSearch">查询</el-button>
                </div>
                <div>
                    <el-button icon="el-icon-plus" @click="handleEdit(0)">新增</el-button>
                </div>
            </div>
            <div class="data-table table-border" style="min-width: 1150px">
                <el-table
                    :row-style="{height: '10px'}"
                    :cell-style="{padding: '12px 0'}"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column prop="subjectName" align="center" label="学科"></el-table-column>
                    <el-table-column prop="gradeName" align="center" label="学段"></el-table-column>
                    <el-table-column prop="classTypeName" align="center" label="课堂类型"></el-table-column>
                    <el-table-column align="center" label="分类">
                        <template slot-scope="scope">
                            <ul>
                                <li v-if="scope.row.classification === 0">教学指导</li>
                                <li v-if="scope.row.classification === 1">课前指导</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="center" align="center" label="提示词">
                        <template slot-scope="scope">
                            <div class="btnList">
                                <el-button type="text" @click="viewPromptWordsDialog(scope.row)">查看</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="160px" label="操作">
                        <template slot-scope="scope">
                            <div class="btnList">
                                <el-button type="text" @click="handleEdit(1, scope.row)">编辑</el-button>
                                <el-button
                                    type="text"
                                    v-if="scope.row.defaultFlag == 0"
                                    @click="handleDelete(0, scope.row)"
                                    >删除</el-button
                                >
                            </div>
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
                :title="teachingSuggestion.name"
                :visible.sync="promptWordsDialog"
                width="68%"
                :before-close="closePromptWordsDialog"
            >
                <h2 style="width: fit-content; margin: 0 auto">
                    【
                    <span>{{ teachingSuggestion.classificationName }} - </span>
                    <span v-if="teachingSuggestion.gradeName !== '-'">{{ teachingSuggestion.gradeName }} - </span>
                    <span>{{ teachingSuggestion.subjectName }}</span>
                    <span v-if="teachingSuggestion.classTypeName !== '-'"
                        >- {{ teachingSuggestion.classTypeName }}</span
                    >
                    】的教学建议提示词
                </h2>
                <div style="margin-top: 40px; max-width: 100%; padding: 20px; max-height: 500px; overflow-y: auto">
                    <!--          <p>{{ teachingSuggestion.promptWords }}</p>-->
                    <div style="white-space: pre-wrap">{{ teachingSuggestion.promptWords }}</div>
                </div>
            </el-dialog>

            <el-dialog title="删除" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">确认删除该教学建议配置？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="handleDelete(1)">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            pages: 1,
            pageNum: 1,
            tableData: [],
            loading: false,
            promptWordsDialog: false,
            deleteShow: false,
            subjectId: '',
            gradeId: '',
            classTypeId: '',
            classification: '',
            subjectList: [],
            studyGradeList: [],
            classTypeList: [],
            teachingSuggestion: {
                id: '',
                name: '',
                promptWords: '',
                subjectName: '',
                gradeName: '',
                classTypeName: '',
            },
            classificationList: [
                {value: '', label: '全部'},
                {value: 0, label: '教学指导'},
                {value: 1, label: '课前指导'},
            ],
        };
    },
    created() {},
    mounted() {
        this.defaultQueryParam();
        this.getSubjectList();
        this.getStudyGradeList();
        this.getClassTypeList();
        this.handleGetData();
    },
    methods: {
        getSubjectList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 1}).then((res) => {
                this.subjectList = res.data;
                this.subjectList.unshift({
                    id: '',
                    name: '全部',
                });
            });
        },
        getStudyGradeList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 44}).then((res) => {
                this.studyGradeList = res.data;
                this.studyGradeList.unshift({
                    id: '',
                    name: '全部',
                });
            });
        },
        getClassTypeList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 33}).then((res) => {
                this.classTypeList = res.data;
                this.classTypeList.unshift({
                    id: '',
                    name: '全部',
                });
            });
        },
        viewPromptWordsDialog(row) {
            this.promptWordsDialog = true;
            this.teachingSuggestion = row;
        },
        closePromptWordsDialog() {
            this.promptWordsDialog = false;
        },
        handleGetData() {
            this.loading = true;
            this.$axios
                .get('/teachingSuggestionConfig/list', {
                    subjectId: this.subjectId,
                    gradeId: this.gradeId,
                    classTypeId: this.classTypeId,
                    classification: this.classification,
                    pageNum: this.pageNum,
                    pageSize: 10,
                })
                .then((res) => {
                    console.log(res, '数据22');
                    if (res.code === 200) {
                        this.tableData = res.data.pageList;
                        this.pages = res.data.pages;
                        this.loading = false;
                        this.totalS = res.data.total;
                    }
                });
        },
        // 搜索
        handleSearch() {
            this.scrollTo0();
            this.pageNum = 1;
            this.handleGetData();
        },
        handleEdit(type, row) {
            if (type == 0) {
                this.$router.push('/teachingSuggestionConfig/eidt');
            } else {
                this.$router.push('/teachingSuggestionConfig/eidt?id=' + row.id);
            }
        },
        handleDelete(type, row) {
            if (type == 0) {
                this.teachingSuggestion = row;
                this.deleteShow = true;
            } else {
                if (!this.teachingSuggestion.id) {
                    this.$message('请删除删除的某项数据！', 'error');
                    return;
                }
                this.$axios.post('/teachingSuggestionConfig/delete', [this.teachingSuggestion.id]).then((res) => {
                    if (res.code === 200) {
                        this.$message('删除成功！', 'success');
                        this.deleteShow = false;
                        this.handleGetData();
                    }
                });
            }
        },
        defaultQueryParam() {
            this.id = '';
            this.subjectId = '';
            this.gradeId = '';
            this.classTypeId = '';
            this.classification = '';
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
            this.handleGetData();
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.sublevel {
    padding-left: 84px;
    overflow: hidden;

    .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.tableName {
    color: #409eff;
    cursor: pointer;
}

#videoAlert {
    width: 100% !important;
}

.btnList {
    a {
        padding-right: 10px;
    }

    li {
        text-decoration: none;
    }
}

.dialog-item {
    display: flex;
    align-items: center;

    // margin-top: 25px;
    em {
        color: #f64646;
    }

    p:first-child {
        width: 84px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }
}

::v-deep .el-upload-dragger {
    width: 320px;
    height: 133px;
}

::v-deep .upload-democlip .el-upload-list {
    margin: -145px 0 0 15px;
    width: 290px;
}

.upload-democlip .el-upload-list__item-status-label {
    display: block;
}

.upload-democlip {
    height: 140px;
}

.el-upload-dragger .el-icon-upload {
    margin: 30px 0 16px;
}

.videoBox {
    ::v-deep .el-dialog__body {
        padding: 0 20px 30px 20px;
    }
}

::v-deep .videoEnd {
    width: 560px;
    height: 337.5px;
    background: #000;

    p {
        color: white;
        text-align: center;
        line-height: 337.5px;
    }
}

.popUp {
    margin-left: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: white;
}

.prompt {
    color: gray;
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.resetting {
    ::v-deep .el-dialog__title {
        padding-left: 20px;
    }
}
</style>
