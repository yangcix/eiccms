<template>
    <el-dialog :visible.sync="detailDlg.visible" width="100%" v-if="detailDlg.visible" :show-close="false">
        <div slot="title" class="dialog-title">
            <div>
                <span>{{ detailDlg.title }}</span>
                <el-tooltip
                    :content="detailDlg.text"
                    placement="bottom-start"
                    popper-class="tooltip-content"
                    class="tooltip-icon"
                >
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </div>
            <img src="../assets/imgs/x.png" alt="" @click.prevent="closeDlg" />
        </div>
        <detailCount
            ref="detailCount"
            @changeChart="changeChart"
            :countList="countList"
            :allRangeText="allRangeText"
            :pie1Options="pie1Options"
            :pie2Options="pie2Options"
            @selectChange="selectChange"
            :isDbPie="true"
        ></detailCount>
        <div class="bottom-content">
            <div class="statistics">
                <p class="sec-title">统计情况</p>
                <div class="select-group">
                    <div class="rect-left">
                        <div class="white-rect"></div>
                        <div class="blue-rect"></div>
                    </div>
                    <el-select
                        v-model="selectValue"
                        @change="selectChange"
                        v-show="showSelect"
                        popper-class="statistics_select"
                    >
                        <el-option
                            v-for="item in optionArray"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <div class="rect-right">
                        <div class="blue-rect"></div>
                        <div class="white-rect"></div>
                    </div>
                    <el-input
                        :placeholder="inputPlaceholder"
                        v-model="inputValue"
                        suffix-icon="el-icon-search"
                        v-show="showInput"
                        @change="changeInput"
                        :clearable="true"
                    >
                    </el-input>
                    <div class="rect-right" v-show="showInput">
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
                    <div
                        v-if="column.prop == 'regionPath'"
                        class="underline-text"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.regionPath }}
                    </div>
                    <div
                        v-if="column.prop == 'schoolName'"
                        class="underline-text"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.schoolName }}
                    </div>
                    <div
                        v-if="column.prop == 'teacherName'"
                        class="underline-text"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.teacherName }}
                    </div>
                    <div
                        v-if="column.prop == 'name'"
                        :class="{'underline-text': selectValue != 3 && selectValue != 4}"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.name }}
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
        pie1Options: {
            type: Object,
            default: () => {},
        },
        pie2Options: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            selectValue: 0,
            columns: [
                // 不设置宽度会自动填补表格剩余宽度
                {prop: 'name', label: '课程名称', slot: true, minWidth: '130'},
                {prop: 'teacherName', label: '教师名称', slot: true, isShow: false},
                {prop: 'schoolName', label: '学校名称', slot: true, isShow: false, minWidth: '130'},
                {prop: 'regionPath', label: '所在地区', slot: true, minWidth: '280'},
                {prop: 'courseTypeName', label: '课堂类型', isShow: false},
                {prop: 'subjectName', label: '学科名称', isShow: false},
                {prop: 'gradeName', label: '年级名称', isShow: false, minWidth: '100'},
                {prop: 'teacherCount', label: '参与教师数', sortable: 'custom'},
                {prop: 'aiClassCount', label: 'AI课堂数', sortable: 'custom'},
                {
                    prop: 'conceptToThinkingPracticeRatio',
                    label: '概念→思想练习',
                    width: '160',
                    sortable: 'custom',
                    suffix: '%',
                },
                {
                    prop: 'sceneToInternalizationConstructionRatio',
                    label: '场景→内化建构',
                    width: '160',
                    sortable: 'custom',
                    suffix: '%',
                },
                {
                    prop: 'conceptToInternalizationConstructionRatio',
                    label: '概念→内化建构',
                    width: '160',
                    sortable: 'custom',
                    suffix: '%',
                },
                {
                    prop: 'sceneToThinkingPracticeRatio',
                    label: '场景→思想练习',
                    width: '160',
                    sortable: 'custom',
                    suffix: '%',
                },
                {
                    prop: 'realisticStyleRatio',
                    label: '现实型',
                    width: '140',
                    sortable: 'custom',
                    isShow: false,
                    suffix: '%',
                },
                {
                    prop: 'perceptualStyleRatio',
                    label: '感悟型',
                    width: '140',
                    sortable: 'custom',
                    isShow: false,
                    suffix: '%',
                },
                {
                    prop: 'philosophicalStyleRatio',
                    label: '哲理型',
                    width: '140',
                    sortable: 'custom',
                    isShow: false,
                    suffix: '%',
                },
                {
                    prop: 'dynamicStyleRatio',
                    label: '能动型',
                    width: '140',
                    sortable: 'custom',
                    isShow: false,
                    suffix: '%',
                },
                {prop: 'startTime', label: '上课时间', isShow: false, sortable: 'custom', minWidth: '180'},
            ],
            tableData: [],
            pageInfo: {
                total: 0,
                size: 10,
                index: 1,
            },
            chartName: '教师教学风格',
            selectValue: 1,
            optionArray: [],
            allOptionArray: [
                {value: 1, label: '按区/县统计'},
                {value: 2, label: '按学校统计'},
                {value: 3, label: '按学科统计'},
                {value: 4, label: '按年级统计'},
                {value: 5, label: '按教师统计'},
                {value: 6, label: '按课程统计'},
            ],
            inputPlaceholder: '',
            showInput: false,
            inputValue: '',
            showSelect: true,
            defaultParams: {},
            isFirstEnter: true,
            sortParams: {},
            initialValue: 1,
        };
    },
    methods: {
        getTableData(params) {
            if (this.chartName == '教师教学风格') {
                this.$comjs.getDlgTableData(params, '/ai/bigdata/getTeachingStyleStatsList', this);
            } else {
                this.$comjs.getDlgTableData(params, '/ai/bigdata/getLearningStyleStatsList', this);
            }
        },
        operateColumns(val) {
            // 教师教学风格图表列
            let teacherChartArray = [
                'conceptToThinkingPracticeRatio',
                'sceneToInternalizationConstructionRatio',
                'conceptToInternalizationConstructionRatio',
                'sceneToThinkingPracticeRatio',
            ];
            // 学生学习风格图表列
            let studentChartArray = [
                'dynamicStyleRatio',
                'perceptualStyleRatio',
                'realisticStyleRatio',
                'philosophicalStyleRatio',
            ];
            let showColumnsArray = [];
            let hiddenColumnsArray = [];
            // 学校 || 教师 || 课程 需要显示搜索框
            if (val == 2 || val == 5 || val == 6) {
                if (val == 2) {
                    showColumnsArray = ['regionPath', 'teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '学校名称';
                } else if (val == 5) {
                    showColumnsArray = ['schoolName', 'regionPath', 'subjectName', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'teacherName',
                        'teacherCount',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '教师名称';
                } else if (val == 6) {
                    showColumnsArray = [
                        'teacherName',
                        'schoolName',
                        'regionPath',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    hiddenColumnsArray = ['teacherCount', 'aiClassCount'];
                    this.columns[0].label = '课程名称';
                }
            } else {
                if (val == 1) {
                    showColumnsArray = ['teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'regionPath',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '区/县名称';
                } else if (val == 3) {
                    showColumnsArray = ['teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'regionPath',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '学科名称';
                } else if (val == 4) {
                    showColumnsArray = ['teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'regionPath',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '年级名称';
                }
            }
            if (this.chartName == '教师教学风格') {
                this.columns = this.$comjs.setColumns(this.columns, showColumnsArray.concat(teacherChartArray), true);
                this.columns = this.$comjs.setColumns(
                    this.columns,
                    hiddenColumnsArray.concat(studentChartArray),
                    false
                );
            } else {
                this.columns = this.$comjs.setColumns(this.columns, showColumnsArray.concat(studentChartArray), true);
                this.columns = this.$comjs.setColumns(
                    this.columns,
                    hiddenColumnsArray.concat(teacherChartArray),
                    false
                );
            }
            // 根据层级判断列的显示隐藏，例如如果在区县层级或者该角色最高只到区县打开弹窗，进入‘按学校统计’，那么就不用显示区县列
            this.columns = this.$comjs.setColumnsOperate(this.initialValue, this);
        },
        clickRowLine(row, prop) {
            let msg = this.$comjs.clickRowLine(row, prop, this);
            if (msg) {
                this.$emit('pageChange', msg);
                // 课程跳转，弹窗不关闭
                this.$comjs.closeDlg(this);
            }
        },
        changeChart(chartName) {
            this.chartName = chartName == 'left' ? '教师教学风格' : '学生学习风格';
            this.$comjs.staticSelectChange(this.selectValue, this);
            this.$emit('changeChart', this.chartName);
        },
        updateView(options1, options2) {
            this.$refs.detailCount.updateView(options1, options2);
        },
        closeDlg() {
            this.$comjs.closeDlg(this);
        },
        selectChange(val, isFirstEnter) {
            this.$comjs.staticSelectChange(val, this, isFirstEnter);
        },
        changeInput(val) {
            this.$comjs.staticInputChange(val, this);
        },
    },
};
</script>

<style lang="scss"></style>
