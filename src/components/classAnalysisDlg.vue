<template>
    <el-dialog
        :visible.sync="detailDlg.visible"
        width="100%"
        v-if="detailDlg.visible"
        :show-close="false"
        class="class-analysis-dlg"
    >
        <div slot="title" class="dialog-title">
            <div>
                <span>{{ detailDlg.title }}</span>
                <el-tooltip :content="detailDlg.text" placement="bottom-start" popper-class="tooltip-content" class="tooltip-icon">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </div>
            <img src="../assets/imgs/x.png" alt="" @click.prevent="closeDlg" />
        </div>
        <detailCount
            ref="detailCount"
            :countList="countList"
            :allRangeText="allRangeText"
            :options="options"
            :isScoreAnalysisType="true"
        ></detailCount>
        <div class="bottom-content">
            <div class="statistics">
                <p class="sec-title">统计情况</p>
                <div class="select-group">
                    <div class="rect-left">
                        <div class="white-rect"></div>
                        <div class="blue-rect"></div>
                    </div>
                    <el-input
                        placeholder="请输入课程名称"
                        v-model="inputValue"
                        suffix-icon="el-icon-search"
                        @change="changeInput"
                        :clearable="true"
                    >
                    </el-input>
                    <div class="rect-right">
                        <div class="blue-rect"></div>
                        <div class="white-rect"></div>
                    </div>
                </div>
            </div>
            <commonTable
                :columns="columns"
                :tableData="tableData"
                :showPage="true"
                :pageInfo="pageInfo"
                :stripe="true"
                :getTableData="getTableData"
                :sortParams="sortParams"
            >
                <template #slotColumn="{row, column}">
                    <div v-if="column.prop == 'name'" class="underline-text" @click="clickRowLine(row, column.prop)">
                        {{ row.name }}
                    </div>
                    <div v-if="column.prop == 'classroomScore'" class="classroom-score">
                        <el-progress
                            :percentage="parseFloat(row.classroomScore)"
                            :color="
                                row.districtRank == '1'
                                    ? '#FE4C4C'
                                    : row.districtRank == '2'
                                    ? '#ba9100'
                                    : row.districtRank == '3'
                                    ? '#29CF73'
                                    : '#17b0fc'
                            "
                            :define-back-color="
                                row.districtRank == '1'
                                    ? '#FE4C4C33'
                                    : row.districtRank == '2'
                                    ? '#ba910033'
                                    : row.districtRank == '3'
                                    ? '#29cf7333'
                                    : '#17b0fc33'
                            "
                            :style="{
                                'border-color':
                                    row.districtRank == '1'
                                        ? '#FE4C4C80'
                                        : row.districtRank == '2'
                                        ? '#ba910080'
                                        : row.districtRank == '3'
                                        ? '#29cf7380'
                                        : '#17b0fc80',
                            }"
                            :show-text="false"
                            :stroke-width="8"
                        ></el-progress
                        ><span>{{ row.classroomScore }}</span>
                    </div>
                </template>
            </commonTable>
        </div>
    </el-dialog>
</template>

<script>
import detailCount from '@/components/detailCount';
import commonTable from '@/components/commonTable.vue';
export default {
    components: {
        detailCount,
        commonTable,
    },
    props: {
        countList: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allRangeText: {
            type: String,
            default: '',
            text: '',
        },
        detailDlg: {
            type: Object,
            default: () => {
                return {
                    visible: false,
                    title: '',
                };
            },
        },
        options: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            columns: [
                {prop: 'name', label: '课程名称', width: '350', align: 'center', slot: true},
                {prop: 'subjectName', label: '学科'},
                {prop: 'gradeName', label: '年级'},
                {prop: 'courseTypeName', label: '课堂类型'},
                {prop: 'classroomScore', label: '课堂评分', slot: true, align: 'center', sortable: 'custom'},
                {prop: 'startTime', label: '上课时间', width: '450', align: 'center', sortable: 'custom'},
            ],
            tableData: [],
            pageInfo: {
                total: 0,
                size: 10,
                index: 1,
            },
            dateOptions: [
                {
                    value: 0,
                    label: '按月统计',
                },
                {
                    value: 1,
                    label: '按周统计',
                },
            ],
            inputValue: '',
            selectValue: 6, //按课程统计
            isFirstEnter: true,
            sortParams: {},
        };
    },
    methods: {
        getTableData(params) {
            this.$comjs.getDlgTableData(params, '/ai/bigdata/getClassroomTeachingScoreRankingList', this);
        },
        clickRowLine(row, prop) {
            let msg = this.$comjs.clickRowLine(row, prop, this);
            if (msg) {
                this.$emit('pageChange', msg);
                // 课程跳转，弹窗不关闭
                this.$comjs.closeDlg(this);
            }
        },
        closeDlg() {
            this.$comjs.closeDlg(this);
        },
        changeInput(val) {
            this.$comjs.staticInputChange(val, this);
        },
        setScoreAnalysisType() {
            this.$refs.detailCount.setScoreAnalysisType();
        },
        drawLineChart(params) {
            this.$nextTick(() => {
                this.$refs.detailCount.getTeacherDistrictRankingList(params);
            });
        },
    },
};
</script>

<style lang="scss">
.class-analysis-dlg {
    .bottom-content {
        height: 55% !important;

        .common-table {
            height: calc(100% - 60px);
        }
    }
}
</style>
